import { StackState } from "./use-stack-state";
import { TECH_OPTIONS } from "./tech-options";
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

/**
 * Get human-readable display name for a category
 */
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    frontend: "Frontend Framework",
    backend: "Backend Framework",
    database: "Database",
    orm: "ORM / Database Client",
    auth: "Authentication",
    addons: "Add-ons & Tools",
    dbSetup: "Database Setup",
    webDeploy: "Web Deployment",
    serverDeploy: "Server Deployment",
    packageManager: "Package Manager",
    git: "Git Repository",
    install: "Install Dependencies",
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
  // In YOLO mode, everything is compatible
  if (stack.yolo === "true") {
    return true;
  }

  // Check database-ORM compatibility
  if (category === "orm") {
    const database = stack.database;

    // MongoDB only works with Mongoose
    if (
      database === "mongodb" &&
      optionId !== "mongoose" &&
      optionId !== "none"
    ) {
      return false;
    }

    // SQL databases don't work with Mongoose
    if (
      (database === "postgres" ||
        database === "mysql" ||
        database === "sqlite") &&
      optionId === "mongoose"
    ) {
      return false;
    }
  }

  // Check database-dbSetup compatibility
  if (category === "dbSetup") {
    const database = stack.database;

    // Turso only works with SQLite
    if (optionId === "turso" && database !== "sqlite" && database !== "none") {
      return false;
    }

    // Neon only works with PostgreSQL
    if (optionId === "neon" && database !== "postgres" && database !== "none") {
      return false;
    }

    // Supabase works with PostgreSQL
    if (
      optionId === "supabase" &&
      database !== "postgres" &&
      database !== "none"
    ) {
      return false;
    }
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
  if (stack.yolo === "true") {
    return null;
  }

  if (category === "orm") {
    const database = stack.database;

    if (
      database === "mongodb" &&
      optionId !== "mongoose" &&
      optionId !== "none"
    ) {
      return "This ORM is not compatible with MongoDB. MongoDB requires Mongoose.";
    }

    if (
      (database === "postgres" ||
        database === "mysql" ||
        database === "sqlite") &&
      optionId === "mongoose"
    ) {
      return "Mongoose only works with MongoDB databases.";
    }
  }

  if (category === "dbSetup") {
    const database = stack.database;

    if (optionId === "turso" && database !== "sqlite" && database !== "none") {
      return "Turso only supports SQLite databases.";
    }

    if (optionId === "neon" && database !== "postgres" && database !== "none") {
      return "Neon only supports PostgreSQL databases.";
    }

    if (
      optionId === "supabase" &&
      database !== "postgres" &&
      database !== "none"
    ) {
      return "Supabase requires PostgreSQL as the database.";
    }
  }

  return null;
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): string | null {
  if (!name || name.trim() === "") {
    return null; // Empty is allowed, will use default
  }

  // Check for valid npm package name format
  const trimmed = name.trim();

  if (trimmed.length > 214) {
    return "Project name must be less than 214 characters";
  }

  if (/^[._]/.test(trimmed)) {
    return "Project name cannot start with a dot or underscore";
  }

  if (/[A-Z]/.test(trimmed)) {
    return "Project name must be lowercase";
  }

  if (/[~'!()*]/.test(trimmed)) {
    return "Project name contains invalid characters";
  }

  // Reserved names
  const reserved = ["node_modules", "favicon.ico"];
  if (reserved.includes(trimmed.toLowerCase())) {
    return "This is a reserved name";
  }

  return null;
}
