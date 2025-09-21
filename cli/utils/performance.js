import fs from "fs-extra";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import chalk from "chalk";

const execAsync = promisify(exec);

/**
 * Performance monitoring and optimization utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startTime: null,
      endTime: null,
      operations: [],
      fileOperations: 0,
      directoryOperations: 0,
      templateProcessing: 0,
      dependencyInstallation: 0,
    };
  }

  /**
   * Start performance monitoring
   */
  start() {
    this.metrics.startTime = Date.now();
    console.log(chalk.blue("🚀 Performance monitoring started"));
  }

  /**
   * End performance monitoring
   */
  end() {
    this.metrics.endTime = Date.now();
    const duration = this.metrics.endTime - this.metrics.startTime;
    console.log(
      chalk.green(`✅ Performance monitoring completed in ${duration}ms`),
    );
    return this.getSummary();
  }

  /**
   * Record an operation
   * @param {string} operation - Operation name
   * @param {number} duration - Operation duration in ms
   * @param {Object} metadata - Additional metadata
   */
  recordOperation(operation, duration, metadata = {}) {
    this.metrics.operations.push({
      operation,
      duration,
      timestamp: Date.now(),
      metadata,
    });
  }

  /**
   * Get performance summary
   * @returns {Object} - Performance summary
   */
  getSummary() {
    const totalDuration = this.metrics.endTime - this.metrics.startTime;
    const operations = this.metrics.operations;

    const summary = {
      totalDuration,
      operationCount: operations.length,
      averageOperationTime:
        operations.length > 0
          ? operations.reduce((sum, op) => sum + op.duration, 0) /
            operations.length
          : 0,
      slowestOperation:
        operations.length > 0
          ? operations.reduce((max, op) =>
              op.duration > max.duration ? op : max,
            )
          : null,
      operationsByType: {},
    };

    // Group operations by type
    operations.forEach((op) => {
      if (!summary.operationsByType[op.operation]) {
        summary.operationsByType[op.operation] = {
          count: 0,
          totalTime: 0,
          averageTime: 0,
        };
      }
      summary.operationsByType[op.operation].count++;
      summary.operationsByType[op.operation].totalTime += op.duration;
    });

    // Calculate averages
    Object.keys(summary.operationsByType).forEach((type) => {
      const op = summary.operationsByType[type];
      op.averageTime = op.totalTime / op.count;
    });

    return summary;
  }

  /**
   * Display performance summary
   */
  displaySummary() {
    const summary = this.getSummary();

    console.log(chalk.blue.bold("\n📊 Performance Summary"));
    console.log(chalk.gray("─".repeat(50)));
    console.log(chalk.cyan(`Total Duration: ${summary.totalDuration}ms`));
    console.log(chalk.cyan(`Operations: ${summary.operationCount}`));
    console.log(
      chalk.cyan(
        `Average Operation Time: ${summary.averageOperationTime.toFixed(2)}ms`,
      ),
    );

    if (summary.slowestOperation) {
      console.log(
        chalk.yellow(
          `Slowest Operation: ${summary.slowestOperation.operation} (${summary.slowestOperation.duration}ms)`,
        ),
      );
    }

    console.log(chalk.gray("\nOperations by Type:"));
    Object.entries(summary.operationsByType).forEach(([type, stats]) => {
      console.log(
        chalk.gray(
          `  ${type}: ${stats.count} operations, ${stats.totalTime}ms total, ${stats.averageTime.toFixed(2)}ms avg`,
        ),
      );
    });
  }
}

/**
 * Concurrent file operations manager
 */
export class ConcurrentFileManager {
  constructor(maxConcurrency = 10) {
    this.maxConcurrency = maxConcurrency;
    this.queue = [];
    this.running = 0;
    this.completed = 0;
    this.errors = [];
  }

