import {
  intro,
  outro,
  text,
  select,
  multiselect,
  confirm,
  spinner,
  cancel,
  isCancel,
} from "@clack/prompts";
import chalk from "chalk";
import validatePackageName from "validate-npm-package-name";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "./types.js";

export async function promptProjectName(suggestedName) {
  const projectName = await text({
    message: "What is your project name?",
    placeholder: suggestedName || "my-awesome-app",
    defaultValue: suggestedName || "",
    validate(value) {
      if (!value) return "Project name is required";

      const validation = validatePackageName(value);
      if (!validation.validForNewPackages) {
        const errors = [
          ...(validation.errors || []),
          ...(validation.warnings || []),
        ];
        return errors[0] || "Invalid project name";
      }
    },
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return projectName;
}

export async function promptDatabase() {
  const database = await select({
    message: "Select a database",
    options: [
      { value: DATABASE_OPTIONS.NONE, label: "None" },
      {
        value: DATABASE_OPTIONS.SQLITE,
        label: "SQLite - Lightweight, file-based",
      },
      {
        value: DATABASE_OPTIONS.POSTGRES,
        label: "PostgreSQL - Advanced, reliable",
      },
      {
        value: DATABASE_OPTIONS.MYSQL,
        label: "MySQL - Popular, well-supported",
      },
      { value: DATABASE_OPTIONS.MONGODB, label: "MongoDB - NoSQL, flexible" },
    ],
  });

  if (isCancel(database)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return database;
}

export async function promptORM(database) {
  if (database === DATABASE_OPTIONS.NONE) {
    return ORM_OPTIONS.NONE;
  }

  const ormOptions = [];

  if (database === DATABASE_OPTIONS.MONGODB) {
    ormOptions.push(
      {
        value: ORM_OPTIONS.MONGOOSE,
        label: "Mongoose - MongoDB object modeling",
      },
      { value: ORM_OPTIONS.NONE, label: "None - Use native driver" },
    );
  } else {
    ormOptions.push(
      { value: ORM_OPTIONS.PRISMA, label: "Prisma - Modern, type-safe ORM" },
      {
        value: ORM_OPTIONS.SEQUELIZE,
        label: "Sequelize - Popular, feature-rich",
      },
      { value: ORM_OPTIONS.TYPEORM, label: "TypeORM - TypeScript-first" },
      { value: ORM_OPTIONS.NONE, label: "None - Use raw SQL" },
    );
  }

  const orm = await select({
    message: "Select an ORM/ODM",
    options: ormOptions,
  });

  if (isCancel(orm)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return orm;
}

export async function promptBackend() {
  const backend = await select({
    message: "Select a backend framework",
    options: [
      {
        value: BACKEND_OPTIONS.EXPRESS,
        label: "Express - Minimal and flexible",
      },
      { value: BACKEND_OPTIONS.FASTIFY, label: "Fastify - Fast and efficient" },
      {
        value: BACKEND_OPTIONS.NESTJS,
        label: "NestJS - Enterprise-grade, Angular-like",
      },
      { value: BACKEND_OPTIONS.KOA, label: "Koa - Modern, lightweight" },
      { value: BACKEND_OPTIONS.HAPI, label: "Hapi - Configuration-centric" },
      { value: BACKEND_OPTIONS.NONE, label: "None - Frontend only" },
    ],
  });

  if (isCancel(backend)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return backend;
}

export async function promptFrontend() {
  const frontend = await multiselect({
    message: "Select frontend framework(s)",
    options: [
      {
        value: FRONTEND_OPTIONS.REACT,
        label: "React - Component-based UI library",
      },
      {
        value: FRONTEND_OPTIONS.NEXTJS,
        label: "Next.js - React framework with SSR/SSG",
      },
      { value: FRONTEND_OPTIONS.VUE, label: "Vue - Progressive framework" },
      {
        value: FRONTEND_OPTIONS.NUXT,
        label: "Nuxt - Vue framework with SSR/SSG",
      },
      {
        value: FRONTEND_OPTIONS.ANGULAR,
        label: "Angular - Full-featured framework",
      },
      {
        value: FRONTEND_OPTIONS.SVELTE,
        label: "Svelte - Compile-time optimized",
      },
      {
        value: FRONTEND_OPTIONS.REACT_NATIVE,
        label: "React Native - Mobile apps",
      },
      { value: FRONTEND_OPTIONS.NONE, label: "None - Backend only" },
    ],
    required: false,
  });

  if (isCancel(frontend)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return frontend.length === 0 ? [FRONTEND_OPTIONS.NONE] : frontend;
}

export async function promptAuth() {
  const auth = await select({
    message: "Select authentication method",
    options: [
      { value: AUTH_OPTIONS.JWT, label: "JWT - JSON Web Tokens" },
      { value: AUTH_OPTIONS.PASSPORT, label: "Passport - Multiple strategies" },
      { value: AUTH_OPTIONS.AUTH0, label: "Auth0 - Managed authentication" },
      {
        value: AUTH_OPTIONS.FIREBASE,
        label: "Firebase Auth - Google's auth service",
      },
      { value: AUTH_OPTIONS.NONE, label: "None - No authentication" },
    ],
  });

  if (isCancel(auth)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return auth;
}

export async function promptAddons() {
  const addons = await multiselect({
    message: "Select additional tools",
    options: [
      { value: ADDON_OPTIONS.ESLINT, label: "ESLint - Code linting" },
      { value: ADDON_OPTIONS.PRETTIER, label: "Prettier - Code formatting" },
      { value: ADDON_OPTIONS.HUSKY, label: "Husky - Git hooks" },
      { value: ADDON_OPTIONS.DOCKER, label: "Docker - Containerization" },
      { value: ADDON_OPTIONS.GITHUB_ACTIONS, label: "GitHub Actions - CI/CD" },
      {
        value: ADDON_OPTIONS.TESTING,
        label: "Testing - Jest & Testing Library",
      },
    ],
    required: false,
  });

  if (isCancel(addons)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return addons;
}

export async function promptPackageManager() {
  const pm = await select({
    message: "Select package manager",
    options: [
      {
        value: PACKAGE_MANAGER_OPTIONS.NPM,
        label: "npm - Default Node.js package manager",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.YARN,
        label: "Yarn - Fast, reliable alternative",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.PNPM,
        label: "pnpm - Efficient disk space usage",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.BUN,
        label: "Bun - All-in-one JavaScript runtime",
      },
    ],
  });

  if (isCancel(pm)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return pm;
}

export async function promptGit() {
  const git = await confirm({
    message: "Initialize git repository?",
    initialValue: true,
  });

  if (isCancel(git)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return git;
}

export async function promptInstall() {
  const install = await confirm({
    message: "Install dependencies?",
    initialValue: true,
  });

  if (isCancel(install)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return install;
}

export async function collectProjectConfig(projectName, options = {}) {
  intro(chalk.cyan("🚀 Create JavaScript Stack"));

  const config = {
    projectName: projectName || (await promptProjectName()),
    database: options.database || (await promptDatabase()),
    backend: options.backend || (await promptBackend()),
    frontend: options.frontend || (await promptFrontend()),
    auth: options.auth || (await promptAuth()),
    addons: options.addons || (await promptAddons()),
    packageManager: options.pm || (await promptPackageManager()),
    git: options.git !== false ? options.git || (await promptGit()) : false,
    install:
      options.install !== false
        ? options.install || (await promptInstall())
        : false,
  };

  // Get ORM based on database selection
  config.orm = options.orm || (await promptORM(config.database));

  return config;
}

export { spinner, outro, intro, cancel };
