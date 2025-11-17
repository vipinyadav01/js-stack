import chalk from "chalk";
import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

// ============================================================================
// COMPATIBILITY SCORING MATRICES
// ============================================================================

/**
 * Database-ORM compatibility scores (0-10)
 * Higher scores indicate better performance, DX, and ecosystem fit
 */
const DB_ORM_SCORES = {
  [TECHNOLOGY_OPTIONS.DATABASE.MONGODB]: {
    [TECHNOLOGY_OPTIONS.ORM.MONGOOSE]: {
      score: 10,
      reason: "Native MongoDB driver with excellent TypeScript support",
    },
    [TECHNOLOGY_OPTIONS.ORM.PRISMA]: {
      score: 8,
      reason: "Good MongoDB support but better with SQL databases",
    },
  },
  [TECHNOLOGY_OPTIONS.DATABASE.POSTGRES]: {
    [TECHNOLOGY_OPTIONS.ORM.PRISMA]: {
      score: 10,
      reason: "Industry standard for PostgreSQL with excellent DX",
    },
    [TECHNOLOGY_OPTIONS.ORM.DRIZZLE]: {
      score: 9,
      reason: "Type-safe and performant, great for complex queries",
    },
    [TECHNOLOGY_OPTIONS.ORM.TYPEORM]: {
      score: 7,
      reason: "Mature but verbose, good for enterprise",
    },
    [TECHNOLOGY_OPTIONS.ORM.SEQUELIZE]: {
      score: 6,
      reason: "Older but stable, lacks modern TypeScript support",
    },
  },
  [TECHNOLOGY_OPTIONS.DATABASE.MYSQL]: {
    [TECHNOLOGY_OPTIONS.ORM.PRISMA]: {
      score: 9,
      reason: "Excellent MySQL support with modern features",
    },
    [TECHNOLOGY_OPTIONS.ORM.DRIZZLE]: {
      score: 8,
      reason: "Great performance and type safety",
    },
    [TECHNOLOGY_OPTIONS.ORM.TYPEORM]: {
      score: 7,
      reason: "Good MySQL support, enterprise ready",
    },
    [TECHNOLOGY_OPTIONS.ORM.SEQUELIZE]: {
      score: 6,
      reason: "Stable but dated API",
    },
  },
  [TECHNOLOGY_OPTIONS.DATABASE.SQLITE]: {
    [TECHNOLOGY_OPTIONS.ORM.PRISMA]: {
      score: 9,
      reason: "Perfect for development and small apps",
    },
    [TECHNOLOGY_OPTIONS.ORM.DRIZZLE]: {
      score: 8,
      reason: "Lightweight and fast",
    },
    [TECHNOLOGY_OPTIONS.ORM.TYPEORM]: {
      score: 6,
      reason: "Overkill for SQLite use cases",
    },
  },
  [TECHNOLOGY_OPTIONS.DATABASE.SUPABASE]: {
    [TECHNOLOGY_OPTIONS.ORM.PRISMA]: {
      score: 9,
      reason: "Supabase + Prisma is a popular modern stack",
    },
    [TECHNOLOGY_OPTIONS.ORM.DRIZZLE]: {
      score: 8,
      reason: "Great for Supabase edge functions",
    },
  },
};

/**
 * Frontend-Backend compatibility scores (0-10)
 */
