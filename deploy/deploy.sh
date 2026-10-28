#!/usr/bin/env bash
# Chạy trên VPS bằng user deploy (GitHub Actions gọi script này sau mỗi lần push lên main).
set -euo pipefail
cd /var/www/haiduong/app

git fetch --quiet origin main
git reset --hard origin/main

npm ci --no-audit --no-fund
# Build vào thư mục tạm rồi mới đổi, để site cũ vẫn chạy trong lúc build.
NEXT_DIST_DIR=.next-build npm run build
rm -rf .next-old
[ -d .next ] && mv .next .next-old
mv .next-build .next

pm2 reload haiduong --update-env
rm -rf .next-old
echo "Deploy xong: $(git log -1 --format='%h %s')"
