"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Settings,
  AlertTriangle,
  Check,
  ClipboardCopy,
  Terminal,
  Lightbulb,
  X,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { StackState } from "./use-stack-state";
import type { UseCaseRecommendation } from "@/lib/recommendations";
import { ActionButtons } from "./action-buttons";
import { PresetDropdown } from "./preset-dropdown";
import { ShareButton } from "./share-button";
import { YoloToggle } from "./yolo-toggle";
import { cn } from "@/lib/utils";

interface SidebarContentProps {
  stack: StackState;
  command: string;
  selectedBadges: React.ReactNode;
  compatibilityNotes: Record<string, { notes: string[]; hasIssue: boolean }>;
  onProjectNameChange: (value: string) => void;
  onReset: () => void;
  onRandom: () => void;
  onApplyPreset: (presetId: string) => void;
  onYoloToggle: (enabled: boolean) => void;
  stackUrl: string;
  showRecommendations?: boolean;
  onToggleRecommendations?: () => void;
  recommendations?: {
    warnings?: Array<{
      type: string;
      message: string;
      severity: "high" | "medium" | "low";
      fix?: string;
    }>;
    alternatives?: Array<{
      category: string;
      id: string;
      reason: string;
    }>;
    orm?: { id: string; reason: string; strength: string };
    auth?: { id: string; reason: string; strength: string };
    backend?: { id: string; reason: string; strength: string };
    compatibilityScore?: number;
  };
  matchingUseCase?: UseCaseRecommendation | null;
  showUseCasePresets?: boolean;
  onToggleUseCasePresets?: () => void;
}

