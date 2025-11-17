import chalk from "chalk";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "../types.js";
import SmartCompatibility, {
  getStackRecommendations,
  calculateStackScore,
} from "./smart-compatibility.js";

/**
 * Technology compatibility matrix
 * Defines which technologies work well together
 */
export const COMPATIBILITY_MATRIX = {
  // Database-ORM compatibility
  database_orm: {
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

  // Backend-Database compatibility
  backend_database: {
    [BACKEND_OPTIONS.EXPRESS]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.FASTIFY]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.KOA]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.HAPI]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.NESTJS]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.NONE]: [DATABASE_OPTIONS.NONE],
  },

  // Frontend-Backend compatibility
  frontend_backend: {
    [FRONTEND_OPTIONS.REACT]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.VUE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.ANGULAR]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.SVELTE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.NEXTJS]: [BACKEND_OPTIONS.NONE], // Next.js is full-stack
    [FRONTEND_OPTIONS.NUXT]: [BACKEND_OPTIONS.NONE], // Nuxt is full-stack
    [FRONTEND_OPTIONS.REACT_NATIVE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.REMIX]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.ASTRO]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.SVELTEKIT]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.NONE]: Object.values(BACKEND_OPTIONS),
  },

  // Auth-Backend compatibility
  auth_backend: {
    [AUTH_OPTIONS.JWT]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.PASSPORT]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.AUTH0]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.OAUTH]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.NEXTAUTH]: [BACKEND_OPTIONS.NONE, BACKEND_OPTIONS.EXPRESS],
    [AUTH_OPTIONS.SUPABASE]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.LUCIA]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.NONE]: Object.values(BACKEND_OPTIONS),
  },

  // Auth-Frontend compatibility
  auth_frontend: {
    [AUTH_OPTIONS.NEXTAUTH]: [FRONTEND_OPTIONS.NEXTJS, FRONTEND_OPTIONS.REACT],
    [AUTH_OPTIONS.AUTH0]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.NEXTJS,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.NUXT,
      FRONTEND_OPTIONS.ANGULAR,
    ],
    [AUTH_OPTIONS.OAUTH]: Object.values(FRONTEND_OPTIONS),
    [AUTH_OPTIONS.JWT]: Object.values(FRONTEND_OPTIONS),
    [AUTH_OPTIONS.SUPABASE]: [
      FRONTEND_OPTIONS.REACT,
      FRONTEND_OPTIONS.NEXTJS,
      FRONTEND_OPTIONS.VUE,
      FRONTEND_OPTIONS.NUXT,
      FRONTEND_OPTIONS.SVELTE,
      FRONTEND_OPTIONS.SVELTEKIT,
    ],
    [AUTH_OPTIONS.LUCIA]: [FRONTEND_OPTIONS.NEXTJS, FRONTEND_OPTIONS.SVELTEKIT],
    [AUTH_OPTIONS.PASSPORT]: Object.values(FRONTEND_OPTIONS),
    [AUTH_OPTIONS.NONE]: Object.values(FRONTEND_OPTIONS),
  },

  // Addon-Frontend compatibility
  addon_frontend: {
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
 * Dependency version compatibility matrix
 * Ensures compatible package versions across the stack
 */
export const DEPENDENCY_VERSIONS = {
  // React ecosystem
  react: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
  },

  // Remix
  remix: {
    "@remix-run/node": "^2.9.0",
    "@remix-run/react": "^2.9.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },

  // Astro
  astro: {
    astro: "^4.0.0",
  },

  // SvelteKit
  sveltekit: {
    "@sveltejs/kit": "^2.0.0",
    svelte: "^4.0.0",
  },

  // Vue ecosystem
  vue: {
    vue: "^3.3.0",
    "@vitejs/plugin-vue": "^4.4.0",
  },

  // Express ecosystem
  express: {
    express: "^4.18.0",
    "@types/express": "^4.17.0",
    cors: "^2.8.5",
    helmet: "^7.0.0",
  },

  // Database drivers
  database: {
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

  // ORM packages
  orm: {
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

  // Authentication packages
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

/**
 * Enhanced technology compatibility validation using Smart Compatibility system
 * @param {Object} config - Project configuration
 * @returns {Object} - Enhanced validation result with scores and recommendations
 */
export function validateCompatibility(config) {
  // Use the enhanced smart compatibility system
  const smartCompatibility = new SmartCompatibility();
  const result = smartCompatibility.checkAndAdjust(config);

  // Convert smart compatibility results to legacy format for backward compatibility
  const errors = result.adjustments
    .filter((adj) => adj.score < 6)
    .map((adj) => ({
      type: "incompatible",
      message: `${adj.type}: ${adj.from} → ${adj.to}`,
      suggestion: adj.reason,
      score: adj.score,
    }));

  const warnings = [
    ...result.warnings.map((warn) => ({
      type: warn.type || "suboptimal",
      message: warn.message,
      suggestion: warn.suggestion,
    })),
    ...result.recommendations
      .filter((rec) => rec.priority === "high")
      .map((rec) => ({
        type: rec.type || "recommendation",
        message: `Consider ${rec.recommended}: ${rec.reason}`,
        suggestion: rec.current ? `Current: ${rec.current}` : undefined,
        score: rec.recommendedScore,
      })),
  ];

  // Add legacy compatibility checks for critical issues
  const legacyErrors = performLegacyValidation(config);
  errors.push(...legacyErrors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    // Enhanced information
    stackScore: result.stackScore,
    stackRating: result.stackRating,
    recommendations: result.recommendations,
    adjustments: result.adjustments,
    complexity: smartCompatibility.calculateProjectComplexity(config),
    modernityScore: smartCompatibility.calculateModernityScore(config),
  };
}

/**
 * Perform legacy validation for critical compatibility issues
 * @param {Object} config - Project configuration
 * @returns {Array} - Array of critical errors
 */
function performLegacyValidation(config) {
  const errors = [];

  // Prevent conflicting meta-frameworks
  const metaFrameworks = [
    FRONTEND_OPTIONS.NEXTJS,
    FRONTEND_OPTIONS.NUXT,
    FRONTEND_OPTIONS.SVELTEKIT,
    FRONTEND_OPTIONS.REMIX,
    FRONTEND_OPTIONS.ASTRO,
  ];

  if (config.frontend && config.frontend.length > 1) {
    const chosenMeta = config.frontend.filter((f) =>
      metaFrameworks.includes(f),
    );
    if (chosenMeta.length > 1) {
      errors.push({
        type: "incompatible",
        message: `Conflicting meta-frameworks selected: ${chosenMeta.join(", ")}`,
        suggestion: "Choose only one meta-framework",
        critical: true,
      });
    }
  }

  // Check for completely incompatible combinations
  if (
    config.database === DATABASE_OPTIONS.MONGODB &&
    config.orm !== ORM_OPTIONS.MONGOOSE &&
    config.orm !== ORM_OPTIONS.PRISMA &&
    config.orm !== ORM_OPTIONS.NONE
  ) {
    errors.push({
      type: "incompatible",
      message: `MongoDB requires Mongoose or Prisma ORM, not ${config.orm}`,
      suggestion: "Use Mongoose for MongoDB or switch to a SQL database",
      critical: true,
    });
  }

  return errors;
}

/**
 * Get compatible options for a given technology
 * @param {string} type - Technology type (database, orm, backend, frontend)
 * @param {string} currentValue - Current selected value
 * @param {Object} config - Current configuration
 * @returns {Array} - Compatible options
 */
export function getCompatibleOptions(type, currentValue, config) {
  switch (type) {
    case "orm":
      if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
        return COMPATIBILITY_MATRIX.database_orm[config.database] || [];
      }
      return Object.values(ORM_OPTIONS);

    case "database":
      if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
        return COMPATIBILITY_MATRIX.backend_database[config.backend] || [];
      }
      return Object.values(DATABASE_OPTIONS);

    case "backend":
      if (config.frontend && config.frontend.length > 0) {
        const compatibleBackends = new Set();
        config.frontend.forEach((frontend) => {
          COMPATIBILITY_MATRIX.frontend_backend[frontend]?.forEach(
            (backend) => {
              compatibleBackends.add(backend);
            },
          );
        });
        return Array.from(compatibleBackends);
      }
      return Object.values(BACKEND_OPTIONS);

    case "auth":
      if (config.frontend && config.frontend.length > 0) {
        const allowed = new Set();
        Object.entries(COMPATIBILITY_MATRIX.auth_frontend).forEach(
          ([auth, fronts]) => {
            const isAllowed = config.frontend.every(
              (f) => f === FRONTEND_OPTIONS.NONE || fronts.includes(f),
            );
            if (isAllowed) allowed.add(auth);
          },
        );
        return Array.from(allowed);
      }
      return Object.values(AUTH_OPTIONS);

    default:
      return [];
  }
}

// Utility: Validate ORM-Database pair
export function isORMCompatible(database, orm) {
  const list = COMPATIBILITY_MATRIX.database_orm[database] || [];
  return list.includes(orm);
}

// Utility: Prevent conflicting frontend frameworks
export function areFrontendFrameworksCompatible(frontends) {
  const meta = new Set([
    FRONTEND_OPTIONS.NEXTJS,
    FRONTEND_OPTIONS.NUXT,
    FRONTEND_OPTIONS.SVELTEKIT,
    FRONTEND_OPTIONS.REMIX,
    FRONTEND_OPTIONS.ASTRO,
  ]);
  const chosen = (frontends || []).filter((f) => meta.has(f));
  return chosen.length <= 1;
}

// Utility: Suggest ORMs by database
export function getSuggestedORMs(database) {
  return COMPATIBILITY_MATRIX.database_orm[database] || [];
}

// Utility: Required base frameworks for meta-frameworks
export function getRequiredBaseFrameworks(frontend) {
  switch (frontend) {
    case FRONTEND_OPTIONS.NEXTJS:
    case FRONTEND_OPTIONS.REMIX:
      return [FRONTEND_OPTIONS.REACT];
    case FRONTEND_OPTIONS.NUXT:
      return [FRONTEND_OPTIONS.VUE];
    case FRONTEND_OPTIONS.SVELTEKIT:
      return [FRONTEND_OPTIONS.SVELTE];
    default:
      return [];
  }
}

/**
 * Resolve dependency versions for a given configuration
 * @param {Object} config - Project configuration
 * @returns {Object} - Resolved dependencies
 */
export function resolveDependencies(config) {
  const dependencies = {};
  const devDependencies = {};

  // Add frontend dependencies
  if (config.frontend && config.frontend.length > 0) {
    config.frontend.forEach((frontend) => {
      if (frontend !== FRONTEND_OPTIONS.NONE) {
        const frontendDeps = DEPENDENCY_VERSIONS[frontend];
        if (frontendDeps) {
          Object.assign(dependencies, frontendDeps);
        }
      }
    });
  }

  // Add backend dependencies
  if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
    const backendDeps = DEPENDENCY_VERSIONS[config.backend];
    if (backendDeps) {
      Object.assign(dependencies, backendDeps);
    }
  }

  // Add database dependencies
  if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
    const dbDeps = DEPENDENCY_VERSIONS.database[config.database];
    if (dbDeps) {
      Object.assign(dependencies, dbDeps);
    }
  }

  // Add ORM dependencies
  if (config.orm && config.orm !== ORM_OPTIONS.NONE) {
    const ormDeps = DEPENDENCY_VERSIONS.orm[config.orm];
    if (ormDeps) {
      Object.assign(dependencies, ormDeps);
    }
  }

  // Add auth dependencies
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE) {
    const authDeps = DEPENDENCY_VERSIONS.auth[config.auth];
    if (authDeps) {
      Object.assign(dependencies, authDeps);
    }
  }

  return { dependencies, devDependencies };
}

