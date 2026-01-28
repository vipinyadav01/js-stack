"use client";
import { Check, ChevronDown, Copy, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
    npm: "npx create-js-stack@latest my-app --yolo",
    pnpm: "pnpm create-js-stack@latest my-app --yolo",
    bun: "bun create-js-stack@latest my-app --yolo",
  };

  const copyCommand = (command: string, packageManager: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(packageManager);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div>
      {/* Single Header for entire section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold text-lg sm:text-xl text-muted-foreground">
            QUICK_START
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [COMMAND.SH]
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Command Section */}
        <div>
          <div className="mb-4 flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <span className="font-medium text-sm">{selectedPM}</span>
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
                    <span className="font-medium">{pm}</span>
                    {selectedPM === pm && <Check className="ml-auto h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border bg-muted/30">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Terminal className="h-3.5 w-3.5" />
                <span>Terminal</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyCommand(commands[selectedPM], selectedPM)}
                aria-live="polite"
                className={cn(
                  "h-7 rounded-md px-2 text-xs",
                  copiedCommand === selectedPM && "text-green-600",
                )}
              >
                {copiedCommand === selectedPM ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="ml-1">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="ml-1">Copy</span>
                  </>
                )}
              </Button>
            </div>

            <div className="px-3 py-3">
              <div className="flex items-start gap-2 font-mono text-sm">
                <span className="select-none text-muted-foreground">$</span>
                <pre className="m-0 max-w-full overflow-x-auto whitespace-pre-wrap break-words text-foreground">
                  <code>{commands[selectedPM]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Stack Builder Section */}
        <Link href="/new">
          <div className="h-full rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Build your custom JavaScript stack with our interactive
                configuration tool.
              </p>
              <p className="text-sm text-muted-foreground">
                Choose frameworks, databases, and tools that fit your needs.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
