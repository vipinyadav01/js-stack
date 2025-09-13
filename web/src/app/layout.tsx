import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";

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
});

export const metadata: Metadata = {
  title: "JS-Stack",
  description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications with React, Next.js, Node.js, and modern development best practices.",
  keywords: ["javascript", "typescript", "react", "nextjs", "nodejs", "cli", "scaffolding", "full-stack", "development"],
  authors: [{ name: "Vipin Yadav" }],
  creator: "Vipin Yadav",
  publisher: "JS-Stack",
  icons: {
    icon: [
      { url: '/web-app-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml', rel: 'alternate icon' },
    ],
    shortcut: ['/favicon.ico'],
    apple: ['/web-app-192x192.png'],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#3b82f6' }
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "JS-Stack - Modern Full-Stack Development Tool",
    description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JS-Stack - Modern Full-Stack Development Tool",
    description: "A comprehensive CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
