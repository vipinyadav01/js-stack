import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";
import { TECHNOLOGY_OPTIONS } from "../../config/ValidationSchemas.js";

/**
 * Package.json Plugin for JS Stack Generator
 * Handles package.json creation, merging, and management
 */

export class PackageJsonPlugin extends GeneratorPlugin {
  constructor() {
    super("PackageJsonPlugin", "1.0.0");
    this.priority = 10; // High priority - runs early
    this.dependencies = [];
    
    this.registerHook(HOOK_TYPES.PRE_GENERATE, this.preGenerate);
    this.registerHook(HOOK_TYPES.MERGE_PACKAGE_JSON, this.mergePackageJson);
    this.registerHook(HOOK_TYPES.POST_GENERATE, this.postGenerate);
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
    console.log("📦 PackageJsonPlugin: Preparing package.json generation");
    
    // Initialize package.json structure
    context.packageJson = {
      name: context.config.projectName,
      version: "1.0.0",
      description: `A ${context.config.backend} + ${context.config.frontend.join(", ")} application`,
      main: "index.js",
      scripts: {},
      dependencies: {},
      devDependencies: {},
      keywords: [],
      author: "Vipin Yadav",
      license: "MIT",
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
      console.log("📦 PackageJsonPlugin: Generating package.json");
      console.log("📦 Context projectDir:", context.projectDir);
      console.log("📦 Config:", JSON.stringify(config, null, 2));

      // Create base package.json
      const packageJson = await this.createBasePackageJson(config);

      // Add technology-specific dependencies
      const enhancedPackageJson = await this.addTechnologyDependencies(packageJson, config);

      // Add scripts
      const finalPackageJson = await this.addScripts(enhancedPackageJson, config);

      // Write package.json
      await this.writePackageJson(finalPackageJson, context.projectDir);

      return {
        success: true,
        packageJson: finalPackageJson,
        message: "Package.json generated successfully",
      };
    } catch (error) {
      console.error("📦 PackageJsonPlugin error:", error);
      return {
        success: false,
        error: error.message,
        message: "Package.json generation failed",
      };
    }
  }

  /**
   * Create base package.json
   * @param {Object} config - Project configuration
   * @returns {Object} - Base package.json
   */
  async createBasePackageJson(config) {
    return {
      name: config.projectName,
      version: "1.0.0",
      description: this.generateDescription(config),
      main: "index.js",
      scripts: this.getBaseScripts(config),
      dependencies: {},
      devDependencies: {},
      keywords: this.generateKeywords(config),
      author: "Vipin Yadav",
      license: "MIT",
      engines: {
        node: ">=18.0.0",
        npm: ">=8.0.0",
      },
    };
  }

