"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "./icons/github-icon";
import {
  Menu,
  Zap,
  Activity,
  Code2,
  ExternalLink,
  ChevronRight,
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
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-border/50"
          : "bg-background/90 backdrop-blur-md border-border"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between max-w-7xl">
        {/* Logo Section - Desktop */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:scale-105 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-primary p-2.5 rounded-lg">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                JS-Stack
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Logo Section - Left */}
        <div className="flex lg:hidden items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-primary p-2 rounded-lg">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
              JS-Stack
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-accent/50 hover:text-accent-foreground",
                  isActive
                    ? "text-foreground bg-accent/70 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {item.badge}
                  </Badge>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              variant="ghost"
              size="sm"
              asChild
            >
              <Link
                href={action.href}
                target={action.external ? "_blank" : "_self"}
                rel={action.external ? "noopener noreferrer" : ""}
              >
                <action.icon className="h-10 w-10 mr-2" />
                {action.external && <ExternalLink className="h-5 w-5 ml-1 opacity-60" />}
              </Link>
            </Button>
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
              <Button variant="ghost" size="sm" className="relative overflow-hidden group">
                <div className="relative z-10">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-background/95 backdrop-blur-xl border-l">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              {/* Mobile Header */}
              <div className="p-6 border-b border-border/50">
                <Link
                  href="/"
                  className="group flex items-center space-x-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-gradient-to-r from-primary to-primary/80 p-2.5 rounded-lg">
                      <Code2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    JS-Stack
                  </span>
                </Link>
              </div>

              {/* Mobile Navigation Items */}
              <div className="p-4 space-y-2">
                <div className="px-2 mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </h4>
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                        "hover:bg-accent/50",
                        isActive
                          ? "bg-accent/70 text-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.name}</span>
                           
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
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
              <div className="p-4 border-t border-border/50 mt-auto">
                <div className="px-2 mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </h4>
                </div>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      className={cn(
                        "w-full justify-start h-auto p-3 transition-all duration-200",
                        action.name === "Install" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0" 
                          : "hover:bg-accent/50"
                      )}
                      asChild
                    >
                      <Link
                        href={action.href}
                        target={action.external ? "_blank" : "_self"}
                        rel={action.external ? "noopener noreferrer" : ""}
                        onClick={() => setMobileOpen(false)}
                      >
                        <action.icon className="h-4 w-4 mr-2" />
                        <span className="flex-1">{action.name}</span>
                        {action.external && <ExternalLink className="h-3 w-3 ml-auto opacity-60" />}
                      </Link>
                    </Button>
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