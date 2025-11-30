"use client";

import { useState } from "react";
import {
  ChevronDown,
  Settings,
  AlertTriangle,
  Check,
  ClipboardCopy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onSave: () => void;
  onLoad: () => void;
  hasSavedStack: boolean;
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
  onSave,
  onLoad,
  hasSavedStack,
  onApplyPreset,
  onYoloToggle,
  stackUrl,
}: SidebarContentProps) {
  const [copied, setCopied] = useState(false);

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
      return "Project name can only contain letters, numbers, hyphens, and underscores";
    }

    // Check if starts with a number or hyphen
    if (/^[0-9\-]/.test(name)) {
      return "Project name cannot start with a number or hyphen";
    }

    // Check length
    if (name.length > 214) {
      return "Project name is too long (max 214 characters)";
    }

    return ""; // Valid
  };

  const projectNameError = validateProjectName(stack.projectName || "");

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="space-y-3">
        {/* Project Name */}
        <label className="flex flex-col">
          <span className="mb-1.5 flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <span>Project Name / Folder Name:</span>
            <span className="text-muted-foreground/70 text-[10px]">
              (fully customizable)
            </span>
          </span>
          <input
            type="text"
            value={stack.projectName || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow any input, validation will show error if needed
              onProjectNameChange(value);
            }}
            onBlur={(e) => {
              // Format on blur: replace spaces with hyphens and remove invalid chars
              const formatted = e.target.value
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9\-_]/g, "")
                .replace(/^[0-9\-]+/, "")
                .toLowerCase();

              // If empty after formatting, use default
              const finalValue = formatted || "my-app";

              if (finalValue !== stack.projectName) {
                onProjectNameChange(finalValue);
              }
            }}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
              projectNameError
                ? "border-destructive bg-destructive/10 text-destructive-foreground focus:border-destructive"
                : "border-border focus:border-primary",
            )}
            placeholder="my-app"
            title="Enter your project name. This will be used as the folder name when creating the project. Spaces will be converted to hyphens."
          />
          {projectNameError && (
            <p className="mt-1.5 text-destructive text-xs">
              {projectNameError}
            </p>
          )}
          {stack.projectName &&
            stack.projectName !== "my-app" &&
            (stack.projectName.includes(" ") ||
              /[^a-zA-Z0-9\-_]/.test(stack.projectName)) &&
            !projectNameError && (
              <p className="mt-1.5 text-muted-foreground text-xs">
                Will be formatted as:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  {stack.projectName
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9\-_]/g, "")
                    .replace(/^[0-9\-]+/, "")
                    .toLowerCase() || "my-app"}
                </code>
              </p>
            )}
          {!projectNameError &&
            stack.projectName &&
            stack.projectName !== "my-app" && (
              <p className="mt-1.5 text-muted-foreground text-xs">
                ✓ This name will be used as your project folder name
              </p>
            )}
          {!projectNameError &&
            (!stack.projectName || stack.projectName === "my-app") && (
              <p className="mt-1.5 text-muted-foreground text-xs">
                💡 Change this to customize your project folder name. The
                command below will update automatically.
              </p>
            )}
        </label>

        <div className="overflow-hidden rounded border border-border">
          <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              aria-live="polite"
              className={cn(
                "flex items-center gap-1 rounded px-2 py-1 text-xs",
                copied
                  ? "bg-green-500/10 text-green-600"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
              )}
              title={copied ? "Copied!" : "Copy command"}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 flex-shrink-0" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-3 w-3 flex-shrink-0" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="px-2 py-2">
            <div className="flex">
              <span className="mr-2 select-none text-muted-foreground">$</span>
              <pre className="m-0 max-w-full overflow-x-auto whitespace-pre-wrap break-words">
                <code className="block break-all text-foreground text-xs sm:text-sm">
                  {command}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Selected Stack */}
        <div>
          <h3 className="mb-2 font-medium text-foreground text-sm">
            Selected Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
        </div>
      </div>

      <div className="mt-auto border-border border-t pt-4">
        <div className="space-y-3">
          <ActionButtons
            onReset={onReset}
            onRandom={onRandom}
            onSave={onSave}
            onLoad={onLoad}
            hasSavedStack={hasSavedStack}
          />

          <div className="flex gap-1">
            <ShareButton stackUrl={stackUrl} stackState={stack} />

            <PresetDropdown onApplyPreset={onApplyPreset} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
                >
                  <Settings className="h-3 w-3" />
                  Settings
                  <ChevronDown className="ml-auto h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-fd-background"
              >
                <YoloToggle
                  enabled={stack.yolo === "true"}
                  onChange={onYoloToggle}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Compatibility Notes */}
          {!stack.yolo && Object.keys(compatibilityNotes).length > 0 && (
            <div className="rounded border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                  Compatibility Notes
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(compatibilityNotes).map(([category, note]) => (
                  <div
                    key={category}
                    className="text-xs text-yellow-700 dark:text-yellow-300"
                  >
                    <strong className="capitalize">{category}:</strong>{" "}
                    {note.notes.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
