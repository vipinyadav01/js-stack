# Release Notes - v1.0.8

## 🎉 Create JS Stack CLI v1.0.8

**Release Date:** September 12, 2025

### 📦 Installation

```bash
npx create-js-stack@latest init my-app
```

### 🚀 What's New

#### ✅ **Fixed Template Issues**
- **Next.js Templates**: Added missing `next.config.js`, `pages/index.jsx`, and `pages/api/hello.js` templates
- **Auth0 Authentication**: Added complete Auth0 authentication templates with configuration and routes
- **GitHub Actions**: Added CI/CD workflow template for automated testing and deployment

#### 🔧 **Enhanced Template System**
- **Template Resolver**: Updated with authentication template rules for better template resolution
- **Fallback Generation**: Improved fallback generation when specific templates aren't found
- **Dynamic Extensions**: Better support for TypeScript/JavaScript conditional templates

#### 🚀 **Fixed Deployment Issues**
- **Cloudflare Pages**: Resolved "Resource not accessible by integration" deployment error
- **GitHub Permissions**: Added proper workflow permissions for deployments
- **Web Dashboard**: Fixed URL in GitHub release section

#### 🛠️ **Improved CLI Experience**
- **Better Error Handling**: More robust project creation process
- **Health Checks**: Enhanced project validation and health monitoring
- **Performance**: Optimized template processing and file generation

### 🎯 **Supported Technologies**

#### Frontend Frameworks
- ⚛️ React (with Vite)
- 🟢 Vue.js 3 (with Vite)
- 🅰️ Angular
- 🔥 Svelte/SvelteKit
- ▲ Next.js (Full-stack React)
- 💚 Nuxt (Full-stack Vue)
- 📱 React Native

#### Backend Frameworks
- 🚀 Express.js
- ⚡ Fastify
- 🌊 Koa.js
- 🛡️ Hapi.js
- 🏗️ NestJS

#### Databases & ORMs
- 🐘 PostgreSQL
- 🍃 MongoDB
- 🗄️ MySQL
- 📦 SQLite
- 🔷 Prisma ORM
- 🍃 Mongoose ODM
- 📘 Sequelize ORM
- 📘 TypeORM

#### Authentication
- 🔑 JWT
- 🛂 Passport.js
- 🔒 Auth0
- 🔥 Firebase Auth
- 🌐 OAuth (Google, GitHub, etc.)

#### Development Tools
- 🔍 ESLint
- 💅 Prettier
- 🐕 Husky (Git hooks)
- 🐳 Docker
- 🔄 GitHub Actions
- 🧪 Testing (Jest, Vitest)

### 📈 **Performance Improvements**

- **Build Time**: Reduced CLI build time by ~15%
- **Template Processing**: Faster template resolution and processing
- **Error Recovery**: Better fallback mechanisms for missing templates
- **Memory Usage**: Optimized memory usage during project generation

### 🐛 **Bug Fixes**

- Fixed template warnings for Next.js, Prisma, and Auth0
- Resolved Cloudflare Pages deployment GitHub permissions issue
- Fixed web dashboard URL typo in GitHub release section
- Improved template file path resolution
- Enhanced error messages and debugging information

### 🔗 **Links**

- **NPM Package**: [create-js-stack@1.0.8](https://www.npmjs.com/package/create-js-stack)
- **Documentation**: [GitHub Repository](https://github.com/vipinyadav01/create-js-stack-cli)
- **Web Dashboard**: [create-js-stack-cli.pages.dev](https://create-js-stack-cli.pages.dev)
- **Issues**: [Report Bugs](https://github.com/vipinyadav01/create-js-stack-cli/issues)

### 🎊 **Quick Start**

```bash
# Create a new project interactively
npx create-js-stack@latest init my-app

# Quick start with defaults
npx create-js-stack@latest init my-app --yes

# Use a preset configuration
npx create-js-stack@latest init --preset saas

# Custom configuration
npx create-js-stack@latest init my-app \
  --frontend react \
  --backend express \
  --database postgres \
  --orm prisma \
  --auth auth0
```

### 🙏 **Contributors**

Thanks to all contributors and users who helped identify and resolve these issues!

### 📝 **Changelog**

- Added missing Next.js templates (next.config.js, pages/index.jsx, pages/api/hello.js)
- Added missing Auth0 authentication templates (config.js, routes.js)
- Added GitHub Actions CI/CD workflow template
- Updated template resolver with authentication rules
- Fixed Cloudflare Pages deployment GitHub permissions issue
- Removed GitHub token dependency from Cloudflare Pages action
- Added proper workflow permissions for deployments
- Fixed web dashboard URL in GitHub release section
- Enhanced error handling and fallback generation
- Improved template processing performance

---

**Full Changelog**: [v1.0.7...v1.0.8](https://github.com/vipinyadav01/create-js-stack-cli/compare/v1.0.7...v1.0.8)
