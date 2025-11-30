/**
 * Code formatter using Biome
 */

import { execa } from "execa";
import path from "path";
import fs from "fs-extra";

/**
 * Format generated code with Biome
 */
export async function formatWithBiome(
  projectDir: string,
  files?: string[],
): Promise<void> {
  try {
    // Check if Biome is available
    try {
      await execa("npx", ["@biomejs/biome", "--version"], {
        cwd: projectDir,
      });
    } catch {
      // Biome not available, skip formatting
      return;
    }

    // Format files
    const biomeArgs = ["@biomejs/biome", "format", "--write"];

    if (files && files.length > 0) {
      biomeArgs.push(...files);
    } else {
      biomeArgs.push(".");
    }

    await execa("npx", biomeArgs, {
      cwd: projectDir,
      stdio: "inherit",
    });
  } catch (error) {
    // Non-fatal error - continue even if formatting fails
    console.warn(
      `Warning: Failed to format code with Biome: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Create Biome configuration file
 */
export async function createBiomeConfig(projectDir: string): Promise<void> {
  const biomeConfig = {
    $schema: "https://biomejs.dev/schemas/1.8.0/schema.json",
    vcs: {
      enabled: true,
      clientKind: "git",
      useIgnoreFile: true,
    },
    files: {
      ignoreUnknown: false,
      ignore: ["node_modules", "dist", "build", ".next", ".turbo"],
    },
    formatter: {
      enabled: true,
      formatWithErrors: false,
      indentStyle: "space",
      indentWidth: 2,
      lineEnding: "lf",
      lineWidth: 100,
    },
    linter: {
      enabled: true,
      rules: {
        recommended: true,
      },
    },
    javascript: {
      formatter: {
        quoteStyle: "double",
        jsxQuoteStyle: "double",
        trailingCommas: "es5",
        semicolons: "always",
        arrowParentheses: "always",
      },
    },
  };

  const configPath = path.join(projectDir, "biome.json");
  await fs.writeJSON(configPath, biomeConfig, { spaces: 2 });
}
