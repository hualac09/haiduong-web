// Tạo ADMIN_PASSWORD_HASH cho file .env: npm run admin:password -- "mat-khau-cua-ban"
import { randomBytes, scryptSync } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Dùng: npm run admin:password -- "mat-khau-it-nhat-10-ky-tu"');
  process.exit(1);
}
const salt = randomBytes(16);
const key = scryptSync(pw, salt, 64);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${key.toString("hex")}`);
