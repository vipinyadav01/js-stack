/**
 * Project creation orchestration
 */

import path from "path";
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
  needsSeparateLayout,
} from "./template-manager.js";
import {
  formatWithBiome,
  createBiomeConfig,
} from "../../utils/biome-formatter.js";
import { isJavaBackend, isJavaOnlyProject } from "../../utils/java-backend.js";

/**
 * Directory holding the backend sources, which is a sub-directory only when the
 * frontend and backend are separate projects.
 */
function backendDir(config: ProjectConfig): string {
  return needsSeparateLayout(config)
    ? path.join(config.projectDir, "backend")
    : config.projectDir;
}

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

    // When frontend and backend are different frameworks, create a workspace
    // root so each lives in its own directory with its own package.json.
    const separate = needsSeparateLayout(config);
    if (separate) {
      spinner.message("Setting up workspace layout...");
      const rootPkgPath = path.join(config.projectDir, "package.json");
      const rootPkg = (await fs.pathExists(rootPkgPath))
        ? JSON.parse(await fs.readFile(rootPkgPath, "utf-8"))
        : {};
      // A Maven backend is not an npm package, so it stays out of the
      // workspace list and is driven through Maven instead.
      const javaBackend = isJavaBackend(config.backend);
      rootPkg.private = true;
      rootPkg.workspaces = javaBackend ? ["frontend"] : ["frontend", "backend"];

      // Keep only workspace-level tooling deps at root; framework deps belong
      // in each workspace's own package.json.
      const toolingPkgs = new Set([
        "@biomejs/biome",
        "husky",
        "turbo",
        "vitest",
        "@playwright/test",
        "cypress",
        "workbox-precaching",
        "@tauri-apps/api",
        "wrangler",
      ]);
      for (const field of ["dependencies", "devDependencies"] as const) {
        const deps = rootPkg[field] as Record<string, string> | undefined;
        if (!deps) continue;
        for (const key of Object.keys(deps)) {
          if (!toolingPkgs.has(key)) delete deps[key];
        }
        if (Object.keys(deps).length === 0) delete rootPkg[field];
      }

      rootPkg.scripts = {
        dev: "npm run dev --workspaces --if-present",
        build: "npm run build --workspaces --if-present",
        "dev:frontend": "npm run dev -w frontend",
        "dev:backend": javaBackend
          ? "mvn -f backend/pom.xml spring-boot:run"
          : "npm run dev -w backend",
        ...(javaBackend
          ? { "build:backend": "mvn -f backend/pom.xml package" }
          : {}),
      };
      await fs.writeFile(
        rootPkgPath,
        `${JSON.stringify(rootPkg, null, 2)}\n`,
        "utf-8",
      );
    }

    // Setup frontend
    if (config.frontend && config.frontend !== "none") {
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

    // With a Java backend and no frontend, nothing in the tree is a JavaScript
    // package — the base package.json would only be misleading.
    if (isJavaOnlyProject(config)) {
      await fs.remove(path.join(config.projectDir, "package.json"));
    }

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
      ["commit", "-m", "Initial commit from @vipinyadav02/createjsstack"],
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
  // Nothing to install when the tree holds no npm package (Java-only project).
  if (!(await fs.pathExists(path.join(projectDir, "package.json")))) {
    return;
  }

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
 * Pre-fetch the Maven dependencies for a Java backend.
 *
 * Maven is not bundled with the CLI the way a package manager is, so a missing
 * `mvn` is reported as a next step rather than treated as a failure — the
 * generated project still builds once the user installs it.
 */
export async function resolveMavenDependencies(javaDir: string): Promise<void> {
  try {
    await execa("mvn", ["-v"]);
  } catch {
    p.log.info(
      "Maven was not found on PATH — run `mvn spring-boot:run` in the backend once it is installed.",
    );
    return;
  }

  const spinner = p.spinner();
  spinner.start("Resolving Maven dependencies...");

  try {
    await execa("mvn", ["-B", "-q", "dependency:go-offline"], {
      cwd: javaDir,
      stdio: "inherit",
    });
    spinner.stop("Maven dependencies resolved!");
  } catch (error) {
    // Non-fatal: the project is valid, the user can build it themselves.
    spinner.stop("Could not resolve Maven dependencies");
    console.warn(
      `Warning: ${error instanceof Error ? error.message : String(error)}`,
    );
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

      if (isJavaBackend(config.backend)) {
        await resolveMavenDependencies(backendDir(config));
      }
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
