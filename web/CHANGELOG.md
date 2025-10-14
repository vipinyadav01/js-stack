# web

## 1.1.16

### Patch Changes

- fix: resolve template system issues and standardize to JavaScript only
  - Fixed broken Handlebars syntax ({{{\if}} to {{/if}})
  - Removed TypeScript conditionals from all templates
  - Standardized to JavaScript/JSX only (no TypeScript variants)
  - Updated all template files to use consistent variable names
  - Fixed template file naming issues
  - Created fix-templates.js script for automated template fixes
  - Updated 75+ template files across all layers
  - Templates now generate clean JavaScript/JSX code without TypeScript conditionals

## 1.0.1

### Patch Changes

- fix the ui
- enhance web interface with modern responsive design and fix TypeScript errors

## 1.0.0

### Major Changes

- npx changeset add --summary "feat: enhance web interface with modern responsive design and fix TypeScript errors"
