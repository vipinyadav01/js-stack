import chalk from "chalk";
import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

/**
 * Enhanced Smart compatibility checker with comprehensive stack recommendations
 * Determines optimal technology combinations based on real-world best practices
 */
export class SmartCompatibility {
  constructor() {
    this.adjustments = [];
    this.warnings = [];
    this.recommendations = [];
    this.stackScore = 0;

    // Comprehensive compatibility matrix with performance and popularity scores
    this.compatibilityMatrix = {
      // Database-ORM compatibility with performance scores (1-10)
      databaseORM: {
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
      },

      // Frontend-Backend compatibility with use case scores
      frontendBackend: {
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
      },

      // Auth-Frontend compatibility
      authFrontend: {
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
      },

      // Package Manager recommendations by project complexity
      packageManagerRecommendations: {
        simple: {
          // 1 frontend, basic backend, few addons
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.BUN]: {
            score: 9,
            reason: "Fastest for simple projects",
          },
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM]: {
            score: 8,
            reason: "Most compatible",
          },
        },
        moderate: {
          // Multiple technologies, some addons
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM]: {
            score: 9,
            reason: "Better dependency management",
          },
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.YARN]: {
            score: 8,
            reason: "Good workspace support",
          },
        },
        complex: {
          // Monorepo, many addons, enterprise
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM]: {
            score: 10,
            reason: "Best for monorepos and complex projects",
          },
          [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.YARN]: {
            score: 8,
            reason: "Mature workspace support",
          },
        },
      },
    };
  }

  /**
   * Check and auto-adjust incompatible choices with comprehensive scoring
   * @param {Object} config - Project configuration
   * @returns {Object} - Enhanced configuration with scores and recommendations
   */
  checkAndAdjust(config) {
    this.adjustments = [];
    this.warnings = [];
    this.recommendations = [];
    this.stackScore = 0;

    // Core compatibility checks
    this.checkDatabaseORMCompatibility(config);
    this.checkFrontendBackendCompatibility(config);
    this.checkAuthCompatibility(config);

    // Smart recommendations
    this.checkTypeScriptRecommendations(config);
    this.checkPackageManagerOptimizations(config);
    this.checkPerformanceOptimizations(config);
    this.checkModernAlternatives(config);

    // Calculate overall stack score
    this.calculateStackScore(config);

    return {
      config,
      adjustments: this.adjustments,
      warnings: this.warnings,
      recommendations: this.recommendations,
      stackScore: this.stackScore,
      stackRating: this.getStackRating(this.stackScore),
      hasAdjustments: this.adjustments.length > 0,
      hasWarnings: this.warnings.length > 0,
      hasRecommendations: this.recommendations.length > 0,
    };
  }

  /**
   * Calculate overall stack score
   */
  calculateStackScore(config) {
    let score = 100;

    // Deduct points for adjustments (major issues)
    score -= this.adjustments.length * 15;

    // Deduct points for warnings
    score -= this.warnings.length * 5;

    // Bonus points for recommended combinations
    // Database-ORM bonus
    if (config.database && config.orm) {
      const dbORMMatrix = this.compatibilityMatrix.databaseORM[config.database];
      if (dbORMMatrix && dbORMMatrix[config.orm]) {
        score += Math.max(0, dbORMMatrix[config.orm].score - 7);
      }
    }

    // Frontend-Backend bonus
    if (config.frontend && config.backend) {
      const frontendBackendMatrix =
        this.compatibilityMatrix.frontendBackend[config.frontend[0]];
      if (frontendBackendMatrix && frontendBackendMatrix[config.backend]) {
        score += Math.max(0, frontendBackendMatrix[config.backend].score - 7);
      }
    }

    this.stackScore = Math.max(0, Math.min(100, score));
  }

  /**
   * Get stack rating based on score
   */
  getStackRating(score) {
    if (score >= 90)
      return {
        rating: "Excellent",
        color: "green",
        description: "Outstanding stack configuration",
      };
    if (score >= 80)
      return {
        rating: "Great",
        color: "cyan",
        description: "Well-optimized stack",
      };
    if (score >= 70)
      return {
        rating: "Good",
        color: "yellow",
        description: "Solid stack with minor improvements possible",
      };
    if (score >= 60)
      return {
        rating: "Fair",
        color: "orange",
        description: "Decent stack but has optimization opportunities",
      };
    return {
      rating: "Poor",
      color: "red",
      description: "Stack needs significant improvements",
    };
  }

  /**
   * Enhanced database-ORM compatibility check with scoring
   */
  checkDatabaseORMCompatibility(config) {
    const { DATABASE, ORM } = TECHNOLOGY_OPTIONS;

    if (config.database === DATABASE.NONE || config.orm === ORM.NONE) return;

    const dbORMMatrix = this.compatibilityMatrix.databaseORM[config.database];

    if (!dbORMMatrix) {
      this.warnings.push({
        type: "database",
        message: `Unknown database: ${config.database}`,
        suggestion: "Use a supported database option",
      });
      return;
    }

    const ormCompatibility = dbORMMatrix[config.orm];

    if (!ormCompatibility) {
      // Find the best alternative
      const bestORM = Object.entries(dbORMMatrix).sort(
        ([, a], [, b]) => b.score - a.score,
      )[0];

      this.adjustments.push({
        type: "orm",
        from: config.orm,
        to: bestORM[0],
        reason: `${config.database} is not compatible with ${config.orm}. ${bestORM[1].reason}`,
        score: bestORM[1].score,
      });
      config.orm = bestORM[0];
    } else {
      // Check if there's a better option
      const betterOptions = Object.entries(dbORMMatrix)
        .filter(([orm, data]) => data.score > ormCompatibility.score)
        .sort(([, a], [, b]) => b.score - a.score);

      if (betterOptions.length > 0 && ormCompatibility.score < 8) {
        this.recommendations.push({
          type: "orm",
          current: config.orm,
          recommended: betterOptions[0][0],
          reason: `Consider ${betterOptions[0][0]} for better performance: ${betterOptions[0][1].reason}`,
          currentScore: ormCompatibility.score,
          recommendedScore: betterOptions[0][1].score,
        });
      }
    }
  }

  /**
   * Enhanced frontend-backend compatibility with detailed scoring
   */
  checkFrontendBackendCompatibility(config) {
    const { FRONTEND, BACKEND } = TECHNOLOGY_OPTIONS;

    if (!config.frontend || config.frontend.length === 0) return;

    for (const frontend of config.frontend) {
      if (frontend === FRONTEND.NONE) continue;

      const frontendBackendMatrix =
        this.compatibilityMatrix.frontendBackend[frontend];

      if (!frontendBackendMatrix) continue;

      const backendCompatibility = frontendBackendMatrix[config.backend];

      if (!backendCompatibility) {
        // Find best backend for this frontend
        const bestBackend = Object.entries(frontendBackendMatrix).sort(
          ([, a], [, b]) => b.score - a.score,
        )[0];

        this.recommendations.push({
          type: "backend",
          frontend: frontend,
          current: config.backend,
          recommended: bestBackend[0],
          reason: bestBackend[1].reason,
          score: bestBackend[1].score,
        });
      } else if (backendCompatibility.score < 7) {
        // Suggest better alternatives
        const betterOptions = Object.entries(frontendBackendMatrix)
          .filter(([backend, data]) => data.score > backendCompatibility.score)
          .sort(([, a], [, b]) => b.score - a.score);

        if (betterOptions.length > 0) {
          this.recommendations.push({
            type: "backend",
            frontend: frontend,
            current: config.backend,
            recommended: betterOptions[0][0],
            reason: `Better option: ${betterOptions[0][1].reason}`,
            currentScore: backendCompatibility.score,
            recommendedScore: betterOptions[0][1].score,
          });
        }
      }

      // Specific framework warnings
      if (
        frontend === FRONTEND.NEXTJS &&
        config.backend !== BACKEND.NONE &&
        config.backend !== BACKEND.TRPC
      ) {
        this.adjustments.push({
          type: "backend",
          from: config.backend,
          to: BACKEND.NONE,
          reason: "Next.js provides full-stack capabilities with API routes",
          score: 10,
        });
        config.backend = BACKEND.NONE;
      }

      if (
        (frontend === FRONTEND.NUXT || frontend === FRONTEND.SVELTEKIT) &&
        config.backend !== BACKEND.NONE
      ) {
        this.adjustments.push({
          type: "backend",
          from: config.backend,
          to: BACKEND.NONE,
          reason: `${frontend} is a full-stack framework with built-in server capabilities`,
          score: 10,
        });
        config.backend = BACKEND.NONE;
      }
    }
  }

  /**
   * Check authentication compatibility with selected frontends
   */
  checkAuthCompatibility(config) {
    if (
      config.auth === TECHNOLOGY_OPTIONS.AUTH.NONE ||
      !config.frontend ||
      config.frontend.length === 0
    )
      return;

    const authMatrix = this.compatibilityMatrix.authFrontend[config.auth];

    if (!authMatrix) return;

    for (const frontendTech of config.frontend) {
      if (frontendTech === TECHNOLOGY_OPTIONS.FRONTEND.NONE) continue;

      // If there's no entry for this frontend under the chosen auth option, mark as a warning
      if (!authMatrix[frontendTech]) {
        this.warnings.push({
          type: "auth",
          message: `${config.auth} authentication may not be fully compatible with ${frontendTech}`,
          suggestion: `Consider using an auth option that supports ${frontendTech}`,
        });
      }
    }
  }

  /**
   * Check TypeScript recommendations
   */
  checkTypeScriptRecommendations(config) {
    // TypeScript for modern frameworks
    const modernFrameworks = [
      TECHNOLOGY_OPTIONS.FRONTEND.REACT,
      TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS,
      TECHNOLOGY_OPTIONS.FRONTEND.NUXT,
      TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT,
    ];
    const hasModernFramework = config.frontend.some((f) =>
      modernFrameworks.includes(f),
    );

    if (
      hasModernFramework &&
      !config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT)
    ) {
      this.warnings.push({
        type: "addon",
        message: "TypeScript is highly recommended for modern frameworks",
        suggestion: "Add TypeScript for better development experience",
      });
    }

    // TypeScript for backends
    if (
      config.backend === TECHNOLOGY_OPTIONS.BACKEND.NESTJS &&
      !config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT)
    ) {
      this.adjustments.push({
        type: "addon",
        from: "not included",
        to: TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        reason: "NestJS requires TypeScript",
      });
      config.addons.push(TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT);
    }
  }

  /**
   * Check package manager optimizations
   */
  checkPackageManagerOptimizations(config) {
    // Recommend pnpm for monorepos
    if (config.frontend.length > 1 || config.addons.length > 3) {
      if (config.packageManager === TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM) {
        this.warnings.push({
          type: "packageManager",
          message:
            "For complex projects with multiple packages, pnpm is recommended",
          suggestion:
            "Consider using pnpm for better performance and disk usage",
        });
      }
    }

    // Recommend bun for simple projects
    if (config.frontend.length === 1 && config.addons.length <= 2) {
      if (config.packageManager === TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM) {
        this.warnings.push({
          type: "packageManager",
          message: "For simple projects, bun offers faster installation",
          suggestion: "Consider using bun for faster development",
        });
      }
    }
  }

  /**
   * Check performance optimizations
   */
  checkPerformanceOptimizations(config) {
    // Recommend TypeScript for performance and DX
    const modernFrameworks = [
      TECHNOLOGY_OPTIONS.FRONTEND.REACT,
      TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS,
      TECHNOLOGY_OPTIONS.FRONTEND.VUE,
      TECHNOLOGY_OPTIONS.FRONTEND.NUXT,
      TECHNOLOGY_OPTIONS.FRONTEND.SVELTE,
    ];
    const hasModernFramework =
      config.frontend &&
      config.frontend.some((f) => modernFrameworks.includes(f));

    if (
      hasModernFramework &&
      !config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT)
    ) {
      this.recommendations.push({
        type: "performance",
        message:
          "TypeScript improves development experience and catches errors",
        suggestion: "Add TypeScript for better type safety",
        impact: "Developer Experience",
      });
    }

    // Recommend build optimizations
    if (config.frontend && config.frontend.length > 0) {
      if (
        !config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.BIOME) &&
        !config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.ESLINT)
      ) {
        this.recommendations.push({
          type: "performance",
          message: "Code linting helps maintain code quality",
          suggestion: "Add ESLint or Biome for code analysis",
          impact: "Code Quality",
        });
      }
    }
  }

  /**
   * Check modern alternatives
   */
  checkModernAlternatives(config) {
    // Suggest modern database options
    if (config.database === TECHNOLOGY_OPTIONS.DATABASE.MYSQL) {
      this.recommendations.push({
        type: "modernization",
        message: "PostgreSQL offers more advanced features than MySQL",
        suggestion:
          "Consider PostgreSQL for better JSON support and advanced features",
        impact: "Features",
      });
    }

    // Suggest modern ORMs
    if (config.orm === TECHNOLOGY_OPTIONS.ORM.SEQUELIZE) {
      this.recommendations.push({
        type: "modernization",
        message:
          "Prisma offers better TypeScript support and developer experience",
        suggestion: "Consider upgrading to Prisma for modern ORM features",
        impact: "Developer Experience",
      });
    }

    // Suggest modern backends
    if (
      config.backend === TECHNOLOGY_OPTIONS.BACKEND.EXPRESS &&
      config.frontend &&
      config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS)
    ) {
      this.recommendations.push({
        type: "architecture",
        message: "Next.js includes built-in API routes",
        suggestion:
          "Consider removing separate backend and using Next.js API routes",
        impact: "Architecture Simplification",
      });
    }
  }

  /**
   * Display compatibility results
   */
  displayResults(result) {
    if (result.hasAdjustments) {
      console.log(chalk.yellow.bold("\n🔧 Smart Compatibility Adjustments:"));
      result.adjustments.forEach((adjustment) => {
        console.log(
          chalk.yellow(
            `  • ${adjustment.type}: ${adjustment.from} → ${adjustment.to}`,
          ),
        );
        console.log(chalk.gray(`    Reason: ${adjustment.reason}`));
      });
    }

    if (result.hasWarnings) {
      console.log(chalk.blue.bold("\n💡 Compatibility Recommendations:"));
      result.warnings.forEach((warning) => {
        console.log(chalk.blue(`  • ${warning.type}: ${warning.message}`));
        if (warning.suggestion) {
          console.log(chalk.gray(`    Suggestion: ${warning.suggestion}`));
        }
      });
    }

    if (result.hasAdjustments || result.hasWarnings) {
      console.log();
    }
  }

  /**
   * Get compatibility summary for API usage
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

  /**
   * Calculate project complexity level
   */
  calculateProjectComplexity(config) {
    let complexityPoints = 0;

    // Frontend complexity
    if (config.frontend && config.frontend.length > 0) {
      complexityPoints += config.frontend.length;
      if (config.frontend.length > 1) complexityPoints += 2; // Multi-frontend adds complexity
    }

    // Backend complexity
    if (config.backend && config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      complexityPoints += 2;
    }

    // Database complexity
    if (
      config.database &&
      config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE
    ) {
      complexityPoints += 2;
      if (config.orm && config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
        complexityPoints += 1;
      }
    }

    // Auth complexity
    if (config.auth && config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) {
      complexityPoints += 1;
    }

    // Addons complexity
    if (config.addons && config.addons.length > 0) {
      complexityPoints += Math.min(config.addons.length, 5); // Cap at 5 to avoid over-weighting
    }

    // Return complexity level
    if (complexityPoints >= 10) return "complex";
    if (complexityPoints >= 5) return "moderate";
    return "simple";
  }

  /**
   * Calculate how modern/up-to-date the stack is
   */
  calculateModernityScore(config) {
    let modernityPoints = 0;
    let totalPoints = 0;

    // Modern frontend frameworks
    const modernFrontends = [
      TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS,
      TECHNOLOGY_OPTIONS.FRONTEND.REMIX,
      TECHNOLOGY_OPTIONS.FRONTEND.SVELTEKIT,
    ];
    const veryModernFrontends = [TECHNOLOGY_OPTIONS.FRONTEND.ASTRO];

    if (config.frontend) {
      totalPoints += config.frontend.length * 2;
      config.frontend.forEach((f) => {
        if (veryModernFrontends.includes(f)) modernityPoints += 3;
        else if (modernFrontends.includes(f)) modernityPoints += 2;
        else if (
          f === TECHNOLOGY_OPTIONS.FRONTEND.REACT ||
          f === TECHNOLOGY_OPTIONS.FRONTEND.VUE
        )
          modernityPoints += 1;
      });
    }

    // Modern backend frameworks
    if (config.backend && config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      totalPoints += 2;
      if (
        [
          TECHNOLOGY_OPTIONS.BACKEND.FASTIFY,
          TECHNOLOGY_OPTIONS.BACKEND.TRPC,
          TECHNOLOGY_OPTIONS.BACKEND.HONO,
        ].includes(config.backend)
      ) {
        modernityPoints += 2;
      } else if (config.backend === TECHNOLOGY_OPTIONS.BACKEND.EXPRESS) {
        modernityPoints += 1;
      }
    }

    // Modern ORMs
    if (config.orm && config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
      totalPoints += 2;
      if (
        [
          TECHNOLOGY_OPTIONS.ORM.PRISMA,
          TECHNOLOGY_OPTIONS.ORM.DRIZZLE,
        ].includes(config.orm)
      ) {
        modernityPoints += 2;
      } else if (config.orm === TECHNOLOGY_OPTIONS.ORM.TYPEORM) {
        modernityPoints += 1;
      }
    }

    // Modern databases
    if (
      config.database &&
      config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE
    ) {
      totalPoints += 1;
      if (
        [
          TECHNOLOGY_OPTIONS.DATABASE.SUPABASE,
          TECHNOLOGY_OPTIONS.DATABASE.PLANETSCALE,
        ].includes(config.database)
      ) {
        modernityPoints += 1;
      }
    }

    // Modern addons
    if (config.addons) {
      const modernAddons = [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.BIOME,
        TECHNOLOGY_OPTIONS.ADDON.VITEST,
        TECHNOLOGY_OPTIONS.ADDON.PLAYWRIGHT,
      ];
      const modernAddonCount = config.addons.filter((a) =>
        modernAddons.includes(a),
      ).length;
      modernityPoints += modernAddonCount;
      totalPoints += Math.min(config.addons.length, 4);
    }

    return totalPoints > 0
      ? Math.round((modernityPoints / totalPoints) * 10) / 10
      : 5.0;
  }
}

