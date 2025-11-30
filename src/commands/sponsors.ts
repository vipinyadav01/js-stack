/**
 * Sponsors command handler
 */

import * as p from "@clack/prompts";
import boxen from "boxen";

/**
 * Sponsors command - display sponsors
 */
export async function sponsorsCommand(): Promise<void> {
  try {
    const sponsorsBox = boxen(
      "Thank you to all our sponsors!\n\n" +
        "JS Stack is an open-source project.\n" +
        "Consider sponsoring to help us continue development.\n\n" +
        "Visit: https://github.com/sponsors/vipinyadav01",
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      },
    );

    console.log(sponsorsBox);
  } catch (error) {
    p.log.error(
      `Failed to display sponsors: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
