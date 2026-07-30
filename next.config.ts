import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Header ramah browser TV / WebView untuk streaming MP4 (range request)
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
