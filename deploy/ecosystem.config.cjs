// PM2: giữ website luôn chạy, tự khởi động lại khi lỗi hoặc khi VPS reboot.
module.exports = {
  apps: [
    {
      name: "haiduong",
      cwd: __dirname + "/..",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
      instances: 1, // SQLite: một tiến trình ghi là đủ và an toàn
      max_memory_restart: "700M",
      out_file: "/var/www/haiduong/logs/out.log",
      error_file: "/var/www/haiduong/logs/error.log",
      time: true,
    },
  ],
};
