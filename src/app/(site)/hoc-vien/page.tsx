import type { Metadata } from "next";
import Link from "next/link";
import { Check, Plus } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { comboPerks, courses, faqs } from "@/lib/courses";
import { vnd } from "@/lib/format";
import { PLANS, pricingState, type PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hải Đường Academy · Khóa học môi giới cao cấp",
  description:
    "Hai khóa 6 tuần với anh Hải Đường: Personal Brand Pro (khách tự tìm đến) và Luxury Closer (chốt deal 20–200 tỷ). Live mỗi tuần, hoàn học phí trong 7 ngày.",
  alternates: { canonical: "/hoc-vien" },
};

const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export default function AcademyPage() {
  const { current, next, all } = pricingState();
  const shown = current ?? next;
  const open = Boolean(current);

  const plans: { id: PlanId; perks: readonly string[]; highlight?: boolean }[] = [
    { id: "k1", perks: courses[0].perks },
    { id: "combo", perks: comboPerks, highlight: true },
    { id: "k2", perks: courses[1].perks },
  ];
  const price = (id: PlanId) => (!shown ? 0 : id === "k1" ? shown.price_k1 : id === "k2" ? shown.price_k2 : shown.price_combo);

  return (
    <>
      <PageHero
        label="Hải Đường Academy"
        title="Học bán căn trăm tỷ từ người đang bán"
        lead="Hai khóa 6 tuần cho môi giới muốn có khách tự tìm đến và đủ tự tin chốt những giao dịch lớn. Học online, live mỗi tuần với anh Hải Đường, bài tập làm ngay trên công việc thật."
      >
        <div className="reveal mt-10 flex flex-wrap gap-3">
          <a href="#hoc-phi" className="btn btn-gold">
            Xem học phí
          </a>
          <a href="#noi-dung-khoa" className="btn btn-ghost">
            Nội dung 2 khóa
          </a>
        </div>
      </PageHero>

      <section className="bg-paper py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_2.2fr]">
          <p className="label reveal text-gold-deep">Vì sao khóa này khác</p>
          <div>
            <p className="reveal text-[clamp(1.8rem,3.8vw,3rem)] leading-[1.2] font-extralight">
              Mỗi tuần mổ xẻ một căn có thật trên kênh của anh Đường:{" "}
              <span className="text-muted">tìm khách ở đâu, dẫn xem thế nào, nói giá ra sao.</span>
            </p>
            <ul className="reveal mt-10 grid gap-4 text-lg text-muted sm:grid-cols-2">
              {[
                "Học từ 655 video dẫn xem căn thật",
                "Live Zoom 20h mỗi tuần, bản ghi xem lại 12 tháng",
                "Bài tập làm ngay trên khách và căn của bạn",
                "Học viên xuất sắc được ưu tiên ứng tuyển Sunhomes",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={22} className="mt-1 shrink-0 text-gold-deep" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="noi-dung-khoa" className="scroll-mt-20 bg-ink py-24 text-white md:py-32">
        <div className="wrap">
          <p className="label text-gold">Nội dung</p>
          <h2 className="h2 mt-5 max-w-3xl">Khóa 1 mang khách đến. Khóa 2 biến khách thành deal lớn.</h2>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {courses.map((c) => (
              <article key={c.id} className="chamfer reveal bg-ink-3/60 p-8 md:p-10">
                <p className="label text-gold">{c.tag}</p>
                <h3 className="mt-5 text-[clamp(2rem,3.4vw,2.75rem)] leading-tight font-extralight">
                  {c.name}
                  <span className="block text-white/60">{c.promise}</span>
                </h3>
                <p className="mt-6 text-white/75">{c.forWho}</p>
                <ol className="mt-8 border-t border-white/15">
                  {c.weeks.map((w, i) => (
                    <li key={w} className="flex gap-5 border-b border-white/15 py-4">
                      <span className="label w-16 shrink-0 pt-1 text-gold">Tuần {i + 1}</span>
                      <span className="text-white/85">{w}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 text-white/75">
                  <span className="text-gold">Sau 6 tuần:</span> {c.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="hoc-phi" className="scroll-mt-20 bg-mist py-24 md:py-32">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label reveal text-gold-deep">Học phí</p>
              <h2 className="h2 reveal mt-5">Đăng ký càng sớm, học phí càng thấp.</h2>
            </div>
            {shown && (
              <p className="reveal text-muted" aria-live="polite">
                {open ? (
                  <>
                    Đang áp dụng <strong className="font-medium text-text">{shown.name}</strong>
                    {shown.ends_on && <> đến hết {ddmm(shown.ends_on)}</>}
                    {shown.slots ? <> · giới hạn {shown.slots} suất</> : null}
                  </>
                ) : (
                  <>
                    Mở đăng ký <strong className="font-medium text-text">{shown.name}</strong> từ {ddmm(shown.starts_on)}
                  </>
                )}
              </p>
            )}
          </div>

          {shown ? (
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`chamfer reveal flex flex-col p-8 md:p-10 ${p.highlight ? "bg-ink text-white" : "bg-paper"}`}
                >
                  <p className={`label ${p.highlight ? "text-gold" : "text-gold-deep"}`}>
                    {p.highlight ? "Khuyên dùng · " : ""}
                    {PLANS[p.id].short}
                  </p>
                  <p className="mt-3 text-xl font-light">{PLANS[p.id].name.split(" · ")[1] ?? PLANS[p.id].name}</p>
                  <p className="mt-8 text-[clamp(2.4rem,4vw,3.25rem)] leading-none font-[150]">{vnd(price(p.id))}</p>
                  <ul className={`mt-8 grid gap-3 ${p.highlight ? "text-white/80" : "text-muted"}`}>
                    {p.perks.map((t) => (
                      <li key={t} className="flex gap-3">
                        <Check size={20} className={`mt-0.5 shrink-0 ${p.highlight ? "text-gold" : "text-gold-deep"}`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    {open ? (
                      <Link href={`/hoc-vien/dang-ky?goi=${p.id}`} className={`btn w-full ${p.highlight ? "btn-gold" : "btn-ink"}`}>
                        Chọn {PLANS[p.id].short}
                      </Link>
                    ) : (
                      <a href="/pre-order" className={`btn w-full ${p.highlight ? "btn-gold" : "btn-ink"}`}>
                        Giữ suất giá {shown.name.split(" · ")[0]}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 bg-paper p-8">Khóa tiếp theo đang nhận đăng ký chờ. Đặt lịch trao đổi để được báo sớm nhất.</p>
          )}

          {all.length > 1 && (
            <div className="reveal mt-14 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <caption className="sr-only">Học phí theo đợt</caption>
                <thead>
                  <tr className="border-b border-ink/20">
                    {["Đợt", "Thời gian", "Khóa 1", "Khóa 2", "Combo"].map((h) => (
                      <th key={h} scope="col" className="label py-4 pr-4 !text-[0.68rem] text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {all.map((w) => {
                    const isCur = current?.id === w.id;
                    return (
                      <tr key={w.id} className={`border-b border-ink/10 ${isCur ? "bg-gold-soft" : ""}`} aria-current={isCur ? "true" : undefined}>
                        <th scope="row" className="py-4 pr-4 font-normal">
                          {w.name}
                          {isCur && <span className="label ml-3 !text-[0.6rem] text-gold-deep">Đang áp dụng</span>}
                        </th>
                        <td className="py-4 pr-4 text-muted">
                          {w.ends_on ? `${ddmm(w.starts_on)} – ${ddmm(w.ends_on)}` : `Từ ${ddmm(w.starts_on)}`}
                        </td>
                        <td className="py-4 pr-4">{vnd(w.price_k1)}</td>
                        <td className="py-4 pr-4">{vnd(w.price_k2)}</td>
                        <td className="py-4 pr-4">{vnd(w.price_combo)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="chamfer reveal mt-14 grid gap-6 bg-gold p-8 text-ink-2 md:grid-cols-[auto_1fr] md:items-center md:p-10">
            <p className="text-[clamp(2.4rem,4vw,3.5rem)] leading-none font-[150]">100%</p>
            <p className="text-lg">
              <strong className="font-medium">Hoàn học phí trong 7 ngày đầu.</strong> Học tuần đầu, làm bài tập tuần 1; nếu thấy
              không phù hợp, nhắn đội ngũ để được hoàn toàn bộ. Khóa học không cam kết thu nhập.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="label reveal text-gold-deep">Câu hỏi thường gặp</p>
            <h2 className="h2 reveal mt-5">Trước khi đăng ký</h2>
            <Link href="/dat-lich?muc-dich=hoc" className="btn btn-ink reveal mt-10">
              Hỏi trực tiếp
            </Link>
          </div>
          <ul className="border-t border-line">
            {faqs.map((f) => (
              <li key={f.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-light [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus size={22} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="pb-6 text-muted">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </>
  );
}
