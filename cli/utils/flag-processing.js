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

const normalizeList = (value) => {
  if (!value) return [];
  const candidates = Array.isArray(value) ? value : [value];
  return candidates
    .flatMap((entry) =>
      typeof entry === "string" && entry.includes(",")
        ? entry.split(",")
        : entry,
    )
    .map((entry) =>
      typeof entry === "string" ? entry.trim().toLowerCase() : entry,
    )
    .filter(Boolean);
};

const uniq = (arr) => Array.from(new Set(arr));

const inferOrm = (database, explicitOrm) => {
  if (explicitOrm) {
    return explicitOrm;
  }
  return ORM_BY_DATABASE[database] || DEFAULT_STACK.orm;
};

const deriveFeatures = (config) => {
  const features = [];
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE) {
    features.push("auth");
  }
  if (config.addons.includes(ADDON_OPTIONS.TESTING)) {
    features.push("testing");
  }
  if (config.addons.includes(ADDON_OPTIONS.DOCKER)) {
    features.push("docker");
  }
  if (config.addons.includes(ADDON_OPTIONS.BIOME)) {
    features.push("biome");
  }
  if (config.addons.includes(ADDON_OPTIONS.TURBOREPO)) {
    features.push("turborepo");
  }
  return uniq(features);
};

const normalizePackageManager = (value) => {
  if (!value) return DEFAULT_STACK.packageManager;
  const normalized = value.toLowerCase();
  if (Object.values(PACKAGE_MANAGER_OPTIONS).includes(normalized)) {
    return normalized;
  }
  return DEFAULT_STACK.packageManager;
};

const normalizeDeployment = (value) => {
  if (!value) return DEFAULT_STACK.deployment;
  const normalized = value.toLowerCase();
  if (Object.values(DEPLOYMENT_OPTIONS).includes(normalized)) {
    return normalized;
  }
  return DEFAULT_STACK.deployment;
};

export const getProvidedFlags = (options = {}) => {
  return Object.entries(options).reduce((set, [key, value]) => {
    if (value !== undefined && key !== "command") {
      set.add(key);
    }
    return set;
  }, new Set());
};

export const processAndValidateFlags = async (
  options = {},
  providedFlags = new Set(),
  cliProjectName,
) => {
  const explicitFlags = providedFlags || new Set();
  const normalizedFrontend = normalizeList(options.frontend);
  if (explicitFlags.has("frontend") && normalizedFrontend.length === 0) {
    throw new Error("Frontend selection is required when using --frontend");
  }
  const frontend =
    normalizedFrontend.length > 0
      ? uniq(normalizedFrontend)
      : DEFAULT_STACK.frontend;

  const backend =
    options.backend && options.backend !== ""
      ? options.backend.toLowerCase()
      : DEFAULT_STACK.backend;

  const database =
    options.database && options.database !== ""
      ? options.database.toLowerCase()
      : DEFAULT_STACK.database;

  const auth =
    options.auth && options.auth !== ""
      ? options.auth.toLowerCase()
      : DEFAULT_STACK.auth;

  const addons = uniq(normalizeList(options.addons));

  const resolvedOrm = inferOrm(
    database,
    options.orm ? options.orm.toLowerCase() : undefined,
  );

  // Project name is always customizable, even with --yes flag
  // Priority: CLI argument > options.projectName > default
  const projectName =
    cliProjectName || options.projectName || DEFAULT_STACK.projectName;

  const packageManager = normalizePackageManager(options.packageManager);

  const deployment = normalizeDeployment(options.deployment);
  const install = options.yes ? true : options.install !== false;

  const config = {
    projectName,
    projectDir: path.resolve(process.cwd(), projectName),
    frontend,
    backend,
    database,
    orm: resolvedOrm,
    auth,
    addons,
    deployment,
    packageManager,
    git: options.git !== false,
    install,
    typescript: Boolean(options.typescript),
    ci: true,
  };

  config.features = deriveFeatures(config);
  if (options.testing) {
    config.testing = options.testing.toLowerCase();
  } else if (config.addons.includes(ADDON_OPTIONS.TESTING)) {
    config.testing = "vitest";
  }

  if (options.styling) {
    config.styling = options.styling.toLowerCase();
  }

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

  const compatibility = validateCompatibility(config);
  if (!compatibility.isValid) {
    const error = new Error("Configuration failed compatibility checks");
    error.details = compatibility.errors;
    throw error;
  }

  return config;
};

export default {
  processAndValidateFlags,
  getProvidedFlags,
};
