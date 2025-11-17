/**
 * Project Configuration System for JS Stack CLI
 * Manages project generation configurations and presets
 */

import fs from "fs-extra";
import path from "path";
import { promisify } from "util";
import { execSync } from "child_process";

export class ProjectConfigManager {
  constructor(options = {}) {
    this.options = {
      configDir: path.join(process.cwd(), "cli", "configs"),
      presetsDir: path.join(process.cwd(), "cli", "presets"),
      cacheDir: path.join(process.cwd(), ".cache"),
      validationLevel: "strict", // strict, moderate, loose
      ...options,
    };

    this.presets = new Map();
    this.validators = new Map();
    this.computedValues = new Map();

    this._initializeValidators();
  }

  /**
   * Load project configuration from various sources
   */
  async loadConfiguration(source, options = {}) {
    if (typeof source === "string") {
      // Load from file
      return await this._loadConfigFromFile(source);
    } else if (typeof source === "object") {
      // Validate and enhance inline config
      return await this._processInlineConfig(source, options);
    } else {
      throw new Error("Invalid configuration source");
    }
  }

  /**
   * Create configuration from preset
   */
  async createFromPreset(presetName, overrides = {}) {
    const preset = await this.getPreset(presetName);

    return {
      ...preset,
      ...overrides,
      // Merge arrays properly
      features: [
        ...(preset.features || []),
        ...(overrides.features || []),
      ].filter((v, i, arr) => arr.indexOf(v) === i), // Remove duplicates

      // Merge objects deeply
      auth: { ...preset.auth, ...overrides.auth },
      database: { ...preset.database, ...overrides.database },
      testing: { ...preset.testing, ...overrides.testing },
      docker: { ...preset.docker, ...overrides.docker },
    };
  }

