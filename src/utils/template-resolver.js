
import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import chalk from "chalk";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
} from "../types.js";

/**
 * Template resolution cache
 */
const templateCache = new Map();

/**
 * Template resolution rules
 */
export const TEMPLATE_RULES = {
  // Backend templates
  backend: {
    [BACKEND_OPTIONS.EXPRESS]: {
      base: "express",
      files: [
        "package.json",
        "server.js",
        "routes/index.js",
        "middleware/auth.js",
      ],
      dependencies: ["express", "cors", "helmet", "morgan"],
    },
    [BACKEND_OPTIONS.FASTIFY]: {
      base: "fastify",
      files: ["package.json", "server.js", "routes/index.js"],
      dependencies: ["fastify", "@fastify/cors", "@fastify/helmet"],
    },
    [BACKEND_OPTIONS.NESTJS]: {
      base: "nestjs",
      files: [
        "package.json",
        "main.ts",
        "app.module.ts",
        "app.controller.ts",
        "app.service.ts",
      ],
      dependencies: [
        "@nestjs/core",
        "@nestjs/common",
        "@nestjs/platform-express",
      ],
    },
  },

  // Frontend templates
  frontend: {
    [FRONTEND_OPTIONS.REACT]: {
      base: "react",
      files: ["package.json", "index.html", "main.jsx", "App.jsx"],
      dependencies: ["react", "react-dom", "vite", "@vitejs/plugin-react"],
    },
    [FRONTEND_OPTIONS.VUE]: {
      base: "vue",
      files: ["package.json", "index.html", "main.js", "App.vue"],
      dependencies: ["vue", "vite", "@vitejs/plugin-vue"],
    },
    [FRONTEND_OPTIONS.NEXTJS]: {
      base: "nextjs",
      files: [
        "package.json",
        "next.config.js",
        "pages/index.js",
        "pages/api/hello.js",
      ],
      dependencies: ["next", "react", "react-dom"],
    },
  },

  // Authentication templates
  auth: {
    jwt: {
      base: "jwt",
      files: ["middleware.js", "routes.js"],
      dependencies: ["jsonwebtoken", "bcryptjs"],
    },
    passport: {
      base: "passport",
      files: ["config.js"],
      dependencies: ["passport", "passport-local"],
    },
    oauth: {
      base: "oauth",
      files: ["config.js", "routes.js"],
      dependencies: ["passport-google-oauth20"],
    },
    auth0: {
      base: "auth0",
      files: ["config.js", "routes.js"],
      dependencies: ["auth0"],
    },
  },

  // Database templates (using ORM templates for database-specific files)
  database: {
    [DATABASE_OPTIONS.POSTGRES]: {
      base: "prisma", // Use Prisma templates for PostgreSQL
      files: ["schema.prisma"],
      dependencies: ["pg"],
    },
    [DATABASE_OPTIONS.MONGODB]: {
      base: "mongoose", // Use Mongoose templates for MongoDB
      files: ["models.js"],
      dependencies: ["mongodb"],
    },
    [DATABASE_OPTIONS.SQLITE]: {
      base: "prisma", // Use Prisma templates for SQLite
      files: ["schema.prisma"],
      dependencies: ["sqlite3"],
    },
    [DATABASE_OPTIONS.MYSQL]: {
      base: "prisma", // Use Prisma templates for MySQL
      files: ["schema.prisma"],
      dependencies: ["mysql2"],
    },
  },

  // ORM templates
  orm: {
    [ORM_OPTIONS.PRISMA]: {
      base: "prisma",
      files: ["schema.prisma"],
      dependencies: ["prisma", "@prisma/client"],
    },
    [ORM_OPTIONS.MONGOOSE]: {
      base: "mongoose",
      files: ["models.js"],
      dependencies: ["mongoose"],
    },
    [ORM_OPTIONS.SEQUELIZE]: {
      base: "sequelize",
      files: ["models.js"],
      dependencies: ["sequelize"],
    },
    [ORM_OPTIONS.TYPEORM]: {
      base: "typeorm",
      files: ["data-source.ts", "entities/User.ts", "entities/Post.ts"],
      dependencies: ["typeorm", "reflect-metadata"],
    },
  },
};

