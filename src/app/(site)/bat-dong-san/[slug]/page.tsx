import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";
import { ArrowRight, Phone } from "@/components/icons";
import { ListingCard } from "@/components/ui";
import { galleryOf, listingBySlug, listingCover, relatedListings } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { KINDS, STATUSES, site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const l = listingBySlug((await params).slug);
  if (!l) return {};
  const title = `${l.title}${l.price_label ? ` · ${l.price_label}` : ""}`;
  const cover = listingCover(l);
  return {
    title,
    description: l.summary,
    alternates: { canonical: `/bat-dong-san/${l.slug}` },
    openGraph: { title, description: l.summary, images: cover ? [cover] : undefined },
  };
}

export default async function ListingPage({ params }: { params: Params }) {
  const l = listingBySlug((await params).slug);
  if (!l) notFound();
  const cover = listingCover(l);
  const gallery = galleryOf(l);
  const related = relatedListings(l);

  const facts = [
    ["Loại hình", KINDS[l.kind] ?? l.kind],
    ["Khu vực", l.district],
    ["Dự án", l.project],
    ["Diện tích", l.area_m2 ? `${l.area_m2.toLocaleString("vi-VN")} m²` : ""],
    ["Phòng ngủ", l.bedrooms ? String(l.bedrooms) : ""],
    ["Tình trạng", STATUSES[l.status] ?? l.status],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden bg-ink-2 text-white">
        {cover && <Image src={cover} alt={l.title} fill priority sizes="100vw" className="hero-media -z-20 object-cover" />}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_28_24/0.6)_0%,rgb(10_28_24/0.2)_45%,rgb(10_28_24/0.95)_100%)]" />
        <div className="wrap pt-36 pb-12 md:pb-16">
          <nav aria-label="Đường dẫn" className="label reveal text-white/70">
            <Link href="/bat-dong-san" className="hover:text-gold">
              Bất động sản
            </Link>{" "}
            / <span className="text-gold">{l.district}</span>
          </nav>
          <h1 className="reveal mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] leading-[1.05] font-[150] uppercase">{l.title}</h1>
          <div className="hairline reveal mt-8" />
          <div className="reveal mt-6 flex flex-wrap items-end justify-between gap-6">
            <p className="text-[clamp(2rem,4vw,3rem)] font-extralight">{l.price_label}</p>
            <a href="#hoi-can" className="btn btn-gold">
              Hỏi về căn này
            </a>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="wrap grid gap-16 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <dl className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="border-r border-b border-line p-5">
                  <dt className="label !text-[0.65rem] text-muted">{k}</dt>
                  <dd className="mt-2 text-lg font-light">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="prose-hd mt-12 max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(l.body || l.summary) }} />

            {l.youtube_id && (
              <div className="mt-14">
                <p className="label text-gold-deep">Video dẫn xem</p>
                <div className="chamfer relative mt-5 aspect-video overflow-hidden bg-ink">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${l.youtube_id}?rel=0`}
                    title={`Video: ${l.title}`}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

            {gallery.length > 0 && (
              <div className="mt-14 grid gap-3 sm:grid-cols-2">
                {gallery.map((src, i) => {
                  // Nhịp 1 ảnh rộng + 2 ảnh nửa hàng; ảnh cuối lẻ thì cho rộng hết hàng.
                  const wide = i % 3 === 0 || (i === gallery.length - 1 && i % 3 === 1);
                  return (
                  <div key={src} className={`relative overflow-hidden bg-mist ${wide ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}>
                    <Image src={src} alt={`${l.title}, ảnh ${i + 1}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside id="hoi-can" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
            <div className="chamfer on-dark bg-ink p-7 text-white md:p-9">
              <p className="label text-gold">Nhận thông tin hiện tại</p>
              <p className="mt-3 text-2xl font-extralight">Giá, tình trạng và lịch xem riêng</p>
              <div className="mt-7">
                <InquiryForm listingId={l.id} title={l.title} />
              </div>
            </div>
            <a href={`tel:${site.phone}`} className="mt-4 flex min-h-[52px] items-center justify-center gap-3 border border-line text-sm font-medium tracking-[0.12em] uppercase hover:border-ink">
              <Phone size={18} /> Gọi {site.phoneDisplay}
            </a>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-mist py-20 md:py-28">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 className="h2">Căn tương tự</h2>
              <Link href="/bat-dong-san" className="link-arrow">
                Toàn bộ <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ListingCard key={r.id} l={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
