// Re-export technology options from centralized config
export {
  TECHNOLOGY_OPTIONS,
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "./config/ValidationSchemas.js";

// Technology Categories
export const TECHNOLOGY_TYPES = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  DATABASE: "database",
  ORM: "orm",
  AUTH: "auth",
  ADDON: "addon",
};

// Re-export validation schemas from centralized config
export {
  ProjectNameSchema,
  DatabaseSchema,
  ORMSchema,
  BackendSchema,
  FrontendSchema,
  PackageManagerSchema,
  AuthSchema,
  ProjectConfigSchema,
  CLIOptionsSchema,
  TechnologyCompatibilitySchema,
  ValidationHelper,
} from "./config/ValidationSchemas.js";

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
};
