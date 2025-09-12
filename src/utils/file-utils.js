import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register Handlebars helpers
Handlebars.registerHelper("kebabCase", function (str) {
  return str
    ?.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
});

Handlebars.registerHelper("camelCase", function (str) {
  return str
    ?.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/^[A-Z]/, (g) => g.toLowerCase());
});

Handlebars.registerHelper("pascalCase", function (str) {
  return str?.replace(/(^|-)([a-z])/g, (g) => g.slice(-1).toUpperCase());
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("ne", function (a, b) {
  return a !== b;
});

Handlebars.registerHelper("or", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.some(Boolean);
});

Handlebars.registerHelper("and", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.every(Boolean);
});

Handlebars.registerHelper("includes", function (array, value) {
  return Array.isArray(array) && array.includes(value);
});

Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context, null, 2);
});

/**
 * Copy directory recursively
 */
export async function copyDirectory(src, dest, options = {}) {
  const { exclude = [] } = options;

  await fs.ensureDir(dest);
  const files = await fs.readdir(src);

  for (const file of files) {
    if (exclude.includes(file)) continue;

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath, options);
    } else {
      await fs.copy(srcPath, destPath);
    }
  }
}

/**
 * Process template files with Handlebars
 */
export async function processTemplate(templatePath, outputPath, context) {
  const templateContent = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateContent);
  const result = template(context);
  await fs.outputFile(outputPath, result);
}

/**
 * Copy and process templates
 */
export async function copyTemplates(
  templateDir,
  outputDir,
  context,
  options = {},
) {
  const { exclude = [], processExtensions = [".hbs", ".handlebars"] } = options;

  await fs.ensureDir(outputDir);
  const files = await fs.readdir(templateDir);

  for (const file of files) {
    if (exclude.includes(file)) continue;

    const srcPath = path.join(templateDir, file);
    const stat = await fs.stat(srcPath);

    // Process filename template if it contains Handlebars syntax
    let processedFile = file;
    if (file.includes("{{")) {
      const filenameTemplate = Handlebars.compile(file);
      processedFile = filenameTemplate(context);
    } else if (file.endsWith(".hbs")) {
      // Handle static template files that need dynamic output names
      const baseName = file.slice(0, -4); // Remove .hbs extension
      if (baseName.includes("middleware") || baseName.includes("routes")) {
        // Generate dynamic filename based on context
        const extension = context.typescript ? "ts" : "js";
        // Remove existing extension if present
        const nameWithoutExt = baseName.replace(/\.(js|ts)$/, "");
        processedFile = `${nameWithoutExt}.${extension}`;
      }
    }

    if (stat.isDirectory()) {
      const destPath = path.join(outputDir, processedFile);
      await copyTemplates(srcPath, destPath, context, options);
    } else {
      let destFile = processedFile;
      let shouldProcess = false;

      // Check if file should be processed
      for (const ext of processExtensions) {
        if (file.endsWith(ext)) {
          destFile = processedFile.slice(0, -ext.length);
          shouldProcess = true;
          break;
        }
      }

      const destPath = path.join(outputDir, destFile);

      if (shouldProcess) {
        await processTemplate(srcPath, destPath, context);
      } else {
        await fs.copy(srcPath, destPath);
      }
    }
  }
}

/**
 * Merge package.json files
 */
export async function mergePackageJson(targetPath, additions) {
  const targetJson = await fs.readJson(targetPath).catch(() => ({}));

  const merged = {
    ...targetJson,
    ...additions,
    scripts: {
      ...targetJson.scripts,
      ...additions.scripts,
    },
    dependencies: {
      ...targetJson.dependencies,
      ...additions.dependencies,
    },
    devDependencies: {
      ...targetJson.devDependencies,
      ...additions.devDependencies,
    },
  };

  // Sort dependencies
  if (merged.dependencies) {
    merged.dependencies = sortObject(merged.dependencies);
  }
  if (merged.devDependencies) {
    merged.devDependencies = sortObject(merged.devDependencies);
  }

  await fs.writeJson(targetPath, merged, { spaces: 2 });
}

/**
 * Sort object keys alphabetically
 */
function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {});
}

/**
 * Get template directory path
 */
export function getTemplateDir() {
  // Support both dev (src) and build (dist) locations
  const candidates = [
    // When running from src (development)
    path.join(__dirname, "../../templates"),
    // When running from dist (published package)
    path.join(__dirname, "../../../templates"),
    // Fallback: project root when executed from elsewhere
    path.join(process.cwd(), "templates"),
  ];

  for (const candidate of candidates) {
    try {
      const stat = fs.statSync(candidate);
      if (stat.isDirectory()) return candidate;
    } catch {
      // try next candidate
    }
  }

  // Last resort: return the first candidate (dev path)
  return candidates[0];
}

/**
 * Check if directory exists
 */
export async function directoryExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Create directory if it doesn't exist
 */
export async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}

/**
 * Read JSON file
 */
export async function readJson(filePath) {
  return fs.readJson(filePath);
}

/**
 * Write JSON file
 */
export async function writeJson(filePath, data, options = { spaces: 2 }) {
  await fs.writeJson(filePath, data, options);
}

/**
 * Write file with content
 */
export async function writeFile(filePath, content, options = {}) {
  await fs.writeFile(filePath, content, options);
}

/**
 * Remove directory
 */
export async function removeDir(dirPath) {
  await fs.remove(dirPath);
}

export default {
  copyDirectory,
  processTemplate,
  copyTemplates,
  mergePackageJson,
  getTemplateDir,
  directoryExists,
  ensureDir,
  readJson,
  writeJson,
  writeFile,
  removeDir,
};
