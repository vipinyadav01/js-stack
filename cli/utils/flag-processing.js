import { validateCompatibility } from "./validation.js";

// Only include flags that actually exist in this codebase
const CORE_STACK_FLAGS = new Set([
  "database",
  "orm",
  "backend",
  "frontend",
  "addons",
  "auth",
  "pm",
  "packageManager",
]);

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((v) => (typeof v === "string" && v.includes(",") ? v.split(",") : [v]))
      .map((s) => (typeof s === "string" ? s.trim() : s))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value.includes(",") ? value.split(",").map((s) => s.trim()).filter(Boolean) : [value];
  }
  return [];
}

function applyDefaultsForMissing(config) {
  const c = { ...config };
  if (!c.packageManager && c.pm) c.packageManager = c.pm;
  if (!c.packageManager) c.packageManager = "npm";
  if (!c.database) c.database = "none";
  if (!c.backend) c.backend = "none";
  if (!c.auth) c.auth = "none";
  if (!c.orm && c.database === "none") c.orm = "none";
  if (!c.frontend) c.frontend = [];
  if (!c.addons) c.addons = [];
  if (!c.projectName) c.projectName = "my-app";
  return c;
}

function validateCompatStrict(config) {
  const v = validateCompatibility(config);
  if (!v.isValid) {
    const first = v.errors[0];
    const msg = first?.message || "Invalid configuration";
    throw new Error(msg);
  }
}

export function processAndValidateFlags(options, providedFlags = new Set(), projectName) {
  // YOLO accepts everything; just normalize + defaults
  if (options?.yolo) {
    const cfg = {
      ...options,
      projectName: projectName || options.projectName || "my-app",
      packageManager: options.packageManager || options.pm,
      frontend: normalizeArray(options.frontend),
      addons: normalizeArray(options.addons),
      yes: Boolean(options.yes),
    };
    return applyDefaultsForMissing(cfg);
  }

  const isNonInteractive = Boolean(options?.yes);
  const base = {
    ...options,
    projectName: projectName || options.projectName || "my-app",
    packageManager: options.packageManager || options.pm,
    frontend: normalizeArray(options.frontend),
    addons: normalizeArray(options.addons),
    yes: isNonInteractive,
  };

  const config = isNonInteractive ? applyDefaultsForMissing(base) : base;

  // Fast sanity checks
  if (config.frontend.some((f) => !f)) {
    throw new Error("Invalid frontend options detected");
  }

  // Matrix validation
  validateCompatStrict(config);

  return config;
}

export function processProvidedFlagsWithoutValidation(options, projectName) {
  const cfg = {
    ...options,
    projectName: projectName || options.projectName || "my-app",
    packageManager: options.packageManager || options.pm,
    frontend: normalizeArray(options.frontend),
    addons: normalizeArray(options.addons),
    yes: Boolean(options.yes),
  };
  return applyDefaultsForMissing(cfg);
}

export function validateConfigCompatibility(config) {
  validateCompatStrict(config);
}

export function getProvidedFlags(options) {
  return new Set(
    Object.keys(options || {}).filter(
      (k) => options[k] !== undefined && options[k] !== null && options[k] !== false,
    ),
  );
}

export { CORE_STACK_FLAGS };


