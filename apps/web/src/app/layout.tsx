import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'JS Stack Builder - Modern JavaScript Project Generator',
    template: '%s | JS Stack Builder',
  },
  description: 'Create full-stack JavaScript applications with AI assistance, visual builders, and real-time collaboration',
  keywords: [
    'javascript',
    'project generator',
    'cli',
    'full-stack',
    'react',
    'nextjs',
    'node',
    'ai',
    'developer tools',
  ],
  authors: [{ name: 'Vipin Yadav' }],
  creator: 'JS Stack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://js-stack.dev',
    title: 'JS Stack Builder',
    description: 'Modern JavaScript Project Generator with AI',
    siteName: 'JS Stack',
    images: [
      {
        url: 'https://js-stack.dev/og.png',
        width: 1200,
        height: 630,
        alt: 'JS Stack Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JS Stack Builder',
    description: 'Modern JavaScript Project Generator',
    images: ['https://js-stack.dev/og.png'],
    creator: '@jsstack',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen bg-background">
            {/* Gradient background */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-gradient-start/10 via-gradient-middle/5 to-gradient-end/10" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>
            
            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
          
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
