#!/usr/bin/env node

import { program } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

// ASCII art banner function
function showBanner() {
  console.clear();
  const banner = figlet.textSync("JS Stack", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  });

  const g = gradient(["#5ee7df", "#b490ca"]);
  console.log(g.multiline(banner));
  console.log();
  console.log(chalk.gray("  Version: ") + chalk.cyan(packageJson.version));
  console.log(chalk.gray("  Modern JavaScript Project Generator"));
  console.log();
}

// Main CLI configuration
program
  .name("create-js-stack")
  .description("CLI tool for scaffolding JavaScript full-stack projects")
  .version(packageJson.version)
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  })
  .showHelpAfterError(chalk.yellow("(add --help for additional information)"));

// Init command - Create a new project
program
  .command("init [project-name]")
  .alias("create")
  .alias("new")
  .description(chalk.cyan("Create a new JavaScript stack project"))
  .option("-y, --yes", chalk.gray("Use default configuration"))
  .option(
    "--database <type>",
    chalk.gray("Database: sqlite, postgres, mysql, mongodb, none"),
  )
  .option(
    "--orm <type>",
    chalk.gray("ORM: prisma, sequelize, mongoose, typeorm, none"),
  )
  .option(
    "--backend <type>",
    chalk.gray("Backend: express, fastify, koa, hapi, nestjs, none"),
  )
  .option(
    "--frontend <types...>",
    chalk.gray("Frontend: react, vue, angular, svelte, nextjs, nuxt"),
  )
  .option(
    "--auth <type>",
    chalk.gray("Auth: jwt, passport, auth0, firebase, none"),
  )
  .option(
    "--addons <addons...>",
    chalk.gray("Tools: eslint, prettier, husky, docker, testing"),
  )
  .option("--pm <manager>", chalk.gray("Package manager: npm, yarn, pnpm, bun"))
  .option("--no-git", chalk.gray("Skip git initialization"))
  .option("--no-install", chalk.gray("Skip dependency installation"))
  .option("--verbose", chalk.gray("Show detailed output"))
  .action(async (projectName, options) => {
    if (!options.yes && !projectName && process.argv.length === 3) {
      showBanner();
    }
    await initCommand(projectName, options);
  });

// Add command - Add features to existing project
program
  .command("add")
  .alias("install")
  .description(chalk.cyan("Add features to an existing project"))
  .option("--addons <addons...>", chalk.gray("Additional tools to add"))
  .option("--auth <type>", chalk.gray("Add authentication"))
  .option("--install", chalk.gray("Install dependencies after adding features"))
  .action(addCommand);

// Docs command - Open documentation
program
  .command("docs")
  .alias("documentation")
  .description(chalk.cyan("Open documentation in browser"))
  .action(async () => {
    const { openUrl } = await import("./utils/open-url.js");
    const docsUrl = "https://github.com/yourusername/create-js-stack#readme";
    const g = gradient(["#5ee7df", "#b490ca"]);
    console.log();
    console.log(g("📖 Opening documentation..."));
    await openUrl(docsUrl);
    console.log(chalk.gray("\n  If browser didn't open, visit:"));
    console.log(chalk.cyan(`  ${docsUrl}\n`));
  });

// List command - List available options
program
  .command("list")
  .alias("ls")
  .alias("options")
  .description(chalk.cyan("List all available options"))
  .action(async () => {
    const { listOptions } = await import("./commands/list.js");
    await listOptions();
  });

// Custom help
program.addHelpText("before", () => {
  showBanner();
  return "";
});

program.addHelpText("after", () => {
  console.log();
  console.log(chalk.gray("Examples:"));
  console.log(chalk.cyan("  $ npx create-js-stack init my-app"));
  console.log(chalk.cyan("  $ npx create-js-stack init my-app --yes"));
  console.log(chalk.cyan("  $ npx create-js-stack list"));
  console.log();
  console.log(chalk.gray("For more info, run any command with --help"));
  return "";
});

// Error handling
program.exitOverride();

try {
  // Show banner if no arguments
  if (process.argv.length === 2) {
    showBanner();
  }

  await program.parseAsync(process.argv);
} catch (error) {
  console.log();
  if (error.code === "commander.version") {
    // Version command successful, exit normally
    process.exit(0);
  } else if (error.code === "commander.helpDisplayed") {
    // Help command successful, exit normally
    process.exit(0);
  } else if (error.code === "commander.missingArgument") {
    console.error(chalk.red("❌ Error: Missing required argument"));
  } else if (error.code === "commander.unknownOption") {
    console.error(chalk.red("❌ Error: Unknown option"));
  } else if (error.code === "commander.unknownCommand") {
    console.error(chalk.red("❌ Error: Unknown command"));
    console.log(
      chalk.yellow(
        '\n💡 Tip: Run "npx create-js-stack --help" to see available commands',
      ),
    );
  } else {
    console.error(chalk.red("❌ An error occurred:"), error.message);
  }
  console.log();
  process.exit(1);
}
