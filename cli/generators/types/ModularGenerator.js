import path from "path";
import { BaseGenerator } from "../core/BaseGenerator.js";
import { GeneratorPipeline, createStandardPipeline } from "../core/GeneratorPipeline.js";
import PackageJsonPlugin from "../plugins/PackageJsonPlugin.js";
import FilePlugin from "../plugins/FilePlugin.js";
import DependencyPlugin from "../plugins/DependencyPlugin.js";
import AnalyticsPlugin from "../plugins/AnalyticsPlugin.js";
import ReadmePlugin from "../plugins/ReadmePlugin.js";
import EntryPointPlugin from "../plugins/EntryPointPlugin.js";
import IntegrationPlugin from "../plugins/IntegrationPlugin.js";

/**
 * Modular Generator for JS Stack Generator
 * Uses plugin-based architecture for project generation
 */

export class ModularGenerator extends BaseGenerator {
  constructor(config) {
    super(config);
    this.pipeline = createStandardPipeline();
    this.registerDefaultPlugins();
  }

  /**
   * Register default plugins
   */
  registerDefaultPlugins() {
    // Register core plugins
    this.registerPlugin(new AnalyticsPlugin());
    this.registerPlugin(new PackageJsonPlugin());
    this.registerPlugin(new FilePlugin());
    this.registerPlugin(new IntegrationPlugin());
    this.registerPlugin(new DependencyPlugin());
    this.registerPlugin(new EntryPointPlugin());
    this.registerPlugin(new ReadmePlugin());
  }

  /**
   * Generate project using modular approach
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Generation results
   */
  async generateProject(config) {
    try {
      console.log("🚀 ModularGenerator: Starting project generation");

      // Set up pipeline context
      this.pipeline.setContext({
        projectDir: config.projectDir,
        templateDir: this.getTemplateDir(),
        config,
        transaction: this.context.transaction,
      });

      // Set up base generator context
      this.setContext({
        projectDir: config.projectDir,
        templateDir: this.getTemplateDir(),
        config,
        transaction: this.context.transaction,
      });

      // Ensure project directory exists
      const fs = await import("fs-extra");
      await fs.ensureDir(config.projectDir);

      // Execute pipeline
      const pipelineResults = await this.pipeline.execute(config);

      // Execute plugins
      const pluginResults = await this.generate(config);

      // Combine results
      const combinedResults = this.combineResults(pipelineResults, pluginResults);

      console.log("✅ ModularGenerator: Project generation completed");
      return combinedResults;
    } catch (error) {
      console.error("❌ ModularGenerator: Project generation failed:", error.message);
      throw error;
    }
  }

  /**
   * Get template directory
   * @returns {string} - Template directory path
   */
  getTemplateDir() {
    return path.join(process.cwd(), "templates");
  }

  /**
   * Combine pipeline and plugin results
   * @param {Object} pipelineResults - Pipeline execution results
   * @param {Object} pluginResults - Plugin execution results
   * @returns {Object} - Combined results
   */
  combineResults(pipelineResults, pluginResults) {
    return {
      success: pipelineResults.overall.success && pluginResults.success.length > 0,
      pipeline: pipelineResults,
      plugins: pluginResults,
      stats: {
        pipelineStats: this.pipeline.getStats(),
        pluginStats: this.getStats(),
        totalDuration: this.calculateTotalDuration(pipelineResults, pluginResults),
      },
      summary: this.generateSummary(pipelineResults, pluginResults),
    };
  }

  /**
   * Calculate total duration
   * @param {Object} pipelineResults - Pipeline results
   * @param {Object} pluginResults - Plugin results
   * @returns {number} - Total duration in milliseconds
   */
  calculateTotalDuration(pipelineResults, pluginResults) {
    const pipelineDuration = pipelineResults.stages.reduce((sum, stage) => sum + stage.duration, 0);
    // Plugin duration would need to be tracked in the plugin system
    return pipelineDuration;
  }

  /**
   * Generate summary
   * @param {Object} pipelineResults - Pipeline results
   * @param {Object} pluginResults - Plugin results
   * @returns {Object} - Generation summary
   */
  generateSummary(pipelineResults, pluginResults) {
    const successfulStages = pipelineResults.stages.filter(stage => stage.success).length;
    const successfulPlugins = pluginResults.success.length;
    const failedPlugins = pluginResults.failed.length;

    return {
      totalStages: pipelineResults.stages.length,
      successfulStages,
      totalPlugins: successfulPlugins + failedPlugins,
      successfulPlugins,
      failedPlugins,
      successRate: ((successfulStages + successfulPlugins) / (pipelineResults.stages.length + successfulPlugins + failedPlugins)) * 100,
      warnings: [...pipelineResults.overall.warnings, ...pluginResults.warnings],
      errors: [...pipelineResults.overall.errors, ...pluginResults.failed.map(f => f.error)],
    };
  }

  /**
   * Get pipeline instance
   * @returns {GeneratorPipeline} - Pipeline instance
   */
  getPipeline() {
    return this.pipeline;
  }

  /**
   * Add custom stage to pipeline
   * @param {string} name - Stage name
   * @param {Function} stageFunction - Stage function
   * @param {Object} options - Stage options
   */
  addPipelineStage(name, stageFunction, options = {}) {
    this.pipeline.addStage(name, stageFunction, options);
  }

  /**
   * Remove stage from pipeline
   * @param {string} name - Stage name
   */
  removePipelineStage(name) {
    this.pipeline.removeStage(name);
  }

  /**
   * Get generation statistics
   * @returns {Object} - Generation statistics
   */
  getGenerationStats() {
    return {
      ...this.getStats(),
      pipelineStats: this.pipeline.getStats(),
      pluginCount: this.pluginManager.getAllPlugins().length,
      applicablePlugins: this.pluginManager.getApplicablePlugins(this.config).length,
    };
  }
}

export default ModularGenerator;
