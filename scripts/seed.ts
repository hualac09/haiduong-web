// Nạp dữ liệu khởi đầu: các căn anh Đường đã giới thiệu trên YouTube (mã video đã đối chiếu
// với YouTube oEmbed ngày 28/10/2026), học phí 4 đợt, hai bài phân tích thị trường và lịch tư vấn mẫu.
// Chạy: npm run seed            (chỉ nạp khi bảng còn trống)
//       npm run seed -- --reset (xóa listings/posts/waves/slots rồi nạp lại)
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "../src/lib/schema.ts";

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, "haiduong.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec(SCHEMA);

const reset = process.argv.includes("--reset");
if (reset) db.exec("DELETE FROM listings; DELETE FROM posts; DELETE FROM waves; DELETE FROM slots WHERE booking_id IS NULL;");

const empty = (t: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n === 0;

const NOTE =
  "\n\nGiá và tình trạng theo thời điểm quay video. Căn có thể đã giao dịch hoặc thay đổi giá; liên hệ để nhận thông tin hiện tại và các căn tương tự chưa công khai.";

type L = {
  slug: string;
  title: string;
  project: string;
  district: string;
  kind: string;
  price_label: string;
  price_billion: number | null;
  area_m2?: number;
  bedrooms?: number;
  summary: string;
  youtube_id: string;
  /** Khung hình tự động của YouTube (1–3) không có chữ chèn, dùng làm ảnh bìa. */
  frame: number;
  featured?: boolean;
};

const listings: L[] = [
  {
    slug: "biet-thu-vinhomes-golden-river-ba-son-560-ty",
    title: "Biệt thự Vinhomes Golden River Ba Son",
    project: "Vinhomes Golden River",
    district: "Quận 1",
    kind: "biet-thu",
    price_label: "560 tỷ",
    price_billion: 560,
    summary: "Biệt thự trong khu biệt thự Ba Son, Quận 1: căn giá trị nhất anh Đường từng giới thiệu trên kênh.",
    youtube_id: "ASN0_1hxNEE",
    frame: 3,
    featured: true,
  },
  {
    slug: "penthouse-the-opera-thu-thiem-250-ty",
    title: "Penthouse The Opera Thủ Thiêm",
    project: "The Metropole Thủ Thiêm",
    district: "Thủ Thiêm",
    kind: "penthouse",
    price_label: "250 tỷ",
    price_billion: 250,
    summary: "Penthouse ba tầng tại tháp A The Opera Residences, trần cao 5,6 m, sân thượng tầng 25, nhìn thẳng sông Sài Gòn và Quận 1.",
    youtube_id: "rjCOJFgHozs",
    frame: 1,
    featured: true,
  },
  {
    slug: "penthouse-define-205-ty",
    title: "Penthouse Define",
    project: "Define · CapitaLand",
    district: "TP. Thủ Đức",
    kind: "penthouse",
    price_label: "205 tỷ",
    price_billion: 205,
    summary: "Penthouse Define (Quận 2 cũ) của CapitaLand. Video phân tích vì sao căn này có mức giá 205 tỷ.",
    youtube_id: "1ZWrRlwYua0",
    frame: 2,
    featured: true,
  },
  {
    slug: "penthouse-zeit-river-thu-thiem-149-ty",
    title: "Penthouse Zeit River",
    project: "Zeit River",
    district: "Thủ Thiêm",
    kind: "penthouse",
    price_label: "149 tỷ",
    price_billion: 149,
    area_m2: 392,
    summary: "Penthouse 392 m² (khoảng 5,7 triệu USD) hướng skyline TP.HCM.",
    youtube_id: "HgFFSDJ5zBk",
    frame: 1,
    featured: true,
  },
  {
    slug: "pool-villa-the-river-thu-thiem-120-ty",
    title: "Pool Villa The River Thủ Thiêm",
    project: "The River Thủ Thiêm",
    district: "Thủ Thiêm",
    kind: "biet-thu",
    price_label: "120 tỷ",
    price_billion: 120,
    summary: "Pool villa trên cao tại The River: giá trị đầu tư hay xa xỉ? Anh Đường phân tích trong video.",
    youtube_id: "LOp41yAgoac",
    frame: 1,
    featured: true,
  },
  {
    slug: "penthouse-gateway-thao-dien-118-ty",
    title: "Penthouse Gateway Thảo Điền",
    project: "Gateway Thảo Điền",
    district: "Thảo Điền",
    kind: "penthouse",
    price_label: "118 tỷ",
    price_billion: 118,
    summary: "Penthouse tại khu nhà giàu Thảo Điền, được so sánh với penthouse New York.",
    youtube_id: "KgMHE_Lw15Q",
    frame: 3,
    featured: true,
  },
  {
    slug: "duplex-empire-city-110-ty",
    title: "Duplex Empire City vườn riêng",
    project: "Empire City",
    district: "Thủ Thiêm",
    kind: "duplex",
    price_label: "110 tỷ",
    price_billion: 110,
    area_m2: 266,
    summary: "Duplex 266 m² có vườn riêng tư tại Empire City Thủ Thiêm.",
    youtube_id: "IRcs-AvdtuA",
    frame: 1,
  },
  {
    slug: "penthouse-dedge-thao-dien-80-ty",
    title: "Penthouse D’Edge Thảo Điền",
    project: "D’Edge Thảo Điền",
    district: "Thảo Điền",
    kind: "penthouse",
    price_label: "80 tỷ",
    price_billion: 80,
    bedrooms: 5,
    summary: "Penthouse 5 phòng ngủ có hồ bơi thủy liệu.",
    youtube_id: "wd-dPsCoBss",
    frame: 2,
  },
  {
    slug: "penthouse-feliz-en-vista-70-ty",
    title: "Penthouse Feliz en Vista",
    project: "Feliz en Vista",
    district: "TP. Thủ Đức",
    kind: "penthouse",
    price_label: "70 tỷ",
    price_billion: 70,
    area_m2: 407,
    bedrooms: 5,
    summary: "Penthouse 407 m², 5 phòng ngủ, nhìn sông Sài Gòn.",
    youtube_id: "dR6AQ3mqgnY",
    frame: 1,
  },
  {
    slug: "can-ho-vinhomes-golden-river-vong-cung-50-ty",
    title: "Căn hộ vòng cung view panorama",
    project: "Vinhomes Golden River",
    district: "Quận 1",
    kind: "can-ho",
    price_label: "50 tỷ",
    price_billion: 50,
    area_m2: 121,
    bedrooms: 3,
    summary: "Căn 3 phòng ngủ 121 m² tại Ba Son, mặt kính vòng cung nhìn toàn cảnh.",
    youtube_id: "UrPvEuWJ1Q0",
    frame: 1,
  },
  {
    slug: "vinhomes-golden-river-4pn-cho-thue-120-trieu",
    title: "Căn hộ 4 phòng ngủ tiêu chuẩn khách sạn",
    project: "Vinhomes Golden River",
    district: "Quận 1",
    kind: "can-ho",
    price_label: "120 tr/tháng",
    price_billion: null,
    area_m2: 160,
    bedrooms: 4,
    summary: "Cho thuê căn 4 phòng ngủ 160 m², nội thất chuẩn khách sạn 5 sao.",
    youtube_id: "F8-Dy9y7obM",
    frame: 1,
  },
  {
    slug: "the-river-thu-thiem-4pn-cho-thue-100-trieu",
    title: "The River Thủ Thiêm 4 phòng ngủ",
    project: "The River Thủ Thiêm",
    district: "Thủ Thiêm",
    kind: "can-ho",
    price_label: "100 tr/tháng",
    price_billion: null,
    area_m2: 202,
    bedrooms: 4,
    summary: "Cho thuê căn 202 m² đầy đủ nội thất.",
    youtube_id: "7qDgMwDf2cs",
    frame: 2,
  },
  {
    slug: "sunwah-pearl-3pn-cho-thue-100-trieu",
    title: "Sunwah Pearl 3 phòng ngủ view skyline",
    project: "Sunwah Pearl",
    district: "Bình Thạnh",
    kind: "can-ho",
    price_label: "100 tr/tháng",
    price_billion: null,
    area_m2: 125,
    bedrooms: 3,
    summary: "Căn 125 m² nhìn trọn skyline Sài Gòn, cho thuê.",
    youtube_id: "uB59MdePgaI",
    frame: 3,
  },
];

// Ảnh 4K cắt từ video (scripts/make-images.mjs): phần tử đầu là ảnh bìa, còn lại là thư viện ảnh.
// Căn nào có ít hơn 3 ảnh thì giữ ảnh bìa khung hình YouTube và đưa hết ảnh mới vào thư viện.
const IMAGES: Record<string, string[]> = JSON.parse(
  fs.readFileSync(new URL("./listing-images.json", import.meta.url), "utf8"),
);
function imagesFor(l: L): { cover: string; gallery: string[] } {
  const imgs = IMAGES[l.slug] ?? [];
  const yt = `https://i.ytimg.com/vi/${l.youtube_id}/maxres${l.frame}.jpg`;
  return imgs.length >= 3 ? { cover: imgs[0], gallery: imgs.slice(1) } : { cover: yt, gallery: imgs };
}

if (empty("listings")) {
  const ins = db.prepare(
    `INSERT INTO listings (slug, title, project, district, kind, status, price_label, price_billion, area_m2, bedrooms, summary, body, cover, gallery, youtube_id, featured, sort)
     VALUES (?, ?, ?, ?, ?, 'da-gioi-thieu', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  listings.forEach((l, i) =>
    ins.run(
      l.slug,
      l.title,
      l.project,
      l.district,
      l.kind,
      l.price_label,
      l.price_billion,
      l.area_m2 ?? null,
      l.bedrooms ?? null,
      l.summary,
      l.summary + NOTE,
      imagesFor(l).cover,
      JSON.stringify(imagesFor(l).gallery),
      l.youtube_id,
      l.featured ? 1 : 0,
      i,
    ),
  );
  console.log(`listings: ${listings.length}`);
}

if (empty("waves")) {
  // Bảng học phí đã chốt trong hai-duong-academy/HUONG-DAN.md.
  const ins = db.prepare(
    "INSERT INTO waves (name, starts_on, ends_on, price_k1, price_k2, price_combo, slots) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  ins.run("Đợt 1 · Founding member", "2026-11-01", "2026-11-05", 3_000_000, 4_500_000, 6_900_000, 30);
  ins.run("Đợt 2 · Early bird", "2026-11-06", "2026-11-15", 3_500_000, 5_500_000, 7_900_000, null);
  ins.run("Đợt 3 · Last call", "2026-11-16", "2026-11-28", 3_900_000, 5_900_000, 8_900_000, null);
  ins.run("Giá chính thức", "2026-12-01", null, 4_900_000, 6_900_000, 9_900_000, null);
  console.log("waves: 4");
}

if (empty("posts")) {
  const ins = db.prepare(
    "INSERT INTO posts (slug, title, excerpt, body, cover, topic, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );
  // Hai bài dưới đây chuyển thể từ bài anh Đường đã đăng trên tab Cộng đồng YouTube (16–17/10/2026).
  ins.run(
    "thi-truong-bds-tphcm-quy-3-2026",
    "Thị trường BĐS TP.HCM quý III/2026: người mua chững lại, người bán bắt đầu chịu áp lực",
    "DKRA ghi nhận nguồn cung căn hộ sơ cấp giảm 31%, sức cầu giảm 66%, giá thứ cấp giảm 4–7%. Ba điều nên làm trước khi xuống tiền.",
    `DKRA công bố báo cáo quý III/2026 ngày 12/10. Những điểm đáng chú ý:

## Căn hộ

- Nguồn cung sơ cấp khoảng **13.215 căn**, giảm 31% so với quý trước; sản phẩm mới chỉ hơn 4.000 căn vì nhiều chủ đầu tư lùi lịch mở bán sang cuối năm.
- Sức cầu giảm **66%** khi khách hàng thận trọng trước áp lực lãi suất và kiểm soát tín dụng.
- Giá căn hộ thứ cấp giảm phổ biến **4–7%**; chủ đầu tư đẩy mạnh chiết khấu, giãn tiến độ và hỗ trợ lãi vay.

## Nhà phố, biệt thự

- Giá thứ cấp giảm bình quân **13%** do áp lực lãi vay và đòn bẩy, trong khi giá sơ cấp vẫn neo cao.
- Lượng tiêu thụ giảm 27%, tập trung ở nhóm dưới 10 tỷ đồng/căn.

## Dự báo quý IV

Nguồn cung căn hộ mới có thể đạt 7.000–10.000 căn; nhu cầu cuối năm hỗ trợ sức cầu nhưng khó tạo đột biến.

## Góc nhìn của tôi

1. So sánh giá sơ cấp, thứ cấp và chính sách ưu đãi cùng lúc, đừng chỉ nhìn một nguồn.
2. Tính dòng tiền ở mức lãi thả nổi, không chỉ lãi ưu đãi. Một phân tích trên Vietstock ghi nhận lãi vay mua nhà thả nổi quanh 13–15%/năm.
3. Ưu tiên dự án pháp lý rõ, hạ tầng kết nối và thanh khoản tốt.

*Nguồn: báo cáo DKRA quý III/2026, Vnbusiness, Báo Mới, Vietstock. Thông tin tham khảo, không phải khuyến nghị đầu tư.*`,
    "/images/goc-nhin/thu-thiem-tren-cao.webp",
    "Thị trường",
    1,
    "2026-10-16 09:00:00",
  );
  ins.run(
    "bat-dong-san-sau-con-sot-ty-le-giao-dich-49",
    "“Bất động sản sau cơn sốt”: tỷ lệ giao dịch thành công hàng sơ cấp chỉ còn 49%",
    "Giá thứ cấp đã giảm, nhưng giá bán trực tiếp từ chủ đầu tư chưa điều chỉnh nhiều. Khoảng chênh này là cơ hội đàm phán cho người mua.",
    `Tại hội thảo “Bất động sản sau cơn sốt” sáng 15/10/2026, tỷ lệ giao dịch thành công của nhóm hàng sơ cấp được nêu ở mức **49%**, thấp hơn mức khoảng **62%** cùng kỳ năm trước.

Giá thứ cấp đã có dấu hiệu giảm, nhưng giá bán trực tiếp từ chủ đầu tư thì chưa điều chỉnh nhiều.

## Điều này có ý nghĩa gì với người mua phân khúc cao cấp

Khi giá sơ cấp và thứ cấp lệch nhau, căn chuyển nhượng trong cùng dự án thường là điểm đàm phán tốt nhất. Hãy đặt hai mức giá cạnh nhau, tính cả chiết khấu, hỗ trợ lãi vay và tiến độ thanh toán trước khi quyết định.

Bạn đang thấy chênh lệch này ở dự án nào? Đặt lịch trao đổi, tôi sẽ so sánh giúp bạn trên dữ liệu thật của từng căn.

*Nguồn: VnExpress (15/10/2026), số liệu VARS và phát biểu của Bộ Xây dựng. Thông tin tham khảo, không phải khuyến nghị đầu tư.*`,
    "/images/goc-nhin/hoi-thao-lotte.webp",
    "Thị trường",
    1,
    "2026-10-17 09:00:00",
  );
  console.log("posts: 2");
}

if (empty("slots")) {
  // Lịch mẫu 21 ngày tới: thứ Ba, Năm, Bảy lúc 10:00, 14:00, 16:00 (giờ Việt Nam). Sửa trong admin.
  const ins = db.prepare("INSERT OR IGNORE INTO slots (starts_at, minutes) VALUES (?, 45)");
  const now = new Date(Date.now() + 7 * 3600_000);
  let n = 0;
  for (let i = 1; i <= 21; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i));
    if (![2, 4, 6].includes(d.getUTCDay())) continue;
    const day = d.toISOString().slice(0, 10);
    for (const t of ["10:00", "14:00", "16:00"]) (ins.run(`${day} ${t}`), n++);
  }
  console.log(`slots: ${n}`);
}

db.close();
console.log("Xong.");
