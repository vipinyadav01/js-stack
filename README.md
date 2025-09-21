# Create JS Stack CLI

A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in.

## 📊 Feature Status

- ✅ **Available** - Feature is fully implemented and ready to use
- 🚧 **Coming Soon** - Feature is planned and in development
- 🆕 **New** - Recently added features

## ✨ Features

### 🚀 **Lightning Fast Setup**

- Get a complete full-stack project running in minutes
- Interactive prompts with smart defaults
- Skip prompts with command-line flags
- Programmatic API for automation

### 🎨 **Frontend Frameworks**

- ✅ **React** - With Vite, TypeScript, and modern tooling
- ✅ **Vue.js** - Vue 3 with Composition API and Vite
- ✅ **Angular** - Latest Angular with CLI integration
- ✅ **Svelte** - SvelteKit with optimized builds
- ✅ **Next.js** - Full-stack React framework
- ✅ **Nuxt** - Vue.js full-stack framework
- ✅ **React Native** - Mobile app development

### ⚙️ **Backend Frameworks**

- ✅ **Express.js** - Fast, minimalist web framework
- ✅ **Fastify** - High-performance, low-overhead framework
- ✅ **Koa.js** - Lightweight, expressive middleware framework
- ✅ **Hapi.js** - Rich ecosystem with built-in validation
- ✅ **NestJS** - Scalable Node.js framework with TypeScript

### 🗄️ **Database & Storage**

- ✅ **SQLite** - Lightweight, serverless database
- ✅ **PostgreSQL** - Advanced open-source database
- ✅ **MySQL** - Popular relational database
- ✅ **MongoDB** - NoSQL document database
- 🚧 **Supabase** - Open source Firebase alternative (Coming Soon)
- 🚧 **PlanetScale** - Serverless MySQL platform (Coming Soon)

### 🔧 **ORM/ODM Integration**

- ✅ **Prisma** - Next-generation ORM with type safety
- ✅ **Sequelize** - Feature-rich ORM for SQL databases
- ✅ **Mongoose** - Elegant MongoDB object modeling
- ✅ **TypeORM** - Advanced ORM with decorator support

### 🔐 **Authentication & Security**

- ✅ **JWT** - JSON Web Token implementation
- ✅ **Passport** - Flexible authentication middleware
- ✅ **Auth0** - Identity platform integration
- 🚧 **Firebase Auth** - Google's authentication service (Coming Soon)
- 🚧 **Clerk** - Modern authentication platform (Coming Soon)
- 🚧 **Lucia** - Lightweight authentication library (Coming Soon)
- 🚧 **Supabase Auth** - Open source auth solution (Coming Soon)
- ✅ **Security middleware** - Helmet, CORS, Rate limiting

### 🛠️ **Development & DevOps**

- ✅ **TypeScript** - Full TypeScript support across all templates
- ✅ **Docker** - Complete containerization with Docker Compose
- ✅ **Testing** - Jest, Vitest configurations
- 🚧 **Cypress** - E2E testing framework (Coming Soon)
- ✅ **Linting** - ESLint with framework-specific rules
- ✅ **Formatting** - Prettier with consistent configurations
- ✅ **Git Hooks** - Husky for pre-commit validation
- ✅ **CI/CD** - GitHub Actions workflows

### 📦 **Package Managers**

- ✅ **npm** - Node.js default package manager
- ✅ **yarn** - Fast, reliable dependency management
- ✅ **pnpm** - Efficient disk space usage
- ✅ **bun** - All-in-one JavaScript runtime

### 🎯 **Additional Features**

- ✅ **Redis** - Caching and session storage
- ✅ **Socket.IO** - Real-time communication
- ✅ **Tailwind CSS** - Utility-first CSS framework
- 🚧 **Material UI** - React component library (Coming Soon)
- 🚧 **Bootstrap** - Popular CSS framework (Coming Soon)
- ✅ **Environment Management** - Complete .env configuration
- 🚧 **API Documentation** - Auto-generated Swagger/OpenAPI docs (Coming Soon)
- ✅ **Hot Reload** - Development with instant updates
- 🆕 **Turborepo** - Monorepo support with workspace management

## 🚀 Quick Start

### Create a New Project

```bash
# Interactive setup (recommended)
npx create-js-stack init my-awesome-app

# With specific options
npx create-js-stack init my-app \
  --backend nestjs \
  --frontend react \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --addons docker eslint prettier testing \
  --pm pnpm

# Use defaults for rapid prototyping
npx create-js-stack init my-app --yes
```

