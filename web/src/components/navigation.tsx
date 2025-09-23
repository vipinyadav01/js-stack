"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from 'next/link'
import { NpmIcon } from "@/components/icons/npm-icon";
import { GithubIcon } from "./icons/github-icon";
import favicon from "../Images/logo.png";
import {
  Menu,
  Zap,
  Activity,
  Heart,
  ExternalLink,
  ChevronRight,
  Terminal,
  Code2,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

const navItems = [
  {
    name: "Features",
    href: "/features",
    icon: Zap,
    description: "Explore capabilities",
    badge: undefined
  },
  {
    name: "Builder",
    href: "/new",
    icon: Terminal,
    description: "Visual stack builder",
    badge: undefined
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Activity,
    description: "Usage insights",
    badge: undefined
  },
  {
    name: "Sponsors",
    href: "/sponsors",
    icon: Heart,
    description: "Support & recognition",
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

// Enhanced Logo component with better error handling and performance
function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg", className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClasses = {
    sm: { 
      container: "h-7 w-7", 
      icon: "h-4 w-4", 
      pulse: "w-1 h-1",
      image: 20
    },
    md: { 
      container: "h-8 w-8", 
      icon: "h-5 w-5", 
      pulse: "w-1 h-1",
      image: 24
    },
    lg: { 
      container: "h-10 w-10", 
      icon: "h-6 w-6", 
      pulse: "w-1.5 h-1.5",
      image: 32
    }
  };
  
  const sizes = sizeClasses[size];
  
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);
  
  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div className={cn(
        "rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        sizes.container
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        
        {!imageError ? (
          <div className="relative">
            <Image
              src={favicon}
              alt="JS-Stack Logo"
              width={sizes.image}
              height={sizes.image}
              className={cn(
                "object-contain transition-opacity duration-300", 
                sizes.icon,
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority
            />
            {!imageLoaded && (
              <div className={cn("absolute inset-0 animate-pulse bg-muted/20 rounded", sizes.icon)} />
            )}
          </div>
        ) : (
          <Code2 className={cn("text-primary", sizes.icon)} />
        )}
        
        <div className={cn(
          "absolute bottom-0.5 right-0.5 bg-primary/80 animate-pulse rounded-full",
          sizes.pulse
        )} />
      </div>
      <div className="absolute inset-0 rounded-lg border border-primary/10 blur-sm -z-10" />
    </div>
  );
}

// Enhanced Brand text component with better typography
function BrandText({ size = "md", className }: { size?: "sm" | "md" | "lg", className?: string }) {
  const textSizes = {
    sm: { title: "text-sm leading-tight", subtitle: "text-xs leading-tight" },
    md: { title: "text-lg leading-tight", subtitle: "text-sm leading-tight" },
    lg: { title: "text-xl leading-tight", subtitle: "text-base leading-tight" }
  };
  
  const sizes = textSizes[size];
  
  return (
    <div className={cn("flex flex-col min-w-0", className)}>
      <span className={cn("font-bold font-mono text-foreground tracking-tight", sizes.title)}>
        JS-Stack
      </span>
      <span className={cn("font-mono text-muted-foreground opacity-80", sizes.subtitle)}>
        create-js-stack
      </span>
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enhanced scroll handling with throttling
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > 10);
      }, 16); // ~60fps throttling
    };

    handleScroll(); // Set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMounted]);

  // Enhanced mobile menu handling
  const handleMobileMenuClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close mobile menu on route change and escape key
  useEffect(() => {
    if (mobileOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleMobileMenuClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [mobileOpen, handleMobileMenuClose]);

  useEffect(() => {
    handleMobileMenuClose();
  }, [pathname, handleMobileMenuClose]);

  // Prevent rendering until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-full px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg border border-primary/20 bg-muted/20 animate-pulse" />
            <div className="hidden sm:block">
              <div className="h-5 w-20 bg-muted/20 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded border border-border bg-muted/20 animate-pulse" />
            <div className="h-8 w-8 rounded border border-border bg-muted/20 animate-pulse lg:hidden" />
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
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-border/80"
          : "bg-background/90 backdrop-blur-md border-border/40"
      )}
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center min-w-0">
            <Link
              href="/"
              className="group flex items-center gap-3 hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg p-1 -m-1"
              aria-label="JS-Stack Home"
            >
              <Logo size="md" />
              <div className="hidden sm:block">
                <BrandText size="md" />
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav 
            role="navigation" 
            aria-label="Primary navigation" 
            className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl mx-8"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200",
                    "hover:bg-muted/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                    "border border-transparent hover:border-primary/20",
                    isActive
                      ? "text-foreground bg-muted/30 border-primary/40 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                  )} />
                  <span className="uppercase tracking-wide font-medium whitespace-nowrap">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                target={action.external ? "_blank" : "_self"}
                rel={action.external ? "noopener noreferrer" : ""}
                className="group flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 transition-all duration-200 hover:bg-muted/50 hover:border-primary/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                aria-label={`${action.name}${action.external ? ' (opens in new tab)' : ''}`}
              >
                <action.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="text-sm font-mono uppercase tracking-wide font-medium whitespace-nowrap">{action.name}</span>
                {action.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
              </Link>
            ))}

            <div className="ml-3 pl-3 border-l border-border/50">
              <ThemeToggle />
            </div>
          </div>

          {/* Enhanced Mobile Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg border border-border/50 p-2 hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-haspopup="dialog"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-navigation"
                >
                  {mobileOpen ? (
                    <X className="h-4 w-4 transition-transform" />
                  ) : (
                    <Menu className="h-4 w-4 transition-transform" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 p-0 bg-background/98 backdrop-blur-xl border-l border-border/80" 
                id="mobile-navigation" 
                aria-label="Mobile navigation menu"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                
                {/* Enhanced Mobile Header */}
                <div className="p-6 border-b border-border/50 bg-muted/10">
                  <Link
                    href="/"
                    className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg p-1 -m-1"
                    onClick={handleMobileMenuClose}
                    aria-label="JS-Stack Home"
                  >
                    <Logo size="md" />
                    <BrandText size="md" />
                  </Link>
                </div>

                {/* Enhanced Mobile Navigation */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      <div className="px-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                            Navigation
                          </span>
                        </div>
                      </div>
                      
                      {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleMobileMenuClose}
                            className={cn(
                              "group flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                              "hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm",
                              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                              isActive
                                ? "bg-muted/40 border-primary/40 shadow-sm"
                                : "border-border/30 hover:border-primary/30"
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <div className={cn(
                                "flex-shrink-0 p-2 rounded-md transition-colors",
                                isActive ? "bg-primary/10" : "bg-muted/30 group-hover:bg-primary/10"
                              )}>
                                <item.icon className={cn(
                                  "h-4 w-4 transition-colors",
                                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className={cn(
                                    "font-mono text-sm font-medium uppercase tracking-wide truncate",
                                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                  )}>
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="flex-shrink-0 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs font-mono">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "flex-shrink-0 h-4 w-4 transition-all duration-200",
                              "group-hover:translate-x-1 group-hover:text-primary",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Enhanced Mobile Quick Actions */}
                  <div className="border-t border-border/50 bg-muted/5">
                    <div className="p-4">
                      <div className="px-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                            Quick Actions
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {quickActions.map((action) => (
                          <Link
                            key={action.name}
                            href={action.href}
                            target={action.external ? "_blank" : "_self"}
                            rel={action.external ? "noopener noreferrer" : ""}
                            onClick={handleMobileMenuClose}
                            className="group flex items-center gap-3 p-3 rounded-lg border border-border/30 transition-all duration-200 hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                            aria-label={`${action.name}${action.external ? ' (opens in new tab)' : ''}`}
                          >
                            <div className="flex-shrink-0 p-2 rounded-md bg-muted/30 group-hover:bg-primary/10 transition-colors">
                              <action.icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                            </div>
                            <span className="flex-1 font-mono text-sm font-medium uppercase tracking-wide">
                              {action.name}
                            </span>
                            {action.external && (
                              <ExternalLink className="flex-shrink-0 h-3 w-3 text-muted-foreground" />
                            )}
                          </Link>
                        ))}
                        
                        <div className="md:hidden mt-2 pt-2 border-t border-border/30">
                          <div className="flex justify-center">
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}