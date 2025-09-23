/**
 * Enhanced Compatibility Engine
 * Provides dynamic compatibility checking, suggestions, and auto-corrections
 */

import { UI } from "./CLICore.js";
import chalk from "chalk";
import { 
  DATABASE_OPTIONS, 
  ORM_OPTIONS, 
  BACKEND_OPTIONS, 
  FRONTEND_OPTIONS, 
  AUTH_OPTIONS 
} from "../types.js";

// Enhanced compatibility matrix with more detailed information
export const ENHANCED_COMPATIBILITY_MATRIX = {
  database_orm: {
    [DATABASE_OPTIONS.SQLITE]: {
      compatible: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM, ORM_OPTIONS.DRIZZLE],
      recommended: ORM_OPTIONS.PRISMA,
      description: "SQLite works well with most ORMs",
      performance: "Excellent for development and small to medium applications"
    },
    [DATABASE_OPTIONS.POSTGRES]: {
      compatible: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM, ORM_OPTIONS.DRIZZLE],
      recommended: ORM_OPTIONS.PRISMA,
      description: "PostgreSQL is highly compatible with modern ORMs",
      performance: "Excellent for production applications"
    },
    [DATABASE_OPTIONS.MYSQL]: {
      compatible: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM, ORM_OPTIONS.DRIZZLE],
      recommended: ORM_OPTIONS.SEQUELIZE,
      description: "MySQL works well with most ORMs",
      performance: "Good for web applications"
    },
    [DATABASE_OPTIONS.MONGODB]: {
      compatible: [ORM_OPTIONS.MONGOOSE, ORM_OPTIONS.PRISMA],
      recommended: ORM_OPTIONS.MONGOOSE,
      description: "MongoDB requires specific ORMs",
      performance: "Excellent for document-based applications"
    },
    [DATABASE_OPTIONS.NONE]: {
      compatible: [ORM_OPTIONS.NONE],
      recommended: ORM_OPTIONS.NONE,
      description: "No database selected",
      performance: "N/A"
    }
  },
  
  frontend_backend: {
    [FRONTEND_OPTIONS.REACT]: {
      compatible: [BACKEND_OPTIONS.EXPRESS, BACKEND_OPTIONS.FASTIFY, BACKEND_OPTIONS.KOA, BACKEND_OPTIONS.NESTJS],
      recommended: BACKEND_OPTIONS.EXPRESS,
      description: "React works well with any Node.js backend",
      note: "Consider using Next.js for full-stack React applications"
    },
    [FRONTEND_OPTIONS.NEXTJS]: {
      compatible: [BACKEND_OPTIONS.NONE, BACKEND_OPTIONS.EXPRESS, BACKEND_OPTIONS.FASTIFY],
      recommended: BACKEND_OPTIONS.NONE,
      description: "Next.js includes built-in API routes",
      note: "Separate backend may be redundant unless you need microservices"
    },
    [FRONTEND_OPTIONS.VUE]: {
      compatible: [BACKEND_OPTIONS.EXPRESS, BACKEND_OPTIONS.FASTIFY, BACKEND_OPTIONS.KOA, BACKEND_OPTIONS.NESTJS],
      recommended: BACKEND_OPTIONS.EXPRESS,
      description: "Vue.js pairs well with Node.js backends",
      note: "Consider using Nuxt.js for full-stack Vue applications"
    },
    [FRONTEND_OPTIONS.NUXT]: {
      compatible: [BACKEND_OPTIONS.NONE, BACKEND_OPTIONS.EXPRESS, BACKEND_OPTIONS.FASTIFY],
      recommended: BACKEND_OPTIONS.NONE,
      description: "Nuxt.js includes built-in server-side functionality",
      note: "Separate backend may be redundant"
    }
  },
  
  auth_frontend: {
    [AUTH_OPTIONS.JWT]: {
      compatible: Object.values(FRONTEND_OPTIONS).filter(f => f !== FRONTEND_OPTIONS.NONE),
      description: "JWT works with all frontend frameworks",
      note: "Requires manual implementation"
    },
    [AUTH_OPTIONS.NEXTAUTH]: {
      compatible: [FRONTEND_OPTIONS.NEXTJS],
      description: "NextAuth.js is specifically designed for Next.js",
      note: "Use only with Next.js applications"
    },
    [AUTH_OPTIONS.AUTH0]: {
      compatible: Object.values(FRONTEND_OPTIONS).filter(f => f !== FRONTEND_OPTIONS.NONE),
      description: "Auth0 provides SDKs for all major frameworks",
      note: "Requires Auth0 account"
    }
  }
};

export class CompatibilityEngine {
  constructor() {
    this.checks = [];
    this.autoFixes = [];
    this.warnings = [];
    this.errors = [];
  }

