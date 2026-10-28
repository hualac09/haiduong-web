import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/icons";

export const metadata: Metadata = { title: "Không tìm thấy trang", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-ink px-4 text-white">
      <div className="max-w-xl text-center">
        <div className="flex justify-center">
          <Monogram size={44} />
        </div>
        <p className="label mt-10 text-gold">404</p>
        <h1 className="mt-5 text-[clamp(2.2rem,6vw,4rem)] leading-tight font-[150] uppercase">Không tìm thấy trang</h1>
        <p className="mt-6 text-white/70">Căn hoặc bài viết này có thể đã được gỡ. Thử xem danh mục hiện tại.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            Trang chủ
          </Link>
          <Link href="/bat-dong-san" className="btn btn-ghost">
            Bất động sản
          </Link>
        </div>
      </div>
    </main>
  );
}
