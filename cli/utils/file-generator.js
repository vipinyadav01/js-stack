import fs from "fs-extra";
import path from "path";
import {
  TemplateEngine,
  VariableSubstitution,
  DirectoryStructureGenerator,
} from "./template-engine.js";
import { getTemplateDir } from "./file-utils.js";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS = {
  templatesRoot: getTemplateDir(),
  outputRoot: process.cwd(),
  createBackups: false,
  validateStructure: true,
  hookSystem: true,
};

const BASE_STRUCTURE = ["src", "public", "tests", "docs"];

const FRAMEWORK_STRUCTURES = {
  react: [
    "src/components",
    "src/hooks",
    "src/utils",
    "src/styles",
    "public",
    "tests",
  ],
  vue: [
    "src/components",
    "src/composables",
    "src/stores",
    "src/styles",
    "public",
    "tests",
  ],
  angular: [
    "src/app/components",
    "src/app/services",
    "src/app/models",
    "src/assets",
    "src/environments",
  ],
  express: [
    "src/routes",
    "src/middleware",
    "src/controllers",
    "src/models",
    "src/utils",
    "tests",
  ],
  nestjs: [
    "src/modules",
    "src/controllers",
    "src/services",
    "src/entities",
    "src/dto",
    "test",
  ],
};

// ============================================================================
// FILE GENERATOR CLASS
// ============================================================================

/**
 * Advanced file generation system for JS Stack CLI
 * Handles complex project scaffolding with proper directory structures
 */
export class FileGenerator {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.templateEngine = new TemplateEngine();
    this.variableSubstitution = new VariableSubstitution();
    this.directoryGenerator = new DirectoryStructureGenerator();

    this.hooks = new Map();
    this.generationPlan = [];
    this.executionLog = [];
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  /**
   * Generate complete project from configuration
   */
  async generateProject(config) {
    try {
      this.validateConfig(config);

      await this.runHooks("pre-generation", config);

      const context = await this.prepareContext(config);
      this.generationPlan = this.createGenerationPlan(config, context);

      const results = await this.executeGenerationPlan(context);

      await this.runHooks("post-generation", { config, results, context });

      return this.generateFinalReport(results);
    } catch (error) {
      await this.handleGenerationError(error, config);
      throw error;
    }
  }

  /**
   * Generate specific feature
   */
  async generateFeature(featureType, featureConfig, projectContext) {
    const featureTemplatesDir = path.join(
      this.options.templatesRoot,
      featureType,
    );

    if (!(await fs.pathExists(featureTemplatesDir))) {
      throw new Error(`Feature template not found: ${featureType}`);
    }

    const context = { ...projectContext, ...featureConfig };
    const outputDir = featureConfig.outputDir || projectContext.projectPath;

    return await this.templateEngine.processTemplates(
      featureTemplatesDir,
      outputDir,
      context,
      this.options,
    );
  }

  /**
   * Generate project structure based on framework
   */
  async generateProjectStructure(framework, projectPath, options = {}) {
    const structureConfig = this.getFrameworkStructure(framework);

    await this.directoryGenerator.defineStructure(framework, structureConfig);
    await this.directoryGenerator.generateStructure(
      framework,
      projectPath,
      options,
    );
  }

