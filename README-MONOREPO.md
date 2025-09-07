# 🚀 JS Stack - Advanced Full-Stack JavaScript Project Generator

A modern, feature-rich monorepo containing both a powerful CLI tool and an advanced web application for generating JavaScript projects with AI assistance, visual builders, and real-time collaboration.

## 🏗️ Architecture

This project uses a **Turborepo** monorepo structure with:
- **Changesets** for version management
- **Husky** for Git hooks
- **Turbo** for build orchestration
- **pnpm workspaces** for dependency management

```
create-js-stack-cli/
├── apps/
│   ├── cli/          # CLI application
│   └── web/          # Next.js web application
├── packages/         # Shared packages
├── turbo.json        # Turborepo configuration
├── .changeset/       # Changesets configuration
└── .husky/           # Git hooks
```

## ✨ Key Features

### CLI Features
- 🎨 **Beautiful Terminal UI** - Gradient text, animations, and modern styling
- 🤖 **Interactive Prompts** - Smart, contextual questions with helpful hints
- 📊 **Visual Progress** - Real-time progress tracking with step indicators
- 🎯 **Smart Defaults** - Intelligent default configurations
- 🔧 **Extensive Options** - Support for 200+ technology combinations

### Web Application Features
- 🤖 **AI-Powered Stack Builder** - Get intelligent recommendations using OpenAI
- 🎨 **Visual Drag & Drop Builder** - Build your stack visually
- 👀 **Live Code Preview** - See generated code in real-time
- 📊 **Analytics Dashboard** - Track usage and popular stacks
- 🔄 **Real-Time Collaboration** - Share and collaborate on configurations
- 🚀 **One-Click Deploy** - Deploy to Vercel, Netlify, or Railway
- 🎯 **Monaco Code Editor** - Full IDE experience in the browser
- 🌙 **Dark/Light Mode** - Beautiful themes with smooth transitions

## 🛠️ Technology Stack

### CLI Stack
- **Runtime**: Node.js 18+
- **Language**: Modern JavaScript (ES Modules)
- **CLI Framework**: Commander.js
- **Prompts**: @clack/prompts
- **Styling**: Chalk, Gradient-string, Figlet
- **Build**: ESBuild
- **Validation**: Yup

### Web Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 + Radix UI
- **State**: Zustand + React Query
- **Animation**: Framer Motion
- **AI**: OpenAI GPT-4
- **Real-time**: Socket.io
- **Auth**: NextAuth.js
- **Database**: Prisma (optional)
- **Analytics**: Vercel Analytics
- **Testing**: Vitest + React Testing Library
- **Documentation**: Storybook

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 8+ (recommended) or npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/create-js-stack-cli.git
cd create-js-stack-cli
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**
```bash
# Copy example env file for web app
cp apps/web/.env.example apps/web/.env.local

# Add your API keys:
# - OPENAI_API_KEY for AI features
# - NEXTAUTH_SECRET for authentication
# - Database URL if using database features
```

4. **Initialize Husky (Git hooks)**
```bash
pnpm prepare
```

## 📦 Development

### Run all apps in development mode
```bash
pnpm dev
```

### Run specific apps
```bash
# CLI only
pnpm dev:cli

# Web app only
pnpm dev:web
```

### Build all apps
```bash
pnpm build
```

### Run tests
```bash
pnpm test
```

### Format code
```bash
pnpm format
```

### Lint code
```bash
pnpm lint
```

## 🎯 CLI Usage

### Local Development
```bash
# Run CLI directly from source
pnpm dev:cli init my-app

# Or build and test
pnpm build:cli
node dist/cli.js init my-app
```

### Commands

#### `init [project-name]`
Create a new project with interactive prompts or flags.

```bash
# Interactive mode
npx create-js-stack init my-app

# With options
npx create-js-stack init my-app \
  --backend express \
  --frontend react \
  --database postgres \
  --orm prisma \
  --auth jwt

# Quick mode with defaults
npx create-js-stack init my-app --yes
```

#### `list`
Display all available options in a beautiful grid layout.

```bash
npx create-js-stack list
```

#### `add`
Add features to an existing project.

```bash
npx create-js-stack add --addons eslint prettier testing
```

## 🌐 Web Application

### Development
```bash
# Start development server
pnpm dev:web

# Open http://localhost:3000
```

### Features Overview

#### 1. Visual Stack Builder
- Drag and drop interface
- Real-time validation
- Dependency resolution
- Conflict detection

#### 2. AI Assistant
- Natural language to stack conversion
- Smart recommendations
- Project type detection
- Performance suggestions

#### 3. Live Preview
- Real-time code generation
- Syntax highlighting
- File tree visualization
- Download as ZIP

#### 4. Analytics Dashboard
- Usage statistics
- Popular stacks
- Success rates
- Performance metrics

#### 5. Collaboration
- Share configurations via URL
- Team workspaces
- Comments and annotations
- Version history

### API Routes
```
/api/ai/suggest - AI stack suggestions
/api/stacks - CRUD for stack configurations
/api/generate - Generate project code
/api/deploy - Deploy to cloud providers
/api/analytics - Usage analytics
```

## 📊 Monorepo Scripts

```json
{
  "build": "Build all packages",
  "dev": "Run all in dev mode",
  "test": "Run all tests",
  "lint": "Lint all packages",
  "format": "Format all files",
  "changeset": "Create a changeset",
  "version-packages": "Version packages",
  "release": "Build and publish"
}
```

## 🔄 Version Management

This project uses **Changesets** for version management:

1. **Create a changeset**
```bash
pnpm changeset
```

2. **Version packages**
```bash
pnpm version-packages
```

3. **Publish**
```bash
pnpm release
```

## 🧪 Testing

### CLI Testing
```bash
# Run CLI tests
cd apps/cli
pnpm test
```

### Web Testing
```bash
# Run web tests
cd apps/web
pnpm test

# Run with UI
pnpm test:ui

# Run Storybook
pnpm storybook
```

## 📈 Performance

### Optimizations
- **Turbo caching** for faster builds
- **Next.js Turbopack** for instant HMR
- **Code splitting** and lazy loading
- **Image optimization** with Next.js Image
- **Edge runtime** support
- **Bundle analysis** with `pnpm analyze`

### Benchmarks
- CLI startup: <100ms
- Web app TTI: <2s
- Build time: <30s
- Test execution: <10s

## 🔐 Security

- **Dependency scanning** with npm audit
- **Environment variable validation**
- **Input sanitization** in CLI and web
- **Rate limiting** on API routes
- **CORS configuration**
- **CSP headers**

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `pnpm test` and `pnpm lint`
6. Create a changeset
7. Submit a PR

## 📝 License

MIT © Vipin Yadav

## 🙏 Acknowledgments

Inspired by:
- create-t3-app
- create-next-app
- Vite
- Turborepo examples

## 🔗 Links

- [Documentation](https://js-stack.dev/docs)
- [Web App](https://js-stack.dev)
- [CLI on npm](https://www.npmjs.com/package/create-js-stack)
- [GitHub](https://github.com/yourusername/create-js-stack-cli)
- [Discord](https://discord.gg/js-stack)

---

Built with ❤️ by the Vipin Yadav
