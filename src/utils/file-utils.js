import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  const result = template(context);
  await fs.outputFile(outputPath, result);
}

/**
 * Copy and process templates
 */
export async function copyTemplates(templateDir, outputDir, context, options = {}) {
  const { exclude = [], processExtensions = ['.hbs', '.handlebars'] } = options;
  
  await fs.ensureDir(outputDir);
  const files = await fs.readdir(templateDir);
  
  for (const file of files) {
    if (exclude.includes(file)) continue;
    
    const srcPath = path.join(templateDir, file);
    const stat = await fs.stat(srcPath);
    
    if (stat.isDirectory()) {
      const destPath = path.join(outputDir, file);
      await copyTemplates(srcPath, destPath, context, options);
    } else {
      let destFile = file;
      let shouldProcess = false;
      
      // Check if file should be processed
      for (const ext of processExtensions) {
        if (file.endsWith(ext)) {
          destFile = file.slice(0, -ext.length);
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
  return path.join(__dirname, '../../templates');
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
  removeDir
};