  /**
   * Register generation hook
   */
  addHook(event, callback) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push(callback);
  }

  /**
   * Register variable resolver
   */
  addVariableResolver(name, resolver) {
    this.variableSubstitution.addResolver(name, resolver);
  }

  /**
   * Register variable transformer
   */
  addVariableTransformer(name, transformer) {
    this.variableSubstitution.addTransformer(name, transformer);
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  /**
   * Validate generation configuration
   */
  validateConfig(config) {
    const required = ["projectName", "projectPath"];

    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Normalize project path
    if (!path.isAbsolute(config.projectPath)) {
      config.projectPath = path.join(
        this.options.outputRoot,
        config.projectPath,
      );
    }

    // Validate templates
    if (config.templates) {
      for (const template of config.templates) {
        const templatePath = path.join(this.options.templatesRoot, template);
        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found: ${template}`);
        }
      }
    }
  }

  // ==========================================================================
  // CONTEXT PREPARATION
  // ==========================================================================

  /**
   * Prepare context for template processing
   */
  async prepareContext(config) {
    // Set base variables
    this.variableSubstitution.setVariables({
      ...config,
      _timestamp: new Date().toISOString(),
      _year: new Date().getFullYear(),
    });

    const context = await this.variableSubstitution.getResolvedContext();

    // Add feature helpers
    context.features = config.features || [];
    context.hasFeature = (featureName) =>
      context.features.includes(featureName);

    // Add framework flags
    this.addFrontendFlags(context, config);
    this.addBackendFlags(context, config);

    return context;
  }

  /**
   * Add frontend framework flags to context
   */
  addFrontendFlags(context, config) {
    const frontendList = this.normalizeFrontendList(config.frontend);

    if (frontendList.length > 0) {
      context.frontend = frontendList;
      context.isReact = frontendList.includes("react");
      context.isVue = frontendList.includes("vue");
      context.isAngular = frontendList.includes("angular");
      context.isNextjs = frontendList.includes("nextjs");
      context.isSvelte = frontendList.includes("svelte");
      context.isSvelteKit = frontendList.includes("sveltekit");
    }
  }

  /**
   * Add backend framework flags to context
   */
  addBackendFlags(context, config) {
    if (config.backend) {
      context.isExpress = config.backend === "express";
      context.isFastify = config.backend === "fastify";
      context.isNestjs = config.backend === "nestjs";
      context.isHono = config.backend === "hono";
    }
  }

  /**
   * Normalize frontend list
   */
  normalizeFrontendList(frontend) {
    if (!frontend) return [];
    return Array.isArray(frontend) ? frontend.filter(Boolean) : [frontend];
  }

  // ==========================================================================
  // GENERATION PLAN
  // ==========================================================================

  /**
   * Create generation plan
   */
  createGenerationPlan(config, context) {
    const plan = [];

    // 1. Base structure
    plan.push(
      this.createPlanStep("structure", "base-structure", 1, () =>
        this.generateBaseStructure(config),
      ),
    );

    // 2. Templates
    if (config.templates) {
      config.templates.forEach((template) => {
        plan.push(
          this.createPlanStep("template", template, 2, () =>
            this.processTemplate(template, config, context),
          ),
        );
      });
    }

    // 3. Frontend frameworks
    const frontendList = this.normalizeFrontendList(config.frontend);
    frontendList.forEach((frontend) => {
      plan.push(
        this.createPlanStep("framework", `frontend-${frontend}`, 3, () =>
          this.generateFramework("frontend", frontend, config, context),
        ),
      );
    });

    // 4. Backend framework
    if (config.backend) {
      plan.push(
        this.createPlanStep("framework", `backend-${config.backend}`, 3, () =>
          this.generateFramework("backend", config.backend, config, context),
        ),
      );
    }

    // 5. Database integration
    if (config.database) {
      plan.push(
        this.createPlanStep("database", `database-${config.database}`, 4, () =>
          this.generateDatabase(config.database, config, context),
        ),
      );
    }

    // 6. Features
    this.addFeaturesToPlan(plan, config, context);

    // 7. Configuration files
    plan.push(
      this.createPlanStep("config", "project-config", 8, () =>
        this.generateProjectConfig(config, context),
      ),
    );

    // 8. Documentation
    plan.push(
      this.createPlanStep("docs", "documentation", 9, () =>
        this.generateDocumentation(config, context),
      ),
    );

    return plan.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Create plan step object
   */
  createPlanStep(type, name, priority, action, critical = false) {
    return { type, name, priority, action, critical };
  }

  /**
   * Add features to generation plan
   */
  addFeaturesToPlan(plan, config, context) {
    if (!config.features) return;

    const featureMap = {
      auth: { priority: 5, data: config.auth || {} },
      testing: { priority: 6, data: config.testing || {} },
      docker: { priority: 7, data: config.docker || {} },
    };

    config.features.forEach((feature) => {
      const featureConfig = featureMap[feature];
      if (featureConfig) {
        plan.push(
          this.createPlanStep("feature", feature, featureConfig.priority, () =>
            this.generateFeature(feature, featureConfig.data, context),
          ),
        );
      }
    });
  }

  // ==========================================================================
  // PLAN EXECUTION
  // ==========================================================================

  /**
   * Execute generation plan
   */
  async executeGenerationPlan(context) {
    const results = {
      successful: [],
      failed: [],
      skipped: [],
    };

    for (const step of this.generationPlan) {
      await this.executeStep(step, results);
    }

    return results;
  }

  /**
   * Execute single generation step
   */
  async executeStep(step, results) {
    try {
      console.log(`🔧 Executing: ${step.name}`);

      const stepResult = await step.action();

      results.successful.push({
        name: step.name,
        type: step.type,
        result: stepResult,
      });

      this.logExecution(step.name, "success");
      console.log(`✅ Completed: ${step.name}`);
    } catch (error) {
      results.failed.push({
        name: step.name,
        type: step.type,
        error: error.message,
      });

      this.logExecution(step.name, "failed", error.message);
      console.error(`❌ Failed: ${step.name} - ${error.message}`);

      if (step.critical) {
        throw error;
      }
    }
  }

  /**
   * Log execution step
   */
  logExecution(step, status, error = null) {
    this.executionLog.push({
      step,
      status,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  // ==========================================================================
  // GENERATION METHODS
  // ==========================================================================

  /**
   * Generate base project structure
   */
  async generateBaseStructure(config) {
    for (const dir of BASE_STRUCTURE) {
      const dirPath = path.join(config.projectPath, dir);
      await fs.ensureDir(dirPath);

      // Create .gitkeep for empty directories
      const gitkeepPath = path.join(dirPath, ".gitkeep");
      await fs.writeFile(gitkeepPath, "", "utf8");
    }
  }

  /**
   * Process template
   */
  async processTemplate(template, config, context) {
    const templatePath = path.join(this.options.templatesRoot, template);

    return await this.templateEngine.processTemplates(
      templatePath,
      config.projectPath,
      context,
    );
  }

  /**
   * Generate framework-specific code
   */
  async generateFramework(type, framework, config, context) {
    const frameworkTemplatePath = path.join(
      this.options.templatesRoot,
      type,
      framework,
    );

    if (!(await fs.pathExists(frameworkTemplatePath))) {
      throw new Error(`Framework template not found: ${type}/${framework}`);
    }

    return await this.templateEngine.processTemplates(
      frameworkTemplatePath,
      config.projectPath,
      context,
    );
  }

  /**
   * Generate database integration
   */
  async generateDatabase(database, config, context) {
    const databaseTemplatePath = path.join(
      this.options.templatesRoot,
      "database",
      database,
    );

    return await this.templateEngine.processTemplates(
      databaseTemplatePath,
      config.projectPath,
      context,
    );
  }

  /**
   * Generate project configuration files
   */
  async generateProjectConfig(config, context) {
    const configTemplatePath = path.join(this.options.templatesRoot, "config");

    return await this.templateEngine.processTemplates(
      configTemplatePath,
      config.projectPath,
      context,
    );
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(config, context) {
    const docsTemplatePath = path.join(this.options.templatesRoot, "docs");

    if (await fs.pathExists(docsTemplatePath)) {
      return await this.templateEngine.processTemplates(
        docsTemplatePath,
        path.join(config.projectPath, "docs"),
        context,
      );
    }
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Get framework-specific directory structure
   */
  getFrameworkStructure(framework) {
    return FRAMEWORK_STRUCTURES[framework] || ["src", "tests"];
  }

  /**
   * Run hooks for specific events
   */
  async runHooks(event, data) {
    const hooks = this.hooks.get(event) || [];

    for (const hook of hooks) {
      try {
        await hook(data);
      } catch (error) {
        console.warn(`Hook failed for event '${event}':`, error.message);
      }
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport(results) {
    return {
      summary: {
        totalSteps: this.generationPlan.length,
        successful: results.successful.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
      details: results,
      executionLog: this.executionLog,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle generation errors
   */
  async handleGenerationError(error, config) {
    console.error("❌ Project generation failed:", error.message);

    const errorLogPath = path.join(
      config.projectPath || ".",
      "generation-error.log",
    );

    const errorLog = {
      error: error.message,
      stack: error.stack,
      config,
      executionLog: this.executionLog,
      timestamp: new Date().toISOString(),
    };

    await fs.writeJson(errorLogPath, errorLog, { spaces: 2 });
    console.log(`📋 Error log saved to: ${errorLogPath}`);
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Generate project (convenience function)
 */
export async function generateProject(config, options = {}) {
  const generator = new FileGenerator(options);
  return await generator.generateProject(config);
}

/**
 * Generate feature (convenience function)
 */
export async function generateFeature(
  featureType,
  config,
  projectContext,
  options = {},
) {
  const generator = new FileGenerator(options);
  return await generator.generateFeature(featureType, config, projectContext);
}
