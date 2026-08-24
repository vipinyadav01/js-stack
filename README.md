# Create JS Stack CLI

[![npm version](https://img.shields.io/npm/v/create-js-stack.svg)](https://www.npmjs.com/package/create-js-stack)
[![npm downloads](https://img.shields.io/npm/dm/create-js-stack.svg)](https://www.npmjs.com/package/create-js-stack)
[![License](https://img.shields.io/npm/l/create-js-stack.svg)](https://github.com/vipinyadav01/js-stack/blob/main/LICENSE)

> A powerful CLI tool for scaffolding production-ready JavaScript full-stack projects with best practices built-in.

## 🚀 Quick Start

```bash
# Interactive setup (recommended)
npx create-js-stack@latest my-app

# Quick start with defaults
npx create-js-stack@latest my-app --yes

# Custom stack
npx create-js-stack@latest my-app \
  --frontend react \
  --backend express \
  --database postgresql \
  --orm prisma \
  --auth jwt \
  --package-manager pnpm \
  --git \
  --install
```

## ✨ Features

### Supported Technologies

**Frontend:** React, Vue, Angular, Svelte, Next.js, Nuxt, React Native  
**Backend:** Express, Fastify, Koa, Hapi, NestJS  
**Databases:** PostgreSQL, MySQL, SQLite, MongoDB  
**ORMs:** Prisma, Sequelize, TypeORM, Mongoose  
**Auth:** JWT, Passport, Auth0, OAuth, Better Auth  
**Addons:** Docker, Testing, Biome, Turborepo  
**Package Managers:** npm, yarn, pnpm, bun

## 📖 Usage Examples

### Full-Stack React App

```bash
npx create-js-stack@latest my-app \
  --frontend react \
  --backend express \
  --database postgresql \
  --orm prisma \
  --auth jwt \
  --addons docker,testing \
  --package-manager pnpm
```

### Next.js Full-Stack

```bash
npx create-js-stack@latest my-app \
  --frontend nextjs \
  --database postgresql \
  --orm prisma \
  --auth better-auth \
  --package-manager pnpm
```

### API Backend Only

```bash
npx create-js-stack@latest my-api \
  --frontend none \
  --backend nestjs \
  --database postgresql \
  --orm typeorm \
  --auth jwt \
  --addons docker,testing
```

## 📋 CLI Options

| Option              | Description                | Values                                                                |
| ------------------- | -------------------------- | --------------------------------------------------------------------- |
| `--frontend`        | Frontend framework(s)      | `react`, `vue`, `angular`, `svelte`, `nextjs`, `nuxt`, `react-native` |
| `--backend`         | Backend framework          | `express`, `fastify`, `koa`, `hapi`, `nestjs`, `none`                 |
| `--database`        | Database system            | `postgresql`, `mysql`, `sqlite`, `mongodb`, `none`                    |
| `--orm`             | ORM/ODM                    | `prisma`, `sequelize`, `typeorm`, `mongoose`, `none`                  |
| `--auth`            | Authentication             | `jwt`, `passport`, `auth0`, `oauth`, `better-auth`, `none`            |
| `--addons`          | Additional tools           | `docker`, `testing`, `biome`, `turborepo`                             |
| `--package-manager` | Package manager            | `npm`, `yarn`, `pnpm`, `bun`                                          |
| `--git`             | Initialize git repository  | Flag                                                                  |
| `--install`         | Install dependencies       | Flag                                                                  |
| `--yes`             | Use defaults (quick start) | Flag                                                                  |

> **Note:** Project name is always customizable, even with `--yes` flag.

## 🌐 Interactive Builder

Visit [js-stack.vercel.app/new](https://js-stack.vercel.app/new) to use our interactive stack builder and generate commands visually.

## 📚 Documentation

- **Getting Started:** [js-stack.vercel.app/docs/getting-started](https://js-stack.vercel.app/docs/getting-started)
- **Technologies:** [js-stack.vercel.app/docs/technologies](https://js-stack.vercel.app/docs/technologies)
- **Commands:** [js-stack.vercel.app/docs/commands](https://js-stack.vercel.app/docs/commands)
- **Examples:** [js-stack.vercel.app/docs/examples](https://js-stack.vercel.app/docs/examples)

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/vipinyadav01/js-stack.git
cd js-stack

# Install dependencies
npm install

# Build CLI
npm run build:cli

# Link for local testing
npm link

# Test locally
create-js-stack init test-project
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website:** [js-stack.vercel.app](https://js-stack.vercel.app)
- **Documentation:** [js-stack.vercel.app/docs](https://js-stack.vercel.app/docs)
- **GitHub:** [github.com/vipinyadav01/js-stack](https://github.com/vipinyadav01/js-stack)
- **NPM:** [npmjs.com/package/create-js-stack](https://www.npmjs.com/package/create-js-stack)

---

<div align="center">

**Built with ❤️ by [Vipin Yadav](https://vipinyadav01.vercel.app)**

[Website](https://js-stack.vercel.app) • [Documentation](https://js-stack.vercel.app/docs) • [GitHub](https://github.com/vipinyadav01/js-stack)

</div>
