import path from "path";
import { TECHNOLOGY_OPTIONS, CLIOptionsSchema } from "./ValidationSchemas.js";
import { DefaultConfigHelper } from "./DefaultConfigs.js";

/**
 * Configuration resolver for JS Stack Generator
 * Handles CLI arguments, prompts, and defaults resolution
 */

/**
 * CLI Arguments Parser
 */
export class CLIArgsParser {
  /**
   * Parse CLI arguments into structured configuration
   * @param {Object} cliArgs - Raw CLI arguments
   * @returns {Object} - Parsed configuration
   */
  static parse(cliArgs) {
    const config = {};

    // Basic project info
    if (cliArgs.projectName) {
      config.projectName = cliArgs.projectName;
    }

    // Technology selections
    if (cliArgs.database) {
      config.database = cliArgs.database;
    }

    if (cliArgs.orm) {
      config.orm = cliArgs.orm;
    }

    if (cliArgs.backend) {
      config.backend = cliArgs.backend;
    }

    if (cliArgs.frontend) {
      // Handle both single and multiple frontend selections
      config.frontend = Array.isArray(cliArgs.frontend) 
        ? cliArgs.frontend 
        : [cliArgs.frontend];
    }

    if (cliArgs.auth) {
      config.auth = cliArgs.auth;
    }

    if (cliArgs.addons) {
      // Handle comma-separated addons
      config.addons = Array.isArray(cliArgs.addons) 
        ? cliArgs.addons 
        : cliArgs.addons.split(',').map(s => s.trim());
    }

    // Package manager (handle both --pm and --packageManager)
    if (cliArgs.pm || cliArgs.packageManager) {
      config.packageManager = cliArgs.pm || cliArgs.packageManager;
    }

    // Boolean flags
    config.typescript = cliArgs.typescript || false;
    config.git = cliArgs.git !== false; // Default to true unless explicitly false
    config.install = cliArgs.install !== false; // Default to true unless explicitly false

    // CLI-specific options
    config.ci = cliArgs.ci || cliArgs.yes || false;
    config.verbose = cliArgs.verbose || false;
    config.dryRun = cliArgs.dryRun || false;
    config.interactive = cliArgs.interactive !== false;

    // Preset handling
    if (cliArgs.preset) {
      config.preset = cliArgs.preset;
    }

    if (cliArgs.template) {
      config.template = cliArgs.template;
    }

    return config;
  }

  /**
   * Validate parsed CLI arguments
   * @param {Object} parsedArgs - Parsed CLI arguments
   * @returns {Object} - Validation result
   */
  static async validate(parsedArgs) {
    try {
      const validatedArgs = await CLIOptionsSchema.validate(parsedArgs, {
        abortEarly: false,
        stripUnknown: true,
      });
      return {
        isValid: true,
        args: validatedArgs,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        isValid: false,
        args: null,
        errors: error.errors || [error.message],
        warnings: [],
      };
    }
  }
}

/**
 * Configuration Resolver
 */
export class ConfigResolver {
  constructor() {
    this.cliParser = new CLIArgsParser();
    this.defaultHelper = new DefaultConfigHelper();
  }

  /**
   * Resolve configuration from CLI arguments
   * @param {Object} cliArgs - Raw CLI arguments
   * @returns {Object} - Resolved configuration
   */
  async fromCliArgs(cliArgs) {
    const parsed = this.cliParser.parse(cliArgs);
    const validation = await this.cliParser.validate(parsed);

    if (!validation.isValid) {
      throw new Error(`Invalid CLI arguments: ${validation.errors.join(', ')}`);
    }

    return validation.args;
  }

  /**
   * Resolve configuration from prompts
   * @param {Object} baseConfig - Base configuration from CLI
   * @returns {Object} - Configuration from prompts
   */
  async fromPrompts(baseConfig) {
    // Import prompts dynamically to avoid circular dependencies
    const { collectProjectConfig } = await import("../prompts-modern.js");
    
    // Extract project name if available
    const projectName = baseConfig.projectName;
    
    // Create options object for prompts
    const promptOptions = {
      database: baseConfig.database,
      orm: baseConfig.orm,
      backend: baseConfig.backend,
      frontend: baseConfig.frontend,
      auth: baseConfig.auth,
      addons: baseConfig.addons,
      pm: baseConfig.packageManager,
      typescript: baseConfig.typescript,
      git: baseConfig.git,
      install: baseConfig.install,
      ci: baseConfig.ci,
    };

    // Collect configuration from prompts
    const promptConfig = await collectProjectConfig(projectName, promptOptions);
    
    return promptConfig;
  }

  /**
   * Resolve configuration from preset
   * @param {string} presetName - Preset name
   * @returns {Object} - Preset configuration
   */
  async fromPreset(presetName) {
    const preset = this.defaultHelper.getPresetConfig(presetName);
    
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    return preset.config;
  }

  /**
   * Resolve configuration from defaults
   * @param {string} defaultType - Default configuration type
   * @returns {Object} - Default configuration
   */
  async fromDefaults(defaultType = "basic") {
    return this.defaultHelper.getDefaultConfig(defaultType);
  }

  /**
   * Merge multiple configuration sources
   * @param {Object} configs - Array of configuration objects
   * @returns {Object} - Merged configuration
   */
  mergeConfigs(...configs) {
    const merged = {};
    
    for (const config of configs) {
      if (!config) continue;
      
      // Merge basic properties
      Object.assign(merged, config);
      
      // Merge arrays (addons, frontend)
      if (config.addons) {
        merged.addons = [...new Set([...(merged.addons || []), ...config.addons])];
      }
      
      if (config.frontend) {
        merged.frontend = config.frontend; // Frontend is usually a complete replacement
      }
    }
    
    return merged;
  }

