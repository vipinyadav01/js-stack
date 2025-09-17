/**
 * Configuration module exports
 * Centralized configuration management for JS Stack Generator
 */

export { ConfigManager } from "./ConfigManager.js";
export { ConfigResolver, CLIArgsParser, ConfigResolutionHelper } from "./ConfigResolver.js";
export { 
  DefaultConfigHelper,
  DEFAULT_CONFIGS,
  PRESET_CONFIGS,
  TECHNOLOGY_DEFAULTS,
  PACKAGE_MANAGER_CONFIGS,
} from "./DefaultConfigs.js";
export {
  ValidationHelper,
  TECHNOLOGY_OPTIONS,
  ProjectConfigSchema,
  CLIOptionsSchema,
  TechnologyCompatibilitySchema,
} from "./ValidationSchemas.js";

// Re-export commonly used constants for convenience
export const {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} = TECHNOLOGY_OPTIONS;

export default {
  ConfigManager,
  ConfigResolver,
  DefaultConfigHelper,
  ValidationHelper,
  TECHNOLOGY_OPTIONS,
  DEFAULT_CONFIGS,
  PRESET_CONFIGS,
};