// Utility functions for external use
export function getStackRecommendations(config) {
  const compatibility = new SmartCompatibility();
  return compatibility.checkAndAdjust(config);
}

export function calculateStackScore(config) {
  const compatibility = new SmartCompatibility();
  return compatibility.getCompatibilitySummary(config);
}

export function getBestStackForUseCase(useCase) {
  const useCaseStacks = {
    saas: {
      database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
      orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
      backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS],
      auth: TECHNOLOGY_OPTIONS.AUTH.NEXTAUTH,
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
      addons: [TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT],
    },
    mobile: {
      database: TECHNOLOGY_OPTIONS.DATABASE.SUPABASE,
      orm: TECHNOLOGY_OPTIONS.ORM.NONE,
      backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT_NATIVE],
      auth: TECHNOLOGY_OPTIONS.AUTH.SUPABASE,
      addons: [TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT],
    },
    blog: {
      database: TECHNOLOGY_OPTIONS.DATABASE.NONE,
      orm: TECHNOLOGY_OPTIONS.ORM.NONE,
      backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.ASTRO],
      auth: TECHNOLOGY_OPTIONS.AUTH.NONE,
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
      addons: [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
        TECHNOLOGY_OPTIONS.ADDON.TESTING,
      ],
    },
  };

  return useCaseStacks[useCase] || useCaseStacks["saas"];
}

export default SmartCompatibility;
