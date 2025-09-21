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
 * Process filename template with proper error handling
 */
function processFilenameTemplate(filename, context) {
  try {
    // Handle complex conditional patterns first
    if (filename.includes("{{#if") && filename.includes("{{else}}")) {
      const extension = context.typescript || context.useTypeScript ? "ts" : "js";
      
      // Match patterns like: {{#if useTypeScript}}ts{{else}}js{{/if}}
      const conditionalPattern = /\{\{#if\s+[^}]*\}\}[^{]*\{\{else\}\}[^{]*\{\{\/if\}\}/g;
      return filename.replace(conditionalPattern, extension);
    }
    
    // Handle simple variable substitution
    if (filename.includes("{{") && !filename.includes("{{#")) {
      const template = Handlebars.compile(filename);
      return template(context);
    }
    
    return filename;
  } catch (error) {
    console.warn(`Warning: Could not process filename template: ${filename}. Using fallback.`);
    
    // Fallback logic for common patterns
    if (filename.includes("middleware") || filename.includes("routes") || filename.includes("models")) {
      const extension = context.typescript || context.useTypeScript ? "ts" : "js";
      return filename.replace(/\{\{[^}]*\}\}/g, extension);
    }
    
    // Remove all template syntax as last resort
    return filename.replace(/\{\{[^}]*\}\}/g, "");
  }
}

/**
 * Get output filename from template filename
 */
function getOutputFilename(filename, context, processExtensions = [".hbs", ".handlebars"]) {
  let outputName = filename;
  
  // Process template syntax in filename
  if (filename.includes("{{")) {
    outputName = processFilenameTemplate(filename, context);
  }
  
  // Remove template extensions
  for (const ext of processExtensions) {
    if (outputName.endsWith(ext)) {
      outputName = outputName.slice(0, -ext.length);
      break;
    }
  }
  
  // Handle .hbs extension specifically
  if (outputName.endsWith(".hbs")) {
    outputName = outputName.slice(0, -4);
  }
  
  return outputName;
}

/**
 * Determine if file should be processed as template
 */
function shouldProcessAsTemplate(filename, processExtensions = [".hbs", ".handlebars"]) {
  return processExtensions.some(ext => filename.endsWith(ext)) || filename.endsWith(".hbs");
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

    // Skip language-specific alternates: prefer .ts.* when TypeScript, else .js.*
    const isTsTemplate = /\.ts\.(hbs|handlebars)$/.test(file) || /\.tsx\.(hbs|handlebars)$/.test(file);
    const isJsTemplate = /\.js\.(hbs|handlebars)$/.test(file) || /\.jsx\.(hbs|handlebars)$/.test(file);
    const wantsTs = Boolean(context.typescript || context.useTypeScript);
    if (isTsTemplate && !wantsTs) continue;
    if (isJsTemplate && wantsTs) continue;

    const srcPath = path.join(templateDir, file);
    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      const outputDirName = getOutputFilename(file, context, processExtensions);
      const destPath = path.join(outputDir, outputDirName);
      await copyTemplates(srcPath, destPath, context, options);
    } else {
      const outputFilename = getOutputFilename(file, context, processExtensions);
      const destPath = path.join(outputDir, outputFilename);
      const isTemplate = shouldProcessAsTemplate(file, processExtensions);

      if (isTemplate) {
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
  // Support both dev (cli) and build (dist) locations
  const candidates = [
    // When running from cli (development)
    path.join(__dirname, "../templates"),
    // When running from dist (published package)
    path.join(__dirname, "../../cli/templates"),
    // Fallback: project root when executed from elsewhere
    path.join(process.cwd(), "cli/templates"),
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