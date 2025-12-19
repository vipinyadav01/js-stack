import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildCLI() {
  console.log("Building CLI...");

  try {
    // Build CLI using tsdown (this creates dist/cli.js and dist/index.js)
    console.log("Running build:cli...");
    execSync("npm run build:cli", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });

    // Verify dist files exist
    const distPath = path.join(__dirname, "../dist");
    const cliFile = path.join(distPath, "cli.js");
    const indexFile = path.join(distPath, "index.js");

    try {
      await fs.access(cliFile);
      await fs.access(indexFile);
      console.log("✓ Build completed successfully!");
      console.log("✓ CLI files generated in dist/");
    } catch (error) {
      throw new Error(
        "Build completed but dist/cli.js or dist/index.js not found",
      );
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildCLI();
