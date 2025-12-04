/**
 * Project creation orchestration
 */

import * as p from "@clack/prompts";
import fs from "fs-extra";
import { execa } from "execa";
import type { ProjectConfig } from "../../types.js";
import { validateConfig, autoFixConfig } from "../../validation.js";
import {
  copyBaseTemplate,
  setupFrontendTemplates,
  setupBackendFramework,
  setupDbOrmTemplates,
  setupAuthTemplate,
  setupAPITemplates,
  setupAddonsTemplate,
  setupExamplesTemplate,
  setupDeploymentTemplates,
  setupDbSetupTemplate,
  handleExtras,
} from "./template-manager.js";
import {
  formatWithBiome,
  createBiomeConfig,
} from "../../utils/biome-formatter.js";

/**
 * Create project structure
 */
export async function createProjectStructure(
  config: ProjectConfig,
): Promise<void> {
  const spinner = p.spinner();
  spinner.start("Creating project structure...");

  try {
    // Ensure project directory exists
    await fs.ensureDir(config.projectDir);

    // Copy base templates
    spinner.message("Copying base templates...");
    await copyBaseTemplate(config.projectDir, config);

    // Setup frontend
    if (config.frontend.some((f) => f !== "none")) {
      spinner.message("Setting up frontend...");
      await setupFrontendTemplates(config.projectDir, config);
    }

    // Setup backend
    if (config.backend !== "none") {
      spinner.message("Setting up backend...");
      await setupBackendFramework(config.projectDir, config);
    }

    // Setup database/ORM
    if (config.database !== "none" || config.orm !== "none") {
      spinner.message("Setting up database/ORM...");
      await setupDbOrmTemplates(config.projectDir, config);
    }

    // Setup auth
    if (config.auth !== "none") {
      spinner.message("Setting up authentication...");
      await setupAuthTemplate(config.projectDir, config);
    }

    // Setup API
    if (config.api !== "none") {
      spinner.message("Setting up API...");
      await setupAPITemplates(config.projectDir, config);
    }

    // Setup addons
    if (config.addons.length > 0) {
      spinner.message("Setting up addons...");
      await setupAddonsTemplate(config.projectDir, config);
    }

    // Setup examples
    if (config.examples.length > 0 && !config.examples.includes("none")) {
      spinner.message("Setting up examples...");
      await setupExamplesTemplate(config.projectDir, config);
    }

    // Setup deployment
    if (config.webDeploy !== "none" || config.serverDeploy !== "none") {
      spinner.message("Setting up deployment configs...");
      await setupDeploymentTemplates(config.projectDir, config);
    }

    // Setup DB setup
    if (config.dbSetup !== "none") {
      spinner.message("Setting up database environment...");
      await setupDbSetupTemplate(config.projectDir, config);
    }

    // Handle extras
    spinner.message("Handling extras...");
    await handleExtras(config.projectDir, config);

    spinner.stop("Project structure created!");
  } catch (error) {
    spinner.stop("Failed to create project structure");
    throw error;
  }
}

/**
 * Initialize Git repository
 */
export async function initializeGit(projectDir: string): Promise<void> {
  try {
    await execa("git", ["init"], { cwd: projectDir });
    await execa("git", ["add", "."], { cwd: projectDir });
    await execa(
      "git",
      ["commit", "-m", "Initial commit from create-js-stack"],
      { cwd: projectDir },
    );
  } catch (error) {
    // Git might not be available, non-fatal
    console.warn(
      `Warning: Failed to initialize Git: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Install dependencies
 */
export async function installDependencies(
  projectDir: string,
  packageManager: "npm" | "pnpm" | "bun",
): Promise<void> {
  const spinner = p.spinner();
  spinner.start(`Installing dependencies with ${packageManager}...`);

  try {
    const installCommand =
      packageManager === "npm"
        ? ["install"]
        : packageManager === "pnpm"
          ? ["install"]
          : ["install"];

    await execa(packageManager, installCommand, {
      cwd: projectDir,
      stdio: "inherit",
    });

    spinner.stop("Dependencies installed!");
  } catch (error) {
    spinner.stop("Failed to install dependencies");
    throw error;
  }
}

/**
 * Post-processing: format code, setup environment, etc.
 */
export async function postProcessProject(config: ProjectConfig): Promise<void> {
  const spinner = p.spinner();
  spinner.start("Post-processing project...");

  try {
    // Create Biome config if Biome addon is selected
    if (config.addons.includes("biome")) {
      spinner.message("Setting up Biome...");
      await createBiomeConfig(config.projectDir);
    }

    // Format code with Biome if available
    if (config.addons.includes("biome")) {
      spinner.message("Formatting code...");
      await formatWithBiome(config.projectDir);
    }

    spinner.stop("Post-processing complete!");
  } catch (error) {
    spinner.stop("Post-processing failed (non-fatal)");
    // Non-fatal error
    console.warn(
      `Warning: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Main project creation function
 */
export async function createProject(
  config: ProjectConfig,
  options: { verbose?: boolean } = {},
): Promise<void> {
  try {
    // Validate configuration
    if (!options.verbose) {
      const validation = validateConfig(config);
      if (!validation.valid) {
        // Auto-fix if possible
        const fixedConfig = autoFixConfig(config);
        Object.assign(config, fixedConfig);

        // Re-validate
        const reValidation = validateConfig(config);
        if (!reValidation.valid) {
          throw new Error(
            `Configuration errors:\n${reValidation.errors.join("\n")}`,
          );
        }
      }
    }

    // Create project structure
    await createProjectStructure(config);

    // Initialize Git
    if (config.git) {
      await initializeGit(config.projectDir);
    }

    // Install dependencies
    if (config.install) {
      await installDependencies(config.projectDir, config.packageManager);
    }

    // Post-processing
    await postProcessProject(config);

    p.log.success(`Project ${config.projectName} created successfully!`);
  } catch (error) {
    p.log.error(
      `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}
