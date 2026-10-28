import Link from "next/link";
import { AdminTitle, Table } from "@/components/admin/ui";
import { all } from "@/lib/db";
import { listingCover, type Listing } from "@/lib/data";
import { KINDS, STATUSES } from "@/lib/site";

export default async function AdminListings({ searchParams }: { searchParams: Promise<{ "da-luu"?: string }> }) {
  const saved = (await searchParams)["da-luu"];
  const items = all<Listing>("SELECT * FROM listings ORDER BY sort ASC, id DESC");
  return (
    <>
      <AdminTitle
        title="Bất động sản"
        action={
          <Link href="/admin/bat-dong-san/moi" className="btn btn-gold !min-h-[40px] !text-xs">
            Thêm căn
          </Link>
        }
      >
        Số “Thứ tự” nhỏ hiện trước. Bật “Nổi bật” để căn xuất hiện trên trang chủ.
      </AdminTitle>
      {saved && (
        <p role="status" className="mb-4 bg-ok/10 p-3 text-sm text-ok">
          Đã lưu.
        </p>
      )}
      <Table head={["", "Căn", "Loại · Khu", "Giá", "Tình trạng", "Hiển thị", "Thứ tự"]} empty={items.length === 0}>
        {items.map((l) => {
          const cover = listingCover(l);
          return (
            <tr key={l.id}>
              <td className="w-24">
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="aspect-[4/3] w-20 object-cover" />
                )}
              </td>
              <td>
                <Link href={`/admin/bat-dong-san/${l.id}`} className="font-medium underline-offset-4 hover:underline">
                  {l.title}
                </Link>
                <span className="block text-muted">{l.project}</span>
              </td>
              <td>
                {KINDS[l.kind] ?? l.kind}
                <span className="block text-muted">{l.district}</span>
              </td>
              <td className="whitespace-nowrap">{l.price_label}</td>
              <td>{STATUSES[l.status] ?? l.status}</td>
              <td>
                {l.published ? "Công khai" : <span className="text-muted">Ẩn</span>}
                {l.featured ? <span className="block text-gold-deep">Nổi bật</span> : null}
              </td>
              <td>{l.sort}</td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
