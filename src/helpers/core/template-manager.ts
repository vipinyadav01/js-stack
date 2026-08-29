/**
 * Template manager - handles copying and processing templates
 */

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import {
  processAndCopyFiles,
  copyFileOrDir,
} from "../../utils/template-processor.js";
import { TEMPLATE_PATHS } from "../../constants.js";
import type { ProjectConfig } from "../../types.js";

/**
 * Get template directory path cleanly or return null if not found
 */
function tryGetTemplatePath(relativePath: string): string | null {
  const normalizedPath = relativePath
    .replace(/\/nextjs(?=\/|$)/, "/next")
    .replace(/\/nestjs(?=\/|$)/, "/nest")
    .replace(/\/postgresql(?=\/|$)/, "/postgres");

  // Strip a leading "templates/" so the path can be re-rooted consistently,
  // whether callers pass "templates/base" or just "base".
  const rel = normalizedPath.replace(/^templates[\\/]/, "");

  // fileURLToPath decodes URL-encoding (e.g. %20 for spaces in the path) and
  // handles Windows drive paths correctly, unlike new URL(...).pathname.
  const dir = path.dirname(fileURLToPath(import.meta.url));

  // Candidate roots that may contain a "templates" directory:
  // - the user's current working directory (running from the repo)
  // - one level up from a bundled dist/ file (published package layout)
  // - two/three levels up (running from src/ during development)
  const roots = [
    process.cwd(),
    path.join(dir, ".."),
    path.join(dir, "..", ".."),
    path.join(dir, "..", "..", ".."),
  ];

  for (const root of roots) {
    const candidates = [
      path.join(root, "templates", rel),
      path.join(root, rel),
    ];
    for (const templatePath of candidates) {
      if (fs.existsSync(templatePath)) {
        return templatePath;
      }
    }
  }

  return null;
}

function getTemplatePath(relativePath: string): string {
  const found = tryGetTemplatePath(relativePath);
  if (found) return found;
  throw new Error(`Template path not found: ${relativePath}`);
}

/**
 * Full-stack frameworks that serve as both frontend and backend in a single
 * project — no directory separation needed when the user picks one of these
 * for both roles.
 */
const FULLSTACK_FRAMEWORKS = new Set(["next", "nuxt", "remix", "sveltekit"]);

/**
 * Returns true when the project uses separate frontend and backend frameworks,
 * which means files should be output into `frontend/` and `backend/` sub-dirs
 * with a workspace root at the project level.
 */
export function needsSeparateLayout(config: ProjectConfig): boolean {
  const hasFrontend = !!config.frontend && config.frontend !== "none";
  const hasBackend = !!config.backend && config.backend !== "none";
  if (!hasFrontend || !hasBackend) return false;
  if (config.frontend === config.backend) return false;
  if (
    FULLSTACK_FRAMEWORKS.has(config.frontend) &&
    FULLSTACK_FRAMEWORKS.has(config.backend)
  ) {
    return false;
  }
  return true;
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
  const frontendFramework =
    context.frontend && context.frontend !== "none" ? context.frontend : null;

  if (frontendFramework) {
    const srcDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.frontend, frontendFramework),
    );
    if (srcDir && (await fs.pathExists(srcDir))) {
      const outDir = needsSeparateLayout(context)
        ? path.join(destDir, "frontend")
        : destDir;
      await processAndCopyFiles(
        srcDir,
        outDir,
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

  const srcDir = tryGetTemplatePath(
    path.join(TEMPLATE_PATHS.backend, context.backend),
  );
  if (srcDir && (await fs.pathExists(srcDir))) {
    const outDir = needsSeparateLayout(context)
      ? path.join(destDir, "backend")
      : destDir;
    await processAndCopyFiles(
      srcDir,
      outDir,
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
  const outDir = needsSeparateLayout(context)
    ? path.join(destDir, "backend")
    : destDir;

  if (context.database !== "none") {
    const dbDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.db, context.database),
    );
    if (dbDir && (await fs.pathExists(dbDir))) {
      await processAndCopyFiles(
        dbDir,
        outDir,
        context as Record<string, unknown>,
      );
    }
  }

  if (context.orm !== "none") {
    const ormDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.db, context.orm),
    );
    if (ormDir && (await fs.pathExists(ormDir))) {
      await processAndCopyFiles(
        ormDir,
        outDir,
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

  const srcDir = tryGetTemplatePath(
    path.join(TEMPLATE_PATHS.auth, context.auth),
  );
  if (srcDir && (await fs.pathExists(srcDir))) {
    const outDir = needsSeparateLayout(context)
      ? path.join(destDir, "backend")
      : destDir;
    await processAndCopyFiles(
      srcDir,
      outDir,
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

  const srcDir = tryGetTemplatePath(path.join(TEMPLATE_PATHS.api, context.api));
  if (srcDir && (await fs.pathExists(srcDir))) {
    const outDir = needsSeparateLayout(context)
      ? path.join(destDir, "backend")
      : destDir;
    await processAndCopyFiles(
      srcDir,
      outDir,
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
    const srcDir = tryGetTemplatePath(path.join(TEMPLATE_PATHS.addons, addon));
    if (srcDir && (await fs.pathExists(srcDir))) {
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
    const srcDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.examples, example),
    );
    if (srcDir && (await fs.pathExists(srcDir))) {
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
    const srcDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.webDeploy),
    );
    if (srcDir && (await fs.pathExists(srcDir))) {
      await processAndCopyFiles(
        srcDir,
        destDir,
        context as Record<string, unknown>,
      );
    }
  }

  if (context.serverDeploy !== "none") {
    const srcDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.serverDeploy),
    );
    if (srcDir && (await fs.pathExists(srcDir))) {
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
    const srcDir = tryGetTemplatePath(
      path.join(TEMPLATE_PATHS.dbSetup, context.dbSetup),
    );
    if (srcDir && (await fs.pathExists(srcDir))) {
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
