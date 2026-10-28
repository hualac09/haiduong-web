import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard, PageHero } from "@/components/ui";
import { listingDistricts, publishedListings } from "@/lib/data";
import { KINDS } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bất động sản cao cấp",
  description:
    "Penthouse, biệt thự, duplex và căn hộ hạng sang tại Thủ Thiêm, Thảo Điền, Ba Son, Quận 1 do anh Hải Đường trực tiếp dẫn xem.",
  alternates: { canonical: "/bat-dong-san" },
};

type SP = Promise<{ loai?: string; khu?: string }>;

function chip(active: boolean) {
  return `inline-flex min-h-[40px] items-center rounded-full border px-4 text-[0.78rem] font-medium tracking-[0.12em] uppercase transition-colors ${
    active ? "border-ink bg-ink text-white" : "border-line text-text hover:border-ink"
  }`;
}

export default async function ListingsPage({ searchParams }: { searchParams: SP }) {
  const { loai, khu } = await searchParams;
  const kind = loai && loai in KINDS ? loai : undefined;
  const districts = listingDistricts();
  const district = khu && districts.includes(khu) ? khu : undefined;
  const items = publishedListings({ kind, district });

  const href = (k?: string, d?: string) => {
    const q = new URLSearchParams();
    if (k) q.set("loai", k);
    if (d) q.set("khu", d);
    const s = q.toString();
    return s ? `/bat-dong-san?${s}` : "/bat-dong-san";
  };

  return (
    <>
      <PageHero
        label="Danh mục"
        title="Những căn anh Đường đã dẫn xem"
        lead="Mỗi căn đều có video quay tại chỗ. Giá theo thời điểm quay; nhiều căn tương tự không công khai, hãy nhắn để nhận danh sách riêng."
      />
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          <div className="flex flex-col gap-5 border-b border-line pb-8">
            <nav aria-label="Lọc theo loại hình" className="flex flex-wrap gap-2">
              <Link href={href(undefined, district)} className={chip(!kind)} aria-current={!kind ? "true" : undefined}>
                Tất cả
              </Link>
              {Object.entries(KINDS).map(([k, label]) => (
                <Link key={k} href={href(k, district)} className={chip(kind === k)} aria-current={kind === k ? "true" : undefined}>
                  {label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Lọc theo khu vực" className="flex flex-wrap gap-2">
              <Link href={href(kind)} className={chip(!district)} aria-current={!district ? "true" : undefined}>
                Mọi khu vực
              </Link>
              {districts.map((d) => (
                <Link key={d} href={href(kind, d)} className={chip(district === d)} aria-current={district === d ? "true" : undefined}>
                  {d}
                </Link>
              ))}
            </nav>
          </div>

          <p className="mt-8 text-sm text-muted" aria-live="polite">
            {items.length} căn
          </p>

          {items.length === 0 ? (
            <div className="mt-10 bg-mist p-10 text-center">
              <p className="h3">Chưa có căn công khai phù hợp bộ lọc này.</p>
              <p className="mt-3 text-muted">Anh Đường thường có căn chưa đăng. Nhắn tiêu chí để nhận danh sách riêng.</p>
              <Link href="/dat-lich?muc-dich=mua" className="btn btn-ink mt-8">
                Gửi tiêu chí
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((l, i) => (
                <div key={l.id} className="reveal" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                  <ListingCard l={l} priority={i < 3} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
