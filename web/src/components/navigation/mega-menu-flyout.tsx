"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuItem {
  title: string;
  href: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MegaMenuSection {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  items: MegaMenuItem[];
}

interface MegaMenuFlyoutProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  section: MegaMenuSection;
  featuredBanner?: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
  align?: "left" | "center" | "right";
  onSelect?: () => void;
}

export function MegaMenuFlyout({
  label,
  icon: TriggerIcon = BookOpen,
  section,
  featuredBanner,
  className,
  align = "center",
  onSelect,
}: MegaMenuFlyoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Check if any link inside is active
  const isSectionActive = section.items.some((item) =>
    pathname?.startsWith(item.href),
  );

  const alignmentClasses = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  }[align];

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Navigation Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "group flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200 outline-none select-none cursor-pointer",
          isSectionActive
            ? "text-primary font-bold bg-primary/10 dark:bg-primary/15 shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04]",
          isOpen && "text-foreground bg-muted/60 dark:bg-white/[0.06]",
        )}
      >
        <TriggerIcon className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200 opacity-70",
            isOpen && "rotate-180 opacity-100",
          )}
        />
      </button>

      {/* Flyout Surface */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2.5 z-50 w-[460px] max-w-[calc(100vw-2rem)]",
            alignmentClasses,
            "rounded-2xl border border-border/80 dark:border-white/10 bg-card/95 dark:bg-[#0c0e15]/95 backdrop-blur-2xl shadow-2xl shadow-black/15 dark:shadow-black/60 p-4",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1.5 duration-150 ease-out",
          )}
        >
          {/* Subtle top amber glow */}
          <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-center justify-between px-1 pb-2.5 mb-2 border-b border-border/60 dark:border-white/[0.06]">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3 text-primary" />
              {section.title}
            </span>
            {section.viewAllHref && (
              <Link
                href={section.viewAllHref}
                onClick={() => {
                  setIsOpen(false);
                  onSelect?.();
                }}
                className="text-[11px] font-mono font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                <span>{section.viewAllLabel || "View all"}</span>
                <ArrowRight className="size-2.5" />
              </Link>
            )}
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    onSelect?.();
                  }}
                  className={cn(
                    "group/item flex items-start gap-2.5 rounded-xl p-2.5 transition-all duration-150 border border-transparent",
                    isActive
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "hover:bg-muted/70 dark:hover:bg-white/[0.04] hover:border-border/60 text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-lg shrink-0 transition-colors mt-0.5",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted dark:bg-white/[0.06] text-muted-foreground group-hover/item:text-primary group-hover/item:bg-primary/10",
                    )}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold tracking-tight truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/15 text-primary font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 font-sans leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Optional Featured Bottom Banner */}
          {featuredBanner && (
            <div className="mt-3 pt-2.5 border-t border-border/50 dark:border-white/[0.06]">
              <Link
                href={featuredBanner.href}
                onClick={() => {
                  setIsOpen(false);
                  onSelect?.();
                }}
                className="group/banner flex items-center justify-between p-2.5 rounded-xl bg-primary/[0.06] hover:bg-primary/[0.12] border border-primary/20 transition-all duration-150"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-primary/15 text-primary">
                    <Layers className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-foreground group-hover/banner:text-primary transition-colors">
                      {featuredBanner.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      {featuredBanner.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono font-medium text-primary">
                  <span>{featuredBanner.ctaLabel}</span>
                  <ArrowRight className="size-3 transition-transform group-hover/banner:translate-x-0.5" />
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
