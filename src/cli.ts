#!/usr/bin/env node

/**
 * CLI Entry Point
 */

import { Command } from "commander";
import { renderTitle } from "./utils/render-title.js";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { sponsorsCommand } from "./commands/sponsors.js";
import { docsCommand } from "./commands/docs.js";
import { builderCommand } from "./commands/builder.js";

const program = new Command();

program
  .name("create-js-stack")
  .description(
    "Modern CLI tool for scaffolding full-stack JavaScript/TypeScript projects",
  )
  .version("1.0.0");

// Show title on help
program.configureHelp({
  helpWidth: 100,
});

// Main init command (default)
program
  .argument("[project-name]", "Name of the project to create")
  .option("-y, --yes", "Use default configuration")
  .option("--yolo", "Bypass validations (not recommended)")
  .option("-v, --verbose", "Show detailed output")
  .option("--frontend <frameworks>", "Frontend framework(s) (comma-separated)")
  .option("--backend <framework>", "Backend framework")
  .option("--runtime <runtime>", "Runtime (node, bun, workers)")
  .option("--database <database>", "Database")
  .option("--orm <orm>", "ORM")
  .option("--api <api>", "API framework")
  .option("--auth <auth>", "Authentication")
  .option("--addons <addons>", "Addons (comma-separated)")
  .option("--examples <examples>", "Examples (comma-separated)")
  .option("--db-setup <setup>", "Database setup")
  .option("--web-deploy <deploy>", "Web deployment")
  .option("--server-deploy <deploy>", "Server deployment")
  .option("--package-manager <manager>", "Package manager (npm, pnpm, bun)")
  .option("--no-git", "Skip Git initialization")
  .option("--no-install", "Skip dependency installation")
  .option(
    "--directory-conflict <strategy>",
    "Directory conflict strategy (merge, overwrite, increment, error)",
  )
  .action(async (projectName, options) => {
    await initCommand(projectName, options);
  });

// Add command
program
  .command("add")
  .description("Add addons or deployment configs to existing project")
  .option("--addon <addon>", "Addon to add")
  .option("--deploy <deploy>", "Deployment config to add")
  .action(async (options) => {
    await addCommand(options);
  });

// Sponsors command
program
  .command("sponsors")
  .description("Display sponsors")
  .action(async () => {
    await sponsorsCommand();
  });

// Docs command
program
  .command("docs")
  .description("Open documentation in browser")
  .action(async () => {
    await docsCommand();
  });

// Builder command
program
  .command("builder")
  .description("Open web-based builder")
  .action(async () => {
    await builderCommand();
  });

// Show title if no command provided
if (process.argv.length === 2) {
  renderTitle();
}

// Parse arguments
program.parse();
