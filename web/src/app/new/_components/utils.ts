import { StackState } from "./use-stack-state";

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

  const adjustedStack: Partial<StackState> = { ...stack };
  const notes: Record<string, { notes: string[]; hasIssue: boolean }> = {};
  const changes: Array<{ category: string; message: string }> = [];

  // Backend "none" rules
  if (stack.backend === "none") {
    adjustedStack.auth = "none";
    adjustedStack.database = "none";
    adjustedStack.orm = "none";
    changes.push({
      category: "backend",
      message: "Backend set to 'none' - disabling auth, database, and ORM",
    });
  }

  // Database "none" rules
  if (stack.database === "none") {
    adjustedStack.orm = "none";
    if (stack.orm !== "none") {
      changes.push({
        category: "orm",
        message: "Database set to 'none' - disabling ORM",
      });
    }
  }

  // MongoDB-specific rules
  if (stack.database === "mongodb") {
    if (stack.orm && stack.orm !== "mongoose" && stack.orm !== "none") {
      adjustedStack.orm = "mongoose";
      changes.push({
        category: "orm",
        message: "MongoDB requires Mongoose ORM",
      });
    }
  }

  // PostgreSQL/MySQL/SQLite rules
  if (["postgresql", "mysql", "sqlite"].includes(stack.database)) {
    if (stack.orm === "mongoose") {
      adjustedStack.orm = "prisma";
      changes.push({
        category: "orm",
        message: "SQL databases require Prisma, Sequelize, or TypeORM",
      });
    }
  }

  // Frontend compatibility notes
  if (stack.frontend && stack.frontend.length > 0) {
    const hasReact = stack.frontend.includes("react");
    const hasVue = stack.frontend.includes("vue");
    const hasAngular = stack.frontend.includes("angular");

    if (hasReact && hasVue) {
      notes.frontend = {
        notes: ["Mixing React and Vue in the same project is unusual"],
        hasIssue: false,
      };
    }
  }

  // Auth compatibility
  if (stack.auth === "jwt" && stack.backend === "none") {
    adjustedStack.auth = "none";
    changes.push({
      category: "auth",
      message: "JWT requires a backend - disabling auth",
    });
  }

  // Package manager recommendations
  if (stack.packageManager === "npm" && stack.addons.includes("turborepo")) {
    notes.packageManager = {
      notes: [
        "Consider using pnpm or yarn with Turborepo for better performance",
      ],
      hasIssue: false,
    };
  }

  return {
    adjustedStack: Object.keys(adjustedStack).length > 0 ? adjustedStack : null,
    notes,
    changes,
  };
}
