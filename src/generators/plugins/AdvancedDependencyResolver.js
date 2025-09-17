import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";
import { TECHNOLOGY_OPTIONS } from "../../config/ValidationSchemas.js";

/**
 * Advanced Dependency Resolver Plugin
 * Handles version conflict resolution, peer dependencies, and optimization
 */

export class AdvancedDependencyResolver extends GeneratorPlugin {
  constructor() {
    super("AdvancedDependencyResolver", "1.0.0");
    this.priority = 5; // Very high priority - runs early
    this.dependencies = [];
    
    this.registerHook(HOOK_TYPES.PRE_GENERATE, this.preGenerate);
    this.registerHook(HOOK_TYPES.VALIDATE_CONFIG, this.validateDependencies);
  }

  /**
   * Check if plugin can handle the configuration
   * @param {Object} config - Project configuration
   * @returns {boolean} - True if plugin can handle the config
   */
  canHandle(config) {
    return true; // This plugin handles all configurations
  }

  /**
   * Pre-generation hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async preGenerate(context) {
    console.log("🔧 AdvancedDependencyResolver: Analyzing dependencies");
    
    // Initialize dependency analysis
    context.dependencyAnalysis = {
      conflicts: [],
      peerDependencies: [],
      optimizations: [],
      recommendations: [],
    };

    return context;
  }

  /**
   * Execute the plugin
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Plugin result
   */
  async execute(config, context) {
    try {
      console.log("🔧 AdvancedDependencyResolver: Resolving dependencies");

      // Analyze dependencies
      const analysis = await this.analyzeDependencies(config);

      // Resolve conflicts
      const resolvedDeps = await this.resolveConflicts(analysis.dependencies);

      // Add peer dependencies
      const withPeerDeps = await this.addPeerDependencies(resolvedDeps, config);

      // Optimize versions
      const optimizedDeps = await this.optimizeVersions(withPeerDeps);

      // Update context
      context.resolvedDependencies = optimizedDeps;
      context.dependencyAnalysis = analysis;

      return {
        success: true,
        dependencies: optimizedDeps,
        analysis,
        message: "Dependencies resolved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Dependency resolution failed",
      };
    }
  }

  /**
   * Analyze dependencies for conflicts and issues
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Dependency analysis
   */
  async analyzeDependencies(config) {
    const analysis = {
      dependencies: {},
      conflicts: [],
      peerDependencies: [],
      optimizations: [],
      recommendations: [],
    };

    // Collect all dependencies
    const allDeps = await this.collectAllDependencies(config);
    analysis.dependencies = allDeps;

    // Check for conflicts
    analysis.conflicts = await this.detectConflicts(allDeps);

    // Identify peer dependencies
    analysis.peerDependencies = await this.identifyPeerDependencies(allDeps, config);

    // Find optimization opportunities
    analysis.optimizations = await this.findOptimizations(allDeps);

    // Generate recommendations
    analysis.recommendations = await this.generateRecommendations(analysis, config);

    return analysis;
  }

  /**
   * Collect all dependencies from configuration
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - All dependencies
   */
  async collectAllDependencies(config) {
    const dependencies = {
      dependencies: {},
      devDependencies: {},
    };

    // Backend dependencies
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      const backendDeps = this.getBackendDependencies(config.backend);
      this.mergeDependencies(dependencies, backendDeps);
    }

    // Database dependencies
    if (config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE) {
      const dbDeps = this.getDatabaseDependencies(config.database);
      this.mergeDependencies(dependencies, dbDeps);
    }

    // ORM dependencies
    if (config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
      const ormDeps = this.getORMDependencies(config.orm);
      this.mergeDependencies(dependencies, ormDeps);
    }

