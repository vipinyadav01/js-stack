import fs from "fs-extra";
import path from "path";
import {
  TemplateEngine,
  VariableSubstitution,
  DirectoryStructureGenerator,
} from "./template-engine.js";
import { getTemplateDir } from "./file-utils.js";

/**
 * Advanced File Generation System for JS Stack CLI
 * Handles complex project scaffolding with proper directory structures
 */

export class FileGenerator {
  constructor(options = {}) {
    this.options = {
      templatesRoot: getTemplateDir(),
      outputRoot: process.cwd(),
      createBackups: false,
      validateStructure: true,
      hookSystem: true,
      ...options,
    };

    this.templateEngine = new TemplateEngine();
    this.variableSubstitution = new VariableSubstitution();
    this.directoryGenerator = new DirectoryStructureGenerator();

    this.hooks = new Map();
    this.generationPlan = [];
    this.executionLog = [];
  }

  /**
   * Generate a complete project from configuration
   */
  async generateProject(config) {
    try {
      // Validate configuration
      this._validateConfig(config);

      // Run pre-generation hooks
      await this._runHooks("pre-generation", config);

      // Prepare variables and context
      const context = await this._prepareContext(config);

      // Create generation plan
      this.generationPlan = await this._createGenerationPlan(config, context);

      // Execute generation plan
      const results = await this._executeGenerationPlan(context);

      // Run post-generation hooks
      await this._runHooks("post-generation", { config, results, context });

      // Generate final report
      return this._generateFinalReport(results);
    } catch (error) {
      await this._handleGenerationError(error, config);
      throw error;
    }
  }

  /**
   * Generate specific components/features
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
   * Generate project structure based on framework selection
   */
  async generateProjectStructure(framework, projectPath, options = {}) {
    const structureConfig = this._getFrameworkStructure(framework);

    await this.directoryGenerator.defineStructure(framework, structureConfig);
    await this.directoryGenerator.generateStructure(
      framework,
      projectPath,
      options,
    );
  }

