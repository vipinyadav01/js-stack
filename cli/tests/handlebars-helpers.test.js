import { test, expect } from "vitest";
import Handlebars from "handlebars";
import "../utils/handlebars-helpers.js";

describe("Handlebars Helpers", () => {
  describe("Case Conversion Helpers", () => {
    test("camelCase helper", () => {
      const template = Handlebars.compile("{{camelCase input}}");
      expect(template({ input: "hello-world" })).toBe("helloWorld");
      expect(template({ input: "hello_world" })).toBe("helloWorld");
      expect(template({ input: "Hello World" })).toBe("helloWorld");
    });

    test("pascalCase helper", () => {
      const template = Handlebars.compile("{{pascalCase input}}");
      expect(template({ input: "hello-world" })).toBe("HelloWorld");
      expect(template({ input: "hello_world" })).toBe("HelloWorld");
    });

    test("kebabCase helper", () => {
      const template = Handlebars.compile("{{kebabCase input}}");
      expect(template({ input: "HelloWorld" })).toBe("hello-world");
      expect(template({ input: "helloWorld" })).toBe("hello-world");
    });

    test("snakeCase helper", () => {
      const template = Handlebars.compile("{{snakeCase input}}");
      expect(template({ input: "HelloWorld" })).toBe("hello_world");
      expect(template({ input: "hello-world" })).toBe("hello_world");
    });

    test("constantCase helper", () => {
      const template = Handlebars.compile("{{constantCase input}}");
      expect(template({ input: "hello-world" })).toBe("HELLO_WORLD");
      expect(template({ input: "helloWorld" })).toBe("HELLO_WORLD");
    });

    test("titleCase helper", () => {
      const template = Handlebars.compile("{{titleCase input}}");
      expect(template({ input: "hello-world" })).toBe("Hello World");
      expect(template({ input: "helloWorld" })).toBe("Hello World");
    });
  });

  describe("Conditional Helpers", () => {
    test("comparison helpers", () => {
      const eqTemplate = Handlebars.compile(
        "{{#if (eq a b)}}equal{{else}}not equal{{/if}}",
      );
      expect(eqTemplate({ a: 5, b: 5 })).toBe("equal");
      expect(eqTemplate({ a: 5, b: 3 })).toBe("not equal");

      const gtTemplate = Handlebars.compile(
        "{{#if (gt a b)}}greater{{else}}not greater{{/if}}",
      );
      expect(gtTemplate({ a: 10, b: 5 })).toBe("greater");
      expect(gtTemplate({ a: 3, b: 5 })).toBe("not greater");
    });

    test("logical helpers", () => {
      const orTemplate = Handlebars.compile(
        "{{#if (or a b)}}true{{else}}false{{/if}}",
      );
      expect(orTemplate({ a: true, b: false })).toBe("true");
      expect(orTemplate({ a: false, b: false })).toBe("false");

      const andTemplate = Handlebars.compile(
        "{{#if (and a b)}}true{{else}}false{{/if}}",
      );
      expect(andTemplate({ a: true, b: true })).toBe("true");
      expect(andTemplate({ a: true, b: false })).toBe("false");
    });

    test("array/string helpers", () => {
      const includesTemplate = Handlebars.compile(
        "{{#if (includes arr val)}}found{{else}}not found{{/if}}",
      );
      expect(includesTemplate({ arr: ["a", "b", "c"], val: "b" })).toBe(
        "found",
      );
      expect(includesTemplate({ arr: ["a", "b", "c"], val: "d" })).toBe(
        "not found",
      );

      const containsTemplate = Handlebars.compile(
        "{{#if (contains str sub)}}contains{{else}}not contains{{/if}}",
      );
      expect(containsTemplate({ str: "hello world", sub: "world" })).toBe(
        "contains",
      );
      expect(containsTemplate({ str: "hello world", sub: "foo" })).toBe(
        "not contains",
      );
    });
  });

  describe("Path Helpers", () => {
    test("pathJoin helper", () => {
      const template = Handlebars.compile(
        '{{pathJoin "src" "components" "Button.tsx"}}',
      );
      expect(template({})).toBe("src/components/Button.tsx");
    });

    test("componentPath helper", () => {
      const template = Handlebars.compile(
        "{{componentPath name framework typescript}}",
      );
      expect(
        template({ name: "Button", framework: "react", typescript: true }),
      ).toBe("components/Button.tsx");
      expect(template({ name: "Header", framework: "vue" })).toBe(
        "components/Header.vue",
      );
    });
  });

  describe("Package.json Helpers", () => {
    test("resolveVersion helper", () => {
      const template = Handlebars.compile("{{resolveVersion pkg}}");
      expect(template({ pkg: "react" })).toBe("^18.0.0");
      expect(template({ pkg: "express" })).toBe("^4.18.0");
      expect(template({ pkg: "unknown-package" })).toBe("^latest");
    });

    test("frameworkDeps helper", () => {
      const template = Handlebars.compile(
        "{{json (frameworkDeps framework typescript)}}",
      );
      const result = JSON.parse(
        template({ framework: "react", typescript: true }),
      );

      expect(result.dependencies).toContain("react");
      expect(result.dependencies).toContain("react-dom");
      expect(result.devDependencies).toContain("@types/react");
      expect(result.devDependencies).toContain("@types/react-dom");
    });
  });

  describe("Utility Helpers", () => {
    test("math helpers", () => {
      const addTemplate = Handlebars.compile("{{add a b}}");
      expect(addTemplate({ a: 5, b: 3 })).toBe("8");

      const multiplyTemplate = Handlebars.compile("{{multiply a b}}");
      expect(multiplyTemplate({ a: 4, b: 7 })).toBe("28");
    });

    test("string helpers", () => {
      const uppercaseTemplate = Handlebars.compile("{{uppercase str}}");
      expect(uppercaseTemplate({ str: "hello" })).toBe("HELLO");

      const capitalizeTemplate = Handlebars.compile("{{capitalize str}}");
      expect(capitalizeTemplate({ str: "hello" })).toBe("Hello");
    });

    test("date helpers", () => {
      const yearTemplate = Handlebars.compile("{{currentYear}}");
      expect(parseInt(yearTemplate({}))).toBe(new Date().getFullYear());
    });
  });
});
