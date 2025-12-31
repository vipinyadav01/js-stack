"use client";

import {
  Check,
  ChevronDown,
  ClipboardCopy,
  InfoIcon,
  Menu,
  Settings,
  Terminal,
  Shuffle,
  Save,
  Download,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import type React from "react";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TECH_OPTIONS, CATEGORY_ORDER, type TechOption } from "./tech-options";
import { StackState, useStackState } from "./use-stack-state";
import {
  generateStackCommand,
  generateStackSharingUrl,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";
import { ActionButtons } from "./action-buttons";
import { getBadgeColors } from "./get-badge-color";
import { PresetDropdown } from "./preset-dropdown";
import { ShareButton } from "./share-button";
import { TechIcon } from "./tech-icon";
import {
  analyzeStackCompatibility,
  getCategoryDisplayName,
  getDisabledReason,
  isOptionCompatible,
  validateProjectName,
} from "./utils";
import { YoloToggle } from "./yolo-toggle";
import { PRESET_TEMPLATES } from "./presets";

function formatProjectName(name: string): string {
  return name.replace(/\s+/g, "-");
}

const DEFAULT_STACK: StackState = {
  projectName: "my-app",
  frontend: "none",
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
  yolo: "true",
};

export function StackBuilder() {
  const [stack, setStack] = useStackState();
  const posthog = usePostHog();

  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
  const [, setLastChanges] = useState<
    Array<{ category: string; message: string }>
  >([]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const lastAppliedStackString = useRef<string>("");

  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  const projectNameError = validateProjectName(stack.projectName || "");

  const getStackUrl = useCallback((): string => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackWithProjectName: StackState = {
      ...DEFAULT_STACK,
      ...stackToUse,
      projectName: formattedProjectName,
    };
    return generateStackSharingUrl(stackWithProjectName);
  }, [compatibilityAnalysis.adjustedStack, stack]);

  const getRandomStack = () => {
    const randomStack: Partial<StackState> = {};
    for (const category of CATEGORY_ORDER) {
      const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS] || [];
      if (options.length === 0) continue;
      const catKey = category as keyof StackState;
      if (catKey === "addons") {
        const numToPick = Math.floor(
          Math.random() * Math.min(options.length, 4),
        );
        if (numToPick === 0) {
          randomStack[catKey] = [];
        } else {
          const shuffledOptions = [...options]
            .filter((opt) => opt.id !== "none")
            .sort(() => 0.5 - Math.random())
            .slice(0, numToPick);
          randomStack[catKey] = shuffledOptions.map((opt) => opt.id);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * options.length);
        (randomStack[catKey] as string) = options[randomIndex].id;
      }
    }
    startTransition(() => {
      setStack({
        ...(randomStack as StackState),
        projectName: stack.projectName || "my-app",
      });
    });
    contentRef.current?.scrollTo(0, 0);

    // Track random stack generation
    posthog?.capture("random_stack_generated", {
      stack: randomStack,
    });
  };

  const selectedBadges = (() => {
    const badges: React.ReactNode[] = [];
    for (const category of CATEGORY_ORDER) {
      const categoryKey = category as keyof StackState;
      const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
      const selectedValue = stack[categoryKey];

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
              <span
                key={`${category}-${tech.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
                  getBadgeColors(category),
                )}
              >
                {tech.emoji && <span className="text-xs">{tech.emoji}</span>}
                {tech.name}
              </span>,
            );
          }
        }
      } else {
        const tech = options.find((opt) => opt.id === selectedValue);
        if (
          !tech ||
          tech.id === "none" ||
          tech.id === "false" ||
          ((category === "git" ||
            category === "install" ||
            category === "auth") &&
            tech.id === "true")
        ) {
          continue;
        }
        badges.push(
          <span
            key={`${category}-${tech.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
              getBadgeColors(category),
            )}
          >
            {tech.emoji && <span className="text-xs">{tech.emoji}</span>}
            {tech.name}
          </span>,
        );
      }
    }
    return badges;
  })();

  useEffect(() => {
    const savedStack = localStorage.getItem("jsStackPreference");
    if (savedStack) {
      try {
        const parsedStack = JSON.parse(savedStack) as StackState;
        setLastSavedStack(parsedStack);
      } catch (e) {
        console.error("Failed to parse saved stack", e);
        localStorage.removeItem("jsStackPreference");
      }
    }
  }, []);

  useEffect(() => {
    if (compatibilityAnalysis.adjustedStack) {
      const adjustedStackString = JSON.stringify(
        compatibilityAnalysis.adjustedStack,
      );

      if (lastAppliedStackString.current !== adjustedStackString) {
        startTransition(() => {
          if (compatibilityAnalysis.changes.length > 0) {
            if (compatibilityAnalysis.changes.length === 1) {
              toast.info(compatibilityAnalysis.changes[0].message, {
                duration: 4000,
              });
            } else if (compatibilityAnalysis.changes.length > 1) {
              const message = `${
                compatibilityAnalysis.changes.length
              } compatibility adjustments made:\n${compatibilityAnalysis.changes
                .map((c) => `• ${c.message}`)
                .join("\n")}`;
              toast.info(message, {
                duration: 5000,
              });
            }
          }
          setLastChanges(compatibilityAnalysis.changes);
          if (compatibilityAnalysis.adjustedStack) {
            setStack(compatibilityAnalysis.adjustedStack);
          }
          lastAppliedStackString.current = adjustedStackString;
        });
      }
    }
  }, [
    compatibilityAnalysis.adjustedStack,
    compatibilityAnalysis.changes,
    setStack,
  ]);

  useEffect(() => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackWithProjectName: StackState = {
      ...DEFAULT_STACK,
      ...stackToUse,
      projectName: formattedProjectName,
    };
    const cmd = generateStackCommand(stackWithProjectName);
    setCommand(cmd);
  }, [stack, compatibilityAnalysis.adjustedStack]);

  const handleTechSelect = (
    category: keyof typeof TECH_OPTIONS,
    techId: string,
  ) => {
    if (!isOptionCompatible(stack, category, techId)) {
      return;
    }

    const previousValue = stack[category as keyof StackState];
    const catKey = category as keyof StackState;
    const update: Partial<StackState> = {};
    const currentValue = stack[catKey];

    if (catKey === "addons") {
      const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];
      let nextArray = [...currentArray];
      const isSelected = currentArray.includes(techId);

      if (isSelected) {
        nextArray = nextArray.filter((id) => id !== techId);
      } else {
        nextArray.push(techId);
      }
      if (nextArray.length > 1) {
        nextArray = nextArray.filter((id) => id !== "none");
      }
      if (nextArray.length === 0) {
        nextArray = [];
      }

      const uniqueNext = [...new Set(nextArray)].sort();
      const uniqueCurrent = [...new Set(currentArray)].sort();

      if (JSON.stringify(uniqueNext) !== JSON.stringify(uniqueCurrent)) {
        update[catKey] = uniqueNext;
      }
    } else {
      if (currentValue !== techId) {
        (update as Record<string, string>)[catKey] = techId;
      } else {
        if (
          (category === "git" || category === "install") &&
          techId === "false"
        ) {
          (update as Record<string, string>)[catKey] = "true";
        } else if (
          (category === "git" || category === "install") &&
          techId === "true"
        ) {
          (update as Record<string, string>)[catKey] = "false";
        }
      }
    }

    if (Object.keys(update).length > 0) {
      startTransition(() => {
        setStack(update);
      });
    }

    // Track selection
    posthog?.capture("stack_option_selected", {
      category,
      selected_value: techId,
      previous_value: previousValue,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Command copied to clipboard!");

    // Track copy
    posthog?.capture("command_copied", {
      command,
      stack_combination: `${stack.frontend}-${stack.backend}-${stack.database}`,
    });
  };

  const resetStack = () => {
    startTransition(() => {
      setStack(DEFAULT_STACK);
    });
    contentRef.current?.scrollTo(0, 0);
    toast.success("Stack reset to defaults");
  };

  const saveCurrentStack = () => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackToSave = {
      ...DEFAULT_STACK,
      ...stackToUse,
      projectName: formattedProjectName,
    };
    localStorage.setItem("jsStackPreference", JSON.stringify(stackToSave));
    setLastSavedStack(stackToSave as StackState);
    toast.success("Your stack configuration has been saved");
  };

  const loadSavedStack = () => {
    if (lastSavedStack) {
      startTransition(() => {
        setStack(lastSavedStack);
      });
      contentRef.current?.scrollTo(0, 0);
      toast.success("Saved configuration loaded");
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find(
      (template: {
        id: string;
        name: string;
        description: string;
        stack: Partial<StackState>;
      }) => template.id === presetId,
    );
    if (preset) {
      startTransition(() => {
        setStack(preset.stack);
      });
      contentRef.current?.scrollTo(0, 0);
      toast.success(`Applied preset: ${preset.name}`);

      // Track preset selection
      posthog?.capture("preset_selected", {
        preset_id: presetId,
        preset_name: preset.name,
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-full w-full overflow-hidden border-border text-foreground">
        {/* Sidebar - Fixed position */}
        <div className="hidden lg:flex w-[280px] xl:w-[320px] flex-shrink-0 flex-col border-r border-border bg-background/50 backdrop-blur-xl h-[calc(100vh-64px)]">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Header Section */}
            <div className="p-4 border-b border-border/50 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
              {/* Project Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Project Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-xs font-mono">
                      /
                    </span>
                  </div>
                  <input
                    type="text"
                    value={stack.projectName || ""}
                    onChange={(e) => setStack({ projectName: e.target.value })}
                    className={cn(
                      "w-full rounded-lg border bg-secondary/30 pl-7 pr-3 py-2.5 text-sm font-medium transition-all outline-none",
                      "focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                      projectNameError
                        ? "border-destructive/50 bg-destructive/5 text-destructive focus:ring-destructive/20"
                        : "border-border hover:border-border/80",
                    )}
                    placeholder="my-app"
                  />
                </div>
                {projectNameError ? (
                  <p className="text-destructive text-[10px] flex items-center gap-1.5 font-medium animate-in slide-in-from-left-1">
                    <InfoIcon className="h-3 w-3" />
                    {projectNameError}
                  </p>
                ) : (
                  (stack.projectName || "my-app").includes(" ") && (
                    <p className="text-muted-foreground text-[10px] flex items-center gap-1.5">
                      <span className="opacity-70">Saved as:</span>
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-foreground font-medium">
                        {(stack.projectName || "my-app").replace(/\s+/g, "-")}
                      </code>
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Command Display - Terminal Style */}
              <div className="rounded-xl border border-border bg-zinc-950 shadow-xl overflow-hidden group">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    bash
                  </span>
                </div>

                <div className="p-4 relative">
                  <div className="flex items-start gap-3 text-sm font-mono leading-relaxed">
                    <span className="text-primary select-none mt-0.5">❯</span>
                    <code className="text-zinc-300 break-all">{command}</code>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={cn(
                        "p-2 rounded-lg backdrop-blur-md transition-all",
                        copied
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white",
                      )}
                      aria-label={copied ? "Copied" : "Copy command"}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <ClipboardCopy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Stack */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Selected Stack
                  </h3>
                  <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border/50">
                    {selectedBadges.length} items
                  </span>
                </div>
                <div className="min-h-[100px] rounded-xl border border-dashed border-border/60 bg-secondary/10 p-4 transition-colors hover:border-border/80 hover:bg-secondary/20">
                  {selectedBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">{selectedBadges}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-4">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Terminal className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your stack is empty.
                        <br />
                        Select options to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Compatibility Info */}
              {compatibilityAnalysis.changes.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block">
                        Compatibility Adjustments
                      </span>
                      <ul className="space-y-1.5">
                        {compatibilityAnalysis.changes
                          .slice(0, 3)
                          .map((change, i) => (
                            <li
                              key={i}
                              className="text-[11px] text-muted-foreground leading-snug flex items-start gap-1.5"
                            >
                              <span className="mt-1 h-1 w-1 rounded-full bg-amber-500/50 flex-shrink-0" />
                              {change.message}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Action Buttons */}
          <div className="flex-shrink-0 border-t border-border p-4 bg-background/80 backdrop-blur-lg">
            <div className="space-y-3">
              {/* Row 1: Random & Presets */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getRandomStack}
                  className="h-9 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Shuffle className="mr-2 h-3.5 w-3.5 text-primary" />
                  Random
                </Button>
                <PresetDropdown onApplyPreset={applyPreset} />
              </div>

              {/* Row 2: Persistence Actions */}
              <div className="grid grid-cols-4 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveCurrentStack}
                      className="h-9 w-full px-0 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-500 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Configuration</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSavedStack}
                      disabled={!lastSavedStack}
                      className="h-9 w-full px-0 hover:border-orange-500/50 hover:bg-orange-500/5 hover:text-orange-500 transition-colors disabled:opacity-50"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Load Saved</TooltipContent>
                </Tooltip>

                <div className="col-span-2">
                  <ShareButton
                    stackUrl={getStackUrl()}
                    stackState={stack}
                    className="h-9 w-full"
                  />
                </div>
              </div>

              {/* Row 3: Settings & Reset */}
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 flex-1 justify-between px-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-normal"
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="h-3.5 w-3.5" />
                          <span>Settings</span>
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[240px]">
                      <YoloToggle
                        stack={stack}
                        onToggle={(yolo) =>
                          setStack({ yolo: yolo ? "true" : "false" })
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetStack}
                        className="h-8 w-8 px-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset All</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden fixed top-20 left-4 z-50 h-10 w-10 rounded-full shadow-lg bg-background border-primary/20 hover:bg-primary/10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-3 p-4">
                <div className="space-y-3">
                  {/* Project Name */}
                  <label className="flex flex-col">
                    <span className="mb-1 text-muted-foreground text-xs">
                      Project Name:
                    </span>
                    <input
                      type="text"
                      value={stack.projectName || ""}
                      onChange={(e) =>
                        setStack({ projectName: e.target.value })
                      }
                      className={cn(
                        "w-full rounded border px-2 py-1 text-sm focus:outline-none bg-background",
                        projectNameError
                          ? "border-destructive bg-destructive/10"
                          : "border-border focus:border-primary",
                      )}
                      placeholder="my-app"
                    />
                  </label>

                  {/* Command */}
                  <div className="rounded border border-border p-2 bg-muted/30">
                    <div className="flex">
                      <span className="mr-2 select-none text-primary">$</span>
                      <code className="block break-all text-muted-foreground text-xs font-mono">
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
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {copied ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <ClipboardCopy className="h-3 w-3" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Selected Stack */}
                  <div>
                    <h3 className="mb-2 font-medium text-foreground text-sm">
                      Selected Stack
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBadges.length > 0 ? (
                        selectedBadges
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No selections yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto border-border border-t pt-4">
                  <div className="space-y-3">
                    <ActionButtons
                      onReset={resetStack}
                      onRandom={getRandomStack}
                      onSave={saveCurrentStack}
                      onLoad={loadSavedStack}
                      hasSavedStack={!!lastSavedStack}
                    />
                    <div className="flex gap-1">
                      <ShareButton
                        stackUrl={getStackUrl()}
                        stackState={stack}
                      />
                      <PresetDropdown onApplyPreset={applyPreset} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Main Content - Tech Categories */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea
            ref={contentRef}
            className="h-[calc(100vh-64px)] scroll-smooth"
          >
            <main className="p-3 sm:p-4 sm:pl-4 pl-16">
              {CATEGORY_ORDER.map((categoryKey) => {
                const categoryOptions =
                  TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
                const categoryDisplayName = getCategoryDisplayName(categoryKey);

                if (categoryOptions.length === 0) return null;

                return (
                  <section
                    ref={(el) => {
                      sectionRefs.current[categoryKey] = el;
                    }}
                    key={categoryKey}
                    id={`section-${categoryKey}`}
                    className="mb-6 scroll-mt-4 sm:mb-8"
                  >
                    <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
                      <Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                      <h2 className="font-semibold text-foreground text-sm sm:text-base">
                        {categoryDisplayName}
                      </h2>
                      {compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <InfoIcon className="ml-2 h-4 w-4 flex-shrink-0 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="top" align="start">
                            <ul className="list-disc space-y-1 pl-4 text-xs">
                              {compatibilityAnalysis.notes[
                                categoryKey
                              ].notes.map((note) => (
                                <li key={note}>{note}</li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                      {categoryOptions.map((tech: TechOption) => {
                        let isSelected = false;
                        const category = categoryKey as keyof StackState;
                        const currentValue = stack[category];

                        if (category === "addons") {
                          isSelected = (
                            (currentValue as string[]) || []
                          ).includes(tech.id);
                        } else {
                          isSelected = currentValue === tech.id;
                        }

                        const isDisabled = !isOptionCompatible(
                          stack,
                          categoryKey as keyof typeof TECH_OPTIONS,
                          tech.id,
                        );

                        const disabledReason = isDisabled
                          ? getDisabledReason(
                              stack,
                              categoryKey as keyof typeof TECH_OPTIONS,
                              tech.id,
                            )
                          : null;

                        return (
                          <Tooltip key={tech.id} delayDuration={100}>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={cn(
                                  "relative cursor-pointer rounded border p-2 transition-all sm:p-3",
                                  isSelected
                                    ? "border-primary bg-primary/10"
                                    : isDisabled
                                      ? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
                                      : "border-border hover:border-muted hover:bg-muted",
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  handleTechSelect(
                                    categoryKey as keyof typeof TECH_OPTIONS,
                                    tech.id,
                                  )
                                }
                              >
                                <div className="flex items-start">
                                  <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        {tech.emoji && (
                                          <span className="mr-1.5 text-base sm:text-lg">
                                            {tech.emoji}
                                          </span>
                                        )}
                                        {tech.icon && (
                                          <TechIcon
                                            icon={tech.icon}
                                            name={tech.name}
                                            className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4"
                                          />
                                        )}
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
                                    {tech.description && (
                                      <p className="mt-0.5 text-muted-foreground text-xs">
                                        {tech.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {tech.default && !isSelected && (
                                  <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                                    Default
                                  </span>
                                )}
                                {tech.badge && (
                                  <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-primary/20 px-1 py-0.5 text-[10px] text-primary">
                                    {tech.badge}
                                  </span>
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            {disabledReason && (
                              <TooltipContent
                                side="top"
                                align="center"
                                className="max-w-xs"
                              >
                                <p className="text-xs">{disabledReason}</p>
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
    </TooltipProvider>
  );
}

export default StackBuilder;
