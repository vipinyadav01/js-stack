# 🚀 Publishing & Deployment Guide

Complete guide for publishing your JS Stack Builder to GitHub, NPM, and deploying to Cloudflare Pages.

## 📋 Table of Contents

1. [Pre-Publishing Checklist](#pre-publishing-checklist)
2. [GitHub Publishing](#github-publishing)
3. [NPM Publishing](#npm-publishing)
4. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
5. [Automated CI/CD Pipeline](#automated-cicd-pipeline)
6. [Post-Deployment Monitoring](#post-deployment-monitoring)

---

## ✅ Pre-Publishing Checklist

### 1. Code Quality Checks

```bash
# Run all quality checks
npm run prerelease

# Individual checks
npm run lint           # ESLint check
npm run type-check     # TypeScript validation
npm run test           # Run all tests
npm run test:coverage  # Check test coverage
npm run build          # Ensure builds succeed
```

### 2. Update Version Numbers

```bash
# Use changeset for version management
npx changeset

# Follow prompts to:
# 1. Select packages to update
# 2. Choose version bump type (major/minor/patch)
# 3. Add changelog entry

# Apply version changes
npx changeset version

# Review changes
git status
```

### 3. Update Documentation

```bash
# Update all documentation
npm run docs:update

# Files to update:
# - README.md (version badges, features)
# - CHANGELOG.md (latest changes)
# - API.md (new APIs)
# - USAGE-GUIDE.md (new features)
```

### 4. Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

---

## 🐙 GitHub Publishing

### 1. Repository Setup

```bash
# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/yourusername/create-js-stack-cli.git

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# Turbo
.turbo/

# Vercel
.vercel/
EOF
```

### 2. GitHub Actions Setup

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main
      - master

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build packages
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm run release
          version: npm run version
          commit: "chore: release"
          title: "chore: release"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Deploy to Cloudflare Pages
        if: steps.changesets.outputs.published == 'true'
        run: npm run deploy:cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### 3. Create GitHub Release

```bash
# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin v1.0.0

# Or use GitHub CLI
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes "See CHANGELOG.md for details" \
  --draft
```

### 4. GitHub Pages Documentation

Create `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'README.md'

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Build documentation
        run: |
          npm ci
          npm run docs:build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs-dist
```

---

## 📦 NPM Publishing

### 1. NPM Account Setup

```bash
# Login to NPM
npm login

# Verify login
npm whoami

# Add NPM token for CI/CD
npm token create --read-only
# Save this token as NPM_TOKEN in GitHub Secrets
```

### 2. Package Configuration

Update `package.json`:

```json
{
  "name": "create-js-stack-cli",
  "version": "1.0.0",
  "description": "🚀 Advanced JavaScript project scaffolding CLI with AI assistance",
  "keywords": [
    "cli",
    "scaffold",
    "generator",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "express",
    "ai",
    "gemini"
  ],
  "homepage": "https://github.com/yourusername/create-js-stack-cli",
  "bugs": {
    "url": "https://github.com/yourusername/create-js-stack-cli/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/create-js-stack-cli.git"
  },
  "license": "MIT",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://yourwebsite.com"
  },
  "bin": {
    "create-js-stack": "./bin/cli.js"
  },
  "files": [
    "bin",
    "src",
    "templates",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 3. Create .npmignore

```bash
cat > .npmignore << 'EOF'
# Source files
src/**/*.test.js
src/**/*.spec.js
__tests__/
test/

# Development files
.github/
.vscode/
.idea/
docs/
examples/
scripts/

# Config files
.eslintrc*
.prettierrc*
jest.config.*
tsconfig.json
.babelrc*

# Build files
*.log
.DS_Store
.env*
coverage/
.nyc_output/

# Web app (if publishing CLI only)
apps/web/
EOF
```

### 4. Publishing Process

```bash
# Dry run to check what will be published
npm publish --dry-run

# Publish to NPM
npm publish

# For scoped packages
npm publish --access public

# Publish beta version
npm publish --tag beta

# Publish specific version
npm version patch  # or minor, major
npm publish
```

### 5. Automated NPM Publishing

Add to `package.json`:

```json
{
  "scripts": {
    "prerelease": "npm run lint && npm run test && npm run build",
    "release": "changeset publish",
    "version": "changeset version",
    "prepublishOnly": "npm run prerelease"
  }
}
```

---

## ☁️ Cloudflare Pages Deployment

### 1. Cloudflare Setup

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Initialize Pages project
wrangler pages project create create-js-stack-web
```

### 2. Create wrangler.toml

```toml
name = "create-js-stack-web"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
cwd = "apps/web"

[build.upload]
format = "service-worker"

[[build.upload.rules]]
type = "CompiledWasm"
globs = ["**/*.wasm"]
fallthrough = true

[[build.upload.rules]]
type = "Data"
globs = ["**/*.html", "**/*.css", "**/*.js", "**/*.json", "**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.ico", "**/*.woff", "**/*.woff2"]
fallthrough = false

[env.production]
vars = { ENVIRONMENT = "production" }

[env.preview]
vars = { ENVIRONMENT = "preview" }

[[redirects]]
from = "/api/*"
to = "https://api.js-stack.dev/:splat"
status = 200

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
```

### 3. Environment Variables Setup

```bash
# Set environment variables for Cloudflare Pages
wrangler pages secret create NEXT_PUBLIC_GEMINI_API_KEY
# Enter your API key when prompted

wrangler pages secret create DATABASE_URL
# Enter your database URL

# List all secrets
wrangler pages secret list
```

### 4. Manual Deployment

```bash
# Build the project
cd apps/web
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy out \
  --project-name=create-js-stack-web \
  --branch=main

# Deploy preview branch
wrangler pages deploy out \
  --project-name=create-js-stack-web \
  --branch=preview
```

### 5. Automated Deployment Script

Create `scripts/deploy-cloudflare.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deploy() {
  console.log('🚀 Starting Cloudflare Pages deployment...');
  
  try {
    // Change to web app directory
    process.chdir(path.join(__dirname, '../apps/web'));
    
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
    
    // Build the project
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Deploy to Cloudflare Pages
    console.log('☁️ Deploying to Cloudflare Pages...');
    const branch = process.env.GITHUB_REF_NAME || 'main';
    
    execSync(
      `wrangler pages deploy out --project-name=create-js-stack-web --branch=${branch}`,
      { stdio: 'inherit' }
    );
    
    console.log('✅ Deployment successful!');
    
    // Get deployment URL
    const deploymentUrl = `https://create-js-stack-web.pages.dev`;
    console.log(`🌐 View your site at: ${deploymentUrl}`);
    
    // If it's a preview deployment
    if (branch !== 'main') {
      console.log(`🔍 Preview URL: https://${branch}.create-js-stack-web.pages.dev`);
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();
```

### 6. GitHub Action for Cloudflare Deployment

Create `.github/workflows/cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
      - preview
    paths:
      - 'apps/web/**'
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'apps/web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
      
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        working-directory: apps/web
        
      - name: Build
        run: npm run build
        working-directory: apps/web
        env:
          NEXT_PUBLIC_GEMINI_API_KEY: ${{ secrets.NEXT_PUBLIC_GEMINI_API_KEY }}
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: create-js-stack-web
          directory: apps/web/out
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.head_ref || github.ref_name }}
```

---

## 🔄 Automated CI/CD Pipeline

### Complete Release Pipeline

Create `.github/workflows/complete-release.yml`:

```yaml
name: Complete Release Pipeline

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      release_type:
        description: 'Release type'
        required: true
        default: 'patch'
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Type Check
        run: npm run type-check
        
      - name: Test
        run: npm test
        
      - name: Build
        run: npm run build

  publish-npm:
    name: Publish to NPM
    needs: quality-checks
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build packages
        run: npm run build
        
      - name: Create Release
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm publish
          version: npm version ${{ github.event.inputs.release_type || 'patch' }}
          commit: "chore: release"
          title: "chore: release"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  deploy-cloudflare:
    name: Deploy to Cloudflare
    needs: quality-checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        working-directory: apps/web
        
      - name: Build Web App
        run: npm run build
        working-directory: apps/web
        env:
          NEXT_PUBLIC_GEMINI_API_KEY: ${{ secrets.NEXT_PUBLIC_GEMINI_API_KEY }}
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: create-js-stack-web
          directory: apps/web/out
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

  create-github-release:
    name: Create GitHub Release
    needs: [publish-npm, deploy-cloudflare]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Get version
        id: get_version
        run: echo "VERSION=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
        
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.get_version.outputs.VERSION }}
          release_name: Release v${{ steps.get_version.outputs.VERSION }}
          body: |
            ## 🎉 Release v${{ steps.get_version.outputs.VERSION }}
            
            ### 📦 NPM Package
            ```bash
            npm install -g create-js-stack-cli@${{ steps.get_version.outputs.VERSION }}
            ```
            
            ### 🌐 Web App
            Visit: [https://create-js-stack-web.pages.dev](https://create-js-stack-web.pages.dev)
            
            ### 📝 Changelog
            See [CHANGELOG.md](https://github.com/${{ github.repository }}/blob/main/CHANGELOG.md) for details.
          draft: false
          prerelease: false
```

---

## 📊 Post-Deployment Monitoring

### 1. Cloudflare Analytics

```javascript
// Add to apps/web/src/app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR_TOKEN"}'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. NPM Package Monitoring

```bash
# Check package stats
npm view create-js-stack-cli

# Check download statistics
# Visit: https://www.npmjs.com/package/create-js-stack-cli

# Monitor package health
npx npm-check-updates
```

### 3. Error Tracking Setup

```javascript
// Add Sentry for error tracking
// apps/web/src/lib/monitoring.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 4. Performance Monitoring

```yaml
# GitHub Action for Lighthouse CI
name: Lighthouse CI

on:
  deployment_status:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://create-js-stack-web.pages.dev
            https://create-js-stack-web.pages.dev/builder
            https://create-js-stack-web.pages.dev/analytics
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

## 🔐 Security & Secrets Management

### Required Secrets

Set these in GitHub repository settings → Secrets:

```bash
# GitHub Secrets needed:
NPM_TOKEN                    # From npm token create
CLOUDFLARE_API_TOKEN         # From Cloudflare dashboard
CLOUDFLARE_ACCOUNT_ID        # Your Cloudflare account ID
NEXT_PUBLIC_GEMINI_API_KEY   # Google AI API key
SENTRY_DSN                   # Sentry error tracking (optional)
DATABASE_URL                 # Database connection (if needed)
```

### Environment Files

Create `.env.example`:

```bash
# API Keys
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Database (if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## 📝 Release Checklist

Before each release, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] Version is bumped appropriately
- [ ] CHANGELOG.md is updated
- [ ] Security audit passes (`npm audit`)
- [ ] Environment variables are set in CI/CD
- [ ] Preview deployment works
- [ ] GitHub secrets are configured
- [ ] NPM authentication works
- [ ] Cloudflare project is created

---

## 🚨 Rollback Procedures

### NPM Package Rollback

```bash
# Unpublish broken version (within 72 hours)
npm unpublish create-js-stack-cli@1.0.1

# Deprecate broken version
npm deprecate create-js-stack-cli@1.0.1 "Critical bug, please use 1.0.2"
```

### Cloudflare Rollback

```bash
# List deployments
wrangler pages deployment list --project-name=create-js-stack-web

# Rollback to previous deployment
wrangler pages deployment rollback --project-name=create-js-stack-web
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force-with-lease origin main
```

---

## 📈 Success Metrics

Monitor these metrics after deployment:

1. **NPM Package**
   - Weekly downloads
   - GitHub stars
   - Issue resolution time
   - User satisfaction

2. **Web Application**
   - Page load time < 3s
   - Lighthouse score > 90
   - Zero runtime errors
   - User engagement metrics

3. **CI/CD Pipeline**
   - Build time < 5 minutes
   - Deployment success rate > 99%
   - Test coverage > 80%
   - Zero security vulnerabilities

---

## 🎉 Launch Announcement Template

```markdown
# 🚀 Announcing create-js-stack-cli v1.0.0!

We're excited to announce the first stable release of create-js-stack-cli!

## ✨ Features
- 🎨 Beautiful CLI with modern UI
- 🤖 AI-powered stack recommendations
- 🔧 Visual project builder
- ⚡ One-command deployment
- 👥 Team collaboration tools

## 📦 Installation
\`\`\`bash
npm install -g create-js-stack-cli
\`\`\`

## 🌐 Try the Web App
Visit: [https://create-js-stack-web.pages.dev](https://create-js-stack-web.pages.dev)

## 📚 Documentation
Full docs: [https://github.com/yourusername/create-js-stack-cli](https://github.com/yourusername/create-js-stack-cli)

---

#javascript #cli #webdev #opensource
```

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/create-js-stack-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/create-js-stack-cli/discussions)
- **Email**: vipinxdev@gmail.com
- **Twitter**: [@jsstackcli](https://twitter.com/jsstackcli)

---

Built with ❤️ for the JavaScript community