  /**
   * Add generation hook
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

  /**
   * Validate generation configuration
   */
  _validateConfig(config) {
    const required = ["projectName", "projectPath"];

    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate project path
    if (path.isAbsolute(config.projectPath)) {
      // Absolute path is ok
    } else {
      // Make relative to output root
      config.projectPath = path.join(
        this.options.outputRoot,
        config.projectPath,
      );
    }

    // Validate template selections
    if (config.templates) {
      for (const template of config.templates) {
        const templatePath = path.join(this.options.templatesRoot, template);
        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found: ${template}`);
        }
      }
    }
  }

  /**
   * Prepare context for template processing
   */
  async _prepareContext(config) {
    // Set base variables
    this.variableSubstitution.setVariables({
      ...config,
      _timestamp: new Date().toISOString(),
      _year: new Date().getFullYear(),
    });

    // Get resolved context
    const context = await this.variableSubstitution.getResolvedContext();

    // Add computed values based on selections
    context.features = config.features || [];
    context.hasFeature = (featureName) =>
      context.features.includes(featureName);

    // Framework-specific context
    const frontendList = Array.isArray(config.frontend)
      ? config.frontend
      : config.frontend
        ? [config.frontend]
        : [];

    if (frontendList.length > 0) {
      context.frontend = frontendList;
      context.isReact = frontendList.includes("react");
      context.isVue = frontendList.includes("vue");
      context.isAngular = frontendList.includes("angular");
      context.isNextjs = frontendList.includes("nextjs");
    }

    if (config.backend) {
      context.isExpress = config.backend === "express";
      context.isFastify = config.backend === "fastify";
      context.isNestjs = config.backend === "nestjs";
    }

    return context;
  }

  /**
   * Create generation plan
   */
  async _createGenerationPlan(config, context) {
    const plan = [];
    const frontendList = Array.isArray(config.frontend)
      ? config.frontend.filter(Boolean)
      : config.frontend
        ? [config.frontend]
        : [];

    // 1. Base project structure
    plan.push({
      type: "structure",
      name: "base-structure",
      priority: 1,
      action: async () => {
        await this._generateBaseStructure(config, context);
      },
    });

    // 2. Main templates
    if (config.templates) {
      for (const template of config.templates) {
        plan.push({
          type: "template",
          name: template,
          priority: 2,
          action: async () => {
            const templatePath = path.join(
              this.options.templatesRoot,
              template,
            );
            return await this.templateEngine.processTemplates(
              templatePath,
              config.projectPath,
              context,
            );
          },
        });
      }
    }

    // 3. Frontend framework
    if (frontendList.length > 0) {
      for (const frontend of frontendList) {
        plan.push({
          type: "framework",
          name: `frontend-${frontend}`,
          priority: 3,
          action: async () => {
            return await this._generateFramework(
              "frontend",
              frontend,
              config,
              context,
            );
          },
        });
      }
    }

    // 4. Backend framework
    if (config.backend) {
      plan.push({
        type: "framework",
        name: `backend-${config.backend}`,
        priority: 3,
        action: async () => {
          return await this._generateFramework(
            "backend",
            config.backend,
            config,
            context,
          );
        },
      });
    }

    // 5. Database integration
    if (config.database) {
      plan.push({
        type: "database",
        name: `database-${config.database}`,
        priority: 4,
        action: async () => {
          return await this._generateDatabase(config.database, config, context);
        },
      });
    }

    // 6. Authentication system
    if (config.features && config.features.includes("auth")) {
      plan.push({
        type: "feature",
        name: "authentication",
        priority: 5,
        action: async () => {
          return await this.generateFeature("auth", config.auth || {}, context);
        },
      });
    }

    // 7. Testing setup
    if (config.features && config.features.includes("testing")) {
      plan.push({
        type: "feature",
        name: "testing",
        priority: 6,
        action: async () => {
          return await this.generateFeature(
            "testing",
            config.testing || {},
            context,
          );
        },
      });
    }

    // 8. Docker configuration
    if (config.features && config.features.includes("docker")) {
      plan.push({
        type: "feature",
        name: "docker",
        priority: 7,
        action: async () => {
          return await this.generateFeature(
            "docker",
            config.docker || {},
            context,
          );
        },
      });
    }

    // 9. Configuration files
    plan.push({
      type: "config",
      name: "project-config",
      priority: 8,
      action: async () => {
        return await this._generateProjectConfig(config, context);
      },
    });

    // 10. Documentation
    plan.push({
      type: "docs",
      name: "documentation",
      priority: 9,
      action: async () => {
        return await this._generateDocumentation(config, context);
      },
    });

    // Sort by priority
    return plan.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Execute generation plan
   */
  async _executeGenerationPlan(context) {
    const results = {
      successful: [],
      failed: [],
      skipped: [],
    };

    for (const step of this.generationPlan) {
      try {
        console.log(`🔧 Executing: ${step.name}`);

        const stepResult = await step.action();

        results.successful.push({
          name: step.name,
          type: step.type,
          result: stepResult,
        });

        this.executionLog.push({
          step: step.name,
          status: "success",
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ Completed: ${step.name}`);
      } catch (error) {
        results.failed.push({
          name: step.name,
          type: step.type,
          error: error.message,
        });

        this.executionLog.push({
          step: step.name,
          status: "failed",
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        console.error(`❌ Failed: ${step.name} - ${error.message}`);

        // Continue with other steps unless it's critical
        if (step.critical) {
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * Generate base project structure
   */
  async _generateBaseStructure(config, context) {
    const structure = ["src", "public", "tests", "docs"];

    for (const dir of structure) {
      const dirPath = path.join(config.projectPath, dir);
      await fs.ensureDir(dirPath);

      // Create .gitkeep for empty directories
      const gitkeepPath = path.join(dirPath, ".gitkeep");
      await fs.writeFile(gitkeepPath, "", "utf8");
    }
  }

  /**
   * Generate framework-specific code
   */
  async _generateFramework(type, framework, config, context) {
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
  async _generateDatabase(database, config, context) {
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
  async _generateProjectConfig(config, context) {
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
  async _generateDocumentation(config, context) {
    const docsTemplatePath = path.join(this.options.templatesRoot, "docs");

    if (await fs.pathExists(docsTemplatePath)) {
      return await this.templateEngine.processTemplates(
        docsTemplatePath,
        path.join(config.projectPath, "docs"),
        context,
      );
    }
  }

  /**
   * Get framework-specific directory structure
   */
  _getFrameworkStructure(framework) {
    const structures = {
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

    return structures[framework] || ["src", "tests"];
  }

  /**
   * Run hooks for specific events
   */
  async _runHooks(event, data) {
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
  _generateFinalReport(results) {
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
  async _handleGenerationError(error, config) {
    console.error("❌ Project generation failed:", error.message);

    // Create error log
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

// Convenience functions
export async function generateProject(config, options = {}) {
  const generator = new FileGenerator(options);
  return await generator.generateProject(config);
}

export async function generateFeature(
  featureType,
  config,
  projectContext,
  options = {},
) {
  const generator = new FileGenerator(options);
  return await generator.generateFeature(featureType, config, projectContext);
}
