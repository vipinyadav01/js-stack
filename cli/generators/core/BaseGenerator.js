import { PluginManager } from "./PluginManager.js";
import { PluginContext } from "./GeneratorPlugin.js";

/**
 * Base Generator Class for JS Stack Generator
 * Provides common functionality for all generator types
 */

export class BaseGenerator {
  constructor(config) {
    this.config = config;
    this.pluginManager = new PluginManager();
    this.context = new PluginContext();
    this.results = {
      success: [],
      failed: [],
      warnings: [],
    };
  }

  /**
   * Register a plugin
   * @param {GeneratorPlugin} plugin - Plugin to register
   */
  registerPlugin(plugin) {
    this.pluginManager.register(plugin);
  }

  /**
   * Register multiple plugins
   * @param {Array<GeneratorPlugin>} plugins - Plugins to register
   */
  registerPlugins(plugins) {
    for (const plugin of plugins) {
      this.registerPlugin(plugin);
    }
  }

  /**
   * Get plugin manager
   * @returns {PluginManager} - Plugin manager instance
   */
  getPluginManager() {
    return this.pluginManager;
  }

  /**
   * Set generation context
   * @param {Object} context - Generation context
   */
  setContext(context) {
    Object.assign(this.context, context);
  }

  /**
   * Execute pre-generation hooks
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Hook results
   */
  async executePreGenerationHooks(config) {
    return await this.pluginManager.executeHook("preGenerate", {
      config,
      context: this.context,
    });
  }

  /**
   * Execute post-generation hooks
   * @param {Object} config - Project configuration
   * @param {Object} results - Generation results
   * @returns {Promise<Object>} - Hook results
   */
  async executePostGenerationHooks(config, results) {
    return await this.pluginManager.executeHook("postGenerate", {
      config,
      results,
      context: this.context,
    });
  }

  /**
   * Execute validation hooks
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Validation results
   */
  async executeValidationHooks(config) {
    return await this.pluginManager.executeHook("validateConfig", {
      config,
      context: this.context,
    });
  }

  /**
   * Generate project using plugins
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Generation results
   */
  async generate(config) {
    try {
      // Execute pre-generation hooks
      await this.executePreGenerationHooks(config);

      // Execute plugins
      const pluginResults = await this.pluginManager.executePlugins(
        config,
        this.context,
      );

      // Execute post-generation hooks
      await this.executePostGenerationHooks(config, pluginResults);

      // Merge results
      this.results = {
        success: [...this.results.success, ...pluginResults.success],
        failed: [...this.results.failed, ...pluginResults.failed],
        warnings: [...this.results.warnings, ...pluginResults.warnings],
      };

      return this.results;
    } catch (error) {
      console.error("❌ Generation failed:", error.message);
      throw error;
    }
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Promise<Object>} - Validation results
   */
  async validateConfig(config) {
    try {
      const validationResults = await this.executeValidationHooks(config);
      return {
        isValid: true,
        results: validationResults,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        isValid: false,
        results: null,
        errors: [error.message],
        warnings: [],
      };
    }
  }

  /**
   * Get generation results
   * @returns {Object} - Generation results
   */
  getResults() {
    return this.results;
  }

  /**
   * Get generation statistics
   * @returns {Object} - Generation statistics
   */
  getStats() {
    return {
      totalOperations: this.results.success.length + this.results.failed.length,
      successCount: this.results.success.length,
      failureCount: this.results.failed.length,
      warningCount: this.results.warnings.length,
      successRate:
        (this.results.success.length /
          (this.results.success.length + this.results.failed.length)) *
        100,
      pluginStats: this.pluginManager.getStats(),
    };
  }

  /**
   * Cleanup generator resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    await this.pluginManager.cleanup();
  }

  /**
   * Abstract method to be implemented by subclasses
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Generation results
   */
  async generateProject(config) {
    throw new Error("generateProject method must be implemented by subclass");
  }
}

export default BaseGenerator;
