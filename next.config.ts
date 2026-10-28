import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // deploy.sh build vào thư mục tạm (NEXT_DIST_DIR) rồi mới đổi tên, để site không gián đoạn.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async rewrites() {
    // Landing pre-order cũ (HTML tĩnh) giữ nguyên tại /pre-order.
    return [{ source: "/pre-order", destination: "/pre-order/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
