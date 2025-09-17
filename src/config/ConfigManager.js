import path from "path";
import chalk from "chalk";
import { ValidationHelper, TECHNOLOGY_OPTIONS } from "./ValidationSchemas.js";
import { DefaultConfigHelper } from "./DefaultConfigs.js";
import { ConfigResolver, ConfigResolutionHelper } from "./ConfigResolver.js";

/**
 * Centralized Configuration Manager for JS Stack Generator
 * Orchestrates configuration collection, validation, and resolution
 */

export class ConfigManager {
  constructor() {
    this.resolver = new ConfigResolver();
    this.defaultHelper = new DefaultConfigHelper();
    this.validationHelper = new ValidationHelper();
  }

  /**
   * Create a new ConfigManager instance
   * @param {Object} cliArgs - CLI arguments
   * @returns {ConfigManager} - ConfigManager instance
   */
  static async create(cliArgs) {
    const manager = new ConfigManager();
    await manager.initialize(cliArgs);
    return manager;
  }

  /**
   * Initialize the configuration manager
   * @param {Object} cliArgs - CLI arguments
   */
  async initialize(cliArgs) {
    this.cliArgs = cliArgs;
    this.resolutionOptions = this.determineResolutionOptions(cliArgs);
  }

  /**
   * Determine resolution options based on CLI arguments
   * @param {Object} cliArgs - CLI arguments
   * @returns {Object} - Resolution options
   */
  determineResolutionOptions(cliArgs) {
    return {
      usePreset: !!cliArgs.preset,
      useDefaults: !!cliArgs.yes || !!cliArgs.ci,
      interactive: !cliArgs.ci && !cliArgs.yes,
      defaultType: cliArgs.yes ? "basic" : "basic",
    };
  }

  /**
   * Resolve configuration interactively
   * @returns {Object} - Resolved configuration
   */
  async resolveInteractively() {
    try {
      console.log(chalk.blue("🔧 Resolving configuration..."));
      
      const config = await this.resolver.resolve(this.cliArgs, this.resolutionOptions);
      
      console.log(chalk.green("✅ Configuration resolved successfully"));
      return config;
    } catch (error) {
      console.error(chalk.red("❌ Configuration resolution failed:"), error.message);
      throw error;
    }
  }

  /**
   * Resolve configuration with error handling
   * @returns {Object} - Resolution result
   */
  async resolveWithErrorHandling() {
    return await ConfigResolutionHelper.resolveWithErrorHandling(
      this.cliArgs,
      this.resolutionOptions,
    );
  }

  /**
   * Validate resolved configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} - Validation result
   */
  async validateConfig(config) {
    try {
      console.log(chalk.blue("🔍 Validating configuration..."));
      
      // Basic validation
      const basicValidation = await this.validationHelper.validateProjectConfig(config);
      
      if (!basicValidation.isValid) {
        return basicValidation;
      }

      // Compatibility validation
      const compatibilityValidation = await this.validationHelper.validateCompatibility(config);
      
      return {
        isValid: basicValidation.isValid && compatibilityValidation.isValid,
        config: basicValidation.config,
        errors: [...basicValidation.errors, ...compatibilityValidation.errors],
        warnings: [...basicValidation.warnings, ...compatibilityValidation.warnings],
      };
    } catch (error) {
      return {
        isValid: false,
        config: null,
        errors: [error.message],
        warnings: [],
      };
    }
  }

  /**
   * Get configuration summary
   * @param {Object} config - Configuration
   * @returns {Object} - Configuration summary
   */
  getConfigSummary(config) {
    return this.resolver.getConfigSummary(config);
  }

  /**
   * Get configuration recommendations
   * @param {Object} config - Configuration
   * @returns {Array} - Array of recommendations
   */
  getRecommendations(config) {
    return ConfigResolutionHelper.getRecommendations(config);
  }

  /**
   * Display configuration summary
   * @param {Object} config - Configuration
   */
  displayConfigSummary(config) {
    const summary = this.getConfigSummary(config);
    const recommendations = this.getRecommendations(config);

    console.log(chalk.blue("\n📋 Configuration Summary"));
    console.log(chalk.gray("─".repeat(50)));
    
    console.log(chalk.cyan("Project:"), summary.projectName);
    console.log(chalk.cyan("Database:"), summary.database);
    console.log(chalk.cyan("ORM:"), summary.orm);
    console.log(chalk.cyan("Backend:"), summary.backend);
    console.log(chalk.cyan("Frontend:"), summary.frontend.join(", "));
    console.log(chalk.cyan("Auth:"), summary.auth);
    console.log(chalk.cyan("Package Manager:"), summary.packageManager);
    console.log(chalk.cyan("Addons:"), summary.addons.join(", ") || "None");
    console.log(chalk.cyan("TypeScript:"), summary.typescript ? "Yes" : "No");
    console.log(chalk.cyan("Git:"), summary.git ? "Yes" : "No");
    console.log(chalk.cyan("Install:"), summary.install ? "Yes" : "No");

    if (recommendations.length > 0) {
      console.log(chalk.yellow("\n💡 Recommendations:"));
      recommendations.forEach(rec => {
        console.log(chalk.gray(`  • ${rec}`));
      });
    }

    console.log(chalk.gray("─".repeat(50)));
  }

