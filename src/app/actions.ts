"use server";

import { redirect } from "next/navigation";
import { randomInt } from "node:crypto";
import { get, run, tx } from "@/lib/db";
import type { Listing } from "@/lib/data";
import { slotLabel, vnd } from "@/lib/format";
import { notify } from "@/lib/notify";
import { PLANS, isPlan, priceFor, pricingState } from "@/lib/pricing";
import { site } from "@/lib/site";
import { isBot, isEmail, normalizePhone, rateLimited, str, utmFrom, type FormState } from "@/lib/validate";

const TOO_MANY: FormState = { message: "Bạn gửi hơi nhiều lần. Vui lòng thử lại sau ít phút hoặc gọi trực tiếp." };

function contactErrors(fd: FormData) {
  const errors: Record<string, string> = {};
  const name = str(fd, "name", 80);
  const phone = normalizePhone(str(fd, "phone", 20));
  const email = str(fd, "email", 120);
  if (name.length < 2) errors.name = "Vui lòng nhập họ tên.";
  if (!phone) errors.phone = "Số điện thoại chưa đúng, ví dụ 0906 968 377.";
  if (email && !isEmail(email)) errors.email = "Email chưa đúng định dạng.";
  return { errors, name, phone: phone ?? "", email };
}

const echo = (fd: FormData, keys: string[]) => Object.fromEntries(keys.map((k) => [k, str(fd, k)]));

/** Form hỏi căn trên trang chi tiết bất động sản. */
export async function inquireListing(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("lead")) return TOO_MANY;
  const { errors, name, phone, email } = contactErrors(fd);
  const message = str(fd, "message", 1500);
  if (Object.keys(errors).length) return { errors, data: echo(fd, ["name", "phone", "email", "message"]) };

  const listingId = Number(str(fd, "listing_id")) || null;
  const listing = listingId ? get<Listing>("SELECT * FROM listings WHERE id = ?", listingId) : undefined;
  run(
    "INSERT INTO leads (kind, listing_id, name, phone, email, message, utm) VALUES ('listing', ?, ?, ?, ?, ?, ?)",
    listing?.id ?? null,
    name,
    phone,
    email,
    message,
    utmFrom(fd),
  );
  await notify("Khách hỏi căn", {
    Căn: listing ? `${listing.title} (${listing.price_label})` : "Không rõ",
    Tên: name,
    SĐT: phone,
    Email: email,
    "Lời nhắn": message,
    Link: listing ? `${site.url}/bat-dong-san/${listing.slug}` : undefined,
  });
  return { ok: true, message: "Đã nhận. Anh Đường hoặc trợ lý sẽ gọi lại trong giờ làm việc." };
}

/** Đặt lịch tư vấn: giữ slot trong một giao dịch để hai người không đặt trùng. */
export async function bookSlot(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("booking", 4)) return TOO_MANY;
  const { errors, name, phone, email } = contactErrors(fd);
  const purpose = str(fd, "purpose", 40);
  const note = str(fd, "note", 1500);
  const slotId = Number(str(fd, "slot_id"));
  if (!["mua", "ban", "thue", "hoc", "khac"].includes(purpose)) errors.purpose = "Chọn mục đích buổi trao đổi.";
  if (!slotId) errors.slot_id = "Chọn một khung giờ.";
  const data = echo(fd, ["name", "phone", "email", "note", "purpose", "slot_id"]);
  if (Object.keys(errors).length) return { errors, data };

  const result = tx(() => {
    const slot = get<{ id: number; starts_at: string; booking_id: number | null }>(
      "SELECT id, starts_at, booking_id FROM slots WHERE id = ?",
      slotId,
    );
    if (!slot || slot.booking_id) return null;
    const b = run(
      "INSERT INTO bookings (slot_id, purpose, name, phone, email, note) VALUES (?, ?, ?, ?, ?, ?)",
      slot.id,
      purpose,
      name,
      phone,
      email,
      note,
    );
    run("UPDATE slots SET booking_id = ? WHERE id = ?", Number(b.lastInsertRowid), slot.id);
    return slot;
  });
  if (!result) {
    return { errors: { slot_id: "Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác." }, data: { ...data, slot_id: "" } };
  }
  const when = slotLabel(result.starts_at);
  const labels: Record<string, string> = { mua: "Mua", ban: "Bán / ký gửi", thue: "Thuê / cho thuê", hoc: "Học viện", khac: "Khác" };
  await notify("Lịch tư vấn mới", {
    Giờ: `${when.time} ${when.day}`,
    "Mục đích": labels[purpose],
    Tên: name,
    SĐT: phone,
    Email: email,
    "Ghi chú": note,
  });
  return { ok: true, message: `Đã giữ lịch ${when.time}, ${when.day}. Anh Đường sẽ gọi Zalo xác nhận trước buổi hẹn.` };
}

function orderCode(): string {
  // HD + 6 ký tự dễ đọc (bỏ 0/O/1/I), đủ ngắn để ghi trong nội dung chuyển khoản.
  const abc = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 6; i++) s += abc[randomInt(abc.length)];
  return `HD${s}`;
}

/** Tạo đơn khóa học rồi chuyển sang trang thanh toán VietQR. */
export async function createOrder(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("order", 6)) return TOO_MANY;
  const { errors, name, phone, email } = contactErrors(fd);
  const plan = str(fd, "plan", 10);
  const segment = str(fd, "segment", 60);
  const note = str(fd, "note", 500);
  if (!isPlan(plan)) errors.plan = "Chọn gói học.";
  if (!email) errors.email = "Nhập email để nhận xác nhận và tài liệu.";
  if (str(fd, "agree") !== "on") errors.agree = "Vui lòng đồng ý để đội ngũ liên hệ.";
  const data = echo(fd, ["name", "phone", "email", "plan", "segment", "note"]);
  if (Object.keys(errors).length || !isPlan(plan)) return { errors, data };

  const { current } = pricingState();
  if (!current) return { message: "Khóa học chưa mở đăng ký. Vui lòng để lại số điện thoại ở trang Học viện.", data };
  const amount = priceFor(current, plan);

  let code = orderCode();
  for (let i = 0; i < 5 && get("SELECT 1 FROM orders WHERE code = ?", code); i++) code = orderCode();
  run(
    "INSERT INTO orders (code, plan, wave, amount, name, phone, email, segment, note, utm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    code,
    plan,
    current.name,
    amount,
    name,
    phone,
    email,
    segment,
    note,
    utmFrom(fd),
  );
  await notify("Đơn khóa học mới (chờ chuyển khoản)", {
    Mã: code,
    Gói: PLANS[plan].name,
    "Số tiền": vnd(amount),
    Đợt: current.name,
    Tên: name,
    SĐT: phone,
    Email: email,
  });
  redirect(`/hoc-vien/thanh-toan/${code}`);
}
