import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { StructuredData } from "@/components/structured-data";

const jetbrainsMono = localFont({
  src: [
    {
      path: "../fonts/webfonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/webfonts/JetBrainsMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  fallback: [
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
});

const resolveMetadataBase = (): URL => {
  const candidate = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://js-stack.pages.dev"
  ).trim();
  try {
    // Ensure we have an absolute URL with protocol
    const normalized =
      candidate.startsWith("http://") || candidate.startsWith("https://")
        ? candidate
        : `https://${candidate}`;
    return new URL(normalized);
  } catch {
    return new URL("https://js-stack.pages.dev");
  }
};
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://js-stack.pages.dev"
).trim();
const metadataBase = resolveMetadataBase();

export const metadata: Metadata = {
  title: {
    default:
      "JS-Stack CLI - Modern Full-Stack JavaScript & TypeScript Development Tool",
    template: "%s | JS-Stack CLI",
  },
  description:
    "A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in. Features React, Next.js, Node.js, Express, databases, authentication, testing, and deployment configurations. Save hours of setup time with our comprehensive CLI tool.",
  keywords: [
    "javascript cli",
    "typescript cli",
    "react boilerplate",
    "nextjs starter",
    "nodejs scaffolding",
    "full-stack cli",
    "project generator",
    "development tool",
    "create-js-stack",
    "web development cli",
    "javascript framework",
    "typescript boilerplate",
    "react template",
    "express generator",
    "full-stack development",
    "javascript project setup",
    "modern web development",
    "development productivity",
    "code scaffolding",
    "project initialization",
  ],
  authors: [{ name: "Vipin Yadav", url: "https://github.com/vipinyadav01" }],
  creator: "Vipin Yadav",
  publisher: "JS-Stack",
  applicationName: "JS-Stack CLI",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/web-app-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/web-app-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title:
      "JS-Stack CLI - Create Modern Full-Stack JavaScript Applications Instantly",
    description:
      "The ultimate CLI tool for scaffolding production-ready JavaScript & TypeScript applications. Features React, Next.js, Node.js, databases, authentication, and more. Start building in seconds, not hours.",
    url: siteUrl,
    siteName: "JS-Stack CLI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JS-Stack CLI - Modern Full-Stack Development Tool",
        type: "image/png",
      },
      {
        url: "/web-app-512x512.png",
        width: 512,
        height: 512,
        alt: "JS-Stack CLI Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jsstack_cli",
    creator: "@vipinyadav",
    title: "JS-Stack CLI - Create Modern Full-Stack Apps Instantly",
    description:
      "The ultimate CLI for JavaScript & TypeScript full-stack development. React, Next.js, Node.js, databases & more. Production-ready in seconds.",
    images: {
      url: "/og-image.png",
      alt: "JS-Stack CLI - Modern Full-Stack Development Tool",
    },
  },
  appleWebApp: {
    capable: true,
    title: "JS-Stack CLI",
    statusBarStyle: "default",
  },
  verification: {
    // Add your verification tokens here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "technology",
  classification: "Developer Tools",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#3b82f6",
    "color-scheme": "dark light",
    "supported-color-schemes": "dark light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Enhanced Meta Tags for SEO */}
        <meta name="apple-mobile-web-app-title" content="JS-Stack CLI" />
        <meta name="application-name" content="JS-Stack CLI" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="dark light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/web-app-192x192.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//npmjs.com" />
        <link rel="dns-prefetch" href="//unpkg.com" />

        {/* Preload Critical Resources */}
        <link
          rel="preload"
          href="/web-app-512x512.png"
          as="image"
          type="image/png"
        />

        {/* Comprehensive favicon setup for development and production */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/web-app-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/web-app-512x512.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Structured Data */}
        <StructuredData type="website" />
        <StructuredData type="software" />
        <StructuredData type="organization" />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
