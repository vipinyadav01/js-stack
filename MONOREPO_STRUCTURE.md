# Create JS Stack CLI - Monorepo Structure

This is a Turborepo-powered monorepo containing the Create JS Stack CLI tool and its accompanying web dashboard.

## 📁 Project Structure

```
create-js-stack-cli/
├── web/                    # Next.js Web Dashboard
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── api/       # API routes (NPM & GitHub)
│   │   │   ├── analytics/ # Analytics page
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   ├── features/  # Features page
│   │   │   └── page.tsx   # Home page
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities
│   ├── package.json      # Web app dependencies
│   ├── .env.local        # Web-specific environment variables
│   └── README.md         # Web app documentation
├── src/                   # CLI source code
├── templates/             # Project templates
├── scripts/               # Build scripts
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json with workspaces
└── .env.local.example    # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vipinyadav01/create-js-stack-cli.git
   cd create-js-stack-cli
   ```

2. **Install dependencies for all workspaces:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

### Development Commands

#### Web Dashboard Development
```bash
# Start the web dashboard in development mode
npm run dev:web

# Build the web dashboard
npm run build

# Start all development servers
npm run dev
```

#### CLI Development
```bash
# Run the CLI in development mode
npm run dev:cli

# Build the CLI
npm run build:cli
```

#### Monorepo Management
```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Lint all packages
npm run lint

# Clean all build outputs
npm run clean
```

## 🌐 Web Dashboard

The web dashboard is a modern Next.js application featuring:

- **🏠 Home Page** - Project overview and installation instructions
- **📊 Dashboard** - Project statistics and development metrics
- **⚡ Features Page** - Comprehensive feature showcase
- **📈 Analytics Page** - Real-time NPM and GitHub data
- **🎨 Modern UI** - Built with shadcn/ui and Tailwind CSS

### Web Dashboard URLs

When running locally:
- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard  
- **Features**: http://localhost:3000/features
- **Analytics**: http://localhost:3000/analytics

### API Endpoints

- **NPM Data**: `GET /api/npm?package=package-name`
- **GitHub Data**: `GET /api/github?repo=owner/repo-name`

## 🛠️ CLI Tool

The CLI tool (`create-js-stack`) helps developers scaffold modern JavaScript projects with:

- React + Express full-stack setups
- TypeScript configuration
- Modern tooling (ESLint, Prettier, etc.)
- Database integration options
- Deployment configurations

### CLI Usage

```bash
# Install globally
npm install -g create-js-stack

# Create a new project
create-js-stack my-project

# Or use npx (no installation needed)
npx create-js-stack my-project
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
# GitHub token for higher API rate limits (optional)
GITHUB_TOKEN=your_github_token

# Web app configuration
NEXT_PUBLIC_APP_NAME=JS Stack CLI
NEXT_PUBLIC_DEFAULT_NPM_PACKAGE=your-package
NEXT_PUBLIC_DEFAULT_GITHUB_REPO=owner/repo
```

### Turborepo Configuration

The project uses Turborepo for:
- **Fast builds** with intelligent caching
- **Parallel task execution**
- **Incremental builds**
- **Remote caching** (when configured)

## 📦 Workspaces

This monorepo contains:

1. **`web`** - Next.js dashboard application
2. **Root** - CLI tool and shared configuration

Each workspace has its own `package.json` and can be developed independently.

## 🚢 Deployment

### Web Dashboard Deployment

The web dashboard can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify** 
- **Docker**

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

### CLI Tool Publishing

```bash
# Build the CLI
npm run build:cli

# Publish to npm
npm publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Build the project: `npm run build`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Node version mismatch**: Ensure Node.js 18+ is installed
2. **Port conflicts**: The web app runs on port 3000 by default
3. **Permission errors**: On Windows, run commands in an elevated terminal if needed
4. **Build failures**: Clear cache with `npm run clean` and try again

### Getting Help

- Check the [CLI README](./README.md) for CLI-specific issues
- Check the [Web README](./web/README.md) for web app issues
- Open an issue on GitHub for bugs and feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel team for Turborepo
- shadcn for the beautiful UI components
- All contributors and users of this project