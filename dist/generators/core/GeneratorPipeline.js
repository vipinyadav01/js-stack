import { BaseGenerator } from "./BaseGenerator.js";
import { HOOK_TYPES } from "./GeneratorPlugin.js";

/**
 * Generator Pipeline for JS Stack Generator
 * Orchestrates the generation process through a series of stages
 */

export class GeneratorPipeline {
  constructor() {
    this.stages = [];
    this.context = {};
    this.results = {
      stages: [],
      overall: {
        success: true,
        errors: [],
        warnings: [],
      },
    };
  }

  /**
   * Add a stage to the pipeline
   * @param {string} name - Stage name
   * @param {Function} stageFunction - Stage function
   * @param {Object} options - Stage options
   */
  addStage(name, stageFunction, options = {}) {
    const stage = {
      name,
      function: stageFunction,
      options: {
        required: true,
        timeout: 30000, // 30 seconds default timeout
        retries: 0,
        ...options,
      },
    };

    this.stages.push(stage);
  }

  /**
   * Remove a stage from the pipeline
   * @param {string} name - Stage name to remove
   */
  removeStage(name) {
    this.stages = this.stages.filter((stage) => stage.name !== name);
  }

  /**
   * Get stage by name
   * @param {string} name - Stage name
   * @returns {Object|null} - Stage object or null
   */
  getStage(name) {
    return this.stages.find((stage) => stage.name === name) || null;
  }

  /**
   * Set pipeline context
   * @param {Object} context - Context object
   */
  setContext(context) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Get pipeline context
   * @returns {Object} - Context object
   */
  getContext() {
    return this.context;
  }

  /**
   * Execute the pipeline
   * @param {Object} config - Project configuration
   * @returns {Promise<Object>} - Pipeline execution results
   */
  async execute(config) {
    console.log(
      `🚀 Starting pipeline execution with ${this.stages.length} stages`,
    );

    this.results = {
      stages: [],
      overall: {
        success: true,
        errors: [],
        warnings: [],
      },
    };

    for (let i = 0; i < this.stages.length; i++) {
      const stage = this.stages[i];
      const stageResult = await this.executeStage(stage, config, i + 1);

      this.results.stages.push(stageResult);

      // If stage failed and is required, stop pipeline
      if (!stageResult.success && stage.options.required) {
        this.results.overall.success = false;
        this.results.overall.errors.push(
          `Stage '${stage.name}' failed: ${stageResult.error}`,
        );
        break;
      }

      // Add warnings
      if (stageResult.warnings.length > 0) {
        this.results.overall.warnings.push(...stageResult.warnings);
      }
    }

    console.log(
      `✅ Pipeline execution completed. Success: ${this.results.overall.success}`,
    );
    return this.results;
  }

