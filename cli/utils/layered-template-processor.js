import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname, basename } from "path";
import Handlebars from "handlebars";
import chalk from "chalk";
import { ConflictResolver } from "./conflict-resolver.js";

// Register Handlebars helpers
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("includes", function (array, item) {
  return Array.isArray(array) && array.includes(item);
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

/**
 * Layered template processor for the new template structure
 */
export class LayeredTemplateProcessor {
  constructor(config) {
    this.config = config;
    this.templateDir = join(process.cwd(), "cli/templates/templates");
    this.projectDir = config.projectDir;
    this.conflictResolver = new ConflictResolver();
    this.processedFiles = [];
    this.conflicts = [];
  }

  /**
   * Process templates in layered order
   * @returns {Object} - Processing result
   */
  async processTemplates() {
    const layers = [
      "01-base",        // Base layer - always copied
      "02-frameworks",  // Framework layer - React, Express, etc.
      "03-integrations", // Integration layer - Database, API
      "04-features",    // Feature layer - Auth, examples
      "05-tooling",     // Tooling layer - Biome, Docker, etc.
      "06-deployment"   // Deployment layer - Vercel, Cloudflare
    ];

    console.log(chalk.blue.bold("\n🎨 Processing Templates in Layers:"));
    console.log(chalk.gray("─".repeat(50)));

    for (const layer of layers) {
      await this.processLayer(layer);
    }

    // Display conflict resolution summary
    this.conflictResolver.displaySummary(this.conflicts);

    return {
      success: true,
      processedFiles: this.processedFiles,
      conflicts: this.conflicts
    };
  }

  /**
   * Process a specific layer
   * @param {string} layerName - Layer name (01-base, 02-frameworks, etc.)
   */
  async processLayer(layerName) {
    const layerPath = join(this.templateDir, layerName);
    
    if (!existsSync(layerPath)) {
      console.log(chalk.gray(`  ⏭️  ${layerName} - No templates`));
      return;
    }

    console.log(chalk.cyan(`  📁 ${layerName} - Processing...`));

    // Process based on layer type
    switch (layerName) {
      case "01-base":
        await this.processBaseLayer(layerPath);
        break;
      case "02-frameworks":
        await this.processFrameworkLayer(layerPath);
        break;
      case "03-integrations":
        await this.processIntegrationLayer(layerPath);
        break;
      case "04-features":
        await this.processFeatureLayer(layerPath);
        break;
      case "05-tooling":
        await this.processToolingLayer(layerPath);
        break;
      case "06-deployment":
        await this.processDeploymentLayer(layerPath);
        break;
    }
  }

  /**
   * Process base layer (always copied)
   * @param {string} layerPath - Base layer path
   */
  async processBaseLayer(layerPath) {
    await this.processDirectory(layerPath, this.projectDir);
  }

  /**
   * Process framework layer (frontend/backend)
   * @param {string} layerPath - Framework layer path
   */
  async processFrameworkLayer(layerPath) {
    // Process frontend frameworks
    if (this.config.frontend && this.config.frontend.length > 0) {
      for (const frontend of this.config.frontend) {
        const frontendPath = join(layerPath, "frontend", frontend);
        if (existsSync(frontendPath)) {
          const targetPath = this.config.addons.includes('turborepo') 
            ? join(this.projectDir, "apps", "web")
            : join(this.projectDir, "frontend");
          
          await this.processDirectory(frontendPath, targetPath);
        }
      }
    }

    // Process backend frameworks
    if (this.config.backend && this.config.backend !== 'none') {
      const backendPath = join(layerPath, "backend", this.config.backend);
      if (existsSync(backendPath)) {
        const targetPath = this.config.addons.includes('turborepo')
          ? join(this.projectDir, "apps", "server")
          : join(this.projectDir, "backend");
        
        await this.processDirectory(backendPath, targetPath);
      }
    }
  }

  /**
   * Process integration layer (database, API)
   * @param {string} layerPath - Integration layer path
   */
  async processIntegrationLayer(layerPath) {
    // Process database integration
    if (this.config.database && this.config.database !== 'none') {
      const dbPath = join(layerPath, "database", this.config.orm);
      if (existsSync(dbPath)) {
        const targetPath = this.config.addons.includes('turborepo')
          ? join(this.projectDir, "packages", "database")
          : join(this.projectDir, "database");
        
        await this.processDirectory(dbPath, targetPath);
      }
    }
  }

  /**
   * Process feature layer (auth, examples)
   * @param {string} layerPath - Feature layer path
   */
  async processFeatureLayer(layerPath) {
    // Process authentication
    if (this.config.auth && this.config.auth !== 'none') {
      const authPath = join(layerPath, "auth", this.config.auth);
      if (existsSync(authPath)) {
        const targetPath = this.config.addons.includes('turborepo')
          ? join(this.projectDir, "packages", "auth")
          : join(this.projectDir, "auth");
        
        await this.processDirectory(authPath, targetPath);
      }
    }
  }

  /**
   * Process tooling layer (Biome, Docker, etc.)
   * @param {string} layerPath - Tooling layer path
   */
  async processToolingLayer(layerPath) {
    // Process testing
    if (this.config.addons.includes('testing') || this.config.addons.includes('jest') || this.config.addons.includes('vitest')) {
      const testingPath = join(layerPath, "testing", "jest"); // Default to jest
      if (existsSync(testingPath)) {
        await this.processDirectory(testingPath, this.projectDir);
      }
    }

    // Process Docker
    if (this.config.addons.includes('docker')) {
      const dockerPath = join(layerPath, "docker");
      if (existsSync(dockerPath)) {
        await this.processDirectory(dockerPath, this.projectDir);
      }
    }

    // Process Biome
    if (this.config.addons.includes('biome')) {
      const biomePath = join(layerPath, "biome");
      if (existsSync(biomePath)) {
        await this.processDirectory(biomePath, this.projectDir);
      }
    }

    // Process Turborepo
    if (this.config.addons.includes('turborepo')) {
      const turborepoPath = join(layerPath, "turborepo");
      if (existsSync(turborepoPath)) {
        await this.processDirectory(turborepoPath, this.projectDir);
      }
    }
  }

  /**
   * Process deployment layer (Vercel, Cloudflare)
   * @param {string} layerPath - Deployment layer path
   */
  async processDeploymentLayer(layerPath) {
    if (this.config.deployment && this.config.deployment !== 'none') {
      const deploymentPath = join(layerPath, this.config.deployment);
      if (existsSync(deploymentPath)) {
        await this.processDirectory(deploymentPath, this.projectDir);
      }
    }
  }

  /**
   * Process a directory recursively
   * @param {string} sourcePath - Source directory path
   * @param {string} targetPath - Target directory path
   */
  async processDirectory(sourcePath, targetPath) {
    const { readdirSync, statSync } = await import("fs");
    
    if (!existsSync(targetPath)) {
      mkdirSync(targetPath, { recursive: true });
    }

    const items = readdirSync(sourcePath);
    
    for (const item of items) {
      const sourceItemPath = join(sourcePath, item);
      const targetItemPath = join(targetPath, item);
      const stat = statSync(sourceItemPath);

      if (stat.isDirectory()) {
        await this.processDirectory(sourceItemPath, targetItemPath);
      } else {
        await this.processFile(sourceItemPath, targetItemPath);
      }
    }
  }

  /**
   * Process a single file
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   */
  async processFile(sourcePath, targetPath) {
    // Remove .hbs extension from target path if it's a Handlebars template
    if (sourcePath.endsWith('.hbs')) {
      targetPath = targetPath.replace(/\.hbs$/, '');
    }

    // Check for conflicts
    if (existsSync(targetPath)) {
      const conflict = this.conflictResolver.resolveConflict(targetPath, sourcePath, "template");
      this.conflicts.push({
        file: targetPath,
        action: conflict.action,
        reason: conflict.reason,
        newPath: conflict.newPath
      });

      // Handle conflict based on action
      switch (conflict.action) {
        case 'override':
          // Continue with normal processing (override)
          break;
        case 'merge':
          await this.mergeFile(sourcePath, targetPath);
          return;
        case 'append':
          await this.appendToFile(sourcePath, targetPath);
          return;
        case 'rename':
          targetPath = join(dirname(targetPath), conflict.newPath);
          break;
      }
    }

    // Process Handlebars template
    if (sourcePath.endsWith('.hbs')) {
      await this.processHandlebarsTemplate(sourcePath, targetPath);
    } else {
      // Copy file as-is
      copyFileSync(sourcePath, targetPath);
    }

    this.processedFiles.push(targetPath);
  }

  /**
   * Process Handlebars template
   * @param {string} sourcePath - Source template path
   * @param {string} targetPath - Target file path
   */
  async processHandlebarsTemplate(sourcePath, targetPath) {
    const templateContent = readFileSync(sourcePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    
    // Prepare template context
    const context = this.prepareTemplateContext();
    
    // Render template
    const renderedContent = template(context);
    
    // Ensure target directory exists
    mkdirSync(dirname(targetPath), { recursive: true });
    
    // Write rendered content
    writeFileSync(targetPath, renderedContent, 'utf-8');
  }

  /**
   * Merge files (for package.json, etc.)
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   */
  async mergeFile(sourcePath, targetPath) {
    if (basename(targetPath) === 'package.json') {
      const sourceContent = JSON.parse(readFileSync(sourcePath, 'utf-8'));
      const targetContent = JSON.parse(readFileSync(targetPath, 'utf-8'));
      
      const merged = this.conflictResolver.mergePackageJson(targetContent, sourceContent);
      writeFileSync(targetPath, JSON.stringify(merged, null, 2), 'utf-8');
    }
  }

  /**
   * Append content to file
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   */
  async appendToFile(sourcePath, targetPath) {
    const sourceContent = readFileSync(sourcePath, 'utf-8');
    this.conflictResolver.appendToFile(targetPath, sourceContent);
  }

  /**
   * Prepare template context
   * @returns {Object} - Template context
   */
  prepareTemplateContext() {
    const addons = Array.isArray(this.config.addons) ? this.config.addons : [];
    const frontend = Array.isArray(this.config.frontend) ? this.config.frontend : [];
    
    return {
      projectName: this.config.projectName,
      database: this.config.database || 'none',
      orm: this.config.orm || 'none',
      backend: this.config.backend || 'none',
      frontend: frontend,
      auth: this.config.auth || 'none',
      addons: addons,
      deployment: this.config.deployment || 'none',
      packageManager: this.config.packageManager || 'npm',
      typescript: this.config.typescript || addons.includes('typescript'),
      useTypeScript: this.config.typescript || addons.includes('typescript')
    };
  }

  /**
   * Display processing summary
   * @param {Object} result - Processing result
   */
  displaySummary(result) {
    console.log(chalk.green.bold("\n✅ Template Processing Complete!"));
    console.log(chalk.gray(`  • Files processed: ${result.processedFiles.length}`));
    console.log(chalk.gray(`  • Conflicts resolved: ${result.conflicts.length}`));
    console.log();
  }
}

export default LayeredTemplateProcessor;
