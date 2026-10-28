import type { ReactNode } from "react";

export function AdminTitle({ title, action, children }: { title: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extralight">{title}</h1>
        {children && <p className="mt-2 text-sm text-muted">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-paper p-5 md:p-7 ${className}`}>{children}</div>;
}

const TONES: Record<string, string> = {
  pending: "bg-gold-soft text-gold-deep",
  partial: "bg-gold-soft text-gold-deep",
  new: "bg-gold-soft text-gold-deep",
  paid: "bg-ok/15 text-ok",
  won: "bg-ok/15 text-ok",
  contacted: "bg-ink/10 text-ink",
  cancelled: "bg-danger/10 text-danger",
  refunded: "bg-danger/10 text-danger",
  lost: "bg-danger/10 text-danger",
};

const LABELS: Record<string, string> = {
  pending: "Chờ chuyển khoản",
  partial: "Thiếu tiền",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn",
  new: "Mới",
  contacted: "Đã liên hệ",
  won: "Thành công",
  lost: "Không tiếp tục",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONES[status] ?? "bg-mist"}`}>
      {LABELS[status] ?? status}
    </span>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto bg-paper">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-muted uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-line/70 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top">{children}</tbody>
      </table>
      {empty && <p className="p-8 text-center text-muted">Chưa có dữ liệu.</p>}
    </div>
  );
}

export const smallBtn = "cursor-pointer rounded border border-line px-2.5 py-1.5 text-xs hover:border-ink";
