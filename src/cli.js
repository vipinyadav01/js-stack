#!/usr/bin/env node

import { program } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { initCommand } from "./commands/init.js";
import { enhancedInitCommand, listPresetsCommand } from "./commands/enhanced-init.js";
import { addCommand } from "./commands/add.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

// Clean and modern banner
function showBanner() {
  console.clear();
  
  // Main title with clean design
  console.log(chalk.white.bold("╭─────────────────────────────────────────────────────────╮"));
  console.log(chalk.white.bold("│") + chalk.blue.bold("  🚀 JS Stack Generator") + chalk.white.bold("                                    │"));
  console.log(chalk.white.bold("│") + chalk.gray("  Modern JavaScript Project Scaffolding Tool") + chalk.white.bold("        │"));
  console.log(chalk.white.bold("╰─────────────────────────────────────────────────────────╯"));
  console.log();
  
  // Version and system info
  console.log(chalk.gray("  📦 Version: ") + chalk.green.bold(packageJson.version));
  console.log(chalk.gray("  🚀 Node.js: ") + chalk.green(process.version));
  console.log(chalk.gray("  💻 Platform: ") + chalk.yellow(process.platform));
  console.log(chalk.gray("  🔧 Runtime: ") + chalk.magenta("ESM"));
  console.log();
}

// Enhanced error handling with better messages
function handleCliError(error, command = null) {
  console.log();
  
  const errorMap = {
    'commander.version': { exit: 0 },
    'commander.helpDisplayed': { exit: 0 },
    'commander.missingArgument': {
      message: '❌ Missing required argument',
      tip: `Run "${chalk.cyan('npx create-js-stack ' + (command || '--help'))}" for usage info`,
      exit: 1
    },
    'commander.unknownOption': {
      message: '❌ Unknown option provided',
      tip: `Run "${chalk.cyan('npx create-js-stack --help')}" to see valid options`,
      exit: 1
    },
    'commander.unknownCommand': {
      message: '❌ Unknown command provided',
      tip: `Run "${chalk.cyan('npx create-js-stack list')}" to see available commands`,
      exit: 1
    },
    'commander.invalidArgument': {
      message: '❌ Invalid argument provided',
      tip: `Check your argument format and try again`,
      exit: 1
    }
  };

  const errorInfo = errorMap[error.code] || {
    message: '❌ An unexpected error occurred',
    tip: 'Please report this issue if it persists',
    exit: 1
  };

  if (errorInfo.message) {
    console.error(chalk.red.bold(errorInfo.message));
    if (error.message) {
      console.error(chalk.gray(`   Details: ${error.message}`));
    }
  }

  if (errorInfo.tip) {
    console.log(chalk.yellow(`\n💡 Tip: ${errorInfo.tip}`));
  }

  console.log();
  process.exit(errorInfo.exit);
}

// Validation middleware for commands
function validateProjectName(name) {
  if (!name) return null;
  
  const validationRules = [
    { test: /^[a-zA-Z0-9-_]+$/, message: 'Project name can only contain letters, numbers, hyphens, and underscores' },
    { test: name => name.length >= 2, message: 'Project name must be at least 2 characters long' },
    { test: name => name.length <= 50, message: 'Project name must be less than 50 characters' },
    { test: name => !name.startsWith('-'), message: 'Project name cannot start with a hyphen' },
    { test: name => !name.endsWith('-'), message: 'Project name cannot end with a hyphen' },
  ];

  for (const rule of validationRules) {
    const isValid = typeof rule.test === 'function' ? rule.test(name) : rule.test.test(name);
    if (!isValid) {
      console.error(chalk.red(`❌ ${rule.message}`));
      console.log(chalk.yellow(`💡 Example: ${chalk.cyan('my-awesome-project')}`));
      process.exit(1);
    }
  }
  
  return name;
}

