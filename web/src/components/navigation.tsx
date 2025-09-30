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

// Navigation types
type NavLink = {
  text: string;
  url: string;
  active?: "nested-url";
};

type ExternalLink = {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url: string;
};

// Navigation configuration
const NAV_CONFIG: {
  mainLinks: NavLink[];
  externalLinks: ExternalLink[];
} = {
  mainLinks: [
    { text: "Docs", url: "/docs", active: "nested-url" },
    { text: "Builder", url: "/new" },
    { text: "Analytics", url: "/analytics" },
    { text: "Features", url: "/features" },
    { text: "Sponsors", url: "/sponsors" },
  ],
  externalLinks: [
    {
      text: "NPM",
      icon: NpmIcon,
      label: "NPM Package",
      url: "https://www.npmjs.com/package/create-js-stack",
    },
    {
      text: "GitHub",
      icon: GithubIcon,
      label: "GitHub Repository",
      url: "https://github.com/vipinyadav01/js-stack",
    },
    {
      text: "Docs",
      icon: Code2,
      label: "Documentation",
      url: "https://github.com/vipinyadav01/js-stack#readme",
    },
  ],
} as const;

// Constants
const SCROLL_THRESHOLD = 10;
const SCROLL_DEBOUNCE = 16;
const HEADER_HEIGHT = "h-14";

// Logo Component
interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn("flex-shrink-0", className)}>
      {!imageError ? (
        <Image
          src={favicon}
          alt="JS-Stack Logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <Code2 className="h-8 w-8 text-primary" aria-hidden="true" />
      )}
    </div>
  );
}

// Desktop Navigation Links
interface DesktopNavProps {
  pathname: string | null;
}

function DesktopNav({ pathname }: DesktopNavProps) {
  return (
    <nav
      className="hidden lg:flex items-center gap-1"
      aria-label="Main navigation"
    >
      {NAV_CONFIG.mainLinks.map((link) => {
        const isActive =
          link.active === "nested-url"
            ? pathname?.startsWith(link.url)
            : pathname === link.url;

        return (
          <Link
            key={link.url}
            href={link.url}
            className={cn(
              "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isActive
                ? "text-foreground bg-muted/50"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.text}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// External Links Component
interface ExternalLinksProps {
  className?: string;
}

function ExternalLinks({ className }: ExternalLinksProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {NAV_CONFIG.externalLinks.map((link) => (
        <Link
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-center h-9 w-9 rounded-lg",
            "border border-border bg-background",
            "hover:bg-muted/50 hover:border-primary/30",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          )}
          aria-label={link.label}
          title={link.label}
        >
          <link.icon
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}

// Mobile Menu Component
interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string | null;
}

function MobileMenu({ open, onOpenChange, pathname }: MobileMenuProps) {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-lg border border-border",
            "hover:bg-muted/50 transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          )}
          aria-label="Open navigation menu"
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
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={handleClose}
          >
            <Logo />
            <span className="font-semibold text-lg tracking-tight">
              JS Stack
            </span>
          </Link>
        </div>

        <div className="flex flex-col h-[calc(100%-73px)]">
          {/* Main Navigation */}
          <nav
            className="flex-1 overflow-y-auto px-4 py-6"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {NAV_CONFIG.mainLinks.map((link) => {
                const isActive =
                  link.active === "nested-url"
                    ? pathname?.startsWith(link.url)
                    : pathname === link.url;

                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    onClick={handleClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="text-sm font-medium">{link.text}</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Mobile External Links */}
          <div className="border-t border-border px-4 py-6 bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-4">
              Resources
            </p>
            <div className="space-y-2">
              {NAV_CONFIG.externalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    "border border-border bg-background",
                    "hover:bg-muted/50 hover:border-primary/30",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  )}
                >
                  <link.icon
                    className="h-4 w-4 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm font-medium">
                    {link.text}
                  </span>
                  <ExternalLink
                    className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Navigation Component
export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
      }, SCROLL_DEBOUNCE);
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

  // Mobile menu handlers
  const handleMobileMenuClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleMobileMenuClose();
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

  // Search keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInInput =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Cmd/Ctrl + K
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      // Cmd/Ctrl + Q (alternative)
      if ((e.key === "q" || e.key === "Q") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      // Forward slash (/) - only if not in input
      if (
        e.key === "/" &&
        !isInInput &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Loading state
  if (!isMounted) {
    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border",
          HEADER_HEIGHT,
        )}
      >
        <div className="container mx-auto flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-muted/30 animate-pulse" />
            <div className="h-5 w-24 bg-muted/30 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg border border-border bg-muted/20 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background/80 backdrop-blur-sm border-b border-border",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              HEADER_HEIGHT,
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 flex-shrink-0",
                "hover:opacity-90 transition-opacity duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg",
                "p-1 -m-1",
              )}
              aria-label="JS Stack - Home"
            >
              <Logo />
              <span className="font-semibold text-lg tracking-tight whitespace-nowrap">
                JS Stack
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <SearchTrigger onClick={() => setSearchOpen(true)} />
            </div>

            {/* Desktop Navigation */}
            <DesktopNav pathname={pathname} />

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop External Links */}
              <div className="hidden lg:flex">
                <ExternalLinks />
              </div>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Mobile Menu */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
                <MobileMenu
                  open={mobileOpen}
                  onOpenChange={setMobileOpen}
                  pathname={pathname}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
