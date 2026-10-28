import type { Metadata } from "next";
import Link from "next/link";
import OrderForm from "@/components/OrderForm";
import { Check } from "@/components/icons";
import { vnd } from "@/lib/format";
import { PLANS, isPlan, priceFor, pricingState, type PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng ký khóa học",
  robots: { index: false },
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ goi?: string }> }) {
  const { goi } = await searchParams;
  const { current, next } = pricingState();
  const initial: PlanId = isPlan(goi) ? goi : "combo";

  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap pt-36 pb-12 md:pt-44">
          <p className="label text-gold">
            <Link href="/hoc-vien" className="hover:underline">
              Học viện
            </Link>{" "}
            / Đăng ký
          </p>
          <h1 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] font-[150] uppercase">Giữ suất của bạn</h1>
        </div>
      </section>

      <section className="bg-paper py-14 md:py-20">
        <div className="wrap grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          {current ? (
            <OrderForm
              initial={initial}
              plans={(Object.keys(PLANS) as PlanId[]).map((id) => ({
                id,
                name: PLANS[id].name,
                price: vnd(priceFor(current, id)),
              }))}
            />
          ) : (
            <div className="bg-mist p-8">
              <p className="h3">Chưa mở đăng ký.</p>
              <p className="mt-3 text-muted">
                {next ? `${next.name} mở từ ${next.starts_on.split("-").reverse().join("/")}.` : "Khóa tiếp theo chưa có lịch."} Vào danh
                sách chờ để giữ giá tốt nhất.
              </p>
              <a href="/pre-order" className="btn btn-ink mt-8">
                Vào danh sách chờ
              </a>
            </div>
          )}

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="chamfer bg-ink p-8 text-white">
              <p className="label text-gold">{current ? current.name : "Hải Đường Academy"}</p>
              <p className="mt-4 text-2xl font-extralight">Sau khi bấm tiếp tục</p>
              <ol className="mt-6 grid gap-4 text-white/80">
                {[
                  "Trang thanh toán hiện mã VietQR đúng số tiền và nội dung.",
                  "Quét bằng app ngân hàng bất kỳ. Hệ thống tự xác nhận khi tiền vào.",
                  "Đội ngũ thêm bạn vào nhóm Zalo của khóa trong 2 giờ làm việc.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-4">
                    <span className="label pt-1 text-gold">0{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <p className="mt-8 flex gap-3 border-t border-white/15 pt-6 text-sm text-white/70">
                <Check size={20} className="shrink-0 text-gold" /> Hoàn 100% học phí trong 7 ngày đầu nếu thấy không phù hợp.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
