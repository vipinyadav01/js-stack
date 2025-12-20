#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { createProject } from "./commands/create.js";
import { listPresets } from "./commands/list.js";
import { addPreset } from "./commands/add-preset.js";
import { analyticsCommand } from "./commands/analytics.js";
import { version } from "./utils/version.js";

const program = new Command();

console.log(
  chalk.cyan(`
     ╦╔═╗╔═╗╔╦╗╔═╗╔═╗╦╔═
     ║╚═╗╚═╗ ║ ╠═╣║  ╠╩╗
    ╚╝╚═╝╚═╝ ╩ ╩ ╩╚═╝╩ ╩
    Modern Web Project Generator
`),
);

program
  .name("jsstack")
  .description(
    "A comprehensive scaffold project generator for modern web development",
  )
  .version(version);

program
  .command("create [project-name]")
  .description("Create a new project with selected preset")
  .option(
    "-p, --preset <preset>",
    "Use a specific preset (mern, next-fullstack, react-vite, express-api)",
  )
  .option("-t, --typescript", "Use TypeScript", true)
  .option("--no-typescript", "Use JavaScript instead of TypeScript")
  .option(
    "-s, --styling <styling>",
    "Styling solution (tailwind, styled-components, css-modules, sass)",
  )
  .option(
    "-d, --database <database>",
    "Database (mongodb, postgresql, mysql, sqlite)",
  )
  .option("--orm <orm>", "ORM (drizzle, prisma, mongoose, typeorm)")
  .option(
    "--auth <auth>",
    "Authentication (better-auth, clerk, next-auth, lucia)",
  )
  .option(
    "--frontend <framework>",
    "Frontend framework (react, vue, nextjs, etc.)",
  )
  .option("--backend <framework>", "Backend framework")
  .option("--api <api>", "API style (trpc, orpc, graphql, rest)")
  .option("--addons <addons>", "Addons (pwa, tauri, docker, etc.)")
  .option("--docker", "Include Docker configuration")
  .option("--cicd <cicd>", "CI/CD configuration (github-actions, gitlab-ci)")
  .option(
    "--db-setup <dbSetup>",
    "Database setup (turso, neon, docker-compose, supabase)",
  )
  .option(
    "--web-deploy <webDeploy>",
    "Web deployment (cloudflare-pages, alchemy)",
  )
  .option(
    "--server-deploy <serverDeploy>",
    "Server deployment (cloudflare-workers, alchemy)",
  )
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("--dry-run", "Preview files without creating them")
  .action(createProject);

program
  .command("list")
  .description("List all available presets")
  .option("--json", "Output as JSON")
  .action(listPresets);

program
  .command("add-preset <name>")
  .description("Add a custom preset from a template directory")
  .option("-s, --source <path>", "Source directory for preset templates")
  .action(addPreset);

program
  .command("info")
  .description("Display environment info")
  .action(() => {
    console.log(chalk.cyan("\nEnvironment Information:"));
    console.log(chalk.white(`  Node.js: ${process.version}`));
    console.log(chalk.white(`  Platform: ${process.platform}`));
    console.log(chalk.white(`  jsStack Version: ${version}`));
  });

program
  .command("analytics")
  .description("Manage anonymous analytics preferences")
  .option("--enable", "Enable anonymous analytics")
  .option("--disable", "Disable anonymous analytics")
  .option("--status", "Show current analytics status")
  .action(analyticsCommand);

program.parse();
