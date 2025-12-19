#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import path, { join } from "path";
import * as p from "@clack/prompts";
import { group } from "@clack/prompts";
import fs from "fs-extra";
import { execa } from "execa";
import Handlebars from "handlebars";
import { globby } from "globby";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

//#region src/constants.ts
const DEFAULT_CONFIG = {
  database: "none",
  orm: "none",
  backend: "none",
  runtime: "node",
  frontend: "none",
  addons: [],
  examples: [],
  auth: "none",
  api: "none",
  packageManager: "npm",
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  git: true,
  install: true,
};
const TEMPLATE_PATHS = {
  base: "templates/base",
  frontend: "templates/frontend",
  backend: "templates/backend",
  db: "templates/db",
  auth: "templates/auth",
  api: "templates/api",
  addons: "templates/addons",
  examples: "templates/examples",
  deploy: "templates/deploy",
  dbSetup: "templates/db-setup",
  extras: "templates/extras",
};

//#endregion
//#region src/prompts/config-prompts.ts
/**
 * Prompt for project name
 */
async function promptProjectName(defaultValue) {
  const name = await p.text({
    message: "What is your project name?",
    placeholder: "my-awesome-app",
    defaultValue: defaultValue || "my-app",
    validate: (value) => {
      if (!value || value.trim().length === 0)
        return "Project name cannot be empty";
      if (value.length > 214)
        return "Project name is too long (max 214 characters)";
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(value))
        return "Project name contains invalid characters";
      return void 0;
    },
  });
  if (p.isCancel(name)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }
  return name;
}
/**
 * Interactive configuration prompts
 */