/**
 * Template context builder
 */
export class TemplateContextBuilder {
  constructor(config) {
    this.config = config;
    this.context = {
      // Basic project info
      projectName: config.projectName,
      projectDir: config.projectDir,

      // Technology flags
      typescript: config.addons?.includes("typescript") || false,
      useTypeScript: config.addons?.includes("typescript") || false,

      // Framework flags
      hasBackend: config.backend && config.backend !== BACKEND_OPTIONS.NONE,
      hasFrontend:
        config.frontend &&
        config.frontend.length > 0 &&
        !config.frontend.includes(FRONTEND_OPTIONS.NONE),
      hasDatabase: config.database && config.database !== DATABASE_OPTIONS.NONE,
      hasORM: config.orm && config.orm !== ORM_OPTIONS.NONE,
      hasAuth: config.auth && config.auth !== "none",

      // Specific technology flags
      isExpress: config.backend === BACKEND_OPTIONS.EXPRESS,
      isFastify: config.backend === BACKEND_OPTIONS.FASTIFY,
      isNestJS: config.backend === BACKEND_OPTIONS.NESTJS,
      isReact: config.frontend?.includes(FRONTEND_OPTIONS.REACT),
      isVue: config.frontend?.includes(FRONTEND_OPTIONS.VUE),
      isNextJS: config.frontend?.includes(FRONTEND_OPTIONS.NEXTJS),
      isPostgres: config.database === DATABASE_OPTIONS.POSTGRES,
      isMongoDB: config.database === DATABASE_OPTIONS.MONGODB,
      isPrisma: config.orm === ORM_OPTIONS.PRISMA,
      isMongoose: config.orm === ORM_OPTIONS.MONGOOSE,

      // Package manager
      packageManager: config.packageManager || "npm",

      // Addons
      hasDocker: config.addons?.includes("docker") || false,
      hasTesting: config.addons?.includes("testing") || false,
      hasESLint: config.addons?.includes("eslint") || false,
      hasPrettier: config.addons?.includes("prettier") || false,

      // Timestamps
      year: new Date().getFullYear(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Add custom context variables
   * @param {Object} customContext - Custom context variables
   */
  addCustom(customContext) {
    this.context = { ...this.context, ...customContext };
    return this;
  }

  /**
   * Build the final context
   * @returns {Object} - Template context
   */
  build() {
    return this.context;
  }
}

/**
 * Smart template resolver
 */
export class TemplateResolver {
  constructor(templateDir) {
    this.templateDir = templateDir;
    this.cache = new Map();
  }

  /**
   * Resolve template path based on configuration
   * @param {string} category - Template category (backend, frontend, etc.)
   * @param {string} technology - Technology name
   * @param {Object} config - Project configuration
   * @returns {string} - Resolved template path
   */
  resolveTemplatePath(category, technology, config) {
    // Prefer direct technology folder if present
    const directPath = path.join(this.templateDir, category, technology);
    if (fs.existsSync(directPath)) return directPath;

    // Custom override folder inside technology path
    const customPath = path.join(this.templateDir, category, technology, "custom");
    if (fs.existsSync(customPath)) return customPath;

    // Fallback to base mapping if defined
    const rules = TEMPLATE_RULES[category]?.[technology];
    if (rules) {
      const basePath = path.join(this.templateDir, category, rules.base);
      if (fs.existsSync(basePath)) return basePath;
    }

    // Final fallback: category root (will result in no files if missing)
    return path.join(this.templateDir, category, technology);
  }

  /**
   * Get template files for a technology
   * @param {string} category - Template category
   * @param {string} technology - Technology name
   * @param {Object} config - Project configuration
   * @returns {Array} - Array of template file paths
   */
  getTemplateFiles(category, technology, config) {
    const templatePath = this.resolveTemplatePath(category, technology, config);

    if (!fs.existsSync(templatePath)) {
      console.warn(chalk.yellow(`Template path not found: ${templatePath}`));
      return [];
    }

    const files = [];
    const wantsTs = Boolean(config.addons?.includes("typescript") || config.typescript || config.useTypeScript);

    const includeByLanguage = (filename) => {
      // If templates provide both js/ts variants, include only the desired one
      const isTs = /\.(ts|tsx)\.hbs$/.test(filename);
      const isJs = /\.(js|jsx)\.hbs$/.test(filename);
      if (isTs) return wantsTs;
      if (isJs) return !wantsTs;
      return true;
    };

    const scanDir = (dir, relativePath = "") => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativeItemPath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath, relativeItemPath);
        } else if (item.endsWith(".hbs") && includeByLanguage(item)) {
          files.push({
            source: fullPath,
            relative: relativeItemPath,
            category,
            technology,
          });
        }
      }
    };