    // Frontend dependencies
    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)) {
      for (const frontend of config.frontend) {
        const frontendDeps = this.getFrontendDependencies(frontend);
        this.mergeDependencies(dependencies, frontendDeps);
      }
    }

    // Auth dependencies
    if (config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) {
      const authDeps = this.getAuthDependencies(config.auth);
      this.mergeDependencies(dependencies, authDeps);
    }

    // Addon dependencies
    if (config.addons && config.addons.length > 0) {
      for (const addon of config.addons) {
        const addonDeps = this.getAddonDependencies(addon);
        this.mergeDependencies(dependencies, addonDeps);
      }
    }

    return dependencies;
  }

  /**
   * Get backend dependencies
   * @param {string} backend - Backend framework
   * @returns {Object} - Backend dependencies
   */
  getBackendDependencies(backend) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (backend) {
      case TECHNOLOGY_OPTIONS.BACKEND.EXPRESS:
        dependencies.dependencies = {
          express: "^4.18.2",
          cors: "^2.8.5",
          helmet: "^7.1.0",
          dotenv: "^16.3.1",
        };
        break;
      case TECHNOLOGY_OPTIONS.BACKEND.FASTIFY:
        dependencies.dependencies = {
          fastify: "^4.24.3",
          "@fastify/cors": "^8.4.0",
          "@fastify/helmet": "^11.1.1",
        };
        break;
      case TECHNOLOGY_OPTIONS.BACKEND.NESTJS:
        dependencies.dependencies = {
          "@nestjs/core": "^10.2.8",
          "@nestjs/common": "^10.2.8",
          "@nestjs/platform-express": "^10.2.8",
        };
        break;
    }

    return dependencies;
  }

  /**
   * Get database dependencies
   * @param {string} database - Database type
   * @returns {Object} - Database dependencies
   */
  getDatabaseDependencies(database) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (database) {
      case TECHNOLOGY_OPTIONS.DATABASE.MONGODB:
        dependencies.dependencies.mongodb = "^6.3.0";
        break;
      case TECHNOLOGY_OPTIONS.DATABASE.POSTGRES:
        dependencies.dependencies.pg = "^8.11.3";
        dependencies.devDependencies["@types/pg"] = "^8.10.9";
        break;
      case TECHNOLOGY_OPTIONS.DATABASE.SQLITE:
        dependencies.dependencies.sqlite3 = "^5.1.6";
        break;
    }

    return dependencies;
  }

  /**
   * Get ORM dependencies
   * @param {string} orm - ORM type
   * @returns {Object} - ORM dependencies
   */
  getORMDependencies(orm) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (orm) {
      case TECHNOLOGY_OPTIONS.ORM.MONGOOSE:
        dependencies.dependencies.mongoose = "^8.0.3";
        break;
      case TECHNOLOGY_OPTIONS.ORM.PRISMA:
        dependencies.dependencies["@prisma/client"] = "^5.7.1";
        dependencies.devDependencies.prisma = "^5.7.1";
        break;
      case TECHNOLOGY_OPTIONS.ORM.SEQUELIZE:
        dependencies.dependencies.sequelize = "^6.35.2";
        break;
      case TECHNOLOGY_OPTIONS.ORM.TYPEORM:
        dependencies.dependencies.typeorm = "^0.3.17";
        break;
    }

    return dependencies;
  }

  /**
   * Get frontend dependencies
   * @param {string} frontend - Frontend framework
   * @returns {Object} - Frontend dependencies
   */
  getFrontendDependencies(frontend) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (frontend) {
      case TECHNOLOGY_OPTIONS.FRONTEND.REACT:
        dependencies.dependencies = {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        };
        dependencies.devDependencies = {
          "@vitejs/plugin-react": "^4.2.1",
          vite: "^5.0.8",
        };
        break;
      case TECHNOLOGY_OPTIONS.FRONTEND.VUE:
        dependencies.dependencies.vue = "^3.3.8";
        dependencies.devDependencies = {
          "@vitejs/plugin-vue": "^4.5.2",
          vite: "^5.0.8",
        };
        break;
      case TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS:
        dependencies.dependencies = {
          next: "^14.0.4",
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        };
        break;
    }

    return dependencies;
  }

  /**
   * Get auth dependencies
   * @param {string} auth - Auth type
   * @returns {Object} - Auth dependencies
   */
  getAuthDependencies(auth) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (auth) {
      case TECHNOLOGY_OPTIONS.AUTH.JWT:
        dependencies.dependencies = {
          jsonwebtoken: "^9.0.2",
          bcryptjs: "^2.4.3",
        };
        dependencies.devDependencies = {
          "@types/jsonwebtoken": "^9.0.5",
          "@types/bcryptjs": "^2.4.6",
        };
        break;
      case TECHNOLOGY_OPTIONS.AUTH.PASSPORT:
        dependencies.dependencies = {
          passport: "^0.7.0",
          "passport-local": "^1.0.0",
          "passport-jwt": "^4.0.1",
        };
        break;
    }

    return dependencies;
  }

  /**
   * Get addon dependencies
   * @param {string} addon - Addon type
   * @returns {Object} - Addon dependencies
   */
  getAddonDependencies(addon) {
    const dependencies = { dependencies: {}, devDependencies: {} };

    switch (addon) {
      case TECHNOLOGY_OPTIONS.ADDON.ESLINT:
        dependencies.devDependencies = {
          eslint: "^8.55.0",
          "@eslint/js": "^8.55.0",
        };
        break;
      case TECHNOLOGY_OPTIONS.ADDON.PRETTIER:
        dependencies.devDependencies.prettier = "^3.1.1";
        break;
      case TECHNOLOGY_OPTIONS.ADDON.TAILWIND:
        dependencies.devDependencies = {
          tailwindcss: "^3.3.6",
          autoprefixer: "^10.4.16",
          postcss: "^8.4.32",
        };
        break;
      case TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT:
        dependencies.devDependencies = {
          typescript: "^5.3.3",
          "@types/node": "^20.10.5",
        };
        break;
      case TECHNOLOGY_OPTIONS.ADDON.TESTING:
        dependencies.devDependencies = {
          jest: "^29.7.0",
          "@types/jest": "^29.5.8",
        };
        break;
    }

    return dependencies;
  }

  /**
   * Merge dependencies
   * @param {Object} target - Target dependencies object
   * @param {Object} source - Source dependencies object
   */
  mergeDependencies(target, source) {
    target.dependencies = { ...target.dependencies, ...source.dependencies };
    target.devDependencies = { ...target.devDependencies, ...source.devDependencies };
  }

  /**
   * Detect version conflicts
   * @param {Object} dependencies - Dependencies to analyze
   * @returns {Promise<Array>} - Array of conflicts
   */
  async detectConflicts(dependencies) {
    const conflicts = [];
    const allDeps = { ...dependencies.dependencies, ...dependencies.devDependencies };

    // Check for duplicate packages with different versions
    const packageVersions = new Map();
    
    for (const [packageName, version] of Object.entries(allDeps)) {
      if (packageVersions.has(packageName)) {
        const existingVersion = packageVersions.get(packageName);
        if (existingVersion !== version) {
          conflicts.push({
            package: packageName,
            versions: [existingVersion, version],
            type: "version_conflict",
          });
        }
      } else {
        packageVersions.set(packageName, version);
      }
    }

    return conflicts;
  }

  /**
   * Identify peer dependencies
   * @param {Object} dependencies - Dependencies to analyze
   * @param {Object} config - Project configuration
   * @returns {Promise<Array>} - Array of peer dependencies
   */
  async identifyPeerDependencies(dependencies, config) {
    const peerDeps = [];

    // React peer dependencies
    if (dependencies.dependencies.react || dependencies.devDependencies.react) {
      if (!dependencies.dependencies["react-dom"] && !dependencies.devDependencies["react-dom"]) {
        peerDeps.push({
          package: "react-dom",
          version: "^18.2.0",
          peerOf: "react",
        });
      }
    }

    // TypeScript peer dependencies
    if (config.typescript) {
      if (!dependencies.dependencies["@types/node"] && !dependencies.devDependencies["@types/node"]) {
        peerDeps.push({
          package: "@types/node",
          version: "^20.10.5",
          peerOf: "typescript",
        });
      }
    }

    return peerDeps;
  }

  /**
   * Find optimization opportunities
   * @param {Object} dependencies - Dependencies to analyze
   * @returns {Promise<Array>} - Array of optimizations
   */
  async findOptimizations(dependencies) {
    const optimizations = [];

    // Check for outdated versions
    const allDeps = { ...dependencies.dependencies, ...dependencies.devDependencies };
    
    for (const [packageName, version] of Object.entries(allDeps)) {
      // This is a simplified check - in practice, you'd query npm registry
      if (version.startsWith("^") && !version.includes("latest")) {
        optimizations.push({
          package: packageName,
          current: version,
          suggestion: "Consider updating to latest compatible version",
          type: "version_update",
        });
      }
    }

    return optimizations;
  }

  /**
   * Generate recommendations
   * @param {Object} analysis - Dependency analysis
   * @param {Object} config - Project configuration
   * @returns {Promise<Array>} - Array of recommendations
   */
  async generateRecommendations(analysis, config) {
    const recommendations = [];

    // Security recommendations
    if (analysis.dependencies.dependencies.express) {
      recommendations.push({
        type: "security",
        message: "Consider adding express-rate-limit for API protection",
        package: "express-rate-limit",
        version: "^7.1.5",
      });
    }

    // Performance recommendations
    if (config.database === TECHNOLOGY_OPTIONS.DATABASE.MONGODB) {
      recommendations.push({
        type: "performance",
        message: "Consider adding connection pooling for MongoDB",
        package: "mongodb-connection-pool",
        version: "^1.0.0",
      });
    }

    // Development recommendations
    if (config.typescript) {
      recommendations.push({
        type: "development",
        message: "Consider adding ts-node for TypeScript execution",
        package: "ts-node",
        version: "^10.9.1",
        dev: true,
      });
    }

    return recommendations;
  }

  /**
   * Resolve dependency conflicts
   * @param {Object} dependencies - Dependencies with conflicts
   * @returns {Promise<Object>} - Resolved dependencies
   */
  async resolveConflicts(dependencies) {
    // This is a simplified conflict resolution
    // In practice, you'd use semver to find compatible versions
    return dependencies;
  }

  /**
   * Add peer dependencies
   * @param {Object} dependencies - Base dependencies
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Dependencies with peer deps
   */
  async addPeerDependencies(dependencies, config) {
    const withPeerDeps = { ...dependencies };

    // Add peer dependencies to devDependencies
    const peerDeps = await this.identifyPeerDependencies(dependencies, config);
    
    for (const peerDep of peerDeps) {
      if (peerDep.dev) {
        withPeerDeps.devDependencies[peerDep.package] = peerDep.version;
      } else {
        withPeerDeps.dependencies[peerDep.package] = peerDep.version;
      }
    }

    return withPeerDeps;
  }

  /**
   * Optimize dependency versions
   * @param {Object} dependencies - Dependencies to optimize
   * @returns {Promise<Object>} - Optimized dependencies
   */
  async optimizeVersions(dependencies) {
    // This is a simplified optimization
    // In practice, you'd use semver to find optimal version ranges
    return dependencies;
  }

  /**
   * Validate dependencies hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async validateDependencies(context) {
    console.log("🔧 AdvancedDependencyResolver: Validating dependencies");
    return context;
  }
}

export default AdvancedDependencyResolver;