async function promptConfiguration(options) {
  if (options.yes)
    return {
      frontend: DEFAULT_CONFIG.frontend,
      backend: DEFAULT_CONFIG.backend,
      runtime: DEFAULT_CONFIG.runtime,
      database: DEFAULT_CONFIG.database,
      orm: DEFAULT_CONFIG.orm,
      api: DEFAULT_CONFIG.api,
      auth: DEFAULT_CONFIG.auth,
      addons: DEFAULT_CONFIG.addons,
      examples: [],
      dbSetup: DEFAULT_CONFIG.dbSetup,
      webDeploy: DEFAULT_CONFIG.webDeploy,
      serverDeploy: DEFAULT_CONFIG.serverDeploy,
      packageManager: DEFAULT_CONFIG.packageManager,
      git: DEFAULT_CONFIG.git,
      install: DEFAULT_CONFIG.install,
    };
  const config = await group(
    {
      frontend: () =>
        p.select({
          message: "Select frontend framework:",
          options: [
            {
              value: "next",
              label: "Next.js",
            },
            {
              value: "nuxt",
              label: "Nuxt",
            },
            {
              value: "sveltekit",
              label: "SvelteKit",
            },
            {
              value: "remix",
              label: "Remix",
            },
            {
              value: "astro",
              label: "Astro",
            },
            {
              value: "tanstack-start",
              label: "TanStack Start",
            },
            {
              value: "tanstack-router",
              label: "TanStack Router (SPA)",
            },
            {
              value: "react-router",
              label: "React Router (SPA)",
            },
            {
              value: "vue",
              label: "Vue.js (Vite)",
            },
            {
              value: "angular",
              label: "Angular",
            },
            {
              value: "svelte",
              label: "Svelte (Vite)",
            },
            {
              value: "solid",
              label: "Solid.js (Vite)",
            },
            {
              value: "qwik",
              label: "Qwik",
            },
            {
              value: "native-nativewind",
              label: "React Native (NativeWind)",
            },
            {
              value: "native-unistyles",
              label: "React Native (Unistyles)",
            },
            {
              value: "none",
              label: "None",
            },
          ],
          initialValue: "none",
        }),
      backend: ({ results }) => {
        const frontend = results.frontend;
        const metaFrameworks = [
          "next",
          "nuxt",
          "sveltekit",
          "remix",
          "astro",
          "solid-start",
          "qwik",
        ];
        const hasMetaFramework = metaFrameworks.includes(frontend);
        const options$1 = [
          {
            value: "none",
            label: "None",
          },
          {
            value: "hono",
            label: "Hono",
          },
          {
            value: "express",
            label: "Express",
          },
          {
            value: "fastify",
            label: "Fastify",
          },
          {
            value: "nest",
            label: "NestJS",
          },
          {
            value: "koa",
            label: "Koa",
          },
          {
            value: "elysia",
            label: "Elysia",
          },
          {
            value: "convex",
            label: "Convex",
          },
        ];
        if (frontend === "next")
          options$1.push({
            value: "next",
            label: "Next.js API Routes",
          });
        return p.select({
          message: hasMetaFramework
            ? "Select backend (Meta-frameworks usually have their own):"
            : "Select backend framework:",
          options: options$1,
          initialValue: "none",
        });
      },
      runtime: () =>
        p.select({
          message: "Select runtime:",
          options: [
            {
              value: "node",
              label: "Node.js",
            },
            {
              value: "bun",
              label: "Bun",
            },
            {
              value: "deno",
              label: "Deno",
            },
            {
              value: "workers",
              label: "Cloudflare Workers",
            },
            {
              value: "none",
              label: "None",
            },
          ],
          initialValue: "node",
        }),
      database: () =>
        p.select({
          message: "Select database:",
          options: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "sqlite",
              label: "SQLite",
            },
            {
              value: "postgres",
              label: "PostgreSQL",
            },
            {
              value: "mysql",
              label: "MySQL",
            },
            {
              value: "mongodb",
              label: "MongoDB",
            },
          ],
          initialValue: "none",
        }),
      orm: ({ results }) => {
        const db = results.database;
        const options$1 = [
          {
            value: "none",
            label: "None",
          },
        ];
        if (db === "mongodb")
          options$1.push(
            {
              value: "mongoose",
              label: "Mongoose",
            },
            {
              value: "prisma",
              label: "Prisma",
            },
            {
              value: "typeorm",
              label: "TypeORM",
            },
          );
        else if (db !== "none")
          options$1.push(
            {
              value: "drizzle",
              label: "Drizzle ORM",
            },
            {
              value: "prisma",
              label: "Prisma",
            },
            {
              value: "typeorm",
              label: "TypeORM",
            },
            {
              value: "mikro-orm",
              label: "MikroORM",
            },
          );
        else
          options$1.push(
            {
              value: "drizzle",
              label: "Drizzle ORM",
            },
            {
              value: "prisma",
              label: "Prisma",
            },
            {
              value: "mongoose",
              label: "Mongoose",
            },
            {
              value: "typeorm",
              label: "TypeORM",
            },
            {
              value: "mikro-orm",
              label: "MikroORM",
            },
          );
        return p.select({
          message: "Select ORM:",
          options: options$1,
          initialValue: "none",
        });
      },
      api: () =>
        p.select({
          message: "Select API style:",
          options: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "trpc",
              label: "tRPC",
            },
            {
              value: "orpc",
              label: "oRPC",
            },
            {
              value: "graphql",
              label: "GraphQL",
            },
            {
              value: "rest",
              label: "REST",
            },
          ],
          initialValue: "none",
        }),
      auth: ({ results }) => {
        const frontend = results.frontend;
        const backend = results.backend;
        const options$1 = [
          {
            value: "none",
            label: "None",
          },
          {
            value: "better-auth",
            label: "Better Auth",
          },
          {
            value: "clerk",
            label: "Clerk",
          },
          {
            value: "lucia",
            label: "Lucia",
          },
          {
            value: "kinde",
            label: "Kinde",
          },
        ];
        if (frontend === "next" || backend === "next")
          options$1.push({
            value: "next-auth",
            label: "NextAuth.js / Auth.js",
          });
        return p.select({
          message: "Select authentication:",
          options: options$1,
          initialValue: "none",
        });
      },
      addons: () =>
        p.multiselect({
          message: "Select addons:",
          options: [
            {
              value: "pwa",
              label: "PWA Support",
            },
            {
              value: "tauri",
              label: "Tauri (Desktop)",
            },
            {
              value: "biome",
              label: "Biome (Linting/Formatting)",
            },
            {
              value: "husky",
              label: "Husky (Git Hooks)",
            },
            {
              value: "turborepo",
              label: "Turborepo (Monorepo)",
            },
            {
              value: "vitest",
              label: "Vitest (Testing)",
            },
            {
              value: "playwright",
              label: "Playwright (E2E Testing)",
            },
            {
              value: "cypress",
              label: "Cypress (E2E Testing)",
            },
            {
              value: "storybook",
              label: "Storybook",
            },
            {
              value: "changesets",
              label: "Changesets",
            },
            {
              value: "docker",
              label: "Docker",
            },
            {
              value: "testing",
              label: "Testing Setup",
            },
          ],
        }),
      examples: () =>
        p.multiselect({
          message: "Include example code:",
          options: [
            {
              value: "todo",
              label: "Todo App Example",
            },
            {
              value: "ai",
              label: "AI Chat Example",
            },
            {
              value: "dashboard",
              label: "Dashboard Example",
            },
            {
              value: "auth",
              label: "Auth Example",
            },
            {
              value: "api",
              label: "API Example",
            },
            {
              value: "none",
              label: "None",
            },
          ],
        }),
      dbSetup: () =>
        p.select({
          message: "Database setup:",
          options: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "turso",
              label: "Turso",
            },
            {
              value: "neon",
              label: "Neon",
            },
            {
              value: "docker-compose",
              label: "Docker Compose",
            },
            {
              value: "supabase",
              label: "Supabase",
            },
          ],
          initialValue: "none",
        }),
      webDeploy: () =>
        p.select({
          message: "Web deployment:",
          options: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "cloudflare-pages",
              label: "Cloudflare Pages (Wrangler)",
            },
            {
              value: "alchemy",
              label: "Alchemy",
            },
          ],
          initialValue: "none",
        }),
      serverDeploy: () =>
        p.select({
          message: "Server deployment:",
          options: [
            {
              value: "none",
              label: "None",
            },
            {
              value: "cloudflare-workers",
              label: "Cloudflare Workers (Wrangler)",
            },
            {
              value: "alchemy",
              label: "Alchemy",
            },
          ],
          initialValue: "none",
        }),
      packageManager: () =>
        p.select({
          message: "Package manager:",
          options: [
            {
              value: "npm",
              label: "npm",
            },
            {
              value: "pnpm",
              label: "pnpm",
            },
            {
              value: "bun",
              label: "bun",
            },
          ],
          initialValue: "npm",
        }),
      git: () =>
        p.confirm({
          message: "Initialize Git repository?",
          initialValue: true,
        }),
      install: () =>
        p.confirm({
          message: "Install dependencies?",
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    },
  );
  return {
    frontend: config.frontend || DEFAULT_CONFIG.frontend,
    backend: config.backend || DEFAULT_CONFIG.backend,
    runtime: config.runtime || DEFAULT_CONFIG.runtime,
    database: config.database || DEFAULT_CONFIG.database,
    orm: config.orm || DEFAULT_CONFIG.orm,
    api: config.api || DEFAULT_CONFIG.api,
    auth: config.auth || DEFAULT_CONFIG.auth,
    addons: config.addons || DEFAULT_CONFIG.addons,
    examples: config.examples || [],
    dbSetup: config.dbSetup || DEFAULT_CONFIG.dbSetup,
    webDeploy: config.webDeploy || DEFAULT_CONFIG.webDeploy,
    serverDeploy: config.serverDeploy || DEFAULT_CONFIG.serverDeploy,
    packageManager: config.packageManager || DEFAULT_CONFIG.packageManager,
    git: Boolean(config.git ?? DEFAULT_CONFIG.git),
    install: Boolean(config.install ?? DEFAULT_CONFIG.install),
  };
}