### Global Installation

```bash
npm install -g create-js-stack
create-js-stack init my-app
```

## 💡 Usage Examples

### Full-Stack React + Express App

```bash
npx create-js-stack init my-app \
  --backend express \
  --frontend react \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --addons docker tailwind testing
```

### Vue + NestJS Enterprise Setup

```bash
npx create-js-stack init enterprise-app \
  --backend nestjs \
  --frontend vue \
  --database postgres \
  --orm typeorm \
  --auth passport \
  --addons docker eslint prettier testing github-actions
```

### Next.js Full-Stack Application

```bash
npx create-js-stack init nextjs-app \
  --frontend nextjs \
  --database mongodb \
  --orm mongoose \
  --auth auth0 \
  --addons tailwind testing
```

### Mobile + Backend Setup

```bash
npx create-js-stack init mobile-app \
  --backend fastify \
  --frontend react-native \
  --database mongodb \
  --orm mongoose \
  --auth firebase \
  --addons docker testing
```

### Monorepo Setup with Turborepo

```bash
npx create-js-stack init monorepo-app \
  --backend express \
  --frontend react vue \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --addons turborepo typescript eslint prettier
```

## 📋 Commands

### `init [project-name]`

Create a new full-stack project with all configurations.

**Options:**

- `-y, --yes` - Use default configuration (Express + React + SQLite + Prisma)
- `--backend <type>` - Backend framework
  - `express` - Express.js (default)
  - `fastify` - Fastify
  - `koa` - Koa.js
  - `hapi` - Hapi.js
  - `nestjs` - NestJS
  - `none` - No backend
- `--frontend <types...>` - Frontend framework(s)
  - `react` - React with Vite (default)
  - `vue` - Vue.js 3
  - `angular` - Angular
  - `svelte` - SvelteKit
  - `nextjs` - Next.js
  - `nuxt` - Nuxt.js
  - `react-native` - React Native
  - `none` - No frontend
- `--database <type>` - Database type
  - `sqlite` - SQLite (default)
  - `postgres` - PostgreSQL
  - `mysql` - MySQL
  - `mongodb` - MongoDB
  - `none` - No database
- `--orm <type>` - ORM/ODM
  - `prisma` - Prisma (default)
  - `sequelize` - Sequelize
  - `mongoose` - Mongoose
  - `typeorm` - TypeORM
  - `none` - No ORM
- `--auth <type>` - Authentication
  - `jwt` - JSON Web Tokens ✅
  - `passport` - Passport.js ✅
  - `auth0` - Auth0 integration ✅
  - `firebase` - Firebase Auth 🚧 (Coming Soon)
  - `clerk` - Clerk Auth 🚧 (Coming Soon)
  - `lucia` - Lucia Auth 🚧 (Coming Soon)
  - `none` - No authentication (default)
- `--addons <addons...>` - Additional tools
  - `typescript` - TypeScript support ✅
  - `eslint` - ESLint linting ✅
  - `prettier` - Code formatting ✅
  - `husky` - Git hooks ✅
  - `docker` - Docker containerization ✅
  - `github-actions` - CI/CD workflows ✅
  - `testing` - Testing frameworks ✅
  - `tailwind` - Tailwind CSS ✅
  - `turborepo` - Monorepo with Turborepo 🆕
  - `material` - Material UI (React/Angular) 🚧 (Coming Soon)
  - `bootstrap` - Bootstrap CSS 🚧 (Coming Soon)
  - `redis` - Redis caching ✅
  - `socketio` - Socket.IO real-time ✅
  - `cypress` - E2E testing 🚧 (Coming Soon)
  - `swagger` - API documentation 🚧 (Coming Soon)
- `--pm <manager>` - Package manager
  - `npm` - npm (default)
  - `yarn` - Yarn
  - `pnpm` - pnpm
  - `bun` - Bun
- `--no-git` - Skip git initialization
- `--no-install` - Skip dependency installation

### `add`

Add features to an existing project.

**Options:**

- `--addons <addons...>` - Additional tools to add
- `--auth <type>` - Add authentication system
- `--database <type>` - Add database support
- `--install` - Install dependencies after adding features

**Examples:**

```bash
# Add Docker and testing to existing project
create-js-stack add --addons docker testing

# Add authentication
create-js-stack add --auth jwt

# Add database with ORM
create-js-stack add --database postgres --orm prisma

# Add Turborepo monorepo structure
create-js-stack add --addons turborepo
```

