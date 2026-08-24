#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get current version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

console.log(chalk.blue.bold("🚀 Publishing @vipinyadav02/createjsstack to npm"));
console.log(chalk.gray(`Version: ${packageJson.version}`));
console.log();

try {
  // Build the project
  console.log(chalk.yellow("📦 Building project..."));
  execSync("npm run build:release", { stdio: "inherit" });

  // Check if we're logged into npm
  console.log(chalk.yellow("🔐 Checking npm authentication..."));
  try {
    execSync("npm whoami", { stdio: "pipe" });
    console.log(chalk.green("✅ Authenticated with npm"));
  } catch (error) {
    console.log(chalk.red("❌ Not authenticated with npm"));
    console.log(chalk.yellow('💡 Run "npm login" to authenticate'));
    process.exit(1);
  }

  // Dry run first
  console.log(
    chalk.yellow("🔍 Running dry-run to check what will be published..."),
  );
  execSync("npm publish --dry-run", { stdio: "inherit" });

  console.log();
  console.log(chalk.green("✅ Dry-run completed successfully!"));
  console.log(chalk.cyan("📋 Files that will be published:"));
  console.log(chalk.gray("  - dist/ (built CLI and library)"));
  console.log(chalk.gray("  - templates/ (project templates)"));
  console.log(chalk.gray("  - README.md (documentation)"));
  console.log();

  // Ask for confirmation
  console.log(chalk.yellow("⚠️  Ready to publish to npm?"));
  console.log(
    chalk.gray("   This will make the package available for installation via:"),
  );
  console.log(chalk.cyan("   npx @vipinyadav02/createjsstack@latest"));
  console.log();

  // For now, just show the command to run
  console.log(chalk.green("🎯 To publish, run:"));
  console.log(chalk.cyan("   npm publish"));
  console.log();
  console.log(chalk.gray("   Or use the npm script:"));
  console.log(chalk.cyan("   npm run publish:npm"));
} catch (error) {
  console.error(chalk.red("❌ Publishing failed:"));
  console.error(chalk.gray(error.message));
  process.exit(1);
}
