"use client";

import React, { useState } from "react";
import {
  Github,
  Terminal,
  Twitter,
  Globe,
  ArrowRight,
  Check,
  Copy,
  Zap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../Images/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const command = "npx @vipinyadav02/createjsstack@latest";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full border-t border-border/60 bg-card/60 backdrop-blur-xl dark:bg-[#090a0f]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Column (2 columns wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-primary/30 bg-primary/10 p-0.5 transition-transform group-hover:scale-105">
                <Image
                  src={logo}
                  alt="JS-Stack"
                  fill
                  sizes="32px"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-lg tracking-tight text-foreground">
                  JS-STACK
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  v1.2.16
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
              The full-stack scaffolding CLI platform for React 19, Next.js 15, Vue 3, Express, Fastify, Postgres, MongoDB, and Docker.
            </p>

            {/* Quick Copy Terminal Pill */}
            <div className="pt-2">
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                Quick Execution Command
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center justify-between gap-3 w-full max-w-sm px-3.5 py-2.5 rounded-md bg-secondary/80 border border-border/80 text-foreground font-mono text-xs hover:border-primary/50 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Terminal className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="truncate text-[11px]">{command}</span>
                </div>
                {copied ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex-shrink-0">Copied!</span>
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-primary uppercase">
              // PLATFORM
            </h3>
            <ul className="space-y-3 font-mono text-xs text-muted-foreground">
              <li>
                <Link
                  href="/new"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Stack Builder</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>CLI Features</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Telemetry Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Sponsors & Backers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-primary uppercase">
              // ECOSYSTEM
            </h3>
            <ul className="space-y-3 font-mono text-xs text-muted-foreground">
              <li>
                <a
                  href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>NPM Registry</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Release Notes</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>MIT License</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Author & Support */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-primary uppercase">
              // AUTHOR
            </h3>
            <ul className="space-y-3 font-mono text-xs text-muted-foreground">
              <li>
                <a
                  href="https://vipinyadav01.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Vipin Yadav</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Report an Issue</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vipinyadav01/js-stack/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span>Discussions</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row font-mono text-xs text-muted-foreground">
          <p>
            © {currentYear} Vipin Yadav. Built for the modern full-stack web era. Open Source (MIT).
          </p>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="https://github.com/vipinyadav01"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
              title="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/vipinyadav9m"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
              title="Twitter Profile"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://vipinyadav01.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
              title="Personal Website"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
