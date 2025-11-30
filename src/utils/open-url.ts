/**
 * Open URL in browser
 */

import { execa } from "execa";
import process from "process";

/**
 * Open URL in default browser
 */
export async function openURL(url: string): Promise<void> {
  const platform = process.platform;

  let command: string;
  let args: string[];

  if (platform === "win32") {
    command = "cmd";
    args = ["/c", "start", url];
  } else if (platform === "darwin") {
    command = "open";
    args = [url];
  } else {
    command = "xdg-open";
    args = [url];
  }

  try {
    await execa(command, args, { stdio: "ignore" });
  } catch (error) {
    console.warn(
      `Failed to open URL: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.log(`Please open: ${url}`);
  }
}
