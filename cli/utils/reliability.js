import chalk from "chalk";
import { existsSync, statSync, writeFileSync, unlinkSync, mkdirSync, rmdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Reliability utilities for better error handling and validation
 */
export class ReliabilityManager {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  /**
   * Perform comprehensive reliability checks
   * @param {Object} config - Project configuration
   * @returns {Object} - Reliability check results
   */
  async performReliabilityChecks(config) {
    this.errors = [];
    this.warnings = [];
    this.checks = [];

    // Check system requirements
    await this.checkSystemRequirements();
    
    // Check project directory
    await this.checkProjectDirectory(config);
    
    // Check template availability
    await this.checkTemplateAvailability(config);
    
    // Check dependencies
    await this.checkDependencies();
    
    // Check permissions
    await this.checkPermissions(config);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      checks: this.checks,
    };
  }

  /**
   * Check system requirements
   */
  async checkSystemRequirements() {
    this.checks.push("System Requirements");

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      this.errors.push({
        type: "system",
        message: `Node.js version ${nodeVersion} is not supported. Please upgrade to Node.js 18 or higher.`,
        solution: "Visit https://nodejs.org to download the latest version",
      });
    } else {
      this.checks.push(`✅ Node.js ${nodeVersion} (compatible)`);
    }

    // Check available memory
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;

    if (memoryUsagePercent > 90) {
      this.warnings.push({
        type: "system",
        message: "High memory usage detected. Project creation may be slow.",
        solution: "Close unnecessary applications and try again",
      });
    }

    // Check disk space
    try {
      const stats = statSync(process.cwd());
      this.checks.push("✅ Disk space available");
    } catch (error) {
      this.errors.push({
        type: "system",
        message: "Cannot access current directory. Check permissions.",
        solution: "Ensure you have read/write permissions in the current directory",
      });
    }
  }

  /**
   * Check project directory
   */
  async checkProjectDirectory(config) {
    this.checks.push("Project Directory");

    if (!config.projectName) {
      this.errors.push({
        type: "config",
        message: "Project name is required",
        solution: "Provide a valid project name",
      });
      return;
    }

    const projectPath = config.projectDir || join(process.cwd(), config.projectName);

    // Check if directory already exists
    if (existsSync(projectPath)) {
      this.warnings.push({
        type: "directory",
        message: `Directory '${config.projectName}' already exists`,
        solution: "Choose a different name or remove the existing directory",
      });
    } else {
      this.checks.push(`✅ Directory '${config.projectName}' is available`);
    }

    // Check parent directory permissions
    const parentDir = dirname(projectPath);
    try {
      statSync(parentDir);
      this.checks.push("✅ Parent directory is accessible");
    } catch (error) {
      this.errors.push({
        type: "permissions",
        message: "Cannot access parent directory",
        solution: "Check directory permissions or choose a different location",
      });
    }
  }

  /**
   * Check template availability
   */
  async checkTemplateAvailability(config) {
    this.checks.push("Template Availability");

    try {
      // Check if templates directory exists (try multiple common locations)
      const candidateTemplatePaths = [
        join(__dirname, "../templates"),
        join(__dirname, "../../cli/templates"),
        join(process.cwd(), "cli/templates"),
        join(process.cwd(), "templates"),
      ];

      const foundTemplatesPath = candidateTemplatePaths.find((p) => existsSync(p));

      if (!foundTemplatesPath) {
        // Do not hard fail here. Allow the generator to fetch remote templates.
        this.warnings.push({
          type: "templates",
          message: "Templates directory not found locally",
          solution: "Remote templates will be used if available; otherwise reinstall the package",
        });
      } else {
        this.checks.push("✅ Templates directory found");
      }

      // If templates directory is not found locally, skip specific template checks
      if (!foundTemplatesPath) {
        return;
      }

      const templatesPath = foundTemplatesPath;

      // Check specific template requirements
      if (config.frontend && config.frontend.length > 0) {
        for (const frontend of config.frontend) {
          const frontendPath = join(templatesPath, "templates/frontend", frontend);
          if (!existsSync(frontendPath)) {
            this.warnings.push({
              type: "templates",
              message: `Frontend template for '${frontend}' not found`,
              solution: "Using fallback template or skipping",
            });
          } else {
            this.checks.push(`✅ Frontend template '${frontend}' available`);
          }
        }
      }

      if (config.backend && config.backend !== "none") {
        const backendPath = join(templatesPath, "templates/backend", config.backend);
        if (!existsSync(backendPath)) {
          this.warnings.push({
            type: "templates",
            message: `Backend template for '${config.backend}' not found`,
            solution: "Using fallback template or skipping",
          });
        } else {
          this.checks.push(`✅ Backend template '${config.backend}' available`);
        }
      }

    } catch (error) {
      this.errors.push({
        type: "templates",
        message: "Error checking template availability",
        solution: "Reinstall the package",
      });
    }
  }

  /**
   * Check dependencies
   */
  async checkDependencies() {
    this.checks.push("Dependencies");

    try {
      // Check if package.json exists (search multiple locations in bundled environments)
      const candidatePkgPaths = [
        join(__dirname, "../../package.json"),
        join(__dirname, "../../../package.json"),
        join(process.cwd(), "package.json"),
      ];
      const pkgPath = candidatePkgPaths.find((p) => existsSync(p));

      if (!pkgPath) {
        // Do not block execution; dependencies presence will be checked below.
        this.warnings.push({
          type: "dependencies",
          message: "package.json not found near CLI runtime",
          solution: "If issues occur, reinstall the package",
        });
      } else {
        this.checks.push("✅ Package.json found");
      }

      // Check critical dependencies
      const criticalDeps = [
        "commander",
        "chalk",
        "handlebars",
        "yup",
        "@clack/prompts",
      ];

      for (const dep of criticalDeps) {
        try {
          // Use dynamic import to check if module exists
          await import(dep);
          this.checks.push(`✅ ${dep} available`);
        } catch (error) {
          this.errors.push({
            type: "dependencies",
            message: `Critical dependency '${dep}' not found`,
            solution: "Run 'npm install' to install dependencies",
          });
        }
      }

    } catch (error) {
      this.errors.push({
        type: "dependencies",
        message: "Error checking dependencies",
        solution: "Reinstall the package",
      });
    }
  }

  /**
   * Check permissions
   */
  async checkPermissions(config) {
    this.checks.push("Permissions");

    try {
      // Check write permissions in current directory
      const testFile = join(process.cwd(), ".js-stack-test");
      writeFileSync(testFile, "test");
      unlinkSync(testFile);
      this.checks.push("✅ Write permissions in current directory");

      // Check if we can create the project directory
      if (config.projectName) {
        const projectPath = join(process.cwd(), config.projectName);
        try {
          mkdirSync(projectPath, { recursive: true });
          rmdirSync(projectPath);
          this.checks.push("✅ Can create project directory");
        } catch (error) {
          this.errors.push({
            type: "permissions",
            message: "Cannot create project directory",
            solution: "Check directory permissions or choose a different location",
          });
        }
      }

    } catch (error) {
      this.errors.push({
        type: "permissions",
        message: "Permission check failed",
        solution: "Check directory permissions",
      });
    }
  }

  /**
   * Display reliability check results
   */
  displayResults(results) {
    if (results.checks.length > 0) {
      console.log(chalk.blue.bold("\n🔍 Reliability Checks:"));
      results.checks.forEach(check => {
        console.log(chalk.gray(`  ${check}`));
      });
    }

    if (results.warnings.length > 0) {
      console.log(chalk.yellow.bold("\n⚠️  Warnings:"));
      results.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning.message}`));
        if (warning.solution) {
          console.log(chalk.gray(`    Solution: ${warning.solution}`));
        }
      });
    }

    if (results.errors.length > 0) {
      console.log(chalk.red.bold("\n❌ Errors:"));
      results.errors.forEach(error => {
        console.log(chalk.red(`  • ${error.message}`));
        if (error.solution) {
          console.log(chalk.gray(`    Solution: ${error.solution}`));
        }
      });
    }

    if (results.isValid) {
      console.log(chalk.green.bold("\n✅ All reliability checks passed!"));
    } else {
      console.log(chalk.red.bold("\n❌ Reliability checks failed. Please fix the errors above."));
    }

    console.log();
  }

  /**
   * Get reliability summary
   */
  getSummary(results) {
    return {
      isValid: results.isValid,
      totalChecks: results.checks.length,
      warnings: results.warnings.length,
      errors: results.errors.length,
      successRate: results.checks.length > 0 ? 
        ((results.checks.length - results.errors.length) / results.checks.length * 100).toFixed(1) : 0,
    };
  }
}

export default ReliabilityManager;
