import path from "path";
import chalk from "chalk";
import { createModernSpinner } from "../utils/modern-render.js";
import { executeTransaction, safeOperation } from "../utils/transaction.js";
import {
  validateCompatibility,
  displayValidationResults,
  resolveDependencies,
} from "../utils/validation.js";
import { getTemplateProcessor } from "../utils/template-resolver.js";
import { performanceUtils } from "../utils/performance.js";
import { createHealthValidator } from "../utils/health-validator.js";
import { initGitRepo } from "../utils/git.js";
import { installDependencies } from "../utils/package-manager.js";

/**
 * Enhanced project generator with all improvements
 */
export class EnhancedProjectGenerator {
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

      // Step 2: Create project with transaction support
      const result = await this.createProjectWithTransaction(progress);

      // Step 3: Run health validation
      await this.runHealthValidation(progress);

      // Step 4: Display performance summary
      const performanceSummary = this.performanceMonitor.end();

      return {
        success: true,
        result,
        performance: performanceSummary,
        health: this.healthValidator?.results,
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
        author: "",
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

      // Step 5: Install dependencies
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
    // Use the original generators for now to ensure compatibility
    // This will be enhanced in future iterations

    // Generate backend
    if (this.config.backend !== "none") {
      if (progress)
        await progress.nextStep(`Setting up ${this.config.backend}`);
      await this.generateBackend(transaction);
    }

    // Generate frontend
    if (this.config.frontend[0] !== "none") {
      if (progress)
        await progress.nextStep(
          `Configuring ${this.config.frontend.join(", ")}`,
        );
      await this.generateFrontend(transaction);
    }

    // Generate database
    if (this.config.database !== "none") {
      if (progress)
        await progress.nextStep(`Configuring ${this.config.database}`);
      await this.generateDatabase(transaction);
    }

    // Generate authentication
    if (this.config.auth !== "none") {
      if (progress)
        await progress.nextStep(`Adding ${this.config.auth} authentication`);
      await this.generateAuth(transaction);
    }

    // Generate addons
    if (this.config.addons.length > 0) {
      if (progress)
        await progress.nextStep(`Adding ${this.config.addons.length} tools`);
      await this.generateAddons(transaction);
    }
  }

  /**
   * Generate backend using original generator
   */
  async generateBackend(transaction) {
    const { generateBackend } = await import("./backend-generator.js");
    await generateBackend(this.config);
  }

  /**
   * Generate frontend using original generator
   */
  async generateFrontend(transaction) {
    const { generateFrontend } = await import("./frontend-generator.js");
    await generateFrontend(this.config);
  }

  /**
   * Generate database using original generator
   */
  async generateDatabase(transaction) {
    const { generateDatabase } = await import("./database-generator.js");
    await generateDatabase(this.config);
  }

  /**
   * Generate authentication using original generator
   */
  async generateAuth(transaction) {
    const { generateAuth } = await import("./auth-generator.js");
    await generateAuth(this.config);
  }

  /**
   * Generate addons using original generator
   */
  async generateAddons(transaction) {
    const { generateAddons } = await import("./addon-generator.js");
    await generateAddons(this.config);
  }

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
}

/**
 * Create a new project with enhanced features
 * @param {Object} config - Project configuration
 * @param {Object} progress - Progress callback
 * @returns {Object} - Project creation result
 */
export async function createEnhancedProject(config, progress = null) {
  const generator = new EnhancedProjectGenerator(config);
  return await generator.createProject(progress);
}

export default { createEnhancedProject };
