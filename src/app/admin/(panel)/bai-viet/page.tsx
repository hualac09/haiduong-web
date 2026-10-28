import Link from "next/link";
import { AdminTitle, Table } from "@/components/admin/ui";
import { all } from "@/lib/db";
import type { Post } from "@/lib/data";
import { dateVN } from "@/lib/format";

export default async function AdminPosts({ searchParams }: { searchParams: Promise<{ "da-luu"?: string }> }) {
  const saved = (await searchParams)["da-luu"];
  const posts = all<Post>("SELECT * FROM posts ORDER BY COALESCE(published_at, created_at) DESC");
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  return (
    <>
      <AdminTitle
        title="Bài viết"
        action={
          <Link href="/admin/bai-viet/moi" className="btn btn-gold !min-h-[40px] !text-xs">
            Viết bài
          </Link>
        }
      />
      {saved && (
        <p role="status" className="mb-4 bg-ok/10 p-3 text-sm text-ok">
          Đã lưu.
        </p>
      )}
      <Table head={["Tiêu đề", "Chủ đề", "Trạng thái", "Ngày đăng"]} empty={posts.length === 0}>
        {posts.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/admin/bai-viet/${p.id}`} className="font-medium hover:underline">
                {p.title}
              </Link>
            </td>
            <td>{p.topic}</td>
            <td>
              {!p.published ? (
                <span className="text-muted">Nháp</span>
              ) : p.published_at && p.published_at > now ? (
                <span className="text-gold-deep">Hẹn giờ</span>
              ) : (
                "Đã đăng"
              )}
            </td>
            <td className="text-muted">{dateVN(p.published_at, true)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
