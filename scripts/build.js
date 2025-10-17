import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to copy directory recursively
async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildCLI() {
  console.log("Building CLI...");

  try {
    // Clean dist directory
    const distPath = path.join(__dirname, "../dist");
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath, { recursive: true });

    // Copy CLI files instead of bundling to avoid dynamic require issues
    await fs.copyFile(
      path.join(__dirname, "../cli/cli.js"),
      path.join(__dirname, "../dist/cli.js"),
    );

    // Copy library files instead of bundling to avoid dynamic require issues
    await fs.copyFile(
      path.join(__dirname, "../cli/index.js"),
      path.join(__dirname, "../dist/index.js"),
    );

    // Copy the entire CLI directory structure since we're not bundling
    const cliSrcPath = path.join(__dirname, "../cli");
    const cliDestPath = path.join(__dirname, "../dist");

    // Copy all CLI files and directories
    await copyDirectory(cliSrcPath, cliDestPath);

    console.log("✓ Build completed successfully!");
    console.log("✓ CLI optimized for npm distribution");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildCLI();
