"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Menu, Github, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";

interface NavLink {
  text: string;
  url: string;
}

const NAV_LINKS: NavLink[] = [
  { text: "Builder", url: "/new" },
  { text: "Analytics", url: "/analytics" },
  { text: "Sponsors", url: "/sponsors" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
          "px-3 py-1.5 text-sm font-medium transition-colors",
          mobile
            ? "w-full rounded-lg p-3 hover:bg-muted"
            : "rounded-md hover:text-primary",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      >
        {link.text}
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-300",
          isScrolled ? "bg-background/80 backdrop-blur-xl" : "bg-background",
        )}
      >
        <nav className="mx-auto max-w-[1280px] px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src={logo}
                  alt="JS Stack"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold hidden sm:inline-block text-foreground">
                  JS Stack
                </span>
                <Terminal className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLinkItem key={link.url} link={link} />
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="https://www.npmjs.com/package/createjsstack"
                target="_blank"
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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

              <Link
                href="https://github.com/vipinyadav01/js-stack"
                target="_blank"
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </Link>

              <ThemeToggle className="rounded-md" />

              {/* Mobile Toggle */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9 rounded-md"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full pt-16 px-6 pb-6">
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((link) => (
                      <NavLinkItem key={link.url} link={link} mobile />
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
