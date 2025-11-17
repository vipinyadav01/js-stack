import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import { glob } from "glob";
import { execSync } from "child_process";
import "./handlebars-helpers.js";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS = {
  templateExtensions: [".hbs", ".handlebars"],
  ignoredFiles: [".DS_Store", "Thumbs.db", ".gitkeep"],
  preservePermissions: true,
  createParentDirs: true,
  overwriteExisting: false,
  dryRun: false,
  verbose: false,
};

const TEMPLATE_PATTERNS = {
  typescript: /\.(ts|tsx)\.(hbs|handlebars)$/,
  javascript: /\.(js|jsx)\.(hbs|handlebars)$/,
};

// ============================================================================
// TEMPLATE ENGINE
// ============================================================================

/**
 * Advanced template engine for processing Handlebars templates
 * Handles variable substitution, conditional rendering, and directory structure generation
 */
export class TemplateEngine {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.reset();
  }

  /**
   * Reset engine state
   */
  reset() {
    this.generatedFiles = [];
    this.skippedFiles = [];
    this.errors = [];
  }

  /**
   * Process templates from source to destination
   * @param {string} templateDir - Source template directory
   * @param {string} outputDir - Destination directory
   * @param {Object} context - Template context variables
   * @param {Object} options - Processing options
   * @returns {Object} Processing report
   */
  async processTemplates(templateDir, outputDir, context = {}, options = {}) {
    const config = { ...this.options, ...options };

    try {
      this.validateInputs(templateDir, outputDir, context);

      if (!config.dryRun) {
        await fs.ensureDir(outputDir);
      }

      const files = await this.getAllFiles(templateDir);

      for (const file of files) {
        await this.processFile(file, templateDir, outputDir, context, config);
      }

      return this.generateReport();
    } catch (error) {
      this.errors.push({
        type: "PROCESS_ERROR",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Process a single file
   */
  async processFile(sourceFile, templateDir, outputDir, context, config) {
    try {
      const relativePath = path.relative(templateDir, sourceFile);

      // Skip ignored files
      if (this.shouldIgnoreFile(relativePath, config)) {
        this.skippedFiles.push({ path: relativePath, reason: "ignored" });
        return;
      }

      // Skip language-specific alternates
      if (this.shouldSkipLanguageAlternate(relativePath, context)) {
        this.skippedFiles.push({
          path: relativePath,
          reason: "language-alternate",
        });
        return;
      }

      // Process path template
      const processedPath = this.processPath(relativePath, context);
      const outputPath = path.join(outputDir, processedPath);

      // Check if file exists
      if (!config.overwriteExisting && (await fs.pathExists(outputPath))) {
        this.skippedFiles.push({
          path: processedPath,
          reason: "already-exists",
        });
        return;
      }

      // Create parent directories
      if (config.createParentDirs && !config.dryRun) {
        await fs.ensureDir(path.dirname(outputPath));
      }

      // Process file based on type
      const isTemplate = this.isTemplateFile(
        sourceFile,
        config.templateExtensions,
      );

      if (isTemplate) {
        await this.processTemplateFile(sourceFile, outputPath, context, config);
      } else {
        await this.copyStaticFile(sourceFile, outputPath, config);
      }

      if (config.verbose) {
        console.log(`✓ Generated: ${processedPath}`);
      }
    } catch (error) {
      this.errors.push({
        type: "FILE_PROCESS_ERROR",
        file: sourceFile,
        message: error.message,
      });

      if (config.verbose) {
        console.error(`✗ Error processing: ${sourceFile} - ${error.message}`);
      }
    }
  }

  /**
   * Process template file with Handlebars
   */
  async processTemplateFile(sourceFile, outputPath, context, config) {
    const templateContent = await fs.readFile(sourceFile, "utf8");

    const template = Handlebars.compile(templateContent, {
      strict: false,
      noEscape: false,
    });

    const processedContent = template(context);
    const finalOutputPath = this.removeTemplateExtensions(
      outputPath,
      config.templateExtensions,
    );

    if (!config.dryRun) {
      await fs.writeFile(finalOutputPath, processedContent, "utf8");

      if (config.preservePermissions) {
        const stats = await fs.stat(sourceFile);
        await fs.chmod(finalOutputPath, stats.mode);
      }
    }

    this.generatedFiles.push({
      template: sourceFile,
      output: finalOutputPath,
      type: "template",
    });
  }

  /**
   * Copy static file without processing
   */
  async copyStaticFile(sourceFile, outputPath, config) {
    if (!config.dryRun) {
      await fs.copy(sourceFile, outputPath, { preserveTimestamps: true });
    }

    this.generatedFiles.push({
      template: sourceFile,
      output: outputPath,
      type: "static",
    });
  }

  /**
   * Process path template (handles dynamic directory and file names)
   */
  processPath(relativePath, context) {
    const pathParts = relativePath.split(path.sep);

    return pathParts
      .map((part) => {
        if (!part.includes("{{")) return part;

        try {
          const template = Handlebars.compile(part);
          return template(context);
        } catch {
          return part;
        }
      })
      .join(path.sep);
  }

  /**
   * Get all files recursively from directory
   */
  async getAllFiles(dir) {
    const pattern = path.join(dir, "**", "*").replace(/\\/g, "/");
    const files = await glob(pattern, { nodir: true, dot: true });
    return files.map((f) => path.resolve(f));
  }

  /**
   * Check if file should be ignored
   */
  shouldIgnoreFile(relativePath, config) {
    const filename = path.basename(relativePath);
    return config.ignoredFiles.includes(filename);
  }

  /**
   * Check if file should be skipped based on language preferences
   */
  shouldSkipLanguageAlternate(relativePath, context) {
    const isTypeScript = TEMPLATE_PATTERNS.typescript.test(relativePath);
    const isJavaScript = TEMPLATE_PATTERNS.javascript.test(relativePath);
    const wantsTypeScript = Boolean(
      context.typescript || context.useTypeScript,
    );

    return (
      (isTypeScript && !wantsTypeScript) || (isJavaScript && wantsTypeScript)
    );
  }

  /**
   * Check if file is a template file
   */
  isTemplateFile(filePath, templateExtensions) {
    return templateExtensions.some((ext) => filePath.endsWith(ext));
  }

  /**
   * Remove template extensions from output path
   */
  removeTemplateExtensions(outputPath, templateExtensions) {
    for (const ext of templateExtensions) {
      if (outputPath.endsWith(ext)) {
        return outputPath.slice(0, -ext.length);
      }
    }
    return outputPath;
  }

  /**
   * Validate inputs
   */
  async validateInputs(templateDir, outputDir, context) {
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template directory does not exist: ${templateDir}`);
    }

    const stat = await fs.stat(templateDir);
    if (!stat.isDirectory()) {
      throw new Error(`Template path is not a directory: ${templateDir}`);
    }

    if (typeof context !== "object" || context === null) {
      throw new Error("Context must be a valid object");
    }

    if (!outputDir || typeof outputDir !== "string") {
      throw new Error("Output directory must be a valid string path");
    }
  }

  /**
   * Generate processing report
   */
  generateReport() {
    return {
      summary: {
        totalFiles: this.generatedFiles.length,
        templatesProcessed: this.generatedFiles.filter(
          (f) => f.type === "template",
        ).length,
        staticFilesCopied: this.generatedFiles.filter(
          (f) => f.type === "static",
        ).length,
        filesSkipped: this.skippedFiles.length,
        errorsEncountered: this.errors.length,
      },
      generatedFiles: this.generatedFiles,
      skippedFiles: this.skippedFiles,
      errors: this.errors,
    };
  }
}

// ============================================================================
// VARIABLE SUBSTITUTION
// ============================================================================

/**
 * Enhanced variable substitution engine with resolvers and transformers
 */
export class VariableSubstitution {
  constructor() {
    this.variables = new Map();
    this.resolvers = new Map();
    this.transformers = new Map();

    this.registerDefaultResolvers();
    this.registerDefaultTransformers();
  }

  /**
   * Add variable resolver
   */
  addResolver(name, resolverFunction) {
    if (typeof resolverFunction !== "function") {
      throw new Error(`Resolver must be a function: ${name}`);
    }
    this.resolvers.set(name, resolverFunction);
  }

  /**
   * Add variable transformer
   */
  addTransformer(name, transformerFunction) {
    if (typeof transformerFunction !== "function") {
      throw new Error(`Transformer must be a function: ${name}`);
    }
    this.transformers.set(name, transformerFunction);
  }

  /**
   * Set variables
   */
  setVariables(variables) {
    for (const [key, value] of Object.entries(variables)) {
      this.variables.set(key, value);
    }
  }

  /**
   * Get resolved context for template processing
   */
  async getResolvedContext() {
    const context = {};

    for (const [key, value] of this.variables.entries()) {
      context[key] = await this.resolveValue(key, value);
    }

    context._computed = this.getComputedValues(context);

    return context;
  }

  /**
   * Resolve a single value
   */
  async resolveValue(key, value) {
    // Handle resolver
    if (this.isResolverValue(value)) {
      const resolver = this.resolvers.get(value._resolver);
      if (resolver) {
        return await resolver(value._params || {});
      }
    }

    // Handle transformers
    if (this.isTransformerValue(value)) {
      let result = value._value || value;

      for (const transformerName of value._transformers) {
        const transformer = this.transformers.get(transformerName);
        if (transformer) {
          result = await transformer(result);
        }
      }

      return result;
    }

    return value;
  }

  /**
   * Check if value has resolver
   */
  isResolverValue(value) {
    return typeof value === "object" && value !== null && value._resolver;
  }

  /**
   * Check if value has transformers
   */
  isTransformerValue(value) {
    return typeof value === "object" && value !== null && value._transformers;
  }

  /**
   * Get computed values
   */
  getComputedValues(context) {
    const now = new Date();

    return {
      timestamp: now.toISOString(),
      year: now.getFullYear(),
      packageName: context.projectName
        ? this.toKebabCase(context.projectName)
        : "my-project",
    };
  }

  /**
   * Convert string to kebab-case
   */
  toKebabCase(str) {
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  /**
   * Register default resolvers
   */
  registerDefaultResolvers() {
    // Environment variable resolver
    this.addResolver("env", ({ variable, defaultValue }) => {
      return process.env[variable] || defaultValue;
    });

    // Package version resolver
    this.addResolver("packageVersion", async ({ packageName }) => {
      try {
        const response = await fetch(
          `https://registry.npmjs.org/${packageName}/latest`,
        );
        const data = await response.json();
        return data.version;
      } catch {
        return "latest";
      }
    });

    // Git resolver
    this.addResolver("git", ({ command }) => {
      try {
        return execSync(command, { encoding: "utf8" }).trim();
      } catch {
        return "";
      }
    });
  }

  /**
   * Register default transformers
   */
  registerDefaultTransformers() {
    this.addTransformer("uppercase", (value) => String(value).toUpperCase());

    this.addTransformer("lowercase", (value) => String(value).toLowerCase());

    this.addTransformer("camelCase", (value) => {
      return String(value)
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    });

    this.addTransformer("pascalCase", (value) => {
      return String(value)
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^[a-z]/, (c) => c.toUpperCase());
    });

    this.addTransformer("kebabCase", (value) => {
      return String(value)
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
    });

    this.addTransformer("snakeCase", (value) => {
      return String(value)
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
    });
  }
}

