import { timingSafeEqual } from "node:crypto";
import { get, run, tx } from "@/lib/db";
import type { Order } from "@/lib/data";
import { vnd } from "@/lib/format";
import { notify } from "@/lib/notify";
import { PLANS, isPlan } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// Payload SePay gửi khi tài khoản có biến động (https://docs.sepay.vn/tich-hop-webhooks.html).
type SepayEvent = {
  id: number;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string;
  transferType?: "in" | "out";
  transferAmount?: number;
  referenceCode?: string;
};

function authorized(req: Request): boolean {
  const key = process.env.SEPAY_API_KEY;
  if (!key) return false;
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Apikey ${key}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ success: false }, { status: 401 });

  let ev: SepayEvent;
  try {
    ev = (await req.json()) as SepayEvent;
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }
  if (!ev || typeof ev.id !== "number") return Response.json({ success: false }, { status: 400 });
  if (ev.transferType !== "in" || !ev.transferAmount) return Response.json({ success: true });

  const text = `${ev.code ?? ""} ${ev.content ?? ""}`.toUpperCase();
  const code = text.match(/HD[A-Z0-9]{6}/)?.[0] ?? null;
  const amount = Math.round(ev.transferAmount);

  // Ghi giao dịch và cộng tiền trong một giao dịch DB; id SePay là duy nhất nên gửi lại không bị cộng hai lần.
  const outcome = tx(() => {
    if (get("SELECT 1 FROM payments WHERE sepay_id = ?", ev.id)) return { dup: true as const };
    run(
      "INSERT INTO payments (sepay_id, order_code, amount, content, raw) VALUES (?, ?, ?, ?, ?)",
      ev.id,
      code,
      amount,
      ev.content ?? "",
      JSON.stringify(ev).slice(0, 4000),
    );
    if (!code) return { order: undefined };
    const o = get<Order>("SELECT * FROM orders WHERE code = ?", code);
    if (!o) return { order: undefined };
    const paid = o.paid_amount + amount;
    const status = paid >= o.amount ? "paid" : "partial";
    run(
      "UPDATE orders SET paid_amount = ?, status = ?, paid_at = CASE WHEN ? = 'paid' THEN datetime('now') ELSE paid_at END, sepay_ref = ? WHERE id = ?",
      paid,
      status,
      status,
      ev.referenceCode ?? String(ev.id),
      o.id,
    );
    return { order: { ...o, paid_amount: paid, status } };
  });

  if ("dup" in outcome) return Response.json({ success: true });

  const o = outcome.order;
  if (o) {
    await notify(o.status === "paid" ? "Học viên đã thanh toán" : "Nhận thanh toán một phần", {
      Mã: o.code,
      Gói: isPlan(o.plan) ? PLANS[o.plan].name : o.plan,
      "Đã nhận": `${vnd(o.paid_amount)} / ${vnd(o.amount)}`,
      Tên: o.name,
      SĐT: o.phone,
      Email: o.email,
      "Việc cần làm": o.status === "paid" ? "Thêm vào nhóm Zalo của khóa" : "Liên hệ nhắc chuyển nốt",
    });
  } else if (/HD\s?[A-Z0-9]{4,}/.test(text)) {
    // Chỉ báo khi nội dung trông như mã đơn (gõ sai, thiếu ký tự); tiền vào khác của tài khoản thì bỏ qua.
    await notify("Tiền vào không khớp đơn nào", {
      "Số tiền": vnd(amount),
      "Nội dung": ev.content,
      "Ngân hàng": ev.gateway,
      "Mã GD": ev.referenceCode,
    });
  }
  return Response.json({ success: true });
}
