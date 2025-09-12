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
import {
  validateCompatibility,
  displayValidationResults,
  getCompatibleOptions,
  getPresetConfig,
  listPresets,
} from "./utils/validation.js";
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

/**
 * Enhanced project configuration collection with validation
 */
export async function collectProjectConfig(projectName, options = {}) {
  // Show banner
  displayBanner();
  displayWelcome();

  // Check for preset configuration
  if (options.preset) {
    const preset = getPresetConfig(options.preset);
    if (preset) {
      console.log(chalk.green.bold(`\n🎯 Using preset: ${preset.name}`));
      console.log(chalk.gray(`   ${preset.description}`));

      const usePreset = await confirm({
        message: "Use this preset configuration?",
        initialValue: true,
      });

      if (usePreset) {
        return {
          projectName,
          projectDir: `${process.cwd()}/${projectName}`,
          ...preset.config,
          git: options.git !== false,
          install: options.install !== false,
        };
      }
    }
  }

  // Collect configuration step by step
  const config = {
    projectName,
    projectDir: `${process.cwd()}/${projectName}`,
  };

  // Step 1: Project name
  if (!projectName) {
    config.projectName = await promptProjectName();
  }

  // Step 2: Preset selection
  const usePreset = await promptPresetSelection();
  if (usePreset) {
    const preset = await promptPresetChoice();
    if (preset) {
      Object.assign(config, preset.config);
    }
  }

  // Step 3: Database selection
  if (!config.database) {
    config.database = await promptDatabase();
  }

  // Step 4: ORM selection (with compatibility check)
  if (!config.orm) {
    config.orm = await promptORM(config.database);
  }

  // Step 5: Backend selection
  if (!config.backend) {
    config.backend = await promptBackend();
  }

  // Step 6: Frontend selection
  if (!config.frontend) {
    config.frontend = await promptFrontend();
  }

  // Step 7: Authentication selection
  if (!config.auth) {
    config.auth = await promptAuth();
  }

  // Step 8: Package manager selection
  if (!config.packageManager) {
    config.packageManager = await promptPackageManager();
  }

  // Step 9: Addons selection
  if (!config.addons) {
    config.addons = await promptAddons();
  }

  // Step 10: Additional options
  config.git = await promptGitInit();
  config.install = await promptDependencyInstall();

  // Step 11: Validate configuration
  await validateConfiguration(config);

  return config;
}

/**
 * Prompt for preset selection
 */
