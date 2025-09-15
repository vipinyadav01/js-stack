import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
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
  distDir: '.next',
};

export default nextConfig;
