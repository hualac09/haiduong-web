import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WordReveal } from "@/components/Motion";
import { PageHero, VideoCard } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Về anh Hải Đường",
  description:
    "Nguyễn Hải Đường, Founder – CEO Sunhomes Việt Nam, 10 năm môi giới bất động sản cao cấp, hơn 650 video dẫn xem penthouse và biệt thự tại TP.HCM.",
  alternates: { canonical: "/gioi-thieu" },
};

const principles = [
  {
    n: "01",
    title: "Xem tận nơi, quay tận nơi",
    body: "Anh Đường vẫn trực tiếp dẫn khách xem từng penthouse, duplex, biệt thự và quay lại toàn bộ. Bạn thấy căn thật, ánh sáng thật, view thật trước khi mất một buổi chiều.",
  },
  {
    n: "02",
    title: "Nói giá thật",
    body: "Mỗi video đều có giá. Khi tư vấn, anh đặt giá chủ đầu tư, giá chuyển nhượng và chính sách ưu đãi cạnh nhau để bạn tự thấy đâu là mức hợp lý.",
  },
  {
    n: "03",
    title: "Số liệu trước, cảm xúc sau",
    body: "Phân tích thị trường luôn kèm nguồn (DKRA, VARS, báo chí chính thống) và ghi rõ: thông tin tham khảo, không phải khuyến nghị đầu tư.",
  },
  {
    n: "04",
    title: "Kín đáo là mặc định",
    body: "Thông tin chủ nhà, người mua và giá chốt không xuất hiện trên mạng. Căn cần bán kín được giới thiệu riêng cho khách đã xác minh.",
  },
];

const areas = ["Thủ Thiêm", "Thảo Điền", "Ba Son · Quận 1", "An Phú", "TP. Thủ Đức", "Cần Giờ", "Hồ Tràm · Vũng Tàu"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Về anh Đường"
        title="Nguyễn Hải Đường"
        lead={`Founder – CEO ${site.company}. 10 năm môi giới penthouse, biệt thự và căn hộ hạng sang tại TP.HCM, người đứng sau kênh YouTube bất động sản cao cấp với hơn 650 video dẫn xem căn thật.`}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="chamfer chamfer-lg reveal relative aspect-[4/5] overflow-hidden bg-ink">
            <Image
              src="/images/gateway-thao-dien.jpg"
              alt="Anh Hải Đường dẫn khách xem penthouse Gateway Thảo Điền"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[68%_center]"
            />
          </div>
          <div>
            <p className="label reveal text-gold-deep">Câu chuyện</p>
            <h2 className="h2 reveal mt-5">Từ người dẫn xem căn đến người xây đội môi giới cao cấp.</h2>
            <div className="reveal mt-8 grid gap-5 text-lg text-muted">
              <p>
                Mười năm trong nghề, anh Đường đi lên phân khúc mà rất ít môi giới chạm tới: penthouse trăm tỷ ở Thủ Thiêm,
                biệt thự 560 tỷ ở Ba Son.
              </p>
              <p>
                Cách anh làm khác ở một điểm: quay lại mọi buổi dẫn xem và đăng công khai, kèm giá. Kênh YouTube{" "}
                <a href={site.socials[0].href} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                  @haiduongvillas
                </a>{" "}
                có 40,6K người đăng ký; nhiều video có tiêu đề song ngữ cho khách nước ngoài.
              </p>
              <p>
                Hôm nay anh điều hành Sunhomes Việt Nam, công ty môi giới bất động sản cao cấp và M&amp;A, và đào tạo thế hệ
                môi giới tiếp theo qua Hải Đường Academy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-white md:py-32">
        <div className="wrap">
          <p className="label text-gold">Nguyên tắc làm việc</p>
          <WordReveal
            className="mt-8 max-w-5xl text-[clamp(1.9rem,4.4vw,3.5rem)] leading-[1.15] font-extralight"
            text="Khách hàng của phân khúc này không cần thêm một người bán hàng. Họ cần một người hiểu căn, hiểu giá và giữ kín chuyện của họ."
          />
          <div className="mt-20 grid gap-px bg-white/10 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.n} className="reveal bg-ink p-8 md:p-10">
                <p className="label text-gold">{p.n}</p>
                <h3 className="h3 mt-4">{p.title}</h3>
                <p className="mt-4 text-white/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="label reveal text-gold-deep">Con số</p>
            <h2 className="h2 reveal mt-5">Uy tín được xây bằng thứ ai cũng kiểm chứng được.</h2>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {site.stats.map((s) => (
              <div key={s.label} className="chamfer reveal bg-mist p-7">
                <dt className="text-muted">{s.label}</dt>
                <dd className="mt-4 text-5xl font-[150]">
                  {s.value}
                  {s.unit && <span className="ml-2 text-lg font-light text-muted">{s.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="wrap mt-20">
          <p className="label reveal text-gold-deep">Khu vực am hiểu</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {areas.map((a) => (
              <li key={a} className="reveal rounded-full border border-line px-5 py-2.5 text-[0.95rem]">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink-2 py-24 text-white md:py-32">
        <div className="wrap">
          <p className="label text-gold">Xem anh Đường làm việc</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <VideoCard id="rjCOJFgHozs" title="Penthouse The Opera Thủ Thiêm 250 tỷ" meta="Thủ Thiêm" />
            <VideoCard id="LOp41yAgoac" title="Pool Villa The River Thủ Thiêm 120 tỷ" meta="Thủ Thiêm" />
            <VideoCard id="XIHD5oEDJao" title="Tiến độ khu đô thị Thủ Thiêm 2026" meta="Cập nhật dự án" />
          </div>
          <div className="mt-16 flex flex-wrap gap-3">
            <Link href="/dat-lich" className="btn btn-gold">
              Đặt lịch với anh Đường
            </Link>
            <Link href="/hoc-vien" className="btn btn-ghost">
              Học cùng anh Đường
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
