import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "@/components/icons/github-icon";

export type SocialPlatform = "npm" | "github";

interface SocialTechLogoProps {
  platform: SocialPlatform;
  href: string;
  className?: string;
  iconClassName?: string;
  showBorder?: boolean;
}

export function SocialTechLogo({
  platform,
  href,
  className,
  iconClassName,
  showBorder = true,
}: SocialTechLogoProps) {
  const isNpm = platform === "npm";
  const title = isNpm
    ? "NPM Registry (@vipinyadav02/createjsstack)"
    : "GitHub Repository (js-stack)";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className={cn(
        "group inline-flex items-center justify-center size-8 rounded-lg transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        showBorder &&
          "border border-border/70 dark:border-white/10 bg-secondary/30 hover:bg-secondary/70 dark:bg-white/[0.03] dark:hover:bg-white/[0.08]",
        !showBorder && "hover:bg-muted/70 dark:hover:bg-white/[0.06]",
        "hover:scale-[1.05] active:scale-[0.97]",
        className,
      )}
    >
      {isNpm ? (
        <NpmIcon
          className={cn(
            "size-4 transition-transform group-hover:scale-105",
            iconClassName,
          )}
        />
      ) : (
        <GithubIcon
          className={cn(
            "size-4 text-foreground/80 transition-colors group-hover:text-foreground",
            iconClassName,
          )}
        />
      )}
      <span className="sr-only">{title}</span>
    </Link>
  );
}
