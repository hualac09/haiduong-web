import "server-only";
import { all, get } from "./db";

export type Listing = {
  id: number;
  slug: string;
  title: string;
  project: string;
  district: string;
  kind: string;
  status: string;
  price_label: string;
  price_billion: number | null;
  area_m2: number | null;
  bedrooms: number | null;
  summary: string;
  body: string;
  cover: string;
  gallery: string;
  youtube_id: string;
  featured: number;
  published: number;
  sort: number;
  updated_at: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  topic: string;
  published: number;
  published_at: string | null;
  updated_at: string;
};

export type Wave = {
  id: number;
  name: string;
  starts_on: string;
  ends_on: string | null;
  price_k1: number;
  price_k2: number;
  price_combo: number;
  slots: number | null;
};

export type Order = {
  id: number;
  code: string;
  plan: string;
  wave: string;
  amount: number;
  name: string;
  phone: string;
  email: string;
  segment: string;
  note: string;
  utm: string;
  status: string;
  paid_amount: number;
  paid_at: string | null;
  created_at: string;
};

export type Slot = { id: number; starts_at: string; minutes: number; booking_id: number | null };

export function listingCover(l: Pick<Listing, "cover" | "youtube_id">): string {
  if (l.cover) return l.cover;
  if (l.youtube_id) return `https://i.ytimg.com/vi/${l.youtube_id}/maxresdefault.jpg`;
  return "";
}

export function galleryOf(l: Listing): string[] {
  try {
    const g = JSON.parse(l.gallery);
    return Array.isArray(g) ? g.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export type ListingFilter = { kind?: string; district?: string; status?: string };

export function publishedListings(f: ListingFilter = {}): Listing[] {
  const where = ["published = 1"];
  const params: string[] = [];
  if (f.kind) (where.push("kind = ?"), params.push(f.kind));
  if (f.district) (where.push("district = ?"), params.push(f.district));
  if (f.status) (where.push("status = ?"), params.push(f.status));
  return all<Listing>(
    `SELECT * FROM listings WHERE ${where.join(" AND ")} ORDER BY sort ASC, price_billion DESC`,
    ...params,
  );
}

export function featuredListings(limit = 6): Listing[] {
  return all<Listing>(
    "SELECT * FROM listings WHERE published = 1 AND featured = 1 ORDER BY sort ASC, price_billion DESC LIMIT ?",
    limit,
  );
}

export function listingBySlug(slug: string): Listing | undefined {
  return get<Listing>("SELECT * FROM listings WHERE slug = ? AND published = 1", slug);
}

export function listingDistricts(): string[] {
  return all<{ district: string }>(
    "SELECT DISTINCT district FROM listings WHERE published = 1 AND district <> '' ORDER BY district",
  ).map((r) => r.district);
}

export function relatedListings(l: Listing, limit = 3): Listing[] {
  return all<Listing>(
    "SELECT * FROM listings WHERE published = 1 AND id <> ? ORDER BY (district = ?) DESC, (kind = ?) DESC, sort ASC LIMIT ?",
    l.id,
    l.district,
    l.kind,
    limit,
  );
}

export function publishedPosts(limit = 50): Post[] {
  return all<Post>(
    "SELECT * FROM posts WHERE published = 1 AND published_at <= datetime('now') ORDER BY published_at DESC LIMIT ?",
    limit,
  );
}

export function postBySlug(slug: string): Post | undefined {
  return get<Post>(
    "SELECT * FROM posts WHERE slug = ? AND published = 1 AND published_at <= datetime('now')",
    slug,
  );
}

export function openSlots(): Slot[] {
  return all<Slot>(
    "SELECT * FROM slots WHERE booking_id IS NULL AND starts_at > datetime('now', '+7 hours', '+2 hours') ORDER BY starts_at LIMIT 60",
  );
}
