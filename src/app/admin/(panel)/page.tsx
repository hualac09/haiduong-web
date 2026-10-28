import Link from "next/link";
import { AdminTitle, Badge, Card } from "@/components/admin/ui";
import { all, get } from "@/lib/db";
import type { Order } from "@/lib/data";
import { dateVN, slotLabel, vnd } from "@/lib/format";
import { pricingState } from "@/lib/pricing";

export default function Dashboard() {
  const n = (sql: string) => get<{ n: number }>(sql)?.n ?? 0;
  const revenue = n("SELECT COALESCE(SUM(paid_amount),0) AS n FROM orders WHERE status IN ('paid','partial')");
  const stats = [
    { label: "Học phí đã nhận", value: vnd(revenue), href: "/admin/don-hang?trang-thai=paid" },
    { label: "Đơn chờ chuyển khoản", value: n("SELECT COUNT(*) AS n FROM orders WHERE status IN ('pending','partial')"), href: "/admin/don-hang?trang-thai=pending" },
    { label: "Lịch hẹn sắp tới", value: n("SELECT COUNT(*) AS n FROM bookings b JOIN slots s ON s.id=b.slot_id WHERE b.status<>'cancelled' AND s.starts_at >= datetime('now','+7 hours')"), href: "/admin/lich-hen" },
    { label: "Khách hỏi căn chưa gọi", value: n("SELECT COUNT(*) AS n FROM leads WHERE status='new'"), href: "/admin/khach" },
  ];
  const { current, next } = pricingState();
  const orders = all<Order>("SELECT * FROM orders ORDER BY id DESC LIMIT 6");
  const bookings = all<{ id: number; name: string; phone: string; purpose: string; starts_at: string }>(
    "SELECT b.id, b.name, b.phone, b.purpose, s.starts_at FROM bookings b JOIN slots s ON s.id=b.slot_id WHERE b.status<>'cancelled' AND s.starts_at >= datetime('now','+7 hours') ORDER BY s.starts_at LIMIT 6",
  );

  return (
    <>
      <AdminTitle title="Tổng quan">
        {current ? `Đang bán ${current.name}` : next ? `Chưa mở bán · ${next.name} bắt đầu ${next.starts_on}` : "Chưa có đợt học phí"}
      </AdminTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="block bg-paper p-6 hover:outline hover:outline-ink/20">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-3 text-3xl font-extralight">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light">Đơn mới nhất</h2>
            <Link href="/admin/don-hang" className="text-sm underline">
              Tất cả
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {orders.length === 0 && <li className="py-6 text-muted">Chưa có đơn.</li>}
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  <strong className="font-medium">{o.code}</strong> · {o.name}
                  <span className="block text-muted">{dateVN(o.created_at, true)} · {vnd(o.amount)}</span>
                </span>
                <Badge status={o.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light">Lịch hẹn sắp tới</h2>
            <Link href="/admin/lich-hen" className="text-sm underline">
              Quản lý lịch
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {bookings.length === 0 && <li className="py-6 text-muted">Chưa có lịch hẹn.</li>}
            {bookings.map((b) => {
              const s = slotLabel(b.starts_at);
              return (
                <li key={b.id} className="py-3 text-sm">
                  <strong className="font-medium">
                    {s.time} {s.day}
                  </strong>{" "}
                  · {b.name} ·{" "}
                  <a href={`tel:${b.phone}`} className="underline">
                    {b.phone}
                  </a>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