  /**
   * Add technology-specific dependencies
   * @param {Object} packageJson - Base package.json
   * @param {Object} config - Project configuration
   * @returns {Object} - Enhanced package.json
   */
  async addTechnologyDependencies(packageJson, config) {
    const enhanced = { ...packageJson };

    // Add backend dependencies
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      const backendDeps = this.getBackendDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...backendDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...backendDeps.devDependencies };
    }

    // Add database dependencies
    if (config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE) {
      const dbDeps = this.getDatabaseDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...dbDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...dbDeps.devDependencies };
    }

    // Add ORM dependencies
    if (config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) {
      const ormDeps = this.getORMDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...ormDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...ormDeps.devDependencies };
    }

    // Add frontend dependencies
    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)) {
      const frontendDeps = this.getFrontendDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...frontendDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...frontendDeps.devDependencies };
    }

    // Add auth dependencies
    if (config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) {
      const authDeps = this.getAuthDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...authDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...authDeps.devDependencies };
    }

    // Add addon dependencies
    if (config.addons && config.addons.length > 0) {
      const addonDeps = this.getAddonDependencies(config);
      enhanced.dependencies = { ...enhanced.dependencies, ...addonDeps.dependencies };
      enhanced.devDependencies = { ...enhanced.devDependencies, ...addonDeps.devDependencies };
    }

    return enhanced;
  }

  /**
   * Add scripts to package.json
   * @param {Object} packageJson - Package.json
   * @param {Object} config - Project configuration
   * @returns {Object} - Package.json with scripts
   */
  async addScripts(packageJson, config) {
    const enhanced = { ...packageJson };
    
    // Base scripts
    enhanced.scripts = {
      ...enhanced.scripts,
      start: "node index.js",
      dev: "node --watch index.js",
      build: "echo 'Build completed'",
      test: "echo 'No tests specified'",
    };

    // Backend-specific scripts
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      enhanced.scripts = {
        ...enhanced.scripts,
        ...this.getBackendScripts(config),
      };
    }

    // Frontend-specific scripts
    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)) {
      enhanced.scripts = {
        ...enhanced.scripts,
        ...this.getFrontendScripts(config),
      };
    }

    return enhanced;
  }

  /**
   * Get backend dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - Backend dependencies
   */
  getBackendDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    switch (config.backend) {
      case TECHNOLOGY_OPTIONS.BACKEND.EXPRESS:
        dependencies.express = "^4.18.2";
        dependencies.cors = "^2.8.5";
        dependencies.helmet = "^7.1.0";
        dependencies.dotenv = "^16.3.1";
        break;
      case TECHNOLOGY_OPTIONS.BACKEND.FASTIFY:
        dependencies.fastify = "^4.24.3";
        dependencies["@fastify/cors"] = "^8.4.0";
        dependencies["@fastify/helmet"] = "^11.1.1";
        break;
      case TECHNOLOGY_OPTIONS.BACKEND.KOA:
        dependencies.koa = "^2.14.2";
        dependencies["@koa/cors"] = "^4.4.0";
        dependencies["koa-helmet"] = "^7.0.2";
        break;
      case TECHNOLOGY_OPTIONS.BACKEND.NESTJS:
        dependencies["@nestjs/core"] = "^10.2.8";
        dependencies["@nestjs/common"] = "^10.2.8";
        dependencies["@nestjs/platform-express"] = "^10.2.8";
        break;
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get database dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - Database dependencies
   */
  getDatabaseDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    switch (config.database) {
      case TECHNOLOGY_OPTIONS.DATABASE.MONGODB:
        dependencies.mongodb = "^6.3.0";
        break;
      case TECHNOLOGY_OPTIONS.DATABASE.POSTGRES:
        dependencies.pg = "^8.11.3";
        devDependencies["@types/pg"] = "^8.10.9";
        break;
      case TECHNOLOGY_OPTIONS.DATABASE.SQLITE:
        dependencies.sqlite3 = "^5.1.6";
        break;
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get ORM dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - ORM dependencies
   */
  getORMDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    switch (config.orm) {
      case TECHNOLOGY_OPTIONS.ORM.MONGOOSE:
        dependencies.mongoose = "^8.0.3";
        break;
      case TECHNOLOGY_OPTIONS.ORM.PRISMA:
        dependencies["@prisma/client"] = "^5.7.1";
        devDependencies.prisma = "^5.7.1";
        break;
      case TECHNOLOGY_OPTIONS.ORM.SEQUELIZE:
        dependencies.sequelize = "^6.35.2";
        break;
      case TECHNOLOGY_OPTIONS.ORM.TYPEORM:
        dependencies.typeorm = "^0.3.17";
        break;
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get frontend dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - Frontend dependencies
   */
  getFrontendDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    for (const frontend of config.frontend) {
      switch (frontend) {
        case TECHNOLOGY_OPTIONS.FRONTEND.REACT:
          dependencies.react = "^18.2.0";
          dependencies["react-dom"] = "^18.2.0";
          devDependencies["@vitejs/plugin-react"] = "^4.2.1";
          devDependencies.vite = "^5.0.8";
          break;
        case TECHNOLOGY_OPTIONS.FRONTEND.VUE:
          dependencies.vue = "^3.3.8";
          devDependencies["@vitejs/plugin-vue"] = "^4.5.2";
          devDependencies.vite = "^5.0.8";
          break;
        case TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS:
          dependencies.next = "^14.0.4";
          dependencies.react = "^18.2.0";
          dependencies["react-dom"] = "^18.2.0";
          break;
      }
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get authentication dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - Auth dependencies
   */
  getAuthDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    switch (config.auth) {
      case TECHNOLOGY_OPTIONS.AUTH.JWT:
        dependencies.jsonwebtoken = "^9.0.2";
        dependencies.bcryptjs = "^2.4.3";
        devDependencies["@types/jsonwebtoken"] = "^9.0.5";
        devDependencies["@types/bcryptjs"] = "^2.4.6";
        break;
      case TECHNOLOGY_OPTIONS.AUTH.PASSPORT:
        dependencies.passport = "^0.7.0";
        dependencies["passport-local"] = "^1.0.0";
        dependencies["passport-jwt"] = "^4.0.1";
        break;
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get addon dependencies
   * @param {Object} config - Project configuration
   * @returns {Object} - Addon dependencies
   */
  getAddonDependencies(config) {
    const dependencies = {};
    const devDependencies = {};

    for (const addon of config.addons) {
      switch (addon) {
        case TECHNOLOGY_OPTIONS.ADDON.ESLINT:
          devDependencies.eslint = "^8.55.0";
          devDependencies["@eslint/js"] = "^8.55.0";
          break;
        case TECHNOLOGY_OPTIONS.ADDON.PRETTIER:
          devDependencies.prettier = "^3.1.1";
          break;
        case TECHNOLOGY_OPTIONS.ADDON.TAILWIND:
          devDependencies.tailwindcss = "^3.3.6";
          devDependencies.autoprefixer = "^10.4.16";
          devDependencies.postcss = "^8.4.32";
          break;
        case TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT:
          devDependencies.typescript = "^5.3.3";
          devDependencies["@types/node"] = "^20.10.5";
          break;
        case TECHNOLOGY_OPTIONS.ADDON.TESTING:
          devDependencies.jest = "^29.7.0";
          devDependencies["@types/jest"] = "^29.5.8";
          break;
      }
    }

    return { dependencies, devDependencies };
  }

  /**
   * Get base scripts
   * @param {Object} config - Project configuration
   * @returns {Object} - Base scripts
   */
  getBaseScripts(config) {
    return {
      start: "node index.js",
      dev: "node --watch index.js",
      build: "echo 'Build completed'",
      test: "echo 'No tests specified'",
    };
  }

  /**
   * Get backend-specific scripts
   * @param {Object} config - Project configuration
   * @returns {Object} - Backend scripts
   */
  getBackendScripts(config) {
    const scripts = {};

    switch (config.backend) {
      case TECHNOLOGY_OPTIONS.BACKEND.NESTJS:
        scripts.start = "nest start";
        scripts.dev = "nest start --watch";
        scripts.build = "nest build";
        break;
    }

    return scripts;
  }

  /**
   * Get frontend-specific scripts
   * @param {Object} config - Project configuration
   * @returns {Object} - Frontend scripts
   */
  getFrontendScripts(config) {
    const scripts = {};

    for (const frontend of config.frontend) {
      switch (frontend) {
        case TECHNOLOGY_OPTIONS.FRONTEND.REACT:
        case TECHNOLOGY_OPTIONS.FRONTEND.VUE:
          scripts.dev = "vite";
          scripts.build = "vite build";
          scripts.preview = "vite preview";
          break;
        case TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS:
          scripts.dev = "next dev";
          scripts.build = "next build";
          scripts.start = "next start";
          break;
      }
    }

    return scripts;
  }

  /**
   * Generate project description
   * @param {Object} config - Project configuration
   * @returns {string} - Project description
   */
  generateDescription(config) {
    const parts = [];
    
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      parts.push(config.backend);
    }
    
    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)) {
      parts.push(config.frontend.join(", "));
    }
    
    return `A ${parts.join(" + ")} application`;
  }

  /**
   * Generate keywords
   * @param {Object} config - Project configuration
   * @returns {Array<string>} - Keywords array
   */
  generateKeywords(config) {
    const keywords = ["javascript", "nodejs"];
    
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      keywords.push(config.backend);
    }
    
    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)) {
      keywords.push(...config.frontend);
    }
    
    if (config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE) {
      keywords.push(config.database);
    }
    
    if (config.typescript) {
      keywords.push("typescript");
    }
    
    return keywords;
  }

  /**
   * Write package.json to file
   * @param {Object} packageJson - Package.json object
   * @param {string} projectDir - Project directory
   */
  async writePackageJson(packageJson, projectDir) {
    const packageJsonPath = path.join(projectDir, "package.json");
    console.log(`📦 Writing package.json to: ${packageJsonPath}`);
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(`✅ Package.json written successfully`);
  }

  /**
   * Merge package.json hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async mergePackageJson(context) {
    console.log("📦 PackageJsonPlugin: Merging package.json files");
    return context;
  }

  /**
   * Post-generation hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async postGenerate(context) {
    console.log("📦 PackageJsonPlugin: Package.json generation completed");
    return context;
  }
}

export default PackageJsonPlugin;
