/**
 * Create command handler
 */

import path from "path";
import * as p from "@clack/prompts";
import type { CLIOptions, ProjectConfig } from "../types.js";
import { DEFAULT_CONFIG } from "../constants.js";
import {
  promptProjectName,
  promptConfiguration,
} from "../prompts/config-prompts.js";
import {
  validateProjectName,
  getProjectDir,
  handleDirectoryConflict,
} from "../utils/project-directory.js";
import { createProject as createProjectCore } from "../helpers/core/create-project.js";
import { displayConfig } from "../utils/display-config.js";
import { generateReproducibleCommand } from "../utils/generate-reproducible-command.js";
import { saveConfig } from "../utils/js-stack-config.js";
import { validateConfig, autoFixConfig } from "../validation.js";

/**
 * Parse comma-separated string to array
 */
function parseArray(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Create command
 */
export async function createProject(
  projectName?: string,
  options: Partial<CLIOptions> = {},
): Promise<void> {
  try {
    // Get project name
    let finalProjectName = projectName;
    if (!finalProjectName) {
      finalProjectName = await promptProjectName();
    }

    // Validate project name
    const nameValidation = validateProjectName(finalProjectName);
    if (!nameValidation.valid) {
      p.log.error(nameValidation.error || "Invalid project name");
      process.exit(1);
    }

    // Get project directory
    const projectDir = getProjectDir(finalProjectName);
    const relativePath = path.relative(process.cwd(), projectDir);

    // Handle directory conflicts
    const conflictStrategy = options.directoryConflict || "error";
    const finalProjectDir = await handleDirectoryConflict(
      projectDir,
      conflictStrategy,
    );

    // Gather configuration
    let config: Partial<ProjectConfig>;

    if (options.yes) {
      // Use defaults but merge with CLI options
      config = {
        ...DEFAULT_CONFIG,
        projectName: finalProjectName,
        projectDir: finalProjectDir,
        relativePath,
        // Override with CLI options if provided
        frontend: options.frontend
          ? (parseArray(options.frontend) as any)
          : DEFAULT_CONFIG.frontend,
        backend: options.backend || DEFAULT_CONFIG.backend,
        runtime: options.runtime || DEFAULT_CONFIG.runtime,
        database: options.database || DEFAULT_CONFIG.database,
        orm: options.orm || DEFAULT_CONFIG.orm,
        api: options.api || DEFAULT_CONFIG.api,
        auth: options.auth || DEFAULT_CONFIG.auth,
        addons: options.addons
          ? (parseArray(options.addons) as any)
          : DEFAULT_CONFIG.addons,
        examples: options.examples ? (parseArray(options.examples) as any) : [],
        dbSetup: options.dbSetup || DEFAULT_CONFIG.dbSetup,
        webDeploy: options.webDeploy || DEFAULT_CONFIG.webDeploy,
        serverDeploy: options.serverDeploy || DEFAULT_CONFIG.serverDeploy,
        packageManager: options.packageManager || DEFAULT_CONFIG.packageManager,
        git: options.git !== undefined ? options.git : DEFAULT_CONFIG.git,
        install:
          options.install !== undefined
            ? options.install
            : DEFAULT_CONFIG.install,
      };
    } else {
      // Interactive prompts or parse from options
      // Check if any options other than project name are provided
      const hasOptions = Object.keys(options).length > 0;

      // If no options provided (or only project name via argument which isn't in options object here), show prompts
      // The options object only contains flags passed to the command
      if (options.yolo || hasOptions) {
        // Parse from CLI options
        config = {
          projectName: finalProjectName,
          projectDir: finalProjectDir,
          relativePath,
          frontend: parseArray(options.frontend) as any,
          backend: options.backend || DEFAULT_CONFIG.backend,
          runtime: options.runtime || DEFAULT_CONFIG.runtime,
          database: options.database || DEFAULT_CONFIG.database,
          orm: options.orm || DEFAULT_CONFIG.orm,
          api: options.api || DEFAULT_CONFIG.api,
          auth: options.auth || DEFAULT_CONFIG.auth,
          addons: parseArray(options.addons) as any,
          examples: parseArray(options.examples) as any,
          dbSetup: options.dbSetup || DEFAULT_CONFIG.dbSetup,
          webDeploy: options.webDeploy || DEFAULT_CONFIG.webDeploy,
          serverDeploy: options.serverDeploy || DEFAULT_CONFIG.serverDeploy,
          packageManager:
            options.packageManager || DEFAULT_CONFIG.packageManager,
          git: options.git !== undefined ? options.git : DEFAULT_CONFIG.git,
          install:
            options.install !== undefined
              ? options.install
              : DEFAULT_CONFIG.install,
        };
      } else {
        // Interactive prompts
        const promptConfig = await promptConfiguration({
          yes: false,
          yolo: false,
        });

        config = {
          projectName: finalProjectName,
          projectDir: finalProjectDir,
          relativePath,
          ...promptConfig,
        };
      }
    }

    // Validate configuration (unless yolo)
    if (!options.yolo) {
      const validation = validateConfig(config);
      if (!validation.valid) {
        // Try auto-fix
        const fixed = autoFixConfig(config);
        Object.assign(config, fixed);

        // Re-validate
        const reValidation = validateConfig(config);
        if (!reValidation.valid) {
          p.log.error("Configuration errors:");
          for (const error of reValidation.errors) {
            p.log.error(`  - ${error}`);
          }
          process.exit(1);
        }

        if (validation.errors.length > 0) {
          p.log.warn("Configuration was auto-fixed:");
          for (const error of validation.errors) {
            p.log.warn(`  - ${error}`);
          }
        }
      }
    }

    // Display configuration
    if (options.verbose) {
      displayConfig(config as ProjectConfig);
    }

    // Create project
    // Create project
    if (options.dryRun) {
      p.log.info("Dry run enabled. Skipping project creation.");
    } else {
      await createProjectCore(config as ProjectConfig, {
        verbose: options.verbose,
      });
    }

    // Save config file
    if (!options.dryRun) {
      await saveConfig(finalProjectDir, config);
    }

    // Display success message
    if (options.dryRun) {
      p.log.success(`Dry run complete for project ${finalProjectName}!`);
    } else {
      p.log.success(`Project ${finalProjectName} created successfully!`);
    }
    console.log();
    p.log.info("Next steps:");
    console.log(`  cd ${relativePath}`);
    if (!config.install) {
      console.log(`  ${config.packageManager} install`);
    }
    console.log(
      `  ${config.packageManager} ${config.packageManager === "npm" ? "run " : ""}dev`,
    );
    console.log();

    // Show reproducible command
    const reproducibleCommand = generateReproducibleCommand(
      config as ProjectConfig,
    );
    p.log.info("Reproducible command:");
    console.log(`  ${reproducibleCommand}`);
    console.log();
  } catch (error) {
    p.log.error(
      `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
