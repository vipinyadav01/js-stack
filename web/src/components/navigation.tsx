"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "./icons/github-icon";
import favicon from "../Images/logo.png";
import { Menu, ExternalLink, ChevronRight, Code2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { SearchDialog, SearchTrigger } from "@/components/search-dialog";

// Main navigation links - text only
const navLinks = [
  {
    text: "Docs",
    url: "/docs",
    active: "nested-url",
  },
  {
    text: "Builder",
    url: "/new",
  },
  {
    text: "Analytics",
    url: "/analytics",
  },
  {
    text: "Features",
    url: "/features",
  },
];

// Icon-only external links
const iconLinks = [
  {
    text: "NPM",
    icon: NpmIcon,
    label: "NPM Package",
    url: "https://www.npmjs.com/package/create-js-stack",
    external: true,
  },
  {
    text: "GitHub",
    icon: GithubIcon,
    label: "GitHub Repository",
    url: "https://github.com/vipinyadav01/js-stack",
    external: true,
  },
  {
    text: "Docs",
    icon: Code2,
    label: "Documentation",
    url: "https://github.com/vipinyadav01/js-stack#readme",
    external: true,
  },
];

// Enhanced Logo component
function Logo({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn("flex-shrink-0", className)}>
      {!imageError ? (
        <Image
          src={favicon}
          alt="JS-Stack"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <Code2 className="w-8 h-8 text-primary" />
      )}
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enhanced scroll handling with progress tracking
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = window.scrollY;
        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

        setIsScrolled(scrollTop > 10);
        setScrollProgress(Math.min(progress, 100));
      }, 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMounted]);

  // Mobile menu handling
  const handleMobileMenuClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleMobileMenuClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen, handleMobileMenuClose]);

  useEffect(() => {
    handleMobileMenuClose();
  }, [pathname, handleMobileMenuClose]);

  // Enhanced keyboard shortcut handling with Windows-specific optimizations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect platform for accurate key handling
      const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
      const isWindows =
        /Win/i.test(navigator.platform) || /Windows/i.test(navigator.userAgent);

      // Handle platform-specific shortcuts
      if (e.key === "q" || e.key === "Q") {
        if (isMac && e.metaKey && !e.ctrlKey) {
          // Mac: Cmd+Q (but we'll use Cmd+K for Mac)
          e.preventDefault();
          setSearchOpen(true);
        } else if ((isWindows || !isMac) && e.ctrlKey && !e.metaKey) {
          // Windows/Linux: Ctrl+Q
          e.preventDefault();
          setSearchOpen(true);
        }
      }

      // Keep Cmd+K for Mac users (more familiar)
      if (
        (e.key === "k" || e.key === "K") &&
        isMac &&
        e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }

      // Handle '/' key for quick search (like GitHub)
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        // Only if not typing in an input field
        const activeElement = document.activeElement;
        const isInInput =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.getAttribute("contenteditable") === "true";

        if (!isInInput) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Loading state
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-muted/20 animate-pulse" />
            <div className="h-5 w-24 bg-muted/20 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded border border-border bg-muted/20 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-border"
          : "bg-background/90 backdrop-blur-md border-border/60",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-3 hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1 -m-1"
              aria-label="JS-Stack Home"
            >
              <Logo />
              <span className="font-medium font-mono text-lg tracking-tighter hidden sm:block">
                JS Stack
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          {/* Main Navigation - Text Only */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive =
                link.active === "nested-url"
                  ? pathname?.startsWith(link.url)
                  : pathname === link.url;

              return (
                <Link
                  key={link.url}
                  href={link.url}
                  className={cn(
                    "font-mono text-sm font-medium transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.text}
                </Link>
              );
            })}
          </nav>

          {/* Icon Links and Actions */}
          <div className="flex items-center space-x-2">
            {/* Icon-only external links */}
            <div className="hidden md:flex items-center space-x-1">
              {iconLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-border bg-background hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label={link.label}
                  title={link.label}
                >
                  <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="hidden md:block ml-2">
              <ThemeToggle />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200"
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 p-0 bg-background border-l border-border"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  {/* Mobile Header */}
                  <div className="p-6 border-b border-border">
                    <Link
                      href="/"
                      className="flex items-center gap-3"
                      onClick={handleMobileMenuClose}
                    >
                      <Logo />
                      <span className="font-medium font-mono text-lg tracking-tighter">
                        JS Stack
                      </span>
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-2">
                        {navLinks.map((link) => {
                          const isActive =
                            link.active === "nested-url"
                              ? pathname?.startsWith(link.url)
                              : pathname === link.url;

                          return (
                            <Link
                              key={link.url}
                              href={link.url}
                              onClick={handleMobileMenuClose}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50",
                                isActive
                                  ? "bg-primary/5 text-primary"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                              aria-current={isActive ? "page" : undefined}
                            >
                              <span className="font-mono text-sm font-medium">
                                {link.text}
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mobile External Links */}
                    <div className="border-t border-border p-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-3">
                          External Links
                        </p>
                        {iconLinks.map((link) => (
                          <Link
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleMobileMenuClose}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <link.icon className="h-4 w-4 text-primary" />
                            <span className="flex-1 font-mono text-sm font-medium">
                              {link.text}
                            </span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/20">
          <div
            className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
