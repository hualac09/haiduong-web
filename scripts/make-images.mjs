// Xuất ảnh web từ khung hình gốc (PNG 4K cắt từ video YouTube của anh Đường).
// Dùng: node scripts/make-images.mjs <thư-mục-png> <file-chọn.json>
// File chọn: { "<slug>": ["<id>_<giây>", ...] }  phần tử đầu là ảnh bìa, còn lại vào thư viện ảnh.
// Kết quả: public/images/can/<slug>/01.webp, 02.webp, ... và in ra JSON để cập nhật seed.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [src, pickFile] = process.argv.slice(2);
const picks = JSON.parse(fs.readFileSync(pickFile, "utf8"));
const out = {};

for (const [slug, frames] of Object.entries(picks)) {
  const dir = path.join("public", "images", "can", slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  out[slug] = frames.map((f, i) => {
    const name = `${String(i + 1).padStart(2, "0")}.webp`;
    const width = i === 0 ? 2400 : 1920;
    execFileSync("ffmpeg", [
      "-loglevel", "error", "-y",
      "-i", path.join(src, `${f}.png`),
      // Cắt 15% phía trên (logo, bảng tên) và 6% phía dưới (phụ đề) của khung hình gốc.
      "-vf", `crop=iw:ih*0.79:0:ih*0.15,scale=${width}:-2:flags=lanczos,unsharp=5:5:0.45:5:5:0`,
      "-c:v", "libwebp", "-quality", "80", "-compression_level", "6",
      path.join(dir, name),
    ]);
    return `/images/can/${slug}/${name}`;
  });
}
console.log(JSON.stringify(out, null, 2));
