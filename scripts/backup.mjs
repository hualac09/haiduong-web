// Sao lưu SQLite an toàn khi site đang chạy (dùng backup API), giữ 30 bản gần nhất.
// Dùng: DATA_DIR=/var/www/haiduong/data node scripts/backup.mjs /var/www/haiduong/backups
import { DatabaseSync, backup } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve(process.env.DATA_DIR || "data");
const outDir = path.resolve(process.argv[2] || "backups");
fs.mkdirSync(outDir, { recursive: true });

const src = new DatabaseSync(path.join(dataDir, "haiduong.db"));
const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
const dest = path.join(outDir, `haiduong-${stamp}.db`);
await backup(src, dest);
src.close();

const old = fs
  .readdirSync(outDir)
  .filter((f) => /^haiduong-.*\.db$/.test(f))
  .sort()
  .reverse()
  .slice(30);
for (const f of old) fs.unlinkSync(path.join(outDir, f));
console.log(`${new Date().toISOString()} backup -> ${dest}`);
