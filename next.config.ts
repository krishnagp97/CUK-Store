import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqtob6lkp/**",
      },
    ],
  },
};

export default nextConfig;
