import chalk from "chalk";
import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

/**
 * Smart compatibility checker with auto-adjustments
 */
export class SmartCompatibility {
  constructor() {
    this.adjustments = [];
    this.warnings = [];
  }

  /**
   * Check and auto-adjust incompatible choices
   * @param {Object} config - Project configuration
   * @returns {Object} - Adjusted configuration with notifications
   */
  checkAndAdjust(config) {
    this.adjustments = [];
    this.warnings = [];

    // Database-ORM compatibility
    this.checkDatabaseORMCompatibility(config);
    
    // Frontend-Backend compatibility
    this.checkFrontendBackendCompatibility(config);
    
    // TypeScript recommendations
    this.checkTypeScriptRecommendations(config);
    
    // Package manager optimizations
    this.checkPackageManagerOptimizations(config);

    return {
      config,
      adjustments: this.adjustments,
      warnings: this.warnings,
      hasAdjustments: this.adjustments.length > 0,
      hasWarnings: this.warnings.length > 0,
    };
  }

  /**
   * Check database-ORM compatibility
   */
  checkDatabaseORMCompatibility(config) {
    const { DATABASE, ORM } = TECHNOLOGY_OPTIONS;

    // MongoDB compatibility
    if (config.database === DATABASE.MONGODB) {
      if (config.orm !== ORM.MONGOOSE) {
        this.adjustments.push({
          type: "orm",
          from: config.orm,
          to: ORM.MONGOOSE,
          reason: "MongoDB requires Mongoose ORM",
        });
        config.orm = ORM.MONGOOSE;
      }
    }

    // SQL databases compatibility
    if ([DATABASE.POSTGRES, DATABASE.SQLITE, DATABASE.MYSQL].includes(config.database)) {
      const compatibleORMs = [ORM.PRISMA, ORM.SEQUELIZE, ORM.TYPEORM, ORM.DRIZZLE];
      if (!compatibleORMs.includes(config.orm)) {
        this.adjustments.push({
          type: "orm",
          from: config.orm,
          to: ORM.PRISMA,
          reason: `${config.database} works best with Prisma ORM`,
        });
        config.orm = ORM.PRISMA;
      }
    }

    // Supabase compatibility
    if (config.database === DATABASE.SUPABASE) {
      if (config.orm !== ORM.PRISMA) {
        this.adjustments.push({
          type: "orm",
          from: config.orm,
          to: ORM.PRISMA,
          reason: "Supabase works best with Prisma ORM",
        });
        config.orm = ORM.PRISMA;
      }
    }
  }

  /**
   * Check frontend-backend compatibility
   */
  checkFrontendBackendCompatibility(config) {
    const { FRONTEND, BACKEND } = TECHNOLOGY_OPTIONS;

    // Next.js with backend
    if (config.frontend.includes(FRONTEND.NEXTJS)) {
      if (config.backend !== BACKEND.NONE) {
        this.warnings.push({
          type: "backend",
          message: "Next.js includes built-in API routes. Consider using 'none' for backend to avoid conflicts.",
          suggestion: "Use Next.js API routes instead of separate backend",
        });
      }
    }

    // Nuxt with backend
    if (config.frontend.includes(FRONTEND.NUXT)) {
      if (config.backend !== BACKEND.NONE) {
        this.warnings.push({
          type: "backend",
          message: "Nuxt includes built-in server routes. Consider using 'none' for backend.",
          suggestion: "Use Nuxt server routes instead of separate backend",
        });
      }
    }

    // React Native with web backends
    if (config.frontend.includes(FRONTEND.REACT_NATIVE)) {
      if ([BACKEND.EXPRESS, BACKEND.FASTIFY, BACKEND.KOA].includes(config.backend)) {
        this.warnings.push({
          type: "backend",
          message: "React Native typically uses mobile-specific backends or APIs.",
          suggestion: "Consider using a mobile-optimized backend or API service",
        });
      }
    }
  }

  /**
   * Check TypeScript recommendations
   */
  checkTypeScriptRecommendations(config) {
    const { FRONTEND, ADDON } = TECHNOLOGY_OPTIONS;

    // TypeScript for modern frameworks
    const modernFrameworks = [FRONTEND.REACT, FRONTEND.NEXTJS, FRONTEND.NUXT, FRONTEND.SVELTEKIT];
    const hasModernFramework = config.frontend.some(f => modernFrameworks.includes(f));
    
    if (hasModernFramework && !config.addons.includes(ADDON.TYPESCRIPT)) {
      this.warnings.push({
        type: "addon",
        message: "TypeScript is highly recommended for modern frameworks",
        suggestion: "Add TypeScript for better development experience",
      });
    }

    // TypeScript for backends
    if (config.backend === TECHNOLOGY_OPTIONS.BACKEND.NESTJS && !config.addons.includes(ADDON.TYPESCRIPT)) {
      this.adjustments.push({
        type: "addon",
        from: "not included",
        to: ADDON.TYPESCRIPT,
        reason: "NestJS requires TypeScript",
      });
      config.addons.push(ADDON.TYPESCRIPT);
    }
  }

  /**
   * Check package manager optimizations
   */
  checkPackageManagerOptimizations(config) {
    const { PACKAGE_MANAGER } = TECHNOLOGY_OPTIONS;

    // Recommend pnpm for monorepos
    if (config.frontend.length > 1 || config.addons.length > 3) {
      if (config.packageManager === PACKAGE_MANAGER.NPM) {
        this.warnings.push({
          type: "packageManager",
          message: "For complex projects with multiple packages, pnpm is recommended",
          suggestion: "Consider using pnpm for better performance and disk usage",
        });
      }
    }

    // Recommend bun for simple projects
    if (config.frontend.length === 1 && config.addons.length <= 2) {
      if (config.packageManager === PACKAGE_MANAGER.NPM) {
        this.warnings.push({
          type: "packageManager",
          message: "For simple projects, bun offers faster installation",
          suggestion: "Consider using bun for faster development",
        });
      }
    }
  }

  /**
   * Display compatibility results
   */
  displayResults(result) {
    if (result.hasAdjustments) {
      console.log(chalk.yellow.bold("\n🔧 Smart Compatibility Adjustments:"));
      result.adjustments.forEach(adjustment => {
        console.log(chalk.yellow(`  • ${adjustment.type}: ${adjustment.from} → ${adjustment.to}`));
        console.log(chalk.gray(`    Reason: ${adjustment.reason}`));
      });
    }

    if (result.hasWarnings) {
      console.log(chalk.blue.bold("\n💡 Compatibility Recommendations:"));
      result.warnings.forEach(warning => {
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
}

export default SmartCompatibility;
