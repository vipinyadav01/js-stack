/**
 * Main CLI router and exports
 * Programmatic API for JS Stack CLI
 */

export * from "./types.js";
export * from "./constants.js";
export * from "./validation.js";
export * from "./helpers/core/create-project.js";
export * from "./helpers/core/template-manager.js";
export * from "./utils/template-processor.js";
export * from "./utils/project-directory.js";
export * from "./utils/generate-reproducible-command.js";
export * from "./utils/js-stack-config.js";

// Re-export for programmatic use
export { initCommand } from "./commands/init.js";
export { createProject } from "./helpers/core/create-project.js";
