import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thehoshi.to",
      },
      {
        protocol: "https",
        hostname: "store.mediathehoshi.online",
      },
      {
        protocol: "https",
        hostname: "thehoshi.is",
      },
      {
        protocol: "https",
        hostname: "www.thehoshi.com",
      },
    ],
  },
};

export default nextConfig;
