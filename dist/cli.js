#!/usr/bin/env node

import { program } from "commander";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import os from "os";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import chalkAnimation from "chalk-animation";
import {
  enhancedInitCommand,
  listPresetsCommand,
} from "./commands/enhanced-init.js";
import { displayDebugInfo } from "./utils/debug-display.js";
import { addCommand } from "./commands/add.js";
import {
  createGhostBanner,
  showGhostError,
  showGhostInfo,
  showGhostFeatures,
  showGhostSystemInfo,
  ghostColors,
  ghostIcons,
} from "./utils/terminal-ui.js";
import { ProjectNameSchema } from "./config/ValidationSchemas.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

// Modern colors using standard chalk colors
const colors = {
  primary: chalk.blue.bold,
  secondary: chalk.cyan,
  accent: chalk.yellow.bold,
  success: chalk.green.bold,
  warning: chalk.yellow.bold,
  error: chalk.red.bold,
  info: chalk.blue,
  muted: chalk.gray,
  bg: "black",
  text: chalk.white,
};

// Modern icons with better semantics
const icons = {
  rocket: "🚀",
  sparkles: "✨",
  gear: "⚙️",
  package: "📦",
  database: "🗄️",
  shield: "🛡️",
  paint: "🎨",
  test: "🧪",
  lightning: "⚡",
  check: "✅",
  warning: "⚠️",
  error: "❌",
  info: "ℹ️",
  bulb: "💡",
  target: "🎯",
  book: "📚",
  link: "🔗",
  search: "🔍",
  heart: "❤️",
  star: "⭐",
  crystal: "💎",
};

const applyProjectCreationOptions = (command) => {
  const optionDefinitions = [
    [
      "-y, --yes",
      colors.muted(
        `${icons.lightning} Use default configuration (quick start)`,
      ),
    ],
    [
      "-p, --preset <name>",
      colors.muted(
        `${icons.target} Use preset: saas, api, mobile, fullstack, minimal`,
      ),
    ],
    [
      "-t, --template <name>",
      colors.muted(`${icons.file} Use specific template`),
    ],
    [
      "--database <type>",
      colors.muted(
        `${icons.database} Database: sqlite, postgres, mysql, mongodb`,
      ),
    ],
    [
      "--orm <type>",
      colors.muted(`${icons.gear} ORM: prisma, sequelize, mongoose, typeorm`),
    ],
    [
      "--backend <type>",
      colors.muted(
        `${icons.gear} Backend: express, fastify, koa, hapi, nestjs`,
      ),
    ],
    [
      "--frontend <types...>",
      colors.muted(
        `${icons.paint} Frontend: react, vue, angular, svelte, nextjs, nuxt, react-native`,
      ),
    ],
    [
      "--auth <type>",
      colors.muted(
        `${icons.shield} Auth: jwt, passport, auth0, oauth, better-auth, none`,
      ),
    ],
    [
      "--styling <type>",
      colors.muted(
        `${icons.paint} Styling: tailwind, shadcn, chakra, mantine, styled-components`,
      ),
    ],
    [
      "--testing <type>",
      colors.muted(`${icons.test} Testing: vitest, jest, playwright, cypress`),
    ],
    [
      "--addons <addons...>",
      colors.muted(`${icons.package} Tools: docker, testing, biome, turborepo`),
    ],
    [
      "--deployment <type>",
      colors.muted(
        `${icons.rocket} Deployment: vercel, netlify, cloudflare, aws, railway, render, none`,
      ),
    ],
    [
      "-m, --package-manager <manager>",
      colors.muted(
        `${icons.package} Package manager (long form): npm, yarn, pnpm, bun`,
      ),
    ],
    ["--typescript", colors.muted(`${icons.crystal} Enable TypeScript`)],
    ["--git", colors.muted(`${icons.check} Initialize git repository`)],
    ["--no-git", colors.muted(`${icons.cross} Skip git initialization`)],
    [
      "--no-install",
      colors.muted(`${icons.cross} Skip dependency installation`),
    ],
    ["--install", colors.muted(`${icons.package} Install dependencies`)],
    ["--verbose", colors.muted(`${icons.search} Show detailed output`)],
    [
      "--dry-run",
      colors.muted(`${icons.bulb} Preview changes without creating files`),
    ],
    [
      "--interactive",
      colors.muted(`${icons.sparkles} Enhanced interactive mode`),
    ],
  ];

  optionDefinitions.forEach(([flags, description]) => {
    command.option(flags, description);
  });

  return command;
};

