import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { listingCover, type Listing, type Post } from "@/lib/data";
import { dateVN, readingMinutes } from "@/lib/format";
import { KINDS, STATUSES } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "./icons";

/** Phần mở đầu nền tối cho mọi trang con, để header trắng luôn đọc được. */
export function PageHero({
  label,
  title,
  lead,
  children,
}: {
  label: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink text-white">
      <div className="wrap pt-40 pb-16 md:pt-48 md:pb-24">
        <p className="label reveal text-gold">{label}</p>
        <h1 className="display reveal mt-6 max-w-[14ch] !text-[clamp(2.5rem,6.5vw,5.75rem)]" style={{ ["--d" as string]: "80ms" }}>
          {title}
        </h1>
        <div className="hairline reveal mt-10 md:mt-14" />
        {lead && (
          <p className="lead reveal mt-8 max-w-3xl text-white/80" style={{ ["--d" as string]: "160ms" }}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  label,
  title,
  lead,
  tone = "light",
  action,
}: {
  label: string;
  title: string;
  lead?: string;
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className={`label reveal ${dark ? "text-gold" : "text-gold-deep"}`}>{label}</p>
        <h2 className="h2 reveal mt-5">{title}</h2>
        {lead && <p className={`reveal mt-5 text-lg ${dark ? "text-white/75" : "text-muted"}`}>{lead}</p>}
      </div>
      {action && <div className="reveal shrink-0">{action}</div>}
    </div>
  );
}

export function ListingCard({ l, tone = "light", priority = false }: { l: Listing; tone?: "light" | "dark"; priority?: boolean }) {
  const cover = listingCover(l);
  const dark = tone === "dark";
  return (
    <Link href={`/bat-dong-san/${l.slug}`} className="group block">
      <div className="chamfer relative aspect-[4/3] overflow-hidden bg-ink-3">
        {cover && (
          <Image
            src={cover}
            alt={l.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
          />
        )}
        <span className="label absolute bottom-4 left-4 bg-ink-2/80 px-3 py-1.5 !text-[0.65rem] text-white backdrop-blur-sm">
          {STATUSES[l.status] ?? l.status}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className={`label !text-[0.68rem] ${dark ? "text-gold" : "text-gold-deep"}`}>
            {KINDS[l.kind] ?? l.kind} · {l.district}
          </p>
          <h3 className="mt-2 text-[1.2rem] leading-snug font-light">{l.title}</h3>
        </div>
        {l.price_label && <p className="shrink-0 text-[1.35rem] font-extralight whitespace-nowrap">{l.price_label}</p>}
      </div>
      <p className={`mt-3 flex gap-4 text-sm ${dark ? "text-white/60" : "text-muted"}`}>
        {l.area_m2 ? <span>{l.area_m2.toLocaleString("vi-VN")} m²</span> : null}
        {l.bedrooms ? <span>{l.bedrooms} phòng ngủ</span> : null}
        {l.project ? <span className="truncate">{l.project}</span> : null}
      </p>
    </Link>
  );
}

export function PostCard({ p, large = false }: { p: Post; large?: boolean }) {
  return (
    <Link href={`/goc-nhin/${p.slug}`} className="group block">
      {p.cover && (
        <div className={`chamfer relative overflow-hidden bg-mist ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          <Image
            src={p.cover}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      )}
      <p className="label mt-5 !text-[0.68rem] text-gold-deep">
        {p.topic} · {dateVN(p.published_at)} · {readingMinutes(p.body)} phút đọc
      </p>
      <h3 className={`mt-3 font-light leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 ${large ? "text-[1.75rem]" : "text-[1.25rem]"}`}>
        {p.title}
      </h3>
      {p.excerpt && <p className="mt-3 line-clamp-3 text-muted">{p.excerpt}</p>}
    </Link>
  );
}

export function MoreLink({ href, children, tone = "light" }: { href: string; children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <Link href={href} className={`link-arrow ${tone === "dark" ? "text-gold" : "text-ink"}`}>
      {children} <ArrowRight size={18} />
    </Link>
  );
}

/** `image`: ảnh sạch (không chữ chèn) thay cho ảnh bìa YouTube. */
export function VideoCard({ id, title, meta, image }: { id: string; title: string; meta?: string; image?: string }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="chamfer relative aspect-video overflow-hidden bg-ink-3">
        <Image
          src={image ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          {meta && <p className="label !text-[0.68rem] text-gold">{meta}</p>}
          <p className="mt-2 leading-snug font-light">{title}</p>
        </div>
        <ArrowUpRight size={20} className="mt-1 shrink-0 text-white/60 transition-colors group-hover:text-gold" />
        <span className="sr-only">(mở YouTube trong thẻ mới)</span>
      </div>
    </a>
  );
}
