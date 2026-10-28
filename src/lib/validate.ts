import "server-only";
import { headers } from "next/headers";

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: Record<string, string>;
};

export const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);

/** Số di động Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx. Trả về dạng 0xxxxxxxxx. */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/[\s.\-()]/g, "");
  const m = d.match(/^(?:\+?84|0)([35789]\d{8})$/);
  return m ? `0${m[1]}` : null;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

const hits = new Map<string, number[]>();

/** Giới hạn đơn giản trong bộ nhớ: tối đa `limit` lần mỗi `windowMs` cho mỗi IP và mỗi loại form. */
export async function rateLimited(bucket: string, limit = 5, windowMs = 10 * 60_000): Promise<boolean> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > limit;
}

/** Ô bẫy ẩn: người thật không điền, bot thường điền. */
export const isBot = (fd: FormData) => str(fd, "website") !== "";

export function utmFrom(fd: FormData): string {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "ref"];
  const o: Record<string, string> = {};
  for (const k of keys) {
    const v = str(fd, k, 80);
    if (v) o[k] = v;
  }
  return JSON.stringify(o);
}
