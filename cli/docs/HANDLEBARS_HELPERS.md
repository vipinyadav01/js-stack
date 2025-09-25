# Handlebars Helpers Documentation

This document describes the comprehensive set of Handlebars helpers available in the JS Stack CLI for template processing.

## Overview

The JS Stack CLI provides a rich set of Handlebars helpers that enable powerful templating capabilities for generating project files, configurations, and code snippets. These helpers are automatically registered and available in all template files.

## Case Conversion Helpers

### `camelCase`

Converts strings to camelCase format.

```handlebars
{{camelCase "hello-world"}}
<!-- helloWorld -->
{{camelCase "hello_world"}}
<!-- helloWorld -->
{{camelCase "Hello World"}}
<!-- helloWorld -->
```

### `pascalCase`

Converts strings to PascalCase format.

```handlebars
{{pascalCase "hello-world"}}
<!-- HelloWorld -->
{{pascalCase "hello_world"}}
<!-- HelloWorld -->
{{pascalCase "hello world"}}
<!-- HelloWorld -->
```

### `kebabCase`

Converts strings to kebab-case format.

```handlebars
{{kebabCase "HelloWorld"}}
<!-- hello-world -->
{{kebabCase "helloWorld"}}
<!-- hello-world -->
{{kebabCase "hello_world"}}
<!-- hello-world -->
```

### `snakeCase`

Converts strings to snake_case format.

```handlebars
{{snakeCase "HelloWorld"}}
<!-- hello_world -->
{{snakeCase "hello-world"}}
<!-- hello_world -->
{{snakeCase "Hello World"}}
<!-- hello_world -->
```

### `constantCase`

Converts strings to CONSTANT_CASE format.

```handlebars
{{constantCase "hello-world"}}
<!-- HELLO_WORLD -->
{{constantCase "helloWorld"}}
<!-- HELLO_WORLD -->
```

### `titleCase`

Converts strings to Title Case format.

```handlebars
{{titleCase "hello-world"}}
<!-- Hello World -->
{{titleCase "helloWorld"}}
<!-- Hello World -->
```

## Conditional Rendering Helpers

### Basic Comparisons

```handlebars
{{#if (eq frontend "react")}}
  <!-- React specific code -->
{{/if}}

{{#if (ne backend "express")}}
  <!-- Non-Express specific code -->
{{/if}}

{{#if (gt port 3000)}}
  <!-- Port is greater than 3000 -->
{{/if}}

{{#if (gte version "2.0.0")}}
  <!-- Version is 2.0.0 or higher -->
{{/if}}

{{#if (lt users 100)}}
  <!-- Less than 100 users -->
{{/if}}

{{#if (lte memory 512)}}
  <!-- Memory is 512MB or less -->
{{/if}}
```

### Logical Operations

```handlebars
{{#if (or (eq frontend "react") (eq frontend "vue"))}}
  <!-- React OR Vue -->
{{/if}}

{{#if (and typescript (eq testFramework "jest"))}}
  <!-- TypeScript AND Jest -->
{{/if}}

{{#if (not production)}}
  <!-- Not in production -->
{{/if}}
```

### Array and String Operations

```handlebars
{{#if (includes features "authentication")}}
  <!-- Has authentication feature -->
{{/if}}

{{#if (contains projectName "admin")}}
  <!-- Project name contains "admin" -->
{{/if}}

{{#if (startsWith filename "test")}}
  <!-- Filename starts with "test" -->
{{/if}}

{{#if (endsWith filename ".spec.js")}}
  <!-- Filename ends with ".spec.js" -->
{{/if}}
```

### Switch/Case Helper

```handlebars
{{#switch database}}
  {{#case "mongodb"}}
    import mongoose from 'mongoose';
  {{/case}}
  {{#case "postgresql"}}
    import pg from 'pg';
  {{/case}}
  {{#default}}
    // No database selected
  {{/default}}
{{/switch}}
```

## File Path Generation Helpers

### `pathJoin`

Joins path segments properly.

```handlebars
{{pathJoin "src" "components" "Button.tsx"}} <!-- src/components/Button.tsx -->
```

### `extname`, `basename`, `dirname`

Path manipulation utilities.

```handlebars
{{extname "file.tsx"}}
<!-- .tsx -->
{{basename "src/components/Button.tsx"}}
<!-- Button.tsx -->
{{dirname "src/components/Button.tsx"}}
<!-- src/components -->
```

### `componentPath`

Generates framework-specific component paths.

```handlebars
{{componentPath "Button" "react" typescript=true}}
<!-- components/Button.tsx -->
{{componentPath "Header" "vue"}}
<!-- components/Header.vue -->
{{componentPath "Service" "angular"}}
<!-- components/Service.ts -->
```

### `testPath`

