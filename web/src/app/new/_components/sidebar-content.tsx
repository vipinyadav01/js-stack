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
  const projectNameError = "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="space-y-3">
        {/* Project Name */}
        <label className="flex flex-col">
          <span className="mb-1 text-muted-foreground text-xs">
            Project Name:
          </span>
          <input
            type="text"
            value={stack.projectName || ""}
            onChange={(e) => {
              onProjectNameChange(e.target.value);
            }}
            className={cn(
              "w-full rounded border px-2 py-1 text-sm focus:outline-none",
              projectNameError
                ? "border-destructive bg-destructive/10 text-destructive-foreground"
                : "border-border focus:border-primary",
            )}
            placeholder="Js-Stack"
          />
          {projectNameError && (
            <p className="mt-1 text-destructive text-xs">{projectNameError}</p>
          )}
          {(stack.projectName || "Js-Stack").includes(" ") && (
            <p className="mt-1 text-muted-foreground text-xs">
              Will be saved as:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {(stack.projectName || "Js-Stack").replace(/\s+/g, "-")}
              </code>
            </p>
          )}
        </label>

        {/* CLI Command Preview */}
        <div className="rounded border border-border p-2">
          <div className="flex">
            <span className="mr-2 select-none text-chart-4">$</span>
            <code className="block break-all text-muted-foreground text-xs sm:text-sm">
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
                  ? "bg-muted text-chart-4"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={copied ? "Copied!" : "Copy command"}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 flex-shrink-0" />
                  <span className="">Copied</span>
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-3 w-3 flex-shrink-0" />
                  <span className="">Copy</span>
                </>
              )}
            </button>
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
