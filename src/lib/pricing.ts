import "server-only";
import { all } from "./db";
import type { Wave } from "./data";

export const PLANS = {
  k1: { name: "Khóa 1 · Personal Brand Pro", short: "Khóa 1" },
  k2: { name: "Khóa 2 · Luxury Closer", short: "Khóa 2" },
  combo: { name: "Combo Khóa 1 + 2", short: "Combo" },
} as const;

export type PlanId = keyof typeof PLANS;

export function isPlan(v: unknown): v is PlanId {
  return typeof v === "string" && v in PLANS;
}

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. */
export function todayVN(): string {
  return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
}

export function waves(): Wave[] {
  return all<Wave>("SELECT * FROM waves ORDER BY starts_on ASC");
}

export type PricingState = {
  current: Wave | null;
  next: Wave | null;
  all: Wave[];
};

export function pricingState(today = todayVN()): PricingState {
  const list = waves();
  const current =
    list.find((w) => w.starts_on <= today && (!w.ends_on || w.ends_on >= today)) ?? null;
  const next = list.find((w) => w.starts_on > today) ?? null;
  return { current, next, all: list };
}

export function priceFor(w: Wave, plan: PlanId): number {
  return plan === "k1" ? w.price_k1 : plan === "k2" ? w.price_k2 : w.price_combo;
}
