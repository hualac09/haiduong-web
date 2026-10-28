import Link from "next/link";
import { setLeadStatus } from "@/app/admin/actions";
import { AdminTitle, Badge, Table, smallBtn } from "@/components/admin/ui";
import { all } from "@/lib/db";
import { dateVN } from "@/lib/format";

export default function LeadsPage() {
  const leads = all<{
    id: number;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
    utm: string;
    title: string | null;
    slug: string | null;
  }>(
    `SELECT l.*, li.title, li.slug FROM leads l LEFT JOIN listings li ON li.id = l.listing_id ORDER BY l.id DESC LIMIT 500`,
  );
  return (
    <>
      <AdminTitle
        title="Khách hỏi căn"
        action={
          <a href="/api/admin/export?bang=leads" className="btn btn-ink !min-h-[40px] !text-xs">
            Xuất CSV
          </a>
        }
      />
      <Table head={["Lúc", "Khách", "Căn", "Lời nhắn", "Nguồn", "Trạng thái", ""]} empty={leads.length === 0}>
        {leads.map((l) => {
          const utm = (() => {
            try {
              return Object.values(JSON.parse(l.utm) as Record<string, string>).join(" · ");
            } catch {
              return "";
            }
          })();
          return (
            <tr key={l.id}>
              <td className="whitespace-nowrap text-muted">{dateVN(l.created_at, true)}</td>
              <td>
                {l.name}
                <span className="block text-muted">
                  <a href={`tel:${l.phone}`} className="underline">
                    {l.phone}
                  </a>{" "}
                  {l.email}
                </span>
              </td>
              <td>
                {l.slug ? (
                  <Link href={`/bat-dong-san/${l.slug}`} target="_blank" className="underline">
                    {l.title}
                  </Link>
                ) : (
                  "-"
                )}
              </td>
              <td className="max-w-xs text-muted">{l.message}</td>
              <td className="text-muted">{utm}</td>
              <td>
                <Badge status={l.status} />
              </td>
              <td>
                <form action={setLeadStatus} className="flex flex-wrap gap-1.5">
                  <input type="hidden" name="table" value="leads" />
                  <input type="hidden" name="id" value={l.id} />
                  {l.status !== "contacted" && (
                    <button name="status" value="contacted" className={smallBtn}>
                      Đã gọi
                    </button>
                  )}
                  {l.status !== "won" && (
                    <button name="status" value="won" className={smallBtn}>
                      Thành công
                    </button>
                  )}
                  {l.status !== "lost" && (
                    <button name="status" value="lost" className={smallBtn}>
                      Dừng
                    </button>
                  )}
                </form>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