//#endregion
//#region src/utils/project-directory.ts
/**
 * Check if directory exists and is not empty
 */
async function directoryExists(dirPath) {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) return false;
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) return false;
    const files = await fs.readdir(dirPath);
    return files.length > 0;
  } catch {
    return false;
  }
}
/**
 * Handle directory conflicts based on strategy
 */
async function handleDirectoryConflict(projectDir, strategy) {
  const exists = await directoryExists(projectDir);
  if (!exists) return projectDir;
  switch (strategy) {
    case "error":
      throw new Error(
        `Directory already exists: ${projectDir}\nUse --directory-conflict merge|overwrite|increment to handle this.`,
      );
    case "overwrite": {
      await fs.remove(projectDir);
      await fs.ensureDir(projectDir);
      return projectDir;
    }
    case "merge":
      return projectDir;
    case "increment": {
      let counter = 1;
      let newDir = projectDir;
      while (await directoryExists(newDir)) {
        const dirName = path.basename(projectDir);
        const parentDir = path.dirname(projectDir);
        newDir = path.join(parentDir, `${dirName}-${counter}`);
        counter++;
      }
      await fs.ensureDir(newDir);
      return newDir;
    }
    default:
      throw new Error(`Unknown directory conflict strategy: ${strategy}`);
  }
}
/**
 * Validate project name
 */
function validateProjectName(name) {
  if (!name || name.trim().length === 0)
    return {
      valid: false,
      error: "Project name cannot be empty",
    };
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name))
    return {
      valid: false,
      error: "Project name contains invalid characters",
    };
  const reserved = [
    "node_modules",
    "package.json",
    ".git",
    "dist",
    "build",
    "out",
  ];
  if (reserved.includes(name.toLowerCase()))
    return {
      valid: false,
      error: "Project name is reserved",
    };
  if (name.length > 214)
    return {
      valid: false,
      error: "Project name is too long (max 214)",
    };
  return { valid: true };
}
/**
 * Get absolute project directory path
 */
function getProjectDir(projectName, cwd = process.cwd()) {
  return path.resolve(cwd, projectName);
}

//#endregion
//#region src/validation.ts
/**
 * Validate database and ORM compatibility
 */
function validateDatabaseORM(database, orm) {
  if (database === "mongodb" && orm !== "mongoose" && orm !== "none")
    return {
      valid: false,
      error: "MongoDB can only be used with Mongoose ORM",
    };
  if (
    (database === "postgres" ||
      database === "mysql" ||
      database === "sqlite") &&
    orm === "mongoose"
  )
    return {
      valid: false,
      error: "Mongoose can only be used with MongoDB",
    };
  if (database === "mongodb" && orm === "drizzle")
    return {
      valid: false,
      error: "Drizzle ORM does not support MongoDB",
    };
  return { valid: true };
}
/**
 * Validate backend and runtime compatibility
 */
function validateBackendRuntime(backend, runtime) {
  if (backend === "convex" && runtime !== "node")
    return {
      valid: false,
      error: "Convex requires Node.js runtime",
    };
  if (runtime === "workers") {
    const supportedBackends = ["hono", "next", "none"];
    if (!supportedBackends.includes(backend))
      return {
        valid: false,
        error: "Workers runtime only supports Hono, Next.js, or no backend",
      };
  }
  return { valid: true };
}
/**
 * Validate frontend and backend compatibility
 */
