# Website Hải Đường

Website giới thiệu anh Nguyễn Hải Đường (môi giới BĐS cao cấp, Founder Sunhomes Việt Nam) và bán khóa học Hải Đường Academy.

- **Công nghệ:** Next.js 16 (Node.js 24), Tailwind CSS 4, SQLite có sẵn trong Node (không cần cài database riêng).
- **Thiết kế:** lấy cảm hứng từ potomaccompany.com: tiêu đề in hoa nét mảnh, thẻ cắt chéo góc, nút viên thuốc vàng đồng, khối chữ sáng dần khi cuộn. Màu xanh rêu và đồng nối tiếp landing pre-order. Font Be Vietnam Pro (đủ dấu tiếng Việt).
- **Nội dung gốc:** [docs/ho-so-thuong-hieu.md](docs/ho-so-thuong-hieu.md), tổng hợp từ YouTube, TikTok, Facebook ngày 28/10/2026.

## Các trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ kể chuyện: hero, con số, dịch vụ, danh mục căn, học viện, video, bài viết |
| `/bat-dong-san` | Danh mục căn, lọc theo loại hình và khu vực |
| `/bat-dong-san/[slug]` | Chi tiết căn, video YouTube, form hỏi căn |
| `/gioi-thieu` | Về anh Đường |
| `/hoc-vien` | Hai khóa học, học phí theo đợt (tự đổi theo ngày), câu hỏi thường gặp |
| `/hoc-vien/dang-ky` → `/hoc-vien/thanh-toan/[mã]` | Đăng ký, VietQR, tự xác nhận khi tiền vào |
| `/goc-nhin` | Bài phân tích thị trường |
| `/dat-lich` | Đặt lịch tư vấn 45 phút theo khung giờ trống |
| `/pre-order` | Landing pre-order cũ, giữ nguyên (gửi đăng ký vào Google Sheets) |
| `/admin` | Quản trị: đơn, lịch hẹn, khách hỏi căn, căn, bài viết, học phí, xuất CSV |

Trước ngày mở đợt 1 (01/11/2026), nút đăng ký ở `/hoc-vien` dẫn sang `/pre-order`. Từ ngày mở đợt, trang tự chuyển sang thanh toán trên site.

## Chạy trên máy

```bash
npm install
cp .env.example .env.local      # rồi điền SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH
npm run admin:password -- "mat-khau-cua-ban"   # in ra ADMIN_PASSWORD_HASH=...
npm run seed                    # nạp 13 căn, 4 đợt học phí, 2 bài viết, lịch mẫu
npm run dev                     # http://localhost:3000
```

## Thanh toán tự động (SePay)

1. Đăng ký [SePay](https://sepay.vn), liên kết tài khoản ngân hàng nhận học phí.
2. Trong SePay: **Cấu hình công ty → Cấu trúc mã thanh toán**, thêm tiền tố `HD`.
3. **Tích hợp WebHooks → Thêm webhook**: sự kiện "Có tiền vào", URL `https://<tên-miền>/api/webhooks/sepay`, kiểu chứng thực **API Key**, dán giá trị `SEPAY_API_KEY` trong `.env`.
4. Điền `BANK_BIN`, `BANK_ACCOUNT`, `BANK_ACCOUNT_NAME` để trang thanh toán hiện đúng mã VietQR. Mã BIN thường gặp: Vietcombank 970436, Techcombank 970407, MB 970422, ACB 970416.

Mỗi đơn có mã dạng `HDXXXXXX`. Khách chuyển khoản đúng nội dung thì đơn tự chuyển "Đã thanh toán", trang thanh toán tự cập nhật, và bạn nhận tin Telegram. Khách chuyển sai nội dung thì xác nhận tay trong `/admin/don-hang`.

## Thông báo Telegram

1. Nhắn [@BotFather](https://t.me/BotFather) lệnh `/newbot`, lấy token, điền `TELEGRAM_BOT_TOKEN`.
2. Nhắn một tin bất kỳ cho bot vừa tạo, rồi nhắn [@userinfobot](https://t.me/userinfobot) để lấy chat id, điền `TELEGRAM_CHAT_ID`. Muốn cả nhóm nhận thì thêm bot vào nhóm và dùng id của nhóm.

Bạn sẽ nhận tin khi: có đơn mới, đơn đã thanh toán, có lịch hẹn mới, có khách hỏi căn.

## Đưa lên GitHub

```bash
git remote add origin git@github.com:<tai-khoan>/haiduong-web.git
git push -u origin main
```

## Cài VPS Hostinger (một lần)

Yêu cầu: VPS Ubuntu 22.04 hoặc 24.04, tên miền đã trỏ bản ghi A (cả `@` và `www`) về IP của VPS.

```bash
ssh root@<ip-vps>
curl -fsSL https://raw.githubusercontent.com/<tai-khoan>/haiduong-web/main/deploy/setup-vps.sh -o setup-vps.sh
DOMAIN=<ten-mien> REPO=git@github.com:<tai-khoan>/haiduong-web.git EMAIL=<email> bash setup-vps.sh
```

Nếu repo để riêng tư, tải `setup-vps.sh` bằng cách khác (ví dụ `scp` từ máy bạn) vì `raw.githubusercontent.com` cần quyền truy cập.

Script sẽ dừng hai lần để bạn:

1. Dán **Deploy key** vào GitHub (repo → Settings → Deploy keys), để VPS kéo được mã nguồn.
2. Dán khóa **VPS_SSH_KEY** và **VPS_HOST** vào GitHub Secrets, để GitHub Actions deploy được.

Sau đó script cài Node 24, Nginx, PM2, HTTPS (Let's Encrypt), tường lửa và lịch sao lưu database lúc 02:30 mỗi đêm (giữ 30 bản trong `/var/www/haiduong/backups`).

Cuối cùng, tạo mật khẩu admin và điền thông tin ngân hàng, Telegram vào `/var/www/haiduong/app/.env`, rồi chạy `sudo -u deploy pm2 reload haiduong`.

## Deploy tự động

Mỗi lần push lên `main`, GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) sẽ:

1. Kiểm tra kiểu TypeScript và build thử.
2. Nếu qua, SSH vào VPS chạy [deploy/deploy.sh](deploy/deploy.sh): kéo mã mới, build vào thư mục tạm, đổi sang bản mới và reload PM2. Site không gián đoạn trong lúc build.

Database và ảnh tải lên nằm ở `/var/www/haiduong/data`, ngoài thư mục mã nguồn, nên deploy không làm mất dữ liệu.

## Việc nên làm trước khi chạy quảng cáo

- [ ] Thay ảnh khung hình YouTube bằng ảnh chân dung và ảnh căn gốc độ phân giải cao (tải lên trong admin).
- [ ] Đọc lại trang `/gioi-thieu` và xác nhận từng chi tiết tiểu sử.
- [ ] Cập nhật tình trạng từng căn (đang bán / đã giao dịch) trong admin. Hiện tất cả để "Đã giới thiệu" vì chưa có thông tin tình trạng thực tế.
- [ ] Thêm lời chứng thực thật của khách và học viên khi có.
- [ ] Kiểm tra tên miền `nguyenhaiduong.com`: hiện đang mở ra một trang khác ("sanphamcongnghe").
