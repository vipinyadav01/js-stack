/**
 * Builder command handler
 */

import * as p from "@clack/prompts";
import { openURL } from "../utils/open-url.js";

/**
 * Builder command - open web-based builder
 */
export async function builderCommand(): Promise<void> {
  try {
    const builderURL = "https://createjsstack.dev/new";
    p.log.info(`Opening builder: ${builderURL}`);
    await openURL(builderURL);
  } catch (error) {
    p.log.error(
      `Failed to open builder: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
