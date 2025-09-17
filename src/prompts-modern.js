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
  note,
  log,
} from "@clack/prompts";
import chalk from "chalk";
import gradient from "gradient-string";
import validatePackageName from "validate-npm-package-name";
import boxen from "boxen";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
} from "./config/ValidationSchemas.js";
import {
  displayBanner,
  displayWelcome,
  createModernSpinner,
} from "./utils/modern-render.js";

// Clean color scheme
const colors = {
  primary: chalk.blue.bold,
  secondary: chalk.gray,
  success: chalk.green.bold,
  warning: chalk.yellow.bold,
  error: chalk.red.bold,
  muted: chalk.gray,
  accent: chalk.cyan.bold,
};

export async function promptProjectName(suggestedName) {
  console.log();
  console.log(colors.primary("╭─ Project Setup"));
  console.log(colors.secondary("│  Let's start by naming your project"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const projectName = await text({
    message: colors.accent("What should we call your project?"),
    placeholder: suggestedName || "my-awesome-app",
    defaultValue: suggestedName || "",
    validate(value) {
      if (!value) return chalk.red("⚠️  Project name is required");

      const validation = validatePackageName(value);
      if (!validation.validForNewPackages) {
        const errors = [
          ...(validation.errors || []),
          ...(validation.warnings || []),
        ];
        return chalk.red(`⚠️  ${errors[0] || "Invalid project name"}`);
      }
    },
  });

  if (isCancel(projectName)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return projectName;
}

export async function promptDatabase() {
  console.log();
  console.log(colors.primary("╭─ Database Selection"));
  console.log(colors.secondary("│  Choose your data storage solution"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const database = await select({
    message: colors.accent("Choose your database"),
    options: [
      {
        value: DATABASE_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip database"),
        hint: "No database integration",
      },
      {
        value: DATABASE_OPTIONS.SQLITE,
        label: `${colors.success("💾")} SQLite`,
        hint: "Lightweight, file-based, perfect for development",
      },
      {
        value: DATABASE_OPTIONS.POSTGRES,
        label: `${colors.primary("🐘")} PostgreSQL`,
        hint: "Advanced features, enterprise-ready",
      },
      {
        value: DATABASE_OPTIONS.MYSQL,
        label: `${colors.accent("🐬")} MySQL`,
        hint: "Popular, well-supported, reliable",
      },
      {
        value: DATABASE_OPTIONS.MONGODB,
        label: `${colors.success("🍃")} MongoDB`,
        hint: "NoSQL, flexible schemas, scalable",
      },
    ],
  });

  if (isCancel(database)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return database;
}

export async function promptORM(database) {
  if (database === DATABASE_OPTIONS.NONE) {
    return ORM_OPTIONS.NONE;
  }

  console.log();
  console.log(g.info("🔧 ORM/ODM Selection"));

  const ormOptions = [];

  if (database === DATABASE_OPTIONS.MONGODB) {
    ormOptions.push(
      {
        value: ORM_OPTIONS.MONGOOSE,
        label: `${chalk.green("🍃")} Mongoose`,
        hint: "Elegant MongoDB object modeling",
      },
      {
        value: ORM_OPTIONS.NONE,
        label: chalk.gray("⏭️  Skip ORM"),
        hint: "Use native MongoDB driver",
      },
    );
  } else {
    ormOptions.push(
      {
        value: ORM_OPTIONS.PRISMA,
        label: `${chalk.magenta("▲")} Prisma`,
        hint: "Modern, type-safe, auto-generated queries",
      },
      {
        value: ORM_OPTIONS.SEQUELIZE,
        label: `${chalk.blue("🔷")} Sequelize`,
        hint: "Feature-rich, supports multiple databases",
      },
      {
        value: ORM_OPTIONS.TYPEORM,
        label: `${chalk.cyan("📘")} TypeORM`,
        hint: "TypeScript-first, decorators, migrations",
      },
      {
        value: ORM_OPTIONS.DRIZZLE,
        label: `${chalk.yellow("❄️")} Drizzle`,
        hint: "Lightweight, type-safe SQL ORM",
      },
      {
        value: ORM_OPTIONS.NONE,
        label: chalk.gray("⏭️  Skip ORM"),
        hint: "Use raw SQL queries",
      },
    );
  }

  const orm = await select({
    message: chalk.cyan("Select an ORM/ODM"),
    options: ormOptions,
  });

  if (isCancel(orm)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return orm;
}

export async function promptBackend() {
  console.log();
  console.log(colors.primary("╭─ Backend Framework"));
  console.log(colors.secondary("│  Choose your server-side technology"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const backend = await select({
    message: colors.accent("Choose your backend framework"),
    options: [
      {
        value: BACKEND_OPTIONS.EXPRESS,
        label: `${colors.success("🚂")} Express`,
        hint: "Minimal, flexible, huge ecosystem",
      },
      {
        value: BACKEND_OPTIONS.FASTIFY,
        label: `${colors.warning("⚡")} Fastify`,
        hint: "High performance, schema-based",
      },
      {
        value: BACKEND_OPTIONS.NESTJS,
        label: `${colors.error("🦁")} NestJS`,
        hint: "Enterprise-grade, Angular-inspired",
      },
      {
        value: BACKEND_OPTIONS.KOA,
        label: `${colors.primary("🌊")} Koa`,
        hint: "Modern, lightweight, by Express team",
      },
      {
        value: BACKEND_OPTIONS.HAPI,
        label: `${colors.accent("🎪")} Hapi`,
        hint: "Configuration-centric, battle-tested",
      },
      {
        value: BACKEND_OPTIONS.NONE,
        label: chalk.gray("⏭️  Skip backend"),
        hint: "Frontend only project",
      },
    ],
  });

  if (isCancel(backend)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return backend;
}

export async function promptFrontend() {
  console.log();
  console.log(colors.primary("╭─ Frontend Framework"));
  console.log(colors.secondary("│  Choose your client-side technology"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const frontend = await multiselect({
    message: colors.accent("Select frontend framework(s)"),
    options: [
      {
        value: FRONTEND_OPTIONS.REACT,
        label: `${colors.accent("⚛️")} React`,
        hint: "Component-based, virtual DOM, huge ecosystem",
      },
      {
        value: FRONTEND_OPTIONS.NEXTJS,
        label: `${colors.primary("▲")} Next.js`,
        hint: "Full-stack React framework with SSR/SSG",
      },
      {
        value: FRONTEND_OPTIONS.REMIX,
        label: `${colors.warning("🎯")} Remix`,
        hint: "Web standards focused, full-stack React",
      },
      {
        value: FRONTEND_OPTIONS.VUE,
        label: `${colors.success("💚")} Vue`,
        hint: "Progressive, approachable, versatile",
      },
      {
        value: FRONTEND_OPTIONS.NUXT,
        label: `${colors.success("💚")} Nuxt`,
        hint: "Full-stack Vue framework",
      },
      {
        value: FRONTEND_OPTIONS.ANGULAR,
        label: `${colors.error("🅰️")} Angular`,
        hint: "Full-featured, TypeScript-first",
      },
      {
        value: FRONTEND_OPTIONS.SVELTE,
        label: `${chalk.orange("🔥")} Svelte`,
        hint: "Compile-time optimized, no virtual DOM",
      },
      {
        value: FRONTEND_OPTIONS.SVELTEKIT,
        label: `${colors.primary("⚡")} SvelteKit`,
        hint: "Full-stack Svelte framework",
      },
      {
        value: FRONTEND_OPTIONS.ASTRO,
        label: `${colors.warning("🚀")} Astro`,
        hint: "Static site generator, multi-framework",
      },
      {
        value: FRONTEND_OPTIONS.REACT_NATIVE,
        label: `${chalk.blue("📱")} React Native`,
        hint: "Build native mobile apps",
      },
      {
        value: FRONTEND_OPTIONS.NONE,
        label: chalk.gray("⏭️  Skip frontend"),
        hint: "Backend only project",
      },
    ],
    required: false,
    initialValue: [FRONTEND_OPTIONS.REACT], // Default to React instead of none
  });

  if (isCancel(frontend)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return frontend.length === 0 ? [FRONTEND_OPTIONS.REACT] : frontend;
}

export async function promptAuth() {
  console.log();
  console.log(g.info("🔐 Authentication Setup"));

  const auth = await select({
    message: chalk.cyan("Choose authentication method"),
    options: [
      {
        value: AUTH_OPTIONS.NONE,
        label: chalk.gray("⏭️  Skip authentication"),
        hint: "No authentication needed",
      },
      {
        value: AUTH_OPTIONS.JWT,
        label: `${chalk.yellow("🔑")} JWT`,
        hint: "JSON Web Tokens - stateless, scalable",
      },
      {
        value: AUTH_OPTIONS.PASSPORT,
        label: `${chalk.blue("🛂")} Passport`,
        hint: "Multiple strategies, OAuth support",
      },
      {
        value: AUTH_OPTIONS.OAUTH,
        label: `${chalk.cyan("🔐")} OAuth`,
        hint: "OAuth via Passport (Google, GitHub, etc.)",
      },
      {
        value: AUTH_OPTIONS.AUTH0,
        label: `${chalk.green("🔒")} Auth0`,
        hint: "Managed authentication service",
      },
      {
        value: AUTH_OPTIONS.NEXTAUTH,
        label: `${chalk.cyan("🔐")} NextAuth.js`,
        hint: "Authentication for Next.js applications",
      },
      {
        value: AUTH_OPTIONS.SUPABASE,
        label: `${chalk.green("⚡")} Supabase Auth`,
        hint: "Open source Firebase alternative",
      },
      {
        value: AUTH_OPTIONS.LUCIA,
        label: `${chalk.cyan("✨")} Lucia`,
        hint: "Type-safe authentication library",
      },
    ],
  });

  if (isCancel(auth)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return auth;
}

export async function promptAddons() {
  console.log();
  console.log(g.info("🛠️  Development Tools"));

  const addons = await multiselect({
    message: chalk.cyan("Select additional tools"),
    options: [
      {
        value: ADDON_OPTIONS.ESLINT,
        label: `${chalk.blue("🔍")} ESLint`,
        hint: "Code linting and error checking",
      },
      {
        value: ADDON_OPTIONS.PRETTIER,
        label: `${chalk.magenta("✨")} Prettier`,
        hint: "Automatic code formatting",
      },
      {
        value: ADDON_OPTIONS.TAILWIND,
        label: `${chalk.cyan("🎨")} Tailwind CSS`,
        hint: "Utility-first CSS framework",
      },
      {
        value: ADDON_OPTIONS.SHADCN,
        label: `${chalk.green("🧩")} shadcn/ui`,
        hint: "Beautiful, accessible React components",
      },
      {
        value: ADDON_OPTIONS.STORYBOOK,
        label: `${chalk.yellow("📚")} Storybook`,
        hint: "Component development and testing",
      },
      {
        value: ADDON_OPTIONS.HUSKY,
        label: `${chalk.yellow("🐕")} Husky`,
        hint: "Git hooks for better commits",
      },
      {
        value: ADDON_OPTIONS.DOCKER,
        label: `${chalk.blue("🐳")} Docker`,
        hint: "Container configuration",
      },
      {
        value: ADDON_OPTIONS.GITHUB_ACTIONS,
        label: `${chalk.black("🔄")} GitHub Actions`,
        hint: "CI/CD workflows",
      },
      {
        value: ADDON_OPTIONS.TESTING,
        label: `${chalk.green("🧪")} Testing`,
        hint: "Jest & Testing Library setup",
      },
    ],
    required: false,
    initialValues: [ADDON_OPTIONS.ESLINT, ADDON_OPTIONS.PRETTIER],
  });

  if (isCancel(addons)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return addons;
}

export async function promptPackageManager() {
  console.log();
  console.log(g.info("📦 Package Manager"));

  const pm = await select({
    message: chalk.cyan("Choose your package manager"),
    options: [
      {
        value: PACKAGE_MANAGER_OPTIONS.NPM,
        label: `${chalk.red("📦")} npm`,
        hint: "Default Node.js package manager",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.YARN,
        label: `${chalk.blue("🧶")} Yarn`,
        hint: "Fast, reliable, secure",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.PNPM,
        label: `${chalk.yellow("📦")} pnpm`,
        hint: "Fast, disk space efficient",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.BUN,
        label: `${chalk.gray("🥟")} Bun`,
        hint: "All-in-one JavaScript runtime",
      },
    ],
  });

  if (isCancel(pm)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return pm;
}

export async function promptGit() {
  const git = await confirm({
    message: chalk.cyan("Initialize git repository?"),
    initialValue: true,
  });

  if (isCancel(git)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return git;
}

export async function promptInstall() {
  const install = await confirm({
    message: chalk.cyan("Install dependencies now?"),
    initialValue: true,
  });

  if (isCancel(install)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return install;
}

export async function collectProjectConfig(projectName, options = {}) {
  // Use the new ConfigManager for better configuration handling
  const { ConfigManager } = await import("./config/ConfigManager.js");
  
  // Create a mock CLI args object for the ConfigManager
  const cliArgs = {
    projectName,
    ...options,
    // Map pm to packageManager for consistency
    packageManager: options.pm || options.packageManager,
  };

  try {
    const configManager = await ConfigManager.create(cliArgs);
    const config = await configManager.resolveInteractively();
    
    // Validate the resolved configuration
    const validation = await configManager.validateConfig(config);
    
    if (!validation.isValid) {
      configManager.displayValidationResults(validation);
      throw new Error("Configuration validation failed");
    }

    // Display configuration summary
    configManager.displayConfigSummary(config);
    
    return config;
  } catch (error) {
    // Fallback to original logic if ConfigManager fails
    console.warn(chalk.yellow("⚠️  Using fallback configuration collection"));
    
    // Display banner if not in CI mode
    if (!options.ci) {
      await displayBanner();
      await displayWelcome();
    }

    const config = {
      projectName: projectName || (await promptProjectName()),
      database: options.database || (await promptDatabase()),
      backend: options.backend || (await promptBackend()),
      frontend: options.frontend ? (Array.isArray(options.frontend) ? options.frontend : [options.frontend]) : (await promptFrontend()),
      auth: options.auth || (await promptAuth()),
      addons: options.addons ? (Array.isArray(options.addons) ? options.addons : options.addons.split(',').map(s => s.trim())) : (await promptAddons()),
      packageManager: options.pm || (await promptPackageManager()),
      git: options.git !== false ? options.git || (await promptGit()) : false,
      install:
        options.install !== false
          ? options.install !== undefined ? options.install : (options.ci ? true : await promptInstall())
          : true, 
    };

    // Get ORM based on database selection
    config.orm = options.orm || (await promptORM(config.database));

    if (!options.ci) {
      console.log();
      note(
        chalk.dim("Project: ") +
          chalk.cyan(config.projectName) +
          "\n" +
          chalk.dim("Stack: ") +
          chalk.yellow(`${config.backend} + ${config.frontend.join(", ")}`) +
          "\n" +
          chalk.dim("Database: ") +
          chalk.green(
            `${config.database}${config.orm !== "none" ? " + " + config.orm : ""}`,
          ),
        g.success("Configuration Complete!"),
      );
    }

    return config;
  }
}

export { spinner, outro, intro, cancel, note, log };
