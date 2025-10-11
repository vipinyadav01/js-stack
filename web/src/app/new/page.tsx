"use client";

import { ChevronDown, Check, X, AlertTriangle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBuilderState } from "@/hooks/useBuilderState";
import {
  techCatalog,
  type BuilderState,
  isCompatible,
  type Addon,
} from "@/components/builder/config";
import { PageIndicator } from "@/components/page-indicator";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "database",
  "orm",
  "auth",
  "addons",
];

const getCategoryDisplayName = (category: string): string => {
  const names: Record<string, string> = {
    frontend: "Frontend Framework",
    backend: "Backend Framework",
    database: "Database",
    orm: "ORM / ODM",
    auth: "Authentication",
    addons: "Development Tools",
  };
  return names[category] || category;
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    frontend: "🎨",
    backend: "⚙️",
    database: "🗄️",
    orm: "🔗",
    auth: "🔐",
    addons: "🛠️",
  };
  return icons[category] || "📦";
};

const getCategoryColor = (
  category: string,
): { bg: string; ring: string; text: string } => {
  const colors: Record<string, { bg: string; ring: string; text: string }> = {
    frontend: {
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      text: "text-blue-600",
    },
    backend: {
      bg: "bg-green-500/10",
      ring: "ring-green-500/20",
      text: "text-green-600",
    },
    database: {
      bg: "bg-purple-500/10",
      ring: "ring-purple-500/20",
      text: "text-purple-600",
    },
    orm: {
      bg: "bg-orange-500/10",
      ring: "ring-orange-500/20",
      text: "text-orange-600",
    },
    auth: {
      bg: "bg-red-500/10",
      ring: "ring-red-500/20",
      text: "text-red-600",
    },
    addons: {
      bg: "bg-gray-500/10",
      ring: "ring-gray-500/20",
      text: "text-gray-600",
    },
  };
  return (
    colors[category] || {
      bg: "bg-gray-500/10",
      ring: "ring-gray-500/20",
      text: "text-gray-600",
    }
  );
};

