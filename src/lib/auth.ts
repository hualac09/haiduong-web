import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "hd_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET phải dài ít nhất 32 ký tự");
  return new TextEncoder().encode(s);
}

/** Hash dạng scrypt:<salt hex>:<key hex>, tạo bằng scripts/hash-password.mjs. */
export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, key] = stored.split(":");
  if (algo !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.sub === process.env.ADMIN_EMAIL ? payload.sub! : null;
  } catch {
    return null;
  }
}

/** Gọi ở đầu mọi trang và server action của admin. */
export async function requireAdmin(): Promise<string> {
  const who = await currentAdmin();
  if (!who) redirect("/admin/dang-nhap");
  return who;
}
