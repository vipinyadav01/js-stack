import chalk from "chalk";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "../types.js";
import SmartCompatibility from "./smart-compatibility.js";

// ============================================================================
// COMPATIBILITY MATRICES
// ============================================================================

/**
 * Core compatibility relationships between technologies
 * Organized by category for better maintainability
 */
const COMPATIBILITY_RULES = {
  databaseOrm: {
    [DATABASE_OPTIONS.SQLITE]: [
      ORM_OPTIONS.PRISMA,
      ORM_OPTIONS.SEQUELIZE,
      ORM_OPTIONS.TYPEORM,
      ORM_OPTIONS.DRIZZLE,
    ],
    [DATABASE_OPTIONS.POSTGRES]: [
      ORM_OPTIONS.PRISMA,
      ORM_OPTIONS.SEQUELIZE,
      ORM_OPTIONS.TYPEORM,
      ORM_OPTIONS.DRIZZLE,
    ],
    [DATABASE_OPTIONS.MYSQL]: [
      ORM_OPTIONS.PRISMA,
      ORM_OPTIONS.SEQUELIZE,
      ORM_OPTIONS.TYPEORM,
      ORM_OPTIONS.DRIZZLE,
    ],
    [DATABASE_OPTIONS.MONGODB]: [ORM_OPTIONS.MONGOOSE, ORM_OPTIONS.PRISMA],
    [DATABASE_OPTIONS.NONE]: [ORM_OPTIONS.NONE],
  },

  authFrontend: {
    [AUTH_OPTIONS.NEXTAUTH]: [FRONTEND_OPTIONS.NEXTJS, FRONTEND_OPTIONS.REACT],
    [AUTH_OPTIONS.AUTH0]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.NEXTJS,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.NUXT,
      FRONTEND_OPTIONS.ANGULAR,
    ],
    [AUTH_OPTIONS.SUPABASE]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.NEXTJS,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.NUXT,
      FRONTEND_OPTIONS.SVELTE,
      FRONTEND_OPTIONS.SVELTEKIT,
    ],
    [AUTH_OPTIONS.LUCIA]: [FRONTEND_OPTIONS.NEXTJS, FRONTEND_OPTIONS.SVELTEKIT],
  },

  addonFrontend: {
    [ADDON_OPTIONS.TAILWIND]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.NEXTJS,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.NUXT,
      FRONTEND_OPTIONS.SVELTE,
      FRONTEND_OPTIONS.SVELTEKIT,
      FRONTEND_OPTIONS.REMIX,
      FRONTEND_OPTIONS.ASTRO,
    ],
    [ADDON_OPTIONS.SHADCN]: [FRONTEND_OPTIONS.REACT, FRONTEND_OPTIONS.NEXTJS],
    [ADDON_OPTIONS.STORYBOOK]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.ANGULAR,
      FRONTEND_OPTIONS.SVELTE,
    ],
  },
};

/**
 * Meta-frameworks that cannot coexist
 */
const META_FRAMEWORKS = new Set([
  FRONTEND_OPTIONS.NEXTJS,
  FRONTEND_OPTIONS.NUXT,
  FRONTEND_OPTIONS.SVELTEKIT,
  FRONTEND_OPTIONS.REMIX,
  FRONTEND_OPTIONS.ASTRO,
]);

/**
 * Full-stack frameworks that don't need separate backends
 */
const FULLSTACK_FRAMEWORKS = new Set([
  FRONTEND_OPTIONS.NEXTJS,
  FRONTEND_OPTIONS.NUXT,
  FRONTEND_OPTIONS.SVELTEKIT,
]);

// ============================================================================
// DEPENDENCY VERSIONS
// ============================================================================

/**
 * Centralized dependency version management
 * Organized by ecosystem for easier updates
 */
