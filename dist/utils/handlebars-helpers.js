import Handlebars from "handlebars";
import path from "path";

// ============================================================================
// CASE CONVERSION HELPERS
// ============================================================================

const caseConverters = {
  camelCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  },

  pascalCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  },

  kebabCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  },

  snakeCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[-\s]+/g, "_")
      .toLowerCase();
  },

  constantCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[-\s]+/g, "_")
      .toUpperCase();
  },

  titleCase: (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  },
};

// Register case conversion helpers
Object.entries(caseConverters).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// ============================================================================
// COMPARISON HELPERS
// ============================================================================

const comparisonHelpers = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
};

Object.entries(comparisonHelpers).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// ============================================================================
// LOGICAL HELPERS
// ============================================================================

Handlebars.registerHelper("or", function () {
  const args = Array.from(arguments).slice(0, -1);
  return args.some(Boolean);
});

Handlebars.registerHelper("and", function () {
  const args = Array.from(arguments).slice(0, -1);
  return args.every(Boolean);
});

Handlebars.registerHelper("not", (value) => !value);

// ============================================================================
// STRING CHECKING HELPERS
// ============================================================================

const stringCheckHelpers = {
  includes: (array, value) => Array.isArray(array) && array.includes(value),
  contains: (str, substring) =>
    typeof str === "string" && str.includes(substring),
  startsWith: (str, prefix) =>
    typeof str === "string" && str.startsWith(prefix),
  endsWith: (str, suffix) => typeof str === "string" && str.endsWith(suffix),
};

Object.entries(stringCheckHelpers).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// ============================================================================
// SWITCH/CASE HELPERS
// ============================================================================

Handlebars.registerHelper("switch", function (value, options) {
  this._switch_value_ = value;
  this._switch_break_ = false;
  const html = options.fn(this);
  delete this._switch_value_;
  delete this._switch_break_;
  return html;
});

Handlebars.registerHelper("case", function (value, options) {
  if (value === this._switch_value_ && !this._switch_break_) {
    this._switch_break_ = true;
    return options.fn(this);
  }
  return "";
});

Handlebars.registerHelper("default", function (options) {
  if (!this._switch_break_) {
    return options.fn(this);
  }
  return "";
});

// ============================================================================
// FILE PATH HELPERS
// ============================================================================

const pathHelpers = {
  pathJoin: function () {
    const args = Array.from(arguments).slice(0, -1);
    return path.join(...args.filter(Boolean));
  },
  extname: (filepath) => path.extname(filepath),
  basename: (filepath, ext) => path.basename(filepath, ext),
  dirname: (filepath) => path.dirname(filepath),
};

Object.entries(pathHelpers).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

/**
 * Generate component file path based on framework
 */
Handlebars.registerHelper(
  "componentPath",
  function (componentName, framework, options = {}) {
    const extensions = {
      vue: "vue",
      angular: "ts",
    };

    const ext = extensions[framework] || (options.typescript ? "tsx" : "jsx");
    const dir = "components";

    return path.join(dir, `${componentName}.${ext}`);
  },
);

/**
 * Generate test file path
 */
Handlebars.registerHelper(
  "testPath",
  function (filename, testFramework = "jest") {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    const dir = path.dirname(filename);
    const testExt = testFramework === "vitest" ? "test" : "spec";

    return path.join(dir, "__tests__", `${base}.${testExt}${ext}`);
  },
);

/**
 * Generate config file path
 */
Handlebars.registerHelper("configPath", function (configName, format = "js") {
  const extensions = {
    js: "js",
    json: "json",
    yaml: "yml",
    typescript: "ts",
  };

  return `${configName}.config.${extensions[format] || "js"}`;
});

// ============================================================================
// PACKAGE.JSON HELPERS
// ============================================================================

/**
 * Convert dependency array to object
 */
function depsToObject(deps) {
  if (!Array.isArray(deps)) return {};

  return deps.reduce((acc, dep) => {
    if (typeof dep === "string") {
      acc[dep] = "^latest";
    } else if (dep && typeof dep === "object" && dep.name) {
      acc[dep.name] = dep.version || "^latest";
    }
    return acc;
  }, {});
}

Handlebars.registerHelper("dependencies", function (deps) {
  return JSON.stringify(depsToObject(deps), null, 2);
});

