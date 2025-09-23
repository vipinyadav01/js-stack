import path from "path";
import chalk from "chalk";
import gradient from "gradient-string";
import { collectProjectConfig, displayConfigSummary } from "../prompts-enhanced.js";
import { processAndValidateFlags as processFlagsRobust, getProvidedFlags } from "../utils/flag-processing.js";

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
import { SmartCompatibility } from "../utils/smart-compatibility.js";
import { ReproducibleCommands } from "../utils/reproducible-commands.js";
import { ReliabilityManager } from "../utils/reliability.js";
import {
  createGhostSpinner,
  createGhostProgressBar,
  showGhostSuccess,
  showGhostError,
  showGhostWarning,
  showGhostInfo,
  showGhostStep,
  ghostColors,
  ghostIcons,
} from "../utils/terminal-ui.js";
import { CompatibilityEngine } from "../core/CompatibilityEngine.js";
import { DynamicInstaller } from "../core/DynamicInstaller.js";

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
        showGhostSuccess(`Using preset: ${preset.name}`, preset.description);

        // Merge preset with CLI options
        options = {
          ...preset.config,
          ...options,
          preset: options.preset,
        };
      } else {
        showGhostError(`Unknown preset: ${options.preset}`);
        showGhostInfo("Available presets:", 
          listPresets().map(preset => `• ${preset.key}: ${preset.name}`).join('\n')
        );
        process.exit(1);
      }
    }

    // If --yes flag is provided, respect provided flags and set CI mode; only fill missing values
    if (options.yes) {
      options = {
        ci: true,
        packageManager: options.packageManager || options.pm || "npm",
        // Do NOT override selections provided via flags
        database: options.database ?? undefined,
        orm: options.orm ?? undefined,
        backend: options.backend ?? undefined,
        frontend: options.frontend ?? undefined,
        auth: options.auth ?? undefined,
        addons: options.addons ?? undefined,
        git: options.git !== false,
        // Per requirement: always install even if --no-install passed
        install: true,
        ...options,
      };
    }

    // Non-interactive fast-path using robust processor when --yes
    let config;
    if (options.yes) {
      const provided = getProvidedFlags(options);
      config = processFlagsRobust(options, provided, projectName);
    } else {
      // Interactive path
      if (!options.packageManager) {
        options.packageManager = "npm";
      }
      config = await collectProjectConfig(projectName, { ...options, ci: false });
    }

    // Set project directory
    config.projectDir = path.resolve(process.cwd(), config.projectName);

    // Reliability checks
    const reliabilityManager = new ReliabilityManager();
    const reliabilityResults = await reliabilityManager.performReliabilityChecks(config);
    
    if (!reliabilityResults.isValid) {
      reliabilityManager.displayResults(reliabilityResults);
      throw new Error("Reliability checks failed. Please fix the errors above.");
    }

    if (options.verbose) {
      reliabilityManager.displayResults(reliabilityResults);
    }

    // Smart compatibility checking and auto-adjustments
    const smartCompatibility = new SmartCompatibility();
    const compatibilityResultSmart = smartCompatibility.checkAndAdjust(config);
    
    if (compatibilityResultSmart.hasAdjustments || compatibilityResultSmart.hasWarnings) {
      smartCompatibility.displayResults(compatibilityResultSmart);
    }

    // Enhanced compatibility analysis and display
    const compatibilityEngine = new CompatibilityEngine();
    const compatibilityReport = compatibilityEngine.checkCompatibility(config);
    compatibilityEngine.displayCompatibilityReport(compatibilityReport);

    if (!compatibilityReport.isValid) {
      showGhostWarning("Your selections have compatibility issues");
      if (options.yes) {
        showGhostInfo("Continuing despite issues due to --yes flag");
      } else {
        const proceedDespite = await confirm({
          message: chalk.yellow("Proceed anyway?"),
          initialValue: false,
        });
        if (!proceedDespite) {
          process.exit(1);
        }
      }
    }

    // Show configuration summary
    displayConfigSummary(config);

    // Confirm before proceeding
    let proceed = true;
    if (!options.yes) {
      proceed = await confirm({
        message: chalk.cyan("Proceed with project creation?"),
        initialValue: true,
      });
      if (!proceed) {
        console.log(chalk.yellow("Project creation cancelled"));
        process.exit(0);
      }
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

    // Dynamic post-install based on compatibility suggestions
    if (config.install) {
      const installer = new DynamicInstaller(config.projectDir, config.packageManager);
      // Install suggested addons or corrections (placeholder mapping in installer)
      await installer.installSuggestedAddons(compatibilityReport.suggestions);
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

    // Show reproducible commands
    const reproducibleCommands = new ReproducibleCommands();
    reproducibleCommands.displayCommands(projectConfig);
    reproducibleCommands.displayAddCommands(projectConfig);

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
  console.log(chalk.gray("      │  Your project is ready to go"));
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
