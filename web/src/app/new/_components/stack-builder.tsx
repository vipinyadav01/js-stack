"use client";

import { useTransition, useMemo, useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { StackState, useStackState } from "./use-stack-state";
import { TechCategory } from "./tech-category";
import { analyzeStackCompatibility } from "./utils";
import { generateStackCommand } from "./command-generator";
import { TECH_OPTIONS, CATEGORY_ORDER } from "./tech-options";
import { PRESET_TEMPLATES } from "./presets";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarContent } from "./sidebar-content";
import { UseCasePresets } from "./use-case-presets";
import {
  getRecommendations,
  findBestMatchingUseCase,
} from "@/lib/recommendations";
import type { BuilderState } from "@/components/builder/config";

export function StackBuilder() {
  const [stack, setStack] = useStackState();
  const [, startTransition] = useTransition();
  const posthog = usePostHog();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showUseCasePresets, setShowUseCasePresets] = useState(false);

  // Track performance metrics on page load
  useEffect(() => {
    if (posthog && typeof window !== "undefined" && "performance" in window) {
      const perfData = window.performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (perfData) {
        posthog.capture("page_performance", {
          page: "/new",
          page_title: "Stack Builder",
          ttfb: perfData.responseStart - perfData.requestStart,
          dom_load:
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart,
          full_load: perfData.loadEventEnd - perfData.loadEventStart,
        });
      }
    }
  }, [posthog]);

  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  const displayStack = compatibilityAnalysis.adjustedStack || stack;

  const command = generateStackCommand(displayStack as StackState, true);

  // Get smart recommendations based on current selections
  const recommendations = useMemo(() => {
    const builderState: Partial<BuilderState> = {
      frontend: (displayStack.frontend as BuilderState["frontend"]) || "none",
      backend: (displayStack.backend as BuilderState["backend"]) || "none",
      database: (displayStack.database as BuilderState["database"]) || "none",
      orm: (displayStack.orm as BuilderState["orm"]) || "none",
      auth: (displayStack.auth as BuilderState["auth"]) || "none",
      addons: (displayStack.addons as BuilderState["addons"]) || [],
      packageManager:
        (displayStack.packageManager as BuilderState["packageManager"]) ||
        "npm",
    };
    return getRecommendations(builderState);
  }, [displayStack]);

  // Find best matching use case
  const matchingUseCase = useMemo(() => {
    const builderState: Partial<BuilderState> = {
      frontend: (displayStack.frontend as BuilderState["frontend"]) || "none",
      backend: (displayStack.backend as BuilderState["backend"]) || "none",
      database: (displayStack.database as BuilderState["database"]) || "none",
      orm: (displayStack.orm as BuilderState["orm"]) || "none",
      auth: (displayStack.auth as BuilderState["auth"]) || "none",
    };
    return findBestMatchingUseCase(builderState);
  }, [displayStack]);

  const formatProjectName = (name: string): string => {
    return name.replace(/\s+/g, "-");
  };

  const generateStackSharingUrl = (stack: StackState): string => {
    if (typeof window === "undefined") {
      return "";
    }
    const params = new URLSearchParams();
    Object.entries(stack).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      } else if (value) {
        params.set(key, value.toString());
      }
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getStackUrl = (): string => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || stack.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackWithProjectName: StackState = {
      projectName: formattedProjectName,
      frontend:
        typeof stackToUse.frontend === "string"
          ? stackToUse.frontend
          : typeof stack.frontend === "string"
            ? stack.frontend
            : "none",
      backend: stackToUse.backend || stack.backend || "none",
      database: stackToUse.database || stack.database || "none",
      orm: stackToUse.orm || stack.orm || "none",
      auth: stackToUse.auth || stack.auth || "none",
      addons:
        Array.isArray(stackToUse.addons) && stackToUse.addons.length > 0
          ? stackToUse.addons
          : Array.isArray(stack.addons)
            ? stack.addons
            : [],
      dbSetup: stackToUse.dbSetup || stack.dbSetup || "none",
      webDeploy: stackToUse.webDeploy || stack.webDeploy || "none",
      serverDeploy: stackToUse.serverDeploy || stack.serverDeploy || "none",
      packageManager:
        stackToUse.packageManager || stack.packageManager || "npm",
      git: stackToUse.git || stack.git || "true",
      install: stackToUse.install || stack.install || "true",
      yolo: stackToUse.yolo || stack.yolo || "true",
    };
    return generateStackSharingUrl(stackWithProjectName);
  };

  const handleTechSelect = (category: string, techId: string) => {
    startTransition(() => {
      const previousValue = stack[category as keyof StackState];
      const newStack: Partial<StackState> = {};

      if (isMultiSelectCategory(category)) {
        // Multi-select: toggle in array (only for addons)
        const current = (stack[category as keyof StackState] as string[]) || [];
        if (current.includes(techId)) {
          (newStack as Record<string, string | string[]>)[category] =
            current.filter((id: string) => id !== techId);
        } else {
          (newStack as Record<string, string | string[]>)[category] = [
            ...current,
            techId,
          ];
        }
      } else {
        // Single-select: replace previous selection (frontend, backend, database, ORM, auth, etc.)
        const current = stack[category as keyof StackState];
        // If clicking the same option, deselect it (set to "none" for most categories)
        if (current === techId) {
          (newStack as Record<string, string | string[]>)[category] =
            category === "packageManager" ? "npm" : "none";
        } else {
          // Replace with new selection
          (newStack as Record<string, string | string[]>)[category] = techId;
        }
      }

      setStack(newStack);

      // Track selection
      if (posthog) {
        const updatedStack = { ...stack, ...newStack };
        posthog.capture("stack_option_selected", {
          category,
          option: techId,
          previous_value: previousValue,
          full_stack: updatedStack,
          timestamp: new Date().toISOString(),
        });
      }
    });
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (preset) {
      startTransition(() => {
        setStack(preset.stack as Partial<StackState>);
        toast.success(`Applied preset: ${preset.name}`);

        // Track preset selection
        if (posthog) {
          posthog.capture("preset_selected", {
            preset_id: presetId,
            preset_name: preset.name,
            preset_stack: preset.stack,
          });
        }
      });
    }
  };

  const handleUseCaseSelect = (preset: Partial<StackState>) => {
    startTransition(() => {
      setStack(preset);
      toast.success("Use case preset applied!");

      // Track use case preset selection
      if (posthog) {
        posthog.capture("use_case_preset_selected", {
          preset_stack: preset,
        });
      }
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setStack({
        projectName: "my-app", // Reset to default, but user can always change it
        frontend: "none", // Changed from [] to "none" for single selection
        backend: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: [],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        packageManager: "npm",
        git: "true",
        install: "true",
        yolo: "false",
      });
      toast.success("Stack reset to defaults");
    });
  };

  const handleRandom = () => {
    startTransition(() => {
      const randomStack: Partial<StackState> = {
        projectName: "my-app", // Default name, user can change it
      };

      for (const category of CATEGORY_ORDER) {
        const options = TECH_OPTIONS[category] || [];

        if (isMultiSelectCategory(category)) {
          // Multi-select: pick random number of options (only for addons)
          const numToPick = Math.floor(
            Math.random() * Math.min(options.length, 3),
          );
          if (numToPick === 0) {
            (randomStack as Record<string, unknown>)[category] = [];
          } else {
            const shuffled = options
              .filter((opt) => opt.id !== "none")
              .sort(() => 0.5 - Math.random())
              .slice(0, numToPick);
            (randomStack as Record<string, unknown>)[category] = shuffled.map(
              (opt) => opt.id,
            );
          }
        } else {
          // Single-select: pick one random option
          const randomIndex = Math.floor(Math.random() * options.length);
          (randomStack as Record<string, unknown>)[category] =
            options[randomIndex].id;
        }
      }

      setStack(randomStack);
      toast.success("Random stack generated!");
    });
  };

  const isMultiSelectCategory = (category: string): boolean => {
    // Only addons allows multiple selections
    return category === "addons";
  };

  const selectedBadges: React.ReactNode = (() => {
    const badges: React.ReactNode[] = [];
    for (const category of CATEGORY_ORDER) {
      const categoryKey = category as keyof StackState;
      const options = TECH_OPTIONS[category];
      const selectedValue = displayStack[categoryKey];

      if (!options) continue;

      if (Array.isArray(selectedValue)) {
        // Handle array values (only addons now)
        if (
          selectedValue.length === 0 ||
          (selectedValue.length === 1 && selectedValue[0] === "none")
        ) {
          continue;
        }

        for (const id of selectedValue) {
          if (id === "none") continue;
          const tech = options.find((opt) => opt.id === id);
          if (tech) {
            badges.push(
              <Badge
                key={`${category}-${tech.id}`}
                variant="secondary"
                className="text-xs"
              >
                {tech.name}
              </Badge>,
            );
          }
        }
      } else {
        // Handle string values (frontend, backend, database, ORM, auth, etc.)
        const tech = options.find((opt) => opt.id === selectedValue);
        if (
          !tech ||
          tech.id === "none" ||
          tech.id === "false" ||
          ((category === "git" || category === "install") && tech.id === "true")
        ) {
          continue;
        }
        badges.push(
          <Badge
            key={`${category}-${tech.id}`}
            variant="secondary"
            className="text-xs"
          >
            {tech.name}
          </Badge>,
        );
      }
    }

    if (badges.length === 0) {
      return (
        <span className="text-xs text-muted-foreground italic">
          No selections yet
        </span>
      );
    }

    return badges;
  })();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[28%] max-w-[380px] flex-col border-r border-border fixed left-0 top-0 h-screen z-10 bg-background shadow-lg">
        <ScrollArea className="flex-1">
          <div className="flex h-full flex-col gap-2 sm:gap-2.5 p-2 sm:p-3">
            <SidebarContent
              stack={stack}
              command={command}
              selectedBadges={selectedBadges}
              compatibilityNotes={compatibilityAnalysis.notes}
              onProjectNameChange={(value) => setStack({ projectName: value })}
              onReset={handleReset}
              onRandom={handleRandom}
              onApplyPreset={handlePresetSelect}
              onYoloToggle={(enabled) =>
                setStack({ yolo: enabled ? "true" : "false" })
              }
              stackUrl={getStackUrl()}
              showRecommendations={showRecommendations}
              onToggleRecommendations={() =>
                setShowRecommendations(!showRecommendations)
              }
              recommendations={recommendations}
              matchingUseCase={matchingUseCase}
              showUseCasePresets={showUseCasePresets}
              onToggleUseCasePresets={() =>
                setShowUseCasePresets(!showUseCasePresets)
              }
            />
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 lg:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-2 sm:gap-2.5 p-2 sm:p-3">
              <SidebarContent
                stack={stack}
                command={command}
                selectedBadges={selectedBadges}
                compatibilityNotes={compatibilityAnalysis.notes}
                onProjectNameChange={(value) =>
                  setStack({ projectName: value })
                }
                onReset={handleReset}
                onRandom={handleRandom}
                onApplyPreset={handlePresetSelect}
                onYoloToggle={(enabled) =>
                  setStack({ yolo: enabled ? "true" : "false" })
                }
                stackUrl={getStackUrl()}
                showRecommendations={showRecommendations}
                onToggleRecommendations={() =>
                  setShowRecommendations(!showRecommendations)
                }
                recommendations={recommendations}
                matchingUseCase={matchingUseCase}
                showUseCasePresets={showUseCasePresets}
                onToggleUseCasePresets={() =>
                  setShowUseCasePresets(!showUseCasePresets)
                }
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden lg:ml-[30%]">
        <ScrollArea className="h-full">
          <div className="min-h-full bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Use Case Presets Section - Only show when toggled */}
              {showUseCasePresets && (
                <div className="mb-10 sm:mb-12">
                  <UseCasePresets onSelectPreset={handleUseCaseSelect} />
                </div>
              )}

              {/* Tech Categories Section */}
              <div className="space-y-8 sm:space-y-10">
                {CATEGORY_ORDER.map((category: string) => {
                  // Get recommendations for this category
                  const categoryRecommendation =
                    category === "orm"
                      ? recommendations.orm
                      : category === "auth"
                        ? recommendations.auth
                        : category === "backend"
                          ? recommendations.backend
                          : undefined;

                  return (
                    <TechCategory
                      key={category}
                      category={category}
                      options={TECH_OPTIONS[category] || []}
                      selected={
                        isMultiSelectCategory(category)
                          ? (stack[category as keyof StackState] as string[]) ||
                            []
                          : (stack[category as keyof StackState] as string) ||
                            "none"
                      }
                      onSelect={handleTechSelect}
                      isMultiSelect={isMultiSelectCategory(category)}
                      notes={compatibilityAnalysis.notes?.[category]}
                      recommendation={categoryRecommendation}
                    />
                  );
                })}
              </div>
              <div className="h-16" />
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
