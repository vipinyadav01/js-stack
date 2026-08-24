"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Menu, Github, Terminal, Zap, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";

interface NavLink {
  text: string;
  url: string;
  badge?: string;
}

const NAV_LINKS: NavLink[] = [
  { text: "Features", url: "/features" },
  { text: "Stack Builder", url: "/new", badge: "Interactive" },
  { text: "Analytics", url: "/analytics" },
  { text: "Sponsors", url: "/sponsors" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
          "relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-all duration-200",
          mobile
            ? "w-full rounded-lg p-3 text-sm hover:bg-muted"
            : "rounded-md hover:text-foreground hover:bg-muted/40",
          isActive
            ? "text-primary font-bold bg-primary/10 border border-primary/20"
            : "text-muted-foreground",
        )}
      >
        <span>{link.text}</span>
        {link.badge && (
          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-primary">
            {link.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/60 transition-all duration-300",
        isScrolled
          ? "bg-background/85 backdrop-blur-xl shadow-lg shadow-black/5 dark:bg-[#090a0f]/85"
          : "bg-background/95 backdrop-blur-md dark:bg-[#090a0f]/95",
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-primary/30 bg-primary/10 p-0.5 transition-transform group-hover:scale-105">
              <Image
                src={logo}
                alt="JS-Stack"
                fill
                sizes="32px"
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-base tracking-tight text-foreground">
                JS-STACK
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary hidden sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v1.2.16
              </span>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex items-center gap-1.5 border border-border/50 rounded-full bg-card/40 px-2 py-1 backdrop-blur-sm">
            {NAV_LINKS.map((link) => (
              <NavLinkItem key={link.url} link={link} />
            ))}
          </div>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2">
            {/* Start Building Quick CTA */}
            <Link href="/new" className="hidden lg:inline-flex">
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-md px-3 font-mono text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Builder</span>
              </Button>
            </Link>

            {/* NPM Package Link */}
            <Link
              href="https://www.npmjs.com/package/@vipinyadav02/createjsstack"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
              title="View on NPM Registry"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
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
                  ></polygon>
                  <path
                    fill="currentColor"
                    d="M24,7.25H0v8.143h6.666v1.357H12v-1.357h12V7.25L24,7.25z M6.666,14.036H5.333V9.964H4v4.072H1.333V8.608	h5.333V14.036L6.666,14.036z M13.333,14.036h-2.667v1.356H8V8.608h5.333V14.036L13.333,14.036z M22.667,14.036h-1.333V9.964H20	v4.072h-1.333V9.964h-1.333v4.072h-2.667V8.608h8V14.036L22.667,14.036z"
                  ></path>
                </svg>
              </Button>
            </Link>

            {/* GitHub Repository Link */}
            <Link
              href="https://github.com/vipinyadav01/js-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
              title="GitHub Repository"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
              >
                <Github className="h-4 w-4" />
              </Button>
            </Link>

            <ThemeToggle className="rounded-md h-8 w-8" />

            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8 rounded-md"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full pt-16 px-6 pb-6 bg-background">
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <NavLinkItem key={link.url} link={link} mobile />
                  ))}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <Link
                      href="/new"
                      onClick={() => setMobileOpen(false)}
                      className="w-full"
                    >
                      <Button className="w-full justify-center gap-2 font-mono text-xs font-bold bg-primary">
                        <Zap className="h-4 w-4" />
                        <span>Interactive Stack Builder</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
