import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Opt out of Next.js 16.3 immutable static asset uploads. Vercel's build
  // adapter enables these by default (`config.supportsImmutableAssets ?? true`),
  // but the immutable upload path conflicts with Vercel's preview-comment
  // patching and fails the deploy ("Cannot patch preview comments when
  // immutable static file upload is enabled"). Disabling it lets Vercel upload
  // assets normally and patch comments.
  supportsImmutableAssets: false,
  // eslint block removed because it's no longer supported in Next.js 15+
  typescript: {
    ignoreBuildErrors: false,
  },
  distDir: ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  // Compiler & bundle optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Caching & security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Experimental features for speed & tree-shaking
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
    ],
  },

  // Turbopack empty config for Next.js 16 compatibility
  turbopack: {},

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
          },
        },
      };
    }

    // Prevent fs module errors in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
