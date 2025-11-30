/**
 * Project directory handling and conflict resolution
 */

import fs from "fs-extra";
import path from "path";
import type { DirectoryConflict } from "../types.js";

/**
 * Check if directory exists and is not empty
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) return false;

    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) return false;

    const files = await fs.readdir(dirPath);
    return files.length > 0;
  } catch {
    return false;
  }
}

/**
 * Handle directory conflicts based on strategy
 */
export async function handleDirectoryConflict(
  projectDir: string,
  strategy: DirectoryConflict,
): Promise<string> {
  const exists = await directoryExists(projectDir);

  if (!exists) {
    return projectDir;
  }

  switch (strategy) {
    case "error": {
      throw new Error(
        `Directory already exists: ${projectDir}\nUse --directory-conflict merge|overwrite|increment to handle this.`,
      );
    }

    case "overwrite": {
      await fs.remove(projectDir);
      await fs.ensureDir(projectDir);
      return projectDir;
    }

    case "merge": {
      // Keep existing directory, will merge files
      return projectDir;
    }

    case "increment": {
      let counter = 1;
      let newDir = projectDir;

      while (await directoryExists(newDir)) {
        const dirName = path.basename(projectDir);
        const parentDir = path.dirname(projectDir);
        newDir = path.join(parentDir, `${dirName}-${counter}`);
        counter++;
      }

      await fs.ensureDir(newDir);
      return newDir;
    }

    default: {
      throw new Error(`Unknown directory conflict strategy: ${strategy}`);
    }
  }
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Project name cannot be empty" };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return {
      valid: false,
      error: "Project name contains invalid characters",
    };
  }

  // Check for reserved names
  const reserved = [
    "node_modules",
    "package.json",
    ".git",
    "dist",
    "build",
    "out",
  ];
  if (reserved.includes(name.toLowerCase())) {
    return { valid: false, error: "Project name is reserved" };
  }

  // Check length
  if (name.length > 214) {
    return { valid: false, error: "Project name is too long (max 214)" };
  }

  return { valid: true };
}

/**
 * Get absolute project directory path
 */
export function getProjectDir(
  projectName: string,
  cwd: string = process.cwd(),
): string {
  return path.resolve(cwd, projectName);
}
