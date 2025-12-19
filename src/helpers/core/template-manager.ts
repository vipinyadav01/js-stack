/**
 * Template manager - handles copying and processing templates
 */

import path from "path";
import fs from "fs-extra";
import {
  processAndCopyFiles,
  copyFileOrDir,
} from "../../utils/template-processor.js";
import { TEMPLATE_PATHS } from "../../constants.js";
import type { ProjectConfig } from "../../types.js";

/**
 * Get template directory path
 */
function getTemplatePath(relativePath: string): string {
  // In development, templates are in project root
  // In production, they're in the package
  const __filename = new URL(import.meta.url).pathname;
  // Handle Windows paths
  const normalizedFilename =
    process.platform === "win32"
      ? __filename.replace(/^\//, "").replace(/\//g, "\\")
      : __filename;

  const possiblePaths = [
    path.join(process.cwd(), "templates", relativePath),
    path.join(process.cwd(), relativePath),
    path.join(
      path.dirname(normalizedFilename),
      "..",
      "..",
      "..",
      "templates",
      relativePath,
    ),
    path.join(path.dirname(normalizedFilename), "..", "..", "..", relativePath),
  ];

  for (const templatePath of possiblePaths) {
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }
  }

  throw new Error(
    `Template path not found: ${relativePath}. Tried: ${possiblePaths.join(", ")}`,
  );
}

/**
 * Copy base templates
 */
export async function copyBaseTemplate(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  const srcDir = getTemplatePath(TEMPLATE_PATHS.base);
  await processAndCopyFiles(
    srcDir,
    destDir,
    context as Record<string, unknown>,
  );
}

/**
 * Setup frontend templates
 */
export async function setupFrontendTemplates(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  // Frontend is now a single value, not an array
  const frontendFramework =
    context.frontend && context.frontend !== "none" ? context.frontend : null;

  if (frontendFramework) {
    const framework = frontendFramework;
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.frontend, framework),
    );
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Setup backend templates
 */
export async function setupBackendFramework(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.backend === "none") {
    return;
  }

  const srcDir = getTemplatePath(
    path.join(TEMPLATE_PATHS.backend, context.backend),
  );
  if (await fs.pathExists(srcDir)) {
    await processAndCopyFiles(
      srcDir,
      destDir,
      context as Record<string, unknown>,
    );
  }
}

/**
 * Setup database/ORM templates
 */
export async function setupDbOrmTemplates(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.database !== "none") {
    const dbDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.db, context.database),
    );
    if (await fs.pathExists(dbDir)) {
      await processAndCopyFiles(
        dbDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }

  if (context.orm !== "none") {
    const ormDir = getTemplatePath(path.join(TEMPLATE_PATHS.db, context.orm));
    if (await fs.pathExists(ormDir)) {
      await processAndCopyFiles(
        ormDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Setup auth templates
 */
export async function setupAuthTemplate(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.auth === "none") {
    return;
  }

  const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.auth, context.auth));
  if (await fs.pathExists(srcDir)) {
    await processAndCopyFiles(
      srcDir,
      destDir,
      context as Record<string, unknown>,
    );
  }
}

/**
 * Setup API templates
 */
export async function setupAPITemplates(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.api === "none") {
    return;
  }

  const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.api, context.api));
  if (await fs.pathExists(srcDir)) {
    await processAndCopyFiles(
      srcDir,
      destDir,
      context as Record<string, unknown>,
    );
  }
}

/**
 * Setup addon templates
 */
export async function setupAddonsTemplate(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  for (const addon of context.addons) {
    const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.addons, addon));
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Setup example templates
 */
export async function setupExamplesTemplate(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  const examples = context.examples.filter((e) => e !== "none");

  for (const example of examples) {
    const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.examples, example));
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Setup deployment templates
 */
export async function setupDeploymentTemplates(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.webDeploy !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.webDeploy),
    );
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }

  if (context.serverDeploy !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.serverDeploy),
    );
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Setup database setup templates
 */
export async function setupDbSetupTemplate(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  if (context.dbSetup !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.dbSetup, context.dbSetup),
    );
    if (await fs.pathExists(srcDir)) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }
}

/**
 * Handle extras (package manager specific files)
 */
export async function handleExtras(
  destDir: string,
  context: ProjectConfig,
): Promise<void> {
  const extrasDir = getTemplatePath(TEMPLATE_PATHS.extras);

  // pnpm workspace
  if (context.packageManager === "pnpm") {
    const pnpmWorkspace = path.join(extrasDir, "pnpm-workspace.yaml");
    if (await fs.pathExists(pnpmWorkspace)) {
      await copyFileOrDir(
        pnpmWorkspace,
        path.join(destDir, "pnpm-workspace.yaml"),
      );
    }
  }

  // bunfig
  if (context.packageManager === "bun") {
    const bunfig = path.join(extrasDir, "bunfig.toml.hbs");
    if (await fs.pathExists(bunfig)) {
      await copyFileOrDir(
        bunfig,
        path.join(destDir, "bunfig.toml"),
        context as Record<string, unknown>,
      );
    }
  }
}
