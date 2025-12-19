/**
 * Interactive prompts for project configuration using @clack/prompts
 */

import * as p from "@clack/prompts";
import { group } from "@clack/prompts";
import type {
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Addons,
  Examples,
  Auth,
  API,
  PackageManager,
  DatabaseSetup,
  WebDeploy,
  ServerDeploy,
} from "../types.js";
import { DEFAULT_CONFIG } from "../constants.js";

/**
 * Prompt for project name
 */
export async function promptProjectName(
  defaultValue?: string,
): Promise<string> {
  const name = await p.text({
    message: "What is your project name?",
    placeholder: "my-awesome-app",
    defaultValue: defaultValue || "my-app",
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return "Project name cannot be empty";
      }
      if (value.length > 214) {
        return "Project name is too long (max 214 characters)";
      }
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(value)) {
        return "Project name contains invalid characters";
      }
      return undefined;
    },
  });

  if (p.isCancel(name)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return name as string;
}

/**
 * Interactive configuration prompts
 */
export async function promptConfiguration(options: {
  yes?: boolean;
  yolo?: boolean;
}): Promise<{
  frontend: Frontend;
  backend: Backend;
  runtime: Runtime;
  database: Database;
  orm: ORM;
  api: API;
  auth: Auth;
  addons: Addons;
  examples: Examples;
  dbSetup: DatabaseSetup;
  webDeploy: WebDeploy;
  serverDeploy: ServerDeploy;
  packageManager: PackageManager;
  git: boolean;
  install: boolean;
}> {
  if (options.yes) {
    // Return defaults for --yes flag
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
  }

  const config = await group(
    {
      frontend: () =>
        p.select({
          message: "Select frontend framework:",
          options: [
            { value: "next", label: "Next.js" },
            { value: "nuxt", label: "Nuxt" },
            { value: "sveltekit", label: "SvelteKit" },
            { value: "remix", label: "Remix" },
            { value: "astro", label: "Astro" },
            { value: "tanstack-start", label: "TanStack Start" },
            { value: "tanstack-router", label: "TanStack Router (SPA)" },
            { value: "react-router", label: "React Router (SPA)" },
            { value: "vue", label: "Vue.js (Vite)" },
            { value: "angular", label: "Angular" },
            { value: "svelte", label: "Svelte (Vite)" },
            { value: "solid", label: "Solid.js (Vite)" },
            { value: "qwik", label: "Qwik" },
            { value: "native-nativewind", label: "React Native (NativeWind)" },
            { value: "native-unistyles", label: "React Native (Unistyles)" },
            { value: "none", label: "None" },
          ],
          initialValue: "none",
        }),
      backend: ({ results }: { results: any }) => {
        const frontend = results.frontend as string;
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

        const options = [
          { value: "none", label: "None" },
          { value: "hono", label: "Hono" },
          { value: "express", label: "Express" },
          { value: "fastify", label: "Fastify" },
          { value: "nest", label: "NestJS" },
          { value: "koa", label: "Koa" },
          { value: "elysia", label: "Elysia" },
          { value: "convex", label: "Convex" },
        ];

        if (frontend === "next") {
          options.push({ value: "next", label: "Next.js API Routes" });
        }
        return p.select({
          message: hasMetaFramework
            ? "Select backend (Meta-frameworks usually have their own):"
            : "Select backend framework:",
          options,
          initialValue: "none",
        });
      },
      runtime: () =>
        p.select({
          message: "Select runtime:",
          options: [
            { value: "node", label: "Node.js" },
            { value: "bun", label: "Bun" },
            { value: "deno", label: "Deno" },
            { value: "workers", label: "Cloudflare Workers" },
            { value: "none", label: "None" },
          ],
          initialValue: "node",
        }),
      database: () =>
        p.select({
          message: "Select database:",
          options: [
            { value: "none", label: "None" },
            { value: "sqlite", label: "SQLite" },
            { value: "postgres", label: "PostgreSQL" },
            { value: "mysql", label: "MySQL" },
            { value: "mongodb", label: "MongoDB" },
          ],
          initialValue: "none",
        }),
      orm: ({ results }: { results: any }) => {
        const db = results.database;
        const options = [{ value: "none", label: "None" }];

        if (db === "mongodb") {
          options.push(
            { value: "mongoose", label: "Mongoose" },
            { value: "prisma", label: "Prisma" },
            { value: "typeorm", label: "TypeORM" },
          );
        } else if (db !== "none") {
          // SQL Databases
          options.push(
            { value: "drizzle", label: "Drizzle ORM" },
            { value: "prisma", label: "Prisma" },
            { value: "typeorm", label: "TypeORM" },
            { value: "mikro-orm", label: "MikroORM" },
          );
        } else {
          // No DB selected, show all
          options.push(
            { value: "drizzle", label: "Drizzle ORM" },
            { value: "prisma", label: "Prisma" },
            { value: "mongoose", label: "Mongoose" },
            { value: "typeorm", label: "TypeORM" },
            { value: "mikro-orm", label: "MikroORM" },
          );
        }

        return p.select({
          message: "Select ORM:",
          options,
          initialValue: "none",
        });
      },
      api: () =>
        p.select({
          message: "Select API style:",
          options: [
            { value: "none", label: "None" },
            { value: "trpc", label: "tRPC" },
            { value: "orpc", label: "oRPC" },
            { value: "graphql", label: "GraphQL" },
            { value: "rest", label: "REST" },
          ],
          initialValue: "none",
        }),
      auth: ({ results }: { results: any }) => {
        const frontend = results.frontend as string;
        const backend = results.backend as string;

        const options = [
          { value: "none", label: "None" },
          { value: "better-auth", label: "Better Auth" },
          { value: "clerk", label: "Clerk" },
          { value: "lucia", label: "Lucia" },
          { value: "kinde", label: "Kinde" },
        ];

        if (frontend === "next" || backend === "next") {
          options.push({ value: "next-auth", label: "NextAuth.js / Auth.js" });
        }

        return p.select({
          message: "Select authentication:",
          options,
          initialValue: "none",
        });
      },
      addons: () =>
        p.multiselect({
          message: "Select addons:",
          options: [
            { value: "pwa", label: "PWA Support" },
            { value: "tauri", label: "Tauri (Desktop)" },
            { value: "biome", label: "Biome (Linting/Formatting)" },
            { value: "husky", label: "Husky (Git Hooks)" },
            { value: "turborepo", label: "Turborepo (Monorepo)" },
            { value: "vitest", label: "Vitest (Testing)" },
            { value: "playwright", label: "Playwright (E2E Testing)" },
            { value: "cypress", label: "Cypress (E2E Testing)" },
            { value: "storybook", label: "Storybook" },
            { value: "changesets", label: "Changesets" },
            { value: "docker", label: "Docker" },
            { value: "testing", label: "Testing Setup" },
          ],
        }),
      examples: () =>
        p.multiselect({
          message: "Include example code:",
          options: [
            { value: "todo", label: "Todo App Example" },
            { value: "ai", label: "AI Chat Example" },
            { value: "dashboard", label: "Dashboard Example" },
            { value: "auth", label: "Auth Example" },
            { value: "api", label: "API Example" },
            { value: "none", label: "None" },
          ],
        }),
      dbSetup: () =>
        p.select({
          message: "Database setup:",
          options: [
            { value: "none", label: "None" },
            { value: "turso", label: "Turso" },
            { value: "neon", label: "Neon" },
            { value: "docker-compose", label: "Docker Compose" },
            { value: "supabase", label: "Supabase" },
          ],
          initialValue: "none",
        }),
      webDeploy: () =>
        p.select({
          message: "Web deployment:",
          options: [
            { value: "none", label: "None" },
            { value: "cloudflare-pages", label: "Cloudflare Pages (Wrangler)" },
            { value: "alchemy", label: "Alchemy" },
          ],
          initialValue: "none",
        }),
      serverDeploy: () =>
        p.select({
          message: "Server deployment:",
          options: [
            { value: "none", label: "None" },
            {
              value: "cloudflare-workers",
              label: "Cloudflare Workers (Wrangler)",
            },
            { value: "alchemy", label: "Alchemy" },
          ],
          initialValue: "none",
        }),
      packageManager: () =>
        p.select({
          message: "Package manager:",
          options: [
            { value: "npm", label: "npm" },
            { value: "pnpm", label: "pnpm" },
            { value: "bun", label: "bun" },
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
    frontend: (config.frontend as Frontend) || DEFAULT_CONFIG.frontend,
    backend: (config.backend as Backend) || DEFAULT_CONFIG.backend,
    runtime: (config.runtime as Runtime) || DEFAULT_CONFIG.runtime,
    database: (config.database as Database) || DEFAULT_CONFIG.database,
    orm: (config.orm as ORM) || DEFAULT_CONFIG.orm,
    api: (config.api as API) || DEFAULT_CONFIG.api,
    auth: (config.auth as Auth) || DEFAULT_CONFIG.auth,
    addons: (config.addons as Addons) || DEFAULT_CONFIG.addons,
    examples: (config.examples as Examples) || [],
    dbSetup: (config.dbSetup as DatabaseSetup) || DEFAULT_CONFIG.dbSetup,
    webDeploy: (config.webDeploy as WebDeploy) || DEFAULT_CONFIG.webDeploy,
    serverDeploy:
      (config.serverDeploy as ServerDeploy) || DEFAULT_CONFIG.serverDeploy,
    packageManager:
      (config.packageManager as PackageManager) ||
      DEFAULT_CONFIG.packageManager,
    git: Boolean(config.git ?? DEFAULT_CONFIG.git),
    install: Boolean(config.install ?? DEFAULT_CONFIG.install),
  };
}