  /**
   * Add file operation to queue
   * @param {Function} operation - File operation function
   * @param {Object} options - Operation options
   * @returns {Promise} - Operation result
   */
  async addOperation(operation, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        operation,
        options,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  /**
   * Process operation queue
   */
  async processQueue() {
    if (this.running >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { operation, options, resolve, reject } = this.queue.shift();

    try {
      const result = await operation();
      this.completed++;
      resolve(result);
    } catch (error) {
      this.errors.push(error);
      reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  /**
   * Wait for all operations to complete
   * @returns {Object} - Summary of operations
   */
  async waitForCompletion() {
    while (this.queue.length > 0 || this.running > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return {
      completed: this.completed,
      errors: this.errors,
      total: this.completed + this.errors.length,
    };
  }
}

/**
 * Template cache manager
 */
export class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
    };
  }

  /**
   * Get template from cache
   * @param {string} key - Cache key
   * @returns {string|null} - Cached template or null
   */
  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  /**
   * Set template in cache
   * @param {string} key - Cache key
   * @param {string} value - Template content
   */
  set(key, value) {
    this.cache.set(key, value);
    this.stats.size = this.cache.size;
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }
}

/**
 * Optimized file operations
 */
export class OptimizedFileOperations {
  constructor() {
    this.cache = new TemplateCache();
    this.concurrentManager = new ConcurrentFileManager();
  }

  /**
   * Concurrently create multiple files
   * @param {Array} files - Array of file operations
   * @param {string} baseDir - Base directory
   * @returns {Promise<Array>} - Results of all operations
   */
  async createFilesConcurrently(files, baseDir) {
    const operations = files.map((file) =>
      this.concurrentManager.addOperation(async () => {
        const filePath = path.join(baseDir, file.path);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, file.content, file.options || {});
        return { path: filePath, success: true };
      }),
    );

    return Promise.allSettled(operations);
  }

  /**
   * Concurrently copy multiple files
   * @param {Array} files - Array of copy operations
   * @param {string} baseDir - Base directory
   * @returns {Promise<Array>} - Results of all operations
   */
  async copyFilesConcurrently(files, baseDir) {
    const operations = files.map((file) =>
      this.concurrentManager.addOperation(async () => {
        const srcPath = file.source;
        const destPath = path.join(baseDir, file.destination);
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath, file.options || {});
        return { path: destPath, success: true };
      }),
    );

    return Promise.allSettled(operations);
  }

  /**
   * Concurrently process templates
   * @param {Array} templates - Array of template operations
   * @param {Object} context - Template context
   * @param {string} outputDir - Output directory
   * @returns {Promise<Array>} - Results of all operations
   */
  async processTemplatesConcurrently(templates, context, outputDir) {
    const operations = templates.map((template) =>
      this.concurrentManager.addOperation(async () => {
        // Check cache first
        let content = this.cache.get(template.source);
        if (!content) {
          content = await fs.readFile(template.source, "utf-8");
          this.cache.set(template.source, content);
        }

        // Process template
        const Handlebars = await import("handlebars");
        const compiled = Handlebars.compile(content);
        const processedContent = compiled(context);

        // Write output
        const outputPath = path.join(outputDir, template.output);
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, processedContent);

        return {
          source: template.source,
          output: outputPath,
          success: true,
        };
      }),
    );

    return Promise.allSettled(operations);
  }

  /**
   * Get operation summary
   * @returns {Object} - Operation summary
   */
  async getSummary() {
    const concurrentSummary = await this.concurrentManager.waitForCompletion();
    const cacheStats = this.cache.getStats();

    return {
      concurrent: concurrentSummary,
      cache: cacheStats,
    };
  }
}

/**
 * Dependency installation optimizer
 */
export class DependencyOptimizer {
  constructor() {
    this.packageManagers = {
      npm: { command: "npm", install: "install", ci: "ci" },
      yarn: {
        command: "yarn",
        install: "install",
        ci: "install --frozen-lockfile",
      },
      pnpm: {
        command: "pnpm",
        install: "install",
        ci: "install --frozen-lockfile",
      },
      bun: { command: "bun", install: "install", ci: "install" },
    };
  }