  /**
   * Check compatibility of the entire technology stack
   */
  checkCompatibility(config) {
    this.reset();
    
    // Check each compatibility aspect
    this.checkDatabaseORMCompatibility(config);
    this.checkFrontendBackendCompatibility(config);
    this.checkAuthCompatibility(config);
    this.checkTechnologyConflicts(config);
    this.checkPerformanceRecommendations(config);
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      autoFixes: this.autoFixes,
      suggestions: this.generateSuggestions(config),
      score: this.calculateCompatibilityScore(config)
    };
  }

  /**
   * Check database-ORM compatibility
   */
  checkDatabaseORMCompatibility(config) {
    const { database, orm } = config;
    
    if (database === DATABASE_OPTIONS.NONE || orm === ORM_OPTIONS.NONE) {
      return;
    }
    
    const compatibility = ENHANCED_COMPATIBILITY_MATRIX.database_orm[database];
    
    if (!compatibility.compatible.includes(orm)) {
      this.errors.push({
        type: "incompatible",
        category: "database-orm",
        message: `${database} database is not compatible with ${orm} ORM`,
        suggestion: `Use one of: ${compatibility.compatible.join(", ")}`,
        autoFix: compatibility.recommended
      });
    } else if (orm !== compatibility.recommended) {
      this.warnings.push({
        type: "suboptimal",
        category: "database-orm",
        message: `Consider using ${compatibility.recommended} ORM with ${database} for better performance`,
        description: compatibility.description,
        performance: compatibility.performance
      });
    }
  }

  /**
   * Check frontend-backend compatibility
   */
  checkFrontendBackendCompatibility(config) {
    const { frontend, backend } = config;
    
    if (!frontend || frontend.length === 0 || backend === BACKEND_OPTIONS.NONE) {
      return;
    }
    
    for (const frontendTech of frontend) {
      if (frontendTech === FRONTEND_OPTIONS.NONE) continue;
      
      const compatibility = ENHANCED_COMPATIBILITY_MATRIX.frontend_backend[frontendTech];
      
      if (!compatibility) continue;
      
      if (!compatibility.compatible.includes(backend)) {
        this.warnings.push({
          type: "suboptimal",
          category: "frontend-backend",
          message: `${frontendTech} frontend with ${backend} backend is not optimal`,
          suggestion: `Consider using: ${compatibility.compatible.join(", ")}`,
          description: compatibility.description,
          note: compatibility.note
        });
      } else if (backend !== compatibility.recommended && compatibility.recommended !== BACKEND_OPTIONS.NONE) {
        this.warnings.push({
          type: "recommendation",
          category: "frontend-backend",
          message: `For best results with ${frontendTech}, consider using ${compatibility.recommended} backend`,
          description: compatibility.description,
          note: compatibility.note
        });
      }
    }
  }

  /**
   * Check authentication compatibility
   */
  checkAuthCompatibility(config) {
    const { auth, frontend } = config;
    
    if (auth === AUTH_OPTIONS.NONE || !frontend || frontend.length === 0) {
      return;
    }
    
    const compatibility = ENHANCED_COMPATIBILITY_MATRIX.auth_frontend[auth];
    
    if (!compatibility) return;
    
    for (const frontendTech of frontend) {
      if (frontendTech === FRONTEND_OPTIONS.NONE) continue;
      
      if (!compatibility.compatible.includes(frontendTech)) {
        this.errors.push({
          type: "incompatible",
          category: "auth-frontend",
          message: `${auth} authentication is not compatible with ${frontendTech}`,
          suggestion: `Use one of: ${compatibility.compatible.join(", ")}`,
          description: compatibility.description,
          note: compatibility.note
        });
      }
    }
  }

  /**
   * Check for technology conflicts
   */
  checkTechnologyConflicts(config) {
    const { frontend } = config;
    
    if (!frontend || frontend.length <= 1) return;
    
    // Check for conflicting meta-frameworks
    const metaFrameworks = [FRONTEND_OPTIONS.NEXTJS, FRONTEND_OPTIONS.NUXT, FRONTEND_OPTIONS.REMIX, FRONTEND_OPTIONS.SVELTEKIT];
    const selectedMetaFrameworks = frontend.filter(f => metaFrameworks.includes(f));
    
    if (selectedMetaFrameworks.length > 1) {
      this.errors.push({
        type: "conflict",
        category: "frontend",
        message: `Conflicting meta-frameworks selected: ${selectedMetaFrameworks.join(", ")}`,
        suggestion: "Choose only one meta-framework",
        description: "Meta-frameworks provide full-stack functionality and should not be combined"
      });
    }
  }

  /**
   * Check performance recommendations
   */
  checkPerformanceRecommendations(config) {
    const { frontend, backend, database, orm } = config;
    
    // Recommend TypeScript for complex stacks
    if (frontend && frontend.length > 0 && backend !== BACKEND_OPTIONS.NONE && database !== DATABASE_OPTIONS.NONE) {
      this.warnings.push({
        type: "performance",
        category: "tooling",
        message: "Consider adding TypeScript for better type safety and developer experience",
        suggestion: "Add --typescript flag or include 'typescript' in --addons",
        description: "TypeScript is highly recommended for full-stack applications"
      });
    }
    
    // Recommend testing for production stacks
    if (backend !== BACKEND_OPTIONS.NONE && database !== DATABASE_OPTIONS.NONE) {
      this.warnings.push({
        type: "quality",
        category: "testing",
        message: "Consider adding testing framework for better code quality",
        suggestion: "Add 'testing' to --addons",
        description: "Testing is essential for production applications"
      });
    }
  }

  /**
   * Generate comprehensive suggestions
   */
  generateSuggestions(config) {
    const suggestions = [];
    
    // Database-ORM suggestions
    if (config.database !== DATABASE_OPTIONS.NONE) {
      const dbInfo = ENHANCED_COMPATIBILITY_MATRIX.database_orm[config.database];
      if (dbInfo && config.orm !== dbInfo.recommended) {
        suggestions.push({
          category: "optimization",
          title: "Optimize ORM Selection",
          description: `For ${config.database}, ${dbInfo.recommended} is recommended`,
          command: `--orm ${dbInfo.recommended}`,
          impact: "performance"
        });
      }
    }
    
    // Frontend-backend suggestions
    if (config.frontend && config.frontend.length > 0) {
      for (const frontendTech of config.frontend) {
        const frontendInfo = ENHANCED_COMPATIBILITY_MATRIX.frontend_backend[frontendTech];
        if (frontendInfo && config.backend !== frontendInfo.recommended) {
          suggestions.push({
            category: "architecture",
            title: "Optimize Backend Selection",
            description: `For ${frontendTech}, ${frontendInfo.recommended} backend is recommended`,
            command: `--backend ${frontendInfo.recommended}`,
            impact: "architecture"
          });
        }
      }
    }
    
    return suggestions;
  }

  /**
   * Calculate compatibility score (0-100)
   */
  calculateCompatibilityScore(config) {
    let score = 100;
    
    // Deduct points for errors
    score -= this.errors.length * 25;
    
    // Deduct points for warnings
    score -= this.warnings.length * 5;
    
    // Bonus points for optimal combinations
    if (config.database !== DATABASE_OPTIONS.NONE) {
      const dbInfo = ENHANCED_COMPATIBILITY_MATRIX.database_orm[config.database];
      if (dbInfo && config.orm === dbInfo.recommended) {
        score += 10;
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Display compatibility report
   */
  displayCompatibilityReport(result) {
    console.log();
    
    // Header
    const headerGradient = UI.createGradient(["#667eea", "#764ba2"], "🔍 Compatibility Analysis");
    console.log(UI.createBox(headerGradient, {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "cyan",
      backgroundColor: "black"
    }));
    
    // Score
    const scoreColor = result.score >= 80 ? chalk.green : result.score >= 60 ? chalk.yellow : chalk.red;
    const scoreIcon = result.score >= 80 ? UI.icons.check : result.score >= 60 ? UI.icons.warning : UI.icons.error;
    
    console.log();
    console.log(`${scoreIcon} Compatibility Score: ${scoreColor.bold(String(result.score))}/100`);
    console.log();
    
    // Errors
    if (result.errors.length > 0) {
      UI.log.error("Compatibility Issues", `${result.errors.length} error(s) found`);
      result.errors.forEach((error, index) => {
        console.log();
        console.log(`${chalk.red(`${index + 1}. ${error.message}`)}`);
        console.log(`${UI.colors.muted(`   Category: ${error.category}`)}`);
        console.log(`${UI.colors.muted(`   Suggestion: ${error.suggestion}`)}`);
        if (error.description) {
          console.log(`${UI.colors.muted(`   Details: ${error.description}`)}`);
        }
      });
    }
    
    // Warnings
    if (result.warnings.length > 0) {
      console.log();
      UI.log.warning("Recommendations", `${result.warnings.length} suggestion(s)`);
      result.warnings.forEach((warning, index) => {
        console.log();
        console.log(`${chalk.yellow(`${index + 1}. ${warning.message}`)}`);
        console.log(`${UI.colors.muted(`   Category: ${warning.category}`)}`);
        if (warning.suggestion) {
          console.log(`${UI.colors.muted(`   Suggestion: ${warning.suggestion}`)}`);
        }
        if (warning.description) {
          console.log(`${UI.colors.muted(`   Details: ${warning.description}`)}`);
        }
      });
    }
    
    // Success message
    if (result.isValid && result.warnings.length === 0) {
      console.log();
      UI.log.success("Perfect! Your technology stack is fully compatible", "No issues found");
    }
    
    // Suggestions
    if (result.suggestions.length > 0) {
      console.log();
      UI.log.info("Optimization Suggestions", `${result.suggestions.length} recommendation(s)`);
      result.suggestions.forEach((suggestion, index) => {
        console.log();
        console.log(`${UI.colors.info(`${index + 1}. ${suggestion.title}`)}`);
        console.log(`${UI.colors.muted(`   ${suggestion.description}`)}`);
        console.log(`${chalk.cyan(`   Command: ${suggestion.command}`)}`);
      });
    }
  }

  /**
   * Reset all checks
   */
  reset() {
    this.checks = [];
    this.autoFixes = [];
    this.warnings = [];
    this.errors = [];
  }
}
