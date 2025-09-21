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
import { addCommand } from "./commands/add.js";

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

// Ultra-modern animated banner with gradients
function showBanner() {
  console.clear();

  // Create animated title
  const title = figlet.textSync("JS Stack", {
    font: "Big",
    horizontalLayout: "fitted",
    width: 80,
  });

  // Create gradient effects
  const gradientTitle = gradient(["#667eea", "#764ba2", "#f093fb"]);
  const gradientSubtitle = gradient(["#4facfe", "#00f2fe"]);
  const gradientInfo = gradient(["#43e97b", "#38f9d7"]);

  // Show animated title
  console.log();
  console.log(gradientTitle(title));
  console.log();

  // Modern subtitle with better spacing
  const subtitle = chalk
    .hex(colors.text)
    .bold("Next-Generation JavaScript Project Generator");
  console.log(gradientSubtitle(`    ${subtitle}`));
  console.log();

  // Enhanced system information in a modern card layout
  const systemInfo = [
    `${icons.package} v${packageJson.version}`,
    `${icons.rocket} Node.js ${process.version}`,
    `${icons.gear} ${getPlatformIcon()}${os.type()} ${os.arch()}`,
    `${icons.lightning} ESM Runtime`,
    `${icons.crystal} ${getMemoryUsage()}`,
  ];

  const infoBox = boxen(systemInfo.join("\n"), {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
    backgroundColor: "black",
    title: `${icons.sparkles} System Info`,
    titleAlignment: "center",
  });

  console.log(gradientInfo(infoBox));
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
    {
      test: /^[a-zA-Z0-9-_]+$/,
      message:
        "Project name can only contain letters, numbers, hyphens, and underscores",
    },
    {
      test: (name) => name.length >= 2,
      message: "Project name must be at least 2 characters long",
    },
    {
      test: (name) => name.length <= 50,
      message: "Project name must be less than 50 characters",
    },
    {
      test: (name) => !name.startsWith("-"),
      message: "Project name cannot start with a hyphen",
    },
    {
      test: (name) => !name.endsWith("-"),
      message: "Project name cannot end with a hyphen",
    },
  ];

  for (const rule of validationRules) {
    const isValid =
      typeof rule.test === "function" ? rule.test(name) : rule.test.test(name);
    if (!isValid) {
      console.error(chalk.red(`❌ ${rule.message}`));
      console.log(
        chalk.yellow(`💡 Example: ${chalk.cyan("my-awesome-project")}`),
      );
      process.exit(1);
    }
  }

  return name;
}

// Main CLI configuration with enhanced metadata
program
  .name("create-js-stack")
  .description(
    "🚀 CLI tool for scaffolding modern JavaScript full-stack projects with best practices",
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

// Modern Init command with enhanced UX and comprehensive options
program
  .command("init [project-name]")
  .aliases(["create", "new", "i", "scaffold"])
  .description(
    colors.secondary(`${icons.rocket} Create a new JavaScript stack project`),
  )
  .option(
    "-y, --yes",
    colors.muted(`${icons.lightning} Use default configuration (quick start)`),
  )
  .option(
    "-p, --preset <name>",
    colors.muted(
      `${icons.target} Use preset: saas, api, mobile, fullstack, minimal`,
    ),
  )
  .option(
    "-t, --template <name>",
    colors.muted(`${icons.file} Use specific template`),
  )
  .option(
    "--database <type>",
    colors.muted(
      `${icons.database} Database: sqlite, postgres, mysql, mongodb, supabase, planetscale`,
    ),
  )
  .option(
    "--orm <type>",
    colors.muted(
      `${icons.gear} ORM: prisma, drizzle, sequelize, mongoose, typeorm`,
    ),
  )
  .option(
    "--backend <type>",
    colors.muted(`${icons.gear} Backend: express, fastify, nestjs, trpc, hono`),
  )
  .option(
    "--frontend <types...>",
    colors.muted(
      `${icons.paint} Frontend: react, vue, svelte, solid, nextjs, nuxt, astro`,
    ),
  )
  .option(
    "--auth <type>",
    colors.muted(
      `${icons.shield} Auth: jwt, passport, auth0, oauth, none`,
    ),
  )
  .option(
    "--styling <type>",
    colors.muted(
      `${icons.paint} Styling: tailwind, shadcn, chakra, mantine, styled-components`,
    ),
  )
  .option(
    "--testing <type>",
    colors.muted(`${icons.test} Testing: vitest, jest, playwright, cypress`),
  )
  .option(
    "--addons <addons...>",
    colors.muted(
      `${icons.package} Tools: typescript, eslint, prettier, husky, docker, storybook`,
    ),
  )
  .option(
    "--pm <manager>",
    colors.muted(`${icons.package} Package manager: npm, yarn, pnpm, bun`),
  )
  .option("--typescript", colors.muted(`${icons.crystal} Enable TypeScript`))
  .option("--no-git", colors.muted(`${icons.cross} Skip git initialization`))
  .option(
    "--no-install",
    colors.muted(`${icons.cross} Skip dependency installation`),
  )
  .option("--verbose", colors.muted(`${icons.search} Show detailed output`))
  .option(
    "--dry-run",
    colors.muted(`${icons.bulb} Preview changes without creating files`),
  )
  .option(
    "--interactive",
    colors.muted(`${icons.sparkles} Enhanced interactive mode`),
  )
  .addHelpText("after", () => {
    const exampleBox = boxen(
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
  ${colors.success("minimal")}   - Lightweight starter template`,
      {
        padding: 1,
        margin: { top: 1, bottom: 0, left: 2, right: 2 },
        borderStyle: "round",
        borderColor: "magenta",
        backgroundColor: colors.bg,
      },
    );
    return exampleBox;
  })
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
      console.log(
        chalk.gray("  Project Name:"),
        chalk.cyan(projectName || "Not specified"),
      );
      console.log(
        chalk.gray("  Options:"),
        chalk.cyan(JSON.stringify(options, null, 2)),
      );
      console.log(chalk.gray("  Node Version:"), chalk.green(process.version));
      console.log(
        chalk.gray("  Working Directory:"),
        chalk.yellow(process.cwd()),
      );
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

// Global error handler with better reliability
process.on("uncaughtException", (error) => {
  console.error(chalk.red.bold("\n❌ Uncaught Exception:"));
  console.error(chalk.gray(error.message));
  
  if (error.stack) {
    console.error(chalk.gray("\nStack trace:"));
    console.error(chalk.gray(error.stack));
  }
  
  console.log(chalk.yellow("\n💡 Troubleshooting:"));
  console.log(chalk.gray("  • Check your Node.js version (requires 18+)"));
  console.log(chalk.gray("  • Try running with --verbose for more details"));
  console.log(chalk.gray("  • Report this issue: https://github.com/vipinyadav01/js-stack/issues"));
  
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red.bold("\n❌ Unhandled Promise Rejection:"));
  console.error(chalk.gray(reason));
  
  console.log(chalk.yellow("\n💡 Troubleshooting:"));
  console.log(chalk.gray("  • Check your internet connection"));
  console.log(chalk.gray("  • Try running with --verbose for more details"));
  console.log(chalk.gray("  • Report this issue: https://github.com/vipinyadav01/js-stack/issues"));
  
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
