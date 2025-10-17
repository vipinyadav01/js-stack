import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";
import { TECHNOLOGY_OPTIONS } from "../../config/ValidationSchemas.js";

/**
 * Dependency Plugin for JS Stack Generator
 * Handles dependency installation and management
 */

export class DependencyPlugin extends GeneratorPlugin {
  constructor() {
    super("DependencyPlugin", "1.0.0");
    this.priority = 50; // Lower priority - runs after file operations
    this.dependencies = ["PackageJsonPlugin"];

    this.registerHook(
      HOOK_TYPES.PRE_DEPENDENCY_INSTALL,
      this.preDependencyInstall,
    );
    this.registerHook(
      HOOK_TYPES.POST_DEPENDENCY_INSTALL,
      this.postDependencyInstall,
    );
  }

  /**
   * Check if plugin can handle the configuration
   * @param {Object} config - Project configuration
   * @returns {boolean} - True if plugin can handle the config
   */
  canHandle(config) {
    return config.install !== false; // Only run if installation is enabled
  }

  /**
   * Execute the plugin
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Plugin result
   */
  async execute(config, context) {
    try {
      console.log("📦 DependencyPlugin: Starting dependency installation");

      if (!config.install) {
        return {
          success: true,
          skipped: true,
          message: "Dependency installation skipped",
        };
      }

      // Install dependencies
      const installResult = await this.installDependencies(config, context);

      return {
        success: installResult.success,
        installed: installResult.installed,
        errors: installResult.errors,
        message: installResult.success
          ? "Dependencies installed successfully"
          : "Dependency installation failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Dependency installation failed",
      };
    }
  }

  /**
   * Install dependencies
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Installation result
   */
  async installDependencies(config, context) {
    const { spawn } = await import("child_process");
    const path = await import("path");

    const projectDir = context.projectDir;
    const packageManager =
      config.packageManager || TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM;

    return new Promise((resolve) => {
      const installCommand = this.getInstallCommand(packageManager);
      const installArgs = this.getInstallArgs(packageManager);

      console.log(`📦 Installing dependencies with ${packageManager}...`);

      const child = spawn(installCommand, installArgs, {
        cwd: projectDir,
        stdio: "inherit",
        shell: true,
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve({
            success: true,
            installed: true,
            errors: [],
          });
        } else {
          resolve({
            success: false,
            installed: false,
            errors: [`Installation failed with exit code ${code}`],
          });
        }
      });

      child.on("error", (error) => {
        resolve({
          success: false,
          installed: false,
          errors: [error.message],
        });
      });
    });
  }

  /**
   * Get install command for package manager
   * @param {string} packageManager - Package manager name
   * @returns {string} - Install command
   */
  getInstallCommand(packageManager) {
    switch (packageManager) {
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.YARN:
        return "yarn";
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM:
        return "pnpm";
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.BUN:
        return "bun";
      default:
        return "npm";
    }
  }

  /**
   * Get install arguments for package manager
   * @param {string} packageManager - Package manager name
   * @returns {Array<string>} - Install arguments
   */
  getInstallArgs(packageManager) {
    switch (packageManager) {
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.YARN:
        return ["install"];
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM:
        return ["install"];
      case TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.BUN:
        return ["install"];
      default:
        return ["install"];
    }
  }

  /**
   * Pre-dependency install hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async preDependencyInstall(context) {
    console.log("📦 DependencyPlugin: Preparing dependency installation");
    return context;
  }

  /**
   * Post-dependency install hook
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Updated context
   */
  async postDependencyInstall(context) {
    console.log("📦 DependencyPlugin: Dependency installation completed");
    return context;
  }
}

export default DependencyPlugin;
