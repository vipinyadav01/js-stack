import chalk from "chalk";
import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

/**
 * Generate reproducible commands for project recreation
 */
export class ReproducibleCommands {
  constructor() {
    this.commands = [];
  }

  /**
   * Generate the exact command to recreate the project
   * @param {Object} config - Project configuration
   * @returns {string} - Reproducible command
   */
  generateCommand(config) {
    const parts = ["npx create-js-stack@latest", config.projectName];

    // Add flags based on configuration
    if (config.database && config.database !== "none") {
      parts.push(`--database ${config.database}`);
    }

    if (config.orm && config.orm !== "none") {
      parts.push(`--orm ${config.orm}`);
    }

    if (config.backend && config.backend !== "none") {
      parts.push(`--backend ${config.backend}`);
    }

    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes("none")) {
      const frontendStr = config.frontend.join(",");
      parts.push(`--frontend ${frontendStr}`);
    }

    if (config.auth && config.auth !== "none") {
      parts.push(`--auth ${config.auth}`);
    }

    if (config.addons && config.addons.length > 0) {
      const addonsStr = config.addons.join(",");
      parts.push(`--addons ${addonsStr}`);
    }

    if (config.packageManager && config.packageManager !== "npm") {
      parts.push(`--pm ${config.packageManager}`);
    }

    if (config.typescript) {
      parts.push("--typescript");
    }

    if (config.git === false) {
      parts.push("--no-git");
    }

    if (config.install === false) {
      parts.push("--no-install");
    }

    return parts.join(" ");
  }

  /**
   * Generate alternative commands for different scenarios
   * @param {Object} config - Project configuration
   * @returns {Object} - Different command variations
   */
  generateAlternatives(config) {
    const alternatives = {
      minimal: this.generateMinimalCommand(config),
      full: this.generateFullCommand(config),
      preset: this.generatePresetCommand(config),
      interactive: this.generateInteractiveCommand(config),
    };

    return alternatives;
  }

  /**
   * Generate minimal command (only essential flags)
   */
  generateMinimalCommand(config) {
    const parts = ["npx create-js-stack@latest", config.projectName];

    // Only include non-default values
    if (config.database && config.database !== "sqlite") {
      parts.push(`--database ${config.database}`);
    }

    if (config.backend && config.backend !== "express") {
      parts.push(`--backend ${config.backend}`);
    }

    if (config.frontend && config.frontend.length > 0 && !config.frontend.includes("react")) {
      const frontendStr = config.frontend.join(",");
      parts.push(`--frontend ${frontendStr}`);
    }

    return parts.join(" ");
  }

  /**
   * Generate full command (all flags)
   */
  generateFullCommand(config) {
    return this.generateCommand(config);
  }

  /**
   * Generate preset-based command
   */
  generatePresetCommand(config) {
    // Try to match to a preset
    const preset = this.detectPreset(config);
    if (preset) {
      return `npx create-js-stack@latest ${config.projectName} --preset ${preset}`;
    }
    return this.generateCommand(config);
  }

  /**
   * Generate interactive command
   */
  generateInteractiveCommand(config) {
    return `npx create-js-stack@latest ${config.projectName}`;
  }

  /**
   * Detect if configuration matches a preset
   */
  detectPreset(config) {
    const presets = {
      saas: {
        frontend: ["nextjs"],
        backend: "none",
        database: "postgres",
        orm: "prisma",
        auth: "nextauth",
        addons: ["typescript", "tailwind", "eslint", "prettier"],
      },
      api: {
        frontend: ["none"],
        backend: "express",
        database: "postgres",
        orm: "prisma",
        auth: "jwt",
        addons: ["typescript", "eslint", "prettier"],
      },
      fullstack: {
        frontend: ["react"],
        backend: "express",
        database: "sqlite",
        orm: "prisma",
        auth: "jwt",
        addons: ["typescript", "eslint", "prettier"],
      },
      minimal: {
        frontend: ["react"],
        backend: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: [],
      },
    };

    for (const [presetName, presetConfig] of Object.entries(presets)) {
      if (this.configMatchesPreset(config, presetConfig)) {
        return presetName;
      }
    }

    return null;
  }

  /**
   * Check if config matches a preset
   */
  configMatchesPreset(config, presetConfig) {
    return (
      config.frontend.every(f => presetConfig.frontend.includes(f)) &&
      config.backend === presetConfig.backend &&
      config.database === presetConfig.database &&
      config.orm === presetConfig.orm &&
      config.auth === presetConfig.auth &&
      config.addons.every(a => presetConfig.addons.includes(a))
    );
  }

  /**
   * Display reproducible commands
   */
  displayCommands(config) {
    const command = this.generateCommand(config);
    const alternatives = this.generateAlternatives(config);

    console.log(chalk.green.bold("\n🔄 Reproducible Commands:"));
    console.log(chalk.gray("Copy and run this exact command to recreate your project:"));
    console.log();
    console.log(chalk.cyan.bold("📋 Exact Command:"));
    console.log(chalk.white(`  ${command}`));
    console.log();

    console.log(chalk.blue.bold("🎯 Alternative Commands:"));
    console.log(chalk.gray("  Minimal (essential flags only):"));
    console.log(chalk.white(`    ${alternatives.minimal}`));
    console.log();
    console.log(chalk.gray("  Interactive (prompts for all options):"));
    console.log(chalk.white(`    ${alternatives.interactive}`));
    console.log();

    if (alternatives.preset !== command) {
      console.log(chalk.gray("  Preset-based (if available):"));
      console.log(chalk.white(`    ${alternatives.preset}`));
      console.log();
    }

    // Add copy instruction
    console.log(chalk.yellow("💡 Tip: Click to copy the command above"));
  }

  /**
   * Generate command for adding features to existing project
   */
  generateAddCommand(features) {
    return `npx create-js-stack@latest add ${features.join(" ")}`;
  }

  /**
   * Display add commands
   */
  displayAddCommands(config) {
    if (config.addons && config.addons.length > 0) {
      console.log(chalk.blue.bold("\n➕ Add More Features:"));
      console.log(chalk.gray("Add these features to your existing project:"));
      console.log(chalk.white(`  ${this.generateAddCommand(config.addons)}`));
      console.log();
    }
  }
}

export default ReproducibleCommands;
