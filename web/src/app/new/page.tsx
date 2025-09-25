"use client";

import {
  Check,
  ChevronDown,
  ClipboardCopy,
  InfoIcon,
  Settings,
  Terminal,
} from "lucide-react";
import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  validateConfiguration,
} from "@/components/builder/config";
import { PageIndicator } from "@/components/page-indicator";
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

const getBadgeColors = (category: string): string => {
  const colors: Record<string, string> = {
    frontend: "border-blue-200 bg-blue-50 text-blue-700",
    backend: "border-green-200 bg-green-50 text-green-700",
    database: "border-purple-200 bg-purple-50 text-purple-700",
    orm: "border-orange-200 bg-orange-50 text-orange-700",
    auth: "border-red-200 bg-red-50 text-red-700",
    addons: "border-gray-200 bg-gray-50 text-gray-700",
  };
  return colors[category] || "border-gray-200 bg-gray-50 text-gray-700";
};

const generateStackCommand = (state: BuilderState): string => {
  const parts = [`npx create-js-stack@latest ${state.projectName}`];

  if (state.frontend !== "none") parts.push(`--frontend ${state.frontend}`);
  if (state.backend !== "none") parts.push(`--backend ${state.backend}`);
  if (state.database !== "none") parts.push(`--database ${state.database}`);
  if (state.orm !== "none") parts.push(`--orm ${state.orm}`);
  if (state.auth !== "none") parts.push(`--auth ${state.auth}`);
  if (state.addons.length > 0) parts.push(`--addons ${state.addons.join(",")}`);
  if (state.packageManager !== "npm")
    parts.push(`--pm ${state.packageManager}`);
  if (!state.installDependencies) parts.push("--no-install");
  if (!state.initializeGit) parts.push("--no-git");

  return parts.join(" ");
};

