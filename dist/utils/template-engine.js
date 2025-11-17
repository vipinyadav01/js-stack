import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import { glob } from "glob";
import "./handlebars-helpers.js";

/**
 * Advanced Template Engine for JS Stack CLI
 * Handles variable substitution, conditional rendering, and proper directory structure generation
 */

/**
 * Template Engine Configuration
 */
export class TemplateEngine {
  constructor(options = {}) {
    this.options = {
      templateExtensions: [".hbs", ".handlebars"],
      ignoredFiles: [".DS_Store", "Thumbs.db", ".gitkeep"],
      preservePermissions: true,
      createParentDirs: true,
      overwriteExisting: false,
      dryRun: false,
      verbose: false,
      ...options,
    };

    this.generatedFiles = [];
    this.skippedFiles = [];
    this.errors = [];
  }

  /**
   * Process templates from source directory to destination
   * @param {string} templateDir - Source template directory
   * @param {string} outputDir - Destination directory
   * @param {object} context - Template context variables
   * @param {object} options - Processing options
   */
  async processTemplates(templateDir, outputDir, context = {}, options = {}) {
    const config = { ...this.options, ...options };

    try {
      // Validate inputs
      await this._validateInputs(templateDir, outputDir, context);

      // Ensure output directory exists
      if (!config.dryRun) {
        await fs.ensureDir(outputDir);
      }

      // Get all files recursively
      const files = await this._getAllFiles(templateDir);

      // Process each file
      for (const file of files) {
        await this._processFile(file, templateDir, outputDir, context, config);
      }

      // Generate summary report
      return this._generateReport();
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
   * Process a single template file
   * @param {string} sourceFile - Source file path
   * @param {string} templateDir - Template directory root
   * @param {string} outputDir - Output directory root
   * @param {object} context - Template context
   * @param {object} config - Configuration options
   */
  async _processFile(sourceFile, templateDir, outputDir, context, config) {
    try {
      // Get relative path from template directory
      const relativePath = path.relative(templateDir, sourceFile);

      // Skip ignored files
      if (this._shouldIgnoreFile(relativePath, config)) {
        this.skippedFiles.push({
          path: relativePath,
          reason: "ignored",
        });
        return;
      }

      // Process file path template (directory names and filename)
      const processedPath = await this._processPath(relativePath, context);
      const outputPath = path.join(outputDir, processedPath);

      // Skip language-specific alternates
      if (this._shouldSkipLanguageAlternate(relativePath, context)) {
        this.skippedFiles.push({
          path: relativePath,
          reason: "language-alternate",
        });
        return;
      }

      // Check if target exists and handle overwrite
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
      if (this._isTemplateFile(sourceFile, config.templateExtensions)) {
        await this._processTemplateFile(
          sourceFile,
          outputPath,
          context,
          config,
        );
      } else {
        await this._copyStaticFile(sourceFile, outputPath, config);
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
  async _processTemplateFile(sourceFile, outputPath, context, config) {
    // Read template content
    const templateContent = await fs.readFile(sourceFile, "utf8");

    // Compile and execute template
    const template = Handlebars.compile(templateContent, {
      strict: false,
      noEscape: false,
    });

    const processedContent = template(context);

    // Remove template extension from output path
    const finalOutputPath = this._removeTemplateExtensions(
      outputPath,
      config.templateExtensions,
    );

    // Write processed content
    if (!config.dryRun) {
      await fs.writeFile(finalOutputPath, processedContent, "utf8");

      // Preserve file permissions if needed
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
  async _copyStaticFile(sourceFile, outputPath, config) {
    if (!config.dryRun) {
      await fs.copy(sourceFile, outputPath, {
        preserveTimestamps: true,
      });
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
  async _processPath(relativePath, context) {
    const pathParts = relativePath.split(path.sep);
    const processedParts = [];

    for (const part of pathParts) {
      if (part.includes("{{")) {
        // Process template in path part
        try {
          const template = Handlebars.compile(part);
          const processedPart = template(context);
          processedParts.push(processedPart);
        } catch (error) {
          // If template processing fails, use original part
          processedParts.push(part);
        }
      } else {
        processedParts.push(part);
      }
    }

    return processedParts.join(path.sep);
  }

  /**
   * Get all files recursively from directory
   */
  async _getAllFiles(dir) {
    const pattern = path.join(dir, "**", "*").replace(/\\/g, "/");
    const files = await glob(pattern, {
      nodir: true,
      dot: true,
    });

    return files.map((f) => path.resolve(f));
  }

  /**
   * Check if file should be ignored
   */
  _shouldIgnoreFile(relativePath, config) {
    const filename = path.basename(relativePath);
    return config.ignoredFiles.includes(filename);
  }

  /**
   * Check if file should be skipped based on language preferences
   */
  _shouldSkipLanguageAlternate(relativePath, context) {
    const isTsTemplate =
      /\.ts\.(hbs|handlebars)$/.test(relativePath) ||
      /\.tsx\.(hbs|handlebars)$/.test(relativePath);
    const isJsTemplate =
      /\.js\.(hbs|handlebars)$/.test(relativePath) ||
      /\.jsx\.(hbs|handlebars)$/.test(relativePath);

    const wantsTs = Boolean(context.typescript || context.useTypeScript);

    return (isTsTemplate && !wantsTs) || (isJsTemplate && wantsTs);
  }

  /**
   * Check if file is a template file
   */
  _isTemplateFile(filePath, templateExtensions) {
    return templateExtensions.some((ext) => filePath.endsWith(ext));
  }

  /**
   * Remove template extensions from output path
   */
  _removeTemplateExtensions(outputPath, templateExtensions) {
    let processedPath = outputPath;

    for (const ext of templateExtensions) {
      if (processedPath.endsWith(ext)) {
        processedPath = processedPath.slice(0, -ext.length);
        break;
      }
    }

    return processedPath;
  }

  /**
   * Validate inputs
   */
  async _validateInputs(templateDir, outputDir, context) {
    // Check if template directory exists
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template directory does not exist: ${templateDir}`);
    }

    // Check if template directory is actually a directory
    const stat = await fs.stat(templateDir);
    if (!stat.isDirectory()) {
      throw new Error(`Template path is not a directory: ${templateDir}`);
    }

    // Validate context is an object
    if (typeof context !== "object" || context === null) {
      throw new Error("Context must be a valid object");
    }

    // Validate output directory path
    if (!outputDir || typeof outputDir !== "string") {
      throw new Error("Output directory must be a valid string path");
    }
  }

  /**
   * Generate processing report
   */
  _generateReport() {
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

  /**
   * Reset engine state
   */
  reset() {
    this.generatedFiles = [];
    this.skippedFiles = [];
    this.errors = [];
  }
}

/**
 * Enhanced Variable Substitution Engine
 */
export class VariableSubstitution {
  constructor() {
    this.variables = new Map();
    this.resolvers = new Map();
    this.transformers = new Map();

    // Register default resolvers
    this._registerDefaultResolvers();
    this._registerDefaultTransformers();
  }

  /**
   * Add variable resolver
   */
  addResolver(name, resolverFunction) {
    this.resolvers.set(name, resolverFunction);
  }

  /**
   * Add variable transformer
   */
  addTransformer(name, transformerFunction) {
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

    // Process all variables
    for (const [key, value] of this.variables.entries()) {
      context[key] = await this._resolveValue(key, value);
    }

    // Add computed values
    context._computed = await this._getComputedValues(context);

    return context;
  }

  /**
   * Resolve a single value
   */
  async _resolveValue(key, value) {
    // If value has a resolver, use it
    if (typeof value === "object" && value !== null && value._resolver) {
      const resolver = this.resolvers.get(value._resolver);
      if (resolver) {
        return await resolver(value._params || {});
      }
    }

    // If value has transformers, apply them
    if (typeof value === "object" && value !== null && value._transformers) {
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
   * Get computed values
   */
  async _getComputedValues(context) {
    return {
      timestamp: new Date().toISOString(),
      year: new Date().getFullYear(),
      packageName: context.projectName
        ? context.projectName.toLowerCase().replace(/\s+/g, "-")
        : "my-project",
    };
  }

  /**
   * Register default resolvers
   */
  _registerDefaultResolvers() {
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
        const { execSync } = require("child_process");
        return execSync(command, { encoding: "utf8" }).trim();
      } catch {
        return "";
      }
    });
  }

  /**
   * Register default transformers
   */
  _registerDefaultTransformers() {
    this.addTransformer("uppercase", (value) => String(value).toUpperCase());
    this.addTransformer("lowercase", (value) => String(value).toLowerCase());
    this.addTransformer("camelCase", (value) => {
      return String(value)
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    });
    this.addTransformer("kebabCase", (value) => {
      return String(value)
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
    });
  }
}

/**
 * Directory Structure Generator
 */
export class DirectoryStructureGenerator {
  constructor() {
    this.structure = new Map();
  }

  /**
   * Define directory structure from template
   */
  defineStructure(name, structure) {
    this.structure.set(name, structure);
  }

  /**
   * Generate directory structure
   */
  async generateStructure(structureName, basePath, context = {}) {
    const structure = this.structure.get(structureName);
    if (!structure) {
      throw new Error(`Structure '${structureName}' not found`);
    }

    await this._createStructure(structure, basePath, context);
  }

  /**
   * Create structure recursively
   */
  async _createStructure(structure, currentPath, context) {
    if (Array.isArray(structure)) {
      // Array of items
      for (const item of structure) {
        await this._createStructure(item, currentPath, context);
      }
    } else if (typeof structure === "object" && structure !== null) {
      if (structure.type === "directory") {
        const dirPath = path.join(currentPath, structure.name);
        await fs.ensureDir(dirPath);

        if (structure.children) {
          await this._createStructure(structure.children, dirPath, context);
        }
      } else if (structure.type === "file") {
        const filePath = path.join(currentPath, structure.name);
        const content = structure.content || "";

        // Process content as template if needed
        if (structure.template && content.includes("{{")) {
          const template = Handlebars.compile(content);
          const processedContent = template(context);
          await fs.writeFile(filePath, processedContent, "utf8");
        } else {
          await fs.writeFile(filePath, content, "utf8");
        }
      }
    } else if (typeof structure === "string") {
      // Simple directory name
      await fs.ensureDir(path.join(currentPath, structure));
    }
  }
}

// Export convenience functions
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
