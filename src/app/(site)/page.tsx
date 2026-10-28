import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "@/components/icons";
import { WordReveal } from "@/components/Motion";
import { ListingCard, MoreLink, PostCard, SectionHead, VideoCard } from "@/components/ui";
import { featuredListings, publishedPosts } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const services = [
  {
    title: "Mua căn hạng sang",
    body: "Lọc trước những căn đáng xem trong hàng chục căn đang chào, kiểm tra pháp lý, so giá sơ cấp và chuyển nhượng, rồi dẫn bạn xem trong một buổi. Bạn chỉ gặp những căn thật sự phù hợp.",
  },
  {
    title: "Bán và ký gửi kín",
    body: "Định giá trên dữ liệu giao dịch thật, quay tour chuyên nghiệp và giới thiệu riêng cho khách đã xác minh năng lực tài chính. Không đăng tràn lan, không để căn của bạn bị rao giá lung tung.",
  },
  {
    title: "Cho thuê cao cấp",
    body: "Căn hộ 50–150 triệu/tháng cho chuyên gia nước ngoài và gia đình: chuẩn bị căn, tìm khách, hợp đồng song ngữ và chăm sóc trong suốt thời gian thuê.",
  },
  {
    title: "Khách nước ngoài và Việt kiều",
    body: "Tư vấn quyền sở hữu, hạn mức cho người nước ngoài, chuyển tiền và thủ tục. Video song ngữ giúp bạn xem căn từ xa trước khi bay về.",
  },
  {
    title: "Đầu tư và M&A dự án",
    body: "Qua Sunhomes Việt Nam: đánh giá dự án, tìm đối tác chuyển nhượng và phân phối sỉ cho chủ đầu tư.",
  },
];

const videos = [
  { id: "ASN0_1hxNEE", title: "Biệt thự 560 tỷ tại Vinhomes Golden River Ba Son", meta: "39K lượt xem", image: "/images/can/biet-thu-vinhomes-golden-river-ba-son-560-ty/01.webp" },
  { id: "KgMHE_Lw15Q", title: "Penthouse Gateway Thảo Điền không thua kém New York", meta: "26K lượt xem", image: "/images/can/penthouse-gateway-thao-dien-118-ty/02.webp" },
  { id: "KJ7cADB4410", title: "Tổng quan Lotte Eco Smart City Thủ Thiêm 2026", meta: "Cập nhật dự án", image: "/images/goc-nhin/song-sai-gon.webp" },
];

