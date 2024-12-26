import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
  },
  // 移除 i18n 配置，因为它可能会干扰 URL 编码
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Accept-Charset',
            value: 'utf-8'
          },
        ],
      },
    ]
  }
};

export default nextConfig;