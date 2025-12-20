"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Menu, Search, ExternalLink, Sparkles, Command } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchDialog, SearchTrigger } from "@/components/search-dialog";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
  isNew?: boolean;
}

interface ExternalLinkType {
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  label: string;
}
import logo from "../Images/logo.png";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "@/components/icons/github-icon";

const NAV_LINKS: NavLink[] = [
  { text: "Docs", url: "/docs" },
  { text: "Builder", url: "/new", isNew: true },
  { text: "Analytics", url: "/analytics" },
  { text: "Features", url: "/features" },
  { text: "Sponsors", url: "/sponsors" },
];

const EXTERNAL_LINKS: ExternalLinkType[] = [
  {
    icon: NpmIcon,
    url: "https://www.npmjs.com/package/create-js-stack",
    label: "NPM",
  },
  {
    icon: GithubIcon,
    url: "https://github.com/vipinyadav01/js-stack",
    label: "GitHub",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ensure consistent hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    // Check initial scroll position
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !searchOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const NavLinkItem = ({
    link,
    mobile = false,
  }: {
    link: NavLink;
    mobile?: boolean;
  }) => {
    const isActive = pathname?.startsWith(link.url) || pathname === link.url;
    return (
      <Link
        href={link.url}
        onClick={() => mobile && setMobileOpen(false)}
        className={cn(
          "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          mobile ? "flex items-center justify-between w-full" : "group",
          isActive
            ? "text-foreground bg-primary/10 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        )}
      >
        <span className="flex items-center gap-2">
          {link.text}
          {link.isNew && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-violet-500/15 via-purple-500/15 to-fuchsia-500/15 text-violet-600 dark:text-violet-400 rounded-md border border-violet-500/20 animate-pulse">
              <Sparkles className="h-2.5 w-2.5" />
              New
            </span>
          )}
          {link.badge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-md border border-primary/20">
              {link.badge}
            </span>
          )}
        </span>
        {!mobile && isActive && (
          <span className="absolute inset-0 rounded-lg ring-2 ring-primary/20 pointer-events-none" />
        )}
        {mobile && <ExternalLink className="h-4 w-4 opacity-40" />}
      </Link>
    );
  };

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-lg shadow-black/5"
          : "bg-background/80 backdrop-blur-xl border-b border-border/40",
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-lg group shrink-0"
            aria-label="JS Stack - Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src={logo}
                alt="JS Stack Logo"
                width={32}
                height={32}
                priority
                className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text transition-all duration-300 group-hover:tracking-wide">
              JS Stack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1.5 flex-1 justify-center max-w-2xl mx-auto"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLinkItem key={link.url} link={link} />
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search - Desktop */}
            <div className="hidden md:block">
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="h-9 px-3 text-xs gap-2 bg-muted/40 hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                  <Command className="h-3 w-3" />K
                </kbd>
              </Button>
            </div>

            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 hover:bg-muted/60"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-border/60" />

            {/* External Links */}
            <div className="hidden md:flex items-center gap-1">
              {EXTERNAL_LINKS.map(({ icon: Icon, url, label }) => (
                <Button
                  key={url}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                  asChild
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-muted/60"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 pt-12 px-6">
                <div className="flex flex-col gap-8">
                  {/* Mobile Logo */}
                  <Link
                    href="/"
                    className="flex items-center gap-3 font-bold text-xl pb-4 border-b"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Image
                      src={logo}
                      alt="JS Stack Logo"
                      width={32}
                      height={32}
                    />
                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      JS Stack
                    </span>
                  </Link>

                  {/* Mobile Nav Links */}
                  <nav
                    className="flex flex-col gap-2"
                    aria-label="Mobile navigation"
                  >
                    {NAV_LINKS.map((link) => (
                      <NavLinkItem key={link.url} link={link} mobile />
                    ))}
                  </nav>

                  {/* Mobile External Links */}
                  <div className="border-t pt-6 flex flex-col gap-2">
                    <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Resources
                    </p>
                    {EXTERNAL_LINKS.map(({ icon: Icon, url, label }) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-all duration-200 text-muted-foreground hover:text-foreground group"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
