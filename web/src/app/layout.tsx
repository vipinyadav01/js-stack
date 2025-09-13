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
  title: "JS Stack - Modern Development Tool",
  description: "A powerful CLI tool for modern JavaScript development workflows",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/icon.svg',
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
