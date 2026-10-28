import Link from "next/link";
import { notFound } from "next/navigation";
import ListingEditor from "@/components/admin/ListingEditor";
import { AdminTitle } from "@/components/admin/ui";
import { get } from "@/lib/db";
import type { Listing } from "@/lib/data";

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = id === "moi" ? undefined : get<Listing>("SELECT * FROM listings WHERE id = ?", Number(id));
  if (id !== "moi" && !l) notFound();
  return (
    <>
      <p className="mb-2 text-sm">
        <Link href="/admin/bat-dong-san" className="underline">
          ← Bất động sản
        </Link>
      </p>
      <AdminTitle title={l ? l.title : "Thêm căn"} />
      <ListingEditor l={l} />
    </>
  );
}
