"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "./icons";

/** Hỏi trạng thái đơn mỗi 5 giây, dừng khi đã thanh toán hoặc sau 30 phút. */
export default function PaymentStatus({ code, initialStatus }: { code: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (status === "paid") return;
    const started = Date.now();
    const t = setInterval(async () => {
      if (document.hidden) return;
      if (Date.now() - started > 30 * 60_000) return clearInterval(t);
      try {
        const r = await fetch(`/api/orders/${code}`, { cache: "no-store" });
        if (r.ok) {
          const j = (await r.json()) as { status: string };
          setStatus(j.status);
          if (j.status === "paid") {
            clearInterval(t);
            router.refresh(); // tải lại phần server để ẩn mã QR
          }
        }
      } catch {
        /* mạng chập chờn: thử lại lần sau */
      }
    }, 5000);
    return () => clearInterval(t);
  }, [code, status]);

  if (status === "paid") {
    return (
      <div role="status" className="flex items-start gap-4 bg-ink p-7 text-white">
        <Check size={28} className="mt-1 shrink-0 text-gold" />
        <div>
          <p className="text-2xl font-extralight">Đã nhận học phí. Chào mừng bạn!</p>
          <p className="mt-2 text-white/75">Đội ngũ sẽ thêm bạn vào nhóm Zalo của khóa trong 2 giờ làm việc.</p>
        </div>
      </div>
    );
  }
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-4 border border-line p-6">
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
      </span>
      <p>
        {status === "partial" ? "Đã nhận một phần. Vui lòng chuyển nốt số còn lại." : "Đang chờ chuyển khoản. Trang tự cập nhật khi tiền vào."}
      </p>
    </div>
  );
}
