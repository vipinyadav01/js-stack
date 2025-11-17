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
  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: (stack.frontend.length > 0
      ? stack.frontend[0]
      : "none") as BuilderState["frontend"],
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
  const adjustedStack: Partial<StackState> = {
    frontend:
      adjustedBuilderState.frontend !== "none"
        ? [adjustedBuilderState.frontend]
        : [],
    backend: adjustedBuilderState.backend,
    database: adjustedBuilderState.database,
    orm: adjustedBuilderState.orm,
    auth: adjustedBuilderState.auth,
    addons: adjustedBuilderState.addons,
    packageManager: adjustedBuilderState.packageManager,
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
