"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/new": "Stack Builder",
  "/features": "Features",
  "/analytics": "Analytics",
  "/sponsors": "Sponsors",
};

export function BreadcrumbNavigation({ className }: { className?: string }) {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/", current: pathname === "/" },
    ];

    if (pathname !== "/") {
      let currentPath = "";
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;

        breadcrumbs.push({
          label:
            routeLabels[currentPath] ||
            segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
          current: isLast,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground mx-2 flex-shrink-0" />
          )}
          {item.current ? (
            <span className="font-medium text-foreground font-mono uppercase tracking-wide">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="font-mono text-muted-foreground hover:text-foreground transition-colors duration-200 uppercase tracking-wide hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
            >
              {index === 0 && <Home className="h-3 w-3 inline mr-1" />}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