// ============================================================================
// DIRECTORY STRUCTURE GENERATOR
// ============================================================================

/**
 * Generate directory structures from templates
 */
export class DirectoryStructureGenerator {
  constructor() {
    this.structures = new Map();
  }

  /**
   * Define directory structure from template
   */
  defineStructure(name, structure) {
    if (!name || typeof name !== "string") {
      throw new Error("Structure name must be a valid string");
    }
    this.structures.set(name, structure);
  }

  /**
   * Generate directory structure
   */
  async generateStructure(structureName, basePath, context = {}) {
    const structure = this.structures.get(structureName);

    if (!structure) {
      throw new Error(`Structure '${structureName}' not found`);
    }

    await this.createStructure(structure, basePath, context);
  }

  /**
   * Create structure recursively
   */
  async createStructure(structure, currentPath, context) {
    if (Array.isArray(structure)) {
      for (const item of structure) {
        await this.createStructure(item, currentPath, context);
      }
      return;
    }

    if (typeof structure === "string") {
      await fs.ensureDir(path.join(currentPath, structure));
      return;
    }

    if (typeof structure === "object" && structure !== null) {
      if (structure.type === "directory") {
        await this.createDirectory(structure, currentPath, context);
      } else if (structure.type === "file") {
        await this.createFile(structure, currentPath, context);
      }
    }
  }

