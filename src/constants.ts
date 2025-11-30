/**
 * Default configurations and constants
 */

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
} from "./types.js";

// Default project configuration
export const DEFAULT_CONFIG = {
  database: "none" as Database,
  orm: "none" as ORM,
  backend: "none" as Backend,
  runtime: "node" as Runtime,
  frontend: ["none"] as Frontend,
  addons: [] as Addons,
  examples: [] as Examples,
  auth: "none" as Auth,
  api: "none" as API,
  packageManager: "npm" as PackageManager,
  dbSetup: "none" as DatabaseSetup,
  webDeploy: "none" as WebDeploy,
  serverDeploy: "none" as ServerDeploy,
  git: true,
  install: true,
} as const;

// Dependency versions (keep updated)
export const DEPENDENCY_VERSIONS = {
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  next: "^14.0.0",
  nuxt: "^3.8.0",
  svelte: "^4.2.0",
  "solid-js": "^1.8.0",
  express: "^4.18.2",
  fastify: "^4.24.3",
  hono: "^3.11.0",
  elysia: "^1.0.0",
  convex: "^1.0.0",
  drizzle: "^0.29.0",
  prisma: "^5.7.0",
  mongoose: "^8.0.0",
  "better-auth": "^1.0.0",
  "@clerk/clerk-react": "^4.29.0",
  "@trpc/server": "^10.45.0",
  "@trpc/client": "^10.45.0",
  orpc: "^1.0.0",
} as const;

// Template directory paths
export const TEMPLATE_PATHS = {
  base: "templates/base",
  frontend: "templates/frontend",
  backend: "templates/backend",
  db: "templates/db",
  auth: "templates/auth",
  api: "templates/api",
  addons: "templates/addons",
  examples: "templates/examples",
  deploy: "templates/deploy",
  extras: "templates/extras",
} as const;

// Reserved project names
export const RESERVED_NAMES = [
  "node_modules",
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".git",
  ".gitignore",
  ".env",
  "dist",
  "build",
  "out",
  "src",
  "public",
  "test",
  "tests",
  "spec",
  "docs",
  "README.md",
  "LICENSE",
];

// Special file mappings
export const SPECIAL_FILES = {
  _gitignore: ".gitignore",
  _npmrc: ".npmrc",
  _env: ".env",
  "_env.example": ".env.example",
} as const;
