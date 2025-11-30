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

  // Array includes
  Handlebars.registerHelper("includes", function (array, value) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
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
}

// Initialize helpers on module load
registerHelpers();

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
      // Read template content
      const templateContent = await fs.readFile(srcPath, "utf-8");

      // Compile template
      const template = Handlebars.compile(templateContent);

      // Render with context
      const rendered = template(context);

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
