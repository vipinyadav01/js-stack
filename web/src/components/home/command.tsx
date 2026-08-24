"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Terminal, Zap, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Command() {
  const [copied, setCopied] = useState(false);
  const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("npm");

  const commands = {
    npm: "npx @vipinyadav02/createjsstack@latest my-app --yolo",
    pnpm: "pnpm create @vipinyadav02/jsstack@latest my-app --yolo",
    bun: "bunx @vipinyadav02/createjsstack@latest my-app --yolo",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[selectedPM]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 font-mono text-sm tracking-tight text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-bold text-primary">QUICK_START</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground font-normal">command.sh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">Production Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Terminal Window Card */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-border/70 bg-[#0d0d0d] shadow-2xl overflow-hidden font-mono">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-[#121215]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>

            {/* PM Selector Tabs */}
            <div className="flex items-center gap-1 rounded-lg bg-secondary/80 p-0.5 border border-border/40 text-xs">
              {(["npm", "pnpm", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setSelectedPM(pm)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-mono transition-all",
                    selectedPM === pm
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 text-xs font-mono text-muted-foreground hover:text-foreground transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Command Code Snippet */}
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold select-none">$</span>
              <code className="text-foreground flex-1 break-all">
                <span className="text-emerald-400 font-semibold">
                  {selectedPM === "bun" ? "bunx" : selectedPM === "pnpm" ? "pnpm create" : "npx"}
                </span>{" "}
                <span className="text-primary">@vipinyadav02/createjsstack@latest</span>{" "}
                <span className="text-yellow-300">my-app</span>{" "}
                <span className="text-cyan-400">--yolo</span>
              </code>
            </div>
            
            <div className="mt-5 pt-4 border-t border-border/40 text-xs text-muted-foreground space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-primary">ℹ</span>
                <span>Generates complete repository with default full-stack configuration.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Includes auto-dependency install, git init, and dev server script.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Builder Promo Card with Cloudflare Corner Marks */}
        <div className="relative lg:col-span-5 flex flex-col justify-between rounded-xl border border-primary/30 bg-gradient-to-b from-primary/10 via-card to-card p-6 shadow-xl overflow-hidden group">
          {/* Corner decor crosshairs */}
          <div className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
          <div className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
          <div className="pointer-events-none absolute -left-1 -bottom-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
          <div className="pointer-events-none absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />

          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Layers className="w-32 h-32 text-primary" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
              <Zap className="h-3.5 w-3.5" />
              <span>Interactive Customizer</span>
            </div>

            <h3 className="text-xl font-mono font-bold tracking-tight text-foreground">
              Prefer Visual Selection?
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Use our interactive stack builder to visually choose your frontend, backend, database, ORM, auth method, and addons.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Next.js 15", "Express", "Postgres", "Prisma", "Better Auth", "Docker"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-[11px] font-mono text-foreground/90 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/new"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group-hover:shadow-primary/40"
            >
              <span>Open Stack Builder</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
