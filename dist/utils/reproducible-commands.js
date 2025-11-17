import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

/**
 * Generate reproducible CLI command from project configuration
 * Similar to the example you showed, but adapted for JS-Stack
 */
export function generateReproducibleCommand(config) {
  const flags = [];

  // Frontend
  if (
    config.frontend &&
    config.frontend.length > 0 &&
    config.frontend[0] !== "none"
  ) {
    flags.push(`--frontend ${config.frontend.join(" ")}`);
  } else {
    flags.push("--frontend none");
  }

  // Backend
  flags.push(`--backend ${config.backend || "none"}`);

  // Database
  flags.push(`--database ${config.database || "none"}`);

  // ORM
  flags.push(`--orm ${config.orm || "none"}`);

  // Auth
  flags.push(`--auth ${config.auth || "none"}`);

  // Addons
  if (config.addons && config.addons.length > 0) {
    flags.push(`--addons ${config.addons.join(",")}`);
  } else {
    flags.push("--addons none");
  }

  // Package manager
  flags.push(`--package-manager ${config.packageManager || "npm"}`);

  // Git initialization
  flags.push(config.git !== false ? "--git" : "--no-git");

  // Install dependencies
  flags.push(config.install !== false ? "--install" : "--no-install");

  // Build base command based on package manager
  let baseCommand = "npx create-js-stack@latest";
  const pkgManager = config.packageManager || "npm";

  switch (pkgManager) {
    case "bun":
      baseCommand = "bunx create-js-stack@latest";
      break;
    case "pnpm":
      baseCommand = "pnpm create js-stack@latest";
      break;
    case "yarn":
      baseCommand = "yarn create js-stack@latest";
      break;
    case "npm":
    default:
      baseCommand = "npx create-js-stack@latest";
      break;
  }

  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}

/**
 * Generate multiple reproducible commands for different scenarios
 */
export function generateMultipleCommands(config) {
  const commands = {
    // Main command with all options
    full: generateReproducibleCommand(config),

    // Simplified command (only essential options)
    simple: generateSimpleCommand(config),

    // Quick start command
    quick: generateQuickCommand(config),
  };

  return commands;
}

/**
 * Generate simplified command with only essential options
 */
export function generateSimpleCommand(config) {
  const flags = [];

  // Only include non-default values
  if (
    config.frontend &&
    config.frontend.length > 0 &&
    config.frontend[0] !== "react"
  ) {
    flags.push(`--frontend ${config.frontend.join(" ")}`);
  }

  if (config.backend && config.backend !== "express") {
    flags.push(`--backend ${config.backend}`);
  }

  if (config.database && config.database !== "mongodb") {
    flags.push(`--database ${config.database}`);
  }

  if (config.orm && config.orm !== "mongoose") {
    flags.push(`--orm ${config.orm}`);
  }

  if (config.auth && config.auth !== "jwt") {
    flags.push(`--auth ${config.auth}`);
  }

  if (config.addons && config.addons.length > 0) {
    flags.push(`--addons ${config.addons.join(",")}`);
  }

  if (config.packageManager && config.packageManager !== "npm") {
    flags.push(`--package-manager ${config.packageManager}`);
  }

  // Always include git and install flags for clarity
  flags.push(config.git !== false ? "--git" : "--no-git");
  flags.push(config.install !== false ? "--install" : "--no-install");

  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";
  const baseCommand = getBaseCommand(config.packageManager);

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}

/**
 * Generate quick start command (minimal options)
 */
export function generateQuickCommand(config) {
  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";
  const baseCommand = getBaseCommand(config.packageManager);

  // --yes automatically includes --git and --install
  return `${baseCommand}${projectPathArg} --yes`;
}

/**
 * Get base command based on package manager
 */
function getBaseCommand(packageManager = "npm") {
  switch (packageManager) {
    case "bun":
      return "bunx create-js-stack@latest";
    case "pnpm":
      return "pnpm create js-stack@latest";
    case "yarn":
      return "yarn create js-stack@latest";
    case "npm":
    default:
      return "npx create-js-stack@latest";
  }
}

/**
 * Display reproducible commands in a formatted way
 */
export function displayReproducibleCommands(config, options = {}) {
  const { showSimple = true, showQuick = true } = options;
  const commands = generateMultipleCommands(config);

  console.log("\n🔁 Reproducible Commands:");
  console.log("═══════════════════════════════════════");

  if (showQuick) {
    console.log(`\n📦 Quick Start:`);
    console.log(`  ${commands.quick}`);
  }

  if (showSimple) {
    console.log(`\n⚡ Simple (essential options only):`);
    console.log(`  ${commands.simple}`);
  }

  console.log(`\n🔧 Full Command (all options):`);
  console.log(`  ${commands.full}`);

  console.log(
    "\n💡 Tip: Use the simple command for sharing, full command for exact reproduction",
  );
}

/**
 * Export command as environment variable for easy copying
 */
export function exportCommandAsEnv(config, commandType = "full") {
  const commands = generateMultipleCommands(config);
  const command = commands[commandType];

  // Replace spaces with escaped spaces for environment variable
  const envCommand = command.replace(/ /g, "\\ ");

  console.log(`\n📋 Export as environment variable:`);
  console.log(`  export JS_STACK_COMMAND="${envCommand}"`);
  console.log(`  eval $JS_STACK_COMMAND`);
}

export default {
  generateReproducibleCommand,
  generateMultipleCommands,
  generateSimpleCommand,
  generateQuickCommand,
  displayReproducibleCommands,
  exportCommandAsEnv,
};
