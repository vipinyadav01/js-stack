import { StackState } from "./use-stack-state";
import {
  applyCompatibility,
  validateConfiguration,
  BuilderState,
} from "../../../components/builder/config";

export interface CompatibilityResult {
  adjustedStack: Partial<StackState> | null;
  notes: Record<string, { notes: string[]; hasIssue: boolean }>;
  changes: Array<{ category: string; message: string }>;
}

export function analyzeStackCompatibility(
  stack: StackState,
): CompatibilityResult {
  // YOLO mode bypasses all checks
  if (stack.yolo === "true") {
    return {
      adjustedStack: null,
      notes: {},
      changes: [],
    };
  }

  // Convert StackState to BuilderState format
  // Handle multiple frontends - use first one for compatibility checks
  const frontends =
    Array.isArray(stack.frontend) && stack.frontend.length > 0
      ? stack.frontend
      : ["none"];

  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: (frontends[0] || "none") as BuilderState["frontend"],
    backend: (stack.backend || "none") as BuilderState["backend"],
    database: (stack.database || "none") as BuilderState["database"],
    orm: (stack.orm || "none") as BuilderState["orm"],
    auth: (stack.auth || "none") as BuilderState["auth"],
    addons: (Array.isArray(stack.addons)
      ? stack.addons
      : []) as BuilderState["addons"],
    packageManager: (stack.packageManager ||
      "npm") as BuilderState["packageManager"],
    installDependencies: stack.install === "true",
    initializeGit: stack.git === "true",
  };

  // Apply compatibility rules
  const adjustedBuilderState = applyCompatibility(builderState);

  // Validate configuration
  const validation = validateConfiguration(adjustedBuilderState);

  // Convert back to StackState format
  // Preserve original frontends if multiple were selected, otherwise use adjusted
  const adjustedFrontend =
    adjustedBuilderState.frontend !== "none"
      ? adjustedBuilderState.frontend
      : "none";

  // If original had multiple frontends and adjusted is different, preserve originals
  // Otherwise, use adjusted frontend
  const finalFrontend =
    frontends.length > 1 && frontends[0] !== "none"
      ? frontends // Preserve multiple frontends
      : adjustedFrontend !== "none"
        ? [adjustedFrontend]
        : [];

  const adjustedStack: Partial<StackState> = {
    frontend: finalFrontend,
    backend: adjustedBuilderState.backend || "none",
    database: adjustedBuilderState.database || "none",
    orm: adjustedBuilderState.orm || "none",
    auth: adjustedBuilderState.auth || "none",
    addons: adjustedBuilderState.addons || [],
    packageManager: adjustedBuilderState.packageManager || "npm",
    git: adjustedBuilderState.initializeGit ? "true" : "false",
    install: adjustedBuilderState.installDependencies ? "true" : "false",
  };

  // Build notes from validation
  const notes: Record<string, { notes: string[]; hasIssue: boolean }> = {};

  if (validation.warnings.length > 0) {
    notes.general = {
      notes: validation.warnings,
      hasIssue: true,
    };
  }

  if (validation.errors.length > 0) {
    notes.errors = {
      notes: validation.errors,
      hasIssue: true,
    };
  }

  return {
    adjustedStack,
    notes,
    changes: [],
  };
}
