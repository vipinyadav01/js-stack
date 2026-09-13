import chalk from "chalk";
import { PRESET_NAMES } from "../presets.js";

export async function listPresets(options: any) {
  // Read from the preset definitions so this list cannot drift out of sync.
  console.log(chalk.blue("Available presets:"));
  for (const name of PRESET_NAMES) {
    console.log(chalk.green(`- ${name}`));
  }

  if (options.json) {
    console.log(JSON.stringify(PRESET_NAMES, null, 2));
  }
}
