import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildCLI() {
  console.log("Building CLI...");

  try {
    // Clean dist directory
    const distPath = path.join(__dirname, "../dist");
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath, { recursive: true });

    // Build the CLI
    await build({
      entryPoints: [path.join(__dirname, "../src/cli.js")],
      bundle: true,
      platform: "node",
      target: "node18",
      outfile: path.join(__dirname, "../dist/cli.js"),
      format: "esm",
      minify: true,
      sourcemap: false,
      banner: {
        js: "#!/usr/bin/env node",
      },
      external: [
        "@clack/prompts",
        "chalk",
        "commander",
        "execa",
        "fs-extra",
        "globby",
        "handlebars",
        "ora",
        "validate-npm-package-name",
        "yup",
        "gradient-string",
        "figlet",
        "boxen",
        "cli-table3",
        "terminal-link",
        "cli-spinners",
        "nanospinner",
        "chalk-animation",
      ],
    });

    // Build the library entry point
    await build({
      entryPoints: [path.join(__dirname, "../src/index.js")],
      bundle: true,
      platform: "node",
      target: "node18",
      outfile: path.join(__dirname, "../dist/index.js"),
      format: "esm",
      minify: true,
      sourcemap: false,
      external: [
        "@clack/prompts",
        "chalk",
        "commander",
        "execa",
        "fs-extra",
        "globby",
        "handlebars",
        "ora",
        "validate-npm-package-name",
        "yup",
        "gradient-string",
        "figlet",
        "boxen",
        "cli-table3",
        "terminal-link",
        "cli-spinners",
        "nanospinner",
        "chalk-animation",
      ],
    });

    // CLI is ready with shebang for direct execution

    console.log("✓ Build completed successfully!");
    console.log("✓ CLI optimized for npm distribution");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildCLI();