Handlebars.registerHelper("devDependencies", function (deps) {
  return JSON.stringify(depsToObject(deps), null, 2);
});

Handlebars.registerHelper("scripts", function (scripts) {
  if (!scripts || typeof scripts !== "object") return "{}";
  return JSON.stringify(scripts, null, 2);
});

// ============================================================================
// FRAMEWORK DEPENDENCIES
// ============================================================================

const FRAMEWORK_DEPS = {
  react: {
    dependencies: ["react", "react-dom"],
    devDependencies: ["@types/react", "@types/react-dom"],
  },
  vue: {
    dependencies: ["vue"],
    devDependencies: ["@vue/typescript"],
  },
  angular: {
    dependencies: [
      "@angular/core",
      "@angular/common",
      "@angular/platform-browser",
    ],
    devDependencies: ["@angular/cli", "@angular/compiler-cli"],
  },
  express: {
    dependencies: ["express"],
    devDependencies: ["@types/express"],
  },
  fastify: {
    dependencies: ["fastify"],
    devDependencies: [],
  },
  nextjs: {
    dependencies: ["next", "react", "react-dom"],
    devDependencies: ["@types/react", "@types/react-dom"],
  },
};

Handlebars.registerHelper(
  "frameworkDeps",
  function (framework, typescript = false) {
    const deps = FRAMEWORK_DEPS[framework?.toLowerCase()];

    if (!deps) {
      return { dependencies: [], devDependencies: [] };
    }

    return {
      dependencies: deps.dependencies,
      devDependencies: typescript ? deps.devDependencies : [],
    };
  },
);

// ============================================================================
// VERSION RESOLVER
// ============================================================================

const PACKAGE_VERSIONS = {
  // React ecosystem
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",

  // Vue ecosystem
  vue: "^3.3.0",
  "@vue/typescript": "^1.8.0",

  // Backend frameworks
  express: "^4.18.0",
  "@types/express": "^4.17.0",
  fastify: "^4.24.0",

  // Next.js
  next: "^14.0.0",

  // Build tools
  typescript: "^5.3.0",
  vite: "^5.0.0",

  // Testing
  jest: "^29.7.0",
  vitest: "^1.0.0",
  "@testing-library/react": "^14.0.0",

  // Linting
  eslint: "^8.54.0",
  prettier: "^3.1.0",
  biome: "^1.4.0",
};

Handlebars.registerHelper("resolveVersion", (packageName) => {
  return PACKAGE_VERSIONS[packageName] || "^latest";
});

// ============================================================================
// UTILITY HELPERS
// ============================================================================

Handlebars.registerHelper("json", (context, indent = 2) => {
  return JSON.stringify(context, null, indent);
});

Handlebars.registerHelper("length", (array) => {
  return Array.isArray(array) ? array.length : 0;
});

// ============================================================================
// MATH HELPERS
// ============================================================================

const mathHelpers = {
  add: (a, b) => +a + +b,
  subtract: (a, b) => +a - +b,
  multiply: (a, b) => +a * +b,
  divide: (a, b) => +a / +b,
};

Object.entries(mathHelpers).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// ============================================================================
// STRING MANIPULATION HELPERS
// ============================================================================

const stringHelpers = {
  uppercase: (str) => (typeof str === "string" ? str.toUpperCase() : str),
  lowercase: (str) => (typeof str === "string" ? str.toLowerCase() : str),
  capitalize: (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  trim: (str) => (typeof str === "string" ? str.trim() : str),
};

Object.entries(stringHelpers).forEach(([name, fn]) => {
  Handlebars.registerHelper(name, fn);
});

// ============================================================================
// DATE HELPERS
// ============================================================================

Handlebars.registerHelper("currentYear", () => new Date().getFullYear());

Handlebars.registerHelper("currentDate", (format = "YYYY-MM-DD") => {
  const now = new Date();

  if (format === "YYYY-MM-DD") {
    return now.toISOString().split("T")[0];
  }

  if (format === "ISO") {
    return now.toISOString();
  }

  // Default to ISO
  return now.toISOString();
});

Handlebars.registerHelper("timestamp", () => Date.now());

// ============================================================================
// EXPORTS
// ============================================================================

export { Handlebars };
export default Handlebars;
