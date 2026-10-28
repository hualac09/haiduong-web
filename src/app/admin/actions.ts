"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, verifyPassword } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { slugify } from "@/lib/format";
import { notify } from "@/lib/notify";
import { rateLimited, str, type FormState } from "@/lib/validate";

// ---------- Đăng nhập ----------

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  if (await rateLimited("login", 8, 15 * 60_000)) return { message: "Thử quá nhiều lần. Đợi 15 phút." };
  const email = str(fd, "email", 120).toLowerCase();
  const password = String(fd.get("password") ?? "");
  const okEmail = email === (process.env.ADMIN_EMAIL ?? "").toLowerCase();
  const okPass = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? "");
  if (!okEmail || !okPass) return { message: "Email hoặc mật khẩu không đúng.", data: { email } };
  await createSession(process.env.ADMIN_EMAIL!);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/dang-nhap");
}

// ---------- Bất động sản ----------

const num = (fd: FormData, k: string) => {
  const v = str(fd, k).replace(",", ".");
  return v === "" || Number.isNaN(Number(v)) ? null : Number(v);
};

function uniqueSlug(table: "listings" | "posts", wanted: string, id?: number) {
  const base = slugify(wanted) || "muc-moi";
  let s = base;
  for (let i = 2; get(`SELECT 1 FROM ${table} WHERE slug = ? AND id <> ?`, s, id ?? 0); i++) s = `${base}-${i}`;
  return s;
}