Generates test file paths.

```handlebars
{{testPath "src/Button.jsx" "jest"}}
<!-- src/__tests__/Button.spec.jsx -->
{{testPath "src/utils.js" "vitest"}}
<!-- src/__tests__/utils.test.js -->
```

### `configPath`

Generates configuration file paths.

```handlebars
{{configPath "webpack" "js"}}
<!-- webpack.config.js -->
{{configPath "tsconfig" "json"}}
<!-- tsconfig.config.json -->
```

## Package.json Dependency Injection Helpers

### `dependencies`

Generates dependencies object.

```handlebars
"dependencies": {{dependencies (array "react" "express" "lodash")}}
```

### `devDependencies`

Generates dev dependencies object.

```handlebars
"devDependencies": {{devDependencies (array "jest" "eslint" "prettier")}}
```

### `scripts`

Generates scripts object.

```handlebars
"scripts":
{{scripts (object "dev" "vite dev" "build" "vite build" "test" "jest")}}
```

### `frameworkDeps`

Gets framework-specific dependencies.

```handlebars
{{#with (frameworkDeps "react" true)}}
  "dependencies": {
  {{#each dependencies}}
    "{{this}}": "{{resolveVersion this}}"{{#unless @last}},{{/unless}}
  {{/each}}
  }
{{/with}}
```

### `resolveVersion`

Resolves version numbers for popular packages.

```handlebars
"react": "{{resolveVersion "react"}}"
<!-- "react": "^18.0.0" -->
"express": "{{resolveVersion "express"}}"
<!-- "express": "^4.18.0" -->
```

## Utility Helpers

### JSON and Data

```handlebars
{{json data 4}}
<!-- JSON with 4-space indent -->
{{length myArray}}
<!-- Array length -->
```

### Math Operations

```handlebars
{{add 5 3}}
<!-- 8 -->
{{subtract 10 4}}
<!-- 6 -->
{{multiply 3 7}}
<!-- 21 -->
{{divide 15 3}}
<!-- 5 -->
```

### String Manipulation

```handlebars
{{uppercase "hello"}}
<!-- HELLO -->
{{lowercase "WORLD"}}
<!-- world -->
{{capitalize "hello"}}
<!-- Hello -->
{{trim "  spaces  "}}
<!-- spaces -->
```

### Date Helpers

```handlebars
{{currentYear}}
<!-- 2025 -->
{{currentDate}}
<!-- 2025-01-15 -->
{{currentDate "ISO"}}
<!-- 2025-01-15T10:30:00.000Z -->
```

## Advanced Usage Examples

### Dynamic Component Generation

```handlebars
{{#each components}}
import {{pascalCase name}} from './{{componentPath name ../frontend ../typescript}}';
{{/each}}

const components = {
{{#each components}}
  {{camelCase name}}: {{pascalCase name}}{{#unless @last}},{{/unless}}
{{/each}}
};
```

### Conditional Package.json Generation

```handlebars
{
  "name": "{{kebabCase projectName}}",
  "scripts": {
{{#if (eq frontend "nextjs")}}
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
{{else if (eq frontend "vite")}}
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
{{else}}
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
{{/if}}
{{#if (includes features "test")}}
    ,"test": "{{#if (eq testFramework "vitest")}}vitest{{else}}jest{{/if}}"
{{/if}}
  },
  "dependencies": {
{{#each (frameworkDeps frontend typescript).dependencies}}
    "{{this}}": "{{resolveVersion this}}"{{#unless @last}},{{/unless}}
{{/each}}
  }
}
```

### Environment-Specific Configuration

```handlebars
{{#switch environment}}
  {{#case "development"}}
    const config = { apiUrl: 'http://localhost:{{port}}', debug: true };
  {{/case}}
  {{#case "production"}}
    const config = { apiUrl: 'https://{{kebabCase projectName}}.com', debug:
    false };
  {{/case}}
  {{#default}}
    const config = { apiUrl: process.env.API_URL, debug: process.env.NODE_ENV
    === 'development' };
  {{/default}}
{{/switch}}
```

## Best Practices

1. **Case Consistency**: Use appropriate case helpers consistently throughout your templates
2. **Path Generation**: Always use path helpers instead of manual string concatenation
3. **Conditional Logic**: Prefer switch/case for complex conditionals over nested if/else
4. **Version Management**: Use `resolveVersion` for consistent package versions
5. **Type Safety**: Include TypeScript-specific logic when `typescript` flag is true

## Custom Helper Extension

To add custom helpers, modify `cli/utils/handlebars-helpers.js`:

```javascript
Handlebars.registerHelper("myCustomHelper", function (value) {
  // Your custom logic here
  return transformedValue;
});
```

All helpers are automatically available in templates after registration.
