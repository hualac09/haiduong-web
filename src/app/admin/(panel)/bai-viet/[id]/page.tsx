import Link from "next/link";
import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { AdminTitle } from "@/components/admin/ui";
import { get } from "@/lib/db";
import type { Post } from "@/lib/data";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = id === "moi" ? undefined : get<Post>("SELECT * FROM posts WHERE id = ?", Number(id));
  if (id !== "moi" && !p) notFound();
  return (
    <>
      <p className="mb-2 text-sm">
        <Link href="/admin/bai-viet" className="underline">
          ← Bài viết
        </Link>
      </p>
      <AdminTitle title={p ? "Sửa bài" : "Viết bài mới"} />
      <PostEditor p={p} />
    </>
  );
}
