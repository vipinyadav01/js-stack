#!/usr/bin/env node

/**
 * Template Validation Script
 * Checks template configuration and structure for issues
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { getTemplateDir } from "../utils/file-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issues = [];
const warnings = [];
const info = [];

/**
 * Check template directory structure
 */
function checkTemplateStructure(templateDir) {
  const requiredLayers = [
    "01-base",
    "02-frameworks",
    "03-integrations",
    "04-features",
    "05-tooling",
    "06-deployment",
  ];

  for (const layer of requiredLayers) {
    const layerPath = path.join(templateDir, layer);
    if (!fs.existsSync(layerPath)) {
      issues.push(`Missing required layer: ${layer}`);
    } else {
      info.push(`✓ Layer exists: ${layer}`);
    }
  }

  // Check framework directories
  const frameworksDir = path.join(templateDir, "02-frameworks");
  if (fs.existsSync(frameworksDir)) {
    const frontendDir = path.join(frameworksDir, "frontend");
    const backendDir = path.join(frameworksDir, "backend");

    if (fs.existsSync(frontendDir)) {
      const frontendFrameworks = fs.readdirSync(frontendDir);
      info.push(`Frontend frameworks: ${frontendFrameworks.join(", ")}`);
    }

    if (fs.existsSync(backendDir)) {
      const backendFrameworks = fs.readdirSync(backendDir);
      info.push(`Backend frameworks: ${backendFrameworks.join(", ")}`);
    }
  }
}

/**
 * Check for duplicate template files
 */
function checkDuplicateTemplates(templateDir) {
  const duplicates = new Map();

  function scanDirectory(dir, relativePath = "") {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const relativeFilePath = path.join(relativePath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath, relativeFilePath);
      } else {
        // Normalize filename (remove .hbs extension for comparison)
        const normalizedName = file.replace(/\.hbs$/, "").toLowerCase();

        if (!duplicates.has(normalizedName)) {
          duplicates.set(normalizedName, []);
        }
        duplicates.get(normalizedName).push(relativeFilePath);
      }
    }
  }

  scanDirectory(templateDir);

  // Find actual duplicates (same base name, different paths)
  for (const [name, paths] of duplicates.entries()) {
    if (paths.length > 1) {
      // Check if they're in the same directory (actual duplicates)
      const dirs = paths.map((p) => path.dirname(p));
      const uniqueDirs = [...new Set(dirs)];

      if (uniqueDirs.length === 1) {
        warnings.push(
          `Potential duplicate files in ${uniqueDirs[0]}: ${paths.join(", ")}`,
        );
      }
    }
  }
}

/**
 * Check for invalid template filenames
 */
function checkTemplateFilenames(templateDir) {
  const invalidPatterns = [];

  function scanDirectory(dir, relativePath = "") {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath, path.join(relativePath, file));
      } else {
        // Check for problematic patterns
        if (file.includes("{{#if") && file.includes("{{else}}")) {
          // This is a conditional filename - check if it's properly closed
          if (!file.includes("{{/if}}")) {
            issues.push(
              `Unclosed conditional in filename: ${path.join(relativePath, file)}`,
            );
          }
        }

        // Check for both typescript and useTypeScript conditionals (inconsistency)
        if (file.includes("typescript") && file.includes("useTypeScript")) {
          warnings.push(
            `Mixed conditional variables in filename: ${path.join(relativePath, file)} (uses both 'typescript' and 'useTypeScript')`,
          );
        }
      }
    }
  }

  scanDirectory(templateDir);
}

/**
 * Check template syntax
 */
async function checkTemplateSyntax(templateDir) {
  const syntaxErrors = [];

  async function scanDirectory(dir, relativePath = "") {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        await scanDirectory(filePath, path.join(relativePath, file));
      } else if (file.endsWith(".hbs")) {
        try {
          const content = await fs.readFile(filePath, "utf8");

          // Check for unclosed Handlebars blocks
          const openBlocks = (content.match(/\{\{#/g) || []).length;
          const closeBlocks = (content.match(/\{\{\//g) || []).length;

          if (openBlocks !== closeBlocks) {
            syntaxErrors.push(
              `Unclosed Handlebars block in: ${path.join(relativePath, file)} (${openBlocks} open, ${closeBlocks} close)`,
            );
          }

          // Check for common syntax errors
          if (content.includes("{{#if") && !content.includes("{{/if}}")) {
            syntaxErrors.push(
              `Missing closing {{/if}} in: ${path.join(relativePath, file)}`,
            );
          }
        } catch (error) {
          syntaxErrors.push(
            `Error reading template: ${path.join(relativePath, file)} - ${error.message}`,
          );
        }
      }
    }
  }

  await scanDirectory(templateDir);

  if (syntaxErrors.length > 0) {
    issues.push(...syntaxErrors);
  }
}

/**
 * Check for missing required templates
 */
function checkRequiredTemplates(templateDir) {
  const baseDir = path.join(templateDir, "01-base");
  const requiredBaseFiles = [
    "package.json.hbs",
    "README.md.hbs",
    "gitignore.hbs",
  ];

  if (fs.existsSync(baseDir)) {
    for (const requiredFile of requiredBaseFiles) {
      const filePath = path.join(baseDir, requiredFile);
      if (!fs.existsSync(filePath)) {
        warnings.push(`Missing recommended base template: ${requiredFile}`);
      } else {
        info.push(`✓ Base template exists: ${requiredFile}`);
      }
    }
  }
}

/**
 * Main validation function
 */
async function validateTemplates() {
  console.log("🔍 Validating template configuration...\n");

  const templateDir = getTemplateDir();

  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Template directory not found: ${templateDir}`);
    process.exit(1);
  }

  console.log(`📁 Template directory: ${templateDir}\n`);

  // Run all checks
  checkTemplateStructure(templateDir);
  checkDuplicateTemplates(templateDir);
  checkTemplateFilenames(templateDir);
  await checkTemplateSyntax(templateDir);
  checkRequiredTemplates(templateDir);

  // Print results
  console.log("📊 Validation Results:\n");

  if (info.length > 0) {
    console.log("ℹ️  Info:");
    info.forEach((msg) => console.log(`   ${msg}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach((msg) => console.log(`   ${msg}`));
    console.log();
  }

  if (issues.length > 0) {
    console.log("❌ Issues:");
    issues.forEach((msg) => console.log(`   ${msg}`));
    console.log();
  }

  // Summary
  console.log("📈 Summary:");
  console.log(`   ✓ Info: ${info.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   ❌ Issues: ${issues.length}`);

  if (issues.length === 0 && warnings.length === 0) {
    console.log("\n✅ All templates are properly configured!");
    process.exit(0);
  } else if (issues.length === 0) {
    console.log("\n⚠️  Templates have warnings but no critical issues.");
    process.exit(0);
  } else {
    console.log("\n❌ Templates have issues that need to be fixed.");
    process.exit(1);
  }
}

// Run validation
validateTemplates().catch((error) => {
  console.error("❌ Validation failed:", error);
  process.exit(1);
});
