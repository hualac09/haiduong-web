import Link from "next/link";
import { markOrder } from "@/app/admin/actions";
import { AdminTitle, Badge, Table, smallBtn } from "@/components/admin/ui";
import { all } from "@/lib/db";
import type { Order } from "@/lib/data";
import { dateVN, vnd } from "@/lib/format";
import { PLANS, isPlan } from "@/lib/pricing";

const FILTERS = [
  ["", "Tất cả"],
  ["pending", "Chờ chuyển khoản"],
  ["paid", "Đã thanh toán"],
  ["cancelled", "Đã hủy"],
] as const;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ "trang-thai"?: string }> }) {
  const f = (await searchParams)["trang-thai"] ?? "";
  const where = f === "pending" ? "WHERE status IN ('pending','partial')" : f ? "WHERE status = ?" : "";
  const orders = all<Order>(`SELECT * FROM orders ${where} ORDER BY id DESC LIMIT 500`, ...(f && f !== "pending" ? [f] : []));

  return (
    <>
      <AdminTitle
        title="Đơn khóa học"
        action={
          <a href="/api/admin/export?bang=orders" className="btn btn-ink !min-h-[40px] !text-xs">
            Xuất CSV
          </a>
        }
      >
        Đơn chuyển sang “Đã thanh toán” tự động khi SePay báo tiền vào đúng mã. Xác nhận tay khi khách chuyển sai nội dung.
      </AdminTitle>
      <nav className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(([v, l]) => (
          <Link
            key={v}
            href={v ? `/admin/don-hang?trang-thai=${v}` : "/admin/don-hang"}
            className={`rounded-full px-4 py-2 text-sm ${f === v ? "bg-ink text-white" : "bg-paper"}`}
          >
            {l}
          </Link>
        ))}
      </nav>
      <Table head={["Mã", "Học viên", "Gói", "Số tiền", "Trạng thái", "Tạo lúc", ""]} empty={orders.length === 0}>
        {orders.map((o) => (
          <tr key={o.id}>
            <td className="font-medium">{o.code}</td>
            <td>
              {o.name}
              <span className="block text-muted">
                <a href={`tel:${o.phone}`} className="underline">
                  {o.phone}
                </a>{" "}
                · {o.email}
              </span>
              {o.note && <span className="block text-muted italic">{o.note}</span>}
            </td>
            <td>
              {isPlan(o.plan) ? PLANS[o.plan].short : o.plan}
              <span className="block text-muted">{o.wave}</span>
            </td>
            <td>
              {vnd(o.amount)}
              {o.paid_amount > 0 && o.paid_amount !== o.amount && <span className="block text-muted">Đã nhận {vnd(o.paid_amount)}</span>}
            </td>
            <td>
              <Badge status={o.status} />
            </td>
            <td className="text-muted">{dateVN(o.created_at, true)}</td>
            <td>
              <div className="flex flex-wrap gap-1.5">
                {o.status !== "paid" && (
                  <form action={markOrder}>
                    <input type="hidden" name="id" value={o.id} />
                    <button name="status" value="paid" className={smallBtn}>
                      Xác nhận đã trả
                    </button>
                  </form>
                )}
                {o.status === "pending" && (
                  <form action={markOrder}>
                    <input type="hidden" name="id" value={o.id} />
                    <button name="status" value="cancelled" className={smallBtn}>
                      Hủy
                    </button>
                  </form>
                )}
                {o.status === "paid" && (
                  <form action={markOrder}>
                    <input type="hidden" name="id" value={o.id} />
                    <button name="status" value="refunded" className={smallBtn}>
                      Đánh dấu đã hoàn
                    </button>
                  </form>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
