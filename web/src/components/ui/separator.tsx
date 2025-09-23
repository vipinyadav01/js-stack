"use client";

import { cn } from "@/lib/utils";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  decorative?: boolean;
}

export function Separator({ 
  orientation = "horizontal", 
  className,
  decorative = true,
  ...props 
}: SeparatorProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

export function FullScreenSeparator({ className }: { className?: string }) {
  return (
    <Separator
      orientation="vertical"
      className={cn(
        "hidden lg:block min-h-screen bg-gradient-to-b from-transparent via-border to-transparent",
        className
      )}
    />
  );
}