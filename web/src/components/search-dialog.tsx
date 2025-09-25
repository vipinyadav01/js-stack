"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Terminal,
  Zap,
  Activity,
  Heart,
  Code2,
  ExternalLink,
  ArrowRight,
  Hash,
  FileText,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  keywords: string[];
  external?: boolean;
}

const searchItems: SearchItem[] = [
  // Pages
  {
    id: "home",
    title: "Home",
    description: "Welcome page and project overview",
    url: "/",
    icon: Code2,
    category: "Pages",
    keywords: ["home", "welcome", "overview", "main"],
  },
  {
    id: "builder",
    title: "Stack Builder",
    description: "Interactive tool to build your JavaScript stack",
    url: "/new",
    icon: Terminal,
    category: "Pages",
    keywords: ["builder", "create", "stack", "interactive", "tool", "generate"],
  },
  {
    id: "features",
    title: "Features",
    description: "Explore all capabilities and integrations",
    url: "/features",
    icon: Zap,
    category: "Pages",
    keywords: ["features", "capabilities", "integrations", "tools"],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Usage insights and development trends",
    url: "/analytics",
    icon: Activity,
    category: "Pages",
    keywords: ["analytics", "insights", "trends", "usage", "statistics"],
  },
  {
    id: "sponsors",
    title: "Sponsors",
    description: "Support the project and view sponsors",
    url: "/sponsors",
    icon: Heart,
    category: "Pages",
    keywords: ["sponsors", "support", "donate", "funding"],
  },

  // External Links
  {
    id: "github",
    title: "GitHub Repository",
    description: "Source code, issues, and contributions",
    url: "https://github.com/vipinyadav01/js-stack",
    icon: Code2,
    category: "External",
    keywords: ["github", "source", "code", "repository", "issues"],
    external: true,
  },
  {
    id: "npm",
    title: "NPM Package",
    description: "Install and view package details",
    url: "https://www.npmjs.com/package/create-js-stack",
    icon: Hash,
    category: "External",
    keywords: ["npm", "package", "install", "download"],
    external: true,
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Complete guide and API reference",
    url: "https://github.com/vipinyadav01/js-stack#readme",
    icon: FileText,
    category: "External",
    keywords: ["docs", "documentation", "guide", "api", "reference"],
    external: true,
  },

  // Stack Technologies (for quick access)
  {
    id: "react",
    title: "React Setup",
    description: "Build React applications with Vite",
    url: "/new?frontend=react",
    icon: Code2,
    category: "Technologies",
    keywords: ["react", "frontend", "vite", "jsx", "components"],
  },
  {
    id: "nextjs",
    title: "Next.js Setup",
    description: "Full-stack React framework",
    url: "/new?frontend=nextjs",
    icon: Terminal,
    category: "Technologies",
    keywords: ["nextjs", "react", "fullstack", "ssr", "framework"],
  },
  {
    id: "express",
    title: "Express Backend",
    description: "Minimal and flexible Node.js backend",
    url: "/new?backend=express",
    icon: Terminal,
    category: "Technologies",
    keywords: ["express", "backend", "nodejs", "api", "server"],
  },
  {
    id: "prisma",
    title: "Prisma ORM",
    description: "Next-generation type-safe ORM",
    url: "/new?orm=prisma",
    icon: Hash,
    category: "Technologies",
    keywords: ["prisma", "orm", "database", "typescript", "sql"],
  },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSelect = useCallback(
    (item: SearchItem) => {
      onOpenChange(false);
      setSearchQuery("");

      if (item.external) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.url);
      }
    },
    [onOpenChange, router],
  );

  const filteredItems =
    searchQuery.length > 0
      ? searchItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        )
      : searchItems;

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search</DialogTitle>
      <CommandInput
        placeholder="Search pages, features, and technologies..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for pages, features, or technologies
            </p>
          </div>
        </CommandEmpty>

        {Object.entries(groupedItems).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.description} ${item.keywords.join(" ")}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className="flex-shrink-0 p-1.5 rounded-md bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.external && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

// Search trigger button component
export function SearchTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Enhanced platform detection for accurate Windows/Mac detection
    const detectPlatform = () => {
      // Check multiple indicators for Mac
      const isMacPlatform = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
      const isMacUserAgent = /Mac OS X|macOS/i.test(navigator.userAgent);
      const hasMetaKey = "metaKey" in KeyboardEvent.prototype;

      // For Windows specifically
      const isWindows =
        /Win/i.test(navigator.platform) || /Windows/i.test(navigator.userAgent);

      // Return true only if definitely Mac, otherwise assume Windows/Linux (Ctrl)
      return (isMacPlatform || isMacUserAgent) && hasMetaKey && !isWindows;
    };

    setIsMac(detectPlatform());
  }, []);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-muted-foreground transition-all duration-200",
        "hover:bg-muted/50 hover:border-primary/40 hover:text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "backdrop-blur-sm",
        className,
      )}
      aria-label={`Open search (${isMac ? "⌘K" : "Ctrl+Q"} or /)`}
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline font-mono">Search...</span>
      <div className="hidden sm:flex items-center gap-1 ml-auto">
        <div className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {isMac ? (
              <>
                <span className="text-xs">⌘</span>
                <span>K</span>
              </>
            ) : (
              <>
                <span className="text-[9px]">Ctrl</span>
                <span className="text-[8px]">+</span>
                <span>Q</span>
              </>
            )}
          </kbd>
          <span className="text-muted-foreground text-[10px]">or</span>
          <kbd className="pointer-events-none inline-flex h-5 w-5 select-none items-center justify-center rounded border bg-muted font-mono text-[10px] font-medium text-muted-foreground">
            /
          </kbd>
        </div>
      </div>
    </button>
  );
}
