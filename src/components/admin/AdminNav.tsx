"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { ArrowUpRight, Monogram } from "../icons";

const items = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/don-hang", label: "Đơn khóa học" },
  { href: "/admin/lich-hen", label: "Lịch hẹn" },
  { href: "/admin/khach", label: "Khách hỏi căn" },
  { href: "/admin/bat-dong-san", label: "Bất động sản" },
  { href: "/admin/bai-viet", label: "Bài viết" },
  { href: "/admin/hoc-phi", label: "Học phí" },
];

export default function AdminNav({ who }: { who: string }) {
  const path = usePathname();
  return (
    <aside className="bg-ink-2 text-white lg:sticky lg:top-0 lg:h-[100svh]">
      <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block">
        <Link href="/admin" className="flex items-center gap-3">
          <Monogram />
          <span className="text-sm font-medium tracking-[0.14em] uppercase">Quản trị</span>
        </Link>
        <a href="/" target="_blank" className="flex items-center gap-1 text-xs text-white/60 hover:text-gold lg:mt-4">
          Xem website <ArrowUpRight size={14} />
        </a>
      </div>
      <nav aria-label="Quản trị" className="overflow-x-auto">
        <ul className="flex gap-1 px-3 pb-3 lg:grid lg:px-3">
          {items.map((i) => {
            const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
            return (
              <li key={i.href} className="shrink-0">
                <Link
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded px-3 py-2.5 text-sm whitespace-nowrap ${active ? "bg-white/10 text-gold" : "text-white/80 hover:bg-white/5"}`}
                >
                  {i.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <form action={logout} className="hidden px-6 pt-6 text-xs text-white/50 lg:block">
        <p className="truncate">{who}</p>
        <button type="submit" className="mt-2 cursor-pointer underline hover:text-gold">
          Đăng xuất
        </button>
      </form>
    </aside>
  );
}
