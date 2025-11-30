/**
 * JS Stack config file management (.js-stack.json)
 */

import fs from "fs-extra";
import path from "path";
import type { ProjectConfig } from "../types.js";

/**
 * Save configuration to .js-stack.json
 */
export async function saveConfig(
  projectDir: string,
  config: Partial<ProjectConfig>,
): Promise<void> {
  const configPath = path.join(projectDir, ".js-stack.json");
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

/**
 * Load configuration from .js-stack.json
 */
export async function loadConfig(
  projectDir: string,
): Promise<Partial<ProjectConfig> | null> {
  const configPath = path.join(projectDir, ".js-stack.json");

  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  try {
    const config = await fs.readJSON(configPath);
    return config as Partial<ProjectConfig>;
  } catch {
    return null;
  }
}