async function promptPresetSelection() {
  console.log();
  console.log(colors.primary("╭─ Configuration Presets"));
  console.log(colors.secondary("│  Choose a preset or configure manually"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const usePreset = await confirm({
    message: colors.accent("Would you like to use a preset configuration?"),
    initialValue: false,
  });

  if (isCancel(usePreset)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return usePreset;
}

/**
 * Prompt for preset choice
 */
async function promptPresetChoice() {
  const presets = listPresets();

  const presetOptions = presets.map((preset) => ({
    value: preset.key,
    label: `${colors.success("🎯")} ${preset.name}`,
    hint: preset.description,
  }));

  presetOptions.push({
    value: "custom",
    label: `${colors.muted("⚙️")} Custom Configuration`,
    hint: "Configure manually",
  });

  const selectedPreset = await select({
    message: colors.accent("Choose a preset configuration"),
    options: presetOptions,
  });

  if (isCancel(selectedPreset)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  if (selectedPreset === "custom") {
    return null;
  }

  return getPresetConfig(selectedPreset);
}

/**
 * Enhanced database prompt with compatibility hints
 */
async function promptDatabase() {
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

/**
 * Enhanced ORM prompt with compatibility filtering
 */
async function promptORM(database) {
  if (database === DATABASE_OPTIONS.NONE) {
    return ORM_OPTIONS.NONE;
  }

  console.log();
  console.log(colors.primary("╭─ ORM/ODM Selection"));
  console.log(colors.secondary("│  Choose your database abstraction layer"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const compatibleORMs = getCompatibleOptions("orm", null, { database });

  const ormOptions = compatibleORMs.map((orm) => {
    const options = {
      [ORM_OPTIONS.PRISMA]: {
        label: `${colors.success("▲")} Prisma`,
        hint: "Modern, type-safe, auto-generated queries",
      },
      [ORM_OPTIONS.SEQUELIZE]: {
        label: `${colors.primary("🔷")} Sequelize`,
        hint: "Feature-rich, supports multiple databases",
      },
      [ORM_OPTIONS.TYPEORM]: {
        label: `${colors.accent("📘")} TypeORM`,
        hint: "TypeScript-first, decorators, migrations",
      },
      [ORM_OPTIONS.MONGOOSE]: {
        label: `${colors.success("🍃")} Mongoose`,
        hint: "Elegant MongoDB object modeling",
      },
      [ORM_OPTIONS.NONE]: {
        label: colors.muted("⏭️  Skip ORM"),
        hint: "Use raw queries",
      },
    };

    return {
      value: orm,
      ...options[orm],
    };
  });

  const orm = await select({
    message: colors.accent("Select an ORM/ODM"),
    options: ormOptions,
  });

  if (isCancel(orm)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return orm;
}

/**
 * Enhanced backend prompt
 */
async function promptBackend() {
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
        label: `${colors.primary("⚡")} Fastify`,
        hint: "High-performance, low-overhead",
      },
      {
        value: BACKEND_OPTIONS.KOA,
        label: `${colors.accent("🌊")} Koa`,
        hint: "Lightweight, expressive middleware",
      },
      {
        value: BACKEND_OPTIONS.HAPI,
        label: `${colors.warning("🎯")} Hapi`,
        hint: "Rich ecosystem, built-in validation",
      },
      {
        value: BACKEND_OPTIONS.NESTJS,
        label: `${colors.success("🏗️")} NestJS`,
        hint: "Scalable, TypeScript-first, decorators",
      },
      {
        value: BACKEND_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip backend"),
        hint: "Frontend-only project",
      },
    ],
  });

  if (isCancel(backend)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return backend;
}

/**
 * Enhanced frontend prompt
 */
async function promptFrontend() {
  console.log();
  console.log(colors.primary("╭─ Frontend Framework"));
  console.log(colors.secondary("│  Choose your client-side technology"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const frontend = await multiselect({
    message: colors.accent("Choose your frontend framework(s)"),
    options: [
      {
        value: FRONTEND_OPTIONS.REACT,
        label: `${colors.primary("⚛️")} React`,
        hint: "Component-based, huge ecosystem",
      },
      {
        value: FRONTEND_OPTIONS.VUE,
        label: `${colors.success("💚")} Vue.js`,
        hint: "Progressive, approachable, versatile",
      },
      {
        value: FRONTEND_OPTIONS.ANGULAR,
        label: `${colors.error("🅰️")} Angular`,
        hint: "Full-featured, enterprise-ready",
      },
      {
        value: FRONTEND_OPTIONS.SVELTE,
        label: `${colors.warning("🧡")} Svelte`,
        hint: "Compile-time optimizations, no virtual DOM",
      },
      {
        value: FRONTEND_OPTIONS.NEXTJS,
        label: `${colors.primary("▲")} Next.js`,
        hint: "Full-stack React framework",
      },
      {
        value: FRONTEND_OPTIONS.NUXT,
        label: `${colors.success("💚")} Nuxt.js`,
        hint: "Full-stack Vue framework",
      },
      {
        value: FRONTEND_OPTIONS.REACT_NATIVE,
        label: `${colors.accent("📱")} React Native`,
        hint: "Cross-platform mobile development",
      },
      {
        value: FRONTEND_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip frontend"),
        hint: "Backend-only project",
      },
    ],
  });

  if (isCancel(frontend)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return frontend;
}

/**
 * Enhanced authentication prompt
 */
async function promptAuth() {
  console.log();
  console.log(colors.primary("╭─ Authentication"));
  console.log(colors.secondary("│  Choose your authentication strategy"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const auth = await select({
    message: colors.accent("Choose authentication method"),
    options: [
      {
        value: AUTH_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip authentication"),
        hint: "No authentication system",
      },
      {
        value: AUTH_OPTIONS.JWT,
        label: `${colors.success("🔑")} JWT`,
        hint: "JSON Web Tokens, stateless",
      },
      {
        value: AUTH_OPTIONS.PASSPORT,
        label: `${colors.primary("🛡️")} Passport.js`,
        hint: "Flexible authentication middleware",
      },
      {
        value: AUTH_OPTIONS.AUTH0,
        label: `${colors.accent("🔐")} Auth0`,
        hint: "Identity platform, enterprise-ready",
      },
      {
        value: AUTH_OPTIONS.FIREBASE,
        label: `${colors.warning("🔥")} Firebase Auth`,
        hint: "Google's authentication service",
      },
    ],
  });

  if (isCancel(auth)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return auth;
}

/**
 * Enhanced package manager prompt
 */
async function promptPackageManager() {
  console.log();
  console.log(colors.primary("╭─ Package Manager"));
  console.log(colors.secondary("│  Choose your dependency manager"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const packageManager = await select({
    message: colors.accent("Choose package manager"),
    options: [
      {
        value: PACKAGE_MANAGER_OPTIONS.NPM,
        label: `${colors.primary("📦")} npm`,
        hint: "Node.js default, reliable",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.YARN,
        label: `${colors.accent("🧶")} Yarn`,
        hint: "Fast, reliable, secure",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.PNPM,
        label: `${colors.success("📦")} pnpm`,
        hint: "Efficient, disk space saving",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.BUN,
        label: `${colors.warning("🍞")} Bun`,
        hint: "All-in-one JavaScript runtime",
      },
    ],
  });

  if (isCancel(packageManager)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return packageManager;
}

/**
 * Enhanced addons prompt
 */
async function promptAddons() {
  console.log();
  console.log(colors.primary("╭─ Development Tools"));
  console.log(colors.secondary("│  Choose additional development tools"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const addons = await multiselect({
    message: colors.accent("Select additional tools"),
    options: [
      {
        value: ADDON_OPTIONS.TYPESCRIPT,
        label: `${colors.primary("📘")} TypeScript`,
        hint: "Type safety and better development experience",
      },
      {
        value: ADDON_OPTIONS.ESLINT,
        label: `${colors.success("🔍")} ESLint`,
        hint: "Code linting and quality enforcement",
      },
      {
        value: ADDON_OPTIONS.PRETTIER,
        label: `${colors.accent("💅")} Prettier`,
        hint: "Code formatting and style consistency",
      },
      {
        value: ADDON_OPTIONS.HUSKY,
        label: `${colors.warning("🐕")} Husky`,
        hint: "Git hooks for code quality",
      },
      {
        value: ADDON_OPTIONS.DOCKER,
        label: `${colors.primary("🐳")} Docker`,
        hint: "Containerization and deployment",
      },
      {
        value: ADDON_OPTIONS.GITHUB_ACTIONS,
        label: `${colors.muted("⚙️")} GitHub Actions`,
        hint: "CI/CD workflows and automation",
      },
      {
        value: ADDON_OPTIONS.TESTING,
        label: `${colors.success("🧪")} Testing`,
        hint: "Testing framework and setup",
      },
    ],
  });

  if (isCancel(addons)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return addons;
}

/**
 * Prompt for Git initialization
 */
async function promptGitInit() {
  const gitInit = await confirm({
    message: colors.accent("Initialize Git repository?"),
    initialValue: true,
  });

  if (isCancel(gitInit)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return gitInit;
}

/**
 * Prompt for dependency installation
 */
async function promptDependencyInstall() {
  const install = await confirm({
    message: colors.accent("Install dependencies after creation?"),
    initialValue: true,
  });

  if (isCancel(install)) {
    cancel(chalk.red("Operation cancelled"));
    process.exit(0);
  }

  return install;
}

/**
 * Validate configuration and show results
 */
async function validateConfiguration(config) {
  console.log();
  console.log(colors.primary("╭─ Configuration Validation"));
  console.log(colors.secondary("│  Checking compatibility and best practices"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const validation = validateCompatibility(config);

  if (!validation.isValid) {
    displayValidationResults(validation);

    const continueAnyway = await confirm({
      message: colors.warning("Continue despite validation errors?"),
      initialValue: false,
    });

    if (!continueAnyway) {
      cancel(chalk.red("Configuration validation failed"));
      process.exit(1);
    }
  } else if (validation.warnings.length > 0) {
    displayValidationResults(validation);

    const continueAnyway = await confirm({
      message: colors.accent("Continue with warnings?"),
      initialValue: true,
    });

    if (!continueAnyway) {
      cancel(chalk.red("Configuration validation failed"));
      process.exit(1);
    }
  } else {
    console.log(chalk.green.bold("✅ Configuration is valid!"));
  }
}

/**
 * Display final configuration summary
 */
export function displayConfigSummary(config) {
  console.log();
  console.log(colors.primary("╭─ Project Configuration Summary"));
  console.log(colors.secondary("│  Review your project settings"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  console.log(chalk.cyan.bold("📋 Project Details:"));
  console.log(chalk.gray(`  Name: ${config.projectName}`));
  console.log(chalk.gray(`  Directory: ${config.projectDir}`));
  console.log();

  console.log(chalk.cyan.bold("🛠️  Technology Stack:"));
  console.log(chalk.gray(`  Database: ${config.database}`));
  console.log(chalk.gray(`  ORM: ${config.orm}`));
  console.log(chalk.gray(`  Backend: ${config.backend}`));
  console.log(chalk.gray(`  Frontend: ${config.frontend.join(", ")}`));
  console.log(chalk.gray(`  Authentication: ${config.auth}`));
  console.log(chalk.gray(`  Package Manager: ${config.packageManager}`));
  console.log();

  if (config.addons.length > 0) {
    console.log(chalk.cyan.bold("🔧 Development Tools:"));
    console.log(chalk.gray(`  ${config.addons.join(", ")}`));
    console.log();
  }

  console.log(chalk.cyan.bold("⚙️  Additional Options:"));
  console.log(chalk.gray(`  Git Initialization: ${config.git ? "Yes" : "No"}`));
  console.log(
    chalk.gray(`  Install Dependencies: ${config.install ? "Yes" : "No"}`),
  );
  console.log();
}
