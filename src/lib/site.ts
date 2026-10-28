// Thông tin thương hiệu dùng chung. Nguồn: docs/ho-so-thuong-hieu.md (cập nhật 28/10/2026).
export const site = {
  name: "Hải Đường",
  fullName: "Nguyễn Hải Đường",
  title: "Hải Đường · Chuyên gia môi giới bất động sản cao cấp",
  description:
    "Anh Hải Đường, Founder Sunhomes Việt Nam, 10 năm môi giới penthouse, biệt thự tại Thủ Thiêm, Thảo Điền, Ba Son. Tư vấn mua bán BĐS cao cấp và Hải Đường Academy cho môi giới.",
  url: (process.env.SITE_URL || "https://haiduong.vn").replace(/\/$/, ""),
  company: "Sunhomes Việt Nam",
  phone: "0906968377",
  phoneDisplay: "090 6968 377",
  address: "27 Đường số 3, Hiệp Bình Phước, Thủ Đức, TP.HCM",
  zalo: "https://zalo.me/0906968377",
  zaloGroup: "https://zalo.me/g/tilbwm856",
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/@haiduongvillas", stat: "40,6K người đăng ký" },
    { label: "TikTok", href: "https://www.tiktok.com/@haiduongsunhomes", stat: "35,4K người theo dõi" },
    { label: "Facebook", href: "https://www.facebook.com/haiduongland27", stat: "8K người theo dõi" },
    { label: "Instagram", href: "https://www.instagram.com/haiduongvillas/", stat: "" },
  ],
  stats: [
    { value: "10", unit: "năm", label: "môi giới phân khúc cao cấp" },
    { value: "655", unit: "video", label: "dẫn xem căn thật trên YouTube" },
    { value: "560", unit: "tỷ", label: "căn giá trị nhất từng giới thiệu" },
    { value: "80K+", unit: "", label: "người theo dõi YouTube, TikTok, Facebook" },
  ],
} as const;

export const nav = [
  { href: "/bat-dong-san", label: "Bất động sản" },
  { href: "/gioi-thieu", label: "Về anh Đường" },
  { href: "/hoc-vien", label: "Học viện" },
  { href: "/goc-nhin", label: "Góc nhìn" },
] as const;

export const KINDS: Record<string, string> = {
  penthouse: "Penthouse",
  "biet-thu": "Biệt thự",
  duplex: "Duplex",
  "can-ho": "Căn hộ",
  "nha-pho": "Nhà phố",
};

export const STATUSES: Record<string, string> = {
  "dang-ban": "Đang chào bán",
  "cho-thue": "Cho thuê",
  "da-ban": "Đã giao dịch",
  "da-gioi-thieu": "Đã giới thiệu",
};