export async function saveListing(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || undefined;
  const title = str(fd, "title", 160);
  if (title.length < 3) return { errors: { title: "Nhập tên căn." } };
  const youtube = str(fd, "youtube_id", 200);
  const ytId = youtube.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)?.[1] ?? (/^[A-Za-z0-9_-]{11}$/.test(youtube) ? youtube : "");
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(str(fd, "gallery", 20000) || "[]");
  } catch {}
  const values = [
    uniqueSlug("listings", str(fd, "slug", 120) || title, id),
    title,
    str(fd, "project", 120),
    str(fd, "district", 80),
    str(fd, "kind", 30),
    str(fd, "status", 30),
    str(fd, "price_label", 40),
    num(fd, "price_billion"),
    num(fd, "area_m2"),
    num(fd, "bedrooms"),
    str(fd, "summary", 600),
    str(fd, "body", 20000),
    str(fd, "cover", 500),
    JSON.stringify(gallery.filter((x) => typeof x === "string").slice(0, 40)),
    ytId,
    str(fd, "featured") === "on" ? 1 : 0,
    str(fd, "published") === "on" ? 1 : 0,
    num(fd, "sort") ?? 0,
  ] as const;
  if (id) {
    run(
      `UPDATE listings SET slug=?, title=?, project=?, district=?, kind=?, status=?, price_label=?, price_billion=?, area_m2=?, bedrooms=?,
       summary=?, body=?, cover=?, gallery=?, youtube_id=?, featured=?, published=?, sort=?, updated_at=datetime('now') WHERE id=?`,
      ...values,
      id,
    );
  } else {
    run(
      `INSERT INTO listings (slug, title, project, district, kind, status, price_label, price_billion, area_m2, bedrooms,
       summary, body, cover, gallery, youtube_id, featured, published, sort) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      ...values,
    );
  }
  revalidatePath("/", "layout");
  redirect("/admin/bat-dong-san?da-luu=1");
}

export async function deleteListing(fd: FormData) {
  await requireAdmin();
  run("DELETE FROM listings WHERE id = ?", Number(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/bat-dong-san");
}

// ---------- Bài viết ----------

export async function savePost(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || undefined;
  const title = str(fd, "title", 200);
  if (title.length < 3) return { errors: { title: "Nhập tiêu đề." } };
  const published = str(fd, "published") === "on" ? 1 : 0;
  // Form nhập giờ Việt Nam (datetime-local); DB lưu UTC dạng "YYYY-MM-DD HH:MM:SS".
  const when = str(fd, "published_at", 16);
  const existing = id ? get<{ published_at: string | null }>("SELECT published_at FROM posts WHERE id = ?", id)?.published_at : null;
  const nowUtc = new Date().toISOString().slice(0, 19).replace("T", " ");
  const publishedAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(when)
    ? new Date(`${when}:00+07:00`).toISOString().slice(0, 19).replace("T", " ")
    : (existing ?? (published ? nowUtc : null));
  const values = [
    uniqueSlug("posts", str(fd, "slug", 140) || title, id),
    title,
    str(fd, "excerpt", 400),
    str(fd, "body", 60000),
    str(fd, "cover", 500),
    str(fd, "topic", 40) || "Thị trường",
    published,
    publishedAt,
  ] as const;
  if (id) {
    run(
      "UPDATE posts SET slug=?, title=?, excerpt=?, body=?, cover=?, topic=?, published=?, published_at=?, updated_at=datetime('now') WHERE id=?",
      ...values,
      id,
    );
  } else {
    run("INSERT INTO posts (slug, title, excerpt, body, cover, topic, published, published_at) VALUES (?,?,?,?,?,?,?,?)", ...values);
  }
  revalidatePath("/", "layout");
  redirect("/admin/bai-viet?da-luu=1");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  run("DELETE FROM posts WHERE id = ?", Number(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/bai-viet");
}

// ---------- Học phí ----------

export async function saveWave(fd: FormData) {
  await requireAdmin();
  const id = Number(str(fd, "id")) || undefined;
  const money = (k: string) => Math.max(0, Math.round(Number(str(fd, k).replace(/\D/g, "")) || 0));
  const values = [
    str(fd, "name", 80) || "Đợt mới",
    str(fd, "starts_on", 10),
    str(fd, "ends_on", 10) || null,
    money("price_k1"),
    money("price_k2"),
    money("price_combo"),
    num(fd, "slots"),
  ] as const;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values[1])) return;
  if (id) run("UPDATE waves SET name=?, starts_on=?, ends_on=?, price_k1=?, price_k2=?, price_combo=?, slots=? WHERE id=?", ...values, id);
  else run("INSERT INTO waves (name, starts_on, ends_on, price_k1, price_k2, price_combo, slots) VALUES (?,?,?,?,?,?,?)", ...values);
  revalidatePath("/", "layout");
}

export async function deleteWave(fd: FormData) {
  await requireAdmin();
  run("DELETE FROM waves WHERE id = ?", Number(fd.get("id")));
  revalidatePath("/", "layout");
}

// ---------- Đơn hàng, khách, lịch ----------

export async function markOrder(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = str(fd, "status", 20);
  if (!["pending", "paid", "cancelled", "refunded"].includes(status)) return;
  if (status === "paid") {
    run("UPDATE orders SET status='paid', paid_amount=MAX(paid_amount, amount), paid_at=COALESCE(paid_at, datetime('now')) WHERE id=?", id);
    const o = get<{ code: string; name: string }>("SELECT code, name FROM orders WHERE id = ?", id);
    if (o) await notify("Đơn được xác nhận tay", { Mã: o.code, Tên: o.name });
  } else {
    run("UPDATE orders SET status=? WHERE id=?", status, id);
  }
  revalidatePath("/admin", "layout");
}

export async function setLeadStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status", 20);
  if (!["new", "contacted", "won", "lost"].includes(status)) return;
  run(`UPDATE ${str(fd, "table") === "bookings" ? "bookings" : "leads"} SET status=? WHERE id=?`, status, Number(fd.get("id")));
  revalidatePath("/admin", "layout");
}

export async function cancelBooking(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  run("UPDATE bookings SET status='cancelled' WHERE id=?", id);
  run("UPDATE slots SET booking_id=NULL WHERE booking_id=?", id);
  revalidatePath("/admin", "layout");
}

/** Tạo hàng loạt khung giờ: các ngày trong tuần đã chọn, trong khoảng ngày, theo danh sách giờ. */
export async function generateSlots(fd: FormData) {
  await requireAdmin();
  const from = str(fd, "from", 10);
  const to = str(fd, "to", 10);
  const days = fd.getAll("weekday").map(Number);
  const times = str(fd, "times", 200)
    .split(/[,\s]+/)
    .filter((t) => /^\d{1,2}:\d{2}$/.test(t))
    .map((t) => t.padStart(5, "0"));
  const minutes = Number(str(fd, "minutes")) || 45;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || !times.length || !days.length) return;
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  for (let d = start, n = 0; d <= end && n < 120; d = new Date(d.getTime() + 86400_000), n++) {
    if (!days.includes(d.getUTCDay())) continue;
    const day = d.toISOString().slice(0, 10);
    for (const t of times) run("INSERT OR IGNORE INTO slots (starts_at, minutes) VALUES (?, ?)", `${day} ${t}`, minutes);
  }
  revalidatePath("/admin", "layout");
}

export async function deleteSlot(fd: FormData) {
  await requireAdmin();
  run("DELETE FROM slots WHERE id = ? AND booking_id IS NULL", Number(fd.get("id")));
  revalidatePath("/admin", "layout");
}