  /**
   * Get available presets
   */
  async getAvailablePresets() {
    const presetsPath = this.options.presetsDir;

    if (!(await fs.pathExists(presetsPath))) {
      return [];
    }

    const files = await fs.readdir(presetsPath);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.basename(file, ".json"));
  }

  /**
   * Load specific preset
   */
  async getPreset(presetName) {
    if (this.presets.has(presetName)) {
      return this.presets.get(presetName);
    }

    const presetPath = path.join(this.options.presetsDir, `${presetName}.json`);

    if (!(await fs.pathExists(presetPath))) {
      throw new Error(`Preset not found: ${presetName}`);
    }

    const preset = await fs.readJson(presetPath);
    this.presets.set(presetName, preset);

    return preset;
  }

  /**
   * Validate configuration
   */
  async validateConfiguration(config) {
    const errors = [];
    const warnings = [];

    // Run all validators
    for (const [name, validator] of this.validators) {
      try {
        const result = await validator(config);

        if (result.errors) {
          errors.push(
            ...result.errors.map((err) => ({ validator: name, ...err })),
          );
        }

        if (result.warnings) {
          warnings.push(
            ...result.warnings.map((warn) => ({ validator: name, ...warn })),
          );
        }
      } catch (error) {
        errors.push({
          validator: name,
          type: "validation_error",
          message: `Validator failed: ${error.message}`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Enhance configuration with computed values
   */
  async enhanceConfiguration(config) {
    const enhanced = { ...config };

    // Add computed values
    for (const [name, computer] of this.computedValues) {
      try {
        enhanced[name] = await computer(config);
      } catch (error) {
        console.warn(`Failed to compute ${name}:`, error.message);
      }
    }

    // Add environment detection
    enhanced.environment = {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      hasGit: this._hasCommand("git"),
      hasNpm: this._hasCommand("npm"),
      hasYarn: this._hasCommand("yarn"),
      hasPnpm: this._hasCommand("pnpm"),
    };

    // Package manager detection
    if (!enhanced.packageManager) {
      enhanced.packageManager = this._detectPackageManager(
        enhanced.projectPath,
      );
    }

    // TypeScript detection
    if (enhanced.typescript === undefined) {
      enhanced.typescript = this._shouldUseTypeScript(enhanced);
    }

    return enhanced;
  }

  /**
   * Save configuration to file
   */
  async saveConfiguration(config, filePath) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, config, { spaces: 2 });
  }

  /**
   * Generate configuration template
   */
  async generateTemplate(templateName, options = {}) {
    const templates = {
      minimal: {
        projectName: "my-project",
        projectPath: "./my-project",
        packageManager: "npm",
      },

      fullstack: {
        projectName: "fullstack-app",
        projectPath: "./fullstack-app",
        frontend: "react",
        backend: "express",
        database: "postgresql",
        features: ["auth", "testing", "docker"],
        typescript: true,
        packageManager: "npm",
      },

      webapp: {
        projectName: "web-app",
        projectPath: "./web-app",
        frontend: "nextjs",
        features: ["auth", "testing"],
        typescript: true,
        packageManager: "npm",
      },

      api: {
        projectName: "api-server",
        projectPath: "./api-server",
        backend: "fastify",
        database: "postgresql",
        features: ["auth", "testing", "docker"],
        typescript: true,
        packageManager: "npm",
      },

      mobile: {
        projectName: "mobile-app",
        projectPath: "./mobile-app",
        frontend: "react-native",
        features: ["auth", "testing"],
        typescript: true,
        packageManager: "npm",
      },
    };

    if (!templates[templateName]) {
      throw new Error(`Template not found: ${templateName}`);
    }

    return {
      ...templates[templateName],
      ...options,
    };
  }

  /**
   * Load configuration from file
   */
  async _loadConfigFromFile(filePath) {
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case ".json":
        return await fs.readJson(filePath);

      case ".js":
      case ".mjs":
        const module = await import(path.resolve(filePath));
        return module.default || module;

      default:
        throw new Error(`Unsupported configuration file format: ${ext}`);
    }
  }

  /**
   * Process inline configuration
   */
  async _processInlineConfig(config, options) {
    // Apply defaults
    const processed = {
      // Defaults
      packageManager: "npm",
      typescript: false,
      features: [],

      // User config
      ...config,
    };

    // Validation
    if (options.validate !== false) {
      const validation = await this.validateConfiguration(processed);

      if (!validation.valid && this.options.validationLevel === "strict") {
        throw new Error(
          `Configuration validation failed: ${validation.errors.map((e) => e.message).join(", ")}`,
        );
      }

      if (validation.warnings.length > 0) {
        console.warn(
          "Configuration warnings:",
          validation.warnings.map((w) => w.message).join(", "),
        );
      }
    }

    // Enhancement
    if (options.enhance !== false) {
      return await this.enhanceConfiguration(processed);
    }

    return processed;
  }

  /**
   * Initialize built-in validators
   */
  _initializeValidators() {
    // Project name validator
    this.validators.set("projectName", (config) => {
      const errors = [];
      const warnings = [];

      if (!config.projectName) {
        errors.push({
          type: "required",
          field: "projectName",
          message: "Project name is required",
        });
      } else {
        if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(config.projectName)) {
          errors.push({
            type: "format",
            field: "projectName",
            message:
              "Project name must start with a letter and contain only letters, numbers, hyphens, and underscores",
          });
        }

        if (config.projectName.length < 3) {
          warnings.push({
            type: "length",
            field: "projectName",
            message:
              "Project name is quite short, consider a more descriptive name",
          });
        }
      }

      return { errors, warnings };
    });

    // Framework compatibility validator
    this.validators.set("frameworkCompatibility", (config) => {
      const errors = [];
      const warnings = [];

      // Check frontend-backend compatibility
      if (config.frontend === "react-native" && config.backend) {
        warnings.push({
          type: "compatibility",
          message:
            "React Native apps typically don't include backend code in the same project",
        });
      }

      // Check database compatibility
      if (config.database && !config.backend) {
        warnings.push({
          type: "compatibility",
          message: "Database selected but no backend framework specified",
        });
      }

      // Check auth compatibility
      if (config.features?.includes("auth")) {
        if (!config.backend && !config.frontend) {
          errors.push({
            type: "dependency",
            message:
              "Authentication feature requires either frontend or backend framework",
          });
        }
      }

      return { errors, warnings };
    });

    // Path validator
    this.validators.set("projectPath", (config) => {
      const errors = [];
      const warnings = [];

      if (!config.projectPath) {
        errors.push({
          type: "required",
          field: "projectPath",
          message: "Project path is required",
        });
      } else {
        // Check if path already exists
        if (fs.existsSync(config.projectPath)) {
          const stats = fs.statSync(config.projectPath);
          if (stats.isFile()) {
            errors.push({
              type: "path",
              field: "projectPath",
              message: "Project path points to an existing file",
            });
          } else if (stats.isDirectory()) {
            const files = fs.readdirSync(config.projectPath);
            if (files.length > 0) {
              warnings.push({
                type: "path",
                field: "projectPath",
                message: "Project directory already exists and is not empty",
              });
            }
          }
        }
      }

      return { errors, warnings };
    });

    // Feature dependencies validator
    this.validators.set("featureDependencies", (config) => {
      const errors = [];
      const warnings = [];

      if (config.features?.includes("docker")) {
        if (!config.backend && !config.frontend) {
          warnings.push({
            type: "dependency",
            message:
              "Docker is more useful with framework-specific configurations",
          });
        }
      }

      if (config.features?.includes("testing")) {
        if (!config.backend && !config.frontend) {
          warnings.push({
            type: "dependency",
            message:
              "Testing configuration is more useful with application code",
          });
        }
      }

      return { errors, warnings };
    });

    // Add computed value generators
    this.computedValues.set("projectSlug", (config) => {
      return config.projectName?.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    });

    this.computedValues.set("repositoryUrl", (config) => {
      if (config.repository) {
        return config.repository;
      }

      // Try to detect from git remote
      try {
        const remote = execSync("git remote get-url origin", {
          cwd: config.projectPath || ".",
          encoding: "utf8",
        }).trim();
        return remote;
      } catch {
        return null;
      }
    });
  }

  /**
   * Check if command exists
   */
  _hasCommand(command) {
    try {
      execSync(`${command} --version`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Detect preferred package manager
   */
  _detectPackageManager(projectPath) {
    if (!projectPath || !fs.existsSync(projectPath)) {
      return "npm";
    }

    if (fs.existsSync(path.join(projectPath, "pnpm-lock.yaml"))) {
      return "pnpm";
    }

    if (fs.existsSync(path.join(projectPath, "yarn.lock"))) {
      return "yarn";
    }

    return "npm";
  }

  /**
   * Determine if TypeScript should be used
   */
  _shouldUseTypeScript(config) {
    // Explicit setting takes precedence
    if (config.typescript !== undefined) {
      return config.typescript;
    }

    // Framework preferences
    if (config.backend === "nestjs") {
      return true;
    }

    if (config.frontend === "angular") {
      return true;
    }

    // Default to false for simplicity
    return false;
  }
}

// Built-in presets
export const BuiltInPresets = {
  "react-app": {
    name: "React Application",
    description: "Modern React application with TypeScript and testing",
    frontend: "react",
    typescript: true,
    features: ["testing"],
    packageManager: "npm",
  },

  "nextjs-app": {
    name: "Next.js Application",
    description: "Full-stack Next.js application with authentication",
    frontend: "nextjs",
    typescript: true,
    features: ["auth", "testing"],
    packageManager: "npm",
  },

  "express-api": {
    name: "Express API",
    description: "Express.js REST API with database and authentication",
    backend: "express",
    database: "postgresql",
    typescript: true,
    features: ["auth", "testing", "docker"],
    packageManager: "npm",
  },

  "fullstack-app": {
    name: "Full-Stack Application",
    description: "Complete full-stack application with React and Express",
    frontend: "react",
    backend: "express",
    database: "postgresql",
    typescript: true,
    features: ["auth", "testing", "docker"],
    packageManager: "npm",
  },

  "nestjs-api": {
    name: "NestJS API",
    description: "Enterprise-grade NestJS API with TypeORM and authentication",
    backend: "nestjs",
    database: "postgresql",
    typescript: true,
    features: ["auth", "testing", "docker"],
    packageManager: "npm",
  },

  "vue-app": {
    name: "Vue Application",
    description: "Modern Vue 3 application with Composition API",
    frontend: "vue",
    typescript: true,
    features: ["testing"],
    packageManager: "npm",
  },

  "mobile-app": {
    name: "React Native App",
    description: "Cross-platform mobile application",
    frontend: "react-native",
    typescript: true,
    features: ["testing"],
    packageManager: "npm",
  },
};

// Export convenience function
export async function createProjectConfig(source, options = {}) {
  const manager = new ProjectConfigManager(options);
  return await manager.loadConfiguration(source, options);
}
