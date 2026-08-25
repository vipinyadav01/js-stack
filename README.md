# Create JS Stack CLI

[![npm version](https://img.shields.io/npm/v/@vipinyadav02/createjsstack.svg)](https://www.npmjs.com/package/@vipinyadav02/createjsstack)
[![npm downloads](https://img.shields.io/npm/dm/@vipinyadav02/createjsstack.svg)](https://www.npmjs.com/package/@vipinyadav02/createjsstack)
[![License](https://img.shields.io/npm/l/@vipinyadav02/createjsstack.svg)](https://github.com/vipinyadav01/js-stack/blob/main/LICENSE)

> A powerful CLI tool for scaffolding production-ready JavaScript full-stack projects with best practices built-in.

## 🚀 Quick Start

```bash
# Interactive setup (recommended)
npx @vipinyadav02/createjsstack@latest my-app

# Quick start with defaults
npx @vipinyadav02/createjsstack@latest my-app --yes

# Start from a preset
npx @vipinyadav02/createjsstack@latest my-app --preset mern --yes

# Custom stack
npx @vipinyadav02/createjsstack@latest my-app \
  --frontend react \
  --backend express \
  --database mongodb \
  --orm mongoose \
  --package-manager pnpm \
  --git \
  --install
```

## 🧠 How It Works

`createjsstack` builds your project by **layering templates** on top of each other,
one per choice you make:

```
base  →  frontend  →  backend  →  database/orm  →  auth  →  api  →  addons  →  examples
```

Each layer contributes its own files. For `package.json`, the layers are **deep-merged**
(not overwritten), so the dependencies and scripts from every layer are combined into a
single coherent file. Your project always gets a base (`package.json`, `README.md`,
`.gitignore`, `LICENSE`) plus everything your selected stack needs.

You can configure the stack in three ways, and they compose left-to-right (later wins):

1. **Presets** — a named bundle of choices (`--preset mern`)
2. **Individual flags** — override any single choice (`--database postgres`)
3. **Interactive prompts** — run with no flags for a guided setup

```bash
# Preset as a base, then override just the database + orm
npx @vipinyadav02/createjsstack@latest my-app --preset mern --database postgres --orm prisma --yes
```

## 📦 Presets

| Preset           | Frontend | Backend | Database | ORM      |
| ---------------- | -------- | ------- | -------- | -------- |
| `mern`           | react    | express | mongodb  | mongoose |
| `next-fullstack` | next     | next    | postgres | prisma   |
| `react-vite`     | react    | —       | —        | —        |
| `express-api`    | —        | express | postgres | prisma   |

```bash
# List all presets
npx @vipinyadav02/createjsstack@latest list
```

## ✨ Features

### Supported Technologies

**Frontend:** react, next, vue, nuxt, svelte, sveltekit, solid, qwik, astro, angular, remix, react-router, tanstack-router, tanstack-start, native-nativewind, native-unistyles  
**Backend:** express, hono, fastify, nest, koa, elysia, next, convex  
**Databases:** mongodb, postgres, mysql, sqlite  
**ORMs:** prisma, drizzle, mongoose, typeorm, mikro-orm  
**Auth:** better-auth, clerk, next-auth, lucia  
**API:** trpc, orpc, graphql, rest  
**Addons:** docker, biome, turborepo, pwa, tauri, vitest, playwright, cypress  
**Package Managers:** npm, pnpm, bun

## 📖 Usage Examples

### MERN (MongoDB + Express + React)

```bash
npx @vipinyadav02/createjsstack@latest my-app --preset mern --yes
```

### Next.js Full-Stack

```bash
npx @vipinyadav02/createjsstack@latest my-app \
  --frontend next \
  --backend next \
  --database postgres \
  --orm prisma \
  --auth better-auth \
  --package-manager pnpm
```

### API Backend Only

```bash
npx @vipinyadav02/createjsstack@latest my-api \
  --frontend none \
  --backend nest \
  --database postgres \
  --orm typeorm \
  --addons docker
```

## 📋 CLI Options

| Option              | Description                | Values                                                                          |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `--preset`          | Start from a preset        | `mern`, `next-fullstack`, `react-vite`, `express-api`                            |
| `--frontend`        | Frontend framework         | `react`, `next`, `vue`, `nuxt`, `svelte`, `angular`, `solid`, `astro`, … `none` |
| `--backend`         | Backend framework          | `express`, `hono`, `fastify`, `nest`, `koa`, `elysia`, `next`, `convex`, `none`  |
| `--database`        | Database system            | `mongodb`, `postgres`, `mysql`, `sqlite`, `none`                                 |
| `--orm`             | ORM/ODM                    | `prisma`, `drizzle`, `mongoose`, `typeorm`, `mikro-orm`, `none`                  |
| `--auth`            | Authentication             | `better-auth`, `clerk`, `next-auth`, `lucia`, `none`                             |
| `--api`             | API style                  | `trpc`, `orpc`, `graphql`, `rest`, `none`                                        |
| `--runtime`         | Runtime environment        | `node`, `bun`, `deno`, `workers`                                                 |
| `--addons`          | Additional tools (CSV)     | `docker`, `biome`, `turborepo`, `pwa`, `tauri`, `vitest`, `playwright`           |
| `--package-manager` | Package manager            | `npm`, `pnpm`, `bun`                                                             |
| `--git` / `--no-git`         | Initialize git repository  | Flag                                                                   |
| `--install` / `--no-install` | Install dependencies       | Flag                                                                   |
| `--yes`             | Use defaults (skip prompts) | Flag                                                                            |

> **Note:** Project name is always customizable, even with `--yes` flag.
> Run `npx @vipinyadav02/createjsstack@latest create --help` for the full option list.

## 🌐 Interactive Builder

Visit [createjsstack.dev/new](https://createjsstack.dev/new) to use our interactive stack builder and generate commands visually.

## 📚 Documentation

- **Getting Started:** [createjsstack.dev/docs/getting-started](https://createjsstack.dev/docs/getting-started)
- **Technologies:** [createjsstack.dev/docs/technologies](https://createjsstack.dev/docs/technologies)
- **Commands:** [createjsstack.dev/docs/commands](https://createjsstack.dev/docs/commands)
- **Examples:** [createjsstack.dev/docs/examples](https://createjsstack.dev/docs/examples)

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
createjsstack create test-project --preset mern --yes
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

- **Website:** [createjsstack.dev](https://createjsstack.dev)
- **Documentation:** [createjsstack.dev/docs](https://createjsstack.dev/docs)
- **GitHub:** [github.com/vipinyadav01/js-stack](https://github.com/vipinyadav01/js-stack)
- **NPM:** [npmjs.com/package/@vipinyadav02/createjsstack](https://www.npmjs.com/package/@vipinyadav02/createjsstack)

---

<div align="center">

**Built with ❤️ by [Vipin Yadav](https://vipinyadav01.vercel.app)**

[Website](https://createjsstack.dev) • [Documentation](https://createjsstack.dev/docs) • [GitHub](https://github.com/vipinyadav01/js-stack)

</div>
