"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search-dialog";
import Link from "next/link";
import {
  Menu,
  Github,
  Zap,
  ChevronDown,
  BookOpen,
  Search,
  Layers,
  Terminal,
  Cpu,
  Layout,
  BarChart3,
  Heart,
  Boxes,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DocRoute {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DOC_ROUTES: DocRoute[] = [
  {
    title: "Introduction",
    href: "/docs/",
    description: "Overview of JS-Stack philosophy",
    icon: BookOpen,
  },
  {
    title: "Getting Started",
    href: "/docs/getting-started/",
    description: "Install CLI & scaffold first project",
    icon: Zap,
  },
  {
    title: "Presets",
    href: "/docs/presets/",
    description: "Production-ready stack bundles",
    icon: Layers,
  },
  {
    title: "CLI Options",
    href: "/docs/cli-options/",
    description: "Every flag & command parameter",
    icon: Terminal,
  },
  {
    title: "How It Works",
    href: "/docs/how-it-works/",
    description: "Layered Handlebars engine architecture",
    icon: Cpu,
  },
  {
    title: "Components",
    href: "/docs/components/",
    description: "Interactive documentation UI showcase",
    icon: Layout,
  },
];

const NAV_LINKS: NavLink[] = [
  { text: "Features", url: "/features/", icon: Boxes },
  { text: "Stack Builder", url: "/new/", badge: "Builder", icon: Zap },
  { text: "Analytics", url: "/analytics/", icon: BarChart3 },
  { text: "Sponsors", url: "/sponsors/", icon: Heart },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [mobileDocsOpen, setMobileDocsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll position for dynamic glassmorphic elevation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect platform for keyboard shortcut display (Cmd+K vs Ctrl+K)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Safe dropdown hover delay to prevent sudden closing
  const handleMouseEnterDocs = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDocsOpen(true);
  };

  const handleMouseLeaveDocs = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDocsOpen(false);
    }, 150);
  };

  const isRouteActive = (url: string) => {
    if (url === "/" && pathname === "/") return true;
    if (url !== "/" && pathname?.startsWith(url)) return true;
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-border/80 dark:border-white/[0.08] bg-background/85 dark:bg-[#090a0f]/85 backdrop-blur-xl shadow-md shadow-black/[0.03] dark:shadow-black/30"
            : "border-b border-border/50 dark:border-white/[0.05] bg-background/75 dark:bg-[#090a0f]/75 backdrop-blur-lg",
        )}
      >
        {/* Subtle top amber hairline glow */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg pr-2 py-1"
            >
              <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-primary/30 bg-primary/10 dark:bg-primary/[0.08] p-0.5 shadow-sm shadow-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:shadow-primary/30">
                <Image
                  src={logo}
                  alt="JS-Stack"
                  fill
                  sizes="32px"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm sm:text-base tracking-tight text-foreground transition-colors group-hover:text-primary">
                  JS-STACK
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 dark:border-white/10 bg-secondary/60 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-all hidden sm:inline-flex">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  v1.3.0
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Island */}
            <div className="hidden md:flex items-center gap-1 border border-border/60 dark:border-white/[0.08] rounded-full bg-secondary/30 dark:bg-white/[0.02] px-1.5 py-1 backdrop-blur-md shadow-xs">
              {/* Docs Dropdown Item */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterDocs}
                onMouseLeave={handleMouseLeaveDocs}
              >
                <Link
                  href="/docs/"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200",
                    pathname?.startsWith("/docs")
                      ? "text-primary font-bold bg-primary/10 dark:bg-primary/15 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Docs</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200 opacity-70",
                      docsOpen && "rotate-180 opacity-100",
                    )}
                  />
                </Link>

                {/* Rich Mega-Menu Flyout */}
                {docsOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[420px] rounded-xl border border-border/80 dark:border-white/10 bg-background/95 dark:bg-[#0c0e14]/95 backdrop-blur-2xl shadow-2xl shadow-black/20 p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                    onMouseEnter={handleMouseEnterDocs}
                    onMouseLeave={handleMouseLeaveDocs}
                  >
                    <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-border/50 dark:border-white/[0.06]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Documentation & Guides
                      </span>
                      <Link
                        href="/docs/"
                        className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
                        onClick={() => setDocsOpen(false)}
                      >
                        All Docs
                        <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {DOC_ROUTES.map((route) => {
                        const Icon = route.icon;
                        const active = pathname === route.href;
                        return (
                          <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setDocsOpen(false)}
                            className={cn(
                              "group/doc flex items-start gap-2.5 rounded-lg p-2 transition-all duration-150 border border-transparent",
                              active
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "hover:bg-muted/60 dark:hover:bg-white/[0.04] hover:border-border/50 text-foreground",
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 p-1.5 rounded-md transition-colors mt-0.5",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted dark:bg-white/[0.06] text-muted-foreground group-hover/doc:text-primary group-hover/doc:bg-primary/10",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-mono font-semibold tracking-tight truncate">
                                {route.title}
                              </div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                {route.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Standard Nav Items */}
              {NAV_LINKS.map((link) => {
                const active = isRouteActive(link.url);
                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200",
                      active
                        ? "text-primary font-bold bg-primary/10 dark:bg-primary/15 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <span>{link.text}</span>
                    {link.badge && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-primary">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Search + Action Buttons + Theme Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search documentation and stacks"
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-muted-foreground bg-muted/30 hover:bg-muted/60 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] hover:text-foreground border border-border/60 dark:border-white/[0.08] rounded-lg transition-all shadow-xs"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="hidden xl:inline text-xs text-muted-foreground">
                  Search docs...
                </span>
                <kbd className="pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border/70 dark:border-white/10 bg-muted/60 dark:bg-white/[0.06] px-1.5 font-mono text-[9px] font-semibold text-muted-foreground">
                  <span>{isMac ? "⌘" : "Ctrl"}</span>K
                </kbd>
              </button>

              {/* Start Building Quick CTA */}
              <Link href="/new/" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg px-3 font-mono text-xs font-semibold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-sm shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Build Stack</span>
                </Button>
              </Link>

              {/* NPM Package Link */}
              <Link
                href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex"
                title="View on NPM Registry"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="fill-current"
                    aria-hidden="true"
                  >
                    <polygon
                      fill="currentColor"
                      points="12,9.964 10.666,9.964 10.666,12.679 12,12.679 12,9.964"
                    />
                    <path
                      fill="currentColor"
                      d="M24,7.25H0v8.143h6.666v1.357H12v-1.357h12V7.25L24,7.25z M6.666,14.036H5.333V9.964H4v4.072H1.333V8.608	h5.333V14.036L6.666,14.036z M13.333,14.036h-2.667v1.356H8V8.608h5.333V14.036L13.333,14.036z M22.667,14.036h-1.333V9.964H20	v4.072h-1.333V9.964h-1.333v4.072h-2.667V8.608h8V14.036L22.667,14.036z"
                    />
                  </svg>
                  <span className="sr-only">NPM Package</span>
                </Button>
              </Link>

              {/* GitHub Repository Link */}
              <Link
                href="https://github.com/vipinyadav01/js-stack"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex"
                title="GitHub Repository"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle className="rounded-lg h-8 w-8" />

              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    aria-label="Open mobile menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[360px] p-0 flex flex-col bg-background/98 dark:bg-[#090a0f]/98 backdrop-blur-2xl border-l border-border/70"
                >
                  <SheetHeader className="p-5 border-b border-border/60 text-left">
                    <SheetTitle className="flex items-center gap-2.5">
                      <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-primary/30 bg-primary/10 p-0.5">
                        <Image
                          src={logo}
                          alt="JS-Stack"
                          fill
                          sizes="28px"
                          className="object-cover rounded-md"
                        />
                      </div>
                      <span className="font-mono font-bold text-sm tracking-tight">
                        JS-STACK
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary font-semibold ml-auto">
                        v1.3.0
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
                    {/* Search trigger inside mobile menu */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setSearchOpen(true);
                      }}
                      className="w-full flex items-center justify-between rounded-lg p-2.5 text-xs font-mono text-muted-foreground bg-muted/40 hover:bg-muted/70 border border-border/60 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 text-primary" />
                        Search docs & stacks...
                      </span>
                      <kbd className="h-4 select-none items-center rounded border border-border bg-muted px-1.5 text-[9px] font-mono text-muted-foreground">
                        {isMac ? "⌘" : "Ctrl"}K
                      </kbd>
                    </button>

                    {/* Primary Navigation Links */}
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-1">
                        Navigation
                      </div>
                      {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const active = isRouteActive(link.url);
                        return (
                          <Link
                            key={link.url}
                            href={link.url}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-mono font-medium transition-all duration-150",
                              active
                                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                                : "text-foreground hover:bg-muted/60",
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {link.text}
                            </span>
                            {link.badge && (
                              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-primary">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Collapsible Docs Section */}
                    <div className="flex flex-col gap-1 pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setMobileDocsOpen(!mobileDocsOpen)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-mono font-medium transition-all duration-150",
                          pathname?.startsWith("/docs")
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-foreground hover:bg-muted/60",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          Documentation
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            mobileDocsOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {mobileDocsOpen && (
                        <div className="ml-3 pl-3 border-l border-border/70 flex flex-col gap-1 mt-1">
                          {DOC_ROUTES.map((route) => {
                            const active = pathname === route.href;
                            const Icon = route.icon;
                            return (
                              <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-mono transition-colors",
                                  active
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                                )}
                              >
                                <Icon className="h-3 w-3" />
                                {route.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Footer & Quick Builder CTA */}
                  <div className="p-4 border-t border-border/60 flex flex-col gap-3 bg-muted/20">
                    <Link
                      href="/new/"
                      onClick={() => setMobileOpen(false)}
                      className="w-full"
                    >
                      <Button className="w-full justify-center gap-2 font-mono text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-sm shadow-orange-500/20">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        <span>Interactive Stack Builder</span>
                      </Button>
                    </Link>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href="https://github.com/vipinyadav01/js-stack"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                        <Link
                          href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            className="fill-current"
                          >
                            <polygon
                              fill="currentColor"
                              points="12,9.964 10.666,9.964 10.666,12.679 12,12.679 12,9.964"
                            />
                            <path
                              fill="currentColor"
                              d="M24,7.25H0v8.143h6.666v1.357H12v-1.357h12V7.25L24,7.25z M6.666,14.036H5.333V9.964H4v4.072H1.333V8.608	h5.333V14.036L6.666,14.036z M13.333,14.036h-2.667v1.356H8V8.608h5.333V14.036L13.333,14.036z M22.667,14.036h-1.333V9.964H20	v4.072h-1.333V9.964h-1.333v4.072h-2.667V8.608h8V14.036L22.667,14.036z"
                            />
                          </svg>
                          <span className="sr-only">NPM</span>
                        </Link>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        MIT Licensed
                      </span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Global Command Palette Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