const buildUsageExamples = () =>
  boxen(
    `${icons.bulb} ${chalk.bold("Usage Examples:")}

${colors.primary("npx create-js-stack@latest my-app")}                     ${colors.muted("# Interactive setup")}
${colors.primary("npx create-js-stack@latest my-app --yes")}               ${colors.muted("# Quick start (recommended)")}
${colors.primary("npx create-js-stack@latest --preset saas")}              ${colors.muted("# SaaS application")}
${colors.primary("npx create-js-stack@latest api-server --preset api")}    ${colors.muted("# REST API server")}
${colors.primary("npx create-js-stack@latest mobile-app --preset mobile")} ${colors.muted("# Mobile application")}

${icons.target} ${chalk.bold("Popular Presets:")}
  ${colors.success("saas")}      - Full-stack SaaS with auth, database, and payments
  ${colors.success("api")}       - RESTful API with database and authentication  
  ${colors.success("fullstack")} - Full-stack web app with modern tooling
  ${colors.success("minimal")}   - Lightweight starter template

${icons.sparkles} ${chalk.bold("New Features:")}
  ${colors.success("layered")}   - Layered template system (Base → Framework → Integration → Feature → Tooling)
  ${colors.success("monorepo")}  - Turborepo monorepo structure with apps/, packages/, configs/
  ${colors.success("smart")}     - Smart compatibility with auto-adjustments
  ${colors.success("conflict")}  - Intelligent conflict resolution for overlapping templates
  ${colors.success("deployment")} - Built-in deployment templates (Vercel, Cloudflare, etc.)`,
    {
      padding: 1,
      margin: { top: 1, bottom: 0, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "magenta",
      backgroundColor: colors.bg,
    },
  );

const registerProjectCreationCommand = (command) => {
  applyProjectCreationOptions(command);
  command.addHelpText("after", buildUsageExamples);
  command.action(runProjectCreation);
  return command;
};

// Enhanced ghost-themed banner
function showBanner() {
  // Create ghost banner
  createGhostBanner("JS Stack");

  // Show system information
  showGhostSystemInfo();

  // Show available features
  const features = [
    {
      name: "Frontend",
      description: "React, Vue, Angular, Svelte",
      icon: ghostIcons.paint,
      status: "✅",
    },
    {
      name: "Backend",
      description: "Express, Fastify, NestJS, Koa",
      icon: ghostIcons.gear,
      status: "✅",
    },
    {
      name: "Database",
      description: "PostgreSQL, MongoDB, SQLite",
      icon: ghostIcons.database,
      status: "✅",
    },
    {
      name: "ORM",
      description: "Prisma, Sequelize, Mongoose",
      icon: ghostIcons.shield,
      status: "✅",
    },
    {
      name: "Auth",
      description: "JWT, Passport, Auth0",
      icon: ghostIcons.lock,
      status: "✅",
    },
    {
      name: "Monorepo",
      description: "Turborepo support",
      icon: ghostIcons.package,
      status: "🆕",
    },
    {
      name: "Testing",
      description: "Jest, Vitest, Cypress",
      icon: ghostIcons.test,
      status: "✅",
    },
    {
      name: "DevOps",
      description: "Docker, CI/CD, GitHub Actions",
      icon: ghostIcons.terminal,
      status: "✅",
    },
  ];

  showGhostFeatures(features);
}

// Helper functions for enhanced system info
function getPlatformIcon() {
  const platform = process.platform;
  const platformIcons = {
    win32: "🪟 ",
    darwin: "🍎 ",
    linux: "🐧 ",
    freebsd: "👹 ",
    openbsd: "🐡 ",
    sunos: "☀️ ",
    aix: "🔵 ",
  };
  return platformIcons[platform] || "💻 ";
}

function getMemoryUsage() {
  const used = process.memoryUsage();
  const usage = Math.round((used.heapUsed / 1024 / 1024) * 100) / 100;
  return `Memory: ${usage}MB`;
}

// Enhanced error handling with better messages
function handleCliError(error, command = null) {
  console.log();

  const errorMap = {
    "commander.version": { exit: 0 },
    "commander.helpDisplayed": { exit: 0 },
    "commander.missingArgument": {
      message: "❌ Missing required argument",
      tip: `Run "${chalk.cyan("npx create-js-stack " + (command || "--help"))}" for usage info`,
      exit: 1,
    },
    "commander.unknownOption": {
      message: "❌ Unknown option provided",
      tip: `Run "${chalk.cyan("npx create-js-stack --help")}" to see valid options`,
      exit: 1,
    },
    "commander.unknownCommand": {
      message: "❌ Unknown command provided",
      tip: `Run "${chalk.cyan("npx create-js-stack list")}" to see available commands`,
      exit: 1,
    },
    "commander.invalidArgument": {
      message: "❌ Invalid argument provided",
      tip: `Check your argument format and try again`,
      exit: 1,
    },
  };

  const errorInfo = errorMap[error.code] || {
    message: "❌ An unexpected error occurred",
    tip: "Please report this issue if it persists",
    exit: 1,
  };

  if (errorInfo.message) {
    showGhostError(errorInfo.message, error.message);
  }

  if (errorInfo.tip) {
    showGhostInfo(`💡 Tip: ${errorInfo.tip}`);
  }

  console.log();
  process.exit(errorInfo.exit);
}

// Validation middleware for commands - uses Yup schemas from ValidationSchemas.js
async function validateProjectName(name) {
  if (!name) return null;

  try {
    // Use centralized Yup validation from ValidationSchemas.js
    await ProjectNameSchema.validate(name);
    return name;
  } catch (error) {
    console.error(chalk.red(`❌ ${error.message}`));
    console.log(
      chalk.yellow(`💡 Example: ${chalk.cyan("my-awesome-project")}`),
    );
    process.exit(1);
  }
}

async function runProjectCreation(projectName, options) {
  if (projectName) {
    projectName = await validateProjectName(projectName);
  }

  if (!options.yes && !projectName && process.argv.length === 3) {
    showBanner();
  }

  if (options.verbose) {
    displayDebugInfo(projectName, options);
  }

  try {
    await enhancedInitCommand(projectName, options);
  } catch (error) {
    console.error(chalk.red.bold("❌ Project initialization failed:"));
    console.error(chalk.gray(`   ${error.message}`));
    if (options.verbose) {
      console.error(chalk.gray("   Stack trace:"), error.stack);
    }
    process.exit(1);
  }
}

// Main CLI configuration with enhanced metadata
program
  .name("create-js-stack")
  .description(
    "🚀 Advanced CLI tool for scaffolding modern JavaScript full-stack projects with layered templates, smart compatibility, and monorepo support",
  )
  .version(packageJson.version, "-v, --version", "display version number")
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
    writeOut: (str) => process.stdout.write(chalk.cyan(str)),
    writeErr: (str) => process.stderr.write(chalk.red(str)),
  })
  .showHelpAfterError(
    chalk.yellow("💡 Add --help for detailed usage information"),
  );

