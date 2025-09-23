import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalFooter } from "@/components/ConditionalFooter";

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
  fallback: ["Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});

const resolveMetadataBase = (): URL => {
  const candidate = (process.env.NEXT_PUBLIC_SITE_URL || "https://js-stack.pages.dev").trim();
  try {
    // Ensure we have an absolute URL with protocol
    const normalized = candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;
    return new URL(normalized);
  } catch {
    return new URL("https://js-stack.pages.dev");
  }
};
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://js-stack.pages.dev").trim();
const metadataBase = resolveMetadataBase();

export const metadata: Metadata = {
  title: {
    default: "JS-Stack - Modern Full-Stack Development Tool",
    template: "%s | JS-Stack",
  },
  description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications with React, Next.js, Node.js, and modern development best practices.",
  keywords: [
    "javascript",
    "typescript", 
    "react",
    "nextjs",
    "nodejs",
    "cli",
    "scaffolding",
    "full-stack",
    "development",
    "boilerplate",
    "template",
    "web development"
  ],
  authors: [{ name: "Vipin Yadav", url: "https://github.com/vipinyadav01" }],
  creator: "Vipin Yadav",
  publisher: "JS-Stack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
        type: "image/png" 
      },
      { 
        url: "/web-app-192x192.png", 
        sizes: "192x192", 
        type: "image/png" 
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "JS-Stack - Modern Full-Stack Development Tool",
    description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications",
    url: siteUrl,
    siteName: "JS-Stack",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JS-Stack - Modern Full-Stack Development Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JS-Stack - Modern Full-Stack Development Tool", 
    description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications",
    images: ["/og-image.png"],
    creator: "@vipinyadav",
  },
  verification: {
    // Add your verification tokens here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "technology",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-title" content="JS-Stack" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        {/* Comprehensive favicon setup for development and production */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Force favicon refresh in development */}
        <meta name="msapplication-TileImage" content="/web-app-192x192.png" />
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
            <main className="flex-1">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}