import Handlebars from "handlebars";

const filenameTemplate = "middleware.{{#if typescript}}ts{{else}}js{{/if}}";
const context = { typescript: false };

try {
  const template = Handlebars.compile(filenameTemplate);
  const result = template(context);
  console.log("Original:", filenameTemplate);
  console.log("Processed:", result);
} catch (error) {
  console.error("Error:", error);
}
