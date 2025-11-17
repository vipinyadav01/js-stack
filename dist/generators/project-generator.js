import path from "path";
import chalk from "chalk";
import { createModernSpinner } from "../utils/modern-render.js";
import { executeTransaction, safeOperation } from "../utils/transaction.js";
import {
  validateCompatibility,
  displayValidationResults,
  resolveDependencies,
} from "../utils/validation.js";
import { LayeredTemplateProcessor } from "../utils/layered-template-processor.js";
import { performanceUtils } from "../utils/performance.js";
import { createHealthValidator } from "../utils/health-validator.js";
import { initGitRepo } from "../utils/git.js";
import { installDependencies } from "../utils/package-manager.js";
import { ModularGenerator } from "./types/ModularGenerator.js";
import { MonorepoGenerator } from "../utils/monorepo-generator.js";

/**
 * Project generator with enhanced features
 */
export class ProjectGenerator {
  constructor(config) {
    this.config = config;
    this.performanceMonitor = performanceUtils.createMonitor();
    this.templateProcessor = null;
    this.healthValidator = null;
  }

  /**
   * Create a new project with enhanced features
   * @param {Object} progress - Progress callback
   * @returns {Object} - Project creation result
   */
  async createProject(progress = null) {
    this.performanceMonitor.start();

    try {
      // Step 1: Validate configuration
      await this.validateConfiguration(progress);

      // Step 2: Use modular generator by default (can be disabled with useModularGenerator: false)
      let result;
      if (this.config.useModularGenerator !== false) {
        result = await this.createProjectWithModularGenerator(progress);
      } else {
        result = await this.createProjectWithTransaction(progress);
      }

      // Step 3: Generate monorepo structure if turborepo is selected
      const monorepoResult = await this.generateMonorepoStructure(progress);
      if (monorepoResult) {
        result.monorepo = monorepoResult;
      }

      // Step 4: Run health validation
      await this.runHealthValidation(progress);

      // Step 5: Display performance summary
      const performanceSummary = this.performanceMonitor.end();

      return {
        success: true,
        result,
        performance: performanceSummary,
        health: this.healthValidator?.results,
        modular: this.config.useModularGenerator !== false,
      };
    } catch (error) {
      this.performanceMonitor.end();
      return {
        success: false,
        error: error.message,
        performance: this.performanceMonitor.getSummary(),
      };
    }
  }

  /**
   * Validate project configuration
   * @param {Object} progress - Progress callback
   */
  async validateConfiguration(progress) {
    if (progress) await progress.nextStep("Validating configuration");

    const validation = validateCompatibility(this.config);

    if (!validation.isValid) {
      displayValidationResults(validation);
      throw new Error("Configuration validation failed");
    }

    if (validation.warnings.length > 0) {
      displayValidationResults(validation);
      console.log(chalk.yellow("\n⚠️  Continuing with warnings..."));
    }
  }