export default function Home() {
  const featured = featuredListings(6);
  const posts = publishedPosts(3);

  return (
    <>
      {/* 1. Hero toàn màn hình */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-2 text-white">
        <Image
          src="/images/hero-hoang-hon.webp"
          alt="Anh Hải Đường trên sân thượng penthouse Zeit River, phía sau là Thủ Thiêm và sông Sài Gòn lúc hoàng hôn"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-20 object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_28_24/0.55)_0%,rgb(10_28_24/0.25)_40%,rgb(10_28_24/0.92)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_28_24/0.7)_0%,rgb(10_28_24/0.2)_55%,transparent_75%)]" />
        <div className="wrap pt-36 pb-14 md:pb-20">
          <p className="label reveal text-gold">Founder {site.company} · 10 năm môi giới cao cấp</p>
          <h1 className="display reveal mt-6" style={{ ["--d" as string]: "100ms" }}>
            Căn hiếm.
            <br />
            Người hiểu.
          </h1>
          <div className="hairline reveal mt-10" style={{ ["--d" as string]: "200ms" }} />
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="lead reveal max-w-2xl text-white/85" style={{ ["--d" as string]: "260ms" }}>
              Anh Hải Đường dẫn khách xem penthouse, biệt thự từ vài chục đến 560 tỷ ở Thủ Thiêm, Thảo Điền, Ba Son. Giúp
              bạn mua đúng căn, bán đúng giá, kín đáo trong từng bước.
            </p>
            <div className="reveal flex flex-wrap gap-3" style={{ ["--d" as string]: "320ms" }}>
              <Link href="/dat-lich" className="btn btn-gold">
                Đặt lịch tư vấn
              </Link>
              <Link href="/bat-dong-san" className="btn btn-ghost">
                Xem các căn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tuyên ngôn */}
      <section className="bg-paper">
        <div className="wrap grid gap-10 py-24 md:py-36 lg:grid-cols-[1fr_2.2fr]">
          <p className="label reveal text-gold-deep">Vì sao là anh Đường</p>
          <div>
            <p className="reveal text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.18] font-extralight">
              Một căn 100 tỷ không bán bằng tin đăng.{" "}
              <span className="text-muted">Nó được bán bằng uy tín, mạng lưới và sự kín đáo.</span>
            </p>
            <p className="reveal mt-10 max-w-2xl text-lg text-muted">
              Hơn 650 video dẫn xem căn thật, quay tại chỗ, nói giá thật. Khách tìm đến anh Đường vì đã thấy anh làm việc
              trước khi gặp.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Con số */}
      <section className="bg-paper pb-24 md:pb-36">
        <div className="wrap">
          <p className="label reveal text-gold-deep">Con số</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((s, i) => (
              <div
                key={s.label}
                className="chamfer reveal flex min-h-56 flex-col justify-between bg-mist p-7"
                style={{ ["--d" as string]: `${i * 80}ms` }}
              >
                <p className="text-[clamp(3rem,5vw,4.25rem)] leading-none font-[150]">
                  {s.value}
                  {s.unit && <span className="ml-2 text-xl font-light text-muted">{s.unit}</span>}
                </p>
                <p className="mt-6 text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="chamfer chamfer-lg reveal mt-4 grid gap-10 bg-gold p-8 text-ink-2 md:grid-cols-[1.4fr_1fr] md:p-14">
            <div>
              <p className="label">Founder – CEO</p>
              <p className="mt-5 text-[clamp(1.8rem,3.6vw,3rem)] leading-tight font-extralight">
                Sunhomes Việt Nam: công ty môi giới bất động sản cao cấp và M&amp;A.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-6">
              <p className="text-lg">
                Đội ngũ chuyên căn hạng sang, làm việc trực tiếp với chủ nhà, chủ đầu tư và nhà đầu tư tổ chức.
              </p>
              <Link href="/gioi-thieu" className="link-arrow">
                Câu chuyện của anh Đường <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dịch vụ dạng accordion */}
      <section className="bg-mist py-24 md:py-36">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label reveal text-gold-deep">Làm gì cho bạn</p>
            <h2 className="h2 reveal mt-5">Việc không phải là tìm một căn. Việc là tìm đúng căn, đúng giá, đúng thời điểm.</h2>
            <Link href="/dat-lich" className="btn btn-ink reveal mt-10">
              Trao đổi riêng
            </Link>
          </div>
          <ul className="border-t border-ink/15">
            {services.map((s, i) => (
              <li key={s.title} className="reveal border-b border-ink/15">
                <details className="group" open={i === 0}>
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-baseline gap-6">
                      <span className="label text-gold-deep">0{i + 1}</span>
                      <span className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-light">{s.title}</span>
                    </span>
                    <Plus size={24} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="max-w-2xl pb-8 pl-12 text-lg text-muted">{s.body}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Danh mục: chữ sáng dần + dải căn cuộn ngang */}
      <section className="bg-ink py-24 text-white md:py-36">
        <div className="wrap">
          <p className="label text-gold">Danh mục</p>
          <WordReveal
            className="mt-8 max-w-5xl text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.15] font-extralight"
            text="Thủ Thiêm. Thảo Điền. Ba Son. Những địa chỉ mà giá trị không cần quảng cáo, chỉ cần đúng người giới thiệu."
          />
        </div>
        <div className="rail mt-16 flex gap-6 overflow-x-auto px-[max(16px,calc((100vw-1320px)/2+40px))] pb-6">
          {featured.map((l, i) => (
            <div key={l.id} className="w-[min(82vw,420px)] shrink-0">
              <ListingCard l={l} tone="dark" priority={i < 2} />
            </div>
          ))}
        </div>
        <div className="wrap mt-10">
          <MoreLink href="/bat-dong-san" tone="dark">
            Toàn bộ danh mục
          </MoreLink>
        </div>
      </section>

      {/* 6. Học viện */}
      <section className="bg-paper py-24 md:py-36">
        <div className="wrap">
          <SectionHead
            label="Hải Đường Academy"
            title="Dạy môi giới cách có khách tự tìm đến, và cách chốt những căn 20–200 tỷ."
            lead="Hai khóa 6 tuần, live mỗi tuần với anh Đường, bài tập làm ngay trên công việc thật. Mỗi tuần mổ xẻ một căn có thật trên kênh."
            action={<MoreLink href="/hoc-vien">Xem khóa học</MoreLink>}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {[
              {
                tag: "Khóa 1 · Thương hiệu cá nhân",
                name: "Personal Brand Pro",
                out: "Kênh chuẩn trên 2 nền tảng, 30 video đã đăng, phễu Zalo đang chạy.",
              },
              {
                tag: "Khóa 2 · Bán hàng cao cấp",
                name: "Luxury Closer",
                out: "Hồ sơ 20 khách VIP tiềm năng, bộ kịch bản tư vấn cao cấp, kế hoạch sự nghiệp 3 năm.",
              },
            ].map((c, i) => (
              <Link
                key={c.name}
                href="/hoc-vien"
                className="chamfer reveal group flex min-h-80 flex-col justify-between bg-ink p-8 text-white transition-colors hover:bg-ink-3 md:p-10"
                style={{ ["--d" as string]: `${i * 100}ms` }}
              >
                <p className="label text-gold">{c.tag}</p>
                <div>
                  <p className="text-[clamp(2rem,3.6vw,2.9rem)] leading-tight font-extralight">{c.name}</p>
                  <p className="mt-4 max-w-md text-white/70">Sau 6 tuần: {c.out}</p>
                  <span className="link-arrow mt-8 text-gold">
                    Chi tiết <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Video */}
      <section className="bg-ink-2 py-24 text-white md:py-36">
        <div className="wrap">
          <SectionHead
            tone="dark"
            label="Xem anh Đường làm việc"
            title="Trước khi gặp, hãy xem cách anh dẫn khách."
            action={
              <a href={site.socials[0].href} target="_blank" rel="noopener noreferrer" className="link-arrow text-gold">
                Kênh YouTube · 40,6K <ArrowRight size={18} />
              </a>
            }
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {videos.map((v) => (
              <div key={v.id} className="reveal">
                <VideoCard {...v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Góc nhìn */}
      {posts.length > 0 && (
        <section className="bg-paper py-24 md:py-36">
          <div className="wrap">
            <SectionHead
              label="Góc nhìn thị trường"
              title="Đọc thị trường bằng số liệu, không bằng cảm xúc."
              action={<MoreLink href="/goc-nhin">Tất cả bài viết</MoreLink>}
            />
            <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <div key={p.id} className="reveal">
                  <PostCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Kêu gọi cuối */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src="/images/ban-cong-dem.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink-2/80" />
        <div className="wrap flex min-h-[70vh] flex-col justify-center py-24">
          <p className="label reveal text-gold">Trao đổi riêng</p>
          <h2 className="reveal mt-6 max-w-5xl text-[clamp(2.4rem,6vw,5rem)] leading-[1.08] font-[150] uppercase">
            Sắp mua hay bán? Hãy làm điều đó kín đáo, có chiến lược.
          </h2>
          <div className="reveal mt-12 flex flex-wrap gap-3">
            <Link href="/dat-lich" className="btn btn-gold">
              Đặt lịch 45 phút
            </Link>
            <a href={`tel:${site.phone}`} className="btn btn-ghost">
              Gọi {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
