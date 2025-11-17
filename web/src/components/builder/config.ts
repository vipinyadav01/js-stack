export type Frontend =
  | "none"
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "nextjs"
  | "nuxt"
  | "react-native";

export type Backend =
  | "none"
  | "express"
  | "fastify"
  | "koa"
  | "hapi"
  | "nestjs";

export type Database = "none" | "sqlite" | "postgres" | "mysql" | "mongodb";

export type ORM = "none" | "prisma" | "sequelize" | "mongoose" | "typeorm";

export type Auth =
  | "none"
  | "jwt"
  | "passport"
  | "auth0"
  | "oauth"
  | "better-auth";

export type Addon = "docker" | "testing" | "biome" | "turborepo";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface BuilderState {
  projectName: string;
  frontend: Frontend;
  backend: Backend;
  database: Database;
  orm: ORM;
  auth: Auth;
  addons: Addon[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

export const defaultConfig: BuilderState = {
  projectName: "Js-Stack",
  frontend: "react",
  backend: "express",
  database: "mongodb",
  orm: "mongoose",
  auth: "jwt",
  addons: [],
  packageManager: "npm",
  installDependencies: true,
  initializeGit: true,
};

/**
 * Comprehensive compatibility matrix based on real-world tested combinations.
 * All rules are bidirectional where applicable.
 */
export const compatibilityRules = {
  // Database-ORM compatibility (strictly enforced)
  databaseOrm: {
    mongodb: ["mongoose", "none"],
    postgres: ["prisma", "sequelize", "typeorm", "none"],
    mysql: ["prisma", "sequelize", "typeorm", "none"],
    sqlite: ["prisma", "sequelize", "typeorm", "none"],
    none: ["none"],
  },

  // ORM-Database compatibility (reverse lookup)
  ormDatabase: {
    prisma: ["postgres", "mysql", "sqlite"],
    mongoose: ["mongodb"],
    sequelize: ["postgres", "mysql", "sqlite"],
    typeorm: ["postgres", "mysql", "sqlite"],
    none: ["none", "postgres", "mysql", "sqlite", "mongodb"],
  },

  // Frontend-Auth compatibility (optimal pairings)
  frontendAuth: {
    nextjs: ["better-auth", "auth0", "jwt", "oauth", "none"],
    react: ["auth0", "better-auth", "jwt", "oauth", "passport", "none"],
    vue: ["auth0", "better-auth", "jwt", "oauth", "passport", "none"],
    nuxt: ["auth0", "better-auth", "jwt", "oauth", "none"],
    angular: ["auth0", "jwt", "oauth", "passport", "none"],
    svelte: ["auth0", "better-auth", "jwt", "oauth", "none"],
    "react-native": ["auth0", "better-auth", "jwt", "oauth", "none"],
    none: ["none"],
  },

  // Backend-Auth compatibility (backend-specific auth support)
  backendAuth: {
    express: ["jwt", "passport", "auth0", "oauth", "better-auth", "none"],
    fastify: ["jwt", "auth0", "oauth", "better-auth", "none"], // No Passport support
    koa: ["jwt", "passport", "auth0", "oauth", "better-auth", "none"],
    hapi: ["jwt", "auth0", "oauth", "none"], // Limited auth support
    nestjs: ["jwt", "passport", "auth0", "oauth", "better-auth", "none"],
    none: ["better-auth", "auth0", "jwt", "oauth", "none"], // Frontend-only auth
  },

  // Frontend-Backend compatibility (which backends work with which frontends)
  frontendBackend: {
    nextjs: ["none"], // Built-in API routes
    nuxt: ["none"], // Built-in server routes
    react: ["express", "fastify", "koa", "hapi", "nestjs", "none"],
    vue: ["express", "fastify", "koa", "hapi", "nestjs", "none"],
    angular: ["express", "fastify", "koa", "hapi", "nestjs", "none"],
    svelte: ["express", "fastify", "koa", "hapi", "nestjs", "none"],
    "react-native": ["express", "fastify", "koa", "hapi", "nestjs"], // Requires backend
    none: ["express", "fastify", "koa", "hapi", "nestjs"], // API-only
  },

  // Backend-Frontend compatibility (reverse lookup)
  backendFrontend: {
    express: ["react", "vue", "angular", "svelte", "react-native", "none"],
    fastify: ["react", "vue", "angular", "svelte", "react-native", "none"],
    koa: ["react", "vue", "angular", "svelte", "react-native", "none"],
    hapi: ["react", "vue", "angular", "svelte", "react-native", "none"],
    nestjs: ["react", "vue", "angular", "svelte", "react-native", "none"],
    none: ["nextjs", "nuxt", "react", "vue", "angular", "svelte"], // No React Native
  },

  // Backend-Database compatibility (tested combinations)
  backendDatabase: {
    express: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    fastify: ["postgres", "mysql", "sqlite", "mongodb", "none"], // Fastify works great with SQL
    koa: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    hapi: ["postgres", "mysql", "sqlite", "mongodb", "none"],
    nestjs: ["postgres", "mysql", "sqlite", "mongodb", "none"], // NestJS supports all major DBs
    none: ["none"],
  },

  // Frontend-Addon compatibility (framework-specific support)
  frontendAddons: {
    nextjs: ["testing", "biome", "turborepo", "docker"],
    react: ["testing", "biome", "turborepo", "docker"],
    vue: ["testing", "biome", "turborepo", "docker"],
    angular: ["testing", "docker", "turborepo"], // Angular has its own linting, biome less common
    svelte: ["testing", "biome", "turborepo", "docker"],
    nuxt: ["testing", "biome", "turborepo", "docker"],
    "react-native": ["testing", "docker"], // Limited addon support for mobile
    none: ["docker", "testing", "biome", "turborepo"], // Backend-only supports all
  },
} as const;

/**
 * Type for all compatibility rule types
 */
export type CompatibilityType =
  | "databaseOrm"
  | "ormDatabase"
  | "frontendAuth"
  | "backendAuth"
  | "backendDatabase"
  | "frontendBackend"
  | "backendFrontend"
  | "frontendAddons";

// Well-tested, production-ready stack combinations
export const testedStackCombinations: Record<string, Partial<BuilderState>> = {
  // Modern full-stack combinations
  "nextjs-postgres-prisma": {
    frontend: "nextjs",
    backend: "none", // Next.js API routes
    database: "postgres",
    orm: "prisma",
    auth: "better-auth",
    addons: ["testing", "biome"],
    packageManager: "npm",
  },
  "react-express-postgres": {
    frontend: "react",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  "vue-express-mysql": {
    frontend: "vue",
    backend: "express",
    database: "mysql",
    orm: "sequelize",
    auth: "passport",
    addons: ["testing", "biome"],
    packageManager: "npm",
  },
  // API-only combinations
  "fastify-postgres-prisma": {
    frontend: "none",
    backend: "fastify",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  "nestjs-postgres-typeorm": {
    frontend: "none",
    backend: "nestjs",
    database: "postgres",
    orm: "typeorm",
    auth: "passport",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  // NoSQL combinations
  "react-express-mongo": {
    frontend: "react",
    backend: "express",
    database: "mongodb",
    orm: "mongoose",
    auth: "jwt",
    addons: ["testing"],
    packageManager: "npm",
  },
  // Mobile combinations
  "react-native-express": {
    frontend: "react-native",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "auth0",
    addons: ["testing"],
    packageManager: "npm",
  },
  // Rapid prototyping
  "react-express-sqlite": {
    frontend: "react",
    backend: "express",
    database: "sqlite",
    orm: "prisma",
    auth: "none",
    addons: [],
    packageManager: "npm",
  },
};

export const techCatalog = {
  frontend: [
    {
      key: "react",
      name: "React",
      desc: "Fast, flexible UI library with Vite",
      badge: "Popular",
    },
    {
      key: "nextjs",
      name: "Next.js",
      desc: "Production-ready React framework",
      badge: "Full-Stack",
    },
    {
      key: "vue",
      name: "Vue",
      desc: "Progressive, approachable framework",
      badge: "Modern",
    },
    {
      key: "nuxt",
      name: "Nuxt",
      desc: "Intuitive Vue meta-framework",
      badge: "Full-Stack",
    },
    {
      key: "svelte",
      name: "Svelte",
      desc: "Compile-time optimized framework",
      badge: "Fast",
    },
    {
      key: "angular",
      name: "Angular",
      desc: "Full-featured enterprise framework",
      badge: "Enterprise",
    },
    {
      key: "react-native",
      name: "React Native",
      desc: "Cross-platform mobile apps",
      badge: "Mobile",
    },
    { key: "none", name: "None", desc: "API-only backend service" },
  ],
  backend: [
    {
      key: "express",
      name: "Express",
      desc: "Minimal, flexible Node.js framework",
      badge: "Popular",
    },
    {
      key: "fastify",
      name: "Fastify",
      desc: "High-performance web framework",
      badge: "Fast",
    },
    {
      key: "nestjs",
      name: "NestJS",
      desc: "Scalable enterprise framework",
      badge: "Enterprise",
    },
    { key: "koa", name: "Koa", desc: "Expressive middleware framework" },
    { key: "hapi", name: "Hapi", desc: "Rich configuration framework" },
    { key: "none", name: "None", desc: "Frontend-only application" },
  ],
  database: [
    {
      key: "postgres",
      name: "PostgreSQL",
      desc: "Advanced open-source database",
      badge: "Popular",
    },
    {
      key: "mysql",
      name: "MySQL",
      desc: "Reliable relational database",
      badge: "Stable",
    },
    {
      key: "mongodb",
      name: "MongoDB",
      desc: "Flexible document database",
      badge: "NoSQL",
    },
    {
      key: "sqlite",
      name: "SQLite",
      desc: "Lightweight embedded database",
      badge: "Dev",
    },
    { key: "none", name: "None", desc: "No database persistence" },
  ],
  orm: [
    {
      key: "prisma",
      name: "Prisma",
      desc: "Next-gen type-safe ORM",
      badge: "Modern",
    },
    {
      key: "mongoose",
      name: "Mongoose",
      desc: "Elegant MongoDB ODM",
      badge: "MongoDB",
    },
    {
      key: "sequelize",
      name: "Sequelize",
      desc: "Feature-rich SQL ORM",
      badge: "Mature",
    },
    {
      key: "typeorm",
      name: "TypeORM",
      desc: "TypeScript-first ORM",
      badge: "TypeScript",
    },
    { key: "none", name: "None", desc: "Direct database queries" },
  ],
  auth: [
    {
      key: "better-auth",
      name: "Better Auth",
      desc: "Modern, flexible auth solution",
      badge: "New",
    },
    {
      key: "auth0",
      name: "Auth0",
      desc: "Complete identity platform",
      badge: "Hosted",
    },
    {
      key: "jwt",
      name: "JWT",
      desc: "Simple stateless authentication",
      badge: "Simple",
    },
    {
      key: "passport",
      name: "Passport",
      desc: "Extensible auth middleware",
      badge: "Flexible",
    },
    {
      key: "oauth",
      name: "OAuth",
      desc: "Industry-standard authorization",
      badge: "Standard",
    },
    { key: "none", name: "None", desc: "No user authentication" },
  ],
  addons: [
    {
      key: "testing",
      name: "Testing",
      desc: "Jest/Vitest testing framework",
      badge: "Recommended",
    },
    {
      key: "biome",
      name: "Biome",
      desc: "Ultra-fast linter & formatter",
      badge: "Fast",
    },
    {
      key: "docker",
      name: "Docker",
      desc: "Application containerization",
      badge: "DevOps",
    },
    {
      key: "turborepo",
      name: "Turborepo",
      desc: "High-performance monorepo",
      badge: "Monorepo",
    },
  ],
  packageManager: [
    { key: "npm", name: "npm", desc: "Node Package Manager", badge: "Default" },
    { key: "yarn", name: "Yarn", desc: "Fast, reliable, secure" },
    { key: "pnpm", name: "pnpm", desc: "Fast, disk space efficient" },
    {
      key: "bun",
      name: "Bun",
      desc: "All-in-one JavaScript runtime",
      badge: "Fast",
    },
  ],
} as const;

export function normalizeState(input: Partial<BuilderState>): BuilderState {
  return {
    projectName: input.projectName || defaultConfig.projectName,
    frontend: input.frontend || defaultConfig.frontend,
    backend: input.backend || defaultConfig.backend,
    database: input.database || defaultConfig.database,
    orm: input.orm || defaultConfig.orm,
    auth: input.auth || defaultConfig.auth,
    addons: Array.isArray(input.addons) ? input.addons : defaultConfig.addons,
    packageManager: input.packageManager || defaultConfig.packageManager,
    installDependencies:
      input.installDependencies ?? defaultConfig.installDependencies,
    initializeGit: input.initializeGit ?? defaultConfig.initializeGit,
  };
}

/**
 * Check if two technologies are compatible based on the specified compatibility type.
 * Supports bidirectional checks for all compatibility rule types.
 *
 * @param type - The type of compatibility check to perform
 * @param primary - The primary technology (e.g., database, frontend, backend)
 * @param secondary - The secondary technology to check against (can be array for multiple checks)
 * @returns true if compatible, false otherwise
 */
export function isCompatible(
  type: CompatibilityType,
  primary: string,
  secondary: string | string[],
): boolean {
  const rules = compatibilityRules[type];
  const compatibleOptions =
    (rules as Record<string, readonly string[]>)[primary] || [];

  if (Array.isArray(secondary)) {
    return secondary.every((item) => compatibleOptions.includes(item));
  }

  return compatibleOptions.includes(secondary);
}

/**
 * Get all compatible options for a given primary technology selection.
 * Supports all compatibility rule types including bidirectional lookups.
 *
 * @param type - The type of compatibility check to perform
 * @param primary - The primary technology to get compatible options for
 * @returns Array of compatible technology options
 */
export function getCompatibleOptions<T extends string>(
  type: CompatibilityType,
  primary: string,
): T[] {
  const rules = compatibilityRules[type];
  return ((rules as Record<string, readonly string[]>)[primary] || []) as T[];
}

// Find the best tested combination for current selections
export function findBestTestedCombination(state: BuilderState): {
  match: string | null;
  confidence: number;
  suggestions: Partial<BuilderState>;
} {
  let bestMatch = null;
  let bestScore = 0;
  let bestSuggestions: Partial<BuilderState> = {};

  for (const [key, combo] of Object.entries(testedStackCombinations)) {
    let score = 0;
    const maxScore = 6;

    if (state.frontend === combo.frontend) score++;
    if (state.backend === combo.backend) score++;
    if (state.database === combo.database) score++;
    if (state.orm === combo.orm) score++;
    if (state.auth === combo.auth) score++;
    if (
      state.addons.length > 0 &&
      combo.addons &&
      combo.addons.some((addon) => state.addons.includes(addon))
    )
      score++;

    const confidence = score / maxScore;

    if (confidence > bestScore) {
      bestScore = confidence;
      bestMatch = key;
      bestSuggestions = combo;
    }
  }

  return {
    match: bestMatch,
    confidence: bestScore,
    suggestions: bestSuggestions,
  };
}

/**
 * Apply compatibility rules and automatically fix conflicts with intelligent suggestions.
 * This function enforces strict compatibility rules and auto-corrects incompatible combinations.
 *
 * @param state - The current builder state
 * @returns Adjusted state with compatibility fixes applied
 */
export function applyCompatibility(state: BuilderState): BuilderState {
  const adjusted = { ...state };

  // ============================================
  // Frontend-Backend Compatibility Rules
  // ============================================

  // Rule 1: Next.js/Nuxt must use backend: "none" (they have built-in API routes)
  if (state.frontend === "nextjs" || state.frontend === "nuxt") {
    if (state.backend !== "none") {
      adjusted.backend = "none";
    }
  }

  // Rule 2: If backend is selected with Next.js/Nuxt, switch frontend to React
  if (
    state.backend !== "none" &&
    (state.frontend === "nextjs" || state.frontend === "nuxt")
  ) {
    adjusted.frontend = "react";
  }

  // Rule 3: React Native must have a backend (cannot be "none")
  if (state.frontend === "react-native" && state.backend === "none") {
    adjusted.backend = "express"; // Default to Express for React Native
  }

  // Rule 4: If frontend is "none", must have a backend (API-only mode)
  if (state.frontend === "none" && state.backend === "none") {
    adjusted.backend = "express"; // Default to Express for API-only
  }

  // Rule 5: Check frontend-backend compatibility
  if (!isCompatible("frontendBackend", state.frontend, state.backend)) {
    // Find a compatible backend for the selected frontend
    const compatibleBackends = getCompatibleOptions<Backend>(
      "frontendBackend",
      state.frontend,
    );
    if (compatibleBackends.length > 0 && compatibleBackends[0] !== "none") {
      adjusted.backend = compatibleBackends[0] as Backend;
    } else if (state.frontend !== "nextjs" && state.frontend !== "nuxt") {
      adjusted.backend = "express"; // Default fallback
    }
  }

  // Rule 6: Check backend-frontend compatibility (reverse check)
  if (!isCompatible("backendFrontend", state.backend, state.frontend)) {
    // Find a compatible frontend for the selected backend
    const compatibleFrontends = getCompatibleOptions<Frontend>(
      "backendFrontend",
      state.backend,
    );
    if (compatibleFrontends.length > 0) {
      adjusted.frontend = compatibleFrontends[0] as Frontend;
    }
  }

  // ============================================
  // Database-ORM Compatibility Rules
  // ============================================

  // Rule 7: MongoDB only works with Mongoose
  if (state.database === "mongodb") {
    if (state.orm !== "mongoose" && state.orm !== "none") {
      adjusted.orm = "mongoose";
    }
  }

  // Rule 8: SQL databases don't work with Mongoose
  if (state.database !== "none" && state.database !== "mongodb") {
    if (state.orm === "mongoose") {
      adjusted.orm = "prisma"; // Default to Prisma for SQL
    }
  }

  // Rule 9: If database is "none", ORM must be "none"
  if (state.database === "none" && state.orm !== "none") {
    adjusted.orm = "none";
  }

  // Rule 10: Check database-ORM compatibility
  if (!isCompatible("databaseOrm", state.database, state.orm)) {
    const compatibleORMs = getCompatibleOptions<ORM>(
      "databaseOrm",
      state.database,
    );
    if (compatibleORMs.length > 0 && compatibleORMs[0] !== "none") {
      adjusted.orm = compatibleORMs[0] as ORM;
    } else {
      adjusted.orm = "none";
    }
  }

  // Rule 11: Check ORM-database compatibility (reverse check)
  if (!isCompatible("ormDatabase", state.orm, state.database)) {
    const compatibleDatabases = getCompatibleOptions<Database>(
      "ormDatabase",
      state.orm,
    );
    if (compatibleDatabases.length > 0 && compatibleDatabases[0] !== "none") {
      adjusted.database = compatibleDatabases[0] as Database;
    } else {
      adjusted.database = "none";
    }
  }

  // ============================================
  // Backend-Auth Compatibility Rules
  // ============================================

  // Rule 12: Passport doesn't work with Fastify
  if (state.backend === "fastify" && state.auth === "passport") {
    adjusted.auth = "jwt"; // Switch to JWT for Fastify
  }

  // Rule 13: Passport requires a proper backend (not "none")
  if (state.backend === "none" && state.auth === "passport") {
    adjusted.auth = "jwt"; // Switch to JWT for frontend-only
  }

  // Rule 14: Check backend-auth compatibility
  if (!isCompatible("backendAuth", state.backend, state.auth)) {
    const compatibleAuths = getCompatibleOptions<Auth>(
      "backendAuth",
      state.backend,
    );
    if (compatibleAuths.length > 0 && compatibleAuths[0] !== "none") {
      adjusted.auth = compatibleAuths[0] as Auth;
    } else {
      adjusted.auth = "none";
    }
  }

  // ============================================
  // Frontend-Auth Compatibility (Warnings only)
  // ============================================

  // Frontend-Auth compatibility is checked in validation but not auto-corrected
  // to allow maximum flexibility

  return adjusted;
}

/**
 * Validate entire configuration with comprehensive compatibility checks.
 * Returns detailed feedback including errors, warnings, and tested combination info.
 *
 * @param state - The builder state to validate
 * @returns Validation result with errors, warnings, and tested combination info
 */
export function validateConfiguration(state: BuilderState): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  testedCombination?: {
    match: string | null;
    confidence: number;
    isWellTested: boolean;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ============================================
  // Critical Errors (Blocking)
  // ============================================

  // Error 1: Both frontend AND backend cannot be "none"
  if (state.frontend === "none" && state.backend === "none") {
    errors.push(
      "Cannot have both frontend and backend as 'none'. Please select either a frontend framework or a backend framework (or both).",
    );
  }

  // Error 2: Next.js/Nuxt cannot have a separate backend
  if (
    (state.frontend === "nextjs" || state.frontend === "nuxt") &&
    state.backend !== "none"
  ) {
    errors.push(
      `${state.frontend === "nextjs" ? "Next.js" : "Nuxt"} has built-in API routes and cannot use a separate backend. Please set backend to "none" or switch to a different frontend framework.`,
    );
  }

  // Error 3: React Native must have a backend
  if (state.frontend === "react-native" && state.backend === "none") {
    errors.push(
      "React Native requires a backend framework. Please select a backend (e.g., Express, Fastify, NestJS).",
    );
  }

  // Error 4: Frontend-Backend compatibility check
  if (!isCompatible("frontendBackend", state.frontend, state.backend)) {
    const compatibleBackends = getCompatibleOptions<Backend>(
      "frontendBackend",
      state.frontend,
    );
    errors.push(
      `${state.frontend} is not compatible with ${state.backend}. Compatible backends: ${compatibleBackends.join(", ")}.`,
    );
  }

  // Error 5: Backend-Frontend compatibility check (reverse)
  if (!isCompatible("backendFrontend", state.backend, state.frontend)) {
    const compatibleFrontends = getCompatibleOptions<Frontend>(
      "backendFrontend",
      state.backend,
    );
    errors.push(
      `${state.backend} is not compatible with ${state.frontend}. Compatible frontends: ${compatibleFrontends.join(", ")}.`,
    );
  }

  // Error 6: Database-ORM compatibility check
  if (!isCompatible("databaseOrm", state.database, state.orm)) {
    const compatibleORMs = getCompatibleOptions<ORM>(
      "databaseOrm",
      state.database,
    );
    errors.push(
      `${state.orm} is not compatible with ${state.database}. Compatible ORMs: ${compatibleORMs.join(", ")}.`,
    );
  }

  // Error 7: ORM-Database compatibility check (reverse)
  if (!isCompatible("ormDatabase", state.orm, state.database)) {
    const compatibleDatabases = getCompatibleOptions<Database>(
      "ormDatabase",
      state.orm,
    );
    errors.push(
      `${state.orm} is not compatible with ${state.database}. Compatible databases: ${compatibleDatabases.join(", ")}.`,
    );
  }

  // Error 8: Backend-Auth compatibility check
  if (!isCompatible("backendAuth", state.backend, state.auth)) {
    const compatibleAuths = getCompatibleOptions<Auth>(
      "backendAuth",
      state.backend,
    );
    errors.push(
      `${state.auth} is not compatible with ${state.backend}. Compatible auth methods: ${compatibleAuths.join(", ")}.`,
    );
  }

  // ============================================
  // Warnings (Non-blocking)
  // ============================================

  // Warning 1: Frontend-Auth compatibility (suggestion only)
  if (!isCompatible("frontendAuth", state.frontend, state.auth)) {
    const compatibleAuths = getCompatibleOptions<Auth>(
      "frontendAuth",
      state.frontend,
    );
    warnings.push(
      `${state.auth} may not be optimal for ${state.frontend}. Consider: ${compatibleAuths.filter((a) => a !== "none").join(", ")}.`,
    );
  }

  // Warning 2: Database "none" with ORM selected
  if (state.database === "none" && state.orm !== "none") {
    warnings.push(
      "ORM is selected but no database is chosen. Consider selecting a database or setting ORM to 'none'.",
    );
  }

  // Warning 3: Check for tested combinations
  const testedCombo = findBestTestedCombination(state);
  const isWellTested = testedCombo.confidence >= 0.7;

  if (!isWellTested && testedCombo.confidence > 0.3) {
    warnings.push(
      "This combination is experimental. Consider using a tested stack for production.",
    );
  }

  // Warning 4: Setup warnings
  if (!state.installDependencies) {
    warnings.push(
      "Manual dependency installation required after project creation.",
    );
  }

  if (!state.initializeGit) {
    warnings.push("Manual git repository initialization required.");
  }

  // Warning 5: Passport with Fastify (should be caught by auto-correction, but warn if not)
  if (state.backend === "fastify" && state.auth === "passport") {
    warnings.push(
      "Passport.js has limited support with Fastify. Consider using JWT or another auth method.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    testedCombination: {
      match: testedCombo.match,
      confidence: testedCombo.confidence,
      isWellTested,
    },
  };
}

// Build CLI command with proper formatting
export function buildCliCommand(state: BuilderState): string {
  // Get the correct command prefix based on package manager
  const getCommandPrefix = (packageManager: PackageManager): string => {
    switch (packageManager) {
      case "npm":
        return "npx";
      case "yarn":
        return "yarn create";
      case "pnpm":
        return "pnpm create";
      case "bun":
        return "bunx";
      default:
        return "npx";
    }
  };

  const projectName = state.projectName || "my-app";
  const parts = [
    `${getCommandPrefix(state.packageManager)} create-js-stack@latest ${projectName}`,
  ];

  // Frontend - CLI supports multiple frontends
  if (state.frontend !== "none") {
    parts.push(`--frontend ${state.frontend}`);
  }

  // Backend
  if (state.backend !== "none") {
    parts.push(`--backend ${state.backend}`);
  }

  // Database
  if (state.database !== "none") {
    parts.push(`--database ${state.database}`);
  }

  // ORM
  if (state.orm !== "none") {
    parts.push(`--orm ${state.orm}`);
  }

  // Auth
  if (state.auth !== "none") {
    parts.push(`--auth ${state.auth}`);
  }

  // Addons - only include if there are addons
  if (state.addons.length > 0) {
    parts.push(`--addons ${state.addons.join(",")}`);
  }

  // Package manager - always include
  parts.push(`--package-manager ${state.packageManager}`);

  // Git flag
  if (state.initializeGit) {
    parts.push("--git");
  }

  // Install flag
  if (state.installDependencies) {
    parts.push("--install");
  }

  return parts.join(" ");
}

// Compact CLI command generator (similar to the example you showed)
export function generateReproducibleCommand(config: BuilderState): string {
  const flags: string[] = [];

  // Frontend
  if (config.frontend && config.frontend !== "none") {
    flags.push(`--frontend ${config.frontend}`);
  } else {
    flags.push("--frontend none");
  }

  // Backend
  flags.push(`--backend ${config.backend}`);

  // Database
  flags.push(`--database ${config.database}`);

  // ORM
  flags.push(`--orm ${config.orm}`);

  // Auth
  flags.push(`--auth ${config.auth}`);

  // Addons
  if (config.addons && config.addons.length > 0) {
    flags.push(`--addons ${config.addons.join(",")}`);
  } else {
    flags.push("--addons none");
  }

  // Package manager
  flags.push(`--package-manager ${config.packageManager}`);

  // Git initialization
  flags.push(config.initializeGit ? "--git" : "--no-git");

  // Install dependencies
  flags.push(config.installDependencies ? "--install" : "--no-install");

  // Build base command based on package manager
  let baseCommand = "npx create-js-stack@latest";
  const pkgManager = config.packageManager;

  switch (pkgManager) {
    case "bun":
      baseCommand = "bunx create-js-stack@latest";
      break;
    case "pnpm":
      baseCommand = "pnpm create js-stack@latest";
      break;
    case "yarn":
      baseCommand = "yarn create js-stack@latest";
      break;
    case "npm":
    default:
      baseCommand = "npx create-js-stack@latest";
      break;
  }

  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}

// Generate quick start command with --yes flag
// Note: Project name is always customizable, even with --yes
export function generateQuickStartCommand(config: BuilderState): string {
  // Project name is always the first argument and is customizable
  const projectName = config.projectName || "my-app";
  const projectPathArg = ` ${projectName}`;

  // Build base command based on package manager
  let baseCommand = "npx create-js-stack@latest";
  const pkgManager = config.packageManager;

  switch (pkgManager) {
    case "bun":
      baseCommand = "bunx create-js-stack@latest";
      break;
    case "pnpm":
      baseCommand = "pnpm create js-stack@latest";
      break;
    case "yarn":
      baseCommand = "yarn create js-stack@latest";
      break;
    case "npm":
    default:
      baseCommand = "npx create-js-stack@latest";
      break;
  }

  // --yes automatically includes --git and --install
  // Project name is always customizable as the first argument
  return `${baseCommand}${projectPathArg} --yes`;
}

// Build separate commands for post-setup actions
export function buildPostSetupCommands(state: BuilderState): {
  cdCommand: string;
  installCommand?: string;
  gitCommands?: string[];
  startCommand: string;
  databaseSetup?: string[];
} {
  const commands: {
    cdCommand: string;
    startCommand: string;
    installCommand?: string;
    gitCommands?: string[];
    databaseSetup?: string[];
  } = {
    cdCommand: `cd ${state.projectName}`,
    startCommand:
      state.frontend === "none"
        ? `${state.packageManager} start`
        : `${state.packageManager} run dev`,
  };

  if (!state.installDependencies) {
    commands.installCommand = `${state.packageManager} install`;
  }

  if (!state.initializeGit) {
    commands.gitCommands = [
      "git init",
      "git add .",
      'git commit -m "Initial commit"',
    ];
  }

  // Add database setup commands for local databases
  if (state.database === "postgres") {
    commands.databaseSetup = [
      "createdb " + state.projectName,
      "npx prisma migrate dev", // if using Prisma
    ];
  } else if (state.database === "mysql") {
    commands.databaseSetup = [
      'mysql -e "CREATE DATABASE ' + state.projectName + '"',
      "npx prisma migrate dev", // if using Prisma
    ];
  }

  return commands;
}

// Get recommended stack for common use cases with tested combinations
export function getRecommendedStack(useCase: string): Partial<BuilderState> {
  const stacks = {
    "fullstack-web": {
      frontend: "nextjs" as Frontend,
      backend: "none" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "better-auth" as Auth,
      addons: ["testing", "biome"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    "react-api": {
      frontend: "react" as Frontend,
      backend: "express" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "jwt" as Auth,
      addons: ["testing", "docker"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    "api-only": {
      frontend: "none" as Frontend,
      backend: "fastify" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "jwt" as Auth,
      addons: ["testing", "docker"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    mobile: {
      frontend: "react-native" as Frontend,
      backend: "express" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "auth0" as Auth,
      addons: ["testing"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    prototype: {
      frontend: "react" as Frontend,
      backend: "express" as Backend,
      database: "sqlite" as Database,
      orm: "prisma" as ORM,
      auth: "none" as Auth,
      addons: [] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: false,
    },
  };

  return stacks[useCase as keyof typeof stacks] || {};
}

// Generate complete setup instructions
export function generateSetupInstructions(state: BuilderState): {
  title: string;
  steps: string[];
  notes: string[];
} {
  const commands = buildPostSetupCommands(state);
  const validation = validateConfiguration(state);

  const steps = [
    `Run: ${buildCliCommand(state)}`,
    `Navigate to project: ${commands.cdCommand}`,
  ];

  if (commands.installCommand) {
    steps.push(`Install dependencies: ${commands.installCommand}`);
  }

  if (commands.databaseSetup && commands.databaseSetup.length > 0) {
    steps.push(`Setup database:`);
    commands.databaseSetup.forEach((cmd) => steps.push(`  ${cmd}`));
  }

  if (commands.gitCommands) {
    steps.push(`Initialize git repository:`);
    commands.gitCommands.forEach((cmd) => steps.push(`  ${cmd}`));
  }

  steps.push(`Start development server: ${commands.startCommand}`);

  const notes = [...validation.warnings];

  // Add tested combination info
  if (validation.testedCombination?.isWellTested) {
    notes.unshift(
      `✅ This is a well-tested, production-ready stack combination`,
    );
  } else if (
    validation.testedCombination?.confidence &&
    validation.testedCombination.confidence > 0.3
  ) {
    notes.unshift(
      `⚠️ This combination is experimental. Consider a tested stack for production`,
    );
  }

  // Technology-specific setup notes
  if (state.auth === "auth0") {
    notes.push("Configure Auth0 domain and client ID in environment variables");
  }

  if (state.auth === "better-auth") {
    notes.push("Configure Better Auth providers and database URL");
  }

  if (state.addons.includes("docker")) {
    notes.push("Docker compose file included for development environment");
  }

  if (state.addons.includes("turborepo")) {
    notes.push("Turborepo workspace configured for monorepo development");
  }

  return {
    title: `Setup Instructions for ${state.projectName}`,
    steps,
    notes,
  };
}

// Check if current configuration requires manual setup steps
export function requiresManualSetup(state: BuilderState): {
  hasManualSteps: boolean;
  steps: string[];
} {
  const manualSteps: string[] = [];

  if (!state.installDependencies) {
    manualSteps.push("Install dependencies manually");
  }

  if (!state.initializeGit) {
    manualSteps.push("Initialize git repository");
  }

  if (state.database === "postgres" || state.database === "mysql") {
    manualSteps.push("Set up and configure database server");
  }

  if (state.auth === "auth0") {
    manualSteps.push("Configure Auth0 credentials and environment variables");
  }

  if (state.auth === "better-auth") {
    manualSteps.push("Configure Better Auth providers and settings");
  }

  if (state.addons.includes("docker")) {
    manualSteps.push("Build and run Docker containers");
  }

  if (state.addons.includes("turborepo")) {
    manualSteps.push("Configure turborepo workspace settings");
  }

  return {
    hasManualSteps: manualSteps.length > 0,
    steps: manualSteps,
  };
}
