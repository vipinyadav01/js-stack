import { StackState } from "./use-stack-state";
import { TECH_OPTIONS } from "./tech-options";
import {
  applyCompatibility,
  validateConfiguration,
  BuilderState,
  isCompatible as isBaseCompatible,
  getCompatibleOptions as getBaseCompatibleOptions,
  CompatibilityType,
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
  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: (stack.frontend || "none") as BuilderState["frontend"],
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

  // Detect changes
  const changes: Array<{ category: string; message: string }> = [];
  const categories: (keyof BuilderState)[] = [
    "frontend",
    "backend",
    "database",
    "orm",
    "auth",
    "dbSetup",
    "webDeploy",
    "serverDeploy",
  ];

  for (const cat of categories) {
    if (builderState[cat] !== adjustedBuilderState[cat]) {
      changes.push({
        category: cat,
        message: `Changed ${cat} to ${adjustedBuilderState[cat]} for compatibility.`,
      });
    }
  }

  // Validate configuration
  const validation = validateConfiguration(adjustedBuilderState);

  const adjustedStack: Partial<StackState> = {
    projectName: adjustedBuilderState.projectName,
    frontend: adjustedBuilderState.frontend,
    backend: adjustedBuilderState.backend,
    database: adjustedBuilderState.database,
    orm: adjustedBuilderState.orm,
    auth: adjustedBuilderState.auth,
    addons: adjustedBuilderState.addons,
    dbSetup: adjustedBuilderState.dbSetup,
    webDeploy: adjustedBuilderState.webDeploy,
    serverDeploy: adjustedBuilderState.serverDeploy,
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
    adjustedStack: changes.length > 0 ? adjustedStack : null,
    notes,
    changes,
  };
}

/**
 * Get human-readable display name for a category
 */
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    orm: "ORM",
    auth: "Auth",
    addons: "Add-ons",
    dbSetup: "DB Setup",
    webDeploy: "Web Deploy",
    serverDeploy: "Server Deploy",
    packageManager: "Package Manager",
    git: "Git",
    install: "Install",
  };

  return (
    displayNames[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

/**
 * Check if an option is compatible with the current stack
 */
export function isOptionCompatible(
  stack: StackState,
  category: keyof typeof TECH_OPTIONS,
  optionId: string,
): boolean {
  if (stack.yolo === "true") return true;

  // Addons check
  if (category === "addons") {
    return isBaseCompatible(
      "frontendAddons",
      stack.frontend || "none",
      optionId,
    );
  }

  // Database check (must work with both ORM and Backend)
  if (category === "database") {
    const isOrmCompatible = isBaseCompatible(
      "ormDatabase",
      stack.orm || "none",
      optionId,
    );
    const isBackendCompatible = isBaseCompatible(
      "backendDatabase",
      stack.backend || "none",
      optionId,
    );
    return isOrmCompatible && isBackendCompatible;
  }

  // ORM check
  if (category === "orm") {
    return isBaseCompatible("databaseOrm", stack.database || "none", optionId);
  }

  // Auth check (must work with both Backend and Frontend)
  if (category === "auth") {
    const isBackendCompatible = isBaseCompatible(
      "backendAuth",
      stack.backend || "none",
      optionId,
    );
    // Frontend-Auth is usually a warning, but for UI disabling we might want to be strict or lenient.
    // Based on config.ts, backendAuth is a critical error, while frontendAuth is a warning.
    // We'll stick to backendAuth for disabling to remain flexible.
    return isBackendCompatible;
  }

  // Backend check
  if (category === "backend") {
    return isBaseCompatible(
      "frontendBackend",
      stack.frontend || "none",
      optionId,
    );
  }

  // Frontend check
  if (category === "frontend") {
    return isBaseCompatible(
      "backendFrontend",
      stack.backend || "none",
      optionId,
    );
  }

  return true;
}

/**
 * Get the reason why an option is disabled
 */
export function getDisabledReason(
  stack: StackState,
  category: keyof typeof TECH_OPTIONS,
  optionId: string,
): string | null {
  if (isOptionCompatible(stack, category, optionId)) return null;

  if (category === "addons") {
    return `${optionId} is not compatible with the selected Frontend (${stack.frontend}).`;
  }

  if (category === "database") {
    const isOrmCompatible = isBaseCompatible(
      "ormDatabase",
      stack.orm || "none",
      optionId,
    );
    const isBackendCompatible = isBaseCompatible(
      "backendDatabase",
      stack.backend || "none",
      optionId,
    );

    if (!isOrmCompatible)
      return `${optionId} is not compatible with the selected ORM (${stack.orm}).`;
    if (!isBackendCompatible)
      return `${optionId} is not compatible with the selected Backend (${stack.backend}).`;
  }

  if (category === "orm") {
    return `${optionId} is not compatible with the selected Database (${stack.database}).`;
  }

  if (category === "auth") {
    return `${optionId} is not compatible with the selected Backend (${stack.backend}).`;
  }

  if (category === "backend") {
    return `${optionId} is not compatible with the selected Frontend (${stack.frontend}).`;
  }

  if (category === "frontend") {
    return `${optionId} is not compatible with the selected Backend (${stack.backend}).`;
  }

  return "This option is not compatible with your current selections.";
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): string | null {
  if (!name || name.trim() === "") return null;
  const trimmed = name.trim();
  if (trimmed.length > 214) return "Too long (max 214 chars)";
  if (/^[._]/.test(trimmed)) return "Cannot start with . or _";
  if (/[A-Z]/.test(trimmed)) return "Must be lowercase";
  if (/[~'!()*]/.test(trimmed)) return "Invalid characters";
  if (["node_modules", "favicon.ico"].includes(trimmed.toLowerCase()))
    return "Reserved name";
  return null;
}