// Main CLI configuration with enhanced metadata
program
  .name("create-js-stack")
  .description("🚀 CLI tool for scaffolding modern JavaScript full-stack projects with best practices")
  .version(packageJson.version, '-v, --version', 'display version number')
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
    writeOut: (str) => process.stdout.write(chalk.cyan(str)),
    writeErr: (str) => process.stderr.write(chalk.red(str)),
  })
  .showHelpAfterError(chalk.yellow("💡 Add --help for detailed usage information"));

// Enhanced Init command with better validation and options
program
  .command("init [project-name]")
  .alias("create")
  .alias("new")
  .alias("i")
  .description(chalk.cyan("🏗️  Create a new JavaScript stack project"))
  .option("-y, --yes", chalk.gray("🚀 Use default configuration (quick start)"))
  .option("-p, --preset <name>", chalk.gray("🎯 Use a preset configuration (saas-app, api-service, mobile-app, etc.)"))
  .option("-t, --template <name>", chalk.gray("📄 Use a specific template"))
  .option("--database <type>", chalk.gray("🗄️  Database: sqlite, postgres, mysql, mongodb, supabase, planetscale, none"))
  .option("--orm <type>", chalk.gray("🔗 ORM: prisma, sequelize, mongoose, typeorm, drizzle, none"))
  .option("--backend <type>", chalk.gray("⚙️  Backend: express, fastify, koa, hapi, nestjs, trpc, none"))
  .option("--frontend <types...>", chalk.gray("🎨 Frontend: react, vue, angular, svelte, nextjs, nuxt, astro, remix"))
  .option("--auth <type>", chalk.gray("🔐 Auth: jwt, passport, auth0, firebase, clerk, supabase, none"))
  .option("--styling <type>", chalk.gray("💅 Styling: tailwind, styled-components, emotion, sass, css-modules"))
  .option("--testing <type>", chalk.gray("🧪 Testing: jest, vitest, playwright, cypress"))
  .option("--addons <addons...>", chalk.gray("🛠️  Tools: eslint, prettier, husky, docker, storybook, turborepo"))
  .option("--pm <manager>", chalk.gray("📦 Package manager: npm, yarn, pnpm, bun"))
  .option("--typescript", chalk.gray("📘 Use TypeScript"))
  .option("--no-git", chalk.gray("⏭️  Skip git initialization"))
  .option("--no-install", chalk.gray("⏭️  Skip dependency installation"))
  .option("--verbose", chalk.gray("🔍 Show detailed output"))
  .option("--dry-run", chalk.gray("🧪 Preview what would be created without making changes"))
  .addHelpText('after', `
${chalk.gray('Examples:')}
  ${chalk.cyan('$ npx create-js-stack init my-app')}                    ${chalk.gray('# Interactive setup')}
  ${chalk.cyan('$ npx create-js-stack init my-app --yes')}              ${chalk.gray('# Quick start with defaults')}
  ${chalk.cyan('$ npx create-js-stack init my-app --preset=saas-app')} ${chalk.gray('# Use preset configuration')}
  ${chalk.cyan('$ npx create-js-stack init my-app --typescript --frontend=react --backend=express')}
`)
  .action(async (projectName, options) => {
    // Validate project name if provided
    if (projectName) {
      projectName = validateProjectName(projectName);
    }
    
    // Show banner for interactive mode
    if (!options.yes && !projectName && process.argv.length === 3) {
      showBanner();
    }
    
    // Enhanced debug output
    if (options.verbose) {
      console.log(chalk.gray("📋 Debug Information:"));
      console.log(chalk.gray("  Project Name:"), chalk.cyan(projectName || 'Not specified'));
      console.log(chalk.gray("  Options:"), chalk.cyan(JSON.stringify(options, null, 2)));
      console.log(chalk.gray("  Node Version:"), chalk.green(process.version));
      console.log(chalk.gray("  Working Directory:"), chalk.yellow(process.cwd()));
      console.log();
    }
    
    try {
      // Use enhanced init command for better features
      await enhancedInitCommand(projectName, options);
    } catch (error) {
      console.error(chalk.red.bold("❌ Project initialization failed:"));
      console.error(chalk.gray(`   ${error.message}`));
      if (options.verbose) {
        console.error(chalk.gray("   Stack trace:"), error.stack);
      }
      process.exit(1);
    }
  });

