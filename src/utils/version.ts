import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Try dev path first (src/utils/ -> src/ -> root)
let packageJsonPath = join(__dirname, "../../package.json");

// If not found, try prod path (dist/ -> root)
if (!existsSync(packageJsonPath)) {
  packageJsonPath = join(__dirname, "../package.json");
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

export const version = packageJson.version;
