/**
 * Configuration validation and compatibility checks
 */

import type {
  ProjectConfig,
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Auth,
  API,
} from "./types.js";

/**
 * Validate database and ORM compatibility
 */
export function validateDatabaseORM(
  database: Database,
  orm: ORM,
): { valid: boolean; error?: string } {
  // MongoDB only works with Mongoose
  if (database === "mongodb" && orm !== "mongoose" && orm !== "none") {
    return {
      valid: false,
      error: "MongoDB can only be used with Mongoose ORM",
    };
  }

  // SQL databases work with Drizzle, Prisma, but not Mongoose
  if (
    (database === "postgres" ||
      database === "mysql" ||
      database === "sqlite") &&
    orm === "mongoose"
  ) {
    return {
      valid: false,
      error: "Mongoose can only be used with MongoDB",
    };
  }

  return { valid: true };
}

/**
 * Validate backend and runtime compatibility
 */
export function validateBackendRuntime(
  backend: Backend,
  runtime: Runtime,
): { valid: boolean; error?: string } {
  // Convex requires specific runtime
  if (backend === "convex" && runtime !== "node") {
    return {
      valid: false,
      error: "Convex requires Node.js runtime",
    };
  }

  // Workers runtime works with specific backends
  if (runtime === "workers") {
    const supportedBackends: Backend[] = ["hono", "next", "none"];
    if (!supportedBackends.includes(backend)) {
      return {
        valid: false,
        error: "Workers runtime only supports Hono, Next.js, or no backend",
      };
    }
  }

  return { valid: true };
}

/**
 * Validate frontend and backend compatibility
 */
export function validateFrontendBackend(
  frontend: Frontend,
  backend: Backend,
): { valid: boolean; error?: string } {
  // Next.js includes its own backend
  if (frontend.includes("next") && backend !== "none" && backend !== "next") {
    return {
      valid: false,
      error:
        "Next.js includes its own backend. Set backend to 'none' or 'next'",
    };
  }

  // Nuxt includes its own backend
  if (frontend.includes("nuxt") && backend !== "none") {
    return {
      valid: false,
      error: "Nuxt includes its own backend. Set backend to 'none'",
    };
  }

  return { valid: true };
}

/**
 * Validate auth and database compatibility
 */
export function validateAuthDatabase(
  auth: Auth,
  database: Database,
): { valid: boolean; error?: string } {
  // Better Auth requires a database
  if (auth === "better-auth" && database === "none") {
    return {
      valid: false,
      error: "Better Auth requires a database to be selected",
    };
  }

  return { valid: true };
}

/**
 * Validate API and backend compatibility
 */
export function validateAPIBackend(
  api: API,
  backend: Backend,
): { valid: boolean; error?: string } {
  // tRPC and oRPC require a backend
  if ((api === "trpc" || api === "orpc") && backend === "none") {
    return {
      valid: false,
      error: `${api.toUpperCase()} requires a backend to be selected`,
    };
  }

  return { valid: true };
}

/**
 * Comprehensive configuration validation
 */
export function validateConfig(config: Partial<ProjectConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.database && config.orm) {
    const result = validateDatabaseORM(config.database, config.orm);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (config.backend && config.runtime) {
    const result = validateBackendRuntime(config.backend, config.runtime);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (config.frontend && config.backend) {
    const result = validateFrontendBackend(config.frontend, config.backend);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (config.auth && config.database) {
    const result = validateAuthDatabase(config.auth, config.database);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (config.api && config.backend) {
    const result = validateAPIBackend(config.api, config.backend);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Auto-fix configuration based on compatibility rules
 */
export function autoFixConfig(
  config: Partial<ProjectConfig>,
): Partial<ProjectConfig> {
  const fixed = { ...config };

  // Fix MongoDB + ORM
  if (fixed.database === "mongodb" && fixed.orm && fixed.orm !== "mongoose") {
    fixed.orm = "mongoose";
  }

  // Fix SQL databases + Mongoose
  if (
    (fixed.database === "postgres" ||
      fixed.database === "mysql" ||
      fixed.database === "sqlite") &&
    fixed.orm === "mongoose"
  ) {
    fixed.orm = "none";
  }

  // Fix Next.js + backend
  if (
    fixed.frontend?.includes("next") &&
    fixed.backend &&
    fixed.backend !== "next"
  ) {
    fixed.backend = "none";
  }

  // Fix Nuxt + backend
  if (
    fixed.frontend?.includes("nuxt") &&
    fixed.backend &&
    fixed.backend !== "none"
  ) {
    fixed.backend = "none";
  }

  // Fix Better Auth + database
  if (fixed.auth === "better-auth" && fixed.database === "none") {
    fixed.database = "postgres"; // Default to postgres
  }

  // Fix tRPC/oRPC + backend
  if (
    (fixed.api === "trpc" || fixed.api === "orpc") &&
    fixed.backend === "none"
  ) {
    fixed.backend = "express"; // Default to express
  }

  return fixed;
}