const DEPENDENCY_CATALOG = {
  react: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
  },

  remix: {
    "@remix-run/node": "^2.9.0",
    "@remix-run/react": "^2.9.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },

  astro: {
    astro: "^4.0.0",
  },

  sveltekit: {
    "@sveltejs/kit": "^2.0.0",
    svelte: "^4.0.0",
  },

  vue: {
    vue: "^3.3.0",
    "@vitejs/plugin-vue": "^4.4.0",
  },

  express: {
    express: "^4.18.0",
    "@types/express": "^4.17.0",
    cors: "^2.8.5",
    helmet: "^7.0.0",
  },

  databases: {
    [DATABASE_OPTIONS.POSTGRES]: {
      pg: "^8.11.0",
      "@types/pg": "^8.10.0",
    },
    [DATABASE_OPTIONS.MYSQL]: {
      mysql2: "^3.6.0",
      "@types/mysql": "^2.15.0",
    },
    [DATABASE_OPTIONS.MONGODB]: {
      mongodb: "^6.0.0",
    },
    [DATABASE_OPTIONS.SQLITE]: {
      sqlite3: "^5.1.0",
    },
  },

  orms: {
    [ORM_OPTIONS.PRISMA]: {
      prisma: "^5.0.0",
      "@prisma/client": "^5.0.0",
    },
    [ORM_OPTIONS.DRIZZLE]: {
      drizzle: "^0.31.0",
      "drizzle-orm": "^0.31.0",
    },
    [ORM_OPTIONS.SEQUELIZE]: {
      sequelize: "^6.32.0",
      "@types/sequelize": "^4.28.0",
    },
    [ORM_OPTIONS.MONGOOSE]: {
      mongoose: "^7.5.0",
      "@types/mongoose": "^5.11.0",
    },
    [ORM_OPTIONS.TYPEORM]: {
      typeorm: "^0.3.17",
      "reflect-metadata": "^0.1.13",
    },
  },

  auth: {
    [AUTH_OPTIONS.JWT]: {
      jsonwebtoken: "^9.0.0",
      "@types/jsonwebtoken": "^9.0.0",
    },
    [AUTH_OPTIONS.PASSPORT]: {
      passport: "^0.6.0",
      "passport-jwt": "^4.0.0",
      "@types/passport": "^1.0.0",
    },
    [AUTH_OPTIONS.NEXTAUTH]: {
      "next-auth": "^4.24.7",
    },
    [AUTH_OPTIONS.SUPABASE]: {
      "@supabase/supabase-js": "^2.45.0",
    },
    [AUTH_OPTIONS.LUCIA]: {
      lucia: "^3.0.0",
    },
  },
};

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

/**
 * Validates configuration and returns detailed results
 * @param {Object} config - Project configuration
 * @returns {Object} Validation results with errors, warnings, and recommendations
 */
export function validateCompatibility(config) {
  const smartCompatibility = new SmartCompatibility();
  const result = smartCompatibility.checkAndAdjust(config);

  const errors = [];
  const warnings = [];

  // Check critical incompatibilities
  const criticalErrors = validateCriticalRules(config);
  errors.push(...criticalErrors);

  // Convert smart compatibility adjustments to errors/warnings
  result.adjustments.forEach((adj) => {
    if (adj.score < 6) {
      errors.push({
        type: "incompatible",
        message: `${adj.type}: ${adj.from} → ${adj.to}`,
        suggestion: adj.reason,
        score: adj.score,
      });
    }
  });

  // Convert smart warnings
  result.warnings.forEach((warn) => {
    warnings.push({
      type: warn.type || "suboptimal",
      message: warn.message,
      suggestion: warn.suggestion,
    });
  });

  // Add high-priority recommendations as warnings
  result.recommendations
    .filter((rec) => rec.priority === "high")
    .forEach((rec) => {
      warnings.push({
        type: rec.type || "recommendation",
        message: `Consider ${rec.recommended}: ${rec.reason}`,
        suggestion: rec.current ? `Current: ${rec.current}` : undefined,
        score: rec.recommendedScore,
      });
    });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stackScore: result.stackScore,
    stackRating: result.stackRating,
    recommendations: result.recommendations,
    adjustments: result.adjustments,
    complexity: smartCompatibility.calculateProjectComplexity(config),
    modernityScore: smartCompatibility.calculateModernityScore(config),
    config: result.config,
  };
}

/**
 * Validates critical configuration rules that prevent project from working
 * @param {Object} config - Project configuration
 * @returns {Array} Critical errors
 */
