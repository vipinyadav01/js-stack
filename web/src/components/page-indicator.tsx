"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Zap, Activity, Heart, Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pageInfo: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    gradient: string;
  }
> = {
  "/": {
    title: "JS-Stack",
    subtitle: "Modern full-stack development made simple",
    icon: Code2,
    color: "text-blue-600",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  "/new": {
    title: "Stack Builder",
    subtitle: "Create your perfect JavaScript stack interactively",
    icon: Terminal,
    color: "text-green-600",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  "/features": {
    title: "Features",
    subtitle: "Explore all capabilities and integrations",
    icon: Zap,
    color: "text-yellow-600",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Usage insights and development trends",
    icon: Activity,
    color: "text-purple-600",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  "/sponsors": {
    title: "Sponsors",
    subtitle: "Support the project and community",
    icon: Heart,
    color: "text-red-600",
    gradient: "from-red-500/20 to-rose-500/20",
  },
};

export function PageIndicator({
  showBackButton = false,
}: {
  showBackButton?: boolean;
}) {
  const pathname = usePathname();
  const currentPage = pageInfo[pathname];

  if (!currentPage) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r p-6 shadow-sm",
        currentPage.gradient,
      )}
    >
      <div className="relative z-10 flex items-center gap-4">
        {showBackButton && (
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm font-mono transition-all hover:bg-background hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        )}

        <div className="flex items-center gap-4 flex-1 min-w-0">
          <motion.div
            className={cn(
              "p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50",
              currentPage.color,
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <currentPage.icon className="h-6 w-6" />
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.h1
              className="text-xl font-bold font-mono text-foreground tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {currentPage.title}
            </motion.h1>
            <motion.p
              className="text-sm text-muted-foreground font-mono mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentPage.subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
    </div>
  );
}
