# JS-Stack Agent Rules

Full-stack JavaScript scaffolding CLI tool with marketing website and interactive builder.

## Project Structure

- `cli/` - The actual CLI tool that generates projects (Commander.js + Handlebars templates)
- `web/` - Marketing website + interactive builder that shows CLI capabilities and generates commands

## Web Purpose

- Marketing site: Showcase CLI features, documentation, examples, use cases
- Interactive builder: Let users select their stack visually
- Command generator: Output the exact CLI command users need to run
- NOT a code generator: Web doesn't generate projects, it shows how to use the CLI

## CLI Purpose

- Project generator: Creates full-stack projects based on user selections
- Template engine: Uses Handlebars templates in layers
- Actual tool: Users install via npm and run commands

## Tech Stack

- CLI: Commander.js, @clack/prompts, Handlebars, Yup, Chalk, ESBuild
- Web: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Fumadocs
- Deployment: Vercel (Next.js standard deployment)

## Supported Technologies

- Frontend: React, Vue, Angular, Svelte, Next.js, Nuxt, React Native
- Backend: Express, Fastify, Koa, Hapi, NestJS
- Databases: PostgreSQL, MySQL, SQLite, MongoDB
- ORMs: Prisma, Sequelize, TypeORM, Mongoose
- Auth: JWT, Passport, Auth0, OAuth, Better Auth
- Addons: Docker, Testing, Biome, Turborepo

## CLI Architecture

- `cli/commands/` - Command handlers (init, add, list)
- `cli/generators/` - Project generation logic
- `cli/templates/templates/` - Layered Handlebars templates (01-base -> 06-deployment)
- `cli/utils/` - File operations, validation helpers
- `cli/core/` - CLICore, CompatibilityEngine
- `cli/config/` - ValidationSchemas.js (Yup validation rules)
- `cli/cli.js` - Commander.js entry point

## Template Layers (CLI generates in this order)

1. Base - package.json, .gitignore, README
2. Frameworks - Frontend/backend setup files
3. Integrations - Database, auth configurations
4. Features - Business logic, API routes
5. Tooling - Docker, testing configs
6. Deployment - CI/CD, deployment configs

## Web Architecture

- `src/app/` - Next.js App Router pages (homepage, docs, builder, examples)
- `src/app/docs/[[...slug]]/` - Fumadocs documentation pages (dynamic routing)
- `content/docs/` - MDX documentation files (Fumadocs content)
- `src/components/builder/` - Interactive stack builder interface
- `src/components/builder/config.ts` - Stack options configuration (MUST match CLI)
- `src/components/ui/` - shadcn/ui components
- `src/lib/` - Utilities, helpers
- `src/hooks/` - Custom React hooks
- `src/.source.ts` - Fumadocs source loader configuration

## Web User Flow

1. User visits website and learns about CLI features
2. User goes to interactive builder page
3. User selects stack options (frontend, backend, database, etc)
4. Web validates selections and checks compatibility
5. Web generates and displays CLI command to run
6. User copies command and runs it in their terminal
7. CLI tool generates the actual project

## Development Commands

- `npm run dev` - Run both CLI and web concurrently
- `npm run dev:cli` - CLI development only
- `npm run dev:web` - Web development only (localhost:3000)
- `npm run build` - Build everything (web + CLI)
- `npm run build:cli` - Build CLI for distribution
- `npm run build:web` - Build web for Cloudflare Pages (static export)
- `npm run clean` - Clear build artifacts

## Vercel Deployment

- Uses standard Next.js deployment (no `output: "export"` needed)
- Build output: `.next/` directory
- Build command: `npm run build` (in web/ directory)
- Node version: 18+
- Environment variables: Set in Vercel dashboard
- Supports full Next.js features including SSR, API routes, and Image Optimization
- Deployment is automatic on push to main via Vercel GitHub integration

## CLI Testing

- `node cli/cli.js init my-app --dry-run --verbose` - Test CLI without creating files
- `npx create-js-stack@latest my-app --frontend react --backend express` - Real usage

## CLI Options

- `--frontend <type>` - Frontend framework
- `--backend <type>` - Backend framework
- `--database <type>` - Database system
- `--orm <type>` - ORM/ODM choice
- `--auth <type>` - Authentication method
- `--package-manager <mgr>` - npm, yarn, pnpm, or bun
- `--addons <list>` - Comma-separated addons (docker,testing,biome)
- `--git` - Initialize git repository
- `--install` - Install dependencies automatically
- `--dry-run` - Preview without creating files
- `--verbose` - Show detailed output

## CLI Development Rules

