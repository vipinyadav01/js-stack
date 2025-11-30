/**
 * Render ASCII art title with gradient
 */

import figlet from "figlet";
// @ts-ignore - gradient-string doesn't have types
import gradient from "gradient-string";

/**
 * Render "JS Stack" title with gradient
 */
export function renderTitle(): void {
  try {
    const title = figlet.textSync("JS Stack", {
      font: "ANSI Shadow",
      horizontalLayout: "fitted",
      width: 80,
    });

    const gradientTitle = gradient([
      "#5ee7df",
      "#b490ca",
      "#ff6b6b",
      "#4ecdc4",
    ]);
    console.log(gradientTitle(title));
    console.log();
  } catch (error) {
    // Fallback if figlet fails
    console.log("JS Stack");
    console.log();
  }
}
