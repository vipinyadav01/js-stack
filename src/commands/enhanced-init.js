import path from "path";
import chalk from "chalk";
import gradient from "gradient-string";
import {
  collectProjectConfig,
  displayConfigSummary,
} from "../prompts-enhanced.js";

import { confirm, outro } from "@clack/prompts";
import { createEnhancedProject } from "../generators/project-generator.js";
import {
  displayConfigTable,
  displaySuccess,
  displayNextSteps,
  displayError,
  createStepProgress,
} from "../utils/modern-render.js";
import { performanceUtils } from "../utils/performance.js";
import { getPresetConfig, listPresets } from "../utils/validation.js";

/**
 * Enhanced initialization command with all improvements
 */
export async function enhancedInitCommand(projectName, options) {
  const performanceMonitor = performanceUtils.createMonitor();
  performanceMonitor.start();

  try {
    // Handle preset options
    if (options.preset) {
      const preset = getPresetConfig(options.preset);
      if (preset) {
        console.log(chalk.green.bold(`\n🎯 Using preset: ${preset.name}`));
        console.log(chalk.gray(`   ${preset.description}`));

        // Merge preset with CLI options
        options = {
          ...preset.config,
          ...options,
          preset: options.preset,
        };
      } else {
        console.log(chalk.yellow(`⚠️  Unknown preset: ${options.preset}`));
        console.log(chalk.gray("Available presets:"));
        listPresets().forEach((preset) => {
          console.log(chalk.gray(`  • ${preset.key}: ${preset.name}`));
        });
        process.exit(1);
      }
    }

    // If --yes flag is provided, use defaults
    if (options.yes) {
      options = {
        ...options,
        database: "sqlite",
        orm: "prisma",
        backend: "express",
        frontend: ["react"],
        auth: "jwt",
        addons: ["typescript", "eslint", "prettier"],
        packageManager: "npm",
        git: true,
        install: true,
      };
    }

    // Ensure package manager is set
    if (!options.packageManager) {
      options.packageManager = "npm";
    }

    // Collect project configuration
    const config = await collectProjectConfig(projectName, {
      ...options,
      ci: options.yes,
    });

    // Set project directory
    config.projectDir = path.resolve(process.cwd(), config.projectName);

    // Show configuration summary
    displayConfigSummary(config);

    // Confirm before proceeding
    const proceed = await confirm({
      message: chalk.cyan("Proceed with project creation?"),
      initialValue: true,
    });

    if (!proceed) {
      console.log(chalk.yellow("Project creation cancelled"));
      process.exit(0);
    }

    // Create progress steps
    const steps = [
      { icon: "🔍", title: "Validating configuration" },
      { icon: "📁", title: "Creating project structure" },
      { icon: "⚙️", title: "Processing templates" },
      { icon: "🎨", title: "Configuring frontend" },
      { icon: "💾", title: "Setting up database" },
      { icon: "🔐", title: "Adding authentication" },
      { icon: "🛠️", title: "Installing tools" },
      { icon: "📦", title: "Installing dependencies" },
      { icon: "🔍", title: "Running health checks" },
      { icon: "🚀", title: "Finalizing project" },
    ];

    const progress = createStepProgress(steps);

    // Create the project with enhanced features
    const result = await createEnhancedProject(config, progress);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Debug: Log the result structure
    if (options.verbose) {
      console.log(
        chalk.gray("Debug - Result structure:"),
        JSON.stringify(result, null, 2),
      );
    }

    // Show success message with enhanced details
    await displayEnhancedSuccess(result);

    // Show next steps
    const projectConfig = result.result?.result || config;
    displayNextSteps(projectConfig);

    // Show performance summary
    if (options.verbose) {
      performanceMonitor.displaySummary();
    }

    // Final outro
    const g = gradient(["#77a1d3", "#79cbca"]);
    outro(g("🎊 Happy coding!"));
  } catch (error) {
    console.error(chalk.red("Error creating project:"), error.message);
    if (options.verbose) {
      console.error(chalk.gray("Stack trace:"), error.stack);
    }
    process.exit(1);
  }
}

/**
 * Display enhanced success message
 */
async function displayEnhancedSuccess(result) {
  console.log();
  console.log(chalk.green.bold("╭─ Project Created Successfully!"));
  console.log(chalk.gray("│  Your project is ready to go"));
  console.log(chalk.green.bold("╰─────────────────────────────────────"));
  console.log();

  console.log(chalk.cyan.bold("📁 Project Details:"));
  console.log(
    chalk.gray(`  Name: ${result.result?.result?.projectName || "N/A"}`),
  );
  console.log(
    chalk.gray(`  Location: ${result.result?.result?.projectDir || "N/A"}`),
  );
  console.log();

  if (result.performance) {
    console.log(chalk.cyan.bold("⚡ Performance:"));
    console.log(
      chalk.gray(`  Total Time: ${result.performance.totalDuration}ms`),
    );
    console.log(
      chalk.gray(`  Operations: ${result.performance.operationCount}`),
    );
    console.log();
  }

  if (result.health) {
    console.log(chalk.cyan.bold("🔍 Health Check:"));
    console.log(chalk.gray(`  Passed: ${result.health.passed}`));
    console.log(chalk.gray(`  Warnings: ${result.health.warnings}`));
    console.log(chalk.gray(`  Failed: ${result.health.failed}`));
    console.log(
      chalk.gray(
        `  Success Rate: ${result.health.summary.successRate.toFixed(1)}%`,
      ),
    );
    console.log();
  }
}

/**
 * List available presets
 */
export function listPresetsCommand() {
  console.log(chalk.blue.bold("\n🎯 Available Presets"));
  console.log(chalk.gray("─".repeat(50)));

  const presets = listPresets();
  presets.forEach((preset) => {
    console.log(chalk.cyan.bold(`\n${preset.name}`));
    console.log(chalk.gray(`  Key: ${preset.key}`));
    console.log(chalk.gray(`  Description: ${preset.description}`));
  });

  console.log(chalk.gray("\nUsage:"));
  console.log(
    chalk.cyan("  npx create-js-stack init my-app --preset=saas-app"),
  );
  console.log(
    chalk.cyan("  npx create-js-stack init my-app --preset=api-service"),
  );
}

export default enhancedInitCommand;
