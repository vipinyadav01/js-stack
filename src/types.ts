import { z } from "zod";

/**
 * Type definitions and Zod schemas for JS Stack CLI
 */

// Database types
export const DatabaseSchema = z.enum([
  "none",
  "sqlite",
  "postgres",
  "mysql",
  "mongodb",
]);
export type Database = z.infer<typeof DatabaseSchema>;

// ORM types
export const ORMSchema = z.enum(["none", "drizzle", "prisma", "mongoose"]);
export type ORM = z.infer<typeof ORMSchema>;

// Backend types
export const BackendSchema = z.enum([
  "none",
  "hono",
  "express",
  "fastify",
  "next",
  "elysia",
  "convex",
]);
export type Backend = z.infer<typeof BackendSchema>;

// Runtime types
export const RuntimeSchema = z.enum(["none", "bun", "node", "workers"]);
export type Runtime = z.infer<typeof RuntimeSchema>;

// Frontend types (array)
export const FrontendSchema = z.array(
  z.enum([
    "tanstack-router",
    "react-router",
    "tanstack-start",
    "next",
    "nuxt",
    "native-nativewind",
    "native-unistyles",
    "svelte",
    "solid",
    "none",
  ]),
);
export type Frontend = z.infer<typeof FrontendSchema>;

// Addons types
export const AddonsSchema = z.array(
  z.enum([
    "pwa",
    "tauri",
    "biome",
    "husky",
    "turborepo",
    "vitest",
    "playwright",
    "cypress",
    "docker",
    "testing",
  ]),
);
export type Addons = z.infer<typeof AddonsSchema>;

// Examples types
export const ExamplesSchema = z.array(
  z.enum(["todo", "ai", "dashboard", "auth", "api", "none"]),
);
export type Examples = z.infer<typeof ExamplesSchema>;

// Auth types
export const AuthSchema = z.enum(["none", "better-auth", "clerk"]);
export type Auth = z.infer<typeof AuthSchema>;

// API types
export const APISchema = z.enum(["none", "trpc", "orpc"]);
export type API = z.infer<typeof APISchema>;

// Package manager types
export const PackageManagerSchema = z.enum(["npm", "pnpm", "bun"]);
export type PackageManager = z.infer<typeof PackageManagerSchema>;

// Database setup types
export const DatabaseSetupSchema = z.enum([
  "none",
  "turso",
  "neon",
  "docker",
  "supabase",
]);
export type DatabaseSetup = z.infer<typeof DatabaseSetupSchema>;

// Web deployment types
export const WebDeploySchema = z.enum(["none", "wrangler", "alchemy"]);
export type WebDeploy = z.infer<typeof WebDeploySchema>;

// Server deployment types
export const ServerDeploySchema = z.enum(["none", "wrangler", "alchemy"]);
export type ServerDeploy = z.infer<typeof ServerDeploySchema>;

// Directory conflict handling
export const DirectoryConflictSchema = z.enum([
  "merge",
  "overwrite",
  "increment",
  "error",
]);
export type DirectoryConflict = z.infer<typeof DirectoryConflictSchema>;

// Project configuration schema
export const ProjectConfigSchema = z.object({
  projectName: z.string().min(1),
  projectDir: z.string(),
  relativePath: z.string(),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  runtime: RuntimeSchema,
  frontend: FrontendSchema,
  addons: AddonsSchema,
  examples: ExamplesSchema,
  auth: AuthSchema,
  git: z.boolean(),
  packageManager: PackageManagerSchema,
  install: z.boolean(),
  dbSetup: DatabaseSetupSchema,
  api: APISchema,
  webDeploy: WebDeploySchema,
  serverDeploy: ServerDeploySchema,
  directoryConflict: DirectoryConflictSchema.default("error"),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// CLI options schema
export const CLIOptionsSchema = z.object({
  yes: z.boolean().default(false),
  yolo: z.boolean().default(false),
  verbose: z.boolean().default(false),
  projectName: z.string().optional(),
  database: DatabaseSchema.optional(),
  orm: ORMSchema.optional(),
  backend: BackendSchema.optional(),
  runtime: RuntimeSchema.optional(),
  frontend: z.string().optional(),
  addons: z.string().optional(),
  examples: z.string().optional(),
  auth: AuthSchema.optional(),
  api: APISchema.optional(),
  packageManager: PackageManagerSchema.optional(),
  dbSetup: DatabaseSetupSchema.optional(),
  webDeploy: WebDeploySchema.optional(),
  serverDeploy: ServerDeploySchema.optional(),
  git: z.boolean().optional(),
  install: z.boolean().optional(),
  directoryConflict: DirectoryConflictSchema.optional(),
});

export type CLIOptions = z.infer<typeof CLIOptionsSchema>;