function validateFrontendBackend(frontend, backend) {
  if (frontend === "next" && backend !== "none" && backend !== "next")
    return {
      valid: false,
      error:
        "Next.js includes its own backend. Set backend to 'none' or 'next'",
    };
  const metaFrameworks = [
    "nuxt",
    "sveltekit",
    "remix",
    "astro",
    "solid-start",
    "qwik",
  ];
  const hasMetaFramework = metaFrameworks.includes(frontend);
  if (hasMetaFramework && backend !== "none")
    return {
      valid: false,
      error:
        "Selected meta-framework includes its own backend. Set backend to 'none'",
    };
  return { valid: true };
}
/**
 * Validate auth and database compatibility
 */
function validateAuthDatabase(auth, database) {
  if (auth === "better-auth" && database === "none")
    return {
      valid: false,
      error: "Better Auth requires a database to be selected",
    };
  return { valid: true };
}
/**
 * Validate API and backend compatibility
 */
function validateAPIBackend(api, backend) {
  if ((api === "trpc" || api === "orpc") && backend === "none")
    return {
      valid: false,
      error: `${api.toUpperCase()} requires a backend to be selected`,
    };
  return { valid: true };
}
/**
 * Comprehensive configuration validation
 */
function validateConfig(config) {
  const errors = [];
  if (config.database && config.orm) {
    const result = validateDatabaseORM(config.database, config.orm);
    if (!result.valid && result.error) errors.push(result.error);
  }
  if (config.backend && config.runtime) {
    const result = validateBackendRuntime(config.backend, config.runtime);
    if (!result.valid && result.error) errors.push(result.error);
  }
  if (config.frontend && config.backend) {
    const result = validateFrontendBackend(config.frontend, config.backend);
    if (!result.valid && result.error) errors.push(result.error);
  }
  if (config.auth && config.database) {
    const result = validateAuthDatabase(config.auth, config.database);
    if (!result.valid && result.error) errors.push(result.error);
  }
  if (config.api && config.backend) {
    const result = validateAPIBackend(config.api, config.backend);
    if (!result.valid && result.error) errors.push(result.error);
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
/**
 * Auto-fix configuration based on compatibility rules
 */
function autoFixConfig(config) {
  const fixed = { ...config };
  if (fixed.database === "mongodb" && fixed.orm === "drizzle")
    fixed.orm = "prisma";
  if (
    (fixed.database === "postgres" ||
      fixed.database === "mysql" ||
      fixed.database === "sqlite") &&
    fixed.orm === "mongoose"
  )
    fixed.orm = "none";
  if (fixed.frontend === "next" && fixed.backend && fixed.backend !== "next")
    fixed.backend = "none";
  const metaFrameworks = [
    "nuxt",
    "sveltekit",
    "remix",
    "astro",
    "solid-start",
    "qwik",
  ];
  if (
    fixed.frontend &&
    metaFrameworks.includes(fixed.frontend) &&
    fixed.backend &&
    fixed.backend !== "none"
  )
    fixed.backend = "none";
  if (fixed.auth === "better-auth" && fixed.database === "none")
    fixed.database = "postgres";
  if (
    (fixed.api === "trpc" || fixed.api === "orpc") &&
    fixed.backend === "none"
  )
    fixed.backend = "express";
  return fixed;
}

//#endregion
//#region src/utils/template-processor.ts
function registerHelpers() {
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });
  Handlebars.registerHelper("ne", function (a, b) {
    return a !== b;
  });
  Handlebars.registerHelper("and", function (a, b) {
    return a && b;
  });
  Handlebars.registerHelper("or", function (a, b) {
    return a || b;
  });
  Handlebars.registerHelper("includes", function (array, value) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });
  Handlebars.registerHelper("concat", function (...args) {
    args.pop();
    return args.join("");
  });
  Handlebars.registerHelper("default", function (value, defaultValue) {
    return value != null ? value : defaultValue;
  });
}
registerHelpers();
/**
 * Process a single template file with Handlebars
 * Handles JSX/TSX extensions: .jsx.hbs → .jsx, .tsx.hbs → .tsx
 */