  /**
   * Optimize dependency installation
   * @param {string} packageManager - Package manager to use
   * @param {string} projectDir - Project directory
   * @param {Object} options - Installation options
   * @returns {Promise<Object>} - Installation result
   */
  async optimizeInstallation(packageManager, projectDir, options = {}) {
    const startTime = Date.now();
    const pm = this.packageManagers[packageManager];

    if (!pm) {
      throw new Error(`Unsupported package manager: ${packageManager}`);
    }

    try {
      // Use CI mode for faster installation if lockfile exists
      const lockfileExists = await this.checkLockfile(
        projectDir,
        packageManager,
      );
      const command = lockfileExists ? pm.ci : pm.install;

      // Add optimization flags
      const flags = this.getOptimizationFlags(packageManager, options);
      const fullCommand = `${pm.command} ${command} ${flags}`.trim();

      console.log(
        chalk.blue(`📦 Installing dependencies with ${packageManager}...`),
      );
      console.log(chalk.gray(`Command: ${fullCommand}`));

      const { stdout, stderr } = await execAsync(fullCommand, {
        cwd: projectDir,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      const duration = Date.now() - startTime;

      return {
        success: true,
        duration,
        stdout,
        stderr,
        command: fullCommand,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }
  }

  /**
   * Check if lockfile exists
   * @param {string} projectDir - Project directory
   * @param {string} packageManager - Package manager
   * @returns {Promise<boolean>} - Whether lockfile exists
   */
  async checkLockfile(projectDir, packageManager) {
    const lockfiles = {
      npm: "package-lock.json",
      yarn: "yarn.lock",
      pnpm: "pnpm-lock.yaml",
      bun: "bun.lockb",
    };

    const lockfile = lockfiles[packageManager];
    if (!lockfile) return false;

    try {
      await fs.access(path.join(projectDir, lockfile));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get optimization flags for package manager
   * @param {string} packageManager - Package manager
   * @param {Object} options - Options
   * @returns {string} - Optimization flags
   */
  getOptimizationFlags(packageManager, options = {}) {
    const flags = [];

    switch (packageManager) {
      case "npm":
        if (options.production) flags.push("--production");
        if (options.ignoreScripts) flags.push("--ignore-scripts");
        if (options.noOptional) flags.push("--no-optional");
        break;

      case "yarn":
        if (options.production) flags.push("--production");
        if (options.ignoreScripts) flags.push("--ignore-scripts");
        break;

      case "pnpm":
        if (options.production) flags.push("--prod");
        if (options.ignoreScripts) flags.push("--ignore-scripts");
        break;

      case "bun":
        if (options.production) flags.push("--production");
        if (options.ignoreScripts) flags.push("--ignore-scripts");
        break;
    }

    return flags.join(" ");
  }
}

/**
 * Performance utilities
 */
export const performanceUtils = {
  /**
   * Measure operation execution time
   * @param {Function} operation - Operation to measure
   * @param {string} name - Operation name
   * @returns {Promise<Object>} - Operation result with timing
   */
  async measureOperation(operation, name) {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      return { success: true, result, duration, name };
    } catch (error) {
      const duration = Date.now() - startTime;
      return { success: false, error, duration, name };
    }
  },

  /**
   * Batch operations for better performance
   * @param {Array} operations - Array of operations
   * @param {number} batchSize - Batch size
   * @returns {Promise<Array>} - Results of all operations
   */
  async batchOperations(operations, batchSize = 10) {
    const results = [];

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(batch);
      results.push(...batchResults);
    }

    return results;
  },

  /**
   * Create performance monitor instance
   * @returns {PerformanceMonitor} - Performance monitor
   */
  createMonitor() {
    return new PerformanceMonitor();
  },

  /**
   * Create optimized file operations instance
   * @returns {OptimizedFileOperations} - Optimized file operations
   */
  createFileOperations() {
    return new OptimizedFileOperations();
  },

  /**
   * Create dependency optimizer instance
   * @returns {DependencyOptimizer} - Dependency optimizer
   */
  createDependencyOptimizer() {
    return new DependencyOptimizer();
  },
};