### `list`

List all available options and their descriptions.

**Options:**

- `--backends` - List backend frameworks
- `--frontends` - List frontend frameworks
- `--databases` - List database options
- `--orms` - List ORM/ODM options
- `--auth` - List authentication options
- `--addons` - List available addons

### `docs`

Open comprehensive documentation in your default browser.

### `version`

Display the current version of create-js-stack CLI.

## 🔧 Programmatic API

Use create-js-stack programmatically in your Node.js applications:

```javascript
import { init, add, list } from "create-js-stack";

// Create a new project
const result = await init("my-app", {
  backend: "nestjs",
  frontend: ["react"],
  database: "postgres",
  orm: "prisma",
  auth: "jwt",
  addons: ["typescript", "docker", "testing"],
  packageManager: "pnpm",
  git: true,
  install: true,
});

if (result.success) {
  console.log(`✅ Project created at: ${result.projectDir}`);
  console.log(`📊 Generated files: ${result.filesGenerated}`);
  console.log(`⏱️  Setup time: ${result.setupTime}ms`);
} else {
  console.error(`❌ Error: ${result.error}`);
}

// Add features to existing project
const addResult = await add({
  addons: ["redis", "socketio"],
  auth: "passport",
  install: true,
});

// List available options
const options = await list();
console.log("Available backends:", options.backends);
console.log("Available frontends:", options.frontends);
```

### API Reference

#### `init(projectName, options)`

Creates a new full-stack project.

**Parameters:**

- `projectName` (string) - Name of the project directory
- `options` (object) - Configuration options
  - `backend` (string) - Backend framework
  - `frontend` (string[]) - Frontend framework(s)
  - `database` (string) - Database type
  - `orm` (string) - ORM/ODM type
  - `auth` (string) - Authentication type
  - `addons` (string[]) - Additional tools
  - `packageManager` (string) - Package manager
  - `git` (boolean) - Initialize git repository
  - `install` (boolean) - Install dependencies

**Returns:** Promise<{ success: boolean, projectDir?: string, error?: string }>

#### `add(options)`

Adds features to an existing project.

**Parameters:**

- `options` (object) - Features to add
  - `addons` (string[]) - Additional tools
  - `auth` (string) - Authentication system
  - `database` (string) - Database support
  - `install` (boolean) - Install dependencies

**Returns:** Promise<{ success: boolean, error?: string }>

#### `list()`

Returns all available options.

**Returns:** Promise<{ backends: string[], frontends: string[], databases: string[], orms: string[], auth: string[], addons: string[] }>

## 📁 Project Structure

The generated project follows industry best practices with a well-organized structure:

### Full-Stack Project Structure

```
my-awesome-app/
├── 📁 backend/                 # Backend application
│   ├── 📁 src/                 # Source code
│   │   ├── 📄 server.js        # Main server file
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 middleware/      # Custom middleware
│   │   ├── 📁 controllers/     # Route controllers
│   │   ├── 📁 services/        # Business logic
│   │   ├── 📁 models/          # Data models
│   │   └── 📁 utils/           # Utility functions
│   ├── 📁 tests/               # Backend tests
│   ├── 📄 package.json         # Backend dependencies
│   ├── 🐳 Dockerfile           # Docker configuration
│   └── 📄 .env.example         # Environment variables template
├── 📁 frontend/                # Frontend application
│   ├── 📁 src/                 # Source code
│   │   ├── 📄 main.js          # Application entry point
│   │   ├── 📁 components/      # Reusable components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 hooks/           # Custom hooks (React)
│   │   ├── 📁 store/           # State management
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📁 assets/          # Static assets
│   ├── 📁 public/              # Public static files
│   ├── 📁 tests/               # Frontend tests
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 🐳 Dockerfile           # Docker configuration
│   └── ⚙️ vite.config.js       # Build configuration
├── 📁 database/                # Database related files
│   ├── 📁 migrations/          # Database migrations
│   ├── 📁 seeds/               # Database seeds
│   ├── 📄 schema.prisma        # Prisma schema (if using Prisma)
│   └── 📄 config.js            # Database configuration
├── 📁 shared/                  # Shared utilities and types
│   ├── 📁 types/               # TypeScript type definitions
│   ├── 📁 constants/           # Shared constants
│   └── 📁 utils/               # Shared utility functions
├── 📁 docker/                  # Docker configurations
│   ├── 🐳 docker-compose.yml   # Development setup
│   ├── 🐳 docker-compose.prod.yml # Production setup
│   └── 📁 nginx/               # Nginx configuration (if applicable)
├── 📁 .github/                 # GitHub configurations
│   └── 📁 workflows/           # CI/CD workflows
├── 📁 docs/                    # Project documentation
├── 📄 package.json             # Root package.json (monorepo)
├── 📄 README.md                # Project documentation
├── 📄 .env.example             # Environment variables template
├── 📄 .gitignore               # Git ignore rules
├── 📄 .eslintrc.js             # ESLint configuration
├── 📄 .prettierrc              # Prettier configuration
├── 📄 turbo.json               # Turbo configuration (if monorepo)
└── 📄 LICENSE                  # License file
```

