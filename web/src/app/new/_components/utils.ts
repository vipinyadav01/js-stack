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
  // Frontend is now a single string value
  const frontend =
    typeof stack.frontend === "string"
      ? stack.frontend
      : Array.isArray(stack.frontend) && (stack.frontend as string[]).length > 0
        ? (stack.frontend as string[])[0] // Backward compatibility: if array, use first value
        : "none";

  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: frontend as BuilderState["frontend"],
    backend: (stack.backend || "none") as BuilderState["backend"],
    database: (stack.database || "none") as BuilderState["database"],
    orm: (stack.orm || "none") as BuilderState["orm"],
    auth: (stack.auth || "none") as BuilderState["auth"],
    addons: (Array.isArray(stack.addons)
      ? stack.addons
      : []) as BuilderState["addons"],
    dbSetup: (stack.dbSetup || "none") as BuilderState["dbSetup"],
    webDeploy: (stack.webDeploy || "none") as BuilderState["webDeploy"],
    serverDeploy: (stack.serverDeploy ||
      "none") as BuilderState["serverDeploy"],
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
  // Frontend is now a single string value
  const adjustedFrontend =
    adjustedBuilderState.frontend !== "none"
      ? adjustedBuilderState.frontend
      : "none";

  const adjustedStack: Partial<StackState> = {
    projectName:
      adjustedBuilderState.projectName || stack.projectName || "my-app",
    frontend: adjustedFrontend,
    backend: adjustedBuilderState.backend || "none",
    database: adjustedBuilderState.database || "none",
    orm: adjustedBuilderState.orm || "none",
    auth: adjustedBuilderState.auth || "none",
    addons: adjustedBuilderState.addons || [],
    dbSetup: adjustedBuilderState.dbSetup || "none",
    webDeploy: adjustedBuilderState.webDeploy || "none",
    serverDeploy: adjustedBuilderState.serverDeploy || "none",
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
