import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Monogram } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-ink-2 text-white/75">
      <div className="wrap grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 text-white" aria-label="Hải Đường, về trang chủ">
            <Monogram size={36} />
            <span className="text-lg font-medium tracking-[0.14em] uppercase">Hải Đường</span>
          </Link>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">
            Môi giới penthouse, biệt thự và căn hộ hạng sang tại TP.HCM. Founder {site.company}.
          </p>
        </div>
        <div>
          <p className="label text-gold">Khám phá</p>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dat-lich" className="hover:text-gold">
                Đặt lịch tư vấn
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-gold">Kênh</p>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={site.zaloGroup} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Nhóm Zalo Hải Đường + Partners
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-gold">Văn phòng</p>
          <address className="mt-5 grid gap-3 text-[0.95rem] not-italic">
            <span>{site.address}</span>
            <a href={`tel:${site.phone}`} className="hover:text-gold">
              {site.phoneDisplay}
            </a>
            <a href={site.zalo} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              Zalo {site.phoneDisplay}
            </a>
          </address>
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Hải Đường · {site.company}</p>
        <p className="flex gap-5">
          <Link href="/chinh-sach-bao-mat" className="hover:text-gold">
            Chính sách bảo mật
          </Link>
          <span>Thông tin thị trường chỉ để tham khảo, không phải khuyến nghị đầu tư.</span>
        </p>
      </div>
    </footer>
  );
}
