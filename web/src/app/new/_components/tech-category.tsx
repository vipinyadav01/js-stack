"use client";

import { motion } from "framer-motion";
import type React from "react";
import { InfoIcon, Terminal } from "lucide-react";
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
}

export function TechCategory({
  category,
  options,
  selected,
  onSelect,
  isMultiSelect,
  notes,
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
            const selected = isSelected(tech.id);

            return (
              <Tooltip key={tech.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={cn(
                      "relative cursor-pointer rounded border p-2 transition-all sm:p-3",
                      selected
                        ? "border-primary bg-primary/10"
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
                                selected ? "text-primary" : "text-foreground",
                              )}
                            >
                              {tech.name}
                            </span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                    {tech.default && !selected && (
                      <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                        Default
                      </span>
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
