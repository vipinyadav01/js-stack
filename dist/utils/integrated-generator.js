/**
 * Integrated Project Generator
 * Combines template engine, file generation, and project configuration
 */

import { FileGenerator } from "./file-generator.js";
import { ProjectConfigManager, BuiltInPresets } from "./project-config.js";
import { TemplateEngine } from "./template-engine.js";
import { getTemplateDir } from "./file-utils.js";
import path from "path";
import fs from "fs-extra";

export class IntegratedProjectGenerator {
  constructor(options = {}) {
    this.options = {
      templatesRoot: getTemplateDir(),
      outputRoot: process.cwd(),
      enableLogging: true,
      enableBackups: false,
      dryRun: false,
      ...options,
    };

    this.configManager = new ProjectConfigManager({
      configDir:
        options.configDir || path.join(process.cwd(), "cli", "configs"),
      presetsDir:
        options.presetsDir || path.join(process.cwd(), "cli", "presets"),
    });

    this.fileGenerator = new FileGenerator({
      templatesRoot: this.options.templatesRoot,
      outputRoot: this.options.outputRoot,
      createBackups: this.options.enableBackups,
    });

    this.templateEngine = new TemplateEngine();

    this._setupHooks();
    this._setupVariableResolvers();
  }

  /**
   * Generate project from configuration
   */
  async generateProject(configSource, options = {}) {
    try {
      this._log("🚀 Starting project generation...");

      // Load and validate configuration
      const config = await this._loadConfiguration(configSource, options);

      // Generate project
      const result = await this.fileGenerator.generateProject(config);

      // Post-generation tasks
      await this._runPostGeneration(config, result);

      this._log("✅ Project generation completed successfully!");

      return {
        success: true,
        config,
        result,
        projectPath: config.projectPath,
      };
    } catch (error) {
      this._log("❌ Project generation failed:", error.message);

      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }

  /**
   * Generate from preset
   */
  async generateFromPreset(presetName, overrides = {}, options = {}) {
    this._log(`📋 Generating project from preset: ${presetName}`);

    const config = await this.configManager.createFromPreset(
      presetName,
      overrides,
    );
    return await this.generateProject(config, options);
  }

  /**
   * List available presets
   */
  async getAvailablePresets() {
    const filePresets = await this.configManager.getAvailablePresets();
    const builtInPresets = Object.keys(BuiltInPresets);

    return {
      builtin: builtInPresets.map((name) => ({
        name,
        ...BuiltInPresets[name],
      })),
      custom: filePresets,
    };
  }

  /**
   * Generate project structure preview
   */
  async previewProject(configSource, options = {}) {
    const config = await this._loadConfiguration(configSource, {
      ...options,
      validate: false,
    });

    // Create a dry-run file generator
    const previewGenerator = new FileGenerator({
      ...this.options,
      dryRun: true,
    });

    // Generate preview
    const preview = await previewGenerator.generateProject(config);

    return {
      config,
      structure: this._analyzeProjectStructure(preview),
      files: this._extractFileList(preview),
      dependencies: this._extractDependencies(config),
    };
  }

  /**
   * Validate project configuration
   */
  async validateConfiguration(configSource) {
    try {
      const config = await this._loadConfiguration(configSource, {
        validate: false,
      });
      return await this.configManager.validateConfiguration(config);
    } catch (error) {
      return {
        valid: false,
        errors: [
          {
            type: "config_load",
            message: error.message,
          },
        ],
        warnings: [],
      };
    }
  }

  /**
   * Add custom template
   */
  async addCustomTemplate(templateName, templatePath) {
    const targetPath = path.join(
      this.options.templatesRoot,
      "custom",
      templateName,
    );

    if (await fs.pathExists(targetPath)) {
      throw new Error(`Custom template already exists: ${templateName}`);
    }

    await fs.copy(templatePath, targetPath);
    this._log(`📁 Added custom template: ${templateName}`);
  }

  /**
   * Add feature to existing project
   */
  async addFeature(projectPath, featureType, featureConfig = {}) {
    this._log(`🔧 Adding feature '${featureType}' to project...`);

    // Load existing project configuration
    const projectConfig = await this._loadExistingProjectConfig(projectPath);

    // Generate feature
    const result = await this.fileGenerator.generateFeature(
      featureType,
      featureConfig,
      projectConfig,
    );

    // Update project configuration
    projectConfig.features = projectConfig.features || [];
    if (!projectConfig.features.includes(featureType)) {
      projectConfig.features.push(featureType);
    }

    await this._saveProjectConfig(projectPath, projectConfig);

    this._log(`✅ Feature '${featureType}' added successfully!`);

    return result;
  }

  /**
   * Update existing project
   */
  async updateProject(projectPath, updates) {
    this._log("🔄 Updating project...");

    // Load existing configuration
    const existingConfig = await this._loadExistingProjectConfig(projectPath);

    // Merge updates
    const updatedConfig = {
      ...existingConfig,
      ...updates,
      features: [
        ...(existingConfig.features || []),
        ...(updates.features || []),
      ].filter((v, i, arr) => arr.indexOf(v) === i), // Remove duplicates
    };

    // Regenerate affected parts
    const result = await this.fileGenerator.generateProject(updatedConfig);

    // Save updated configuration
    await this._saveProjectConfig(projectPath, updatedConfig);

    this._log("✅ Project updated successfully!");

    return result;
  }

  /**
   * Load configuration with proper validation and enhancement
   */
  async _loadConfiguration(configSource, options = {}) {
    // Load raw configuration
    const rawConfig = await this.configManager.loadConfiguration(
      configSource,
      options,
    );

    // Validate configuration
    if (options.validate !== false) {
      const validation =
        await this.configManager.validateConfiguration(rawConfig);

      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message);
        throw new Error(
          `Configuration validation failed:\n${errorMessages.join("\n")}`,
        );
      }

      if (validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => {
          this._log(`⚠️ Warning: ${warning.message}`);
        });
      }
    }

    // Enhance configuration
    const enhancedConfig =
      await this.configManager.enhanceConfiguration(rawConfig);

    this._log("📋 Configuration loaded and validated successfully");

    return enhancedConfig;
  }

  /**
   * Load existing project configuration
   */
  async _loadExistingProjectConfig(projectPath) {
    const configPaths = [
      path.join(projectPath, "js-stack.config.json"),
      path.join(projectPath, "project.config.json"),
      path.join(projectPath, "package.json"),
    ];

    for (const configPath of configPaths) {
      if (await fs.pathExists(configPath)) {
        if (configPath.endsWith("package.json")) {
          const packageJson = await fs.readJson(configPath);
          return (
            packageJson.jsStack || {
              projectName: packageJson.name,
              projectPath,
            }
          );
        } else {
          return await fs.readJson(configPath);
        }
      }
    }

    // Default configuration if none found
    return {
      projectName: path.basename(projectPath),
      projectPath,
      features: [],
    };
  }

  /**
   * Save project configuration
   */
  async _saveProjectConfig(projectPath, config) {
    const configPath = path.join(projectPath, "js-stack.config.json");
    await fs.writeJson(configPath, config, { spaces: 2 });
  }

  /**
   * Setup generation hooks
   */
  _setupHooks() {
    // Pre-generation hook
    this.fileGenerator.addHook("pre-generation", async (config) => {
      this._log(`📁 Creating project: ${config.projectName}`);

      // Ensure project directory exists
      await fs.ensureDir(config.projectPath);
    });

    // Post-generation hook
    this.fileGenerator.addHook(
      "post-generation",
      async ({ config, results, context }) => {
        this._log("🏁 Running post-generation tasks...");

        // Save project configuration
        await this._saveProjectConfig(config.projectPath, config);

        // Initialize git repository if requested
        if (config.features?.includes("git")) {
          await this._initializeGitRepository(config.projectPath);
        }

        // Install dependencies if requested
        if (config.installDependencies !== false) {
          await this._installDependencies(
            config.projectPath,
            config.packageManager,
          );
        }
      },
    );
  }

  /**
   * Setup variable resolvers
   */
  _setupVariableResolvers() {
    // Current date resolver
    this.fileGenerator.addVariableResolver("currentDate", () => {
      return new Date().toISOString().split("T")[0];
    });

    // Current year resolver
    this.fileGenerator.addVariableResolver("currentYear", () => {
      return new Date().getFullYear().toString();
    });

    // Git user resolver
    this.fileGenerator.addVariableResolver("gitUser", () => {
      try {
        const { execSync } = require("child_process");
        const name = execSync("git config user.name", {
          encoding: "utf8",
        }).trim();
        const email = execSync("git config user.email", {
          encoding: "utf8",
        }).trim();
        return { name, email };
      } catch {
        return { name: "User", email: "user@example.com" };
      }
    });

    // Project slug transformer
    this.fileGenerator.addVariableTransformer("projectSlug", (projectName) => {
      return projectName?.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    });
  }

  /**
   * Post-generation tasks
   */
  async _runPostGeneration(config, result) {
    this._log("🔧 Running post-generation tasks...");

    // Format generated code
    if (config.features?.includes("prettier")) {
      await this._formatCode(config.projectPath);
    }

    // Run linting
    if (config.features?.includes("eslint")) {
      await this._lintCode(config.projectPath);
    }

    // Generate README if requested
    if (config.generateReadme !== false) {
      await this._generateReadme(config);
    }
  }

  /**
   * Initialize git repository
   */
  async _initializeGitRepository(projectPath) {
    try {
      const { execSync } = require("child_process");

      execSync("git init", { cwd: projectPath, stdio: "ignore" });
      execSync("git add .", { cwd: projectPath, stdio: "ignore" });
      execSync('git commit -m "Initial commit"', {
        cwd: projectPath,
        stdio: "ignore",
      });

      this._log("📁 Git repository initialized");
    } catch (error) {
      this._log("⚠️ Failed to initialize git repository:", error.message);
    }
  }

  /**
   * Install project dependencies
   */
  async _installDependencies(projectPath, packageManager = "npm") {
    try {
      this._log(`📦 Installing dependencies with ${packageManager}...`);

      const { execSync } = require("child_process");
      const command =
        packageManager === "yarn"
          ? "yarn install"
          : `${packageManager} install`;

      execSync(command, { cwd: projectPath, stdio: "inherit" });

      this._log("✅ Dependencies installed successfully");
    } catch (error) {
      this._log("⚠️ Failed to install dependencies:", error.message);
    }
  }

  /**
   * Format generated code
   */
  async _formatCode(projectPath) {
    try {
      const { execSync } = require("child_process");
      execSync("npx prettier --write .", { cwd: projectPath, stdio: "ignore" });
      this._log("✨ Code formatted with Prettier");
    } catch (error) {
      this._log("⚠️ Code formatting failed:", error.message);
    }
  }

  /**
   * Lint generated code
   */
  async _lintCode(projectPath) {
    try {
      const { execSync } = require("child_process");
      execSync("npx eslint --fix .", { cwd: projectPath, stdio: "ignore" });
      this._log("🔍 Code linted with ESLint");
    } catch (error) {
      this._log("⚠️ Code linting failed:", error.message);
    }
  }

  /**
   * Generate README file
   */
  async _generateReadme(config) {
    const readmePath = path.join(config.projectPath, "README.md");

    if (await fs.pathExists(readmePath)) {
      return; // Don't overwrite existing README
    }

    const readmeContent = this._generateReadmeContent(config);
    await fs.writeFile(readmePath, readmeContent, "utf8");

    this._log("📝 README.md generated");
  }

  /**
   * Generate README content
   */
  _generateReadmeContent(config) {
    return `# ${config.projectName}

Generated with JS Stack CLI

## Features

${(config.features || []).map((feature) => `- ${feature}`).join("\n")}

## Getting Started

\`\`\`bash
# Install dependencies
${config.packageManager} install

# Start development server
${config.packageManager} ${config.packageManager === "npm" ? "run " : ""}dev
\`\`\`

## Technologies

${config.frontend ? `- Frontend: ${config.frontend}` : ""}
${config.backend ? `- Backend: ${config.backend}` : ""}
${config.database ? `- Database: ${config.database}` : ""}
${config.typescript ? "- Language: TypeScript" : "- Language: JavaScript"}

---

Generated on ${new Date().toISOString().split("T")[0]}
`;
  }

  /**
   * Analyze project structure for preview
   */
  _analyzeProjectStructure(generationResult) {
    // This would analyze the generation result and return a tree structure
    return {
      directories: [],
      files: [],
      totalFiles: 0,
      totalDirectories: 0,
    };
  }

  /**
   * Extract file list from generation result
   */
  _extractFileList(generationResult) {
    // This would extract a list of files that would be generated
    return [];
  }

  /**
   * Extract dependencies from configuration
   */
  _extractDependencies(config) {
    const dependencies = [];

    // Add framework-specific dependencies
    if (config.frontend === "react") {
      dependencies.push("react", "react-dom");
    }

    if (config.backend === "express") {
      dependencies.push("express");
    }

    if (config.typescript) {
      dependencies.push("typescript", "@types/node");
    }

    return dependencies;
  }

  /**
   * Logging utility
   */
  _log(...args) {
    if (this.options.enableLogging) {
      console.log(...args);
    }
  }
}

// Export convenience functions
export async function generateProject(configSource, options = {}) {
  const generator = new IntegratedProjectGenerator(options);
  return await generator.generateProject(configSource, options);
}

export async function generateFromPreset(
  presetName,
  overrides = {},
  options = {},
) {
  const generator = new IntegratedProjectGenerator(options);
  return await generator.generateFromPreset(presetName, overrides, options);
}

export async function getAvailablePresets(options = {}) {
  const generator = new IntegratedProjectGenerator(options);
  return await generator.getAvailablePresets();
}
