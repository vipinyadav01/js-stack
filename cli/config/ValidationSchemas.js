import * as yup from "yup";

/**
 * Centralized validation schemas for JS Stack Generator
 * All Yup schemas are defined here for consistency and reusability
 */

// Technology option constants
export const TECHNOLOGY_OPTIONS = {
  DATABASE: {
    NONE: "none",
    SQLITE: "sqlite",
    POSTGRES: "postgres",
    MYSQL: "mysql",
    MONGODB: "mongodb",
    SUPABASE: "supabase",
    PLANETSCALE: "planetscale",
  },
  ORM: {
    NONE: "none",
    PRISMA: "prisma",
    SEQUELIZE: "sequelize",
    MONGOOSE: "mongoose",
    TYPEORM: "typeorm",
    DRIZZLE: "drizzle",
  },
  BACKEND: {
    NONE: "none",
    EXPRESS: "express",
    FASTIFY: "fastify",
    KOA: "koa",
    HAPI: "hapi",
    NESTJS: "nestjs",
    TRPC: "trpc",
    HONO: "hono",
  },
  FRONTEND: {
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
  },
  PACKAGE_MANAGER: {
    NPM: "npm",
    YARN: "yarn",
    PNPM: "pnpm",
    BUN: "bun",
  },
  AUTH: {
    NONE: "none",
    JWT: "jwt",
    PASSPORT: "passport",
    AUTH0: "auth0",
    OAUTH: "oauth",
    NEXTAUTH: "nextauth",
    SUPABASE: "supabase",
    LUCIA: "lucia",
    BETTER_AUTH: "better-auth",
  },
  ADDON: {
    ESLINT: "eslint",
    PRETTIER: "prettier",
    HUSKY: "husky",
    DOCKER: "docker",
    GITHUB_ACTIONS: "github-actions",
    TESTING: "testing",
    TAILWIND: "tailwind",
    SHADCN: "shadcn",
    STORYBOOK: "storybook",
    TYPESCRIPT: "typescript",
    BIOME: "biome",
    TURBOREPO: "turborepo",
    PWA: "pwa",
    TAURI: "tauri",
    PLAYWRIGHT: "playwright",
    CYPRESS: "cypress",
    VITEST: "vitest",
    JEST: "jest",
  },
  DEPLOYMENT: {
    NONE: "none",
    VERCEL: "vercel",
    NETLIFY: "netlify",
    CLOUDFLARE: "cloudflare",
    AWS: "aws",
    RAILWAY: "railway",
    RENDER: "render",
  },
};

// Base validation schemas
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
    const reservedNames = ["node_modules", "package", "npm", "yarn", "pnpm"];
    return !reservedNames.includes(value?.toLowerCase());
  });

export const DatabaseSchema = yup
  .string()
  .oneOf(Object.values(TECHNOLOGY_OPTIONS.DATABASE), "Invalid database option");

export const ORMSchema = yup
  .string()
  .oneOf(Object.values(TECHNOLOGY_OPTIONS.ORM), "Invalid ORM option");

export const BackendSchema = yup
  .string()
  .oneOf(Object.values(TECHNOLOGY_OPTIONS.BACKEND), "Invalid backend option");

export const FrontendSchema = yup
  .array()
  .of(
    yup
      .string()
      .oneOf(Object.values(TECHNOLOGY_OPTIONS.FRONTEND), "Invalid frontend option"),
  )
  .min(1, "At least one frontend framework must be selected")
  .test(
    "no-duplicates",
    "Duplicate frontend frameworks not allowed",
    (value) => {
      return value && new Set(value).size === value.length;
    },
  );

export const PackageManagerSchema = yup
  .string()
  .oneOf(
    Object.values(TECHNOLOGY_OPTIONS.PACKAGE_MANAGER),
    "Invalid package manager option",
  );

export const AuthSchema = yup
  .string()
  .oneOf(Object.values(TECHNOLOGY_OPTIONS.AUTH), "Invalid auth option");

export const AddonSchema = yup
  .array()
  .of(
    yup
      .string()
      .oneOf(Object.values(TECHNOLOGY_OPTIONS.ADDON), "Invalid addon option"),
  )
  .test(
    "no-duplicates",
    "Duplicate addons not allowed",
    (value) => {
      return value && new Set(value).size === value.length;
    },
  );

export const DeploymentSchema = yup
  .string()
  .oneOf(Object.values(TECHNOLOGY_OPTIONS.DEPLOYMENT), "Invalid deployment option");

// Main project configuration schema
export const ProjectConfigSchema = yup.object().shape({
  projectName: ProjectNameSchema,
  projectDir: yup.string().required("Project directory is required"),
  database: DatabaseSchema.required("Database selection is required"),
  orm: ORMSchema.required("ORM selection is required"),
  backend: BackendSchema.required("Backend selection is required"),
  frontend: FrontendSchema.required("Frontend selection is required"),
  packageManager: PackageManagerSchema.required("Package manager is required"),
  auth: AuthSchema.required("Authentication method is required"),
  addons: AddonSchema.default([]),
  deployment: DeploymentSchema.default("none"),
  git: yup.boolean().default(true),
  install: yup.boolean().default(true),
  typescript: yup.boolean().default(false),
  ci: yup.boolean().default(false),
});

// CLI options schema
export const CLIOptionsSchema = yup.object().shape({
  yes: yup.boolean().default(false),
  verbose: yup.boolean().default(false),
  dryRun: yup.boolean().default(false),
  interactive: yup.boolean().default(true),
  preset: yup.string(),
  template: yup.string(),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  frontend: yup.array().of(FrontendSchema),
  packageManager: PackageManagerSchema,
  auth: AuthSchema,
  addons: yup.array().of(yup.string()),
  pm: PackageManagerSchema, // Alias for packageManager
  typescript: yup.boolean(),
  git: yup.boolean(),
  install: yup.boolean(),
});

