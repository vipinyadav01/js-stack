# Claude Code Instructions - JS-Stack

Full-stack JavaScript scaffolding CLI tool with marketing website, documentation, and interactive stack builder.

> See [AGENTS.md](./AGENTS.md) for exhaustive architectural rules, full compatibility matrices, and layer references.

---

## 🚀 Key Commands

### Development

- `npm run dev` - Run both CLI and web concurrently (Turborepo)
- `npm run dev:cli` - Run CLI directly from TypeScript source (`tsx src/cli.ts`)
- `npm run dev:web` - Run web app only with Next.js Turbopack (`localhost:3000`)

### Building & Verification

- `npm run build` - Full build: CLI (`npm run build:cli`) + Web (`turbo run build`)
- `npm run build:cli` - Build CLI with `tsdown` (`dist/cli.mjs` and `dist/index.mjs`)
- `npm run build:web` - Build web for production (`turbo run build --filter=web`)
- `npm run type-check` - TypeScript checks across CLI and web (`tsc --noEmit && npm run type-check --workspace=web`)
- `npm run lint` - Run ESLint across packages (`turbo run lint`)
- `npm run format` - Format codebase with Prettier (`prettier --write .`)
- `npm run format:check` - Check code style with Prettier without writing (`prettier --check .`)
- `npm run test` - Run tests across workspace (`turbo run test`)
- `npm run clean` - Clear build artifacts and caches (`turbo run clean`)

### Testing the CLI

- `node dist/cli.mjs my-app --dry-run --verbose` - Test built CLI without creating files
- `npm run dev:cli -- my-app --dry-run --verbose` - Test CLI directly from TypeScript source
- `npx @vipinyadav02/createjsstack@latest my-app --frontend react --backend express` - Real production usage

### Release & Changesets

- `npm run changeset` - Create a new changeset for release notes and version bumping
- `npm run version-packages` - Consume changesets and bump package versions
- `npm run publish:npm` - Build and publish the CLI package to npm

---

## 📁 Repository Structure

```
├── src/                  # CLI source code (TypeScript, Commander.js, Zod, PostHog)
│   ├── cli.ts            # Commander entry point, CLI banner, and options registration
│   ├── commands/         # Subcommands (create, list, add-preset, analytics, sponsors, docs)
│   ├── helpers/core/     # Project scaffolding & template assembly engine
│   ├── validation.ts     # Zod validation schemas & cross-technology compatibility rules
│   ├── presets.ts        # Built-in presets (mern, next-fullstack, react-vite, etc.)
│   ├── constants.ts      # Core options, lists, and defaults
│   └── utils/            # Handlebars helpers, java backend checks, biome formatter
├── templates/            # Layered Handlebars templates (base, backend, frontend, db, auth, etc.)
├── web/                  # Next.js 16 App Router marketing site & builder (npm workspace)
│   ├── src/app/          # Routes: /, /new, /docs/[[...slug]], /analytics, /features, /sponsors
│   ├── content/docs/     # MDX documentation content (Fumadocs)
│   ├── src/components/   # UI primitives (shadcn/ui, Radix UI) & interactive builder
│   └── src/lib/          # Structured JSON-LD schema (site-schema.ts), analytics, utilities
├── scripts/              # Automation scripts (build.js, release.js, publish-npm.js)
├── .changeset/           # Multi-package versioning config & pending changesets
└── .husky/               # Git pre-commit (lint-staged) and pre-push hooks
```

---

## ⚠️ Critical Development Rules

1. **Config Synchronization:**
   - `web/src/components/builder/config.ts` **MUST** stay exactly in sync with `src/validation.ts` and `src/constants.ts`.
   - The web builder generates exact CLI commands; any option supported on web must be valid in the CLI.

2. **Templates & Prettier:**
   - **DO NOT** format Handlebars `.hbs` files with Prettier. They are ignored via `.prettierignore`. Formatting them can break template expressions.

3. **SEO & Trailing Slashes:**
   - Next.js enforces `trailingSlash: true` in `web/next.config.ts`.
   - All internal links, canonical URLs, and sitemap entries **MUST** include a trailing slash (e.g. `https://www.createjsstack.dev/docs/`) to avoid 308 redirect loops.

4. **SEO Robots Policy:**
   - `web/src/app/robots.ts` must allow crawlers to access `/_next/` static resources (CSS/JS) to prevent Google Search Console indexing warnings.

5. **Type Safety & Code Style:**
   - Strict TypeScript everywhere; avoid `any`.
   - Use Tailwind CSS v4 utilities for styling in `web/` without creating custom CSS files.
   - Test changes with `--dry-run --verbose` before committing.
