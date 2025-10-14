"use client";

import { useTransition } from "react";
import { StackState, useStackState } from "./use-stack-state";
import { TechCategory } from "./tech-category";
import { ActionButtons } from "./action-buttons";
import { PresetDropdown } from "./preset-dropdown";
import { ShareButton } from "./share-button";
import { YoloToggle } from "./yolo-toggle";
import { analyzeStackCompatibility } from "./utils";
import { generateStackCommand } from "./command-generator";
import { TECH_OPTIONS, CATEGORY_ORDER } from "./tech-options";
import { PRESET_TEMPLATES } from "./presets";
import { toast } from "sonner";

export function StackBuilder() {
  const [stack, setStack] = useStackState();
  const [isPending, startTransition] = useTransition();

  // Analyze compatibility
  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  // Get adjusted stack if compatibility changes were made
  const displayStack = compatibilityAnalysis.adjustedStack || stack;

  // Generate command - ensure displayStack has all required fields
  const command = generateStackCommand(displayStack as StackState);

  // Handle technology selection
  const handleTechSelect = (category: string, techId: string) => {
    startTransition(() => {
      if (isMultiSelectCategory(category)) {
        // Multi-select: toggle in/out of array
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
        // Single-select: replace value
        setStack({
          [category]: techId,
        } as Partial<StackState>);
      }
    });
  };

  // Handle preset application
  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (preset) {
      startTransition(() => {
        setStack(preset.stack as Partial<StackState>);
        toast.success(`Applied preset: ${preset.name}`);
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    startTransition(() => {
      setStack({
        projectName: "my-app",
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

  // Handle random stack
  const handleRandom = () => {
    startTransition(() => {
      const randomStack: Partial<StackState> = {
        projectName: "my-app",
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

  // Check if category is multi-select
  const isMultiSelectCategory = (category: string): boolean => {
    return ["frontend", "addons"].includes(category);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-4">
        {/* Project Name */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={stack.projectName}
            onChange={(e) => setStack({ projectName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="my-app"
          />
        </div>

        {/* CLI Command Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CLI Command
          </label>
          <div className="relative">
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto text-gray-900 dark:text-gray-100">
              {command}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(command);
                toast.success("Command copied to clipboard!");
              }}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Selected Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {displayStack.frontend?.map((f: string) => (
              <span
                key={f}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
              >
                {f}
              </span>
            ))}
            {displayStack.backend && displayStack.backend !== "none" && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                {displayStack.backend}
              </span>
            )}
            {displayStack.database && displayStack.database !== "none" && (
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                {displayStack.database}
              </span>
            )}
            {displayStack.orm && displayStack.orm !== "none" && (
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                {displayStack.orm}
              </span>
            )}
            {displayStack.auth && displayStack.auth !== "none" && (
              <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                {displayStack.auth}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onReset={handleReset}
          onRandom={handleRandom}
          isPending={isPending}
        />

        {/* Presets */}
        <PresetDropdown
          presets={PRESET_TEMPLATES}
          onSelect={handlePresetSelect}
        />

        {/* Share */}
        <ShareButton stack={displayStack as StackState} />

        {/* YOLO Mode */}
        <YoloToggle
          enabled={stack.yolo === "true"}
          onChange={(enabled: boolean) =>
            setStack({ yolo: enabled ? "true" : "false" })
          }
        />

        {/* Compatibility Notes */}
        {!stack.yolo && compatibilityAnalysis.notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Compatibility Notes
            </h3>
            {Object.entries(compatibilityAnalysis.notes).map(
              ([category, note]) => (
                <div
                  key={category}
                  className="text-xs text-yellow-700 dark:text-yellow-300"
                >
                  <strong>{category}:</strong> {note.notes.join(", ")}
                </div>
              ),
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3 space-y-6">
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
      </main>
    </div>
  );
}
