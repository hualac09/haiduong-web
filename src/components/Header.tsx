"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { Close, Monogram, Phone } from "./icons";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink-2"
      >
        Bỏ qua tới nội dung
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow] duration-300 ${
          solid ? "bg-ink-2/95 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur" : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Hải Đường, về trang chủ">
            <Monogram />
            <span className="leading-none">
              <span className="block text-[1.05rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase">Hải Đường</span>
              <span className="mt-1 hidden text-[0.6rem] font-medium tracking-[0.2em] whitespace-nowrap text-white/70 uppercase sm:block">
                Luxury Real Estate
              </span>
            </span>
          </Link>

          <nav aria-label="Chính" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((n) => {
                const active = pathname.startsWith(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className={`text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors hover:text-gold ${
                        active ? "text-gold" : "text-white/85"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dat-lich" className="btn btn-gold !min-h-[40px] !px-4 !py-2 !text-[0.72rem] whitespace-nowrap">
              Đặt lịch
            </Link>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-toan-man-hinh"
              aria-label="Mở menu"
              className="grid h-11 w-11 cursor-pointer place-items-center"
            >
              <span aria-hidden className="grid w-6 gap-[7px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-toan-man-hinh"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-ink-2 text-white"
      >
        <div className="wrap flex h-[72px] items-center justify-between">
          <span className="label text-white/60">Menu</span>
          <button
            ref={closeBtn}
            type="button"
            onClick={() => {
              setOpen(false);
              menuBtn.current?.focus();
            }}
            className="grid h-11 w-11 cursor-pointer place-items-center"
            aria-label="Đóng menu"
          >
            <Close size={26} />
          </button>
        </div>
        <div className="wrap grid gap-16 pt-8 pb-16 lg:grid-cols-[1.4fr_1fr] lg:pt-16">
          <nav aria-label="Menu đầy đủ">
            <ul className="grid gap-2">
              {[{ href: "/", label: "Trang chủ" }, ...nav, { href: "/dat-lich", label: "Đặt lịch tư vấn" }].map(
                (n, i) => (
                  <li key={n.href} className="border-b border-white/10">
                    <Link
                      href={n.href}
                      className="group flex items-baseline gap-6 py-4 text-[clamp(1.9rem,5vw,3.5rem)] leading-tight font-[150] uppercase transition-colors hover:text-gold"
                    >
                      <span className="label w-8 text-white/40 group-hover:text-gold">0{i + 1}</span>
                      {n.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="grid content-start gap-10 text-white/80">
            <div>
              <p className="label text-gold">Liên hệ trực tiếp</p>
              <a href={`tel:${site.phone}`} className="mt-4 flex items-center gap-3 text-2xl font-light hover:text-gold">
                <Phone size={22} /> {site.phoneDisplay}
              </a>
              <p className="mt-3 text-sm">{site.address}</p>
            </div>
            <div>
              <p className="label text-gold">Theo dõi</p>
              <ul className="mt-4 grid gap-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      {s.label}
                      {s.stat && <span className="text-white/50"> · {s.stat}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