DO:
- Use Commander.js `.option()` with short and long forms
- Use @clack/prompts for interactive questions
- Validate all inputs with Yup schemas from ValidationSchemas.js
- Follow template layer order strictly (base -> framework -> integration -> feature -> tooling -> deployment)
- Test with `--dry-run --verbose` before making real changes
- Use chalk for colored terminal output
- Check compatibility rules before generation

DON'T:
- Create duplicate CLI options (all in cli/cli.js)
- Skip validation of user inputs
- Mix template logic between layers
- Hard-code file paths

## Web Development Rules

DO:
- Use TypeScript strict mode for all files
- Use functional components with arrow functions
- Use React hooks (useState, useEffect, useCallback, useMemo)
- Use Tailwind CSS utilities exclusively
- Use shadcn/ui components for UI
- Use Fumadocs for documentation (MDX files in content/docs/)
- Keep config.ts synchronized with CLI ValidationSchemas.js
- Generate exact CLI commands that match actual CLI options
- Use Next.js App Router patterns (app/ directory)
- Make the builder interactive and user-friendly
- Show examples and documentation clearly
- Ensure all pages are Vercel-compatible
- Use unoptimized images for static export compatibility

DON'T:
- Use Next.js Pages Router
- Use TypeScript `any` type
- Create custom CSS files
- Generate commands that don't match CLI
- Try to generate projects in the browser (that's CLI's job)

## Web Builder Flow

User selects frontend -> Update available backend options -> User selects backend -> Show compatible databases -> User selects database -> Show compatible ORMs -> User selects ORM -> Show compatible auth options -> User selects auth -> Show additional addons -> User configures options -> Validate entire selection -> Generate CLI command -> Display command with copy button -> Show installation instructions

## Command Generation Example

User selections:
- Frontend: React
- Backend: Express
- Database: MongoDB
- ORM: Mongoose
- Auth: JWT
- Package Manager: npm
- Addons: Docker, Testing

Generated command:
```
npx create-js-stack@latest my-app --frontend react --backend express --database mongodb --orm mongoose --auth jwt --package-manager npm --addons docker,testing --git --install
```

## Handlebars Syntax (CLI templates)

- Variables: `{{projectName}}` `{{packageManager}}` `{{database}}`
- Conditionals: `{{#if (eq orm "prisma")}}...{{else if (eq orm "mongoose")}}...{{/if}}`
- Iteration: `{{#each items}}{{this}}{{/each}}`
- Helpers: eq (equal), ne (not equal), and, or, not, contains

## Template Variables

- `projectName` - Project name
- `packageManager` - npm, yarn, pnpm, bun
- `description` - Project description
- `frontend` - Frontend framework choice
- `backend` - Backend framework choice
- `database` - Database system
- `orm` - ORM/ODM choice
- `auth` - Authentication method
- `git` - Boolean for git init
- `install` - Boolean for auto-install
- `docker` - Boolean for Docker config
- `testing` - Boolean for testing setup

## Compatibility Matrix (enforced by both CLI and web)

- MongoDB -> Mongoose ONLY (no other ORMs work with MongoDB)
- PostgreSQL/MySQL/SQLite -> Prisma, Sequelize, TypeORM
- Next.js -> Better Auth, Auth0, JWT, OAuth
- React/Vue -> Auth0, Better Auth, JWT, OAuth, Passport
- Angular -> Auth0, JWT, OAuth, Passport

## Compatibility Enforcement

- CLI: `cli/config/ValidationSchemas.js` (Yup validation)
- CLI: `cli/core/CompatibilityEngine.js` (runtime checks)
- Web: `web/src/components/builder/config.ts` (builder validation)
- Web builder must disable incompatible options in real-time

## File Conventions

- CLI code: `.js` files (ES modules with import/export)
- Web code: `.tsx` for components, `.ts` for utilities
- Templates: `.hbs` (Handlebars templates)
- Config: `.json`, `.js`
- Styling: Tailwind utilities only (no custom CSS)

## Critical Config Sync

- `web/src/components/builder/config.ts` MUST have same options as `cli/config/ValidationSchemas.js`
- Web must validate combinations the same way CLI does
- Web must generate commands that CLI can actually parse
- Test web-generated commands by running them with `--dry-run`

## Debugging Web Issues

1. Check Next.js dev console for build errors
2. Open browser DevTools (Console and Network tabs)
3. Verify config.ts matches CLI ValidationSchemas.js
4. Test generated command manually in terminal with `--dry-run`
5. Check TypeScript errors in IDE
6. Verify compatibility logic matches CLI

## Debugging CLI Issues

