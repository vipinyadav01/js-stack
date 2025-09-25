import Handlebars from "handlebars";
import path from "path";

/**
 * Enhanced Handlebars Helpers for JS Stack CLI
 * Provides comprehensive templating utilities for project generation
 */

// ============================================================================
// CASE CONVERSION HELPERS
// ============================================================================

/**
 * Convert string to camelCase
 * Examples: "hello-world" -> "helloWorld", "hello_world" -> "helloWorld"
 */
Handlebars.registerHelper("camelCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
});

/**
 * Convert string to PascalCase
 * Examples: "hello-world" -> "HelloWorld", "hello_world" -> "HelloWorld"
 */
Handlebars.registerHelper("pascalCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
});

/**
 * Convert string to kebab-case
 * Examples: "HelloWorld" -> "hello-world", "helloWorld" -> "hello-world"
 */
Handlebars.registerHelper("kebabCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
});

/**
 * Convert string to snake_case
 * Examples: "HelloWorld" -> "hello_world", "hello-world" -> "hello_world"
 */
Handlebars.registerHelper("snakeCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
});

/**
 * Convert string to CONSTANT_CASE
 * Examples: "hello-world" -> "HELLO_WORLD", "helloWorld" -> "HELLO_WORLD"
 */
Handlebars.registerHelper("constantCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toUpperCase();
});

/**
 * Convert string to Title Case
 * Examples: "hello-world" -> "Hello World", "helloWorld" -> "Hello World"
 */
Handlebars.registerHelper("titleCase", function (str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
});

// ============================================================================
// CONDITIONAL RENDERING HELPERS
// ============================================================================

/**
 * Enhanced equality check
 */
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

/**
 * Enhanced inequality check
 */
Handlebars.registerHelper("ne", function (a, b) {
  return a !== b;
});

/**
 * Greater than comparison
 */
Handlebars.registerHelper("gt", function (a, b) {
  return a > b;
});

/**
 * Greater than or equal comparison
 */
Handlebars.registerHelper("gte", function (a, b) {
  return a >= b;
});

/**
 * Less than comparison
 */
Handlebars.registerHelper("lt", function (a, b) {
  return a < b;
});

/**
 * Less than or equal comparison
 */
Handlebars.registerHelper("lte", function (a, b) {
  return a <= b;
});

/**
 * Logical OR with multiple arguments
 */
Handlebars.registerHelper("or", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.some(Boolean);
});

/**
 * Logical AND with multiple arguments
 */
Handlebars.registerHelper("and", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.every(Boolean);
});

/**
 * Logical NOT
 */
Handlebars.registerHelper("not", function (value) {
  return !value;
});

/**
 * Check if array includes value
 */
Handlebars.registerHelper("includes", function (array, value) {
  return Array.isArray(array) && array.includes(value);
});

/**
 * Check if string contains substring
 */
Handlebars.registerHelper("contains", function (str, substring) {
  return typeof str === "string" && str.includes(substring);
});

/**
 * Check if string starts with prefix
 */
Handlebars.registerHelper("startsWith", function (str, prefix) {
  return typeof str === "string" && str.startsWith(prefix);
});

/**
 * Check if string ends with suffix
 */
Handlebars.registerHelper("endsWith", function (str, suffix) {
  return typeof str === "string" && str.endsWith(suffix);
});

/**
 * Switch/case helper for complex conditionals
 */
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
});

Handlebars.registerHelper("default", function (options) {
  if (!this._switch_break_) {
    return options.fn(this);
  }
});

// ============================================================================
// FILE PATH GENERATION HELPERS
// ============================================================================

/**
 * Join path segments
 */
Handlebars.registerHelper("pathJoin", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return path.join(...args.filter(Boolean));
});

/**
 * Get file extension from path
 */
Handlebars.registerHelper("extname", function (filepath) {
  return path.extname(filepath);
});

/**
 * Get basename from path
 */
Handlebars.registerHelper("basename", function (filepath, ext) {
  return path.basename(filepath, ext);
});

/**
 * Get dirname from path
 */
Handlebars.registerHelper("dirname", function (filepath) {
  return path.dirname(filepath);
});

/**
 * Generate component file path based on framework
 */
