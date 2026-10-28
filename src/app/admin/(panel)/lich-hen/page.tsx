import { cancelBooking, deleteSlot, generateSlots, setLeadStatus } from "@/app/admin/actions";
import { AdminTitle, Badge, Card, Table, smallBtn } from "@/components/admin/ui";
import { all } from "@/lib/db";
import { slotLabel } from "@/lib/format";
import { todayVN } from "@/lib/pricing";

const PURPOSE: Record<string, string> = { mua: "Mua", ban: "Bán / ký gửi", thue: "Thuê", hoc: "Học viện", khac: "Khác" };
const WEEKDAYS = [
  [1, "T2"],
  [2, "T3"],
  [3, "T4"],
  [4, "T5"],
  [5, "T6"],
  [6, "T7"],
  [0, "CN"],
] as const;

export default function BookingsPage() {
  const bookings = all<{ id: number; name: string; phone: string; email: string; note: string; purpose: string; status: string; starts_at: string }>(
    `SELECT b.*, s.starts_at FROM bookings b JOIN slots s ON s.id = b.slot_id
     WHERE s.starts_at >= datetime('now', '+7 hours', '-1 day') ORDER BY s.starts_at LIMIT 200`,
  );
  const open = all<{ id: number; starts_at: string }>(
    "SELECT id, starts_at FROM slots WHERE booking_id IS NULL AND starts_at >= datetime('now','+7 hours') ORDER BY starts_at LIMIT 200",
  );
  const today = todayVN();
  const in3w = new Date(Date.now() + 21 * 86400_000).toISOString().slice(0, 10);

  return (
    <>
      <AdminTitle title="Lịch hẹn">Giờ hiển thị là giờ Việt Nam.</AdminTitle>
      <Table head={["Thời gian", "Khách", "Mục đích", "Ghi chú", "Trạng thái", ""]} empty={bookings.length === 0}>
        {bookings.map((b) => {
          const s = slotLabel(b.starts_at);
          return (
            <tr key={b.id} className={b.status === "cancelled" ? "opacity-50" : ""}>
              <td className="font-medium whitespace-nowrap">
                {s.time}
                <span className="block font-normal text-muted">{s.day}</span>
              </td>
              <td>
                {b.name}
                <span className="block text-muted">
                  <a href={`tel:${b.phone}`} className="underline">
                    {b.phone}
                  </a>{" "}
                  {b.email}
                </span>
              </td>
              <td>{PURPOSE[b.purpose] ?? b.purpose}</td>
              <td className="max-w-xs text-muted">{b.note}</td>
              <td>
                <Badge status={b.status} />
              </td>
              <td>
                {b.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-1.5">
                    {b.status === "new" && (
                      <form action={setLeadStatus}>
                        <input type="hidden" name="table" value="bookings" />
                        <input type="hidden" name="id" value={b.id} />
                        <button name="status" value="contacted" className={smallBtn}>
                          Đã xác nhận
                        </button>
                      </form>
                    )}
                    <form action={cancelBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className={smallBtn}>Hủy, mở lại giờ</button>
                    </form>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </Table>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-light">Mở thêm khung giờ</h2>
          <form action={generateSlots} className="mt-5 grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="field">
                <span>Từ ngày</span>
                <input type="date" name="from" defaultValue={today} className="input" required />
              </label>
              <label className="field">
                <span>Đến ngày</span>
                <input type="date" name="to" defaultValue={in3w} className="input" required />
              </label>
            </div>
            <fieldset>
              <legend className="mb-2 text-xs font-medium tracking-wider uppercase">Các thứ trong tuần</legend>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map(([v, l]) => (
                  <label key={v} className="flex items-center gap-1.5 rounded border border-line px-3 py-2 text-sm">
                    <input type="checkbox" name="weekday" value={v} defaultChecked={[2, 4, 6].includes(v)} /> {l}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <label className="field">
                <span>Giờ bắt đầu (cách nhau dấu phẩy)</span>
                <input name="times" defaultValue="10:00, 14:00, 16:00" className="input" required />
              </label>
              <label className="field">
                <span>Phút</span>
                <input name="minutes" type="number" min={15} max={180} defaultValue={45} className="input" />
              </label>
            </div>
            <div>
              <button className="btn btn-ink !min-h-[40px] !text-xs">Tạo khung giờ</button>
            </div>
          </form>
        </Card>
        <Card>
          <h2 className="text-lg font-light">Khung giờ còn trống ({open.length})</h2>
          <ul className="mt-5 flex max-h-[420px] flex-wrap gap-2 overflow-y-auto">
            {open.map((s) => {
              const l = slotLabel(s.starts_at);
              return (
                <li key={s.id}>
                  <form action={deleteSlot} className="flex items-center gap-1 rounded border border-line py-1 pr-1 pl-3 text-sm">
                    {l.day.split(", ")[1]} {l.time}
                    <input type="hidden" name="id" value={s.id} />
                    <button className="cursor-pointer px-2 text-muted hover:text-danger" aria-label={`Xóa khung ${l.time} ${l.day}`}>
                      ×
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
