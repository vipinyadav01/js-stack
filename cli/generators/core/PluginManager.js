import {
  GeneratorPlugin,
  HOOK_TYPES,
  PluginContext,
} from "./GeneratorPlugin.js";

/**
 * Plugin Manager for JS Stack Generator
 * Manages plugin registration, execution, and lifecycle
 */

export class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
    this.context = new PluginContext();
    this.executionOrder = [];
  }

  /**
   * Register a plugin
   * @param {GeneratorPlugin} plugin - Plugin to register
   */
  register(plugin) {
    if (!(plugin instanceof GeneratorPlugin)) {
      throw new Error("Plugin must extend GeneratorPlugin");
    }

    // Check for duplicate names
    if (this.plugins.has(plugin.name)) {
      throw new Error(
        `Plugin with name '${plugin.name}' is already registered`,
      );
    }

    // Validate plugin dependencies
    this.validateDependencies(plugin);

    // Register plugin
    this.plugins.set(plugin.name, plugin);

    // Register plugin hooks
    this.registerPluginHooks(plugin);

    // Update execution order
    this.updateExecutionOrder();

    console.log(
      `✅ Plugin '${plugin.name}' v${plugin.version} registered successfully`,
    );
  }

  /**
   * Unregister a plugin
   * @param {string} pluginName - Name of plugin to unregister
   */
  unregister(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' is not registered`);
    }

    // Remove plugin hooks
    this.unregisterPluginHooks(plugin);

    // Remove plugin
    this.plugins.delete(pluginName);

    // Update execution order
    this.updateExecutionOrder();

    console.log(`🗑️ Plugin '${pluginName}' unregistered`);
  }

  /**
   * Get a registered plugin
   * @param {string} pluginName - Name of plugin
   * @returns {GeneratorPlugin|null} - Plugin instance or null
   */
  getPlugin(pluginName) {
    return this.plugins.get(pluginName) || null;
  }

  /**
   * Get all registered plugins
   * @returns {Array<GeneratorPlugin>} - Array of plugin instances
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins that can handle the given configuration
   * @param {Object} config - Project configuration
   * @returns {Array<GeneratorPlugin>} - Array of applicable plugins
   */
  getApplicablePlugins(config) {
    return this.getAllPlugins().filter((plugin) => plugin.canHandle(config));
  }

  /**
   * Execute a hook
   * @param {string} hookName - Name of the hook
   * @param {Object} context - Hook context
   * @returns {Promise<Object>} - Hook execution result
   */
  async executeHook(hookName, context = {}) {
    const hooks = this.hooks.get(hookName) || [];
    let result = context;

    for (const hook of hooks) {
      try {
        result = await hook(result);
      } catch (error) {
        console.error(`❌ Hook '${hookName}' execution failed:`, error.message);
        throw error;
      }
    }

    return result;
  }

  /**
   * Execute all applicable plugins
   * @param {Object} config - Project configuration
   * @param {Object} context - Generation context
   * @returns {Promise<Object>} - Execution results
   */
  async executePlugins(config, context) {
    const applicablePlugins = this.getApplicablePlugins(config);
    const results = {
      success: [],
      failed: [],
      warnings: [],
    };

    // Initialize context
    this.context.setConfig(config);
    Object.assign(this.context, context);

    // Execute plugins in order
    for (const plugin of this.executionOrder) {
      if (!applicablePlugins.includes(plugin)) continue;

      try {
        console.log(`🔧 Executing plugin: ${plugin.name}`);

        // Initialize plugin
        await plugin.initialize(this.context);

        // Execute plugin
        const result = await plugin.execute(config, this.context);

        results.success.push({
          plugin: plugin.name,
          result,
        });

        console.log(`✅ Plugin '${plugin.name}' executed successfully`);
      } catch (error) {
        console.error(
          `❌ Plugin '${plugin.name}' execution failed:`,
          error.message,
        );

        results.failed.push({
          plugin: plugin.name,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Validate plugin dependencies
   * @param {GeneratorPlugin} plugin - Plugin to validate
   */
  validateDependencies(plugin) {
    for (const dependency of plugin.dependencies) {
      if (!this.plugins.has(dependency)) {
        throw new Error(
          `Plugin '${plugin.name}' requires dependency '${dependency}' which is not registered`,
        );
      }
    }
  }

  /**
   * Register plugin hooks
   * @param {GeneratorPlugin} plugin - Plugin to register hooks for
   */
  registerPluginHooks(plugin) {
    for (const [hookName, hookFunctions] of plugin.hooks) {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, []);
      }

      // Add hooks with plugin context
      for (const hookFunction of hookFunctions) {
        const wrappedHook = async (context) => {
          try {
            return await hookFunction.call(plugin, context);
          } catch (error) {
            console.error(
              `❌ Hook '${hookName}' in plugin '${plugin.name}' failed:`,
              error.message,
            );
            throw error;
          }
        };

        this.hooks.get(hookName).push(wrappedHook);
      }
    }
  }

  /**
   * Unregister plugin hooks
   * @param {GeneratorPlugin} plugin - Plugin to unregister hooks for
   */
  unregisterPluginHooks(plugin) {
    // Note: This is a simplified implementation
    // In a more complex system, you'd track which hooks belong to which plugin
    for (const hookName of plugin.hooks.keys()) {
      const hooks = this.hooks.get(hookName) || [];
      // Remove hooks that belong to this plugin
      // This is simplified - in practice you'd need to track hook ownership
    }
  }

  /**
   * Update execution order based on plugin priorities and dependencies
   */
  updateExecutionOrder() {
    const plugins = Array.from(this.plugins.values());

    // Sort by priority (lower numbers first)
    plugins.sort((a, b) => a.priority - b.priority);

    // Apply dependency ordering
    const ordered = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (plugin) => {
      if (visiting.has(plugin.name)) {
        throw new Error(
          `Circular dependency detected involving plugin '${plugin.name}'`,
        );
      }

      if (visited.has(plugin.name)) {
        return;
      }

      visiting.add(plugin.name);

      // Visit dependencies first
      for (const depName of plugin.dependencies) {
        const dep = this.plugins.get(depName);
        if (dep) {
          visit(dep);
        }
      }

      visiting.delete(plugin.name);
      visited.add(plugin.name);
      ordered.push(plugin);
    };

    for (const plugin of plugins) {
      visit(plugin);
    }

    this.executionOrder = ordered;
  }

  /**
   * Get plugin execution order
   * @returns {Array<string>} - Array of plugin names in execution order
   */
  getExecutionOrder() {
    return this.executionOrder.map((plugin) => plugin.name);
  }

  /**
   * Get plugin statistics
   * @returns {Object} - Plugin statistics
   */
  getStats() {
    return {
      totalPlugins: this.plugins.size,
      totalHooks: Array.from(this.hooks.values()).reduce(
        (sum, hooks) => sum + hooks.length,
        0,
      ),
      executionOrder: this.getExecutionOrder(),
      plugins: Array.from(this.plugins.values()).map((plugin) =>
        plugin.getMetadata(),
      ),
    };
  }

  /**
   * Cleanup all plugins
   * @returns {Promise<void>}
   */
  async cleanup() {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.cleanup();
      } catch (error) {
        console.error(
          `❌ Plugin '${plugin.name}' cleanup failed:`,
          error.message,
        );
      }
    }
  }
}

export default PluginManager;
