import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaymentStatus from "@/components/PaymentStatus";
import { get } from "@/lib/db";
import type { Order } from "@/lib/data";
import { vnd } from "@/lib/format";
import { PLANS, isPlan } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Thanh toán", robots: { index: false, follow: false } };

export default async function PayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const o = /^HD[A-Z0-9]{6}$/.test(code) ? get<Order>("SELECT * FROM orders WHERE code = ?", code) : undefined;
  if (!o) notFound();

  const bin = process.env.BANK_BIN ?? "";
  const acc = process.env.BANK_ACCOUNT ?? "";
  const accName = process.env.BANK_ACCOUNT_NAME ?? "";
  const remaining = Math.max(0, o.amount - o.paid_amount);
  const qr =
    bin && acc
      ? `https://img.vietqr.io/image/${bin}-${acc}-compact2.png?amount=${remaining}&addInfo=${encodeURIComponent(o.code)}&accountName=${encodeURIComponent(accName)}`
      : "";
  const planName = isPlan(o.plan) ? PLANS[o.plan].name : o.plan;

  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap pt-36 pb-12 md:pt-44">
          <p className="label text-gold">Đơn {o.code}</p>
          <h1 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] font-[150] uppercase">Thanh toán học phí</h1>
        </div>
      </section>
      <section className="bg-paper py-14 md:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="chamfer bg-mist p-6 md:p-10">
            {o.status === "paid" ? (
              <div className="grid aspect-square place-items-center text-center">
                <div>
                  <p className="text-[clamp(3rem,6vw,4.5rem)] leading-none font-[150]">Đã nhận</p>
                  <p className="mt-4 text-muted">{vnd(o.paid_amount)} · không cần chuyển thêm</p>
                </div>
              </div>
            ) : qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qr}
                alt={`Mã VietQR chuyển ${vnd(remaining)} với nội dung ${o.code}`}
                width={540}
                height={640}
                className="mx-auto h-auto w-full max-w-[380px] bg-white"
              />
            ) : (
              <p className="text-muted">Chưa cấu hình tài khoản nhận tiền (BANK_BIN, BANK_ACCOUNT).</p>
            )}
          </div>
          <div>
            <PaymentStatus code={o.code} initialStatus={o.status} />
            <dl className="mt-8 grid border-t border-line">
              {[
                ["Gói", planName],
                ["Đợt", o.wave],
                ["Học viên", o.name],
                ["Số tiền", o.status === "paid" ? `${vnd(o.paid_amount)} (đã nhận)` : vnd(remaining)],
                ["Nội dung chuyển khoản", o.code],
                ["Tài khoản", acc ? `${acc} · ${accName}` : "Chưa cấu hình"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-4">
                  <dt className="label !text-[0.68rem] text-muted">{k}</dt>
                  <dd className={k === "Nội dung chuyển khoản" || k === "Số tiền" ? "text-xl font-medium" : "text-lg font-light"}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-muted">
              Ghi đúng nội dung <strong className="font-medium text-text">{o.code}</strong> để hệ thống tự nhận. Nếu chuyển thiếu hoặc
              sai nội dung, đội ngũ sẽ liên hệ đối soát trong giờ làm việc. Lưu lại đường dẫn trang này để xem trạng thái.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