  /**
   * Create directory
   */
  async createDirectory(structure, currentPath, context) {
    const dirPath = path.join(currentPath, structure.name);
    await fs.ensureDir(dirPath);

    if (structure.children) {
      await this.createStructure(structure.children, dirPath, context);
    }
  }

  /**
   * Create file
   */
  async createFile(structure, currentPath, context) {
    const filePath = path.join(currentPath, structure.name);
    const content = structure.content || "";

    if (structure.template && content.includes("{{")) {
      const template = Handlebars.compile(content);
      const processedContent = template(context);
      await fs.writeFile(filePath, processedContent, "utf8");
    } else {
      await fs.writeFile(filePath, content, "utf8");
    }
  }

  /**
   * Get all defined structures
   */
  getStructures() {
    return Array.from(this.structures.keys());
  }

  /**
   * Check if structure exists
   */
  hasStructure(name) {
    return this.structures.has(name);
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Process templates (convenience function)
 */
export async function processTemplates(
  templateDir,
  outputDir,
  context,
  options,
) {
  const engine = new TemplateEngine(options);
  return await engine.processTemplates(
    templateDir,
    outputDir,
    context,
    options,
  );
}

/**
 * Generate project from template (convenience function)
 */
export async function generateProject(
  templateName,
  projectPath,
  variables,
  options = {},
) {
  const variableSubstitution = new VariableSubstitution();
  variableSubstitution.setVariables(variables);

  const context = await variableSubstitution.getResolvedContext();
  const templateEngine = new TemplateEngine(options);

  const templatePath = path.join(
    process.cwd(),
    "cli",
    "templates",
    templateName,
  );

  return await templateEngine.processTemplates(
    templatePath,
    projectPath,
    context,
    options,
  );
}
