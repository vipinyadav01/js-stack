"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Modern, shift-free SaaS Dark/Light mode toggle.
 * Keeps identical footprint before and after mounting to eliminate hydration layout shifts.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      title={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      className={cn(
        "group relative inline-flex size-8 items-center justify-center rounded-lg",
        "border border-border/70 dark:border-white/10 bg-secondary/40 hover:bg-secondary/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.08]",
        "text-muted-foreground hover:text-foreground transition-all duration-200 shadow-xs",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "cursor-pointer active:scale-95",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-4 text-amber-500 transition-all duration-300",
          mounted && !isDark
            ? "rotate-0 scale-100 opacity-100 group-hover:rotate-45 group-hover:scale-110"
            : "-rotate-90 scale-75 opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 text-zinc-100 transition-all duration-300",
          mounted && isDark
            ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12 group-hover:scale-110"
            : "rotate-90 scale-75 opacity-0",
        )}
      />

      {!mounted && (
        <span className="size-4 rounded-full bg-muted-foreground/30 animate-pulse" />
      )}

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
