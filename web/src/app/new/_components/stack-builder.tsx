"use client";

import { useTransition, useMemo } from "react";
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
      if (isMultiSelectCategory(category)) {
        // Multi-select: toggle in array (only for addons)
        const current = (stack[category as keyof StackState] as string[]) || [];
        if (current.includes(techId)) {
          setStack({
            [category]: current.filter((id: string) => id !== techId),
          } as Partial<StackState>);
        } else {
          setStack({
            [category]: [...current, techId],
          } as Partial<StackState>);
        }
      } else {
        // Single-select: replace previous selection (frontend, backend, database, ORM, auth, etc.)
        const current = stack[category as keyof StackState];
        // If clicking the same option, deselect it (set to "none" for most categories)
        if (current === techId) {
          setStack({
            [category]: category === "packageManager" ? "npm" : "none",
          } as Partial<StackState>);
        } else {
          // Replace with new selection
          setStack({
            [category]: techId,
          } as Partial<StackState>);
        }
      }
    });
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (preset) {
      startTransition(() => {
        setStack(preset.stack as Partial<StackState>);
        toast.success(`Applied preset: ${preset.name}`);
      });
    }
  };

  const handleUseCaseSelect = (preset: Partial<StackState>) => {
    startTransition(() => {
      setStack(preset);
      toast.success("Use case preset applied!");
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
    <div className="flex h-screen w-full overflow-hidden border-border text-foreground lg:grid lg:grid-cols-[30%_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm">
        <ScrollArea className="flex-1">
          <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
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
            className="fixed top-4 left-4 z-50 lg:hidden h-9 w-9"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
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
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Use Case Presets Section */}
            <div className="mb-8">
              <UseCasePresets
                onSelectPreset={handleUseCaseSelect}
                currentStack={displayStack}
              />
            </div>

            {/* Matching Use Case Badge */}
            {matchingUseCase && (
              <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    💡 Best Match
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Your stack matches: <strong>{matchingUseCase.name}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Recommendations Warnings */}
            {recommendations.warnings.length > 0 && (
              <div className="mb-6 space-y-2">
                {recommendations.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 text-xs ${
                      warning.severity === "high"
                        ? "border-destructive bg-destructive/10"
                        : warning.severity === "medium"
                          ? "border-yellow-500/50 bg-yellow-500/10"
                          : "border-blue-500/50 bg-blue-500/10"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">
                        {warning.severity === "high" ? "❌" : "⚠️"}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{warning.message}</p>
                        {warning.fix && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => {
                              setStack({
                                [warning.type === "incompatibility"
                                  ? warning.fix?.includes("mongoose") ||
                                    warning.fix?.includes("prisma") ||
                                    warning.fix?.includes("drizzle")
                                    ? "orm"
                                    : warning.fix === "fastify"
                                      ? "backend"
                                      : "packageManager"
                                  : "backend"]: warning.fix,
                              } as Partial<StackState>);
                            }}
                          >
                            Fix: Use {warning.fix}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compatibility Score */}
            {recommendations.compatibilityScore < 100 && (
              <div className="mb-6 rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    Stack Compatibility
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {recommendations.compatibilityScore}/100
                    </span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          recommendations.compatibilityScore >= 80
                            ? "bg-green-500"
                            : recommendations.compatibilityScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${recommendations.compatibilityScore}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 sm:space-y-8">
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
            <div className="h-10" />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
