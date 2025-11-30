/**
 * Display project configuration in a formatted way
 */

import * as p from "@clack/prompts";
import type { ProjectConfig } from "../types.js";

/**
 * Display configuration summary
 */
export function displayConfig(config: ProjectConfig): void {
  p.log.info("Project Configuration:");
  console.log();

  const configDisplay = {
    "Project Name": config.projectName,
    Frontend: config.frontend.join(", ") || "None",
    Backend: config.backend,
    Runtime: config.runtime,
    Database: config.database,
    ORM: config.orm,
    API: config.api,
    Auth: config.auth,
    Addons: config.addons.join(", ") || "None",
    Examples: config.examples.join(", ") || "None",
    "Package Manager": config.packageManager,
    Git: config.git ? "Yes" : "No",
    "Install Dependencies": config.install ? "Yes" : "No",
  };

  for (const [key, value] of Object.entries(configDisplay)) {
    console.log(`  ${key.padEnd(20)}: ${value}`);
  }

  console.log();
}
