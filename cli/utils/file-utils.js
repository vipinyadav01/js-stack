import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "handlebars";
// Import comprehensive Handlebars helpers
import "./handlebars-helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Copy directory recursively with error handling
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 * @param {Object} options - Options object
 * @param {string[]} options.exclude - Files/directories to exclude
 * @returns {Promise<void>}
 */
export async function copyDirectory(src, dest, options = {}) {
  const { exclude = [] } = options;

  try {
    await fs.ensureDir(dest);
    const files = await fs.readdir(src);

    for (const file of files) {
      if (exclude.includes(file)) continue;

      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      try {
        const stat = await fs.stat(srcPath);

        if (stat.isDirectory()) {
          await copyDirectory(srcPath, destPath, options);
        } else {
          await fs.copy(srcPath, destPath);
        }
      } catch (error) {
        console.warn(`Warning: Could not copy ${srcPath}: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to copy directory from ${src} to ${dest}: ${error.message}`,
    );
  }
}

/**
 * Process template files with Handlebars
 * @param {string} templatePath - Path to template file
 * @param {string} outputPath - Path to output file
 * @param {Object} context - Template context/variables
 * @returns {Promise<void>}
 */
export async function processTemplate(templatePath, outputPath, context) {
  try {
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    const result = template(context || {});
    await fs.outputFile(outputPath, result);
  } catch (error) {
    throw new Error(
      `Failed to process template ${templatePath} to ${outputPath}: ${error.message}`,
    );
  }
}

/**
 * Process filename template with proper error handling
 * @param {string} filename - Template filename
 * @param {Object} context - Template context
 * @returns {string} Processed filename
 */
function processFilenameTemplate(filename, context = {}) {
  try {
    // Handle complex conditional patterns first
    if (filename.includes("{{#if") && filename.includes("{{else}}")) {
      // Check if we need jsx (React components) or js (regular files)
      // Note: We only generate .jsx/.js files, not .tsx/.ts
      const isReactFile = filename.includes("jsx") || filename.includes("tsx");
      const extension = isReactFile ? "jsx" : "js";

      // Match patterns like: {{#if useTypeScript}}ts{{else}}js{{/if}}
      // Also handle: {{#if typescript}}ts{{else}}js{{/if}}
      // And: {{#if typescript}}tsx{{else}}jsx{{/if}}
      // Always use jsx/js since we don't generate TypeScript files
      const conditionalPattern =
        /\{\{#if\s+(?:useTypeScript|typescript)\s*\}\}[^{]*\{\{else\}\}[^{]*\{\{\/if\}\}/g;
      return filename.replace(conditionalPattern, extension);
    }

    // Handle simple variable substitution
    if (filename.includes("{{") && !filename.includes("{{#")) {
      const template = Handlebars.compile(filename);
      return template(context);
    }

    return filename;
  } catch (error) {
    console.warn(
      `Warning: Could not process filename template: ${filename}. Using fallback. Error: ${error.message}`,
    );

    // Fallback logic for common patterns
    if (
      filename.includes("middleware") ||
      filename.includes("routes") ||
      filename.includes("models") ||
      filename.includes("utils") ||
      filename.includes("config")
    ) {
      // Always use .js extension (no TypeScript)
      const extension = "js";
      return filename.replace(/\{\{[^}]*\}\}/g, extension);
    }

    // Remove all template syntax as last resort
    return filename.replace(/\{\{[^}]*\}\}/g, "");
  }
}

/**
 * Get output filename from template filename
 * @param {string} filename - Template filename
 * @param {Object} context - Template context
 * @param {string[]} processExtensions - Extensions to remove
 * @returns {string} Output filename
 */
function getOutputFilename(
  filename,
  context = {},
  processExtensions = [".hbs", ".handlebars"],
) {
  let outputName = filename;

  // Process template syntax in filename
  if (filename.includes("{{")) {
    outputName = processFilenameTemplate(filename, context);
  }

  // Remove template extensions (check longest first to avoid partial matches)
  const sortedExtensions = [...processExtensions].sort(
    (a, b) => b.length - a.length,
  );
  for (const ext of sortedExtensions) {
    if (outputName.endsWith(ext)) {
      outputName = outputName.slice(0, -ext.length);
      break;
    }
  }

  return outputName;
}

/**
 * Determine if file should be processed as template
 * @param {string} filename - Filename to check
 * @param {string[]} processExtensions - Template extensions
 * @returns {boolean}
 */
function shouldProcessAsTemplate(
  filename,
  processExtensions = [".hbs", ".handlebars"],
) {
  return processExtensions.some((ext) => filename.endsWith(ext));
}

/**
 * Copy and process templates recursively
 * @param {string} templateDir - Source template directory
 * @param {string} outputDir - Output directory
 * @param {Object} context - Template context/variables
 * @param {Object} options - Processing options
 * @param {string[]} options.exclude - Files/directories to exclude
 * @param {string[]} options.processExtensions - Template file extensions
 * @returns {Promise<void>}
 */
export async function copyTemplates(
  templateDir,
  outputDir,
  context = {},
  options = {},
) {
  const { exclude = [], processExtensions = [".hbs", ".handlebars"] } = options;

  try {
    await fs.ensureDir(outputDir);
    const files = await fs.readdir(templateDir);

    for (const file of files) {
      if (exclude.includes(file)) continue;

      // Skip TypeScript templates (we only generate JavaScript files)
      const isTsTemplate =
        /\.ts\.(hbs|handlebars)$/i.test(file) ||
        /\.tsx\.(hbs|handlebars)$/i.test(file);

      // Always skip TypeScript templates since we only generate .js/.jsx files
      if (isTsTemplate) continue;

      const srcPath = path.join(templateDir, file);

      try {
        const stat = await fs.stat(srcPath);

        if (stat.isDirectory()) {
          const outputDirName = getOutputFilename(
            file,
            context,
            processExtensions,
          );
          const destPath = path.join(outputDir, outputDirName);
          await copyTemplates(srcPath, destPath, context, options);
        } else {
          const outputFilename = getOutputFilename(
            file,
            context,
            processExtensions,
          );
          const destPath = path.join(outputDir, outputFilename);
          const isTemplate = shouldProcessAsTemplate(file, processExtensions);

          if (isTemplate) {
            await processTemplate(srcPath, destPath, context);
          } else {
            await fs.copy(srcPath, destPath);
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not process ${srcPath}: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to copy templates from ${templateDir} to ${outputDir}: ${error.message}`,
    );
  }
}

/**
 * Merge package.json files with proper handling of nested objects
 * @param {string} targetPath - Path to target package.json
 * @param {Object} additions - Package.json additions
 * @returns {Promise<void>}
 */
export async function mergePackageJson(targetPath, additions = {}) {
  try {
    const targetJson = await fs.readJson(targetPath).catch(() => ({}));

    const merged = {
      ...targetJson,
      ...additions,
      scripts: {
        ...(targetJson.scripts || {}),
        ...(additions.scripts || {}),
      },
      dependencies: {
        ...(targetJson.dependencies || {}),
        ...(additions.dependencies || {}),
      },
      devDependencies: {
        ...(targetJson.devDependencies || {}),
        ...(additions.devDependencies || {}),
      },
      peerDependencies: {
        ...(targetJson.peerDependencies || {}),
        ...(additions.peerDependencies || {}),
      },
      optionalDependencies: {
        ...(targetJson.optionalDependencies || {}),
        ...(additions.optionalDependencies || {}),
      },
    };

    // Sort dependencies for consistency
    if (merged.dependencies && Object.keys(merged.dependencies).length > 0) {
      merged.dependencies = sortObject(merged.dependencies);
    }
    if (
      merged.devDependencies &&
      Object.keys(merged.devDependencies).length > 0
    ) {
      merged.devDependencies = sortObject(merged.devDependencies);
    }
    if (
      merged.peerDependencies &&
      Object.keys(merged.peerDependencies).length > 0
    ) {
      merged.peerDependencies = sortObject(merged.peerDependencies);
    }

    await fs.writeJson(targetPath, merged, { spaces: 2 });
  } catch (error) {
    throw new Error(
      `Failed to merge package.json at ${targetPath}: ${error.message}`,
    );
  }
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
 * Get template directory path with multiple fallback locations
 * @returns {string} Path to templates directory
 */
export function getTemplateDir() {
  // Support both dev (cli) and build (dist) locations
  const candidates = [
    // When running from cli (development)
    path.join(__dirname, "../templates/templates"),
    // When running from dist (published package)
    path.join(__dirname, "../../cli/templates/templates"),
    // Fallback: project root when executed from elsewhere
    path.join(process.cwd(), "cli/templates/templates"),
    // Additional fallback: node_modules location
    path.join(
      process.cwd(),
      "node_modules",
      "create-js-stack",
      "cli",
      "templates",
      "templates",
    ),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const stat = fs.statSync(candidate);
        if (stat.isDirectory()) {
          return candidate;
        }
      }
    } catch {
      // Try next candidate
      continue;
    }
  }

  // Last resort: return the first candidate (dev path)
  // This allows the caller to handle the error if it doesn't exist
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
 * Read JSON file with error handling
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function readJson(filePath) {
  try {
    return await fs.readJson(filePath);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Write JSON file with error handling
 * @param {string} filePath - Path to output file
 * @param {Object} data - Data to write
 * @param {Object} options - Write options
 * @returns {Promise<void>}
 */
export async function writeJson(filePath, data, options = { spaces: 2 }) {
  try {
    await fs.writeJson(filePath, data, options);
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Write file with content and error handling
 * @param {string} filePath - Path to output file
 * @param {string|Buffer} content - Content to write
 * @param {Object} options - Write options
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content, options = {}) {
  try {
    await fs.writeFile(filePath, content, options);
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

/**
 * Remove directory with error handling
 * @param {string} dirPath - Directory path to remove
 * @returns {Promise<void>}
 */
export async function removeDir(dirPath) {
  try {
    await fs.remove(dirPath);
  } catch (error) {
    throw new Error(`Failed to remove directory ${dirPath}: ${error.message}`);
  }
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