function validateCriticalRules(config) {
  const errors = [];

  // Rule 1: Only one meta-framework allowed
  if (config.frontend && Array.isArray(config.frontend)) {
    const metaCount = config.frontend.filter((f) =>
      META_FRAMEWORKS.has(f),
    ).length;
    if (metaCount > 1) {
      const metas = config.frontend.filter((f) => META_FRAMEWORKS.has(f));
      errors.push({
        type: "incompatible",
        message: `Multiple meta-frameworks detected: ${metas.join(", ")}`,
        suggestion: "Choose only one meta-framework",
        critical: true,
      });
    }
  }

  // Rule 2: MongoDB requires specific ORMs
  if (config.database === DATABASE_OPTIONS.MONGODB) {
    const validORMs = [
      ORM_OPTIONS.MONGOOSE,
      ORM_OPTIONS.PRISMA,
      ORM_OPTIONS.NONE,
    ];
    if (config.orm && !validORMs.includes(config.orm)) {
      errors.push({
        type: "incompatible",
        message: `MongoDB is incompatible with ${config.orm}`,
        suggestion: "Use Mongoose or Prisma for MongoDB",
        critical: true,
      });
    }
  }

  // Rule 3: Full-stack frameworks shouldn't have separate backends
  if (config.frontend && Array.isArray(config.frontend)) {
    const hasFullstack = config.frontend.some((f) =>
      FULLSTACK_FRAMEWORKS.has(f),
    );
    if (
      hasFullstack &&
      config.backend &&
      config.backend !== BACKEND_OPTIONS.NONE
    ) {
      errors.push({
        type: "incompatible",
        message: `Full-stack framework ${config.frontend.find((f) => FULLSTACK_FRAMEWORKS.has(f))} doesn't need a separate backend`,
        suggestion: "Set backend to 'none' or remove the full-stack framework",
        critical: true,
      });
    }
  }

  // Rule 4: Auth-frontend compatibility
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE && config.frontend) {
    const authRules = COMPATIBILITY_RULES.authFrontend[config.auth];
    if (authRules) {
      const hasCompatibleFrontend = config.frontend.some((f) =>
        authRules.includes(f),
      );
      if (!hasCompatibleFrontend) {
        errors.push({
          type: "incompatible",
          message: `${config.auth} is not compatible with selected frontend(s)`,
          suggestion: `Use one of: ${authRules.join(", ")}`,
          critical: true,
        });
      }
    }
  }

  return errors;
}

// ============================================================================
// COMPATIBILITY UTILITIES
// ============================================================================

/**
 * Check if ORM is compatible with database
 * @param {string} database - Database option
 * @param {string} orm - ORM option
 * @returns {boolean}
 */
export function isORMCompatible(database, orm) {
  if (!database || !orm) return true;
  const compatibleORMs = COMPATIBILITY_RULES.databaseOrm[database] || [];
  return compatibleORMs.includes(orm);
}

/**
 * Check if frontend frameworks are compatible with each other
 * @param {Array<string>} frontends - Array of frontend options
 * @returns {boolean}
 */
export function areFrontendFrameworksCompatible(frontends) {
  if (!Array.isArray(frontends)) return true;
  const metaCount = frontends.filter((f) => META_FRAMEWORKS.has(f)).length;
  return metaCount <= 1;
}

/**
 * Get suggested ORMs for a database
 * @param {string} database - Database option
 * @returns {Array<string>}
 */
export function getSuggestedORMs(database) {
  return COMPATIBILITY_RULES.databaseOrm[database] || [];
}

/**
 * Get compatible options for a technology choice
 * @param {string} type - Technology type (orm, database, backend, auth)
 * @param {string} currentValue - Current selected value
 * @param {Object} config - Current configuration
 * @returns {Array<string>}
 */
export function getCompatibleOptions(type, currentValue, config) {
  switch (type) {
    case "orm":
      return config.database && config.database !== DATABASE_OPTIONS.NONE
        ? COMPATIBILITY_RULES.databaseOrm[config.database] ||
            Object.values(ORM_OPTIONS)
        : Object.values(ORM_OPTIONS);

    case "auth":
      if (!config.frontend || config.frontend.length === 0) {
        return Object.values(AUTH_OPTIONS);
      }

      const compatibleAuth = new Set();
      Object.entries(COMPATIBILITY_RULES.authFrontend).forEach(
        ([auth, fronts]) => {
          const isCompatible = config.frontend.every(
            (f) => f === FRONTEND_OPTIONS.NONE || fronts.includes(f),
          );
          if (isCompatible) compatibleAuth.add(auth);
        },
      );

      // Add generic auth options
      [
        AUTH_OPTIONS.JWT,
        AUTH_OPTIONS.PASSPORT,
        AUTH_OPTIONS.OAUTH,
        AUTH_OPTIONS.NONE,
      ].forEach((auth) => compatibleAuth.add(auth));

      return Array.from(compatibleAuth);

    default:
      return [];
  }
}

/**
 * Get required base frameworks for meta-frameworks
 * @param {string} frontend - Frontend framework
 * @returns {Array<string>}
 */
