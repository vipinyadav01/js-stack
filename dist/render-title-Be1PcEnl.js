import figlet from "figlet";
import gradient from "gradient-string";

//#region src/utils/render-title.ts
/**

* Render "JS Stack" title with gradient

*/
function renderTitle() {
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
    console.log("JS Stack");
    console.log();
  }
}

//#endregion
export { renderTitle };
