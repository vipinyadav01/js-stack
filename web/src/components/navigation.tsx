"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "./icons/github-icon";
import { Logo } from "@/components/Logo";
import {
  Menu,
  Zap,
  Activity,
  ExternalLink,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  {
    name: "Features",
    href: "/features",
    icon: Zap,
    description: "Explore capabilities",
    badge: undefined
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Activity,
    description: "Usage insights",
    badge: undefined
  },
];

const quickActions = [
  {
    name: "GitHub",
    href: "https://github.com/vipinyadav01/js-stack",
    icon: GithubIcon,
    external: true
  },
  {
    name: "NPM",
    href: "https://www.npmjs.com/package/create-js-stack",
    icon: NpmIcon,
    external: true
  }
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-border",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg"
          : "bg-background/90 backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-[1280px] px-4 flex h-16 items-center justify-between">
        {/* Logo Section - Desktop */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/"
            className="hover:opacity-80 transition-all duration-200 group"
          >
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Mobile Logo Section - Left */}
        <div className="flex lg:hidden items-center">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity group"
          >
            <Logo size="sm" showText={true} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-2 px-3 py-2 rounded border border-border text-sm font-mono transition-all duration-200",
                  "hover:bg-muted/10 hover:border-primary/50",
                  isActive
                    ? "text-foreground bg-muted/20 border-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="uppercase">{item.name}</span>
                {item.badge && (
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    {item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              target={action.external ? "_blank" : "_self"}
              rel={action.external ? "noopener noreferrer" : ""}
              className="group flex items-center gap-2 rounded border border-border p-2 transition-colors hover:bg-muted/10 cursor-pointer"
            >
              <action.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
              <span className="text-sm font-mono uppercase">{action.name}</span>
              {action.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-border">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded border border-border p-2 hover:bg-muted/10">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-background/95 backdrop-blur-xl border-l border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              {/* Mobile Header */}
              <div className="p-6 border-b border-border">
                <Link
                  href="/"
                  className="group"
                  onClick={() => setMobileOpen(false)}
                >
                  <Logo size="md" showText={true} />
                </Link>
              </div>

              {/* Mobile Navigation Items */}
              <div className="p-4 space-y-2">
                <div className="px-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono text-muted-foreground">
                      NAVIGATION.TXT
                    </span>
                  </div>
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center justify-between p-3 rounded border border-border transition-all duration-200",
                        "hover:bg-muted/10 hover:border-primary/50",
                        isActive
                          ? "bg-muted/20 border-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-medium uppercase">{item.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform group-hover:translate-x-1",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </Link>
                  );
                })}

                 {/* Mobile Quick Actions */}
              <div className="p-4 border-t border-border mt-auto">
                <div className="px-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono text-muted-foreground">
                      QUICK_ACTIONS.TXT
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      target={action.external ? "_blank" : "_self"}
                      rel={action.external ? "noopener noreferrer" : ""}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-2 w-full rounded border border-border p-3 transition-colors hover:bg-muted/10 cursor-pointer"
                    >
                      <action.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                      <span className="flex-1 font-mono text-sm uppercase">{action.name}</span>
                      {action.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                    </Link>
                  ))}
                </div>
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}