export function getRequiredBaseFrameworks(frontend) {
  const requirements = {
    [FRONTEND_OPTIONS.NEXTJS]: [FRONTEND_OPTIONS.REACT],
    [FRONTEND_OPTIONS.REMIX]: [FRONTEND_OPTIONS.REACT],
    [FRONTEND_OPTIONS.NUXT]: [FRONTEND_OPTIONS.VUE],
    [FRONTEND_OPTIONS.SVELTEKIT]: [FRONTEND_OPTIONS.SVELTE],
  };

  return requirements[frontend] || [];
}

// ============================================================================
// DEPENDENCY RESOLUTION
// ============================================================================

/**
 * Resolve all dependencies for a configuration
 * @param {Object} config - Project configuration
 * @returns {Object} Dependencies and devDependencies
 */
export function resolveDependencies(config) {
  const dependencies = {};
  const devDependencies = {};

  // Frontend dependencies
  if (config.frontend && Array.isArray(config.frontend)) {
    config.frontend.forEach((frontend) => {
      if (frontend !== FRONTEND_OPTIONS.NONE) {
        const deps = DEPENDENCY_CATALOG[frontend];
        if (deps) Object.assign(dependencies, deps);
      }
    });
  }

  // Backend dependencies
  if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
    const deps = DEPENDENCY_CATALOG[config.backend];
    if (deps) Object.assign(dependencies, deps);
  }

  // Database dependencies
  if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
    const deps = DEPENDENCY_CATALOG.databases[config.database];
    if (deps) Object.assign(dependencies, deps);
  }

  // ORM dependencies
  if (config.orm && config.orm !== ORM_OPTIONS.NONE) {
    const deps = DEPENDENCY_CATALOG.orms[config.orm];
    if (deps) Object.assign(dependencies, deps);
  }

  // Auth dependencies
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE) {
    const deps = DEPENDENCY_CATALOG.auth[config.auth];
    if (deps) Object.assign(dependencies, deps);
  }

  return { dependencies, devDependencies };
}

// ============================================================================
// DISPLAY UTILITIES
// ============================================================================

/**
 * Display validation results with enhanced formatting
 * @param {Object} validation - Validation result
 */