/**
 * Enhanced display of validation results with smart compatibility insights
 * @param {Object} validation - Enhanced validation result
 */
export function displayValidationResults(validation) {
  // Show stack score if available
  if (validation.stackScore && validation.stackRating) {
    const rating = validation.stackRating;
    console.log(
      chalk[rating.color].bold(
        `\n${rating.emoji} Stack Compatibility: ${validation.stackScore}/10 (${rating.rating})`,
      ),
    );

    if (validation.modernityScore) {
      const modernityRating =
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
          `📅 Stack Modernity: ${validation.modernityScore}/10 (${modernityRating})`,
        ),
      );
    }
  }

  // Show critical errors first
  const criticalErrors = validation.errors.filter((e) => e.critical);
  const regularErrors = validation.errors.filter((e) => !e.critical);

  if (criticalErrors.length > 0) {
    console.log(chalk.red.bold("\n🚨 Critical Configuration Issues:"));
    criticalErrors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.gray(`     💡 ${error.suggestion}`));
      }
    });
  }

  if (regularErrors.length > 0) {
    console.log(chalk.red.bold("\n❌ Configuration Errors:"));
    regularErrors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.gray(`     💡 ${error.suggestion}`));
      }
      if (error.score) {
        console.log(
          chalk.gray(`     📊 Compatibility Score: ${error.score}/10`),
        );
      }
    });
  }

  if (validation.warnings.length > 0) {
    console.log(chalk.yellow.bold("\n⚠️  Configuration Warnings:"));
    validation.warnings.forEach((warning, index) => {
      console.log(chalk.yellow(`  ${index + 1}. ${warning.message}`));
      if (warning.suggestion) {
        console.log(chalk.gray(`     💡 ${warning.suggestion}`));
      }
      if (warning.score) {
        console.log(
          chalk.gray(`     📊 Recommended Score: ${warning.score}/10`),
        );
      }
    });
  }

  // Show top recommendations
  if (validation.recommendations && validation.recommendations.length > 0) {
    const topRecommendations = validation.recommendations
      .filter((r) => r.priority !== "low")
      .slice(0, 3);

    if (topRecommendations.length > 0) {
      console.log(chalk.blue.bold("\n💡 Top Recommendations:"));
      topRecommendations.forEach((rec, index) => {
        const priorityIcon = rec.priority === "high" ? "🔥" : "📈";
        console.log(
          chalk.blue(`  ${index + 1}. ${priorityIcon} ${rec.reason}`),
        );
        if (rec.current && rec.recommended) {
          console.log(chalk.gray(`     ${rec.current} → ${rec.recommended}`));
        }
      });
    }
  }

  if (validation.isValid && validation.warnings.length === 0) {
    console.log(chalk.green.bold("\n✅ Configuration is valid and optimized!"));
  } else if (validation.isValid) {
    console.log(chalk.green.bold("\n✅ Configuration is valid!"));
  }

  // Show complexity info
  if (validation.complexity !== undefined) {
    const complexityLevel =
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
        `\n🎯 Project Complexity: ${complexityLevel} (${validation.complexity}/10)`,
      ),
    );
  }
}

