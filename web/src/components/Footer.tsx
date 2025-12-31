import React from "react";
import {
  Github,
  Terminal,
  Twitter,
  Globe,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import NpmVersion from "./NpmVersion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">JS-Stack</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              The ultimate CLI for scaffolding production-ready full-stack
              JavaScript applications. Built for speed, performance, and
              scalability.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <NpmVersion />
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground">
              PRODUCT
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/new"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Stack Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Features
                </Link>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/create-js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  NPM Package
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground">
              RESOURCES
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Report an Issue
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/js-stack/examples"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="/sponsors"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Sponsors
                </a>
              </li>
            </ul>
          </div>

          {/* Community / Newsletter (Mock) */}
          <div className="space-y-4">
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground">
              STAY UPDATED
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest updates, templates, and features sent to your inbox mostly
              every month.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Vipin Yadav. Open Source (MIT).
          </p>

          <div className="flex gap-4 text-muted-foreground">
            <a
              href="https://github.com/vipinyadav01"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/vipinyadav01"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://vipinyadav01.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">Website</span>
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
