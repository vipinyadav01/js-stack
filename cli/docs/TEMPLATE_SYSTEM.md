# Complete Template System Architecture

## Overview

I've built a comprehensive template system for the JS Stack CLI that provides advanced project generation capabilities with variable substitution, conditional rendering, and sophisticated file generation logic.

## System Components

### 1. **Handlebars Helpers** (`cli/utils/handlebars-helpers.js`)

Core helper functions for template processing:

#### Case Conversion Helpers

- `camelCase` - Convert to camelCase
- `pascalCase` - Convert to PascalCase
- `kebabCase` - Convert to kebab-case
- `snakeCase` - Convert to snake_case
- `constantCase` - Convert to CONSTANT_CASE
- `dotCase` - Convert to dot.case

#### Conditional Rendering

- `switch`/`case`/`default` - Switch statement logic
- `ifEquals` - Conditional equality check
- `unless` - Inverse conditional

#### Path & File Utilities

- `pathJoin` - Join paths correctly
- `componentPath` - Generate component file paths
- `dirname` - Get directory name
- `basename` - Get base filename

#### Package.json Utilities

- `frameworkDeps` - Get framework dependencies
- `resolveVersion` - Resolve dependency versions
- `addDependency` - Add to dependencies object

### 2. **Template Engine** (`cli/utils/template-engine.js`)

Advanced template processing with variable substitution:

#### Core Classes

- **TemplateEngine** - Main template processor
- **VariableSubstitution** - Context resolution with transformers
- **DirectoryStructureGenerator** - Recursive directory creation

#### Key Features

- Variable resolution with computed values
- Template transformers for dynamic processing
- Conditional file processing based on language/framework
- Recursive directory structure generation
- Comprehensive error handling and validation

### 3. **File Generator** (`cli/utils/file-generator.js`)

Advanced file generation system for complex project scaffolding:

#### Main Features

- **Project Generation** - Complete project from configuration
- **Feature Generation** - Add specific features to existing projects
- **Framework Structure** - Generate framework-specific directory layouts
- **Hook System** - Pre/post generation hooks
- **Generation Plans** - Structured execution with priorities
- **Error Handling** - Comprehensive error logging and recovery

#### Generation Steps

1. Base project structure
2. Main templates processing
3. Frontend framework integration
4. Backend framework integration
5. Database integration
6. Authentication system
7. Testing setup
8. Docker configuration
9. Configuration files
10. Documentation generation

### 4. **Project Configuration** (`cli/utils/project-config.js`)

Comprehensive configuration management:

#### Configuration Sources

- JSON files
- JavaScript/ES modules
- Inline objects
- Built-in presets

#### Built-in Presets

- `react-app` - Modern React application
- `nextjs-app` - Full-stack Next.js app
- `express-api` - Express.js REST API
- `fullstack-app` - Complete full-stack application
- `nestjs-api` - Enterprise NestJS API
- `vue-app` - Modern Vue 3 application
- `mobile-app` - React Native application

#### Validation System

- Project name format validation
- Framework compatibility checks
- Path validation and conflict detection
- Feature dependency validation

### 5. **Integrated Generator** (`cli/utils/integrated-generator.js`)

Complete integration system that combines all components:

#### Main Functions

- `generateProject()` - Generate complete project from config
- `generateFromPreset()` - Generate using built-in presets
- `addFeature()` - Add features to existing projects
- `updateProject()` - Update existing projects
- `previewProject()` - Generate preview without files

#### Post-Generation Tasks

- Git repository initialization
- Dependency installation
- Code formatting (Prettier)
- Code linting (ESLint)
- README.md generation

## Usage Examples

### 1. Basic Project Generation

```javascript
import { generateProject } from "./cli/utils/integrated-generator.js";

const config = {
  projectName: "my-awesome-app",
  projectPath: "./my-awesome-app",
  frontend: "react",
  backend: "express",
  database: "postgresql",
  typescript: true,
  features: ["auth", "testing", "docker"],
};

const result = await generateProject(config);
```

### 2. Generate from Preset

```javascript
import { generateFromPreset } from "./cli/utils/integrated-generator.js";

const result = await generateFromPreset("fullstack-app", {
  projectName: "my-project",
  projectPath: "./my-project",
});
```

### 3. Add Feature to Existing Project

```javascript
import { IntegratedProjectGenerator } from "./cli/utils/integrated-generator.js";

const generator = new IntegratedProjectGenerator();
await generator.addFeature("./my-project", "auth", {
  provider: "jwt",
  features: ["registration", "password-reset"],
});
```

### 4. Using Advanced Template Features

```handlebars
{{!-- Template file: server.{{#if typescript}}ts{{else}}js{{/if}}.hbs --}}
import
{{#if typescript}}{ Express }{{/if}}
from 'express'; const app{{#if typescript}}: Express{{/if}}
= express();

{{#switch database}}
  {{#case "postgresql"}}
    import pg from 'pg';
  {{/case}}
  {{#case "mongodb"}}
    import mongoose from 'mongoose';
  {{/case}}
{{/switch}}

// Project:
{{pascalCase projectName}}
// Generated:
{{currentDate}}
```

## Directory Structure

```
cli/
├── utils/
│   ├── handlebars-helpers.js     # Core Handlebars helpers
│   ├── template-engine.js        # Template processing engine
│   ├── file-generator.js         # File generation system
│   ├── project-config.js         # Configuration management
│   └── integrated-generator.js   # Complete integration layer
├── templates/                    # Template files
│   ├── auth/                     # Authentication templates
│   ├── backend/                  # Backend framework templates
│   ├── frontend/                 # Frontend framework templates
│   ├── database/                 # Database integration templates
│   ├── testing/                  # Testing setup templates
│   ├── docker/                   # Docker configuration templates
│   └── config/                   # Configuration file templates
├── presets/                      # Custom preset definitions
├── configs/                      # Configuration schemas
└── docs/
    └── HANDLEBARS_HELPERS.md     # Helper documentation
```

## Key Capabilities

### 1. **Variable Substitution**

- Dynamic context resolution
- Computed values and transformers
- Environment variable integration
- Git configuration detection

### 2. **Conditional Processing**

- Language-specific file generation
- Framework-specific logic
- Feature-based conditional rendering
- Environment-based configurations

### 3. **Directory Structure Generation**

- Framework-specific layouts
- Nested directory creation
- Template-based structure definitions
- Validation and conflict resolution

### 4. **Advanced File Processing**

- Binary file handling
- Template compilation and caching
- Error recovery and rollback
- Progress tracking and reporting

### 5. **Extensibility**

- Custom template registration
- Hook system for custom logic
- Variable resolver plugins
- Transformer functions

## Integration with CLI

The system is designed to integrate seamlessly with the existing JS Stack CLI commands:

- `js-stack init` - Uses integrated generator
- `js-stack add` - Uses feature generation
- `js-stack update` - Uses project updates

## Testing & Validation

Comprehensive test coverage includes:

- Unit tests for all helper functions
- Integration tests for template processing
- End-to-end project generation tests
- Configuration validation tests

This complete template system provides everything needed for sophisticated project generation with professional-grade features and extensibility.