// Enhanced Add command with better feature management
program
  .command("add <features...>")
  .alias("install")
  .alias("a")
  .description(chalk.cyan("➕ Add features to an existing project"))
  .option("--dev", chalk.gray("📦 Install as dev dependencies"))
  .option("--config", chalk.gray("⚙️  Generate configuration files"))
  .option("--no-install", chalk.gray("⏭️  Skip dependency installation"))
  .option("--force", chalk.gray("💪 Force overwrite existing files"))
  .option("--verbose", chalk.gray("🔍 Show detailed output"))
  .addHelpText('after', `
${chalk.gray('Available Features:')}
  ${chalk.cyan('auth')}        ${chalk.gray('# Authentication setup')}
  ${chalk.cyan('database')}    ${chalk.gray('# Database configuration')}
  ${chalk.cyan('testing')}     ${chalk.gray('# Testing framework')}
  ${chalk.cyan('docker')}      ${chalk.gray('# Docker configuration')}
  ${chalk.cyan('ci/cd')}       ${chalk.gray('# GitHub Actions workflow')}

${chalk.gray('Examples:')}
  ${chalk.cyan('$ npx create-js-stack add auth database')}
  ${chalk.cyan('$ npx create-js-stack add testing --dev')}
`)
  .action(async (features, options) => {
    console.log(chalk.blue(`➕ Adding features: ${chalk.cyan(features.join(', '))}`));
    
    try {
      await addCommand(features, options);
    } catch (error) {
      console.error(chalk.red.bold("❌ Feature addition failed:"));
      console.error(chalk.gray(`   ${error.message}`));
      process.exit(1);
    }
  });

// Enhanced Docs command
program
  .command("docs [topic]")
  .alias("documentation")
  .alias("d")
  .description(chalk.cyan("📚 Open documentation"))
  .option("--offline", chalk.gray("📖 Show offline help"))
  .addHelpText('after', `
${chalk.gray('Available Topics:')}
  ${chalk.cyan('getting-started')}  ${chalk.gray('# Quick start guide')}
  ${chalk.cyan('templates')}        ${chalk.gray('# Available templates')}
  ${chalk.cyan('configuration')}    ${chalk.gray('# Configuration options')}
  ${chalk.cyan('troubleshooting')}  ${chalk.gray('# Common issues and solutions')}
`)
  .action(async (topic, options) => {
    if (options.offline) {
      console.log(chalk.yellow("Offline help not available. Please check the documentation online."));
      return;
    }

    const { openUrl } = await import("./utils/open-url.js");
    const baseUrl = "https://github.com/vipinyadav01/create-js-stack-cli";
    const docsUrl = topic ? `${baseUrl}/wiki/${topic}` : `${baseUrl}#readme`;
    
    const g = gradient(["#5ee7df", "#b490ca"]);
    console.log();
    console.log(g("📖 Opening documentation..."));
    
    try {
      await openUrl(docsUrl);
      console.log(chalk.green("✅ Documentation opened in your browser"));
    } catch (error) {
      console.log(chalk.yellow("⚠️  Could not open browser automatically"));
    }
    
    console.log(chalk.gray("\n📎 Documentation URL:"));
    console.log(chalk.cyan(`   ${docsUrl}\n`));
  });

