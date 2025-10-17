"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import SwitchButton from "@/components/kokonutui/switch-button";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-10 w-[88px] shrink-0 cursor-not-allowed items-center rounded-lg border border-border bg-muted/50 opacity-50 relative",
          className,
        )}
        aria-label="Toggle theme (loading)"
      >
        <div className="h-6 w-6 rounded bg-background shadow-sm border border-border ml-4" />
      </div>
    );
  }

  return (
    <SwitchButton
      className={className}
      variant="minimal"
      size="default"
      aria-label="Toggle theme between light and dark"
    />
  );
}
