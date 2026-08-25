/**
 * Template processor for Handlebars templates with JSX/TSX support
 */

import Handlebars from "handlebars";
import fs from "fs-extra";
import path from "path";
import { globby } from "globby";

// Register Handlebars helpers
function registerHelpers() {
  // Equality check
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  // Not equal
  Handlebars.registerHelper("ne", function (a, b) {
    return a !== b;
  });

  // Logical AND
  Handlebars.registerHelper("and", function (a, b) {
    return a && b;
  });

  // Logical OR
  Handlebars.registerHelper("or", function (a, b) {
    return a || b;
  });

  // Membership check that works for both arrays (e.g. addons) and single-select
  // string fields (e.g. frontend/backend), where substring matching lets a base
  // template treat "react" as present for "react", "react-router", etc.
  Handlebars.registerHelper("includes", function (collection, value) {
    if (Array.isArray(collection)) return collection.includes(value);
    if (typeof collection === "string") return collection.includes(value);
    return false;
  });

  // String concatenation
  Handlebars.registerHelper("concat", function (...args) {
    args.pop(); // Remove Handlebars options object
    return args.join("");
  });

  // Default value
  Handlebars.registerHelper("default", function (value, defaultValue) {
    return value != null ? value : defaultValue;
  });

  // Current year (used by scaffolded LICENSE files, etc.)
  Handlebars.registerHelper("currentYear", function () {
    return new Date().getFullYear();
  });
}

// Initialize helpers on module load
registerHelpers();

/**
 * Render a Handlebars template file to a string.
 */
async function renderTemplateToString(
  srcPath: string,
  context: Record<string, unknown>,
): Promise<string> {
  const templateContent = await fs.readFile(srcPath, "utf-8");
  const template = Handlebars.compile(templateContent);
  return template(context);
}

/**
 * Process a single template file with Handlebars
 * Handles JSX/TSX extensions: .jsx.hbs → .jsx, .tsx.hbs → .tsx
 */
