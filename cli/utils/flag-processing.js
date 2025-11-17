import path from "path";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
  DEPLOYMENT_OPTIONS,
  ProjectConfigSchema,
} from "../config/ValidationSchemas.js";
import { validateCompatibility } from "./validation.js";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_STACK = {
  projectName: "js-stack-app",
  frontend: [FRONTEND_OPTIONS.REACT],
  backend: BACKEND_OPTIONS.EXPRESS,
  database: DATABASE_OPTIONS.POSTGRES,
  orm: ORM_OPTIONS.PRISMA,
  auth: AUTH_OPTIONS.JWT,
  addons: [],
  deployment: DEPLOYMENT_OPTIONS.NONE,
  packageManager: PACKAGE_MANAGER_OPTIONS.NPM,
};

const ORM_BY_DATABASE = {
  [DATABASE_OPTIONS.POSTGRES]: ORM_OPTIONS.PRISMA,
  [DATABASE_OPTIONS.MYSQL]: ORM_OPTIONS.PRISMA,
  [DATABASE_OPTIONS.SQLITE]: ORM_OPTIONS.PRISMA,
  [DATABASE_OPTIONS.MONGODB]: ORM_OPTIONS.MONGOOSE,
  [DATABASE_OPTIONS.NONE]: ORM_OPTIONS.NONE,
};

const FEATURE_MAPPING = {
  [AUTH_OPTIONS.NONE]: null,
  auth: "auth",
  [ADDON_OPTIONS.TESTING]: "testing",
  [ADDON_OPTIONS.DOCKER]: "docker",
  [ADDON_OPTIONS.BIOME]: "biome",
  [ADDON_OPTIONS.TURBOREPO]: "turborepo",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize comma-separated or array values to lowercase trimmed array
 */
function normalizeList(value) {
  if (!value) return [];

  const candidates = Array.isArray(value) ? value : [value];

  return candidates
    .flatMap((entry) => {
      if (typeof entry === "string" && entry.includes(",")) {
        return entry.split(",");
      }
      return entry;
    })
    .map((entry) =>
      typeof entry === "string" ? entry.trim().toLowerCase() : entry,
    )
    .filter(Boolean);
}

/**
 * Get unique values from array
 */
function unique(arr) {
  return Array.from(new Set(arr));
}

/**
 * Infer ORM based on database choice
 */
function inferOrm(database, explicitOrm) {
  if (explicitOrm) return explicitOrm;
  return ORM_BY_DATABASE[database] || DEFAULT_STACK.orm;
}

/**
 * Derive features from configuration
 */
function deriveFeatures(config) {
  const features = [];

  // Check auth
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE) {
    features.push("auth");
  }

  // Check addons
  const addonFeatures = [
    { addon: ADDON_OPTIONS.TESTING, feature: "testing" },
    { addon: ADDON_OPTIONS.DOCKER, feature: "docker" },
    { addon: ADDON_OPTIONS.BIOME, feature: "biome" },
    { addon: ADDON_OPTIONS.TURBOREPO, feature: "turborepo" },
  ];

  addonFeatures.forEach(({ addon, feature }) => {
    if (config.addons.includes(addon)) {
      features.push(feature);
    }
  });

  return unique(features);
}

/**
 * Normalize package manager value
 */
function normalizePackageManager(value) {
  if (!value) return DEFAULT_STACK.packageManager;

  const normalized = value.toLowerCase();
  const validOptions = Object.values(PACKAGE_MANAGER_OPTIONS);

  return validOptions.includes(normalized)
    ? normalized
    : DEFAULT_STACK.packageManager;
}

/**
 * Normalize deployment value
 */
function normalizeDeployment(value) {
  if (!value) return DEFAULT_STACK.deployment;

  const normalized = value.toLowerCase();
  const validOptions = Object.values(DEPLOYMENT_OPTIONS);

  return validOptions.includes(normalized)
    ? normalized
    : DEFAULT_STACK.deployment;
}

/**
 * Normalize option value to lowercase if string
 */
function normalizeOption(value, defaultValue) {
  if (!value || value === "") return defaultValue;
  return typeof value === "string" ? value.toLowerCase() : value;
}

// ============================================================================
// FLAG PROCESSING
// ============================================================================

/**
 * Get set of provided flags from options
 */
export function getProvidedFlags(options = {}) {
  return Object.entries(options).reduce((set, [key, value]) => {
    if (value !== undefined && key !== "command") {
      set.add(key);
    }
    return set;
  }, new Set());
}

/**
 * Process and validate CLI flags
 * @param {Object} options - CLI options
 * @param {Set} providedFlags - Set of provided flag names
 * @param {string} cliProjectName - Project name from CLI argument
 * @returns {Object} Validated configuration
 */
export async function processAndValidateFlags(
  options = {},
  providedFlags = new Set(),
  cliProjectName,
) {
  const config = buildConfiguration(options, providedFlags, cliProjectName);

  await validateConfiguration(config);

  return config;
}

/**
 * Build configuration from options
 */
function buildConfiguration(options, providedFlags, cliProjectName) {
  // Process frontend
  const normalizedFrontend = normalizeList(options.frontend);

  if (providedFlags.has("frontend") && normalizedFrontend.length === 0) {
    throw new Error("Frontend selection is required when using --frontend");
  }

  const frontend =
    normalizedFrontend.length > 0
      ? unique(normalizedFrontend)
      : DEFAULT_STACK.frontend;

  // Process other options
  const backend = normalizeOption(options.backend, DEFAULT_STACK.backend);
  const database = normalizeOption(options.database, DEFAULT_STACK.database);
  const auth = normalizeOption(options.auth, DEFAULT_STACK.auth);
  const addons = unique(normalizeList(options.addons));
  const orm = inferOrm(
    database,
    options.orm ? options.orm.toLowerCase() : undefined,
  );

  // Project name priority: CLI argument > options.projectName > default
  const projectName =
    cliProjectName || options.projectName || DEFAULT_STACK.projectName;

  const packageManager = normalizePackageManager(options.packageManager);
  const deployment = normalizeDeployment(options.deployment);
  const install = options.yes ? true : options.install !== false;

  // Build base config
  const config = {
    projectName,
    projectDir: path.resolve(process.cwd(), projectName),
    frontend,
    backend,
    database,
    orm,
    auth,
    addons,
    deployment,
    packageManager,
    git: options.git !== false,
    install,
    typescript: Boolean(options.typescript),
    ci: true,
  };

  // Derive features
  config.features = deriveFeatures(config);

  // Handle testing option
  if (options.testing) {
    config.testing = options.testing.toLowerCase();
  } else if (addons.includes(ADDON_OPTIONS.TESTING)) {
    config.testing = "vitest";
  }

  // Handle styling option
  if (options.styling) {
    config.styling = options.styling.toLowerCase();
  }

  return config;
}

/**
 * Validate configuration against schema and compatibility rules
 */
async function validateConfiguration(config) {
  // Schema validation
  try {
    await ProjectConfigSchema.validate(config, {
      abortEarly: false,
      stripUnknown: false,
    });
  } catch (error) {
    const validationError = new Error("Invalid CLI flag combination");
    validationError.details = error.errors || [error.message];
    throw validationError;
  }

  // Compatibility validation
  const compatibility = validateCompatibility(config);

  if (!compatibility.isValid) {
    const error = new Error("Configuration failed compatibility checks");
    error.details = compatibility.errors;
    error.warnings = compatibility.warnings;
    throw error;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  processAndValidateFlags,
  getProvidedFlags,
};
