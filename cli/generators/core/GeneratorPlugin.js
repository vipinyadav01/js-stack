/**
 * Base Plugin Interface for JS Stack Generator
 * All generator plugins must extend this class
 */

export class GeneratorPlugin {
  constructor(name, version = "1.0.0") {
    this.name = name;
    this.version = version;
    this.hooks = new Map();
    this.dependencies = [];
    this.priority = 0; // Lower numbers run first
  }

  /**
   * Initialize the plugin
   * @param {Object} context - Plugin context
   * @returns {Promise<void>}
   */
  async initialize(context) {
    // Override in subclasses
  }

  /**
   * Execute the plugin
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Plugin result
   */
  async execute(config, context) {
    throw new Error(`Plugin ${this.name} must implement execute method`);
  }

  /**
   * Register a hook
   * @param {string} hookName - Name of the hook
   * @param {Function} hookFunction - Hook function
   */
  registerHook(hookName, hookFunction) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(hookFunction);
  }

  /**
   * Get all hooks for a specific hook name
   * @param {string} hookName - Name of the hook
   * @returns {Array<Function>} - Array of hook functions
   */
  getHooks(hookName) {
    return this.hooks.get(hookName) || [];
  }

  /**
   * Check if plugin can handle the given configuration
   * @param {Object} config - Project configuration
   * @returns {boolean} - True if plugin can handle the config
   */
  canHandle(config) {
    return true; // Override in subclasses
  }

  /**
   * Get plugin metadata
   * @returns {Object} - Plugin metadata
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      dependencies: this.dependencies,
      priority: this.priority,
      hooks: Array.from(this.hooks.keys()),
    };
  }

  /**
   * Validate plugin configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} - Validation result
   */
  validateConfig(config) {
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }

  /**
   * Cleanup plugin resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    // Override in subclasses if needed
  }
}

/**
 * Hook types available in the plugin system
 */
export const HOOK_TYPES = {
  // Pre-generation hooks
  PRE_GENERATE: "preGenerate",
  PRE_TEMPLATE_PROCESS: "preTemplateProcess",
  PRE_DEPENDENCY_INSTALL: "preDependencyInstall",
  
  // Generation hooks
  GENERATE_FILES: "generateFiles",
  PROCESS_TEMPLATES: "processTemplates",
  MERGE_PACKAGE_JSON: "mergePackageJson",
  
  // Post-generation hooks
  POST_TEMPLATE_PROCESS: "postTemplateProcess",
  POST_DEPENDENCY_INSTALL: "postDependencyInstall",
  POST_GENERATE: "postGenerate",
  
  // Validation hooks
  VALIDATE_CONFIG: "validateConfig",
  VALIDATE_OUTPUT: "validateOutput",
  
  // Error handling hooks
  ON_ERROR: "onError",
  ON_WARNING: "onWarning",
};

/**
 * Plugin context interface
 */
export class PluginContext {
  constructor() {
    this.projectDir = null;
    this.templateDir = null;
    this.config = null;
    this.transaction = null;
    this.logger = null;
    this.fileSystem = null;
  }

  /**
   * Set project directory
   * @param {string} projectDir - Project directory path
   */
  setProjectDir(projectDir) {
    this.projectDir = projectDir;
  }

  /**
   * Set template directory
   * @param {string} templateDir - Template directory path
   */
  setTemplateDir(templateDir) {
    this.templateDir = templateDir;
  }

  /**
   * Set configuration
   * @param {Object} config - Project configuration
   */
  setConfig(config) {
    this.config = config;
  }

  /**
   * Set transaction
   * @param {Object} transaction - Transaction object
   */
  setTransaction(transaction) {
    this.transaction = transaction;
  }

  /**
   * Set logger
   * @param {Object} logger - Logger object
   */
  setLogger(logger) {
    this.logger = logger;
  }

  /**
   * Set file system interface
   * @param {Object} fileSystem - File system interface
   */
  setFileSystem(fileSystem) {
    this.fileSystem = fileSystem;
  }
}

export default {
  GeneratorPlugin,
  HOOK_TYPES,
  PluginContext,
};
