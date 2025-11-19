"use client";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Terminal,
  Zap,
  Package,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Command() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedPM, setSelectedPM] = useState<"npm" | "pnpm" | "bun">("npm");

  const commands = {
    npm: "npx create-js-stack@latest my-app",
    pnpm: "pnpm create-js-stack@latest my-app",
    bun: "bun create-js-stack@latest my-app",
  };

  const copyCommand = (command: string, packageManager: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(packageManager);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Command Section */}
      <motion.div
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-lg backdrop-blur-sm"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quick Start</h3>
                <p className="text-sm text-muted-foreground">
                  Get started in seconds
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-background/50 backdrop-blur-sm"
                >
                  <Package className="h-4 w-4" />
                  <span className="font-medium">{selectedPM}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {(["npm", "pnpm", "bun"] as const).map((pm) => (
                  <DropdownMenuItem
                    key={pm}
                    onClick={() => setSelectedPM(pm)}
                    className={cn(
                      "flex items-center gap-2",
                      selectedPM === pm && "bg-primary/10 text-primary",
                    )}
                  >
                    <Package className="h-3 w-3" />
                    <span className="font-medium">{pm}</span>
                    {selectedPM === pm && <Check className="ml-auto h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Command Display */}
          <div className="relative rounded-xl bg-muted/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground font-medium">
                  {commands[selectedPM]}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyCommand(commands[selectedPM], selectedPM)}
                className={cn(
                  "transition-all duration-200",
                  copiedCommand === selectedPM
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                    : "hover:bg-primary/10",
                )}
              >
                {copiedCommand === selectedPM ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="ml-2 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="ml-2 font-medium">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stack Builder Section */}
      <Link href="/new">
        <motion.div
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-blue-500/5 p-6 shadow-lg backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="relative">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Stack Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive configuration
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
                <Play className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Interactive
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="rounded-xl bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      Build your custom JavaScript stack
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose frameworks, databases, and tools
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <span>Start building your stack</span>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1">
                  <span className="text-xs font-medium text-primary">
                    Get Started
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
