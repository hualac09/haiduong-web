import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/ui";
import { postBySlug, publishedPosts } from "@/lib/data";
import { dateVN, readingMinutes } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/goc-nhin/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, images: p.cover ? [p.cover] : undefined, publishedTime: p.published_at ?? undefined },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  const more = publishedPosts(4).filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap max-w-5xl pt-36 pb-14 md:pt-48">
          <p className="label text-gold">
            <Link href="/goc-nhin" className="hover:underline">
              Góc nhìn
            </Link>{" "}
            · {p.topic}
          </p>
          <h1 className="mt-6 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.15] font-extralight">{p.title}</h1>
          <p className="mt-8 text-sm text-white/60">
            {site.fullName} · {dateVN(p.published_at)} · {readingMinutes(p.body)} phút đọc
          </p>
        </div>
      </section>
      {p.cover && (
        <div className="bg-[linear-gradient(180deg,var(--color-ink)_50%,var(--color-paper)_50%)]">
          <div className="wrap max-w-5xl">
            <div className="chamfer chamfer-lg relative aspect-[16/9] overflow-hidden bg-ink-3">
              <Image src={p.cover} alt="" fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      )}
      <article className="bg-paper py-14 md:py-20">
        <div className="wrap max-w-3xl">
          {p.excerpt && <p className="lead border-l-2 border-gold pl-6 text-muted">{p.excerpt}</p>}
          <div className="prose-hd mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
          <div className="mt-16 flex flex-col gap-6 bg-mist p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-light">Muốn so sánh số liệu này với căn bạn đang nhắm?</p>
            <Link href="/dat-lich" className="btn btn-ink shrink-0">
              Đặt lịch trao đổi
            </Link>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-paper pb-24">
          <div className="wrap">
            <h2 className="h3 border-t border-line pt-12">Bài khác</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {more.map((m) => (
                <PostCard key={m.id} p={m} />
              ))}
            </div>
          </div>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            datePublished: p.published_at,
            dateModified: p.updated_at,
            author: { "@type": "Person", name: site.fullName },
            image: p.cover || undefined,
          }),
        }}
      />
    </>
  );
}
