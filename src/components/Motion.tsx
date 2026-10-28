"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Gắn class is-in cho mọi .reveal khi cuộn tới. Đo vị trí trực tiếp thay vì IntersectionObserver,
 * vì IO không báo khi trình duyệt chưa vẽ khung hình (tab nền, cửa sổ bị che) và khối sẽ ẩn mãi.
 * MutationObserver bắt cả nội dung đổ vào sau (chuyển trang, streaming).
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    let timer = 0;
    const check = () => {
      timer = 0;
      const limit = window.innerHeight * 0.92;
      const pending = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < limit && r.bottom > 0) el.classList.add("is-in");
        else if (r.bottom <= 0) el.classList.add("is-in"); // đã cuộn qua (ví dụ mở bằng #anchor)
      });
      return pending.length;
    };
    const schedule = () => {
      if (!timer) timer = window.setTimeout(check, 60);
    };
    check();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Lưới an toàn: sự kiện cuộn chỉ phát khi trình duyệt đang vẽ; kiểm tra định kỳ đến khi hiện hết.
    const safety = window.setInterval(() => {
      if (check() === 0) clearInterval(safety);
    }, 500);
    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clearTimeout(timer);
      clearInterval(safety);
    };
  }, [pathname]);
  return null;
}

/**
 * Câu lớn sáng dần từng chữ theo vị trí cuộn. Trình đọc màn hình nhận nguyên câu;
 * giảm chuyển động thì hiện sáng toàn bộ.
 */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(1);
  const words = text.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const lit = Math.round(progress * words.length);
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="transition-opacity duration-300" style={{ opacity: i < lit ? 1 : 0.22 }}>
            {w}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
