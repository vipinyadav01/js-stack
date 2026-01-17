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
  projectName: "jsstack",
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

  // Local state for project name to prevent input lag
  const [localProjectName, setLocalProjectName] = useState(
    stack.projectName || "my-app",
  );

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const lastAppliedStackString = useRef<string>("");

  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  const projectNameError = validateProjectName(localProjectName);

  // Sync local project name with stack when stack changes from external sources
  useEffect(() => {
    if (stack.projectName && stack.projectName !== localProjectName) {
      setLocalProjectName(stack.projectName);
    }
  }, [stack.projectName, localProjectName]);

  // Update stack when local project name changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localProjectName !== stack.projectName) {
        setStack({ projectName: localProjectName });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [localProjectName, stack.projectName, setStack]);

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
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                  getBadgeColors(category),
                )}
              >
                {tech.emoji && (
                  <span className="text-[10px]">{tech.emoji}</span>
                )}
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
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
              getBadgeColors(category),
            )}
          >
            {tech.emoji && <span className="text-[10px]">{tech.emoji}</span>}
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
        {/* Simplified Sidebar */}
        <aside className="hidden lg:flex w-[260px] xl:w-[300px] flex-shrink-0 flex-col border-r border-border/50 bg-background h-[calc(100vh-64px)] fixed left-0 top-[64px] z-40">
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="p-4 border-b border-border/50">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={localProjectName}
                  onChange={(e) => setLocalProjectName(e.target.value)}
                  className={cn(
                    "w-full rounded-md border bg-secondary/20 px-3 py-2 text-sm font-medium transition-all outline-none",
                    "focus:ring-1 focus:ring-primary/30 focus:border-primary/50",
                    projectNameError
                      ? "border-destructive text-destructive"
                      : "border-border",
                  )}
                  placeholder="my-app"
                />
                {projectNameError && (
                  <p className="text-destructive text-[10px] font-medium">
                    {projectNameError}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 space-y-5">
              {/* Terminal Style Command */}
              <div className="rounded-md border border-border/50 bg-zinc-950 overflow-hidden group">
                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-white/5">
                  <span className="text-[9px] font-mono text-zinc-500">
                    bash
                  </span>
                </div>
                <div className="p-3 relative">
                  <div className="flex items-start gap-2 text-[12px] font-mono leading-relaxed">
                    <span className="text-primary select-none opacity-70">
                      ❯
                    </span>
                    <code className="text-zinc-300 break-all flex-1">
                      {command}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={cn(
                      "absolute top-2 right-2 p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100 bg-white/5 text-zinc-400 hover:text-white",
                      copied && "opacity-100 text-green-400",
                    )}
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <ClipboardCopy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Stack Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Stack
                  </h3>
                  <span className="text-[9px] font-medium text-muted-foreground">
                    {selectedBadges.length} items
                  </span>
                </div>
                <div className="min-h-[60px] rounded-md border border-dashed border-border/60 bg-secondary/5 p-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedBadges.length > 0 ? (
                      selectedBadges
                    ) : (
                      <p className="text-[10px] text-muted-foreground opacity-40 text-center w-full py-2">
                        Empty stack
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="flex-shrink-0 border-t border-border/50 p-4 bg-background">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getRandomStack}
                  className="h-8 text-xs font-normal"
                >
                  <Shuffle className="mr-2 h-3 w-3" /> Random
                </Button>
                <PresetDropdown onApplyPreset={applyPreset} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveCurrentStack}
                  className="h-8 w-full px-0"
                >
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSavedStack}
                  disabled={!lastSavedStack}
                  className="h-8 w-full px-0"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <div className="col-span-2">
                  <ShareButton
                    stackUrl={getStackUrl()}
                    stackState={stack}
                    className="h-8 w-full text-xs font-normal"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 justify-between px-2 text-muted-foreground text-[10px] font-normal"
                    >
                      <span className="flex items-center gap-1.5">
                        <Settings className="h-3 w-3" /> Settings
                      </span>
                      <ChevronDown className="h-2.5 w-2.5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px]">
                    <YoloToggle
                      stack={stack}
                      onToggle={(yolo) =>
                        setStack({ yolo: yolo ? "true" : "false" })
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetStack}
                  className="h-7 w-7 px-0 text-muted-foreground hover:text-destructive"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="hidden lg:block w-[260px] xl:w-[300px] flex-shrink-0" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea ref={contentRef} className="h-[calc(100vh-64px)]">
            <main className="p-4 sm:p-6 lg:p-8">
              {CATEGORY_ORDER.map((categoryKey) => {
                const categoryOptions =
                  TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
                const categoryDisplayName = getCategoryDisplayName(categoryKey);
                if (categoryOptions.length === 0) return null;

                return (
                  <section
                    key={categoryKey}
                    id={`section-${categoryKey}`}
                    className="mb-8 scroll-mt-4"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-2">
                      <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {categoryDisplayName}
                        {compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
                          <InfoIcon className="h-3 w-3 text-amber-500" />
                        )}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                      {categoryOptions.map((tech: TechOption) => {
                        const category = categoryKey as keyof StackState;
                        const currentValue = stack[category];
                        const isSelected =
                          category === "addons"
                            ? ((currentValue as string[]) || []).includes(
                                tech.id,
                              )
                            : currentValue === tech.id;

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
                          <div
                            key={tech.id}
                            className={cn(
                              "group relative cursor-pointer rounded-md border p-2 transition-all duration-150",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : isDisabled
                                  ? "opacity-30 cursor-not-allowed grayscale"
                                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary/10",
                            )}
                            onClick={() =>
                              !isDisabled &&
                              handleTechSelect(
                                categoryKey as keyof typeof TECH_OPTIONS,
                                tech.id,
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0">
                                {tech.emoji ? (
                                  <span className="text-base leading-none">
                                    {tech.emoji}
                                  </span>
                                ) : tech.icon ? (
                                  <TechIcon
                                    icon={tech.icon}
                                    name={tech.name}
                                    className="h-4 w-4"
                                  />
                                ) : null}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3
                                  className={cn(
                                    "font-medium text-[11px] truncate leading-tight",
                                    isSelected
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  {tech.name}
                                </h3>
                              </div>
                              {isSelected && (
                                <Check className="h-3 w-3 text-primary flex-shrink-0" />
                              )}
                            </div>

                            {isDisabled && disabledReason && (
                              <div className="absolute inset-x-0 bottom-full z-50 mb-2 hidden group-hover:block">
                                <div className="mx-auto w-max max-w-[200px] rounded bg-zinc-900 px-2 py-1 text-[10px] text-white shadow-xl">
                                  {disabledReason}
                                </div>
                              </div>
                            )}
                          </div>
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
