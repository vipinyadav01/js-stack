/**
 * Docs command handler
 */

import * as p from "@clack/prompts";
import { openURL } from "../utils/open-url.js";

/**
 * Docs command - open documentation in browser
 */
export async function docsCommand(): Promise<void> {
  try {
    const docsURL = "https://createjsstack.dev/docs";
    p.log.info(`Opening documentation: ${docsURL}`);
    await openURL(docsURL);
  } catch (error) {
    p.log.error(
      `Failed to open docs: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
