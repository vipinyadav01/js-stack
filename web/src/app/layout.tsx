import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "JS-Stack CLI - Modern Full-Stack JavaScript Development Tool",
    template: "%s | JS-Stack CLI",
  },
  description:
    "JS-Stack CLI (create-js-stack) - A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects. Create JS projects instantly with React, Next.js, Node.js, Express, databases, authentication, and more. Save hours of setup time with our comprehensive JavaScript project generator.",
  keywords: [
    "js",
    "jsstack",
    "js-stack",
    "createjs",
    "create jsstack",
    "create-js-stack",
    "javascript cli",
    "javascript project generator",
    "react boilerplate",
    "nextjs starter",
    "nodejs scaffolding",
    "full-stack cli",
    "project generator",
    "development tool",
    "web development cli",
    "javascript framework",
    "react template",
    "express generator",
    "full-stack development",
    "javascript project setup",
    "modern web development",
    "development productivity",
    "code scaffolding",
    "project initialization",
    "typescript cli",
    "typescript boilerplate",
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
    title:
      "JS-Stack CLI (create-js-stack) - Create Modern Full-Stack JavaScript Applications Instantly",
    description:
      "JS-Stack CLI - The ultimate tool for creating JavaScript projects. Scaffold production-ready JS applications with React, Next.js, Node.js, databases, authentication, and more. Start building in seconds, not hours.",
    url: siteUrl,
    siteName: "JS-Stack CLI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "JS-Stack CLI - Modern Full-Stack Development Tool",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jsstack_cli",
    creator: "@vipinyadav",
    title:
      "JS-Stack CLI (create-js-stack) - Create Modern Full-Stack Apps Instantly",
    description:
      "JS-Stack CLI - Create JavaScript projects instantly. The ultimate CLI for JS full-stack development. React, Next.js, Node.js, databases & more. Production-ready in seconds.",
    images: {
      url: "/opengraph-image",
      alt: "JS-Stack CLI - Modern Full-Stack Development Tool",
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
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
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
        {/* Google Tag Manager - Placed as high as possible in <head> */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
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
