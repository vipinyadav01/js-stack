"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Menu, Search, Sparkles, Github } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchDialog } from "@/components/search-dialog";
import logo from "../Images/logo.png";
import { motion } from "framer-motion";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
  isNew?: boolean;
}

const NAV_LINKS: NavLink[] = [
  // { text: "Docs", url: "/docs" },
  { text: "Builder", url: "/new", isNew: true },
  { text: "Analytics", url: "/analytics" },
  { text: "Features", url: "/features" },
  { text: "Sponsors", url: "/sponsors" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          "relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors",
          mobile
            ? "w-full rounded-lg p-3 hover:bg-muted"
            : "rounded-full hover:text-primary",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      >
        {link.text}
        {link.isNew && (
          <span className="flex items-center gap-0.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-violet-500 ring-1 ring-violet-500/20">
            <Sparkles className="h-2 w-2" />
            <span className="hidden sm:inline">New</span>
          </span>
        )}
        {!mobile && isActive && (
          <motion.div
            layoutId="navbar-active"
            className="absolute inset-0 -z-10 rounded-full bg-primary/10"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 transition-all duration-300",
          isScrolled ? "top-4" : "top-6",
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between p-2 rounded-full border border-border/40 bg-background/60 shadow-lg shadow-black/5 backdrop-blur-xl transition-all",
            isScrolled && "bg-background/80 shadow-xl border-border/60",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-2 pl-3 group shrink-0"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src={logo}
                alt="JS Stack"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <span className="font-bold hidden sm:inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              JS Stack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 mx-4">
            {NAV_LINKS.map((link) => (
              <NavLinkItem key={link.url} link={link} />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 pr-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Link
              href="https://github.com/vipinyadav01/js-stack"
              target="_blank"
              className="hidden sm:block"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Github className="h-4 w-4" />
              </Button>
            </Link>

            <div className="hidden sm:block w-px h-4 bg-border/50 mx-1" />

            <ThemeToggle className="rounded-full" />

            {/* Mobile Toggle */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 rounded-full"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full pt-16 px-6 pb-6">
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <NavLinkItem key={link.url} link={link} mobile />
                  ))}
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center gap-2 px-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-10"
                      onClick={() => {
                        setMobileOpen(false);
                        setSearchOpen(true);
                      }}
                    >
                      <Search className="h-4 w-4" />
                      Search...
                      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