export function displayValidationResults(validation) {
  // Stack score and rating
  if (validation.stackScore && validation.stackRating) {
    const { emoji, color, rating } = validation.stackRating;
    console.log(
      chalk[color].bold(
        `\n${emoji} Stack Compatibility: ${validation.stackScore}/10 (${rating})`,
      ),
    );
  }

  // Modernity score
  if (validation.modernityScore !== undefined) {
    const modernityLabel =
      validation.modernityScore >= 8
        ? "Modern"
        : validation.modernityScore >= 6
          ? "Current"
          : "Outdated";

    const modernityColor =
      validation.modernityScore >= 8
        ? "green"
        : validation.modernityScore >= 6
          ? "yellow"
          : "red";

    console.log(
      chalk[modernityColor](
        `📅 Stack Modernity: ${validation.modernityScore}/10 (${modernityLabel})`,
      ),
    );
  }

  // Critical errors
  const criticalErrors = validation.errors.filter((e) => e.critical);
  if (criticalErrors.length > 0) {
    console.log(chalk.red.bold("\n🚨 Critical Issues:"));
    criticalErrors.forEach((error, i) => {
      console.log(chalk.red(`  ${i + 1}. ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.gray(`     💡 ${error.suggestion}`));
      }
    });
  }

  // Regular errors
  const regularErrors = validation.errors.filter((e) => !e.critical);
  if (regularErrors.length > 0) {
    console.log(chalk.red.bold("\n❌ Errors:"));
    regularErrors.forEach((error, i) => {
      console.log(chalk.red(`  ${i + 1}. ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.gray(`     💡 ${error.suggestion}`));
      }
      if (error.score !== undefined) {
        console.log(chalk.gray(`     📊 Score: ${error.score}/10`));
      }
    });
  }

  // Warnings
  if (validation.warnings.length > 0) {
    console.log(chalk.yellow.bold("\n⚠️  Warnings:"));
    validation.warnings.forEach((warning, i) => {
      console.log(chalk.yellow(`  ${i + 1}. ${warning.message}`));
      if (warning.suggestion) {
        console.log(chalk.gray(`     💡 ${warning.suggestion}`));
      }
    });
  }

  // Top recommendations
  if (validation.recommendations && validation.recommendations.length > 0) {
    const topRecs = validation.recommendations
      .filter((r) => r.priority !== "low")
      .slice(0, 3);

    if (topRecs.length > 0) {
      console.log(chalk.blue.bold("\n💡 Recommendations:"));
      topRecs.forEach((rec, i) => {
        const icon = rec.priority === "high" ? "🔥" : "📈";
        console.log(chalk.blue(`  ${i + 1}. ${icon} ${rec.reason}`));
        if (rec.current && rec.recommended) {
          console.log(chalk.gray(`     ${rec.current} → ${rec.recommended}`));
        }
      });
    }
  }

  // Success message
  if (validation.isValid && validation.warnings.length === 0) {
    console.log(chalk.green.bold("\n✅ Configuration is valid and optimized!"));
  } else if (validation.isValid) {
    console.log(chalk.green.bold("\n✅ Configuration is valid!"));
  }

  // Complexity
  if (validation.complexity !== undefined) {
    const complexityLabel =
      validation.complexity <= 3
        ? "Simple"
        : validation.complexity <= 7
          ? "Moderate"
          : "Complex";

    const complexityColor =
      validation.complexity <= 3
        ? "green"
        : validation.complexity <= 7
          ? "yellow"
          : "red";

    console.log(
      chalk[complexityColor](
        `\n🎯 Complexity: ${complexityLabel} (${validation.complexity}/10)`,
      ),
    );
  }
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Pre-configured project templates
 */
export const PRESET_CONFIGS = {
  "nextjs-app": {
    name: "Next.js Application",
    description: "Full-stack Next.js 15 with App Router, PostgreSQL, and auth",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.NEXTJS],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.BETTER_AUTH,
      packageManager: "bun",
      addons: ["typescript", "testing", "biome", "docker"],
    },
  },

  "express-api": {
    name: "Express API",
    description: "Lightweight Express REST API with PostgreSQL and JWT",
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "npm",
      addons: ["typescript", "testing", "docker", "biome"],
    },
  },

  "mern-stack": {
    name: "MERN Stack",
    description: "MongoDB + Express + React + Node.js full-stack",
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.REACT],
      database: DATABASE_OPTIONS.MONGODB,
      orm: ORM_OPTIONS.MONGOOSE,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "npm",
      addons: ["typescript", "testing", "docker", "biome"],
    },
  },

  "nestjs-api": {
    name: "NestJS API",
    description: "Enterprise NestJS API with Prisma and comprehensive testing",
    config: {
      backend: BACKEND_OPTIONS.NESTJS,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.PASSPORT,
      packageManager: "pnpm",
      addons: ["typescript", "testing", "docker", "biome"],
    },
  },

  "optimal-fullstack": {
    name: "Optimal Full-Stack",
    description: "Next.js 15 + PostgreSQL + Prisma + Better Auth - Maximum DX",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.NEXTJS],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.BETTER_AUTH,
      packageManager: "pnpm",
      addons: ["typescript", "testing", "biome", "docker"],
    },
  },

  "fastify-api": {
    name: "Fastify API",
    description: "High-performance Fastify REST API with PostgreSQL",
    config: {
      backend: BACKEND_OPTIONS.FASTIFY,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "pnpm",
      addons: ["typescript", "testing", "docker", "biome"],
    },
  },

  "minimal-api": {
    name: "Minimal API",
    description: "Lightweight Fastify API with SQLite - Perfect for prototypes",
    config: {
      backend: BACKEND_OPTIONS.FASTIFY,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.SQLITE,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "bun",
      addons: ["typescript", "testing", "biome"],
    },
  },
};

/**
 * Get and validate a preset configuration
 * @param {string} presetName - Preset identifier
 * @returns {Object|null} Enhanced preset with validation results
 */
export function getPresetConfig(presetName) {
  const preset = PRESET_CONFIGS[presetName];
  if (!preset) return null;

  const validation = validateCompatibility(preset.config);

  return {
    ...preset,
    config: validation.config,
    score: validation.stackScore,
    rating: validation.stackRating,
    validated: true,
    adjustments: validation.adjustments,
    recommendations: validation.recommendations.filter(
      (r) => r.priority !== "low",
    ),
    isValid: validation.isValid,
  };
}

/**
 * List all available presets
 * @returns {Array} Preset information
 */
export function listPresets() {
  return Object.entries(PRESET_CONFIGS).map(([key, preset]) => ({
    key,
    name: preset.name,
    description: preset.description,
  }));
}

// Legacy export for backward compatibility
export const COMPATIBILITY_MATRIX = {
  database_orm: COMPATIBILITY_RULES.databaseOrm,
  auth_frontend: COMPATIBILITY_RULES.authFrontend,
  addon_frontend: COMPATIBILITY_RULES.addonFrontend,
};

export const DEPENDENCY_VERSIONS = DEPENDENCY_CATALOG;
