#!/usr/bin/env bash
# Cài đặt một lần trên VPS Hostinger (Ubuntu 22.04/24.04), chạy bằng root:
#   curl -fsSL https://raw.githubusercontent.com/<tai-khoan>/<repo>/main/deploy/setup-vps.sh -o setup-vps.sh
#   sudo DOMAIN=haiduong.vn REPO=git@github.com:<tai-khoan>/<repo>.git EMAIL=ban@email.com bash setup-vps.sh
#
# Script tạo user "deploy", cài Node 24, Nginx, PM2, Certbot; clone repo vào /var/www/haiduong/app;
# dữ liệu (SQLite + ảnh tải lên) nằm riêng ở /var/www/haiduong/data để deploy lại không mất.
set -euo pipefail

: "${DOMAIN:?Thiếu DOMAIN, ví dụ DOMAIN=haiduong.vn}"
: "${REPO:?Thiếu REPO, ví dụ REPO=git@github.com:ten/haiduong-web.git}"
: "${EMAIL:?Thiếu EMAIL để đăng ký chứng chỉ HTTPS}"
BASE=/var/www/haiduong
APP=$BASE/app
DATA=$BASE/data

echo "==> Gói hệ thống"
apt-get update -y
apt-get install -y curl git nginx ufw ca-certificates gnupg certbot python3-certbot-nginx

echo "==> Node.js 24"
if ! node -v 2>/dev/null | grep -q '^v24'; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2@6

echo "==> User deploy"
id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
mkdir -p "$APP" "$DATA/uploads" "$BASE/backups" "$BASE/logs"
chown -R deploy:deploy "$BASE"
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh

if [ ! -f /home/deploy/.ssh/id_ed25519 ]; then
  sudo -u deploy ssh-keygen -t ed25519 -N "" -f /home/deploy/.ssh/id_ed25519 -C "deploy@$DOMAIN"
fi
sudo -u deploy bash -c 'ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null'
echo
echo "------------------------------------------------------------------"
echo "Thêm khóa sau vào GitHub: repo → Settings → Deploy keys → Add (chỉ đọc):"
cat /home/deploy/.ssh/id_ed25519.pub
echo "------------------------------------------------------------------"
read -r -p "Đã thêm Deploy key xong? Nhấn Enter để tiếp tục..."

# Khóa thứ hai: để GitHub Actions SSH vào VPS chạy deploy.sh. Chỉ dùng cho việc này.
if [ ! -f /home/deploy/.ssh/actions_ed25519 ]; then
  sudo -u deploy ssh-keygen -t ed25519 -N "" -f /home/deploy/.ssh/actions_ed25519 -C "github-actions@$DOMAIN"
  sudo -u deploy bash -c 'cat ~/.ssh/actions_ed25519.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
fi
echo
echo "------------------------------------------------------------------"
echo "Dán TOÀN BỘ khóa dưới đây vào GitHub: repo → Settings → Secrets and variables → Actions"
echo "→ New repository secret, tên VPS_SSH_KEY. Thêm secret VPS_HOST = IP của VPS."
cat /home/deploy/.ssh/actions_ed25519
echo "------------------------------------------------------------------"
read -r -p "Đã thêm 2 secret xong? Nhấn Enter để tiếp tục..."

echo "==> Clone mã nguồn"
if [ ! -d "$APP/.git" ]; then
  sudo -u deploy git clone "$REPO" "$APP"
fi

if [ ! -f "$APP/.env" ]; then
  echo "==> Tạo .env (sửa lại các giá trị trống sau khi chạy xong)"
  SECRET=$(openssl rand -base64 48 | tr -d '\n')
  sudo -u deploy bash -c "cat > '$APP/.env'" <<EOF
SITE_URL=https://$DOMAIN
DATA_DIR=$DATA
PORT=3000
ADMIN_EMAIL=$EMAIL
ADMIN_PASSWORD_HASH=
SESSION_SECRET=$SECRET
BANK_BIN=
BANK_ACCOUNT=
BANK_ACCOUNT_NAME=
SEPAY_API_KEY=$(openssl rand -hex 24)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
EOF
  chmod 600 "$APP/.env"
fi

echo "==> Build lần đầu"
sudo -u deploy bash -c "cd '$APP' && npm ci && DATA_DIR='$DATA' npm run seed && npm run build"
sudo -u deploy bash -c "cd '$APP' && pm2 start deploy/ecosystem.config.cjs && pm2 save"
env PATH="$PATH:/usr/bin" pm2 startup systemd -u deploy --hp /home/deploy >/dev/null

echo "==> Nginx"
sed "s/__DOMAIN__/$DOMAIN/g" "$APP/deploy/nginx.conf" > /etc/nginx/sites-available/haiduong
ln -sf /etc/nginx/sites-available/haiduong /etc/nginx/sites-enabled/haiduong
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Tường lửa"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> HTTPS (Let's Encrypt). Tên miền phải trỏ A record về IP VPS trước bước này."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || \
  echo "!! Certbot lỗi: kiểm tra DNS rồi chạy lại: certbot --nginx -d $DOMAIN -d www.$DOMAIN"

echo "==> Sao lưu database mỗi đêm 02:30"
( crontab -u deploy -l 2>/dev/null | grep -v haiduong-backup; \
  echo "30 2 * * * cd $APP && DATA_DIR=$DATA node scripts/backup.mjs $BASE/backups >> $BASE/backups/backup.log 2>&1 # haiduong-backup" ) | crontab -u deploy -

echo
echo "Xong. Việc còn lại:"
echo "  1. Tạo mật khẩu admin:  sudo -u deploy bash -c 'cd $APP && npm run admin:password -- \"mat-khau-cua-ban\"'"
echo "     rồi dán dòng ADMIN_PASSWORD_HASH=... vào $APP/.env"
echo "  2. Điền BANK_*, TELEGRAM_* trong $APP/.env"
echo "  3. Khởi động lại:  sudo -u deploy pm2 reload haiduong"
echo "  4. SePay webhook URL: https://$DOMAIN/api/webhooks/sepay , API Key = giá trị SEPAY_API_KEY trong .env"
