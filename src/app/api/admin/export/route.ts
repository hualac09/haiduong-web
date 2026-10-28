import { currentAdmin } from "@/lib/auth";
import { all } from "@/lib/db";

const QUERIES = {
  orders:
    "SELECT code AS ma, created_at AS tao_luc_utc, name AS ho_ten, phone AS sdt, email, plan AS goi, wave AS dot, amount AS hoc_phi, paid_amount AS da_nhan, status AS trang_thai, segment AS phan_khuc, note AS ghi_chu, utm FROM orders ORDER BY id DESC",
  leads:
    "SELECT l.created_at AS tao_luc_utc, l.name AS ho_ten, l.phone AS sdt, l.email, li.title AS can, l.message AS loi_nhan, l.status AS trang_thai, l.utm FROM leads l LEFT JOIN listings li ON li.id = l.listing_id ORDER BY l.id DESC",
  bookings:
    "SELECT s.starts_at AS gio_vn, b.name AS ho_ten, b.phone AS sdt, b.email, b.purpose AS muc_dich, b.note AS ghi_chu, b.status AS trang_thai FROM bookings b JOIN slots s ON s.id = b.slot_id ORDER BY s.starts_at DESC",
} as const;

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // chặn công thức khi mở bằng Excel
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: Request) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const bang = new URL(req.url).searchParams.get("bang") as keyof typeof QUERIES;
  if (!(bang in QUERIES)) return new Response("Bad request", { status: 400 });
  const rows = all<Record<string, unknown>>(QUERIES[bang]);
  const head = rows[0] ? Object.keys(rows[0]) : [];
  const csv = "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => cell(r[h])).join(","))].join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${bang}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
