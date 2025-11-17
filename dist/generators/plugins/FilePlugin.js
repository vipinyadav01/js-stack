import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";
import { TECHNOLOGY_OPTIONS } from "../../config/ValidationSchemas.js";

/**
 * File Plugin for JS Stack Generator
 * Handles file operations, template processing, and project structure creation
 */

export class FilePlugin extends GeneratorPlugin {
  constructor() {
    super("FilePlugin", "1.0.0");
    this.priority = 20; // Medium priority
    this.dependencies = [];

    this.registerHook(HOOK_TYPES.PRE_GENERATE, this.preGenerate);
    this.registerHook(HOOK_TYPES.GENERATE_FILES, this.generateFiles);
    this.registerHook(HOOK_TYPES.PROCESS_TEMPLATES, this.processTemplates);
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
    console.log("📁 FilePlugin: Preparing file operations");

    // Initialize file system operations
    context.fileOperations = {
      created: [],
      modified: [],
      errors: [],
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
      console.log("📁 FilePlugin: Starting file operations");

      // Create project structure
      await this.createProjectStructure(config, context);

      // Process templates
      await this.processTemplates(config, context);

      // Create main entry point
      await this.createMainEntryPoint(config, context);

      return {
        success: true,
        filesCreated: context.fileOperations.created.length,
        filesModified: context.fileOperations.modified.length,
        errors: context.fileOperations.errors.length,
        message: "File operations completed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "File operations failed",
      };
    }
  }

  /**
   * Create project structure
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   */
  async createProjectStructure(config, context) {
    const projectDir = context.projectDir;
    const directories = [];

    // Do not create empty root-level directories by default

    // Backend-specific directories
    if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
      directories.push("backend");
      directories.push("backend/src");
      directories.push("backend/routes");
      directories.push("backend/middleware");
      directories.push("backend/models");
      directories.push("backend/controllers");
    }

    // Frontend-specific directories
    if (
      config.frontend &&
      config.frontend.length > 0 &&
      !config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NONE)
    ) {
      directories.push("frontend");
      directories.push("frontend/src");
      directories.push("frontend/src/components");
      directories.push("frontend/src/pages");
      directories.push("frontend/src/styles");
      directories.push("frontend/public");
    }

    // Database-specific directories
    if (config.database !== TECHNOLOGY_OPTIONS.DATABASE.NONE) {
      directories.push("database");
      directories.push("database/migrations");
      directories.push("database/seeds");
    }

    // Auth-specific directories
    if (config.auth !== TECHNOLOGY_OPTIONS.AUTH.NONE) {
      directories.push("auth");
      directories.push("auth/middleware");
      directories.push("auth/routes");
    }

    // Testing directories
    if (
      config.addons &&
      config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.TESTING)
    ) {
      directories.push("tests");
      directories.push("tests/unit");
      directories.push("tests/integration");
    }

    // Create directories
    for (const dir of directories) {
      const dirPath = path.join(projectDir, dir);
      try {
        await fs.ensureDir(dirPath);
        context.fileOperations.created.push(dirPath);
      } catch (error) {
        context.fileOperations.errors.push(
          `Failed to create directory ${dir}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Process templates using layered template processor
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   */
  async processTemplates(config, context) {
    const { LayeredTemplateProcessor } = await import(
      "../../utils/layered-template-processor.js"
    );

    try {
      // Create layered template processor
      const templateProcessor = new LayeredTemplateProcessor({
        projectDir: context.projectDir,
        frontend: config.frontend,
        backend: config.backend,
        database: config.database,
        orm: config.orm,
        auth: config.auth,
        addons: config.addons,
        packageManager: config.packageManager,
        projectName: config.projectName,
        ...config,
      });

      // Process templates in layers
      const result = await templateProcessor.processTemplates();

      if (result.success) {
        console.log("✅ Templates processed successfully");
        context.fileOperations.created.push(...result.result.processedFiles);
      } else {
        console.log("❌ Template processing failed:", result.error);
        context.fileOperations.errors.push(result.error);
      }

      return context;
    } catch (error) {
      console.log("❌ Template processing failed:", error.message);
      context.fileOperations.errors.push(
        `Template processing failed: ${error.message}`,
      );
    }
  }

  /**
   * Create main entry point
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   */
  async createMainEntryPoint(config, context) {
    const projectDir = context.projectDir;
    const mainEntryContent = this.generateMainEntryContent(config);

    try {
      const mainEntryPath = path.join(projectDir, "index.js");
      await fs.writeFile(mainEntryPath, mainEntryContent);
      context.fileOperations.created.push(mainEntryPath);
    } catch (error) {
      context.fileOperations.errors.push(
        `Failed to create main entry point: ${error.message}`,
      );
    }
  }

  /**
   * Generate main entry point content
   * @param {Object} config - Project configuration
   * @returns {string} - Main entry point content
   */
  generateMainEntryContent(config) {
    return `#!/usr/bin/env node

/**
 * Main entry point for ${config.projectName}
 * This file serves as the primary entry point for the application
 */

console.log('🚀 ${config.projectName} - Starting application...');

// Check if this is a full-stack project
const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, 'backend', 'server.js');
const frontendPath = path.join(__dirname, 'frontend');

if (fs.existsSync(backendPath)) {
  console.log('📡 Backend server found. Starting backend...');
  console.log('💡 To start the backend server, run: cd backend && npm start');
}

if (fs.existsSync(frontendPath)) {
  console.log('🎨 Frontend found. Starting frontend...');
  console.log('💡 To start the frontend, run: cd frontend && npm start');
}

console.log('\\n📚 Available commands:');
console.log('  npm start     - Start the application');
console.log('  npm run dev   - Start development mode');
console.log('  npm run build - Build the application');
console.log('  npm test      - Run tests');
console.log('\\n🎉 Happy coding!');
`;
  }

  /**
   * Check if directory exists
   * @param {string} dirPath - Directory path
   * @returns {Promise<boolean>} - True if directory exists
   */
  async directoryExists(dirPath) {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Generate files hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async generateFiles(context) {
    console.log("📁 FilePlugin: Generating files");
    return context;
  }

  /**
   * Post-generation hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async postGenerate(context) {
    console.log("📁 FilePlugin: File operations completed");
    return context;
  }
}

export default FilePlugin;
