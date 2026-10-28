import { get } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Trạng thái đơn cho trang thanh toán. Chỉ trả trạng thái, không trả thông tin cá nhân. */
export async function GET(_: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!/^HD[A-Z0-9]{6}$/.test(code)) return Response.json({ error: "not_found" }, { status: 404 });
  const o = get<{ status: string }>("SELECT status FROM orders WHERE code = ?", code);
  if (!o) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ status: o.status }, { headers: { "cache-control": "no-store" } });
}
