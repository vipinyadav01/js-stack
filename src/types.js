import * as yup from "yup";

// Technology Categories
export const TECHNOLOGY_TYPES = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  DATABASE: "database",
  ORM: "orm",
  AUTH: "auth",
  ADDON: "addon",
};

// Database options
export const DATABASE_OPTIONS = {
  NONE: "none",
  SQLITE: "sqlite",
  POSTGRES: "postgres",
  MYSQL: "mysql",
  MONGODB: "mongodb",
};

// ORM options
export const ORM_OPTIONS = {
  NONE: "none",
  PRISMA: "prisma",
  SEQUELIZE: "sequelize",
  MONGOOSE: "mongoose",
  TYPEORM: "typeorm",
  DRIZZLE: "drizzle",
};

// Backend framework options
export const BACKEND_OPTIONS = {
  NONE: "none",
  EXPRESS: "express",
  FASTIFY: "fastify",
  KOA: "koa",
  HAPI: "hapi",
  NESTJS: "nestjs",
};

// Frontend framework options
export const FRONTEND_OPTIONS = {
  NONE: "none",
  REACT: "react",
  VUE: "vue",
  ANGULAR: "angular",
  SVELTE: "svelte",
  NEXTJS: "nextjs",
  NUXT: "nuxt",
  REACT_NATIVE: "react-native",
  REMIX: "remix",
  ASTRO: "astro",
  SVELTEKIT: "sveltekit",
};

// Package manager options
export const PACKAGE_MANAGER_OPTIONS = {
  NPM: "npm",
  YARN: "yarn",
  PNPM: "pnpm",
  BUN: "bun",
};

// Authentication options
export const AUTH_OPTIONS = {
  NONE: "none",
  JWT: "jwt",
  PASSPORT: "passport",
  AUTH0: "auth0",
  OAUTH: "oauth",
  NEXTAUTH: "nextauth",
  SUPABASE: "supabase",
  LUCIA: "lucia",
};

// Addon options
export const ADDON_OPTIONS = {
  ESLINT: "eslint",
  PRETTIER: "prettier",
  HUSKY: "husky",
  DOCKER: "docker",
  GITHUB_ACTIONS: "github-actions",
  TESTING: "testing",
  TAILWIND: "tailwind",
  SHADCN: "shadcn",
  STORYBOOK: "storybook",
};

// Validation schemas
export const ProjectNameSchema = yup
  .string()
  .required("Project name is required")
  .min(1, "Project name cannot be empty")
  .max(255, "Project name must be less than 255 characters")
  .matches(/^[^.]/, "Project name cannot start with a dot")
  .matches(/^[^-]/, "Project name cannot start with a dash")
  .test(
    "no-invalid-chars",
    "Project name contains invalid characters",
    (value) => {
      const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
      return !invalidChars.some((char) => value?.includes(char));
    },
  )
  .test("not-reserved", "Project name is reserved", (value) => {
    return value?.toLowerCase() !== "node_modules";
  });

export const DatabaseSchema = yup
  .string()
  .oneOf(Object.values(DATABASE_OPTIONS));

export const ORMSchema = yup.string().oneOf(Object.values(ORM_OPTIONS));

export const BackendSchema = yup.string().oneOf(Object.values(BACKEND_OPTIONS));

export const FrontendSchema = yup
  .string()
  .oneOf(Object.values(FRONTEND_OPTIONS));

export const PackageManagerSchema = yup
  .string()
  .oneOf(Object.values(PACKAGE_MANAGER_OPTIONS));

export const AuthSchema = yup.string().oneOf(Object.values(AUTH_OPTIONS));

export const ProjectConfigSchema = yup.object().shape({
  projectName: ProjectNameSchema,
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  frontend: yup.array().of(FrontendSchema),
  packageManager: PackageManagerSchema,
  auth: AuthSchema,
  addons: yup.array().of(yup.string().oneOf(Object.values(ADDON_OPTIONS))),
  git: yup.boolean(),
  install: yup.boolean(),
});

// Type definitions (using JSDoc for better IDE support)
/**
 * @typedef {Object} ProjectConfig
 * @property {string} projectName - Name of the project
 * @property {string} projectDir - Directory path for the project
 * @property {string} database - Database choice
 * @property {string} orm - ORM choice
 * @property {string} backend - Backend framework choice
 * @property {string[]} frontend - Frontend framework choices
 * @property {string} packageManager - Package manager choice
 * @property {string} auth - Authentication choice
 * @property {string[]} addons - Selected addons
 * @property {boolean} git - Initialize git repository
 * @property {boolean} install - Install dependencies
 */

/**
 * @typedef {Object} CLIOptions
 * @property {boolean} yes - Use default configuration
 * @property {boolean} verbose - Show detailed output
 * @property {string} database - Database option
 * @property {string} orm - ORM option
 * @property {string} backend - Backend framework option
 * @property {string[]} frontend - Frontend framework options
 * @property {string} packageManager - Package manager option
 * @property {string} auth - Authentication option
 * @property {string[]} addons - Addon options
 * @property {boolean} git - Initialize git
 * @property {boolean} install - Install dependencies
 */

export default {
  TECHNOLOGY_TYPES,
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
};
