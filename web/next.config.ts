import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "export", // Enable static export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  eslint: {
    // During builds, we'll run ESLint separately
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Type checking is done separately, so we can ignore during builds if needed
    ignoreBuildErrors: false,
  },
  // Ensure static export works properly
  distDir: ".next",
};

export default nextConfig;
