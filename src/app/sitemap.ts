import type { MetadataRoute } from "next";
import { publishedListings, publishedPosts } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const pages = ["", "/bat-dong-san", "/gioi-thieu", "/hoc-vien", "/goc-nhin", "/dat-lich"].map((p) => ({
    url: u(p),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const listings = publishedListings().map((l) => ({ url: u(`/bat-dong-san/${l.slug}`), lastModified: l.updated_at.replace(" ", "T") + "Z" }));
  const posts = publishedPosts(500).map((p) => ({ url: u(`/goc-nhin/${p.slug}`), lastModified: p.updated_at.replace(" ", "T") + "Z" }));
  return [...pages, ...listings, ...posts];
}