export default function BuilderPage() {
  const { state, onToggle, onNameChange, onBooleanToggle, resetToDefaults } =
    useBuilderState();

  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const validation = validateConfiguration(state);

  useEffect(() => {
    const cmd = generateStackCommand(state);
    setCommand(cmd);
  }, [state]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTechSelect = (category: keyof BuilderState, techId: string) => {
    onToggle(category, techId);
  };

  const selectedBadges = (() => {
    const badges: React.ReactNode[] = [];

    // Add selected technologies as badges
    if (state.frontend !== "none") {
      const tech = techCatalog.frontend.find((t) => t.key === state.frontend);
      if (tech) {
        badges.push(
          <span
            key={`frontend-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("frontend"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    }

    if (state.backend !== "none") {
      const tech = techCatalog.backend.find((t) => t.key === state.backend);
      if (tech) {
        badges.push(
          <span
            key={`backend-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("backend"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    }

    if (state.database !== "none") {
      const tech = techCatalog.database.find((t) => t.key === state.database);
      if (tech) {
        badges.push(
          <span
            key={`database-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("database"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    }

    if (state.orm !== "none") {
      const tech = techCatalog.orm.find((t) => t.key === state.orm);
      if (tech) {
        badges.push(
          <span
            key={`orm-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("orm"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    }

    if (state.auth !== "none") {
      const tech = techCatalog.auth.find((t) => t.key === state.auth);
      if (tech) {
        badges.push(
          <span
            key={`auth-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("auth"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    }

    state.addons.forEach((addon) => {
      const tech = techCatalog.addons.find((t) => t.key === addon);
      if (tech) {
        badges.push(
          <span
            key={`addon-${tech.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors("addons"),
            )}
          >
            {tech.name}
          </span>,
        );
      }
    });

    return badges;
  })();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border/50 bg-muted/20 p-4 sm:p-6">
          <PageIndicator showBackButton={true} />
        </div>

        <div className="grid w-full grid-cols-1 h-[calc(100vh-200px)] overflow-hidden border-border text-foreground sm:grid-cols-[auto_1fr]">
          {/* Fixed Sidebar */}
          <div className="flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm h-full">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 overflow-hidden">
              <div className="space-y-3">
                {/* Project Name Input */}
                <label className="flex flex-col">
                  <span className="mb-1 text-muted-foreground text-xs">
                    Project Name:
                  </span>
                  <input
                    type="text"
                    value={state.projectName || ""}
                    onChange={(e) => onNameChange(e.target.value)}
                    className={cn(
                      "w-full rounded border px-2 py-1 text-sm focus:outline-none",
                      "border-border focus:border-primary",
                    )}
                    placeholder="my-awesome-app"
                  />
                </label>

                {/* Command Display */}
                <div className="rounded border border-border p-2">
                  <div className="flex">
                    <span className="mr-2 select-none text-chart-4">$</span>
                    <code className="block break-all text-muted-foreground text-xs sm:text-sm">
                      {command}
                    </code>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={cn(
                        "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                        copied
                          ? "bg-muted text-chart-4"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      title={copied ? "Copied!" : "Copy command"}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 flex-shrink-0" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="h-3 w-3 flex-shrink-0" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Selected Stack Badges */}
                <div>
                  <h3 className="mb-2 font-medium text-foreground text-sm">
                    Selected Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
                </div>

                {/* Validation Status */}
                {(!validation.isValid || validation.warnings.length > 0) && (
                  <div className="space-y-2">
                    {!validation.isValid && (
                      <div className="rounded border border-red-200 bg-red-50 p-2">
                        <div className="flex items-center gap-2">
                          <InfoIcon className="h-4 w-4 text-red-600" />
                          <span className="text-red-800 text-sm font-medium">
                            {validation.errors.length} Issue
                            {validation.errors.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="mt-1 text-red-600 text-xs">
                          {validation.errors.slice(0, 2).join(". ")}
                        </div>
                      </div>
                    )}
                    {validation.warnings.length > 0 && (
                      <div className="rounded border border-amber-200 bg-amber-50 p-2">
                        <div className="flex items-center gap-2">
                          <InfoIcon className="h-4 w-4 text-amber-600" />
                          <span className="text-amber-800 text-sm font-medium">
                            {validation.warnings.length} Suggestion
                            {validation.warnings.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto border-border border-t pt-4">
                <div className="space-y-3">
                  <div className="flex gap-1">
                    <button
                      onClick={resetToDefaults}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
                    >
                      Reset
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
                        >
                          <Settings className="h-3 w-3" />
                          Settings
                          <ChevronDown className="ml-auto h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-64 bg-background"
                      >
                        <div className="p-2">
                          <div className="text-sm font-medium">
                            Configuration Options
                          </div>
                          <div className="mt-2 space-y-2 text-xs">
                            <label className="flex items-center justify-between">
                              <span>Install Dependencies</span>
                              <input
                                type="checkbox"
                                checked={state.installDependencies}
                                onChange={(e) =>
                                  onBooleanToggle(
                                    "installDependencies",
                                    e.target.checked,
                                  )
                                }
                                className="rounded"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span>Initialize Git</span>
                              <input
                                type="checkbox"
                                checked={state.initializeGit}
                                onChange={(e) =>
                                  onBooleanToggle(
                                    "initializeGit",
                                    e.target.checked,
                                  )
                                }
                                className="rounded"
                              />
                            </label>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Only Tech Grid Scrolls */}
          <div className="flex flex-1 flex-col overflow-hidden h-full">
            <ScrollArea
              ref={contentRef}
              className="flex-1 h-full overflow-y-auto scroll-smooth"
            >
              <main className="p-3 sm:p-4">
                {CATEGORY_ORDER.map((categoryKey) => {
                  const categoryOptions =
                    categoryKey === "frontend"
                      ? techCatalog.frontend
                      : categoryKey === "backend"
                        ? techCatalog.backend
                        : categoryKey === "database"
                          ? techCatalog.database
                          : categoryKey === "orm"
                            ? techCatalog.orm
                            : categoryKey === "auth"
                              ? techCatalog.auth
                              : categoryKey === "addons"
                                ? techCatalog.addons
                                : [];
                  const categoryDisplayName =
                    getCategoryDisplayName(categoryKey);

                  if (categoryOptions.length === 0) return null;

                  return (
                    <section
                      key={categoryKey}
                      id={`section-${categoryKey}`}
                      className="mb-6 scroll-mt-4 sm:mb-8"
                    >
                      <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
                        <Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                        <h2 className="font-semibold text-foreground text-sm sm:text-base">
                          {categoryDisplayName}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        {categoryOptions.map((tech) => {
                          const isSelected =
                            categoryKey === "addons"
                              ? state.addons.includes(
                                  tech.key as import("@/components/builder/config").Addon,
                                )
                              : state[categoryKey as keyof BuilderState] ===
                                tech.key;

                          const isIncompatible = (() => {
                            if (categoryKey === "orm") {
                              return !isCompatible(
                                "databaseOrm",
                                state.database,
                                tech.key,
                              );
                            }
                            if (categoryKey === "auth") {
                              return !isCompatible(
                                "frontendAuth",
                                state.frontend,
                                tech.key,
                              );
                            }
                            if (categoryKey === "database") {
                              return !isCompatible(
                                "backendDatabase",
                                state.backend,
                                tech.key,
                              );
                            }
                            if (categoryKey === "addons") {
                              return !isCompatible(
                                "frontendAddons",
                                state.frontend,
                                [tech.key],
                              );
                            }
                            return false;
                          })();

                          return (
                            <Tooltip key={tech.key} delayDuration={100}>
                              <TooltipTrigger asChild>
                                <motion.div
                                  className={cn(
                                    "relative cursor-pointer rounded border p-2 transition-all sm:p-3",
                                    isSelected
                                      ? "border-primary bg-primary/10"
                                      : isIncompatible
                                        ? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
                                        : "border-border hover:border-muted hover:bg-muted",
                                  )}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    handleTechSelect(
                                      categoryKey as keyof BuilderState,
                                      tech.key,
                                    )
                                  }
                                >
                                  <div className="flex items-start">
                                    <div className="flex-grow">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <span
                                            className={cn(
                                              "font-medium text-xs sm:text-sm",
                                              isSelected
                                                ? "text-primary"
                                                : "text-foreground",
                                            )}
                                          >
                                            {tech.name}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="mt-0.5 text-muted-foreground text-xs">
                                        {tech.desc}
                                      </p>
                                    </div>
                                  </div>
                                  {"badge" in tech && tech.badge && (
                                    <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                                      {tech.badge}
                                    </span>
                                  )}
                                </motion.div>
                              </TooltipTrigger>
                              {isIncompatible && (
                                <TooltipContent
                                  side="top"
                                  align="center"
                                  className="max-w-xs"
                                >
                                  <p className="text-xs">
                                    Incompatible with current selection
                                  </p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
                <div className="h-10" />
              </main>
            </ScrollArea>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