const FRONTEND_BACKEND_SCORES = {
  [TECHNOLOGY_OPTIONS.FRONTEND.REACT]: {
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 9,
      reason: "Most popular full-stack combination",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.FASTIFY]: {
      score: 8,
      reason: "High performance alternative to Express",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.NESTJS]: {
      score: 8,
      reason: "Great for large React applications",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.TRPC]: {
      score: 9,
      reason: "End-to-end type safety with React",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS]: {
    [TECHNOLOGY_OPTIONS.BACKEND.NONE]: {
      score: 10,
      reason: "Next.js API routes provide full-stack capabilities",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 6,
      reason: "Redundant - Next.js has built-in API routes",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.TRPC]: {
      score: 9,
      reason: "Excellent for complex Next.js apps",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.VUE]: {
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 8,
      reason: "Solid combination for Vue apps",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.FASTIFY]: {
      score: 8,
      reason: "Fast and Vue-friendly",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.NESTJS]: {
      score: 7,
      reason: "Good for enterprise Vue applications",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.NUXT]: {
    [TECHNOLOGY_OPTIONS.BACKEND.NONE]: {
      score: 10,
      reason: "Nuxt provides full-stack capabilities",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 5,
      reason: "Usually unnecessary with Nuxt",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.SVELTE]: {
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 8,
      reason: "Great for Svelte applications",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.FASTIFY]: {
      score: 9,
      reason: "Both are performance-focused",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT]: {
    [TECHNOLOGY_OPTIONS.BACKEND.NONE]: {
      score: 10,
      reason: "SvelteKit is full-stack by design",
    },
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.REACT_NATIVE]: {
    [TECHNOLOGY_OPTIONS.BACKEND.EXPRESS]: {
      score: 8,
      reason: "Popular for mobile backends",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.FASTIFY]: {
      score: 9,
      reason: "Fast APIs for mobile apps",
    },
    [TECHNOLOGY_OPTIONS.BACKEND.NESTJS]: {
      score: 8,
      reason: "Enterprise mobile backends",
    },
  },
};

/**
 * Auth-Frontend compatibility scores (0-10)
 */
const AUTH_FRONTEND_SCORES = {
  [TECHNOLOGY_OPTIONS.AUTH.NEXTAUTH]: {
    [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS]: {
      score: 10,
      reason: "Built specifically for Next.js",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.REACT]: {
      score: 7,
      reason: "Can work but NextAuth is Next.js focused",
    },
  },
  [TECHNOLOGY_OPTIONS.AUTH.LUCIA]: {
    [TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT]: {
      score: 10,
      reason: "Created by SvelteKit team",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS]: {
      score: 8,
      reason: "Good Next.js support",
    },
  },
  [TECHNOLOGY_OPTIONS.AUTH.SUPABASE]: {
    [TECHNOLOGY_OPTIONS.FRONTEND.REACT]: {
      score: 9,
      reason: "Excellent React integration",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS]: {
      score: 9,
      reason: "Great for Next.js apps",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.VUE]: {
      score: 8,
      reason: "Good Vue.js support",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.SVELTE]: {
      score: 8,
      reason: "Solid Svelte integration",
    },
  },
  [TECHNOLOGY_OPTIONS.AUTH.AUTH0]: {
    [TECHNOLOGY_OPTIONS.FRONTEND.REACT]: {
      score: 9,
      reason: "Comprehensive React SDK",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.VUE]: {
      score: 8,
      reason: "Good Vue integration",
    },
    [TECHNOLOGY_OPTIONS.FRONTEND.ANGULAR]: {
      score: 9,
      reason: "Enterprise Angular support",
    },
  },
};

/**
 * Full-stack frameworks that don't need separate backends
 */
const FULLSTACK_FRAMEWORKS = new Set([
  TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS,
  TECHNOLOGY_OPTIONS.FRONTEND.NUXT,
  TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT,
]);

/**
 * Modern frameworks for recommendations
 */
const MODERN_FRAMEWORKS = {
  frontend: [
    TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS,
    TECHNOLOGY_OPTIONS.FRONTEND.REMIX,
    TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT,
  ],
  veryModern: [TECHNOLOGY_OPTIONS.FRONTEND.ASTRO],
  backend: [
    TECHNOLOGY_OPTIONS.BACKEND.FASTIFY,
    TECHNOLOGY_OPTIONS.BACKEND.TRPC,
    TECHNOLOGY_OPTIONS.BACKEND.HONO,
  ],
  orm: [TECHNOLOGY_OPTIONS.ORM.PRISMA, TECHNOLOGY_OPTIONS.ORM.DRIZZLE],
  database: [
    TECHNOLOGY_OPTIONS.DATABASE.SUPABASE,
    TECHNOLOGY_OPTIONS.DATABASE.PLANETSCALE,
  ],
  addons: [
    TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
    TECHNOLOGY_OPTIONS.ADDON.BIOME,
    TECHNOLOGY_OPTIONS.ADDON.VITEST,
    TECHNOLOGY_OPTIONS.ADDON.PLAYWRIGHT,
  ],
};

// ============================================================================
// SMART COMPATIBILITY CLASS
// ============================================================================

export class SmartCompatibility {
  constructor() {
    this.reset();
  }

  /**
   * Reset internal state
   */
  reset() {
    this.adjustments = [];
    this.warnings = [];
    this.recommendations = [];
    this.stackScore = 0;
  }

  /**
   * Check and auto-adjust configuration with comprehensive validation
   * @param {Object} config - Project configuration
   * @returns {Object} Enhanced validation result
   */
  checkAndAdjust(config) {
    this.reset();

    // Core compatibility validations
    this.validateDatabaseORM(config);
    this.validateFrontendBackend(config);
    this.validateAuth(config);

    // Enhancement recommendations
    this.recommendTypeScript(config);
    this.recommendPackageManager(config);
    this.recommendPerformanceTools(config);
    this.recommendModernAlternatives(config);

    // Calculate overall score
    this.stackScore = this.calculateScore(config);

    return {
      config,
      adjustments: this.adjustments,
      warnings: this.warnings,
      recommendations: this.recommendations,
      stackScore: this.stackScore,
      stackRating: this.getRating(this.stackScore),
      hasAdjustments: this.adjustments.length > 0,
      hasWarnings: this.warnings.length > 0,
      hasRecommendations: this.recommendations.length > 0,
    };
  }

  // ==========================================================================
  // VALIDATION METHODS
  // ==========================================================================

  /**
   * Validate Database-ORM compatibility
   */
  validateDatabaseORM(config) {
    const { DATABASE, ORM } = TECHNOLOGY_OPTIONS;

    if (config.database === DATABASE.NONE || config.orm === ORM.NONE) return;

    const dbMatrix = DB_ORM_SCORES[config.database];
    if (!dbMatrix) {
      this.warnings.push({
        type: "database",
        message: `Unknown database: ${config.database}`,
        suggestion: "Use a supported database option",
      });
      return;
    }

    const compatibility = dbMatrix[config.orm];

    if (!compatibility) {
      // Find best ORM for this database
      const [bestORM, bestData] = this.findBestOption(dbMatrix);

      this.adjustments.push({
        type: "orm",
        from: config.orm,
        to: bestORM,
        reason: `${config.database} is not compatible with ${config.orm}. ${bestData.reason}`,
        score: bestData.score,
      });
      config.orm = bestORM;
    } else if (compatibility.score < 8) {
      // Suggest better alternatives
      const betterOptions = this.findBetterOptions(
        dbMatrix,
        compatibility.score,
      );

      if (betterOptions.length > 0) {
        const [bestORM, bestData] = betterOptions[0];
        this.recommendations.push({
          type: "orm",
          priority: "medium",
          current: config.orm,
          recommended: bestORM,
          reason: `Consider ${bestORM} for better performance: ${bestData.reason}`,
          currentScore: compatibility.score,
          recommendedScore: bestData.score,
        });
      }
    }
  }

  /**
   * Validate Frontend-Backend compatibility
   */
  validateFrontendBackend(config) {
    const { FRONTEND, BACKEND } = TECHNOLOGY_OPTIONS;

    if (!config.frontend || config.frontend.length === 0) return;

    for (const frontend of config.frontend) {
      if (frontend === FRONTEND.NONE) continue;

      // Check if full-stack framework
      if (FULLSTACK_FRAMEWORKS.has(frontend)) {
        if (
          config.backend !== BACKEND.NONE &&
          config.backend !== BACKEND.TRPC
        ) {
          this.adjustments.push({
            type: "backend",
            from: config.backend,
            to: BACKEND.NONE,
            reason: `${frontend} provides full-stack capabilities with built-in server routes`,
            score: 10,
          });
          config.backend = BACKEND.NONE;
        }
        continue;
      }

      // Validate compatibility for non-fullstack frameworks
      const frontendMatrix = FRONTEND_BACKEND_SCORES[frontend];
      if (!frontendMatrix) continue;

      const compatibility = frontendMatrix[config.backend];

      if (!compatibility) {
        const [bestBackend, bestData] = this.findBestOption(frontendMatrix);

        this.recommendations.push({
          type: "backend",
          priority: "medium",
          frontend,
          current: config.backend,
          recommended: bestBackend,
          reason: bestData.reason,
          score: bestData.score,
        });
      } else if (compatibility.score < 7) {
        const betterOptions = this.findBetterOptions(
          frontendMatrix,
          compatibility.score,
        );

        if (betterOptions.length > 0) {
          const [bestBackend, bestData] = betterOptions[0];
          this.recommendations.push({
            type: "backend",
            priority: "low",
            frontend,
            current: config.backend,
            recommended: bestBackend,
            reason: `Better option: ${bestData.reason}`,
            currentScore: compatibility.score,
            recommendedScore: bestData.score,
          });
        }
      }
    }
  }

  /**
   * Validate Auth-Frontend compatibility
   */
  validateAuth(config) {
    const { AUTH, FRONTEND } = TECHNOLOGY_OPTIONS;

    if (
      config.auth === AUTH.NONE ||
      !config.frontend ||
      config.frontend.length === 0
    ) {
      return;
    }

    const authMatrix = AUTH_FRONTEND_SCORES[config.auth];
    if (!authMatrix) return;

    for (const frontend of config.frontend) {
      if (frontend === FRONTEND.NONE) continue;

      if (!authMatrix[frontend]) {
        this.warnings.push({
          type: "auth",
          message: `${config.auth} may not be fully compatible with ${frontend}`,
          suggestion: `Consider using an auth option that supports ${frontend}`,
        });
      }
    }
  }

  // ==========================================================================
  // RECOMMENDATION METHODS
  // ==========================================================================

  /**
   * Recommend TypeScript for modern stacks
   */
  recommendTypeScript(config) {
    const { ADDON, BACKEND } = TECHNOLOGY_OPTIONS;

    const hasTypeScript = config.addons?.includes(ADDON.TYPESCRIPT);

    // TypeScript required for NestJS
    if (config.backend === BACKEND.NESTJS && !hasTypeScript) {
      this.adjustments.push({
        type: "addon",
        from: "not included",
        to: ADDON.TYPESCRIPT,
        reason: "NestJS requires TypeScript",
      });
      if (!config.addons) config.addons = [];
      config.addons.push(ADDON.TYPESCRIPT);
      return;
    }

    // TypeScript recommended for modern frameworks
    const hasModernFramework = config.frontend?.some((f) =>
      MODERN_FRAMEWORKS.frontend.includes(f),
    );

    if (hasModernFramework && !hasTypeScript) {
      this.warnings.push({
        type: "addon",
        message: "TypeScript is highly recommended for modern frameworks",
        suggestion:
          "Add TypeScript for better development experience and type safety",
      });
    }
  }

  /**
   * Recommend optimal package manager
   */
  recommendPackageManager(config) {
    const { PACKAGE_MANAGER } = TECHNOLOGY_OPTIONS;

    const complexity = this.calculateComplexityLevel(config);
    const isNpm = config.packageManager === PACKAGE_MANAGER.NPM;

    if (complexity === "complex" && isNpm) {
      this.warnings.push({
        type: "packageManager",
        message:
          "For complex projects with multiple packages, pnpm is recommended",
        suggestion: "Consider using pnpm for better performance and disk usage",
      });
    } else if (complexity === "simple" && isNpm) {
      this.recommendations.push({
        type: "performance",
        priority: "low",
        message: "For simple projects, bun offers faster installation",
        suggestion: "Consider using bun for faster development cycles",
      });
    }
  }

  /**
   * Recommend performance and quality tools
   */
  recommendPerformanceTools(config) {
    const { ADDON } = TECHNOLOGY_OPTIONS;

    if (!config.frontend || config.frontend.length === 0) return;

    const hasLinter = config.addons?.some(
      (a) => a === ADDON.BIOME || a === ADDON.ESLINT,
    );

    if (!hasLinter) {
      this.recommendations.push({
        type: "performance",
        priority: "medium",
        message: "Code linting helps maintain code quality",
        suggestion: "Add ESLint or Biome for code analysis",
        impact: "Code Quality",
      });
    }
  }

  /**
   * Recommend modern alternatives
   */
  recommendModernAlternatives(config) {
    const { DATABASE, ORM, BACKEND, FRONTEND } = TECHNOLOGY_OPTIONS;

    // Database modernization
    if (config.database === DATABASE.MYSQL) {
      this.recommendations.push({
        type: "modernization",
        priority: "low",
        message: "PostgreSQL offers more advanced features than MySQL",
        suggestion:
          "Consider PostgreSQL for better JSON support and advanced features",
        impact: "Features",
      });
    }

    // ORM modernization
    if (config.orm === ORM.SEQUELIZE) {
      this.recommendations.push({
        type: "modernization",
        priority: "medium",
        message:
          "Prisma offers better TypeScript support and developer experience",
        suggestion: "Consider upgrading to Prisma for modern ORM features",
        impact: "Developer Experience",
      });
    }

    // Architecture simplification
    if (
      config.backend === BACKEND.EXPRESS &&
      config.frontend?.includes(FRONTEND.NEXTJS)
    ) {
      this.recommendations.push({
        type: "architecture",
        priority: "high",
        message: "Next.js includes built-in API routes",
        suggestion:
          "Consider removing separate backend and using Next.js API routes",
        impact: "Architecture Simplification",
      });
    }
  }

  // ==========================================================================
  // SCORING AND ANALYSIS
  // ==========================================================================

  /**
   * Calculate overall stack score (0-100)
   */
  calculateScore(config) {
    let score = 100;

    // Deduct for issues
    score -= this.adjustments.length * 15;
    score -= this.warnings.length * 5;

    // Bonus for optimal combinations
    score += this.calculateCompatibilityBonus(config);

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate bonus points for good tech choices
   */
  calculateCompatibilityBonus(config) {
    let bonus = 0;

    // Database-ORM bonus
    if (config.database && config.orm) {
      const dbMatrix = DB_ORM_SCORES[config.database];
      const compatibility = dbMatrix?.[config.orm];
      if (compatibility && compatibility.score >= 8) {
        bonus += compatibility.score - 7;
      }
    }

    // Frontend-Backend bonus
    if (config.frontend?.[0] && config.backend) {
      const frontendMatrix = FRONTEND_BACKEND_SCORES[config.frontend[0]];
      const compatibility = frontendMatrix?.[config.backend];
      if (compatibility && compatibility.score >= 8) {
        bonus += compatibility.score - 7;
      }
    }

    return bonus;
  }

  /**
   * Get rating based on score
   */
  getRating(score) {
    if (score >= 90) {
      return {
        rating: "Excellent",
        emoji: "🌟",
        color: "green",
        description: "Outstanding stack configuration",
      };
    }
    if (score >= 80) {
      return {
        rating: "Great",
        emoji: "✨",
        color: "cyan",
        description: "Well-optimized stack",
      };
    }
    if (score >= 70) {
      return {
        rating: "Good",
        emoji: "👍",
        color: "yellow",
        description: "Solid stack with minor improvements possible",
      };
    }
    if (score >= 60) {
      return {
        rating: "Fair",
        emoji: "⚠️",
        color: "magenta",
        description: "Decent stack but has optimization opportunities",
      };
    }
    return {
      rating: "Poor",
      emoji: "❌",
      color: "red",
      description: "Stack needs significant improvements",
    };
  }

  /**
   * Calculate project complexity level
   */
  calculateComplexityLevel(config) {
    let points = 0;

    // Count technologies
    if (config.frontend?.length) {
      points += config.frontend.length;
      if (config.frontend.length > 1) points += 2;
    }
    if (config.backend && config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      points += 2;
    }
    if (
      config.database &&
      config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE
    ) {
      points += 2;
    }
    if (config.orm && config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
      points += 1;
    }
    if (config.auth && config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) {
      points += 1;
    }
    if (config.addons?.length) {
      points += Math.min(config.addons.length, 5);
    }

    return points >= 10 ? "complex" : points >= 5 ? "moderate" : "simple";
  }

  /**
   * Calculate project complexity score (0-10)
   */
  calculateProjectComplexity(config) {
    const level = this.calculateComplexityLevel(config);
    return level === "complex" ? 8 : level === "moderate" ? 5 : 2;
  }

  /**
   * Calculate how modern the stack is (0-10)
   */
  calculateModernityScore(config) {
    let modernPoints = 0;
    let totalPoints = 0;

    // Frontend modernity
    if (config.frontend?.length) {
      totalPoints += config.frontend.length * 2;
      config.frontend.forEach((f) => {
        if (MODERN_FRAMEWORKS.veryModern.includes(f)) modernPoints += 3;
        else if (MODERN_FRAMEWORKS.frontend.includes(f)) modernPoints += 2;
        else if (
          f === TECHNOLOGY_OPTIONS.FRONTEND.REACT ||
          f === TECHNOLOGY_OPTIONS.FRONTEND.VUE
        ) {
          modernPoints += 1;
        }
      });
    }

    // Backend modernity
    if (config.backend && config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      totalPoints += 2;
      if (MODERN_FRAMEWORKS.backend.includes(config.backend)) {
        modernPoints += 2;
      } else if (config.backend === TECHNOLOGY_OPTIONS.BACKEND.EXPRESS) {
        modernPoints += 1;
      }
    }

    // ORM modernity
    if (config.orm && config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
      totalPoints += 2;
      if (MODERN_FRAMEWORKS.orm.includes(config.orm)) {
        modernPoints += 2;
      } else if (config.orm === TECHNOLOGY_OPTIONS.ORM.TYPEORM) {
        modernPoints += 1;
      }
    }

    // Database modernity
    if (
      config.database &&
      config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE
    ) {
      totalPoints += 1;
      if (MODERN_FRAMEWORKS.database.includes(config.database)) {
        modernPoints += 1;
      }
    }

    // Addon modernity
    if (config.addons?.length) {
      const modernCount = config.addons.filter((a) =>
        MODERN_FRAMEWORKS.addons.includes(a),
      ).length;
      modernPoints += modernCount;
      totalPoints += Math.min(config.addons.length, 4);
    }

    return totalPoints > 0 ? Math.round((modernPoints / totalPoints) * 10) : 5;
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Find the best option from a scoring matrix
   */
  findBestOption(matrix) {
    return Object.entries(matrix).sort(([, a], [, b]) => b.score - a.score)[0];
  }

  /**
   * Find better options than current score
   */
  findBetterOptions(matrix, currentScore) {
    return Object.entries(matrix)
      .filter(([, data]) => data.score > currentScore)
      .sort(([, a], [, b]) => b.score - a.score);
  }

  /**
   * Display results to console
   */
  displayResults(result) {
    if (result.hasAdjustments) {
      console.log(chalk.yellow.bold("\n🔧 Smart Compatibility Adjustments:"));
      result.adjustments.forEach((adj) => {
        console.log(chalk.yellow(`  • ${adj.type}: ${adj.from} → ${adj.to}`));
        console.log(chalk.gray(`    ${adj.reason}`));
      });
    }

    if (result.hasWarnings) {
      console.log(chalk.blue.bold("\n💡 Recommendations:"));
      result.warnings.forEach((warn) => {
        console.log(chalk.blue(`  • ${warn.type}: ${warn.message}`));
        if (warn.suggestion) {
          console.log(chalk.gray(`    ${warn.suggestion}`));
        }
      });
    }

    if (result.hasAdjustments || result.hasWarnings) {
      console.log();
    }
  }

  /**
   * Get compatibility summary
   */
  getCompatibilitySummary(config) {
    const result = this.checkAndAdjust(config);

    return {
      score: result.stackScore,
      rating: result.stackRating.rating,
      hasIssues: result.hasAdjustments || result.hasWarnings,
      recommendations: result.recommendations.length,
      adjustments: result.adjustments.length,
      warnings: result.warnings.length,
      complexity: this.calculateProjectComplexity(config),
      modernityScore: this.calculateModernityScore(config),
    };
  }
}

// ============================================================================
// USE CASE PRESETS
// ============================================================================

/**
 * Optimal stacks for common use cases
 */
const USE_CASE_STACKS = {
  saas: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS],
    auth: TECHNOLOGY_OPTIONS.AUTH.NEXTAUTH,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
    ],
  },
  api: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.FASTIFY,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NONE],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM,
    addons: [TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT],
  },
  mobile: {
    database: TECHNOLOGY_OPTIONS.DATABASE.SUPABASE,
    orm: TECHNOLOGY_OPTIONS.ORM.NONE,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT_NATIVE],
    auth: TECHNOLOGY_OPTIONS.AUTH.SUPABASE,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM,
    addons: [TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT],
  },
  blog: {
    database: TECHNOLOGY_OPTIONS.DATABASE.NONE,
    orm: TECHNOLOGY_OPTIONS.ORM.NONE,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.ASTRO],
    auth: TECHNOLOGY_OPTIONS.AUTH.NONE,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.BUN,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
    ],
  },
  ecommerce: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS],
    auth: TECHNOLOGY_OPTIONS.AUTH.NEXTAUTH,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
      TECHNOLOGY_OPTIONS.ADDON.TESTING,
    ],
  },
};

// ============================================================================
// EXPORTED UTILITY FUNCTIONS
// ============================================================================

/**
 * Get stack recommendations for a configuration
 */
export function getStackRecommendations(config) {
  const compatibility = new SmartCompatibility();
  return compatibility.checkAndAdjust(config);
}

/**
 * Calculate stack score for a configuration
 */
export function calculateStackScore(config) {
  const compatibility = new SmartCompatibility();
  return compatibility.getCompatibilitySummary(config);
}

/**
 * Get optimal stack for a use case
 */
export function getBestStackForUseCase(useCase) {
  return USE_CASE_STACKS[useCase] || USE_CASE_STACKS.saas;
}

export default SmartCompatibility;
