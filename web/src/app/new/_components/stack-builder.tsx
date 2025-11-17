"use client";

import { useTransition } from "react";
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

export function StackBuilder() {
  const [stack, setStack] = useStackState();
  const [, startTransition] = useTransition();

  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  const displayStack = compatibilityAnalysis.adjustedStack || stack;

  const command = generateStackCommand(displayStack as StackState);

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
        Array.isArray(stackToUse.frontend) && stackToUse.frontend.length > 0
          ? stackToUse.frontend
          : Array.isArray(stack.frontend)
            ? stack.frontend
            : [],
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
        setStack({
          [category]: techId,
        } as Partial<StackState>);
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

  const handleReset = () => {
    startTransition(() => {
      setStack({
        projectName: "my-app", // Reset to default, but user can always change it
        frontend: [],
        backend: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: [],
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
    return ["frontend", "addons"].includes(category);
  };

  const selectedBadges: React.ReactNode = (() => {
    const badges: React.ReactNode[] = [];
    for (const category of CATEGORY_ORDER) {
      const categoryKey = category as keyof StackState;
      const options = TECH_OPTIONS[category];
      const selectedValue = displayStack[categoryKey];

      if (!options) continue;

      if (Array.isArray(selectedValue)) {
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
              onSave={() => {}}
              onLoad={() => {}}
              hasSavedStack={false}
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
                onSave={() => {}}
                onLoad={() => {}}
                hasSavedStack={false}
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
            <div className="space-y-6 sm:space-y-8">
              {CATEGORY_ORDER.map((category: string) => (
                <TechCategory
                  key={category}
                  category={category}
                  options={TECH_OPTIONS[category] || []}
                  selected={
                    isMultiSelectCategory(category)
                      ? (stack[category as keyof StackState] as string[]) || []
                      : stack[category as keyof StackState]
                  }
                  onSelect={handleTechSelect}
                  isMultiSelect={isMultiSelectCategory(category)}
                  notes={compatibilityAnalysis.notes?.[category]}
                />
              ))}
            </div>
            <div className="h-10" />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