1. Run with `--verbose --dry-run` flags
2. Check option parsing in `cli/cli.js`
3. Verify schema validation in ValidationSchemas.js
4. Check template exists: `cli/templates/templates/{layer}/{tech}/`
5. Test compatibility rules in CompatibilityEngine
6. Check Handlebars syntax in templates

## Common Issues

- Wrong flag: Use `--package-manager` (not `--pm`)
- Build errors: Run `npm run clean && npm install`
- Template not found: Check layer directory structure
- Compatibility error: Verify rules in ValidationSchemas.js
- Command doesn't work: Test with `--dry-run --verbose`
- Web/CLI mismatch: Sync config.ts with ValidationSchemas.js

## Adding New Technology

1. Add to `cli/config/ValidationSchemas.js` (validation rules)
2. Add to `web/src/components/builder/config.ts` (web options)
3. Add to `cli/cli.js` (Commander options)
4. Create templates in `cli/templates/templates/{layer}/{tech}/`
5. Update CompatibilityEngine.js if tech has compatibility rules
6. Test CLI with `--dry-run`
7. Test web builder generates correct command
8. Verify compatibility checks work

## Web Pages Structure

- `/` - Homepage (hero, features, benefits, CTA to builder)
- `/new` - Interactive stack builder (main feature)
- `/docs` - Fumadocs documentation (MDX files from content/docs/)
- `/docs/getting-started` - Getting started guide
- `/docs/technologies` - Supported technologies
- `/docs/commands` - CLI commands reference
- `/docs/examples` - Example projects
- `/analytics` - Usage analytics dashboard
- `/features` - Features showcase
- `/sponsors` - Sponsors page

## Fumadocs Documentation

- Documentation files: `web/content/docs/*.mdx`
- Source loader: `web/src/.source.ts`
- Docs pages: `web/src/app/docs/[[...slug]]/`
- Config: `web/fumadocs.config.ts`
- Uses MDX for rich content (React components in markdown)
- Auto-generates table of contents
- Supports code highlighting
- Static generation compatible with Cloudflare Pages

## Web Component Pattern

```tsx
'use client';
import { useState } from 'react';
interface Props { title: string; }
const Component = ({ title }: Props) => {
  const [value, setValue] = useState<string>('');
  return <div className="p-4 space-y-2">{title}</div>;
};
export default Component;
```

## CLI Command Pattern

```js
import { confirm } from '@clack/prompts';
import chalk from 'chalk';
export async function command(options) {
  try {
    const validated = await validateInput(options);
    const answer = await confirm({ message: 'Continue?' });
    console.log(chalk.green('✓ Success'));
  } catch (error) {
    console.error(chalk.red('✗ Error:'), error.message);
    process.exit(1);
  }
}
```

## Template Pattern

```hbs
{{#if (eq database "mongodb")}}
import mongoose from 'mongoose';
{{else if (eq database "postgresql")}}
import { Pool } from 'pg';
{{/if}}
```

## Builder State Management

- Store selections in React state
- Validate on each selection change
- Update available options based on compatibility
- Generate command in real-time
- Show/hide incompatible options
- Display helpful error messages
- Provide reset button

## Command Display

- Show command in copyable code block
- Provide copy button with feedback
- Show alternative commands (different package managers)
- Display step-by-step installation instructions
- Link to relevant documentation
- Show expected project structure

## Quality Standards

- TypeScript strict mode (web)
- ESLint + Prettier formatting
- Node.js 18+ compatibility
- ES modules (import/export)
- WCAG AA accessibility compliance
- Semantic versioning
- Responsive design (mobile, tablet, desktop)

## Testing Checklist

- CLI: Test all flag combinations with `--dry-run`
- CLI: Verify all templates generate correctly
- CLI: Test compatibility rules enforce properly
- Web: Test builder with all tech combinations
- Web: Verify generated commands work in terminal
- Web: Test responsive design on all screen sizes
- Web: Test accessibility with keyboard navigation
- Web: Verify config.ts matches ValidationSchemas.js

## User Experience Priorities

- Make builder intuitive and fast
- Show clear compatibility hints
- Provide helpful error messages
- Display beautiful project examples
- Make documentation searchable
- Show realistic use cases
- Provide quick start guide
- Include video demos or GIFs

## Always Remember

- Web shows capabilities, CLI does the work
- Web generates commands, CLI generates projects
- Keep config synchronized between web and CLI
- Test generated commands with `--dry-run`
- Web is marketing + builder, not a code generator
- Builder must match CLI's actual capabilities
- Validate compatibility in real-time on web
- Every web-generated command must work in CLI