/**
 * Preset configurations for common use cases
 */
export const PRESET_CONFIGS = {
  "saas-app": {
    name: "SaaS Application",
    description: "Full-stack SaaS application with authentication",
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.REACT],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "npm",
      addons: [
        "typescript",
        "eslint",
        "prettier",
        "docker",
        "testing",
        "tailwind",
      ],
    },
  },
  "api-service": {
    name: "API Service",
    description: "RESTful API service with database",
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "docker", "testing"],
    },
  },
  "mobile-app": {
    name: "Mobile Application",
    description: "React Native mobile app with backend",
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.REACT_NATIVE],
      database: DATABASE_OPTIONS.MONGODB,
      orm: ORM_OPTIONS.MONGOOSE,
      auth: AUTH_OPTIONS.OAUTH,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier"],
    },
  },
  "fullstack-nextjs": {
    name: "Next.js Full-Stack",
    description: "Next.js application with API routes",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.NEXTJS],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.NEXTAUTH,
      packageManager: "npm",
      addons: [
        "typescript",
        "eslint",
        "prettier",
        "tailwind",
        "shadcn",
        "testing",
      ],
    },
  },
  "remix-app": {
    name: "Remix Application",
    description: "Full-stack Remix application with modern tooling",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.REMIX],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.DRIZZLE,
      auth: AUTH_OPTIONS.LUCIA,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "tailwind", "testing"],
    },
  },
  "astro-site": {
    name: "Astro Website",
    description: "Static site with Astro and modern tooling",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.ASTRO],
      database: DATABASE_OPTIONS.NONE,
      orm: ORM_OPTIONS.NONE,
      auth: AUTH_OPTIONS.NONE,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "tailwind"],
    },
  },
  "sveltekit-app": {
    name: "SvelteKit Application",
    description: "Full-stack SvelteKit application",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.SVELTEKIT],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.DRIZZLE,
      auth: AUTH_OPTIONS.LUCIA,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "tailwind", "testing"],
    },
  },
  "supabase-app": {
    name: "Supabase Application",
    description: "Full-stack app with Supabase backend",
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.REACT],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.NONE,
      auth: AUTH_OPTIONS.SUPABASE,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "tailwind", "testing"],
    },
  },
  microservice: {
    name: "Microservice",
    description: "Lightweight microservice",
    config: {
      backend: BACKEND_OPTIONS.FASTIFY,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.SQLITE,
      orm: ORM_OPTIONS.NONE,
      auth: AUTH_OPTIONS.JWT,
      packageManager: "npm",
      addons: ["typescript", "eslint", "prettier", "docker"],
    },
  },
};

/**
 * Enhanced preset configuration with smart compatibility validation
 * @param {string} presetName - Name of the preset
 * @returns {Object|null} - Enhanced preset configuration or null if not found
 */
export function getPresetConfig(presetName) {
  const preset = PRESET_CONFIGS[presetName];
  if (!preset) return null;

  // Validate and enhance preset with smart compatibility
  const smartCompatibility = new SmartCompatibility();
  const validationResult = smartCompatibility.checkAndAdjust({
    ...preset.config,
  });

  return {
    ...preset,
    config: validationResult.config,
    score: validationResult.stackScore,
    rating: validationResult.stackRating,
    validated: true,
    adjustments: validationResult.adjustments,
    recommendations: validationResult.recommendations.filter(
      (r) => r.priority !== "low",
    ),
  };
}

/**
 * List all available presets
 * @returns {Array} - Array of preset information
 */
export function listPresets() {
  return Object.entries(PRESET_CONFIGS).map(([key, preset]) => ({
    key,
    name: preset.name,
    description: preset.description,
  }));
}