export function processTemplate(
  srcPath: string,
  destPath: string,
  context: Record<string, unknown>,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Render template with context
      const rendered = await renderTemplateToString(srcPath, context);

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));

      // Write rendered content
      await fs.writeFile(destPath, rendered, "utf-8");

      resolve();
    } catch (error) {
      reject(
        new Error(
          `Failed to process template ${srcPath}: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });
}

/**
 * Parse JSON that may contain trailing commas (Handlebars conditional blocks in
 * the template package.json commonly leave a dangling comma before a closing
 * brace/bracket, which is invalid strict JSON).
 */
function parseLooseJson(content: string): Record<string, unknown> {
  const cleaned = content.replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(cleaned) as Record<string, unknown>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function sortObjectKeys(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

/**
 * Deep-merge two package.json objects. `incoming` (a later template layer) wins
 * on scalar conflicts, but `name`/`version` from the base layer are preserved,
 * and object maps (dependencies, devDependencies, scripts, …) are merged rather
 * than replaced. Dependency maps are alphabetically sorted for stable output.
 */
export function mergePackageJson(
  base: Record<string, unknown>,
  incoming: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  const depKeys = new Set([
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]);

  for (const [key, value] of Object.entries(incoming)) {
    // Preserve the project's identity from the base layer.
    if (
      (key === "name" || key === "version") &&
      out[key] != null &&
      out[key] !== ""
    ) {
      continue;
    }

    const current = out[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      const merged = { ...current, ...value };
      out[key] = depKeys.has(key) ? sortObjectKeys(merged) : merged;
    } else if (Array.isArray(value) && Array.isArray(current)) {
      out[key] = Array.from(new Set([...current, ...value]));
    } else {
      out[key] = value;
    }
  }

  return out;
}

/**
 * Write a package.json to `destPath`, deep-merging with any existing file so
 * that dependencies from every template layer (base + frontend + backend + db …)
 * are combined instead of the last layer overwriting the rest.
 * Falls back to writing the raw content if it can't be parsed as JSON.
 */
async function writePackageJson(
  destPath: string,
  incomingContent: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(destPath));

  let incoming: Record<string, unknown>;
  try {
    incoming = parseLooseJson(incomingContent);
  } catch {
    // Not parseable — preserve previous behaviour (write raw).
    await fs.writeFile(destPath, incomingContent, "utf-8");
    return;
  }

  if (await fs.pathExists(destPath)) {
    try {
      const existing = parseLooseJson(await fs.readFile(destPath, "utf-8"));
      incoming = mergePackageJson(existing, incoming);
    } catch {
      // Existing file unparseable — fall through and write the incoming one.
    }
  }

  await fs.writeFile(
    destPath,
    `${JSON.stringify(incoming, null, 2)}\n`,
    "utf-8",
  );
}

/**
 * Get output filename from template filename
 * Handles special cases:
 * - .jsx.hbs → .jsx
 * - .tsx.hbs → .tsx
 * - .hbs → remove extension
 * - _gitignore → .gitignore
 */
export function getOutputFilename(templatePath: string): string {
  const basename = path.basename(templatePath);

  // Handle JSX templates
  if (basename.endsWith(".jsx.hbs")) {
    return basename.replace(".jsx.hbs", ".jsx");
  }

  // Handle TSX templates
  if (basename.endsWith(".tsx.hbs")) {
    return basename.replace(".tsx.hbs", ".tsx");
  }

  // Handle regular Handlebars templates
  if (basename.endsWith(".hbs")) {
    return basename.slice(0, -4); // Remove .hbs
  }

  // Handle special files
  if (basename.startsWith("_")) {
    const specialName = basename.slice(1); // Remove leading underscore
    if (specialName === "gitignore") return ".gitignore";
    if (specialName === "npmrc") return ".npmrc";
    if (specialName === "env") return ".env";
    if (specialName === "env.example") return ".env.example";
  }

  return basename;
}

/**
 * Check if file is a template (has .hbs extension)
 */
export function isTemplate(filePath: string): boolean {
  return (
    filePath.endsWith(".hbs") ||
    filePath.endsWith(".jsx.hbs") ||
    filePath.endsWith(".tsx.hbs")
  );
}

/**
 * Check if file is binary (should be copied as-is)
 */
export function isBinary(filePath: string): boolean {
  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
  ];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.includes(ext);
}

/**
 * Process and copy files from template directory
 * Supports glob patterns and handles JSX/TSX templates
 */
export async function processAndCopyFiles(
  srcDir: string,
  destDir: string,
  context: Record<string, unknown>,
  pattern: string = "**/*",
): Promise<void> {
  try {
    // Ensure source directory exists
    if (!(await fs.pathExists(srcDir))) {
      throw new Error(`Template directory does not exist: ${srcDir}`);
    }

    // Find all files matching pattern
    const files = await globby(pattern, {
      cwd: srcDir,
      absolute: false,
      dot: true,
    });

    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const stat = await fs.stat(srcPath);

      // Skip directories (they'll be created as needed)
      if (stat.isDirectory()) {
        continue;
      }

      // Get output filename
      const outputFilename = getOutputFilename(file);
      const destPath = path.join(destDir, path.dirname(file), outputFilename);

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));

      // package.json is merged across template layers instead of overwritten,
      // so dependencies/scripts from base + frontend + backend + db all combine.
      if (outputFilename === "package.json") {
        const incomingContent = isTemplate(srcPath)
          ? await renderTemplateToString(srcPath, context)
          : await fs.readFile(srcPath, "utf-8");
        await writePackageJson(destPath, incomingContent);
        continue;
      }

      // Handle binary files
      if (isBinary(srcPath)) {
        await fs.copy(srcPath, destPath);
        continue;
      }

      // Handle template files
      if (isTemplate(srcPath)) {
        await processTemplate(srcPath, destPath, context);
        continue;
      }

      // Copy regular files as-is
      await fs.copy(srcPath, destPath);
    }
  } catch (error) {
    throw new Error(
      `Failed to process and copy files: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Copy a single file or directory
 */
export async function copyFileOrDir(
  src: string,
  dest: string,
  context?: Record<string, unknown>,
): Promise<void> {
  try {
    const stat = await fs.stat(src);

    if (stat.isDirectory()) {
      await processAndCopyFiles(src, dest, context || {});
    } else {
      const destDir = path.dirname(dest);
      await fs.ensureDir(destDir);

      if (isTemplate(src) && context) {
        await processTemplate(src, dest, context);
      } else if (isBinary(src)) {
        await fs.copy(src, dest);
      } else {
        await fs.copy(src, dest);
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to copy file or directory: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