export default function BuilderPage() {
  const {
    state,
    command,
    onToggle,
    onNameChange,
    onPackageManagerChange,
    setState,
  } = useBuilderState();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORY_ORDER),
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTechSelect = (category: keyof BuilderState, techId: string) => {
    onToggle(category, techId);
  };
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getSelectionCount = (categoryKey: string) => {
    if (categoryKey === "addons") return state.addons.length;
    const value = state[categoryKey as keyof BuilderState];
    return value && value !== "none" ? 1 : 0;
  };

  const totalSelections = CATEGORY_ORDER.reduce(
    (acc, cat) => acc + getSelectionCount(cat),
    0,
  );

  return (
    <TooltipProvider>
      <div className="h-screen bg-background overflow-hidden">
        <div className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm p-3 flex-shrink-0 shadow-sm">
          <PageIndicator showBackButton={true} />
        </div>
        <div className="flex flex-col w-full h-[calc(100vh-60px)] overflow-hidden text-foreground sm:flex-row">
          <aside className="flex w-full flex-col sm:w-[360px] lg:w-[400px] sm:h-full border-r border-border/50 bg-muted/5">
            <div className="flex h-full flex-col overflow-hidden">
              <BuilderSidebar
                state={state}
                command={command}
                onNameChange={onNameChange}
                onPackageManagerChange={onPackageManagerChange}
                onStackChange={setState}
              />
            </div>
          </aside>
          <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
            <ScrollArea ref={contentRef} className="flex-1 h-full">
              <main className="p-4 sm:p-6 lg:p-8 pb-12 max-w-[1800px] mx-auto">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                        Technology Stack
                      </h1>
                      <p className="text-sm text-muted-foreground max-w-2xl">
                        Select technologies for your project. Incompatible
                        options are automatically disabled based on your
                        selections.
                      </p>
                    </div>
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 ring-1 ring-primary/20"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {totalSelections} Selected
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="space-y-6">
                  {CATEGORY_ORDER.map((categoryKey, index) => {
                    const categoryOptions =
                      techCatalog[categoryKey as keyof typeof techCatalog] ||
                      [];
                    const categoryDisplayName =
                      getCategoryDisplayName(categoryKey);
                    const categoryIcon = getCategoryIcon(categoryKey);
                    const categoryColors = getCategoryColor(categoryKey);
                    const isExpanded = expandedCategories.has(categoryKey);
                    const selectionCount = getSelectionCount(categoryKey);
                    // categoryOptions will never be empty due to the || [] fallback
                    return (
                      <motion.section
                        key={categoryKey}
                        id={`section-${categoryKey}`}
                        className="scroll-mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="mb-4">
                          <button
                            onClick={() => toggleCategory(categoryKey)}
                            className="w-full group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl"
                          >
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all shadow-sm">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-lg ring-1",
                                    categoryColors.bg,
                                    categoryColors.ring,
                                  )}
                                >
                                  <span className="text-xl">
                                    {categoryIcon}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                                    {categoryDisplayName}
                                  </h2>
                                  <p className="text-xs text-muted-foreground">
                                    {categoryOptions.length} options available
                                    {selectionCount > 0 &&
                                      ` • ${selectionCount} selected`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {selectionCount > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 ring-1 ring-primary/20"
                                  >
                                    <Check className="h-3 w-3 text-primary" />
                                    <span className="text-xs font-medium text-primary">
                                      {selectionCount}
                                    </span>
                                  </motion.div>
                                )}
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </motion.div>
                              </div>
                            </div>
                          </button>
                        </div>
                        <AnimatePresence mode="wait">
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pl-0 sm:pl-4">
                                {categoryOptions.map((tech, techIndex) => {
                                  const isSelected =
                                    categoryKey === "addons"
                                      ? state.addons.includes(tech.key as Addon)
                                      : state[
                                          categoryKey as keyof BuilderState
                                        ] === tech.key;
                                  const isIncompatible = (() => {
                                    if (categoryKey === "orm")
                                      return !isCompatible(
                                        "databaseOrm",
                                        state.database,
                                        tech.key,
                                      );
                                    if (categoryKey === "auth")
                                      return !isCompatible(
                                        "frontendAuth",
                                        state.frontend,
                                        tech.key,
                                      );
                                    if (categoryKey === "database")
                                      return !isCompatible(
                                        "backendDatabase",
                                        state.backend,
                                        tech.key,
                                      );
                                    if (categoryKey === "addons")
                                      return !isCompatible(
                                        "frontendAddons",
                                        state.frontend,
                                        [tech.key],
                                      );
                                    return false;
                                  })();
                                  return (
                                    <Tooltip key={tech.key} delayDuration={300}>
                                      <TooltipTrigger asChild>
                                        <motion.button
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                            delay: techIndex * 0.03,
                                          }}
                                          onClick={() =>
                                            !isIncompatible &&
                                            handleTechSelect(
                                              categoryKey as keyof BuilderState,
                                              tech.key,
                                            )
                                          }
                                          disabled={isIncompatible}
                                          className={cn(
                                            "relative group text-left rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]",
                                            isSelected
                                              ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md"
                                              : isIncompatible
                                                ? "border-red-200 bg-red-50/50 opacity-60 cursor-not-allowed"
                                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm cursor-pointer",
                                          )}
                                          whileHover={
                                            !isIncompatible
                                              ? { scale: 1.02, y: -2 }
                                              : {}
                                          }
                                          whileTap={
                                            !isIncompatible
                                              ? { scale: 0.98 }
                                              : {}
                                          }
                                        >
                                          <AnimatePresence>
                                            {isSelected && (
                                              <motion.div
                                                initial={{
                                                  scale: 0,
                                                  opacity: 0,
                                                }}
                                                animate={{
                                                  scale: 1,
                                                  opacity: 1,
                                                }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                                              >
                                                <Check className="h-3.5 w-3.5" />
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                          {isIncompatible && (
                                            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                                              <X className="h-3.5 w-3.5" />
                                            </div>
                                          )}
                                          {"badge" in tech && tech.badge && (
                                            <span className="absolute top-2 left-2 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                                              {tech.badge}
                                            </span>
                                          )}
                                          <div className="space-y-2 mt-2">
                                            <h3
                                              className={cn(
                                                "font-semibold text-sm sm:text-base",
                                                isSelected
                                                  ? "text-primary"
                                                  : isIncompatible
                                                    ? "text-red-700"
                                                    : "text-foreground",
                                              )}
                                            >
                                              {tech.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                              {tech.desc}
                                            </p>
                                          </div>
                                          {!isIncompatible && !isSelected && (
                                            <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                          )}
                                        </motion.button>
                                      </TooltipTrigger>
                                      {isIncompatible && (
                                        <TooltipContent
                                          side="top"
                                          align="center"
                                          className="max-w-xs"
                                        >
                                          <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-xs font-medium mb-1">
                                                Incompatible Selection
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                This option is not compatible
                                                with your current stack
                                                configuration
                                              </p>
                                            </div>
                                          </div>
                                        </TooltipContent>
                                      )}
                                      {!isIncompatible && (
                                        <TooltipContent
                                          side="top"
                                          align="center"
                                          className="max-w-xs"
                                        >
                                          <p className="text-xs">{tech.desc}</p>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.section>
                    );
                  })}
                </div>
                <div className="h-20" />
              </main>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