// Technology compatibility validation
export const TechnologyCompatibilitySchema = yup.object().shape({
  database: yup.object().shape({
    mongodb: yup.object().shape({
      compatibleORMs: yup.array().of(yup.string()),
      incompatibleORMs: yup.array().of(yup.string()),
    }),
    postgres: yup.object().shape({
      compatibleORMs: yup.array().of(yup.string()),
      incompatibleORMs: yup.array().of(yup.string()),
    }),
    sqlite: yup.object().shape({
      compatibleORMs: yup.array().of(yup.string()),
      incompatibleORMs: yup.array().of(yup.string()),
    }),
  }),
  frontend: yup.object().shape({
    react: yup.object().shape({
      compatibleBackends: yup.array().of(yup.string()),
      recommendedAddons: yup.array().of(yup.string()),
    }),
    nextjs: yup.object().shape({
      compatibleBackends: yup.array().of(yup.string()),
      recommendedAddons: yup.array().of(yup.string()),
    }),
  }),
});

// Validation helper functions
export class ValidationHelper {
  /**
   * Validate project configuration
   * @param {Object} config - Project configuration
   * @returns {Object} - Validation result
   */
  static async validateProjectConfig(config) {
    try {
      const validatedConfig = await ProjectConfigSchema.validate(config, {
        abortEarly: false,
        stripUnknown: true,
      });
      return {
        isValid: true,
        config: validatedConfig,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        isValid: false,
        config: null,
        errors: error.errors || [error.message],
        warnings: [],
      };
    }
  }

  /**
   * Validate CLI options
   * @param {Object} options - CLI options
   * @returns {Object} - Validation result
   */
  static async validateCLIOptions(options) {
    try {
      const validatedOptions = await CLIOptionsSchema.validate(options, {
        abortEarly: false,
        stripUnknown: true,
      });
      return {
        isValid: true,
        options: validatedOptions,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        isValid: false,
        options: null,
        errors: error.errors || [error.message],
        warnings: [],
      };
    }
  }

  /**
   * Validate technology compatibility
   * @param {Object} config - Project configuration
   * @returns {Object} - Compatibility validation result
   */
  static async validateCompatibility(config) {
    const warnings = [];
    const errors = [];

    // Database-ORM compatibility
    if (config.database === TECHNOLOGY_OPTIONS.DATABASE.MONGODB) {
      if (![TECHNOLOGY_OPTIONS.ORM.MONGOOSE].includes(config.orm)) {
        errors.push(
          `MongoDB is only compatible with Mongoose ORM. Selected: ${config.orm}`,
        );
      }
    }

    if ([TECHNOLOGY_OPTIONS.DATABASE.POSTGRES, TECHNOLOGY_OPTIONS.DATABASE.SQLITE].includes(config.database)) {
      if (![TECHNOLOGY_OPTIONS.ORM.PRISMA, TECHNOLOGY_OPTIONS.ORM.SEQUELIZE, TECHNOLOGY_OPTIONS.ORM.TYPEORM].includes(config.orm)) {
        errors.push(
          `${config.database} is not compatible with ${config.orm} ORM`,
        );
      }
    }

    // Frontend-Backend compatibility warnings
    if (config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS)) {
      if (config.backend !== TECHNOLOGY_OPTIONS.BACKEND.NONE) {
        warnings.push(
          "Next.js includes built-in API routes. Consider using 'none' for backend to avoid conflicts.",
        );
      }
    }

    // TypeScript recommendations
    if (config.addons.includes(TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT)) {
      if (config.frontend.includes(TECHNOLOGY_OPTIONS.FRONTEND.REACT)) {
        warnings.push(
          "TypeScript is recommended for React projects. Consider enabling it.",
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get validation summary
   * @param {Object} validationResult - Validation result
   * @returns {string} - Summary message
   */
  static getValidationSummary(validationResult) {
    if (validationResult.isValid) {
      return `✅ Configuration is valid${validationResult.warnings.length > 0 ? ` (${validationResult.warnings.length} warnings)` : ""}`;
    }
    return `❌ Configuration has ${validationResult.errors.length} error(s)`;
  }
}

// Export individual option constants for backward compatibility
export const DATABASE_OPTIONS = TECHNOLOGY_OPTIONS.DATABASE;
export const ORM_OPTIONS = TECHNOLOGY_OPTIONS.ORM;
export const BACKEND_OPTIONS = TECHNOLOGY_OPTIONS.BACKEND;
export const FRONTEND_OPTIONS = TECHNOLOGY_OPTIONS.FRONTEND;
export const PACKAGE_MANAGER_OPTIONS = TECHNOLOGY_OPTIONS.PACKAGE_MANAGER;
export const AUTH_OPTIONS = TECHNOLOGY_OPTIONS.AUTH;
export const ADDON_OPTIONS = TECHNOLOGY_OPTIONS.ADDON;
export const DEPLOYMENT_OPTIONS = TECHNOLOGY_OPTIONS.DEPLOYMENT;

export default {
  TECHNOLOGY_OPTIONS,
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
  DEPLOYMENT_OPTIONS,
  ProjectNameSchema,
  DatabaseSchema,
  ORMSchema,
  BackendSchema,
  FrontendSchema,
  PackageManagerSchema,
  AuthSchema,
  AddonSchema,
  DeploymentSchema,
  ProjectConfigSchema,
  CLIOptionsSchema,
  TechnologyCompatibilitySchema,
  ValidationHelper,
};