  /**
   * Resolve complete configuration
   * @param {Object} cliArgs - Raw CLI arguments
   * @param {Object} options - Resolution options
   * @returns {Object} - Complete resolved configuration
   */
  async resolve(cliArgs, options = {}) {
    const {
      usePreset = false,
      useDefaults = false,
      interactive = true,
      defaultType = "basic",
    } = options;

    let resolvedConfig = {};

    try {
      // Step 1: Parse CLI arguments
      const cliConfig = await this.fromCliArgs(cliArgs);
      resolvedConfig = this.mergeConfigs(resolvedConfig, cliConfig);

      // Step 2: Handle preset
      if (usePreset && cliConfig.preset) {
        const presetConfig = await this.fromPreset(cliConfig.preset);
        resolvedConfig = this.mergeConfigs(resolvedConfig, presetConfig);
      }

      // Step 3: Handle defaults
      if (useDefaults) {
        const defaultConfig = await this.fromDefaults(defaultType);
        resolvedConfig = this.mergeConfigs(resolvedConfig, defaultConfig);
      }

      // Step 4: Interactive prompts (if enabled and not in CI mode)
      if (interactive && !resolvedConfig.ci) {
        const promptConfig = await this.fromPrompts(resolvedConfig);
        resolvedConfig = this.mergeConfigs(resolvedConfig, promptConfig);
      }

      // Step 5: Apply technology-specific defaults
      resolvedConfig = this.defaultHelper.applyTechnologyDefaults(resolvedConfig);

      // Step 6: Set project directory
      if (resolvedConfig.projectName && !resolvedConfig.projectDir) {
        resolvedConfig.projectDir = path.resolve(process.cwd(), resolvedConfig.projectName);
      }

      return resolvedConfig;
    } catch (error) {
      throw new Error(`Configuration resolution failed: ${error.message}`);
    }
  }

  /**
   * Find missing configuration properties
   * @param {Object} config - Current configuration
   * @returns {Array} - Array of missing property names
   */
  findMissingConfig(config) {
    const required = [
      'projectName',
      'database',
      'orm',
      'backend',
      'frontend',
      'auth',
      'packageManager',
    ];

    return required.filter(prop => !config[prop]);
  }

  /**
   * Check if configuration is complete
   * @param {Object} config - Configuration to check
   * @returns {boolean} - True if configuration is complete
   */
  isConfigComplete(config) {
    const missing = this.findMissingConfig(config);
    return missing.length === 0;
  }

  /**
   * Get configuration summary
   * @param {Object} config - Configuration
   * @returns {Object} - Configuration summary
   */
  getConfigSummary(config) {
    return {
      projectName: config.projectName,
      database: config.database,
      orm: config.orm,
      backend: config.backend,
      frontend: config.frontend,
      auth: config.auth,
      packageManager: config.packageManager,
      addons: config.addons,
      typescript: config.typescript,
      git: config.git,
      install: config.install,
      isComplete: this.isConfigComplete(config),
      missing: this.findMissingConfig(config),
    };
  }
}

/**
 * Configuration resolution helper functions
 */
export class ConfigResolutionHelper {
  /**
   * Resolve configuration with error handling
   * @param {Object} cliArgs - CLI arguments
   * @param {Object} options - Resolution options
   * @returns {Promise<Object>} - Resolution result
   */
  static async resolveWithErrorHandling(cliArgs, options = {}) {
    const resolver = new ConfigResolver();
    
    try {
      const config = await resolver.resolve(cliArgs, options);
      return {
        success: true,
        config,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        success: false,
        config: null,
        errors: [error.message],
        warnings: [],
      };
    }
  }

  /**
   * Validate resolved configuration
   * @param {Object} config - Resolved configuration
   * @returns {Promise<Object>} - Validation result
   */
  static async validateResolvedConfig(config) {
    const { ValidationHelper } = await import("./ValidationSchemas.js");
    return await ValidationHelper.validateProjectConfig(config);
  }

  /**
   * Get configuration recommendations
   * @param {Object} config - Current configuration
   * @returns {Array} - Array of recommendations
   */
  static getRecommendations(config) {
    const recommendations = [];

    // TypeScript recommendations
    if (!config.typescript) {
      if (config.frontend?.includes(TECHNOLOGY_OPTIONS.FRONTEND.REACT)) {
        recommendations.push("Consider enabling TypeScript for better React development experience");
      }
      if (config.backend === TECHNOLOGY_OPTIONS.BACKEND.NESTJS) {
        recommendations.push("TypeScript is recommended for NestJS projects");
      }
    }

    // Testing recommendations
    if (!config.addons?.includes(TECHNOLOGY_OPTIONS.ADDON.TESTING)) {
      recommendations.push("Consider adding testing framework for better code quality");
    }

    // ESLint recommendations
    if (!config.addons?.includes(TECHNOLOGY_OPTIONS.ADDON.ESLINT)) {
      recommendations.push("Consider adding ESLint for code linting");
    }

    // Prettier recommendations
    if (!config.addons?.includes(TECHNOLOGY_OPTIONS.ADDON.PRETTIER)) {
      recommendations.push("Consider adding Prettier for code formatting");
    }

    return recommendations;
  }
}

export default {
  CLIArgsParser,
  ConfigResolver,
  ConfigResolutionHelper,
};
