"use client";

import React, { useState } from "react";
import {
  Github,
  Twitter,
  Globe,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../Images/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copiedCommand, setCopiedCommand] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(
        "npx @vipinyadav02/createjsstack@latest my-app",
      );
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <footer className="w-full border-t border-border/60 bg-background dark:bg-[#07080c] relative overflow-hidden font-sans text-foreground">
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[250px] bg-primary/5 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/50">
          
          {/* Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary/40 bg-card p-0.5 shadow-md shadow-primary/20 group-hover:border-primary transition-colors">
                <Image
                  src={logo}
                  alt="JS-Stack Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-mono font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
                JS-STACK CLI
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-sans">
              Scaffold production-ready JavaScript full-stack projects in seconds. Zero configuration needed with Next.js, React, Node, Express, Prisma & Docker.
            </p>

            {/* Quick Terminal Copy Box */}
            <div className="pt-2 max-w-sm">
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg border border-border/80 bg-card dark:bg-[#0d0e12] font-mono text-xs shadow-inner">
                <span className="text-primary select-none pl-1">❯</span>
                <code className="text-foreground text-[11px] truncate flex-1 font-mono">
                  npx @vipinyadav02/createjsstack
                </code>
                <button
                  onClick={copyCommand}
                  className="p-1.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all shrink-0"
                  title="Copy command"
                >
                  {copiedCommand ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-primary uppercase">
              {"// PLATFORM"}
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
              {"// ECOSYSTEM"}
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
              {"// AUTHOR"}
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
