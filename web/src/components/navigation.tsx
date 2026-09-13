"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
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
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/ui/cta-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search-dialog";
import { SocialTechLogo } from "@/components/icons/social-tech-logo";
import {
  MegaMenuFlyout,
  type MegaMenuItem,
} from "@/components/navigation/mega-menu-flyout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "../Images/logo.png";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DOC_ITEMS: MegaMenuItem[] = [
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
    title: "Spring Boot (Java)",
    href: "/docs/spring-boot/",
    description: "Java backend with a JS frontend",
    icon: Coffee,
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
  const [mobileDocsOpen, setMobileDocsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Track scroll elevation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect platform for keyboard shortcut display
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Global Cmd+K / Ctrl+K shortcut
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
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/35 to-transparent pointer-events-none" />

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg pr-2 py-1 select-none"
            >
              <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-primary/30 bg-primary/10 dark:bg-primary/[0.08] p-0.5 shadow-xs shadow-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:shadow-primary/30">
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
            <div className="hidden xl:flex items-center gap-1 border border-border/60 dark:border-white/[0.08] rounded-full bg-secondary/35 dark:bg-white/[0.02] px-1.5 py-1 backdrop-blur-md shadow-xs">
              {/* Reusable Mega-Menu Flyout for Docs */}
              <MegaMenuFlyout
                label="Docs"
                icon={BookOpen}
                section={{
                  title: "Documentation & Guides",
                  viewAllHref: "/docs/",
                  viewAllLabel: "All Docs",
                  items: DOC_ITEMS,
                }}
                featuredBanner={{
                  title: "Production Stack Presets",
                  description:
                    "Scaffold battle-tested MERN, Next.js, or Spring Boot stacks.",
                  href: "/docs/presets/",
                  ctaLabel: "View presets",
                }}
              />

              {/* Standard Nav Links */}
              {NAV_LINKS.map((link) => {
                const active = isRouteActive(link.url);
                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200 select-none",
                      active
                        ? "text-primary font-bold bg-primary/10 dark:bg-primary/15 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04]",
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

            {/* Right: Search + Action Buttons + Theme Toggle + Restored Logos */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search documentation and stacks"
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-muted-foreground bg-muted/30 hover:bg-muted/60 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] hover:text-foreground border border-border/60 dark:border-white/[0.08] rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <span className="hidden xl:inline text-xs text-muted-foreground">
                  Search docs...
                </span>
                <kbd className="pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border/70 dark:border-white/10 bg-muted/60 dark:bg-white/[0.06] px-1.5 font-mono text-[9px] font-semibold text-muted-foreground">
                  <span>{isMac ? "⌘" : "Ctrl"}</span>K
                </kbd>
              </button>

              {/* Start Building Quick CTA */}
              <Link href="/new/" className="hidden sm:inline-flex">
                <CTAButton variant="primary" size="sm" className="gap-1.5">
                  <Zap className="size-3.5 fill-current" />
                  <span>Build Stack</span>
                </CTAButton>
              </Link>

              {/* Restored NPM Package Link with Authentic Red Badge */}
              <SocialTechLogo
                platform="npm"
                href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                className="hidden md:inline-flex"
                iconClassName="rounded-xs shadow-2xs"
              />

              {/* Restored GitHub Repository Link */}
              <SocialTechLogo
                platform="github"
                href="https://github.com/vipinyadav01/js-stack"
                className="hidden sm:inline-flex"
              />

              {/* Modern Shift-Free Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open navigation menu"
                    className="xl:hidden inline-flex items-center justify-center size-8 rounded-lg border border-border/60 dark:border-white/10 bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Menu className="size-4" />
                  </button>
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
                        <Search className="size-3.5 text-primary" />
                        Search docs &amp; stacks...
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
                              <Icon className="size-4 text-muted-foreground" />
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
                          "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-mono font-medium transition-all duration-150 cursor-pointer",
                          pathname?.startsWith("/docs")
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-foreground hover:bg-muted/60",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <BookOpen className="size-4 text-muted-foreground" />
                          Documentation
                        </span>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            mobileDocsOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {mobileDocsOpen && (
                        <div className="ml-3 pl-3 border-l border-border/70 flex flex-col gap-1 mt-1">
                          {DOC_ITEMS.map((route) => {
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
                                <Icon className="size-3" />
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
                      <CTAButton
                        variant="primary"
                        size="md"
                        className="w-full gap-2"
                      >
                        <Zap className="size-3.5 fill-current" />
                        <span>Interactive Stack Builder</span>
                      </CTAButton>
                    </Link>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <SocialTechLogo
                          platform="github"
                          href="https://github.com/vipinyadav01/js-stack"
                        />
                        <SocialTechLogo
                          platform="npm"
                          href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
                        />
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
