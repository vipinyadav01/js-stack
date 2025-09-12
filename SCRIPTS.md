# Scripts Documentation 📜

This document explains all the npm scripts available in the `create-js-stack` project and what they do.

## 🏗️ **Build Scripts**

### `npm run build`
**Command**: `turbo run build`
**Purpose**: Builds all packages in the monorepo using Turbo
**What happens**:
- Runs build commands for all workspaces (CLI and web app)
- Uses Turbo for optimized, cached builds
- Generates production-ready artifacts

### `npm run build:cli`
**Command**: `echo 'Building CLI...' && node scripts/build.js || echo 'Build script not found'`
**Purpose**: Builds only the CLI package
**What happens**:
- Displays "Building CLI..." message
- Executes the custom build script (`scripts/build.js`)
- Uses esbuild to bundle the CLI into `dist/` folder
- Adds executable shebang for CLI usage
- Falls back with message if build script is missing

### `npm run build:release`
**Command**: `echo 'Building CLI...' && node scripts/build.js`
**Purpose**: Builds CLI for release/production
**What happens**:
- Same as `build:cli` but without fallback
- Used in CI/CD pipelines for reliable builds
- Ensures CLI is ready for npm publishing

## 🚀 **Development Scripts**

### `npm run dev`
**Command**: `turbo run dev`
**Purpose**: Starts development mode for all packages
**What happens**:
- Runs development servers for all workspaces
- Enables hot reloading and file watching
- Starts both CLI and web development environments

### `npm run dev:cli`
**Command**: `node src/cli.js`
**Purpose**: Runs the CLI in development mode
**What happens**:
- Executes the CLI directly from source (`src/cli.js`)
- No build step required - runs TypeScript/ES modules directly
- Useful for testing CLI commands during development

### `npm run dev:web`
**Command**: `turbo run dev --filter=web`
**Purpose**: Starts only the web app in development mode
**What happens**:
- Runs development server for the web workspace only
- Filters out other packages using Turbo's `--filter` flag
- Faster startup when you only need the web app

## 🧪 **Testing & Quality Scripts**

### `npm run test`
**Command**: `turbo run test`
**Purpose**: Runs all tests across the monorepo
**What happens**:
- Executes test suites for all packages
- Uses Turbo for parallel test execution
- Generates test coverage reports

### `npm run lint`
**Command**: `turbo run lint`
**Purpose**: Lints all code for style and errors
**What happens**:
- Runs ESLint across all packages
- Checks for code style violations
- Identifies potential bugs and issues

### `npm run format`
**Command**: `prettier --write "**/*.{js,jsx,ts,tsx,json,md}"`
**Purpose**: Formats all code using Prettier
**What happens**:
- Automatically formats JavaScript, TypeScript, JSON, and Markdown files
- Ensures consistent code style across the project
- Modifies files in place (`--write` flag)

### `npm run clean`
**Command**: `turbo run clean`
**Purpose**: Cleans build artifacts and cache
**What happens**:
- Removes `dist/`, `build/`, and other build folders
- Clears Turbo cache
- Resets the project to a clean state

## 📦 **Release & Publishing Scripts**

### `npm run changeset`
**Command**: `changeset`
**Purpose**: Creates a new changeset for version management
**What happens**:
- Interactive prompt to describe changes
- Creates changeset files in `.changeset/` folder
- Used for automatic version bumping and changelog generation

### `npm run version-packages`
**Command**: `changeset version`
**Purpose**: Updates package versions based on changesets
**What happens**:
- Reads changeset files
- Bumps package versions according to semantic versioning
- Updates `package.json` files
- Generates/updates CHANGELOG.md

### `npm run release`
**Command**: `changeset publish`
**Purpose**: Publishes packages to npm using changesets
**What happens**:
- Builds packages if needed
- Publishes to npm registry
- Creates git tags for releases
- Updates package versions

## 🐙 **GitHub Publishing Scripts**

### `npm run publish:github`
**Command**: `powershell -ExecutionPolicy Bypass -File scripts/publish-github.ps1`
**Purpose**: Publishes only README.md to GitHub (Windows)
**What happens**:
- Creates temporary directory
- Copies README.md and minimal package.json
- Initializes git repository
- Pushes to GitHub repository
- Keeps source code separate from public documentation

### `npm run publish:github:bash`
**Command**: `bash scripts/publish-github.sh`
**Purpose**: Publishes only README.md to GitHub (Linux/Mac)
**What happens**:
- Same as above but uses bash script
- Cross-platform alternative for non-Windows systems

## 🔧 **System Scripts**

### `npm run prepare`
**Command**: `npx husky install 2>/dev/null || echo 'Husky not required for production'`
**Purpose**: Sets up Git hooks using Husky
**What happens**:
- Installs Husky Git hooks after npm install
- Enables pre-commit formatting and linting
- Fails gracefully in production environments
- **Runs automatically** after `npm install`

### `npm run postinstall`
**Command**: `echo 'Installation complete!'`
**Purpose**: Confirmation message after installation
**What happens**:
- Displays success message after dependencies are installed
- **Runs automatically** after `npm install`
- Provides feedback that setup completed successfully

## 🔄 **Script Dependencies & Workflow**

### Typical Development Workflow:
```bash
# 1. Start development
npm run dev              # or npm run dev:cli

# 2. Make changes and test
npm run lint             # Check code quality
npm run format           # Format code
npm run test             # Run tests

# 3. Build and release
npm run build:cli        # Build for testing
npm run changeset        # Document changes
npm run version-packages # Update versions
npm run release          # Publish to npm
npm run publish:github   # Update GitHub docs
```

### CI/CD Pipeline Usage:
```bash
# GitHub Actions uses:
npm run lint           # Quality checks
npm run build         # Build all packages
npm run test          # Run tests
npm run build:cli     # CLI build for publishing
# Automatic npm publish based on version changes
```

## 📊 **Script Performance Tips**

- **Turbo Caching**: Most scripts use Turbo for faster builds and tests
- **Parallel Execution**: Multiple packages build/test simultaneously
- **Selective Execution**: Use `--filter` flags to run specific packages
- **Watch Mode**: Development scripts include file watching for auto-reload

## 🛠️ **Custom Scripts Location**

- **Build Scripts**: `scripts/build.js` - Custom esbuild configuration
- **GitHub Publishing**: `scripts/publish-github.ps1` & `.sh` - Documentation publishing
- **Turbo Config**: `turbo.json` - Monorepo build pipeline configuration

---

> **💡 Tip**: Use `npm run <script> --help` to see additional options for individual scripts.

> **🔍 Debug**: Add `DEBUG=*` before any script to see detailed execution logs.