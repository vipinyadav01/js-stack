/**
 * Generate reproducible command from configuration
 */

import type { ProjectConfig } from "../types.js";

/**
 * Generate CLI command that reproduces the exact configuration
 */
export function generateReproducibleCommand(config: ProjectConfig): string {
  const parts: string[] = ["create-js-stack", config.projectName];

  // Add flags
  if (config.frontend.length > 0 && !config.frontend.includes("none")) {
    parts.push(`--frontend ${config.frontend.join(",")}`);
  }

  if (config.backend !== "none") {
    parts.push(`--backend ${config.backend}`);
  }

  if (config.runtime !== "none") {
    parts.push(`--runtime ${config.runtime}`);
  }

  if (config.database !== "none") {
    parts.push(`--database ${config.database}`);
  }

  if (config.orm !== "none") {
    parts.push(`--orm ${config.orm}`);
  }

  if (config.api !== "none") {
    parts.push(`--api ${config.api}`);
  }

  if (config.auth !== "none") {
    parts.push(`--auth ${config.auth}`);
  }

  if (config.addons.length > 0) {
    parts.push(`--addons ${config.addons.join(",")}`);
  }

  if (config.examples.length > 0 && !config.examples.includes("none")) {
    parts.push(`--examples ${config.examples.join(",")}`);
  }

  if (config.dbSetup !== "none") {
    parts.push(`--db-setup ${config.dbSetup}`);
  }

  if (config.webDeploy !== "none") {
    parts.push(`--web-deploy ${config.webDeploy}`);
  }

  if (config.serverDeploy !== "none") {
    parts.push(`--server-deploy ${config.serverDeploy}`);
  }

  if (config.packageManager !== "npm") {
    parts.push(`--package-manager ${config.packageManager}`);
  }

  if (!config.git) {
    parts.push("--no-git");
  }

  if (!config.install) {
    parts.push("--no-install");
  }

  return parts.join(" ");
}
