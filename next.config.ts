import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};

export default nextConfig;
