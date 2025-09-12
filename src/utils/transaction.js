import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

/**
 * Transaction-based file operations with rollback capabilities
 */
export class Transaction {
  constructor() {
    this.operations = [];
    this.createdFiles = [];
    this.createdDirs = [];
    this.modifiedFiles = [];
    this.backupFiles = new Map();
  }

  /**
   * Add a file creation operation
   * @param {string} filePath - Path to the file
   * @param {string} content - File content
   * @param {Object} options - File options
   */
  async createFile(filePath, content, options = {}) {
    try {
      // Create backup if file exists
      if (await fs.pathExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        this.backupFiles.set(filePath, backupPath);
        this.modifiedFiles.push(filePath);
      } else {
        this.createdFiles.push(filePath);
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(filePath));

      // Write file
      await fs.writeFile(filePath, content, options);

      // Record operation
      this.operations.push({
        type: "createFile",
        filePath,
        content,
        options,
      });

      return true;
    } catch (error) {
      console.error(
        chalk.red(`Failed to create file ${filePath}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Add a directory creation operation
   * @param {string} dirPath - Path to the directory
   */
  async createDir(dirPath) {
    try {
      if (!(await fs.pathExists(dirPath))) {
        await fs.ensureDir(dirPath);
        this.createdDirs.push(dirPath);
      }

      this.operations.push({
        type: "createDir",
        dirPath,
      });

      return true;
    } catch (error) {
      console.error(
        chalk.red(`Failed to create directory ${dirPath}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Add a file copy operation
   * @param {string} src - Source path
   * @param {string} dest - Destination path
   * @param {Object} options - Copy options
   */
  async copyFile(src, dest, options = {}) {
    try {
      // Create backup if destination exists
      if (await fs.pathExists(dest)) {
        const backupPath = `${dest}.backup.${Date.now()}`;
        await fs.copy(dest, backupPath);
        this.backupFiles.set(dest, backupPath);
        this.modifiedFiles.push(dest);
      } else {
        this.createdFiles.push(dest);
      }

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(dest));

      // Copy file
      await fs.copy(src, dest, options);

      this.operations.push({
        type: "copyFile",
        src,
        dest,
        options,
      });

      return true;
    } catch (error) {
      console.error(
        chalk.red(`Failed to copy file ${src} to ${dest}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Add a JSON file write operation
   * @param {string} filePath - Path to the JSON file
   * @param {Object} data - JSON data
   * @param {Object} options - Write options
   */
  async writeJson(filePath, data, options = {}) {
    try {
      // Create backup if file exists
      if (await fs.pathExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        this.backupFiles.set(filePath, backupPath);
        this.modifiedFiles.push(filePath);
      } else {
        this.createdFiles.push(filePath);
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(filePath));

      // Write JSON file
      await fs.writeJson(filePath, data, { spaces: 2, ...options });

      this.operations.push({
        type: "writeJson",
        filePath,
        data,
        options,
      });

      return true;
    } catch (error) {
      console.error(
        chalk.red(`Failed to write JSON file ${filePath}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Add a package.json merge operation
   * @param {string} filePath - Path to package.json
   * @param {Object} newData - New package.json data
   */
  async mergePackageJson(filePath, newData) {
    try {
      let existingData = {};

      // Read existing package.json if it exists
      if (await fs.pathExists(filePath)) {
        existingData = await fs.readJson(filePath);
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        this.backupFiles.set(filePath, backupPath);
        this.modifiedFiles.push(filePath);
      } else {
        this.createdFiles.push(filePath);
      }

      // Merge data
      const mergedData = {
        ...existingData,
        ...newData,
        dependencies: {
          ...existingData.dependencies,
          ...newData.dependencies,
        },
        devDependencies: {
          ...existingData.devDependencies,
          ...newData.devDependencies,
        },
        scripts: {
          ...existingData.scripts,
          ...newData.scripts,
        },
      };

      // Ensure directory exists
      await fs.ensureDir(path.dirname(filePath));

      // Write merged package.json
      await fs.writeJson(filePath, mergedData, { spaces: 2 });

      this.operations.push({
        type: "mergePackageJson",
        filePath,
        existingData,
        newData,
        mergedData,
      });

      return true;
    } catch (error) {
      console.error(
        chalk.red(`Failed to merge package.json ${filePath}:`),
        error.message,
      );
      throw error;
    }
  }

  /**
   * Rollback all operations
   */
  async rollback() {
    console.log(chalk.yellow("\n🔄 Rolling back operations..."));

    try {
      // Remove created files
      for (const filePath of this.createdFiles) {
        try {
          if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(chalk.gray(`  Removed: ${filePath}`));
          }
        } catch (error) {
          console.error(
            chalk.red(`  Failed to remove ${filePath}:`),
            error.message,
          );
        }
      }

      // Remove created directories (in reverse order)
      for (const dirPath of this.createdDirs.reverse()) {
        try {
          if (await fs.pathExists(dirPath)) {
            await fs.remove(dirPath);
            console.log(chalk.gray(`  Removed directory: ${dirPath}`));
          }
        } catch (error) {
          console.error(
            chalk.red(`  Failed to remove directory ${dirPath}:`),
            error.message,
          );
        }
      }

      // Restore modified files from backups
      for (const [filePath, backupPath] of this.backupFiles) {
        try {
          if (await fs.pathExists(backupPath)) {
            await fs.copy(backupPath, filePath);
            await fs.remove(backupPath);
            console.log(chalk.gray(`  Restored: ${filePath}`));
          }
        } catch (error) {
          console.error(
            chalk.red(`  Failed to restore ${filePath}:`),
            error.message,
          );
        }
      }

      console.log(chalk.green("✅ Rollback completed"));
    } catch (error) {
      console.error(chalk.red("❌ Rollback failed:"), error.message);
      throw error;
    }
  }

  /**
   * Clean up backup files
   */
  async cleanup() {
    try {
      for (const [filePath, backupPath] of this.backupFiles) {
        if (await fs.pathExists(backupPath)) {
          await fs.remove(backupPath);
        }
      }
      this.backupFiles.clear();
    } catch (error) {
      console.error(
        chalk.red("Failed to cleanup backup files:"),
        error.message,
      );
    }
  }

  /**
   * Get transaction summary
   */
  getSummary() {
    return {
      operationsCount: this.operations.length,
      createdFiles: this.createdFiles.length,
      createdDirs: this.createdDirs.length,
      modifiedFiles: this.modifiedFiles.length,
      backupFiles: this.backupFiles.size,
    };
  }
}

/**
 * Execute operations within a transaction
 * @param {Function} operation - Function to execute
 * @param {Object} options - Transaction options
 * @returns {Object} - Transaction result
 */
export async function executeTransaction(operation, options = {}) {
  const transaction = new Transaction();

  try {
    const result = await operation(transaction);

    // Clean up backup files on success
    await transaction.cleanup();

    return {
      success: true,
      result,
      summary: transaction.getSummary(),
    };
  } catch (error) {
    console.error(chalk.red.bold("\n❌ Transaction failed:"), error.message);

    // Rollback on failure
    if (options.rollback !== false) {
      await transaction.rollback();
    }

    return {
      success: false,
      error: error.message,
      summary: transaction.getSummary(),
    };
  }
}

/**
 * Safe file operation with automatic rollback
 * @param {string} operation - Operation description
 * @param {Function} operationFn - Function to execute
 * @param {Object} options - Options
 */
export async function safeOperation(operation, operationFn, options = {}) {
  console.log(chalk.blue(`\n🔧 ${operation}...`));

  const result = await executeTransaction(operationFn, options);

  if (result.success) {
    console.log(chalk.green(`✅ ${operation} completed successfully`));
    if (options.verbose && result.summary) {
      console.log(
        chalk.gray(`   Files created: ${result.summary.createdFiles}`),
      );
      console.log(
        chalk.gray(`   Directories created: ${result.summary.createdDirs}`),
      );
      console.log(
        chalk.gray(`   Files modified: ${result.summary.modifiedFiles}`),
      );
    }
  } else {
    console.log(chalk.red(`❌ ${operation} failed: ${result.error}`));
  }

  return result;
}