    scanDir(templatePath);
    return files;
  }

  /**
   * Resolve output file path
   * @param {string} templatePath - Template file path
   * @param {Object} context - Template context
   * @param {string} outputDir - Output directory
   * @returns {string} - Resolved output path
   */
  resolveOutputPath(templatePath, context, outputRoot) {
    let outputPath = templatePath;

    // Remove .hbs extension
    if (outputPath.endsWith(".hbs")) {
      outputPath = outputPath.slice(0, -4);
    }

    // Process Handlebars in filename
    if (outputPath.includes("{{")) {
      const template = Handlebars.compile(outputPath);
      outputPath = template(context);
    }

    // Handle dynamic extensions
    if (outputPath.includes("{{#if typescript}}")) {
      const extension = context.typescript ? "ts" : "js";
      outputPath = outputPath.replace(
        /\{\{#if typescript\}\}[^{]+(\{\{else\}\}[^{]+)?\{\{\/if\}\}/g,
        extension,
      );
    }

    if (outputPath.includes("{{#if useTypeScript}}")) {
      const extension = context.useTypeScript ? "ts" : "js";
      outputPath = outputPath.replace(
        /\{\{#if useTypeScript\}\}[^{]+(\{\{else\}\}[^{]+)?\{\{\/if\}\}/g,
        extension,
      );
    }

    return path.join(outputRoot, outputPath);
  }

  /**
   * Process template content
   * @param {string} content - Template content
   * @param {Object} context - Template context
   * @returns {string} - Processed content
   */
  processTemplateContent(content, context) {
    try {
      const template = Handlebars.compile(content);
      return template(context);
    } catch (error) {
      console.error(chalk.red(`Template compilation error:`), error.message);
      throw error;
    }
  }

  /**
   * Get cached template or load from disk
   * @param {string} templatePath - Template file path
   * @returns {string} - Template content
   */
  getTemplate(templatePath) {
    if (this.cache.has(templatePath)) {
      return this.cache.get(templatePath);
    }

    try {
      const content = fs.readFileSync(templatePath, "utf-8");
      this.cache.set(templatePath, content);
      return content;
    } catch (error) {
      console.error(
        chalk.red(`Failed to read template ${templatePath}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Clear template cache
   */
  clearCache() {
    this.cache.clear();
  }
}

/**
 * Template processor with smart resolution
 */
export class SmartTemplateProcessor {
  constructor(templateDir) {
    this.resolver = new TemplateResolver(templateDir);
  }

  /**
   * Process templates for a complete project
   * @param {Object} config - Project configuration
   * @param {string} outputDir - Output directory
   * @param {Function} progressCallback - Progress callback
   * @returns {Object} - Processing result
   */
  async processProject(config, outputDir, progressCallback = null) {
    const context = new TemplateContextBuilder(config).build();
    const processedFiles = [];
    const errors = [];

    try {
      // Process backend templates
      if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
        if (progressCallback)
          progressCallback("Processing backend templates...");

        const backendFiles = this.resolver.getTemplateFiles(
          "backend",
          config.backend,
          config,
        );
        for (const file of backendFiles) {
          try {
            const content = this.resolver.getTemplate(file.source);
            const processedContent = this.resolver.processTemplateContent(
              content,
              context,
            );
            const outputPath = this.resolver.resolveOutputPath(
              file.relative,
              context,
              outputDir,
            );

            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, processedContent);

            processedFiles.push({
              source: file.source,
              output: outputPath,
              category: "backend",
              technology: config.backend,
            });
          } catch (error) {
            errors.push({
              file: file.source,
              error: error.message,
              category: "backend",
            });
          }
        }
      }

      // Process frontend templates
      if (config.frontend && config.frontend.length > 0) {
        for (const frontend of config.frontend) {
          if (frontend !== FRONTEND_OPTIONS.NONE) {
            if (progressCallback)
              progressCallback(`Processing ${frontend} templates...`);

            const frontendFiles = this.resolver.getTemplateFiles(
              "frontend",
              frontend,
              config,
            );
            for (const file of frontendFiles) {
              try {
                const content = this.resolver.getTemplate(file.source);
                const processedContent = this.resolver.processTemplateContent(
                  content,
                  context,
                );
                const outputPath = this.resolver.resolveOutputPath(
                  file.relative,
                  context,
                  outputDir,
                );

                await fs.ensureDir(path.dirname(outputPath));
                await fs.writeFile(outputPath, processedContent);

                processedFiles.push({
                  source: file.source,
                  output: outputPath,
                  category: "frontend",
                  technology: frontend,
                });
              } catch (error) {
                errors.push({
                  file: file.source,
                  error: error.message,
                  category: "frontend",
                });
              }
            }
          }
        }
      }

      // Process database templates
      if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
        if (progressCallback)
          progressCallback("Processing database templates...");

        const databaseFiles = this.resolver.getTemplateFiles(
          "database",
          config.database,
          config,
        );
        for (const file of databaseFiles) {
          try {
            const content = this.resolver.getTemplate(file.source);
            const processedContent = this.resolver.processTemplateContent(
              content,
              context,
            );
            const outputPath = this.resolver.resolveOutputPath(
              file.relative,
              context,
              outputDir,
            );

            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, processedContent);

            processedFiles.push({
              source: file.source,
              output: outputPath,
              category: "database",
              technology: config.database,
            });
          } catch (error) {
            errors.push({
              file: file.source,
              error: error.message,
              category: "database",
            });
          }
        }
      }

      // Process ORM templates
      if (config.orm && config.orm !== ORM_OPTIONS.NONE) {
        if (progressCallback) progressCallback("Processing ORM templates...");

        const ormFiles = this.resolver.getTemplateFiles(
          "orm",
          config.orm,
          config,
        );
        for (const file of ormFiles) {
          try {
            const content = this.resolver.getTemplate(file.source);
            const processedContent = this.resolver.processTemplateContent(
              content,
              context,
            );
            const outputPath = this.resolver.resolveOutputPath(
              file.relative,
              context,
              outputDir,
            );

            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, processedContent);

            processedFiles.push({
              source: file.source,
              output: outputPath,
              category: "orm",
              technology: config.orm,
            });
          } catch (error) {
            errors.push({
              file: file.source,
              error: error.message,
              category: "orm",
            });
          }
        }
      }

      return {
        success: errors.length === 0,
        processedFiles,
        errors,
        context,
      };
    } catch (error) {
      return {
        success: false,
        processedFiles,
        errors: [...errors, { error: error.message }],
        context,
      };
    }
  }
}

/**
 * Get template resolver instance
 * @param {string} templateDir - Template directory path
 * @returns {SmartTemplateProcessor} - Template processor instance
 */
export function getTemplateProcessor(templateDir) {
  return new SmartTemplateProcessor(templateDir);
}
