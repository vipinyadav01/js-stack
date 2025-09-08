// Programmatic API for create-js-stack
import { collectProjectConfig } from "./prompts-modern.js";
import { createProject } from "./generators/project-generator.js";

/**
 * Initialize a new project programmatically
 * @param {string} projectName - Name of the project
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Result object with project details
 */
export async function init(projectName, options = {}) {
  try {
    // Collect configuration
    const config = await collectProjectConfig(projectName, {
      ...options,
      // Disable interactive prompts in programmatic mode
      ci: true,
    });

    // Create the project
    await createProject(config);

    return {
      success: true,
      projectName: config.projectName,
      projectDir: config.projectDir,
      config,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export types and constants
export {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "./types.js";

export default { init };
