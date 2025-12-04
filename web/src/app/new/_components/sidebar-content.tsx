"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Settings,
  AlertTriangle,
  Check,
  ClipboardCopy,
  Terminal,
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
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-4">
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
        <div className="overflow-hidden rounded-md border bg-muted/50">
          <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" />
              <span className="font-medium">Command</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy command"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <div className="p-3">
            <div className="flex gap-2">
              <span className="select-none text-muted-foreground">$</span>
              <code className="flex-1 break-all font-mono text-xs sm:text-sm">
                {command}
              </code>
            </div>
          </div>
        </div>

        {/* Selected Stack */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Selected Stack</Label>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {selectedBadges}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4 border-t pt-4">
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

        <div className="space-y-2">
          <ActionButtons onReset={onReset} onRandom={onRandom} />

          <div className="grid grid-cols-3 gap-2">
            <ShareButton stackUrl={stackUrl} stackState={stack} />
            <PresetDropdown onApplyPreset={onApplyPreset} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full px-2">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate">Settings</span>
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
