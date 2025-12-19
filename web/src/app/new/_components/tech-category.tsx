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
      <section className="mb-6 scroll-mt-4 sm:mb-8">
        <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
          <Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
          <h2 className="font-semibold text-foreground text-sm sm:text-base">
            {getCategoryTitle(category)}
          </h2>
          {notes?.hasIssue && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <InfoIcon className="ml-2 h-4 w-4 flex-shrink-0 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <ul className="list-disc space-y-1 pl-4 text-xs">
                  {notes.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {options.map((tech) => {
            const isTechSelected = isSelected(tech.id);
            const isRecommended = recommendation?.id === tech.id;
            const recommendationStrength = recommendation?.strength;

            return (
              <Tooltip key={tech.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={cn(
                      "relative cursor-pointer rounded border p-2 transition-all sm:p-3",
                      isTechSelected
                        ? "border-primary bg-primary/10"
                        : isRecommended && recommendationStrength === "required"
                          ? "border-destructive bg-destructive/5"
                          : isRecommended
                            ? "border-green-500/50 bg-green-500/5 hover:border-green-500/70"
                            : "border-border hover:border-muted hover:bg-muted",
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(category, tech.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {(tech.icon || tech.emoji) && (
                              <TechIcon
                                icon={tech.icon || tech.emoji || ""}
                                name={tech.name}
                                className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4"
                              />
                            )}
                            <span
                              className={cn(
                                "font-medium text-xs sm:text-sm",
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
                                  "ml-1.5 text-[9px] px-1 py-0",
                                  recommendationStrength === "required"
                                    ? "bg-destructive/20 text-destructive"
                                    : "bg-green-500/20 text-green-600 dark:text-green-400",
                                )}
                              >
                                {recommendationStrength === "required"
                                  ? "Required"
                                  : recommendationStrength === "recommended"
                                    ? "⭐ Recommended"
                                    : "💡 Suggested"}
                              </Badge>
                            )}
                          </div>
                          {/* Show checkmark for selected items in single-select mode */}
                          {isTechSelected && !isMultiSelect && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="ml-2 flex-shrink-0"
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </motion.div>
                          )}
                          {/* Show count badge for multi-select (addons) */}
                          {isMultiSelect && isTechSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                    {tech.default && !isTechSelected && (
                      <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
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