  /**
   * Execute a single stage
   * @param {Object} stage - Stage to execute
   * @param {Object} config - Project configuration
   * @param {number} stageNumber - Stage number
   * @returns {Promise<Object>} - Stage execution result
   */
  async executeStage(stage, config, stageNumber) {
    const startTime = Date.now();

    console.log(
      `[${stageNumber}/${this.stages.length}] 🔧 Executing stage: ${stage.name}`,
    );

    try {
      // Execute stage with timeout
      const result = await this.executeWithTimeout(
        stage.function(config, this.context),
        stage.options.timeout,
      );

      const duration = Date.now() - startTime;

      console.log(`✅ Stage '${stage.name}' completed in ${duration}ms`);

      return {
        name: stage.name,
        success: true,
        result,
        duration,
        warnings: [],
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(
        `❌ Stage '${stage.name}' failed after ${duration}ms:`,
        error.message,
      );

      return {
        name: stage.name,
        success: false,
        error: error.message,
        duration,
        warnings: [],
      };
    }
  }

  /**
   * Execute function with timeout
   * @param {Promise} promise - Promise to execute
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} - Promise with timeout
   */
  async executeWithTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Stage execution timed out after ${timeout}ms`));
        }, timeout);
      }),
    ]);
  }

  /**
   * Get pipeline statistics
   * @returns {Object} - Pipeline statistics
   */
  getStats() {
    const totalDuration = this.results.stages.reduce(
      (sum, stage) => sum + stage.duration,
      0,
    );
    const successfulStages = this.results.stages.filter(
      (stage) => stage.success,
    ).length;
    const failedStages = this.results.stages.filter(
      (stage) => !stage.success,
    ).length;

    return {
      totalStages: this.stages.length,
      executedStages: this.results.stages.length,
      successfulStages,
      failedStages,
      totalDuration,
      averageStageDuration:
        this.results.stages.length > 0
          ? totalDuration / this.results.stages.length
          : 0,
      successRate:
        this.results.stages.length > 0
          ? (successfulStages / this.results.stages.length) * 100
          : 0,
    };
  }

  /**
   * Get stage results
   * @returns {Array<Object>} - Array of stage results
   */
  getStageResults() {
    return this.results.stages;
  }

  /**
   * Get overall results
   * @returns {Object} - Overall pipeline results
   */
  getOverallResults() {
    return this.results.overall;
  }

  /**
   * Check if pipeline is successful
   * @returns {boolean} - True if pipeline executed successfully
   */
  isSuccessful() {
    return this.results.overall.success;
  }

  /**
   * Get pipeline errors
   * @returns {Array<string>} - Array of error messages
   */
  getErrors() {
    return this.results.overall.errors;
  }

  /**
   * Get pipeline warnings
   * @returns {Array<string>} - Array of warning messages
   */
  getWarnings() {
    return this.results.overall.warnings;
  }
}

/**
 * Predefined pipeline stages
 */
export const PIPELINE_STAGES = {
  VALIDATE_CONFIG: "validateConfig",
  CREATE_STRUCTURE: "createStructure",
  PROCESS_TEMPLATES: "processTemplates",
  MERGE_PACKAGES: "mergePackages",
  INSTALL_DEPENDENCIES: "installDependencies",
  RUN_HEALTH_CHECKS: "runHealthChecks",
  FINALIZE: "finalize",
};

/**
 * Create a standard pipeline for project generation
 * @returns {GeneratorPipeline} - Configured pipeline
 */
export function createStandardPipeline() {
  const pipeline = new GeneratorPipeline();

  // Stage 1: Validate configuration
  pipeline.addStage(
    PIPELINE_STAGES.VALIDATE_CONFIG,
    async (config, context) => {
      // Configuration validation logic
      return { validated: true };
    },
    { required: true, timeout: 5000 },
  );

  // Stage 2: Create project structure
  pipeline.addStage(
    PIPELINE_STAGES.CREATE_STRUCTURE,
    async (config, context) => {
      // Project structure creation logic
      return { structureCreated: true };
    },
    { required: true, timeout: 10000 },
  );

  // Stage 3: Process templates
  pipeline.addStage(
    PIPELINE_STAGES.PROCESS_TEMPLATES,
    async (config, context) => {
      // Template processing logic
      return { templatesProcessed: true };
    },
    { required: true, timeout: 15000 },
  );

  // Stage 4: Merge package.json files
  pipeline.addStage(
    PIPELINE_STAGES.MERGE_PACKAGES,
    async (config, context) => {
      // Package.json merging logic
      return { packagesMerged: true };
    },
    { required: true, timeout: 5000 },
  );

  // Stage 5: Install dependencies (optional)
  pipeline.addStage(
    PIPELINE_STAGES.INSTALL_DEPENDENCIES,
    async (config, context) => {
      if (config.install) {
        // Dependency installation logic
        return { dependenciesInstalled: true };
      }
      return { skipped: true };
    },
    { required: false, timeout: 60000 },
  );

  // Stage 6: Run health checks
  pipeline.addStage(
    PIPELINE_STAGES.RUN_HEALTH_CHECKS,
    async (config, context) => {
      // Health check logic
      return { healthChecksPassed: true };
    },
    { required: false, timeout: 10000 },
  );

  // Stage 7: Finalize
  pipeline.addStage(
    PIPELINE_STAGES.FINALIZE,
    async (config, context) => {
      // Finalization logic
      return { finalized: true };
    },
    { required: true, timeout: 5000 },
  );

  return pipeline;
}

export default {
  GeneratorPipeline,
  PIPELINE_STAGES,
  createStandardPipeline,
};
