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
import { analytics } from "./analytics/posthog.js";
import {
  isJavaBackend,
  JAVA_ORMS,
  JAVA_AUTH,
  JAVA_COMPATIBLE_APIS,
  JPA_DATABASES,
} from "./utils/java-backend.js";

/**
 * Validate database and ORM compatibility
 */
export function validateDatabaseORM(
  database: Database,
  orm: ORM,
): { valid: boolean; error?: string } {
  // MongoDB only works with Mongoose
  if (database === "mongodb" && orm !== "mongoose" && orm !== "none") {
    const error = "MongoDB can only be used with Mongoose ORM";

    // Track validation error
    analytics.track("validation_error", {
      error_type: "compatibility",
      error_message: error,
      database,
      orm,
      auto_fixed: false,
    });

    return {
      valid: false,
      error,
    };
  }

  // SQL databases work with Drizzle, Prisma, TypeORM, MikroORM but not Mongoose
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

  // Drizzle only works with SQL databases
  if (database === "mongodb" && orm === "drizzle") {
    return {
      valid: false,
      error: "Drizzle ORM does not support MongoDB",
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
  // Next.js includes its own backend. A JVM backend is a separate service
  // rather than a competing JS server, so it is allowed alongside one.
  if (
    frontend === "next" &&
    backend !== "none" &&
    backend !== "next" &&
    !isJavaBackend(backend)
  ) {
    return {
      valid: false,
      error:
        "Next.js includes its own backend. Set backend to 'none' or 'next'",
    };
  }

  // Meta-frameworks include their own backend
  const metaFrameworks = [
    "nuxt",
    "sveltekit",
    "remix",
    "astro",
    "solid-start",
    "qwik",
  ];
  const hasMetaFramework = metaFrameworks.includes(frontend);

  if (hasMetaFramework && backend !== "none" && !isJavaBackend(backend)) {
    return {
      valid: false,
      error:
        "Selected meta-framework includes its own backend. Set backend to 'none'",
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
 * Validate a Java backend against the JavaScript-only parts of the stack.
 *
 * Spring Boot is generated as a separate Maven service, so the JS ORMs, JS auth
 * providers and JS-runtime options do not apply to it, and the RPC API styles
 * (tRPC/oRPC) cannot cross the language boundary at all.
 */
export function validateJavaStack(config: Partial<ProjectConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const java = isJavaBackend(config.backend);

  if (java) {
    if (config.orm && config.orm !== "none" && !JAVA_ORMS.has(config.orm)) {
      errors.push(
        `Spring Boot cannot use the ${config.orm} ORM. Use 'jpa' or 'none'`,
      );
    }

    if (config.auth && config.auth !== "none" && !JAVA_AUTH.has(config.auth)) {
      errors.push(
        `Spring Boot cannot use ${config.auth}. Use 'spring-security' or 'none'`,
      );
    }

    if (config.api && !JAVA_COMPATIBLE_APIS.has(config.api)) {
      errors.push(
        `${config.api.toUpperCase()} is a JavaScript-only transport and cannot be served by Spring Boot. Use 'rest' or 'graphql'`,
      );
    }

    if (config.runtime && config.runtime !== "none") {
      errors.push("Spring Boot runs on the JVM. Set runtime to 'none'");
    }
  } else {
    if (config.orm && JAVA_ORMS.has(config.orm)) {
      errors.push(`The ${config.orm} ORM requires a Java backend`);
    }

    if (config.auth && JAVA_AUTH.has(config.auth)) {
      errors.push(`${config.auth} requires a Java backend`);
    }
  }

  // Spring Data JPA maps to relational databases only; MongoDB uses a
  // different Spring Data module, which the template wires up automatically.
  if (
    config.orm === "jpa" &&
    config.database &&
    !JPA_DATABASES.has(config.database)
  ) {
    errors.push(
      "JPA requires a relational database (PostgreSQL, MySQL or SQLite)",
    );
  }

  return { valid: errors.length === 0, errors };
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

  errors.push(...validateJavaStack(config).errors);

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
  if (fixed.database === "mongodb" && fixed.orm === "drizzle") {
    fixed.orm = "prisma"; // Default to Prisma for Mongo if Drizzle was selected
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

  // Fix Next.js + backend (a JVM backend is a separate service, so it stays)
  if (
    fixed.frontend === "next" &&
    fixed.backend &&
    fixed.backend !== "next" &&
    !isJavaBackend(fixed.backend)
  ) {
    fixed.backend = "none";
  }

  // Fix Meta-frameworks + backend
  const metaFrameworks = [
    "nuxt",
    "sveltekit",
    "remix",
    "astro",
    "solid-start",
    "qwik",
  ];
  if (
    fixed.frontend &&
    metaFrameworks.includes(fixed.frontend) &&
    fixed.backend &&
    fixed.backend !== "none" &&
    !isJavaBackend(fixed.backend)
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

  // Fix a Java backend paired with JavaScript-only stack choices
  if (isJavaBackend(fixed.backend)) {
    // JS ORMs do not exist on the JVM; keep the intent to use one by mapping
    // to JPA when the database is relational.
    if (fixed.orm && fixed.orm !== "none" && !JAVA_ORMS.has(fixed.orm)) {
      fixed.orm =
        fixed.database && JPA_DATABASES.has(fixed.database) ? "jpa" : "none";
    }

    if (fixed.auth && fixed.auth !== "none" && !JAVA_AUTH.has(fixed.auth)) {
      fixed.auth = "spring-security";
    }

    // tRPC/oRPC cannot cross the language boundary; REST is the closest match.
    if (fixed.api && !JAVA_COMPATIBLE_APIS.has(fixed.api)) {
      fixed.api = "rest";
    }

    if (fixed.runtime && fixed.runtime !== "none") {
      fixed.runtime = "none";
    }
  } else {
    // Java-only options selected without a Java backend
    if (fixed.orm && JAVA_ORMS.has(fixed.orm)) {
      fixed.orm = "none";
    }
    if (fixed.auth && JAVA_AUTH.has(fixed.auth)) {
      fixed.auth = "none";
    }
  }

  // JPA is relational-only; MongoDB is handled by Spring Data MongoDB instead.
  if (
    fixed.orm === "jpa" &&
    fixed.database &&
    !JPA_DATABASES.has(fixed.database)
  ) {
    fixed.orm = "none";
  }

  return fixed;
}
