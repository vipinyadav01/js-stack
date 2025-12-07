import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { StructuredData } from "@/components/structured-data";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { RootProvider } from "fumadocs-ui/provider";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://createjsstack.dev"
  ).trim();
  try {
    // Ensure we have an absolute URL with protocol
    const normalized =
      candidate.startsWith("http://") || candidate.startsWith("https://")
        ? candidate
        : `https://${candidate}`;
    return new URL(normalized);
  } catch {
    return new URL("https://createjsstack.dev");
  }
};
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://createjsstack.dev"
).trim();
const metadataBase = resolveMetadataBase();

const verificationMeta: Metadata["verification"] = {};
const otherVerification: Record<string, string> = {};
if (process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION) {
  verificationMeta.google = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_BING_VERIFICATION) {
  otherVerification["msvalidate.01"] =
    process.env.NEXT_PUBLIC_BING_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_YANDEX_VERIFICATION) {
  verificationMeta.yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
}
if (Object.keys(otherVerification).length > 0) {
  verificationMeta.other = otherVerification;
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  title: {
    default: "JS-Stack CLI | The Ultimate JavaScript Project Generator",
    template: "%s | JS-Stack CLI",
  },
  description:
    "Stop configuring, start building. JS-Stack CLI (create-js-stack) scaffolds production-ready full-stack applications in seconds. Features Next.js, React, Node.js, TypeScript, Tailwind CSS, Prisma, Docker, and CI/CD best practices out of the box.",
  keywords: [
    "js-stack",
    "create-js-stack",
    "javascript project generator",
    "typescript cli",
    "nextjs starter",
    "react boilerplate",
    "full-stack scaffolding",
    "nodejs framework",
    "production-ready template",
    "monorepo setup",
    "turborepo",
    "docker configuration",
    "ci/cd pipelines",
    "prisma orm",
    "shadcn/ui",
    "tailwind css components",
    "authentication ready",
    "database setup",
    "backend integration",
    "developer productivity tools",
    "web development cli",
    "express generator",
    "modern web stack",
    "code scaffolding",
    "project initialization",
    "automated setup",
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
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "JS-Stack CLI - The Ultimate JavaScript Project Generator",
    description:
      "Stop configuring, start building. Scaffold production-ready full-stack apps with Next.js, React, Node.js, and TypeScript + CI/CD, Docker, and more.",
    url: siteUrl,
    siteName: "JS-Stack CLI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "JS-Stack CLI - Modern Full-Stack Development",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jsstack_cli",
    creator: "@vipinyadav",
    title: "JS-Stack CLI - The Ultimate JavaScript Project Generator",
    description:
      "Stop configuring, start building. Scaffold production-ready full-stack apps with Next.js, React, Node.js, and TypeScript in seconds.",
    images: {
      url: "/opengraph-image",
      alt: "JS-Stack CLI - Modern Full-Stack Development",
    },
  },
  appleWebApp: {
    capable: true,
    title: "JS-Stack CLI",
    statusBarStyle: "default",
  },
  verification: verificationMeta,
  category: "technology",
  classification: "Developer Tools",
  other: {
    "mobile-web-app-capable": "yes",
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

        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//npmjs.com" />
        <link rel="dns-prefetch" href="//unpkg.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Structured Data */}
        <StructuredData type="website" />
        <StructuredData type="software" />
        <StructuredData type="organization" />
        <link rel="alternate" type="application/ld+json" href="/schema.json" />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager - Using next/script component */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `,
            }}
          />
        )}
        <GoogleTagManager />
        <RootProvider>
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
        </RootProvider>
      </body>
    </html>
  );
}