Handlebars.registerHelper(
  "componentPath",
  function (componentName, framework, options = {}) {
    const ext =
      framework === "vue"
        ? "vue"
        : framework === "angular"
          ? "ts"
          : options.typescript
            ? "tsx"
            : "jsx";

    const dir = framework === "angular" ? "components" : "components";
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
 * Generate config file path based on format
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
// PACKAGE.JSON DEPENDENCY INJECTION HELPERS
// ============================================================================

/**
 * Generate dependency object for package.json
 */
Handlebars.registerHelper("dependencies", function (deps) {
  if (!Array.isArray(deps)) return "{}";

  const depsObj = {};
  deps.forEach((dep) => {
    if (typeof dep === "string") {
      // Default to latest if no version specified
      depsObj[dep] = "^latest";
    } else if (dep && typeof dep === "object") {
      depsObj[dep.name] = dep.version || "^latest";
    }
  });

  return JSON.stringify(depsObj, null, 2);
});

/**
 * Generate dev dependency object
 */
Handlebars.registerHelper("devDependencies", function (deps) {
  if (!Array.isArray(deps)) return "{}";

  const depsObj = {};
  deps.forEach((dep) => {
    if (typeof dep === "string") {
      depsObj[dep] = "^latest";
    } else if (dep && typeof dep === "object") {
      depsObj[dep.name] = dep.version || "^latest";
    }
  });

  return JSON.stringify(depsObj, null, 2);
});

/**
 * Generate scripts object for package.json
 */
Handlebars.registerHelper("scripts", function (scripts) {
  if (!scripts || typeof scripts !== "object") return "{}";
  return JSON.stringify(scripts, null, 2);
});

/**
 * Add framework-specific dependencies
 */
Handlebars.registerHelper(
  "frameworkDeps",
  function (framework, typescript = false) {
    const deps = {
      react: {
        dependencies: ["react", "react-dom"],
        devDependencies: typescript ? ["@types/react", "@types/react-dom"] : [],
      },
      vue: {
        dependencies: ["vue"],
        devDependencies: typescript ? ["@vue/typescript"] : [],
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
        devDependencies: typescript ? ["@types/express"] : [],
      },
      fastify: {
        dependencies: ["fastify"],
        devDependencies: [],
      },
      nextjs: {
        dependencies: ["next", "react", "react-dom"],
        devDependencies: typescript ? ["@types/react", "@types/react-dom"] : [],
      },
    };

    return (
      deps[framework.toLowerCase()] || { dependencies: [], devDependencies: [] }
    );
  },
);

/**
 * Version resolver for popular packages
 */
Handlebars.registerHelper("resolveVersion", function (packageName) {
  const versions = {
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    vue: "^3.0.0",
    express: "^4.18.0",
    fastify: "^4.0.0",
    next: "^14.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/express": "^4.17.0",
    typescript: "^5.0.0",
    vite: "^5.0.0",
    jest: "^29.0.0",
    vitest: "^1.0.0",
    eslint: "^8.0.0",
    prettier: "^3.0.0",
  };

  return versions[packageName] || "^latest";
});

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * JSON stringify with proper formatting
 */
Handlebars.registerHelper("json", function (context, indent = 2) {
  return JSON.stringify(context, null, indent);
});

/**
 * Array length helper
 */
Handlebars.registerHelper("length", function (array) {
  return Array.isArray(array) ? array.length : 0;
});

/**
 * Math operations
 */
Handlebars.registerHelper("add", function (a, b) {
  return +a + +b;
});

Handlebars.registerHelper("subtract", function (a, b) {
  return +a - +b;
});

Handlebars.registerHelper("multiply", function (a, b) {
  return +a * +b;
});

Handlebars.registerHelper("divide", function (a, b) {
  return +a / +b;
});

/**
 * String manipulation helpers
 */
Handlebars.registerHelper("uppercase", function (str) {
  return typeof str === "string" ? str.toUpperCase() : str;
});

Handlebars.registerHelper("lowercase", function (str) {
  return typeof str === "string" ? str.toLowerCase() : str;
});

Handlebars.registerHelper("capitalize", function (str) {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper("trim", function (str) {
  return typeof str === "string" ? str.trim() : str;
});

/**
 * Date helpers
 */
Handlebars.registerHelper("currentYear", function () {
  return new Date().getFullYear();
});

Handlebars.registerHelper("currentDate", function (format = "YYYY-MM-DD") {
  const now = new Date();
  if (format === "YYYY-MM-DD") {
    return now.toISOString().split("T")[0];
  }
  return now.toISOString();
});

// Export for potential external use
export { Handlebars };