  /**
   * Display validation results
   * @param {Object} validationResult - Validation result
   */
  displayValidationResults(validationResult) {
    if (validationResult.isValid) {
      console.log(chalk.green("✅ Configuration is valid"));
      
      if (validationResult.warnings.length > 0) {
        console.log(chalk.yellow("\n⚠️  Warnings:"));
        validationResult.warnings.forEach(warning => {
          console.log(chalk.gray(`  • ${warning}`));
        });
      }
    } else {
      console.log(chalk.red("❌ Configuration validation failed"));
      
      if (validationResult.errors.length > 0) {
        console.log(chalk.red("\nErrors:"));
        validationResult.errors.forEach(error => {
          console.log(chalk.gray(`  • ${error}`));
        });
      }
    }
  }

  /**
   * Get available presets
   * @returns {Array} - Array of available presets
   */
  getAvailablePresets() {
    return this.defaultHelper.getAvailablePresets();
  }

  /**
   * Display available presets
   */
  displayAvailablePresets() {
    const presets = this.getAvailablePresets();
    
    console.log(chalk.blue("\n🎯 Available Presets:"));
    console.log(chalk.gray("─".repeat(50)));
    
    presets.forEach(preset => {
      console.log(chalk.cyan(`  ${preset.key}`));
      console.log(chalk.gray(`    ${preset.description}`));
    });
    
    console.log(chalk.gray("─".repeat(50)));
  }

  /**
   * Check if configuration is complete
   * @param {Object} config - Configuration to check
   * @returns {boolean} - True if complete
   */
  isConfigComplete(config) {
    return this.resolver.isConfigComplete(config);
  }

  /**
   * Find missing configuration properties
   * @param {Object} config - Configuration to check
   * @returns {Array} - Array of missing properties
   */
  findMissingConfig(config) {
    return this.resolver.findMissingConfig(config);
  }

  /**
   * Apply technology-specific defaults to configuration
   * @param {Object} config - Configuration to enhance
   * @returns {Object} - Enhanced configuration
   */
  applyTechnologyDefaults(config) {
    return this.defaultHelper.applyTechnologyDefaults(config);
  }

  /**
   * Merge configuration with defaults
   * @param {Object} config - Base configuration
   * @param {string} defaultType - Default configuration type
   * @returns {Object} - Merged configuration
   */
  mergeWithDefaults(config, defaultType = "basic") {
    const defaults = this.defaultHelper.getDefaultConfig(defaultType);
    return this.defaultHelper.mergeConfig(defaults, config);
  }

  /**
   * Get package manager configuration
   * @param {string} packageManager - Package manager name
   * @returns {Object} - Package manager configuration
   */
  getPackageManagerConfig(packageManager) {
    return this.defaultHelper.getPackageManagerConfig(packageManager);
  }

  /**
   * Create configuration from preset
   * @param {string} presetName - Preset name
   * @param {Object} overrides - Configuration overrides
   * @returns {Object} - Configuration from preset
   */
  createFromPreset(presetName, overrides = {}) {
    const preset = this.defaultHelper.getPresetConfig(presetName);
    
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    return this.defaultHelper.mergeConfig(preset.config, overrides);
  }

  /**
   * Export configuration to file
   * @param {Object} config - Configuration to export
   * @param {string} filePath - File path to export to
   */
  async exportConfig(config, filePath) {
    const fs = await import("fs-extra");
    await fs.writeJson(filePath, config, { spaces: 2 });
    console.log(chalk.green(`✅ Configuration exported to ${filePath}`));
  }

  /**
   * Import configuration from file
   * @param {string} filePath - File path to import from
   * @returns {Object} - Imported configuration
   */
  async importConfig(filePath) {
    const fs = await import("fs-extra");
    
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const config = await fs.readJson(filePath);
    console.log(chalk.green(`✅ Configuration imported from ${filePath}`));
    return config;
  }

  /**
   * Get configuration statistics
   * @param {Object} config - Configuration
   * @returns {Object} - Configuration statistics
   */
  getConfigStats(config) {
    return {
      technologies: {
        database: config.database,
        orm: config.orm,
        backend: config.backend,
        frontend: config.frontend?.length || 0,
        auth: config.auth,
      },
      tools: {
        packageManager: config.packageManager,
        addons: config.addons?.length || 0,
        typescript: config.typescript,
        git: config.git,
        install: config.install,
      },
      complexity: this.calculateComplexity(config),
    };
  }

  /**
   * Calculate configuration complexity score
   * @param {Object} config - Configuration
   * @returns {number} - Complexity score (1-10)
   */
  calculateComplexity(config) {
    let score = 1;

    // Database complexity
    if (config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE) score += 1;
    if (config.orm !== TECHNOLOGY_OPTIONS.ORM.NONE) score += 1;

    // Backend complexity
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) score += 1;
    if (config.backend === TECHNOLOGY_OPTIONS.BACKEND.NESTJS) score += 1;

    // Frontend complexity
    if (config.frontend?.length > 0) score += 1;
    if (config.frontend?.includes(TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS)) score += 1;

    // Auth complexity
    if (config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) score += 1;

    // Addons complexity
    score += Math.min(config.addons?.length || 0, 3);

    return Math.min(score, 10);
  }
}

export default ConfigManager;
