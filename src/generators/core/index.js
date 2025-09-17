/**
 * Core generator module exports
 * Base classes and interfaces for the plugin system
 */

export { GeneratorPlugin, HOOK_TYPES, PluginContext } from "./GeneratorPlugin.js";
export { PluginManager } from "./PluginManager.js";
export { BaseGenerator } from "./BaseGenerator.js";
export { GeneratorPipeline, PIPELINE_STAGES, createStandardPipeline } from "./GeneratorPipeline.js";

export default {
  GeneratorPlugin,
  PluginManager,
  BaseGenerator,
  GeneratorPipeline,
  HOOK_TYPES,
  PIPELINE_STAGES,
};
