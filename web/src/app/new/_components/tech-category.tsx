"use client";

import { motion } from "framer-motion";
import type React from "react";
import { Check, InfoIcon, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TechIcon } from "./tech-icon";
import { TechOption } from "./tech-options";

interface TechCategoryProps {
  category: string;
  options: TechOption[];
  selected: string | string[];
  onSelect: (category: string, techId: string) => void;
  isMultiSelect: boolean;
  notes?: {
    notes: string[];
    hasIssue: boolean;
  };
  recommendation?: {
    id: string;
    reason: string;
    strength: "required" | "recommended" | "suggested";
  };
}

export function TechCategory({
  category,
  options,
  selected,
  onSelect,
  isMultiSelect,
  notes,
  recommendation,
}: TechCategoryProps) {
  const isSelected = (techId: string) => {
    if (isMultiSelect) {
      return (selected as string[]).includes(techId);
    }
    return selected === techId;
  };

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      frontend: "Frontend Frameworks",
      backend: "Backend Frameworks",
      database: "Database",
      orm: "ORM/ODM",
      auth: "Authentication",
      dbSetup: "Database Setup",
      webDeploy: "Web Deployment",
      serverDeploy: "Server Deployment",
      addons: "Add-ons",
      packageManager: "Package Manager",
      git: "Git Repository",
      install: "Install Dependencies",
    };
    return titles[cat] || cat;
  };

  return (
    <TooltipProvider>
      <section className="mb-8 scroll-mt-4 sm:mb-10">
        <div className="mb-4 flex items-center gap-3 pb-3 border-b border-border">
          <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
            <Terminal className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-base sm:text-lg font-mono">
              {getCategoryTitle(category)}
            </h2>
          </div>
          {notes?.hasIssue && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 flex-shrink-0 cursor-help text-yellow-500 hover:text-yellow-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-xs">
                <ul className="list-disc space-y-1 pl-4 text-xs">
                  {notes.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {options.map((tech) => {
            const isTechSelected = isSelected(tech.id);
            const isRecommended = recommendation?.id === tech.id;
            const recommendationStrength = recommendation?.strength;

            return (
              <Tooltip key={tech.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={cn(
                      "relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200",
                      isTechSelected
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : isRecommended && recommendationStrength === "required"
                          ? "border-destructive/50 bg-destructive/5 hover:border-destructive/70"
                          : isRecommended
                            ? "border-green-500/50 bg-green-500/5 hover:border-green-500/70 hover:shadow-sm"
                            : "border-border bg-card hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm",
                    )}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(category, tech.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {(tech.icon || tech.emoji) && (
                              <TechIcon
                                icon={tech.icon || tech.emoji || ""}
                                name={tech.name}
                                className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
                              />
                            )}
                            <span
                              className={cn(
                                "font-semibold text-sm sm:text-base truncate",
                                isTechSelected
                                  ? "text-primary"
                                  : "text-foreground",
                              )}
                            >
                              {tech.name}
                            </span>
                            {/* Recommendation badge */}
                            {isRecommended && !isTechSelected && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "ml-auto text-[10px] px-1.5 py-0.5 shrink-0",
                                  recommendationStrength === "required"
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
                                )}
                              >
                                {recommendationStrength === "required"
                                  ? "Required"
                                  : recommendationStrength === "recommended"
                                    ? "⭐"
                                    : "💡"}
                              </Badge>
                            )}
                          </div>
                          {/* Show checkmark for selected items in single-select mode */}
                          {isTechSelected && !isMultiSelect && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex-shrink-0"
                            >
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            </motion.div>
                          )}
                          {/* Show count badge for multi-select (addons) */}
                          {isMultiSelect && isTechSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                        <p className="mt-2 text-muted-foreground text-xs leading-relaxed line-clamp-2">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                    {tech.default && !isTechSelected && (
                      <span className="absolute top-2 right-2 rounded-md bg-muted/80 backdrop-blur-sm border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Default
                      </span>
                    )}
                    {/* Recommendation tooltip content */}
                    {isRecommended && (
                      <TooltipContent
                        side="top"
                        align="start"
                        className="max-w-xs"
                      >
                        <p className="text-xs font-medium">
                          {recommendationStrength === "required"
                            ? "Required"
                            : "Recommended"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {recommendation?.reason}
                        </p>
                      </TooltipContent>
                    )}
                  </motion.div>
                </TooltipTrigger>
              </Tooltip>
            );
          })}
        </div>
      </section>
    </TooltipProvider>
  );
}