function processTemplate(srcPath, destPath, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const templateContent = await fs.readFile(srcPath, "utf-8");
      const template = Handlebars.compile(templateContent);
      const rendered = template(context);
      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, rendered, "utf-8");
      resolve();
    } catch (error) {
      reject(
        new Error(
          `Failed to process template ${srcPath}: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });
}
/**
 * Get output filename from template filename
 * Handles special cases:
 * - .jsx.hbs → .jsx
 * - .tsx.hbs → .tsx
 * - .hbs → remove extension
 * - _gitignore → .gitignore
 */
function getOutputFilename(templatePath) {
  const basename = path.basename(templatePath);
  if (basename.endsWith(".jsx.hbs"))
    return basename.replace(".jsx.hbs", ".jsx");
  if (basename.endsWith(".tsx.hbs"))
    return basename.replace(".tsx.hbs", ".tsx");
  if (basename.endsWith(".hbs")) return basename.slice(0, -4);
  if (basename.startsWith("_")) {
    const specialName = basename.slice(1);
    if (specialName === "gitignore") return ".gitignore";
    if (specialName === "npmrc") return ".npmrc";
    if (specialName === "env") return ".env";
    if (specialName === "env.example") return ".env.example";
  }
  return basename;
}
/**
 * Check if file is a template (has .hbs extension)
 */
function isTemplate(filePath) {
  return (
    filePath.endsWith(".hbs") ||
    filePath.endsWith(".jsx.hbs") ||
    filePath.endsWith(".tsx.hbs")
  );
}
/**
 * Check if file is binary (should be copied as-is)
 */
function isBinary(filePath) {
  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
  ];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.includes(ext);
}
/**
 * Process and copy files from template directory
 * Supports glob patterns and handles JSX/TSX templates
 */
async function processAndCopyFiles(srcDir, destDir, context, pattern = "**/*") {
  try {
    if (!(await fs.pathExists(srcDir)))
      throw new Error(`Template directory does not exist: ${srcDir}`);
    const files = await globby(pattern, {
      cwd: srcDir,
      absolute: false,
      dot: true,
    });
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const stat = await fs.stat(srcPath);
      if (stat.isDirectory()) continue;
      const outputFilename = getOutputFilename(file);
      const destPath = path.join(destDir, path.dirname(file), outputFilename);
      await fs.ensureDir(path.dirname(destPath));
      if (isBinary(srcPath)) {
        await fs.copy(srcPath, destPath);
        continue;
      }
      if (isTemplate(srcPath)) {
        await processTemplate(srcPath, destPath, context);
        continue;
      }
      await fs.copy(srcPath, destPath);
    }
  } catch (error) {
    throw new Error(
      `Failed to process and copy files: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
/**
 * Copy a single file or directory
 */
async function copyFileOrDir(src, dest, context) {
  try {
    const stat = await fs.stat(src);
    if (stat.isDirectory()) await processAndCopyFiles(src, dest, context || {});
    else {
      const destDir = path.dirname(dest);
      await fs.ensureDir(destDir);
      if (isTemplate(src) && context) await processTemplate(src, dest, context);
      else if (isBinary(src)) await fs.copy(src, dest);
      else await fs.copy(src, dest);
    }
  } catch (error) {
    throw new Error(
      `Failed to copy file or directory: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

//#endregion
//#region src/helpers/core/template-manager.ts
/**
 * Get template directory path
 */
function getTemplatePath(relativePath) {
  const __filename = new URL(import.meta.url).pathname;
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
  for (const templatePath of possiblePaths)
    if (fs.existsSync(templatePath)) return templatePath;
  throw new Error(
    `Template path not found: ${relativePath}. Tried: ${possiblePaths.join(", ")}`,
  );
}
/**
 * Copy base templates
 */
async function copyBaseTemplate(destDir, context) {
  const srcDir = getTemplatePath(TEMPLATE_PATHS.base);
  await processAndCopyFiles(srcDir, destDir, context);
}
/**
 * Setup frontend templates
 */
async function setupFrontendTemplates(destDir, context) {
  const frontendFramework =
    context.frontend && context.frontend !== "none" ? context.frontend : null;
  if (frontendFramework) {
    const framework = frontendFramework;
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.frontend, framework),
    );
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
}
/**
 * Setup backend templates
 */
async function setupBackendFramework(destDir, context) {
  if (context.backend === "none") return;
  const srcDir = getTemplatePath(
    path.join(TEMPLATE_PATHS.backend, context.backend),
  );
  if (await fs.pathExists(srcDir))
    await processAndCopyFiles(srcDir, destDir, context);
}
/**
 * Setup database/ORM templates
 */
async function setupDbOrmTemplates(destDir, context) {
  if (context.database !== "none") {
    const dbDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.db, context.database),
    );
    if (await fs.pathExists(dbDir))
      await processAndCopyFiles(dbDir, destDir, context);
  }
  if (context.orm !== "none") {
    const ormDir = getTemplatePath(path.join(TEMPLATE_PATHS.db, context.orm));
    if (await fs.pathExists(ormDir))
      await processAndCopyFiles(ormDir, destDir, context);
  }
}
/**
 * Setup auth templates
 */
async function setupAuthTemplate(destDir, context) {
  if (context.auth === "none") return;
  const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.auth, context.auth));
  if (await fs.pathExists(srcDir))
    await processAndCopyFiles(srcDir, destDir, context);
}
/**
 * Setup API templates
 */
async function setupAPITemplates(destDir, context) {
  if (context.api === "none") return;
  const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.api, context.api));
  if (await fs.pathExists(srcDir))
    await processAndCopyFiles(srcDir, destDir, context);
}
/**
 * Setup addon templates
 */
async function setupAddonsTemplate(destDir, context) {
  for (const addon of context.addons) {
    const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.addons, addon));
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
}
/**
 * Setup example templates
 */
async function setupExamplesTemplate(destDir, context) {
  const examples = context.examples.filter((e) => e !== "none");
  for (const example of examples) {
    const srcDir = getTemplatePath(path.join(TEMPLATE_PATHS.examples, example));
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
}
/**
 * Setup deployment templates
 */
async function setupDeploymentTemplates(destDir, context) {
  if (context.webDeploy !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.webDeploy),
    );
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
  if (context.serverDeploy !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.deploy, context.serverDeploy),
    );
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
}
/**
 * Setup database setup templates
 */
async function setupDbSetupTemplate(destDir, context) {
  if (context.dbSetup !== "none") {
    const srcDir = getTemplatePath(
      path.join(TEMPLATE_PATHS.dbSetup, context.dbSetup),
    );
    if (await fs.pathExists(srcDir))
      await processAndCopyFiles(srcDir, destDir, context);
  }
}
/**
 * Handle extras (package manager specific files)
 */
async function handleExtras(destDir, context) {
  const extrasDir = getTemplatePath(TEMPLATE_PATHS.extras);
  if (context.packageManager === "pnpm") {
    const pnpmWorkspace = path.join(extrasDir, "pnpm-workspace.yaml");
    if (await fs.pathExists(pnpmWorkspace))
      await copyFileOrDir(
        pnpmWorkspace,
        path.join(destDir, "pnpm-workspace.yaml"),
      );
  }
  if (context.packageManager === "bun") {
    const bunfig = path.join(extrasDir, "bunfig.toml.hbs");
    if (await fs.pathExists(bunfig))
      await copyFileOrDir(bunfig, path.join(destDir, "bunfig.toml"), context);
  }
}

//#endregion
//#region src/utils/biome-formatter.ts
/**
 * Format generated code with Biome
 */
async function formatWithBiome(projectDir, files) {
  try {
    try {
      await execa("npx", ["@biomejs/biome", "--version"], { cwd: projectDir });
    } catch {
      return;
    }
    const biomeArgs = ["@biomejs/biome", "format", "--write"];
    if (files && files.length > 0) biomeArgs.push(...files);
    else biomeArgs.push(".");
    await execa("npx", biomeArgs, {
      cwd: projectDir,
      stdio: "inherit",
    });
  } catch (error) {
    console.warn(
      `Warning: Failed to format code with Biome: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
/**
 * Create Biome configuration file
 */
async function createBiomeConfig(projectDir) {
  const biomeConfig = {
    $schema: "https://biomejs.dev/schemas/1.8.0/schema.json",
    vcs: {
      enabled: true,
      clientKind: "git",
      useIgnoreFile: true,
    },
    files: {
      ignoreUnknown: false,
      ignore: ["node_modules", "dist", "build", ".next", ".turbo"],
    },
    formatter: {
      enabled: true,
      formatWithErrors: false,
      indentStyle: "space",
      indentWidth: 2,
      lineEnding: "lf",
      lineWidth: 100,
    },
    linter: {
      enabled: true,
      rules: { recommended: true },
    },
    javascript: {
      formatter: {
        quoteStyle: "double",
        jsxQuoteStyle: "double",
        trailingCommas: "es5",
        semicolons: "always",
        arrowParentheses: "always",
      },
    },
  };
  const configPath = path.join(projectDir, "biome.json");
  await fs.writeJSON(configPath, biomeConfig, { spaces: 2 });
}

//#endregion
//#region src/helpers/core/create-project.ts
/**
 * Create project structure
 */
async function createProjectStructure(config) {
  const spinner = p.spinner();
  spinner.start("Creating project structure...");
  try {
    await fs.ensureDir(config.projectDir);
    spinner.message("Copying base templates...");
    await copyBaseTemplate(config.projectDir, config);
    if (config.frontend && config.frontend !== "none") {
      spinner.message("Setting up frontend...");
      await setupFrontendTemplates(config.projectDir, config);
    }
    if (config.backend !== "none") {
      spinner.message("Setting up backend...");
      await setupBackendFramework(config.projectDir, config);
    }
    if (config.database !== "none" || config.orm !== "none") {
      spinner.message("Setting up database/ORM...");
      await setupDbOrmTemplates(config.projectDir, config);
    }
    if (config.auth !== "none") {
      spinner.message("Setting up authentication...");
      await setupAuthTemplate(config.projectDir, config);
    }
    if (config.api !== "none") {
      spinner.message("Setting up API...");
      await setupAPITemplates(config.projectDir, config);
    }
    if (config.addons.length > 0) {
      spinner.message("Setting up addons...");
      await setupAddonsTemplate(config.projectDir, config);
    }
    if (config.examples.length > 0 && !config.examples.includes("none")) {
      spinner.message("Setting up examples...");
      await setupExamplesTemplate(config.projectDir, config);
    }
    if (config.webDeploy !== "none" || config.serverDeploy !== "none") {
      spinner.message("Setting up deployment configs...");
      await setupDeploymentTemplates(config.projectDir, config);
    }
    if (config.dbSetup !== "none") {
      spinner.message("Setting up database environment...");
      await setupDbSetupTemplate(config.projectDir, config);
    }
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
async function initializeGit(projectDir) {
  try {
    await execa("git", ["init"], { cwd: projectDir });
    await execa("git", ["add", "."], { cwd: projectDir });
    await execa(
      "git",
      ["commit", "-m", "Initial commit from create-js-stack"],
      { cwd: projectDir },
    );
  } catch (error) {
    console.warn(
      `Warning: Failed to initialize Git: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
/**
 * Install dependencies
 */
async function installDependencies(projectDir, packageManager) {
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
async function postProcessProject(config) {
  const spinner = p.spinner();
  spinner.start("Post-processing project...");
  try {
    if (config.addons.includes("biome")) {
      spinner.message("Setting up Biome...");
      await createBiomeConfig(config.projectDir);
    }
    if (config.addons.includes("biome")) {
      spinner.message("Formatting code...");
      await formatWithBiome(config.projectDir);
    }
    spinner.stop("Post-processing complete!");
  } catch (error) {
    spinner.stop("Post-processing failed (non-fatal)");
    console.warn(
      `Warning: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
/**
 * Main project creation function
 */
async function createProject$1(config, options = {}) {
  try {
    if (!options.verbose) {
      const validation = validateConfig(config);
      if (!validation.valid) {
        const fixedConfig = autoFixConfig(config);
        Object.assign(config, fixedConfig);
        const reValidation = validateConfig(config);
        if (!reValidation.valid)
          throw new Error(
            `Configuration errors:\n${reValidation.errors.join("\n")}`,
          );
      }
    }
    await createProjectStructure(config);
    if (config.git) await initializeGit(config.projectDir);
    if (config.install)
      await installDependencies(config.projectDir, config.packageManager);
    await postProcessProject(config);
    p.log.success(`Project ${config.projectName} created successfully!`);
  } catch (error) {
    p.log.error(
      `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

//#endregion
//#region src/utils/display-config.ts
/**
 * Display configuration summary
 */
function displayConfig(config) {
  p.log.info("Project Configuration:");
  console.log();
  const configDisplay = {
    "Project Name": config.projectName,
    Frontend:
      config.frontend && config.frontend !== "none" ? config.frontend : "None",
    Backend: config.backend,
    Runtime: config.runtime,
    Database: config.database,
    ORM: config.orm,
    API: config.api,
    Auth: config.auth,
    Addons: config.addons.join(", ") || "None",
    Examples: config.examples.join(", ") || "None",
    "Package Manager": config.packageManager,
    Git: config.git ? "Yes" : "No",
    "Install Dependencies": config.install ? "Yes" : "No",
  };
  for (const [key, value] of Object.entries(configDisplay))
    console.log(`  ${key.padEnd(20)}: ${value}`);
  console.log();
}

//#endregion
//#region src/utils/generate-reproducible-command.ts
/**
 * Generate CLI command that reproduces the exact configuration
 */
function generateReproducibleCommand(config) {
  const parts = ["create-js-stack", config.projectName];
  if (config.frontend && config.frontend !== "none")
    parts.push(`--frontend ${config.frontend}`);
  if (config.backend !== "none") parts.push(`--backend ${config.backend}`);
  if (config.runtime !== "none") parts.push(`--runtime ${config.runtime}`);
  if (config.database !== "none") parts.push(`--database ${config.database}`);
  if (config.orm !== "none") parts.push(`--orm ${config.orm}`);
  if (config.api !== "none") parts.push(`--api ${config.api}`);
  if (config.auth !== "none") parts.push(`--auth ${config.auth}`);
  if (config.addons.length > 0)
    parts.push(`--addons ${config.addons.join(",")}`);
  if (config.examples.length > 0 && !config.examples.includes("none"))
    parts.push(`--examples ${config.examples.join(",")}`);
  if (config.dbSetup !== "none") parts.push(`--db-setup ${config.dbSetup}`);
  if (config.webDeploy !== "none")
    parts.push(`--web-deploy ${config.webDeploy}`);
  if (config.serverDeploy !== "none")
    parts.push(`--server-deploy ${config.serverDeploy}`);
  if (config.packageManager !== "npm")
    parts.push(`--package-manager ${config.packageManager}`);
  if (!config.git) parts.push("--no-git");
  if (!config.install) parts.push("--no-install");
  return parts.join(" ");
}

//#endregion
//#region src/utils/js-stack-config.ts
/**
 * Save configuration to .js-stack.json
 */
async function saveConfig(projectDir, config) {
  const configPath = path.join(projectDir, ".js-stack.json");
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

//#endregion
//#region src/commands/create.ts
/**
 * Parse comma-separated string to array
 */
function parseArray(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
/**
 * Create command
 */
async function createProject(projectName, options = {}) {
  try {
    let finalProjectName = projectName;
    if (!finalProjectName) finalProjectName = await promptProjectName();
    const nameValidation = validateProjectName(finalProjectName);
    if (!nameValidation.valid) {
      p.log.error(nameValidation.error || "Invalid project name");
      process.exit(1);
    }
    const projectDir = getProjectDir(finalProjectName);
    const relativePath = path.relative(process.cwd(), projectDir);
    const conflictStrategy = options.directoryConflict || "error";
    const finalProjectDir = await handleDirectoryConflict(
      projectDir,
      conflictStrategy,
    );
    let config;
    if (options.yes)
      config = {
        ...DEFAULT_CONFIG,
        projectName: finalProjectName,
        projectDir: finalProjectDir,
        relativePath,
        frontend: options.frontend ? options.frontend : DEFAULT_CONFIG.frontend,
        backend: options.backend || DEFAULT_CONFIG.backend,
        runtime: options.runtime || DEFAULT_CONFIG.runtime,
        database: options.database || DEFAULT_CONFIG.database,
        orm: options.orm || DEFAULT_CONFIG.orm,
        api: options.api || DEFAULT_CONFIG.api,
        auth: options.auth || DEFAULT_CONFIG.auth,
        addons: options.addons
          ? parseArray(options.addons)
          : DEFAULT_CONFIG.addons,
        examples: options.examples ? parseArray(options.examples) : [],
        dbSetup: options.dbSetup || DEFAULT_CONFIG.dbSetup,
        webDeploy: options.webDeploy || DEFAULT_CONFIG.webDeploy,
        serverDeploy: options.serverDeploy || DEFAULT_CONFIG.serverDeploy,
        packageManager: options.packageManager || DEFAULT_CONFIG.packageManager,
        git: options.git !== void 0 ? options.git : DEFAULT_CONFIG.git,
        install:
          options.install !== void 0 ? options.install : DEFAULT_CONFIG.install,
      };
    else {
      const hasOptions = Object.keys(options).length > 0;
      if (options.yolo || hasOptions)
        config = {
          projectName: finalProjectName,
          projectDir: finalProjectDir,
          relativePath,
          frontend: options.frontend || DEFAULT_CONFIG.frontend,
          backend: options.backend || DEFAULT_CONFIG.backend,
          runtime: options.runtime || DEFAULT_CONFIG.runtime,
          database: options.database || DEFAULT_CONFIG.database,
          orm: options.orm || DEFAULT_CONFIG.orm,
          api: options.api || DEFAULT_CONFIG.api,
          auth: options.auth || DEFAULT_CONFIG.auth,
          addons: parseArray(options.addons),
          examples: parseArray(options.examples),
          dbSetup: options.dbSetup || DEFAULT_CONFIG.dbSetup,
          webDeploy: options.webDeploy || DEFAULT_CONFIG.webDeploy,
          serverDeploy: options.serverDeploy || DEFAULT_CONFIG.serverDeploy,
          packageManager:
            options.packageManager || DEFAULT_CONFIG.packageManager,
          git: options.git !== void 0 ? options.git : DEFAULT_CONFIG.git,
          install:
            options.install !== void 0
              ? options.install
              : DEFAULT_CONFIG.install,
        };
      else {
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
    if (!options.yolo) {
      const validation = validateConfig(config);
      if (!validation.valid) {
        const fixed = autoFixConfig(config);
        Object.assign(config, fixed);
        const reValidation = validateConfig(config);
        if (!reValidation.valid) {
          p.log.error("Configuration errors:");
          for (const error of reValidation.errors) p.log.error(`  - ${error}`);
          process.exit(1);
        }
        if (validation.errors.length > 0) {
          p.log.warn("Configuration was auto-fixed:");
          for (const error of validation.errors) p.log.warn(`  - ${error}`);
        }
      }
    }
    if (options.verbose) displayConfig(config);
    if (options.dryRun)
      p.log.info("Dry run enabled. Skipping project creation.");
    else await createProject$1(config, { verbose: options.verbose });
    if (!options.dryRun) await saveConfig(finalProjectDir, config);
    if (options.dryRun)
      p.log.success(`Dry run complete for project ${finalProjectName}!`);
    else p.log.success(`Project ${finalProjectName} created successfully!`);
    console.log();
    p.log.info("Next steps:");
    console.log(`  cd ${relativePath}`);
    if (!config.install) console.log(`  ${config.packageManager} install`);
    console.log(
      `  ${config.packageManager} ${config.packageManager === "npm" ? "run " : ""}dev`,
    );
    console.log();
    const reproducibleCommand = generateReproducibleCommand(config);
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

//#endregion
//#region src/commands/list.ts
async function listPresets(options) {
  console.log(chalk.blue("Available presets:"));
  console.log(chalk.green("- mern"));
  console.log(chalk.green("- next-fullstack"));
  console.log(chalk.green("- react-vite"));
  console.log(chalk.green("- express-api"));
  if (options.json)
    console.log(
      JSON.stringify(
        ["mern", "next-fullstack", "react-vite", "express-api"],
        null,
        2,
      ),
    );
}

//#endregion
//#region src/commands/add-preset.ts
async function addPreset(name, options) {
  console.log(chalk.blue(`Adding preset: ${name}`));
  if (options.source) console.log(chalk.gray(`Source: ${options.source}`));
}

//#endregion
//#region src/utils/version.ts
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const packageJsonPath = join(__dirname, "../../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

//#endregion
//#region src/cli.ts
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
program.parse();

//#endregion