  /**
   * Create project using modular generator
   * @param {Object} progress - Progress callback
   * @returns {Object} - Generation result
   */
  async createProjectWithModularGenerator(progress) {
    try {
      if (progress && typeof progress.start === "function") {
        progress.start("🔧 Using layered template system");
      }

      // Use layered template processor for better organization
      const layeredProcessor = new LayeredTemplateProcessor(this.config);
      const result = await layeredProcessor.processTemplates();

      if (progress && typeof progress.succeed === "function") {
        progress.succeed("✅ Layered template processing completed");
      }

      return {
        success: result.success,
        projectDir: this.config.projectDir,
        processedFiles: result.processedFiles,
        conflicts: result.conflicts,
        layered: true,
      };
    } catch (error) {
      if (progress && typeof progress.fail === "function") {
        progress.fail(
          `❌ Layered template processing failed: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Generate monorepo structure if turborepo is selected
   * @param {Object} progress - Progress callback
   * @returns {Object} - Monorepo generation result
   */
  async generateMonorepoStructure(progress) {
    if (!this.config.addons || !this.config.addons.includes("turborepo")) {
      return null;
    }

    if (progress) {
      progress.next({ icon: "🏗️", title: "Generating monorepo structure" });
    }

    try {
      const monorepoGenerator = new MonorepoGenerator(this.config);
      const structure = monorepoGenerator.generateStructure();

      // Display the generated structure
      monorepoGenerator.displayStructure(structure);

      return {
        success: true,
        structure,
        message: "Monorepo structure generated successfully",
      };
    } catch (error) {
      console.error(
        chalk.red("Failed to generate monorepo structure:"),
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create project with transaction support
   * @param {Object} progress - Progress callback
   * @returns {Object} - Project creation result
   */
  async createProjectWithTransaction(progress) {
    return await executeTransaction(async (transaction) => {
      // Step 1: Create project structure
      if (progress) await progress.nextStep("Creating project structure");

      await transaction.createDir(this.config.projectDir);

      // Step 2: Create base package.json with resolved dependencies
      const dependencies = resolveDependencies(this.config);
      const basePackageJson = {
        name: this.config.projectName,
        version: "1.0.0",
        description: "A JavaScript full-stack project",
        main: "index.js",
        scripts: this.getDefaultScripts(),
        keywords: [],
        author: "Vipin Yadav",
        license: "MIT",
        dependencies: dependencies.dependencies,
        devDependencies: dependencies.devDependencies,
      };

      await transaction.writeJson(
        path.join(this.config.projectDir, "package.json"),
        basePackageJson,
      );

      // Step 3: Process templates with smart resolution
      await this.processTemplates(transaction, progress);

      // Step 4: Create README
      await this.createReadme(transaction);

      // Step 5: Create main entry point
      await this.createMainEntryPoint(transaction);

      // Step 6: Install dependencies
      if (this.config.install) {
        if (progress)
          await progress.nextStep(
            `Installing with ${this.config.packageManager}`,
          );
        await installDependencies(
          this.config.projectDir,
          this.config.packageManager,
        );
      }

      // Step 6: Initialize git
      if (this.config.git) {
        if (progress) await progress.nextStep("Initializing git repository");
        await initGitRepo(this.config.projectDir);
      }

      return {
        projectDir: this.config.projectDir,
        projectName: this.config.projectName,
        packageManager: this.config.packageManager,
        config: this.config,
      };
    });
  }

  /**
   * Process templates with smart resolution
   * @param {Object} transaction - Transaction object
   * @param {Object} progress - Progress callback
   */
  async processTemplates(transaction, progress) {
    // Template processing is now handled by the ModularGenerator
    // This method is kept for compatibility but does nothing
    if (progress) {
      await progress.nextStep("Processing templates via ModularGenerator");
    }
  }

  // Individual generator methods removed - using ModularGenerator instead

  /**
   * Create README file
   * @param {Object} transaction - Transaction object
   */
  async createReadme(transaction) {
    const readmeContent = this.generateReadmeContent();
    await transaction.createFile(
      path.join(this.config.projectDir, "README.md"),
      readmeContent,
    );
  }

  /**
   * Generate README content
   * @returns {string} - README content
   */
  generateReadmeContent() {
    const {
      projectName,
      database,
      orm,
      backend,
      frontend,
      auth,
      packageManager,
    } = this.config;

    return `# ${projectName}

## Description
A JavaScript full-stack project generated with create-js-stack CLI.

## Project Configuration
- **Database**: ${database}
- **ORM**: ${orm}
- **Backend**: ${backend}
- **Frontend**: ${frontend.join(", ")}
- **Authentication**: ${auth}
- **Package Manager**: ${packageManager}

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- ${packageManager}

### Installation
\`\`\`bash
${packageManager === "npm" ? "npm install" : packageManager + " install"}
\`\`\`

### Development
\`\`\`bash
${packageManager === "npm" ? "npm run dev" : packageManager + " dev"}
\`\`\`

### Build
\`\`\`bash
${packageManager === "npm" ? "npm run build" : packageManager + " build"}
\`\`\`

### Test
\`\`\`bash
${packageManager === "npm" ? "npm test" : packageManager + " test"}
\`\`\`

## Project Structure
\`\`\`
${projectName}/
├── package.json
${backend !== "none" ? "├── backend/\n│   └── server.js" : ""}
${frontend[0] !== "none" ? "├── frontend/\n│   └── src/\n│       └── App.js" : ""}
${database !== "none" ? "├── database/\n│   └── config.js" : ""}
└── README.md
\`\`\`

## Features
${this.getFeatureList()}

## License
MIT

---
Generated with ❤️ by [Vipin Yadav](https://github.com/vipinyadav01/js-stack)
`;
  }

  /**
   * Get feature list for README
   * @returns {string} - Feature list
   */
  getFeatureList() {
    const features = [];

    if (this.config.backend !== "none") {
      features.push(`- ${this.config.backend} backend`);
    }

    if (this.config.frontend[0] !== "none") {
      features.push(`- ${this.config.frontend.join(", ")} frontend`);
    }

    if (this.config.database !== "none") {
      features.push(`- ${this.config.database} database`);
    }

    if (this.config.orm !== "none") {
      features.push(`- ${this.config.orm} ORM`);
    }

    if (this.config.auth !== "none") {
      features.push(`- ${this.config.auth} authentication`);
    }

    if (this.config.addons?.length > 0) {
      features.push(`- ${this.config.addons.join(", ")} tools`);
    }

    return features.join("\n");
  }

  /**
   * Get default scripts for package.json
   * @returns {Object} - Scripts object
   */
  getDefaultScripts() {
    const scripts = {
      start: "node index.js",
      dev: "node index.js",
      build: "echo 'Build completed'",
      test: "echo 'No tests specified'",
    };

    // Add framework-specific scripts
    if (this.config.frontend?.includes("react")) {
      scripts.dev = "vite";
      scripts.build = "vite build";
      scripts.preview = "vite preview";
    }

    if (this.config.frontend?.includes("vue")) {
      scripts.dev = "vite";
      scripts.build = "vite build";
      scripts.preview = "vite preview";
    }

    if (this.config.frontend?.includes("nextjs")) {
      scripts.dev = "next dev";
      scripts.build = "next build";
      scripts.start = "next start";
    }

    if (this.config.backend === "nestjs") {
      scripts.start = "nest start";
      scripts.dev = "nest start --watch";
      scripts.build = "nest build";
    }

    return scripts;
  }

  /**
   * Run health validation
   * @param {Object} progress - Progress callback
   */
  async runHealthValidation(progress) {
    if (progress) await progress.nextStep("Running health checks");

    this.healthValidator = createHealthValidator(this.config.projectDir);
    const results = await this.healthValidator.runChecks();

    if (results.summary.hasCriticalFailures) {
      throw new Error("Critical health check failures detected");
    }

    this.healthValidator.displayResults();
  }

  /**
   * Create main entry point for the project
   * @param {Object} transaction - Transaction object
   */
  async createMainEntryPoint(transaction) {
    const mainEntryContent = `#!/usr/bin/env node

/**
 * Main entry point for ${this.config.projectName}
 * This file serves as the primary entry point for the application
 */

console.log('🚀 ${this.config.projectName} - Starting application...');

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

    await transaction.createFile(
      path.join(this.config.projectDir, "index.js"),
      mainEntryContent,
    );
  }
}

/**
 * Create a new project with enhanced features
 * @param {Object} config - Project configuration
 * @param {Object} progress - Progress callback
 * @returns {Object} - Project creation result
 */
export async function createProject(config, progress = null) {
  const generator = new ProjectGenerator(config);
  return await generator.createProject(progress);
}

// Keep the old export for backward compatibility
export async function createEnhancedProject(config, progress = null) {
  return await createProject(config, progress);
}

export default { createProject, createEnhancedProject };