// Main command configuration for project creation
registerProjectCreationCommand(
  program.argument("[projectName]", "Name of the project to create"),
);

// Modern Init command with enhanced UX and comprehensive options
registerProjectCreationCommand(
  program
    .command("init [project-name]")
    .aliases(["create", "new", "i", "scaffold"])
    .description(
      colors.secondary(`${icons.rocket} Create a new JavaScript stack project`),
    ),
);

// Modern Add command with enhanced feature management
program
  .command("add <features...>")
  .aliases(["install", "a", "extend"])
  .description(
    colors.accent(`${icons.sparkles} Add features to an existing project`),
  )
  .option("--dev", colors.muted(`${icons.package} Install as dev dependencies`))
  .option(
    "--config",
    colors.muted(`${icons.gear} Generate configuration files`),
  )
  .option(
    "--no-install",
    colors.muted(`${icons.cross} Skip dependency installation`),
  )
  .option(
    "--force",
    colors.muted(`${icons.fire} Force overwrite existing files`),
  )
  .option(
    "--interactive",
    colors.muted(`${icons.sparkles} Interactive feature selection`),
  )
  .option("--verbose", colors.muted(`${icons.search} Show detailed output`))
  .addHelpText(
    "after",
    `
${chalk.gray("Available Features:")}
  ${chalk.cyan("auth")}        ${chalk.gray("# Authentication setup")}
  ${chalk.cyan("database")}    ${chalk.gray("# Database configuration")}
  ${chalk.cyan("testing")}     ${chalk.gray("# Testing framework")}
  ${chalk.cyan("docker")}      ${chalk.gray("# Docker configuration")}
  ${chalk.cyan("ci/cd")}       ${chalk.gray("# GitHub Actions workflow")}

${chalk.gray("Examples:")}
  ${chalk.cyan("$ npx create-js-stack@latest add auth database")}
  ${chalk.cyan("$ npx create-js-stack@latest add testing --dev")}
`,
  )
  .action(async (features, options) => {
    console.log(
      chalk.blue(`➕ Adding features: ${chalk.cyan(features.join(", "))}`),
    );

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
  .addHelpText(
    "after",
    `
${chalk.gray("Available Topics:")}
  ${chalk.cyan("getting-started")}  ${chalk.gray("# Quick start guide")}
  ${chalk.cyan("templates")}        ${chalk.gray("# Available templates")}
  ${chalk.cyan("configuration")}    ${chalk.gray("# Configuration options")}
  ${chalk.cyan("troubleshooting")}  ${chalk.gray("# Common issues and solutions")}
`,
  )
  .action(async (topic, options) => {
    if (options.offline) {
      console.log(
        chalk.yellow(
          "Offline help not available. Please check the documentation online.",
        ),
      );
      return;
    }

    const { openUrl } = await import("./utils/open-url.js");
    const baseUrl = "https://github.com/vipinyadav01/js-stack";
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

// Sponsors command
program
  .command("sponsors")
  .alias("sponsor")
  .description(chalk.cyan("❤️ Show sponsors and supporters"))
  .action(async () => {
    const { openUrl } = await import("./utils/open-url.js");
    const sponsorsUrl = "https://github.com/sponsors/vipinyadav01";

    const g = gradient(["#ff6b6b", "#4ecdc4"]);
    console.log();
    console.log(g("❤️ Thank you to our sponsors!"));
    console.log();
    console.log(chalk.gray("Support the project development:"));
    console.log(chalk.cyan(`   ${sponsorsUrl}\n`));

    try {
      await openUrl(sponsorsUrl);
      console.log(chalk.green("✅ Sponsors page opened in your browser"));
    } catch (error) {
      console.log(chalk.yellow("⚠️  Could not open browser automatically"));
    }
  });

// Builder command
program
  .command("builder")
  .alias("build")
  .description(chalk.cyan("🔧 Show project builder information"))
  .action(() => {
    const g = gradient(["#667eea", "#764ba2"]);
    console.log();
    console.log(g("🔧 Create JS Stack Builder"));
    console.log();
    console.log(chalk.gray("Built with modern tools and best practices:"));
    console.log(chalk.cyan("  • Node.js + ES Modules"));
    console.log(chalk.cyan("  • Commander.js for CLI"));
    console.log(chalk.cyan("  • Handlebars for templating"));
    console.log(chalk.cyan("  • Yup for validation"));
    console.log(chalk.cyan("  • Chalk for beautiful output"));
    console.log();
    console.log(chalk.gray("Version:"), chalk.green(packageJson.version));
    console.log(chalk.gray("Node:"), chalk.green(process.version));
    console.log();
  });

// Enhanced List command with modern design
program
  .command("list [category]")
  .aliases(["ls", "options", "l", "browse", "explore"])
  .description(
    colors.info(`${icons.search} Browse available options and templates`),
  )
  .option("--json", chalk.gray("📄 Output in JSON format"))
  .option("--table", chalk.gray("📊 Output in table format"))
  .addHelpText(
    "after",
    `
${chalk.gray("Categories:")}
  ${chalk.cyan("templates")}    ${chalk.gray("# Available project templates")}
  ${chalk.cyan("databases")}    ${chalk.gray("# Supported databases")}
  ${chalk.cyan("frontends")}    ${chalk.gray("# Frontend frameworks")}
  ${chalk.cyan("backends")}     ${chalk.gray("# Backend frameworks")}
  ${chalk.cyan("addons")}       ${chalk.gray("# Available add-ons")}
  ${chalk.cyan("presets")}      ${chalk.gray("# Available preset configurations")}
`,
  )
  .action(async (category, options) => {
    if (category === "presets") {
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

// Interactive command with ghost theme
program
  .command("interactive")
  .alias("i")
  .description(
    ghostColors.ghost("👻 Interactive project creation with ghost theme"),
  )
  .option("--preset <preset>", "Use a predefined configuration preset")
  .action(async (options) => {
    try {
      createGhostBanner("JS Stack");
      await enhancedInitCommand(undefined, {
        ...options,
        interactive: true,
      });
    } catch (error) {
      handleCliError(error, "interactive");
    }
  });

// New Commands

// Enhanced help text with modern design
program.addHelpText("before", () => {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    // Don't await here, just call synchronously
    showBanner();
  }
  return "";
});

program.addHelpText("after", () => {
  // Modern quick start section
  const quickStartBox = boxen(
    `${icons.target} ${chalk.bold("Quick Start:")}

${colors.primary("npx create-js-stack@latest my-app")}     ${colors.muted("# Interactive setup")}
${colors.primary("npx create-js-stack@latest list")}             ${colors.muted("# Browse options")}
${colors.primary("npx create-js-stack@latest init --preset saas")} ${colors.muted("# Use preset")}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 0, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "blue",
      backgroundColor: "black",
    },
  );

  console.log(quickStartBox);

  // Modern resources section
  const resourcesBox = boxen(
    `${icons.link} ${chalk.bold("Resources & Community:")}

${icons.book} Documentation: ${colors.secondary.underline("https://github.com/vipinyadav01/js-stack")}
${icons.warning} Issues & Bugs: ${colors.secondary.underline("https://github.com/vipinyadav01/js-stack/issues")}
${icons.heart} Discussions:   ${colors.secondary.underline("https://github.com/vipinyadav01/js-stack/discussions")}
${icons.star} Give us a star: ${colors.accent("⭐ Star on GitHub")}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "green",
      backgroundColor: "black",
    },
  );

  console.log(resourcesBox);

  // Pro tip
  const tipGradient = gradient(["#ff6b6b", "#4ecdc4"]);
  console.log(
    tipGradient(
      `    ${icons.bulb} Pro Tip: Use --verbose for detailed output and --dry-run to preview changes`,
    ),
  );
  console.log();

  return "";
});

// Enhanced error handling and execution
program.exitOverride();

// Global error handler with ghost theme
process.on("uncaughtException", (error) => {
  showGhostError("Uncaught Exception", error.message);

  if (error.stack) {
    console.log(ghostColors.muted("\nStack trace:"));
    console.log(ghostColors.dim(error.stack));
  }

  showGhostInfo(
    "Troubleshooting Tips",
    "• Check your Node.js version (requires 18+)\n" +
      "• Try running with --verbose for more details\n" +
      "• Report this issue: https://github.com/vipinyadav01/js-stack/issues",
  );

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  showGhostError("Unhandled Promise Rejection", reason);

  showGhostInfo(
    "Troubleshooting Tips",
    "• Check your internet connection\n" +
      "• Try running with --verbose for more details\n" +
      "• Report this issue: https://github.com/vipinyadav01/js-stack/issues",
  );

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
