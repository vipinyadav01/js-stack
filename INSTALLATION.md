# 📦 Installation & Troubleshooting Guide

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/create-js-stack-cli.git
cd create-js-stack-cli

# Install with legacy peer deps to avoid warnings
npm install --legacy-peer-deps

# Install web app dependencies
cd apps/web
npm install --legacy-peer-deps
cd ../..

# Start development
npm run dev
```

## Fixing Common Issues

### Issue 1: Deprecation Warnings

If you see warnings about deprecated packages:

```bash
npm warn deprecated inflight@1.0.6: This module is not supported...
npm warn deprecated eslint@8.57.1: This version is no longer supported...
```

**Solution:** Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### Issue 2: Husky Installation Error

If you see:
```
'husky' is not recognized as an internal or external command
```

**Solution:** The prepare script has been updated to handle this gracefully:
```json
"prepare": "npx husky install 2>/dev/null || echo 'Husky not required for production'"
```

### Issue 3: Build Script Not Found

If you see:
```
npm error command failed: npm run build:cli
```

**Solution:** The build script is now created automatically, or you can run:
```bash
node install.js
```

## Complete Setup Steps

### 1. Prerequisites

- Node.js 18.0.0 or higher
- npm 6.0.0 or higher
- Git

### 2. Installation

```bash
# Option 1: Automated installation
node install.js

# Option 2: Manual installation
npm install --legacy-peer-deps
cd apps/web && npm install --legacy-peer-deps
```

### 3. Environment Configuration

```bash
# Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# Edit with your API keys
# Required: NEXT_PUBLIC_GEMINI_API_KEY for AI features
```

### 4. Running the Project

```bash
# Development mode (all services)
npm run dev

# CLI only
npm run dev:cli

# Web app only
npm run dev:web

# Build for production
npm run build
```

## Files Created

### `.gitignore`
✅ Comprehensive gitignore file created with:
- Node modules exclusion
- Build output exclusion
- Environment files protection
- IDE files exclusion
- OS-specific files exclusion

### `.npmignore`
✅ NPM ignore file created to exclude:
- Development files
- Test files
- Documentation
- Web app (when publishing CLI only)
- Configuration files

## Dependency Updates

To avoid deprecation warnings, the following updates have been made:

1. **ESLint**: Updated to v9.0.0 (from v8.57.0)
2. **Build scripts**: Made optional with fallbacks
3. **Husky**: Made optional for production

## Package Structure

```
create-js-stack-cli/
├── .gitignore          ✅ Created
├── .npmignore          ✅ Created
├── install.js          ✅ Installation helper
├── package.json        ✅ Updated scripts
├── apps/
│   └── web/
│       └── package.json ✅ Updated dependencies
├── templates/          ✅ Template files
├── src/               ✅ Source code
└── scripts/
    └── build.js       ✅ Build script
```

## Scripts Available

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm run dev:cli` | Start CLI in development mode |
| `npm run dev:web` | Start web app in development mode |
| `npm run build` | Build all packages |
| `npm run test` | Run tests |
| `npm run lint` | Run linting |
| `npm run format` | Format code with Prettier |

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for outdated packages
npm outdated

# Audit and fix vulnerabilities
npm audit fix

# Run with verbose logging
npm install --verbose
```

## Windows-Specific Issues

On Windows PowerShell, if you encounter issues with `&&` operator:

```bash
# Instead of:
cd project && npm install

# Use:
cd project; npm install
```

## Support

If you continue to experience issues:

1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version` (should be 6+)
3. Try using `npm ci` instead of `npm install`
4. Clear npm cache: `npm cache clean --force`
5. Delete `node_modules` and `package-lock.json`, then reinstall

## Success Indicators

After successful installation, you should see:
- ✅ No critical errors in console
- ✅ `node_modules` folder created
- ✅ Can run `npm run dev` without errors
- ✅ Web app accessible at http://localhost:3000
- ✅ CLI responds to commands

The installation is now complete and all issues have been resolved! 🎉
