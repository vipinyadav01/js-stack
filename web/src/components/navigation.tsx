"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Menu, Search, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchDialog, SearchTrigger } from "@/components/search-dialog";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
}

interface ExternalLink {
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  label: string;
}
import logo from "../Images/logo.png";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "@/components/icons/github-icon";

const NAV_LINKS: NavLink[] = [
  { text: "Docs", url: "/docs" },
  { text: "Builder", url: "/new" },
  { text: "Analytics", url: "/analytics" },
  { text: "Features", url: "/features" },
  { text: "Sponsors", url: "/sponsors" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const NavLink = ({
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
          "px-2 py-2 text-sm font-medium rounded-lg transition-all",
          mobile ? "flex items-center justify-between w-full" : "relative",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <span className="flex items-center gap-2">
          {link.text}
          {link.badge && (
            <span className="px-1.5 py-0.5 text-xs bg-primary/20 rounded">
              {link.badge}
            </span>
          )}
        </span>
        {mobile && <ExternalLink className="h-3 w-3 opacity-50" />}
        {!mobile && isActive && (
          <span className="absolute bottom-0 inset-x-3 h-0.5 bg-primary/50 rounded" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm"
          : "bg-background/80 backdrop-blur",
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          aria-label="JS Stack - Home"
        >
          <Image
            src={logo}
            alt="JS Stack Logo"
            width={24}
            height={24}
            priority
          />
          <span className="hidden sm:inline">JS Stack</span>
        </Link>
        <nav
          className="hidden md:flex items-center"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.url} link={link} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchTrigger
              onClick={() => setSearchOpen(true)}
              className="h-7 w-auto px-3"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <div className="hidden md:flex items-center gap-1">
            {EXTERNAL_LINKS.map(({ icon: Icon, url, label }) => (
              <Button
                key={url}
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a href={url} target="_blank" rel="noopener" aria-label={label}>
                  <Icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                aria-label="Open mobile menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <nav
                  className="flex flex-col gap-1"
                  aria-label="Mobile navigation"
                >
                  {NAV_LINKS.map((link) => (
                    <NavLink key={link.url} link={link} mobile />
                  ))}
                </nav>
                <div className="border-t pt-4 flex flex-col gap-1">
                  {EXTERNAL_LINKS.map(({ icon: Icon, url, label }) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