### Monorepo Structure (with Turborepo)

```
monorepo-app/
├── 📁 apps/                    # Applications
│   ├── 📁 web/                 # Web application
│   │   ├── 📁 src/             # Source code
│   │   ├── 📄 package.json     # App dependencies
│   │   └── 📄 next.config.js   # Next.js config
│   └── 📁 server/              # Server application
│       ├── 📁 src/             # Source code
│       ├── 📄 package.json     # App dependencies
│       └── 📄 server.js        # Main server file
├── 📁 packages/                # Shared packages
│   ├── 📁 ui/                  # UI components
│   │   ├── 📁 src/             # Component source
│   │   └── 📄 package.json     # Package dependencies
│   ├── 📁 database/            # Database package
│   │   ├── 📁 src/             # Database logic
│   │   └── 📄 package.json     # Package dependencies
│   └── 📁 shared/              # Shared utilities
│       ├── 📁 src/             # Shared code
│       └── 📄 package.json     # Package dependencies
├── 📁 configs/                 # Shared configurations
│   ├── 📁 eslint/              # ESLint config
│   ├── 📁 typescript/          # TypeScript config
│   └── 📁 prettier/            # Prettier config
├── 📄 package.json             # Root package.json
├── 📄 turbo.json               # Turborepo configuration
└── 📄 README.md                # Project documentation
```

### Framework-Specific Structures

#### Next.js Project

```
nextjs-app/
├── 📁 app/                     # App Router (Next.js 13+)
│   ├── 📄 layout.tsx           # Root layout
│   ├── 📄 page.tsx             # Home page
│   ├── 📁 api/                 # API routes
│   └── 📁 (auth)/              # Route groups
├── 📁 components/              # React components
├── 📁 lib/                     # Utilities and configurations
├── 📄 next.config.js           # Next.js configuration
└── 📄 middleware.ts            # Next.js middleware
```

#### NestJS Project

```
nestjs-app/
├── 📁 src/
│   ├── 📄 main.ts              # Application entry point
│   ├── 📄 app.module.ts        # Root module
│   ├── 📁 auth/                # Authentication module
│   ├── 📁 users/               # Users module
│   ├── 📁 common/              # Shared code
│   │   ├── 📁 decorators/      # Custom decorators
│   │   ├── 📁 filters/         # Exception filters
│   │   ├── 📁 guards/          # Route guards
│   │   └── 📁 interceptors/    # Interceptors
│   └── 📁 database/            # Database configuration
├── 📄 nest-cli.json            # Nest CLI configuration
└── 📄 tsconfig.json            # TypeScript configuration
```

### Generated Files Include:

✅ **Complete Configuration Files**

- Package.json with all necessary dependencies
- TypeScript configuration (if selected)
- ESLint and Prettier configurations
- Environment variable templates
- Docker and Docker Compose files
- CI/CD workflow files

✅ **Production-Ready Code**

- Fully functional server with middleware
- Authentication system (if selected)
- Database models and connections
- API routes with proper error handling
- Frontend components with routing
- Testing setup and example tests

✅ **Development Tools**

- Hot reload for development
- Debugging configurations
- Git hooks for code quality
- Comprehensive README documentation

## 🛠️ Development & Contributing

### Setting Up the Development Environment

```bash
# Clone the repository
git clone https://github.com/vipinyadav01/js-stack-cli.git
cd js-stack

# Install dependencies
npm install

# Build the CLI
npm run build

# Link for local development
npm link

# Test locally
create-js-stack init test-project
```

### Project Scripts

```bash
# Development
npm run dev              # Watch mode with hot reload
npm run build            # Build the CLI
npm run build:watch      # Build in watch mode

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Publishing
npm run prepublish       # Prepare for publishing
npm run publish          # Publish to npm
```