// Enhanced List command
program
  .command("list [category]")
  .alias("ls")
  .alias("options")
  .alias("l")
  .description(chalk.cyan("📋 List available options and templates"))
  .option("--json", chalk.gray("📄 Output in JSON format"))
  .option("--table", chalk.gray("📊 Output in table format"))
  .addHelpText('after', `
${chalk.gray('Categories:')}
  ${chalk.cyan('templates')}    ${chalk.gray('# Available project templates')}
  ${chalk.cyan('databases')}    ${chalk.gray('# Supported databases')}
  ${chalk.cyan('frontends')}    ${chalk.gray('# Frontend frameworks')}
  ${chalk.cyan('backends')}     ${chalk.gray('# Backend frameworks')}
  ${chalk.cyan('addons')}       ${chalk.gray('# Available add-ons')}
  ${chalk.cyan('presets')}      ${chalk.gray('# Available preset configurations')}
`)
  .action(async (category, options) => {
    if (category === 'presets') {
      listPresetsCommand();
    } else {
      const { listOptions } = await import("./commands/list.js");
      await listOptions(category, options);
    }
  });

// Presets command
program
  .command("presets")
  .alias("preset")
  .description(chalk.cyan("🎯 List available preset configurations"))
  .action(() => {
    listPresetsCommand();
  });

// New Commands

// Update command
program
  .command("update")
  .alias("upgrade")
  .alias("u")
  .description(chalk.cyan("🔄 Update create-js-stack to latest version"))
  .option("--check", chalk.gray("🔍 Check for updates without installing"))
  .action(async (options) => {
    console.log(chalk.yellow("Update command not implemented yet."));
  });

// Config command
program
  .command("config")
  .alias("c")
  .description(chalk.cyan("⚙️  Manage global configuration"))
  .option("--set <key=value>", chalk.gray("🔧 Set configuration value"))
  .option("--get <key>", chalk.gray("📖 Get configuration value"))
  .option("--list", chalk.gray("📋 List all configuration"))
  .option("--reset", chalk.gray("🔄 Reset to defaults"))
  .action(async (options) => {
    console.log(chalk.yellow("Config command not implemented yet."));
  });

// Info command
program
  .command("info")
  .alias("status")
  .description(chalk.cyan("ℹ️  Show project and system information"))
  .option("--system", chalk.gray("💻 Show system information"))
  .option("--project", chalk.gray("📦 Show project information"))
  .action(async (options) => {
    console.log(chalk.yellow("Info command not implemented yet."));
  });

// Enhanced help text
program.addHelpText("before", () => {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showBanner();
  }
  return "";
});

program.addHelpText("after", () => {
  console.log();
  console.log(chalk.gray("🎯 Quick Start:"));
  console.log(chalk.cyan("  $ npx create-js-stack init my-app"));
  console.log(chalk.cyan("  $ npx create-js-stack list"));
  console.log();
  console.log(chalk.gray("🔗 Resources:"));
  console.log(chalk.cyan("  • Documentation: ") + chalk.underline("https://github.com/vipinyadav01/create-js-stack-cli"));
  console.log(chalk.cyan("  • Issues: ") + chalk.underline("https://github.com/vipinyadav01/create-js-stack-cli/issues"));
  console.log(chalk.cyan("  • Discussions: ") + chalk.underline("https://github.com/vipinyadav01/create-js-stack-cli/discussions"));
  console.log();
  console.log(chalk.gray("💡 Need help? Run any command with ") + chalk.cyan("--help") + chalk.gray(" for detailed usage"));
  return "";
});

// Enhanced error handling and execution
program.exitOverride();

// Global error handler
process.on('uncaughtException', (error) => {
  console.error(chalk.red.bold('\n❌ Uncaught Exception:'));
  console.error(chalk.gray(error.message));
  console.log(chalk.yellow('\n💡 Please report this issue if it persists'));
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red.bold('\n❌ Unhandled Promise Rejection:'));
  console.error(chalk.gray(reason));
  console.log(chalk.yellow('\n💡 Please report this issue if it persists'));
  process.exit(1);
});

try {
  // Show banner for bare command
  if (process.argv.length === 2) {
    showBanner();
    program.outputHelp();
    process.exit(0);
  }

  await program.parseAsync(process.argv);
} catch (error) {
  const command = process.argv[2];
  handleCliError(error, command);
}