export function SidebarContent({
  stack,
  command,
  selectedBadges,
  compatibilityNotes,
  onProjectNameChange,
  onReset,
  onRandom,
  onApplyPreset,
  onYoloToggle,
  stackUrl,
  showRecommendations = false,
  onToggleRecommendations,
  recommendations,
  matchingUseCase,
  showUseCasePresets = false,
  onToggleUseCasePresets,
}: SidebarContentProps) {
  const [copied, setCopied] = useState(false);
  const [localProjectName, setLocalProjectName] = useState(
    stack.projectName || "",
  );

  // Sync local state with stack state when stack changes (e.g. Reset/Random)
  // We use a check to avoid overwriting user input during typing if the update is lagging
  useEffect(() => {
    if (
      stack.projectName !== undefined &&
      stack.projectName !== localProjectName
    ) {
      // Only sync if the incoming value is different.
      // This doesn't fully prevent overwrite if roundtrip is slow, but debounce helps.
      setLocalProjectName(stack.projectName);
    }
  }, [stack.projectName, localProjectName]);

  // Debounce the update to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localProjectName !== (stack.projectName || "")) {
        onProjectNameChange(localProjectName);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localProjectName, onProjectNameChange, stack.projectName]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track command copy
      if (
        typeof window !== "undefined" &&
        "posthog" in window &&
        window.posthog
      ) {
        window.posthog.capture("command_copied", {
          command_length: command.length,
          has_comments: command.includes("#"),
          stack: {
            frontend: stack.frontend,
            backend: stack.backend,
            database: stack.database,
            orm: stack.orm,
            auth: stack.auth,
            addons: stack.addons,
            package_manager: stack.packageManager,
          },
        });
      }
    } catch (error) {
      console.error("Failed to copy command:", error);
    }
  };

  // Validate project name
  const validateProjectName = (name: string): string => {
    if (!name || name.trim() === "") {
      return ""; // Empty is allowed (will use default)
    }

    // Check for invalid characters (only allow alphanumeric, hyphens, underscores)
    const invalidChars = /[^a-zA-Z0-9\-_]/g;
    if (invalidChars.test(name)) {
      return "Only letters, numbers, hyphens, and underscores allowed";
    }

    // Check if starts with a number or hyphen
    if (/^[0-9\-]/.test(name)) {
      return "Cannot start with a number or hyphen";
    }

    // Check length
    if (name.length > 214) {
      return "Name is too long (max 214 chars)";
    }

    return ""; // Valid
  };

  const projectNameError = validateProjectName(localProjectName);

  return (
    <div className="flex h-full flex-col gap-2 sm:gap-3">
      {/* Header */}
      <div className="pb-1.5 border-b border-border">
        <h2 className="text-sm sm:text-base font-bold font-mono">
          Configuration
        </h2>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
          Customize your project
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-xs font-medium">
            Project Name
            <span className="ml-1 text-muted-foreground font-normal">
              (customizable)
            </span>
          </Label>
          <Input
            id="project-name"
            type="text"
            value={localProjectName}
            onChange={(e) => setLocalProjectName(e.target.value)}
            onBlur={(e) => {
              const formatted = e.target.value
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9\-_]/g, "")
                .replace(/^[0-9\-]+/, "")
                .toLowerCase();
              const finalValue = formatted || "my-app";
              if (finalValue !== localProjectName) {
                setLocalProjectName(finalValue);
              }
            }}
            className={cn(
              "h-9 font-mono text-sm",
              projectNameError
                ? "border-destructive focus-visible:ring-destructive"
                : "",
            )}
            placeholder="my-app"
          />
          {projectNameError ? (
            <p className="text-[10px] text-destructive font-medium">
              {projectNameError}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              Folder:{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">
                {stack.projectName || "my-app"}
              </code>
            </p>
          )}
        </div>

        {/* Command Preview */}
        <div className="overflow-hidden rounded-lg border-2 border-border bg-gradient-to-br from-card to-muted/30">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <span>CLI Command</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary/10"
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy command"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardCopy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-background/50">
            <div className="flex gap-2 items-start">
              <span className="select-none text-muted-foreground font-mono text-sm">
                $
              </span>
              <code className="flex-1 break-all font-mono text-xs sm:text-sm leading-relaxed">
                {command}
              </code>
            </div>
          </div>
        </div>

        {/* Selected Stack */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
          <Label className="text-xs font-semibold">Selected Stack</Label>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {selectedBadges}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4 border-t pt-4">
        {/* Use Case Presets Toggle Button */}
        {onToggleUseCasePresets && (
          <Button
            variant={showUseCasePresets ? "default" : "outline"}
            size="sm"
            className="w-full font-semibold"
            onClick={onToggleUseCasePresets}
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {showUseCasePresets ? "Hide" : "Show"} Use Cases
          </Button>
        )}

        {/* Recommendations Toggle Button */}
        {onToggleRecommendations && (
          <Button
            variant={showRecommendations ? "default" : "outline"}
            size="sm"
            className="w-full font-semibold"
            onClick={onToggleRecommendations}
          >
            <Lightbulb className="mr-2 h-3.5 w-3.5" />
            {showRecommendations ? "Hide" : "Show"} Recommendations
          </Button>
        )}

        {/* Recommendations Panel */}
        {showRecommendations && recommendations && (
          <ScrollArea className="max-h-[300px] rounded-md border border-primary/20 bg-primary/5">
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Recommendations</span>
                </div>
                {onToggleRecommendations && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={onToggleRecommendations}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Matching Use Case */}
              {matchingUseCase && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">💡 Best Match</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    <strong>{matchingUseCase.name}</strong>
                  </p>
                  {matchingUseCase.why && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {matchingUseCase.why}
                    </p>
                  )}
                </div>
              )}

              {/* Compatibility Score */}
              {recommendations.compatibilityScore !== undefined && (
                <div className="rounded-lg border bg-muted/50 p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium">
                      Compatibility
                    </span>
                    <span className="text-xs font-bold">
                      {recommendations.compatibilityScore}/100
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
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
              )}

              {/* Warnings */}
              {recommendations.warnings &&
                recommendations.warnings.length > 0 && (
                  <div className="space-y-1.5">
                    {recommendations.warnings.map(
                      (
                        warning: {
                          type: string;
                          message: string;
                          severity: "high" | "medium" | "low";
                          fix?: string;
                        },
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          className={`rounded border p-2 text-[10px] ${
                            warning.severity === "high"
                              ? "border-destructive bg-destructive/10"
                              : warning.severity === "medium"
                                ? "border-yellow-500/50 bg-yellow-500/10"
                                : "border-blue-500/50 bg-blue-500/10"
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <span className="mt-0.5">
                              {warning.severity === "high" ? "❌" : "⚠️"}
                            </span>
                            <p className="flex-1 font-medium leading-tight">
                              {warning.message}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {/* ORM Recommendation */}
              {recommendations.orm && (
                <div className="rounded border border-blue-500/20 bg-blue-500/5 p-2">
                  <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mb-1">
                    💡 ORM Recommendation
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <strong>{recommendations.orm.id}</strong>:{" "}
                    {recommendations.orm.reason}
                  </p>
                </div>
              )}

              {/* Auth Recommendation */}
              {recommendations.auth && (
                <div className="rounded border border-blue-500/20 bg-blue-500/5 p-2">
                  <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mb-1">
                    💡 Auth Recommendation
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <strong>{recommendations.auth.id}</strong>:{" "}
                    {recommendations.auth.reason}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Compatibility Notes */}
        {!stack.yolo && Object.keys(compatibilityNotes).length > 0 && (
          <ScrollArea className="max-h-[120px] rounded-md border border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-950/20">
            <div className="p-3">
              <div className="mb-2 flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Compatibility Notes</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(compatibilityNotes).map(([category, note]) => (
                  <div
                    key={category}
                    className="text-[10px] text-yellow-700 dark:text-yellow-400 leading-tight"
                  >
                    <span className="font-semibold capitalize">
                      {category}:
                    </span>{" "}
                    {note.notes.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
          <ActionButtons onReset={onReset} onRandom={onRandom} />

          <div className="grid grid-cols-3 gap-2">
            <ShareButton stackUrl={stackUrl} stackState={stack} />
            <PresetDropdown onApplyPreset={onApplyPreset} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full px-2 font-medium"
                >
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate text-xs">Settings</span>
                  <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <YoloToggle
                  enabled={stack.yolo === "true"}
                  onChange={onYoloToggle}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