### Template Development

Create new templates in the `templates/` directory:

```
templates/
├── backend/
│   └── your-framework/
│       ├── package.json.hbs
│       ├── server.js.hbs
│       └── routes/
├── frontend/
│   └── your-framework/
│       ├── package.json.hbs
│       └── src/
└── database/
    └── your-orm/
        └── models.js.hbs
```

### Adding New Framework Support

1. **Add framework option** in `src/types.js`
2. **Create templates** in appropriate directory
3. **Update generator** in `src/generators/`
4. **Add tests** for the new framework
5. **Update documentation**

### Template Syntax

Templates use Handlebars with conditional logic:

```handlebars
{ "name": "{{projectName}}", "version": "1.0.0",
{{#if useTypeScript}}
  "scripts": { "build": "tsc" }, "devDependencies": { "typescript": "^5.0.0" }
{{/if}}
}
```

### Testing Your Changes

```bash
# Test CLI generation
npm run test:cli

# Test specific templates
npm run test:templates -- --framework=react

# Test integration
npm run test:integration

# Manual testing
npm run build && npm link
create-js-stack init test-app --backend express --frontend react
```

### Contributing Guidelines

1. **Fork and Clone**

   ```bash
   git clone https://github.com/vipinyadav01/js-stack-cli.git
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test Thoroughly**

   ```bash
   npm test
   npm run test:e2e
   ```

5. **Commit with Conventional Commits**

   ```bash
   git commit -m "feat: add support for new framework"
   ```

6. **Submit Pull Request**
   - Clear description of changes
   - Link related issues
   - Include screenshots if applicable

### Code Style Guidelines

- **ES6+ Features** - Use modern JavaScript
- **TypeScript** - Prefer TypeScript for new code
- **Functional Programming** - Prefer pure functions
- **Error Handling** - Comprehensive error handling
- **Documentation** - JSDoc comments for functions
- **Testing** - Unit tests for all new features

### Reporting Issues

When reporting issues, please include:

- **Environment Details** (OS, Node.js version, npm version)
- **Command Used** (exact command that failed)
- **Expected Behavior** vs **Actual Behavior**
- **Error Messages** (full stack trace)
- **Reproduction Steps** (minimal example)

### Security

Report security vulnerabilities to: [vipinxdev@gmail.com](mailto:vipinxdev@gmail.com)

Do not open public issues for security vulnerabilities.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Acknowledgments

### Main Author

- **Vipin Yadav** - _Initial work and ongoing development_

### Contributors

- Community contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

### Acknowledgments

- **Create React App** - Inspiration for CLI design patterns
- **Next.js** - Modern full-stack framework inspiration
- **NestJS** - Enterprise-grade architecture patterns
- **Vite** - Lightning-fast build tool integration
- **Prisma** - Next-generation ORM inspiration
- **T3 Stack** - Full-stack TypeScript best practices
- **Better-T-Stack** - Original inspiration for this project

Special thanks to the open-source community and all the maintainers of the frameworks and tools integrated into this CLI.

## 🌟 Show Your Support

If this project helped you, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** issues and bugs
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements
- 📢 **Sharing** with the community

## 📊 Project Stats

- **Templates**: 50+ production-ready templates
- **Frameworks**: 12+ supported frameworks
- **Databases**: 4 database types with 4 ORMs
- **Languages**: JavaScript & TypeScript
- **Package Managers**: 4 supported managers
- **Authentication**: 4 auth strategies
- **Development Tools**: 10+ integrated tools
- **Monorepo Support**: Turborepo integration
- **Author**: Vipin Yadav

## 🔗 Useful Links

- **Documentation**: [https://create-js-stack.com/docs](https://create-js-stack.com/docs)
- **Examples**: [https://github.com/create-js-stack/examples](https://github.com/create-js-stack/examples)
- **Templates**: [https://github.com/create-js-stack/templates](https://github.com/create-js-stack/templates)
- **Community**: [https://discord.gg/create-js-stack](https://discord.gg/create-js-stack)
- **Twitter**: [@CreateJSStack](https://twitter.com/CreateJSStack)

---

<div align="center">

**Built with ❤️ by [Vipin Yadav](https://vipinyadav01.vercel.app)**

[Website](https://js-stack.pages.dev) • [Documentation](https://js-stack.pages.dev/docs) • [Examples](https://github.com/js-stack/examples) • [Community](https://discord.gg/js-stack)

</div>
