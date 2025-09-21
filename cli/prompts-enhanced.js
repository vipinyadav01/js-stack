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

// Enhanced color scheme with better accessibility
const colors = {
  primary: chalk.hex('#3B82F6').bold,        // Blue
  secondary: chalk.hex('#6B7280'),           // Gray
  success: chalk.hex('#10B981').bold,        // Green
  warning: chalk.hex('#F59E0B').bold,        // Amber
  error: chalk.hex('#EF4444').bold,          // Red
  muted: chalk.hex('#9CA3AF'),               // Light gray
  accent: chalk.hex('#06B6D4').bold,         // Cyan
  info: chalk.hex('#8B5CF6').bold,           // Purple
  highlight: chalk.hex('#EC4899').bold,      // Pink
};

// Progress tracking
let currentStep = 0;
const totalSteps = 10;

/**
 * Enhanced project configuration collection with improved UX
 */
export async function collectProjectConfig(projectName, options = {}) {
  // Non-interactive fast path (CI or --yes): build config from options and skip prompts
  const isCi = Boolean(options.ci || options.yes);
  if (isCi) {
    const normalizeArray = (val) => {
      if (Array.isArray(val)) {
        // Split any comma-delimited entries and flatten
        return val
          .flatMap(v => (typeof v === 'string' && v.includes(',') ? v.split(',') : [v]))
          .map(s => (typeof s === 'string' ? s.trim() : s))
          .filter(Boolean);
      }
      if (typeof val === 'string') return val.includes(',') ? val.split(',').map(s => s.trim()).filter(Boolean) : [val];
      return [];
    };

    const cfg = {
      projectName: projectName || options.projectName || 'my-app',
      projectDir: `${process.cwd()}/${projectName || options.projectName || 'my-app'}`,
      frontend: normalizeArray(options.frontend && options.frontend.length ? options.frontend : options.frontend || []),
      backend: options.backend || 'none',
      database: options.database || 'none',
      orm: options.orm || (options.database === 'none' ? 'none' : undefined),
      auth: options.auth || 'none',
      packageManager: options.packageManager || options.pm || 'npm',
      addons: normalizeArray(options.addons || []),
      git: options.git !== false,
      // Per requirement: even if --no-install is passed, install should proceed automatically
      install: true,
      typescript: Boolean(options.typescript),
    };

    // Minimal validation without prompts
    await validateConfiguration(ciSafe(cfg));
    return cfg;
  }

  // Show banner and welcome (interactive)
  displayBanner();
  displayWelcome();
  
  console.log(colors.info("🚀 Let's build something amazing together!\n"));

  // Check for preset configuration first
  if (options.preset) {
    const preset = getPresetConfig(options.preset);
    if (preset) {
      console.log(colors.success(`\n✨ Using preset: ${preset.name}`));
      console.log(colors.muted(`   ${preset.description}\n`));

      const usePreset = await confirm({
        message: "Use this preset configuration?",
        initialValue: true,
      });

      if (usePreset && !isCancel(usePreset)) {
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

  // Initialize configuration object
  const config = {
    projectName,
    projectDir: `${process.cwd()}/${projectName}`,
  };

  // Step 1: Project name validation
  if (!projectName) {
    config.projectName = await promptProjectName();
    config.projectDir = `${process.cwd()}/${config.projectName}`;
  }

  // Step 2: Preset selection (if not already handled)
  if (!options.preset) {
    const usePreset = await promptPresetSelection();
    if (usePreset) {
      const preset = await promptPresetChoice();
      if (preset) {
        Object.assign(config, preset.config);
        displayConfigurationProgress(config, "preset");
        return finalizeConfiguration(config, options);
      }
    }
  }

  // Step 3: Frontend selection (moved first for better UX)
  if (!config.frontend) {
    config.frontend = await promptFrontend();
    displayConfigurationProgress(config, "frontend");
  }

  // Step 4: Backend selection
  if (!config.backend) {
    config.backend = await promptBackend();
    displayConfigurationProgress(config, "backend");
  }

  // Step 5: Database selection
  if (!config.database) {
    config.database = await promptDatabase();
    displayConfigurationProgress(config, "database");
  }

  // Step 6: ORM selection (with compatibility check)
  if (!config.orm && config.database !== DATABASE_OPTIONS.NONE) {
    config.orm = await promptORM(config.database);
    displayConfigurationProgress(config, "orm");
  } else if (config.database === DATABASE_OPTIONS.NONE) {
    config.orm = ORM_OPTIONS.NONE;
  }

  // Step 7: Authentication selection
  if (!config.auth) {
    config.auth = await promptAuth(config);
    displayConfigurationProgress(config, "auth");
  }

  // Step 8: Package manager selection
  if (!config.packageManager) {
    config.packageManager = await promptPackageManager();
    displayConfigurationProgress(config, "packageManager");
  }

  // Step 9: Development tools and addons
  if (!config.addons) {
    config.addons = await promptAddons(config);
    displayConfigurationProgress(config, "addons");
  }

  return finalizeConfiguration(config, options);
}

/**
 * Enhanced project name validation
 */
async function promptProjectName() {
  progressHeader(++currentStep, totalSteps, "Project Setup", "Let's start with your project name");

  const projectName = await text({
    message: colors.accent("What's your project name?"),
    placeholder: "my-awesome-app",
    validate: (value) => {
      if (!value) return "Project name is required";
      
      const validation = validatePackageName(value);
      if (!validation.validForNewPackages) {
        return `Invalid project name: ${validation.errors?.[0] || validation.warnings?.[0] || 'Unknown error'}`;
      }
      
      if (value.length < 2) return "Project name must be at least 2 characters";
      if (value.length > 50) return "Project name must be less than 50 characters";
      
      return undefined;
    },
  });

  if (isCancel(projectName)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ Project name: ${projectName}\n`));
  return projectName;
}

/**
 * Enhanced preset selection with better UX
 */
async function promptPresetSelection() {
  progressHeader(++currentStep, totalSteps, "Quick Setup", "Speed up with presets or customize everything");

  const usePreset = await confirm({
    message: colors.accent("🎯 Would you like to use a preset configuration?"),
    initialValue: false,
  });

  if (isCancel(usePreset)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  return usePreset;
}

/**
 * Enhanced preset choice with detailed descriptions
 */
async function promptPresetChoice() {
  const presets = listPresets();

  const presetOptions = presets.map((preset) => ({
    value: preset.key,
    label: `${colors.success("🎯")} ${preset.name}`,
    hint: `${preset.description} • ${preset.tags?.join(", ") || ""}`,
  }));

  presetOptions.push({
    value: "custom",
    label: `${colors.info("⚙️")} Custom Configuration`,
    hint: "Configure each option manually for full control",
  });

  const selectedPreset = await select({
    message: colors.accent("Choose your preset"),
    options: presetOptions,
  });

  if (isCancel(selectedPreset)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  if (selectedPreset === "custom") {
    console.log(colors.info("📝 Let's configure everything step by step...\n"));
    return null;
  }

  return getPresetConfig(selectedPreset);
}

/**
 * Enhanced frontend prompt with better organization
 */
async function promptFrontend() {
  progressHeader(++currentStep, totalSteps, "Frontend Framework", "Choose your client-side technology");

  const frontend = await multiselect({
    message: colors.accent("Select your frontend framework(s)"),
    options: [
      // React Ecosystem
      {
        value: FRONTEND_OPTIONS.REACT,
        label: `${colors.primary("⚛️")} React`,
        hint: "Popular component library • Large ecosystem • Flexible",
      },
      {
        value: FRONTEND_OPTIONS.NEXTJS,
        label: `${colors.primary("▲")} Next.js`,
        hint: "Full-stack React framework • SSR/SSG • File-based routing",
      },
      {
        value: FRONTEND_OPTIONS.REMIX,
        label: `${colors.accent("🎯")} Remix`,
        hint: "Web standards focused • Nested routing • Progressive enhancement",
      },
      
      // Vue Ecosystem
      {
        value: FRONTEND_OPTIONS.VUE,
        label: `${colors.success("💚")} Vue.js`,
        hint: "Progressive framework • Great DX • Gentle learning curve",
      },
      {
        value: FRONTEND_OPTIONS.NUXT,
        label: `${colors.success("💚")} Nuxt.js`,
        hint: "Full-stack Vue framework • Auto-imports • Great performance",
      },

      // Other Frameworks
      {
        value: FRONTEND_OPTIONS.SVELTE,
        label: `${colors.warning("🧡")} Svelte`,
        hint: "Compile-time optimizations • No virtual DOM • Small bundles",
      },
      {
        value: FRONTEND_OPTIONS.SVELTEKIT,
        label: `${colors.warning("⚡")} SvelteKit`,
        hint: "Full-stack Svelte framework • Fast development • Great performance",
      },
      {
        value: FRONTEND_OPTIONS.ANGULAR,
        label: `${colors.error("🅰️")} Angular`,
        hint: "Enterprise framework • TypeScript-first • Comprehensive toolkit",
      },

      // Static & Others
      {
        value: FRONTEND_OPTIONS.ASTRO,
        label: `${colors.info("🚀")} Astro`,
        hint: "Static site generator • Multi-framework • Content-focused",
      },
      {
        value: FRONTEND_OPTIONS.REACT_NATIVE,
        label: `${colors.highlight("📱")} React Native`,
        hint: "Cross-platform mobile • Native performance • Code sharing",
      },
      {
        value: FRONTEND_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip Frontend"),
        hint: "Backend-only or API project",
      },
    ],
    required: false,
  });

  if (isCancel(frontend)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  const selection = Array.isArray(frontend) ? frontend : [frontend];
  console.log(colors.success(`✅ Frontend: ${selection.join(", ") || "None"}\n`));
  
  return selection;
}

/**
 * Enhanced backend prompt with compatibility hints
 */
async function promptBackend() {
  progressHeader(++currentStep, totalSteps, "Backend Framework", "Choose your server-side technology");

  const backend = await select({
    message: colors.accent("Select your backend framework"),
    options: [
      {
        value: BACKEND_OPTIONS.EXPRESS,
        label: `${colors.success("🚂")} Express.js`,
        hint: "Minimal & flexible • Huge ecosystem • Battle-tested",
      },
      {
        value: BACKEND_OPTIONS.FASTIFY,
        label: `${colors.primary("⚡")} Fastify`,
        hint: "High performance • Low overhead • Schema validation",
      },
      {
        value: BACKEND_OPTIONS.NESTJS,
        label: `${colors.error("🏗️")} NestJS`,
        hint: "Enterprise-grade • TypeScript-first • Modular architecture",
      },
      {
        value: BACKEND_OPTIONS.KOA,
        label: `${colors.accent("🌊")} Koa.js`,
        hint: "Lightweight • Async/await native • Expressive middleware",
      },
      {
        value: BACKEND_OPTIONS.HAPI,
        label: `${colors.warning("🎯")} Hapi.js`,
        hint: "Configuration-centric • Built-in validation • Security focused",
      },
      {
        value: BACKEND_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip Backend"),
        hint: "Frontend-only, static site, or mobile app",
      },
    ],
  });

  if (isCancel(backend)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ Backend: ${backend}\n`));
  return backend;
}

/**
 * Enhanced database prompt with detailed information
 */
async function promptDatabase() {
  progressHeader(++currentStep, totalSteps, "Database", "Choose your data storage solution");

  const database = await select({
    message: colors.accent("Select your database"),
    options: [
      {
        value: DATABASE_OPTIONS.POSTGRES,
        label: `${colors.primary("🐘")} PostgreSQL`,
        hint: "Advanced SQL • JSON support • ACID compliant • Production-ready",
      },
      {
        value: DATABASE_OPTIONS.MYSQL,
        label: `${colors.info("🐬")} MySQL`,
        hint: "Popular SQL • High performance • Wide hosting support",
      },
      {
        value: DATABASE_OPTIONS.SQLITE,
        label: `${colors.success("💾")} SQLite`,
        hint: "File-based • Zero-config • Perfect for development & small apps",
      },
      {
        value: DATABASE_OPTIONS.MONGODB,
        label: `${colors.success("🍃")} MongoDB`,
        hint: "NoSQL • Flexible schemas • Horizontal scaling • JSON documents",
      },
      {
        value: DATABASE_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip Database"),
        hint: "Static site, external APIs, or serverless functions only",
      },
    ],
  });

  if (isCancel(database)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ Database: ${database}\n`));
  return database;
}

/**
 * Enhanced ORM prompt with compatibility filtering
 */
async function promptORM(database) {
  progressHeader(++currentStep, totalSteps, "ORM/ODM", "Choose your database abstraction layer");

  if (database === DATABASE_OPTIONS.NONE) {
    console.log(colors.muted("⏭️  Skipping ORM (no database selected)\n"));
    return ORM_OPTIONS.NONE;
  }

  const compatibleORMs = getCompatibleOptions("orm", null, { database });

  if (compatibleORMs.length === 0) {
    console.log(colors.warning(`⚠️  No compatible ORMs found for ${database}\n`));
    return ORM_OPTIONS.NONE;
  }

  const ormOptions = compatibleORMs.map((orm) => {
    const options = {
      [ORM_OPTIONS.PRISMA]: {
        label: `${colors.success("▲")} Prisma`,
        hint: "Type-safe • Auto-generated client • Great DX • Migrations",
      },
      [ORM_OPTIONS.DRIZZLE]: {
        label: `${colors.primary("❄️")} Drizzle ORM`,
        hint: "Lightweight • Type-safe SQL • Edge-ready • No code generation",
      },
      [ORM_OPTIONS.SEQUELIZE]: {
        label: `${colors.info("🔷")} Sequelize`,
        hint: "Feature-rich • Multi-database • Associations • Mature",
      },
      [ORM_OPTIONS.TYPEORM]: {
        label: `${colors.accent("📘")} TypeORM`,
        hint: "TypeScript decorators • Active Record/Data Mapper • Migrations",
      },
      [ORM_OPTIONS.MONGOOSE]: {
        label: `${colors.success("🍃")} Mongoose`,
        hint: "MongoDB ODM • Schema validation • Middleware • Populate",
      },
      [ORM_OPTIONS.NONE]: {
        label: colors.muted("⏭️  Skip ORM"),
        hint: "Use raw queries or database driver directly",
      },
    };

    return {
      value: orm,
      ...options[orm],
    };
  });

  const orm = await select({
    message: colors.accent(`Select an ORM/ODM for ${database}`),
    options: ormOptions,
  });

  if (isCancel(orm)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ ORM: ${orm}\n`));
  return orm;
}

/**
 * Enhanced authentication prompt with context awareness
 */
async function promptAuth(config) {
  progressHeader(++currentStep, totalSteps, "Authentication", "Choose your authentication strategy");

  // Show context-aware options based on selected stack
  const isNextJs = config.frontend?.includes(FRONTEND_OPTIONS.NEXTJS);
  const hasBackend = config.backend && config.backend !== BACKEND_OPTIONS.NONE;

  const auth = await select({
    message: colors.accent("Select authentication method"),
    options: [
      {
        value: AUTH_OPTIONS.NONE,
        label: colors.muted("⏭️  Skip Authentication"),
        hint: "No authentication required • Public application",
      },
      {
        value: AUTH_OPTIONS.JWT,
        label: `${colors.success("🔑")} JWT Tokens`,
        hint: "Stateless • Scalable • Custom implementation • Full control",
      },
      ...(isNextJs ? [{
        value: AUTH_OPTIONS.NEXTAUTH,
        label: `${colors.primary("🔐")} NextAuth.js`,
        hint: "Next.js optimized • Multiple providers • Session management",
      }] : []),
      {
        value: AUTH_OPTIONS.SUPABASE,
        label: `${colors.accent("⚡")} Supabase Auth`,
        hint: "Backend-as-a-Service • Social logins • Row-level security",
      },
      {
        value: AUTH_OPTIONS.AUTH0,
        label: `${colors.warning("🔒")} Auth0`,
        hint: "Enterprise identity platform • SSO • Advanced security",
      },
      {
        value: AUTH_OPTIONS.LUCIA,
        label: `${colors.info("✨")} Lucia`,
        hint: "Type-safe • Lightweight • Framework agnostic • Modern",
      },
      ...(hasBackend ? [{
        value: AUTH_OPTIONS.PASSPORT,
        label: `${colors.primary("🛡️")} Passport.js`,
        hint: "Flexible middleware • 500+ strategies • Node.js standard",
      }] : []),
      {
        value: AUTH_OPTIONS.OAUTH,
        label: `${colors.highlight("🌐")} OAuth Providers`,
        hint: "Google, GitHub, Discord • Social authentication • Third-party",
      },
    ],
  });

  if (isCancel(auth)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ Authentication: ${auth}\n`));
  return auth;
}

/**
 * Enhanced package manager prompt
 */
async function promptPackageManager() {
  progressHeader(++currentStep, totalSteps, "Package Manager", "Choose your dependency manager");

  const packageManager = await select({
    message: colors.accent("Select package manager"),
    options: [
      {
        value: PACKAGE_MANAGER_OPTIONS.NPM,
        label: `${colors.primary("📦")} npm`,
        hint: "Node.js default • Reliable • Universal support • Workspaces",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.PNPM,
        label: `${colors.success("📦")} pnpm`,
        hint: "Disk efficient • Fast • Strict • Monorepo friendly",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.YARN,
        label: `${colors.accent("🧶")} Yarn`,
        hint: "Zero-installs • PnP • Workspaces • Offline cache",
      },
      {
        value: PACKAGE_MANAGER_OPTIONS.BUN,
        label: `${colors.warning("🍞")} Bun`,
        hint: "All-in-one runtime • Ultra fast • Native bundler",
      },
    ],
  });

  if (isCancel(packageManager)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  console.log(colors.success(`✅ Package Manager: ${packageManager}\n`));
  return packageManager;
}

/**
 * Enhanced addons prompt with smart recommendations
 */
async function promptAddons(config) {
  progressHeader(++currentStep, totalSteps, "Development Tools", "Enhance your development experience");

  // Smart recommendations based on stack
  const recommendations = getRecommendedAddons(config);

  const addons = await multiselect({
    message: colors.accent("Select development tools and integrations"),
    options: [
      // Code Quality
      {
        value: ADDON_OPTIONS.ESLINT,
        label: `${colors.success("🔍")} ESLint`,
        hint: `Code linting • Error prevention • Style consistency${recommendations.includes(ADDON_OPTIONS.ESLINT) ? ' • Recommended' : ''}`,
      },
      {
        value: ADDON_OPTIONS.PRETTIER,
        label: `${colors.accent("💅")} Prettier`,
        hint: `Code formatting • Team consistency • Auto-fix${recommendations.includes(ADDON_OPTIONS.PRETTIER) ? ' • Recommended' : ''}`,
      },

      // Styling
      {
        value: ADDON_OPTIONS.TAILWIND,
        label: `${colors.primary("🎨")} Tailwind CSS`,
        hint: `Utility-first CSS • Responsive design • Small bundle${recommendations.includes(ADDON_OPTIONS.TAILWIND) ? ' • Recommended' : ''}`,
      },
      {
        value: ADDON_OPTIONS.SHADCN,
        label: `${colors.info("🧩")} shadcn/ui`,
        hint: `Beautiful React components • Accessible • Customizable${recommendations.includes(ADDON_OPTIONS.SHADCN) ? ' • Recommended' : ''}`,
      },

      // Development
      {
        value: ADDON_OPTIONS.STORYBOOK,
        label: `${colors.warning("📚")} Storybook`,
        hint: "Component development • Visual testing • Documentation",
      },
      {
        value: ADDON_OPTIONS.TESTING,
        label: `${colors.success("🧪")} Testing Suite`,
        hint: `Unit & integration tests • Coverage reports${recommendations.includes(ADDON_OPTIONS.TESTING) ? ' • Recommended' : ''}`,
      },

      // Git & CI/CD
      {
        value: ADDON_OPTIONS.HUSKY,
        label: `${colors.warning("🐕")} Husky`,
        hint: "Git hooks • Pre-commit validation • Quality gates",
      },
      {
        value: ADDON_OPTIONS.GITHUB_ACTIONS,
        label: `${colors.muted("⚙️")} GitHub Actions`,
        hint: "CI/CD workflows • Automated testing • Deployment",
      },

      // Deployment
      {
        value: ADDON_OPTIONS.DOCKER,
        label: `${colors.primary("🐳")} Docker`,
        hint: "Containerization • Production deployment • Environment consistency",
      },
    ],
    required: false,
  });

  if (isCancel(addons)) {
    cancel(colors.error("Operation cancelled"));
    process.exit(0);
  }

  const selection = Array.isArray(addons) ? addons : [];
  console.log(colors.success(`✅ Development Tools: ${selection.join(", ") || "None"}\n`));
  
  return selection;
}

/**
 * Get recommended addons based on configuration
 */
function getRecommendedAddons(config) {
  const recommendations = [ADDON_OPTIONS.ESLINT, ADDON_OPTIONS.PRETTIER];

  // React projects benefit from shadcn/ui
  if (config.frontend?.includes(FRONTEND_OPTIONS.REACT) || 
      config.frontend?.includes(FRONTEND_OPTIONS.NEXTJS)) {
    recommendations.push(ADDON_OPTIONS.SHADCN, ADDON_OPTIONS.TAILWIND);
  }

  // Projects with backend need testing
  if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
    recommendations.push(ADDON_OPTIONS.TESTING);
  }

  return recommendations;
}

/**
 * Finalize configuration with validation and additional prompts
 */
async function finalizeConfiguration(config, options) {
  // Step 10: Git and installation options
  progressHeader(++currentStep, totalSteps, "Final Setup", "Git initialization and dependency installation");

  if (options.ci || options.yes) {
    config.git = options.git !== false;
  } else if (options.git === undefined) {
    config.git = await confirm({
      message: colors.accent("📝 Initialize Git repository?"),
      initialValue: true,
    });

    if (isCancel(config.git)) {
      cancel(colors.error("Operation cancelled"));
      process.exit(0);
    }
  } else {
    config.git = options.git;
  }

  // Per requirement: even if --no-install provided, install should proceed automatically
  if (options.ci || options.yes) {
    config.install = true;
  } else if (options.install === undefined) {
    config.install = await confirm({
      message: colors.accent("📥 Install dependencies after creation?"),
      initialValue: true,
    });

    if (isCancel(config.install)) {
      cancel(colors.error("Operation cancelled"));
      process.exit(0);
    }
  } else {
    config.install = options.install === false ? true : options.install;
  }

  // Validate configuration
  await validateConfiguration(config);

  return config;
}

/**
 * Display progress header
 */
function progressHeader(step, total, title, description) {
  const percentage = Math.round((step / total) * 100);
  const progressBar = "█".repeat(Math.floor(percentage / 5)) + "░".repeat(20 - Math.floor(percentage / 5));
  
  console.log(colors.primary(`╭─ Step ${step}/${total} • ${title}`));
  console.log(colors.secondary(`│  ${description}`));
  console.log(colors.muted(`│  [${progressBar}] ${percentage}%`));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();
}

/**
 * Display configuration progress
 */
function displayConfigurationProgress(config, section) {
  const sections = {
    frontend: "🎨 Frontend",
    backend: "⚙️ Backend", 
    database: "💾 Database",
    orm: "🔗 ORM",
    auth: "🔐 Authentication",
    packageManager: "📦 Package Manager",
    addons: "🛠️ Tools"
  };

  if (sections[section]) {
    console.log(colors.muted(`   ${sections[section]} configured...\n`));
  }
}

/**
 * Enhanced configuration validation
 */
async function validateConfiguration(config) {
  console.log(colors.primary("╭─ Configuration Validation"));
  console.log(colors.secondary("│  Checking compatibility and best practices"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const s = spinner();
  s.start("Validating configuration...");

  // Simulate validation time
  await new Promise(resolve => setTimeout(resolve, 1000));

  const validation = validateCompatibility(config);
  s.stop();

  const isCi = Boolean(config?.ci);

  if (!validation.isValid) {
    displayValidationResults(validation);
    if (!isCi) {
      const continueAnyway = await confirm({
        message: colors.warning("⚠️  Continue despite validation errors?"),
        initialValue: false,
      });
      if (!continueAnyway || isCancel(continueAnyway)) {
        cancel(colors.error("Configuration validation failed"));
        process.exit(1);
      }
    }
  } else if (validation.warnings.length > 0) {
    displayValidationResults(validation);
    if (!isCi) {
      const continueAnyway = await confirm({
        message: colors.accent("Continue with warnings?"),
        initialValue: true,
      });
      if (!continueAnyway || isCancel(continueAnyway)) {
        cancel(colors.error("Configuration cancelled"));
        process.exit(1);
      }
    }
  } else {
    console.log(colors.success("✅ Configuration validated successfully!\n"));
  }
}

// Helper to tag config as CI to skip further prompts down the line
function ciSafe(config) {
  return { ...config, ci: true };
}

/**
 * Enhanced configuration summary with proper ordering
 */
export function displayConfigSummary(config) {
  console.log();
  console.log(colors.primary("╭─ 📋 Project Configuration Summary"));
  console.log(colors.secondary("│  Review your technology stack"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  // Project Details
  console.log(colors.accent("🏗️  Project Details:"));
  console.log(colors.secondary(`   Name: ${colors.primary(config.projectName)}`));
  console.log(colors.secondary(`   Directory: ${colors.muted(config.projectDir)}`));
  console.log();

  // Technology Stack (in layered order: Base → Framework → Integration → Feature → Tooling → Deployment)
  console.log(colors.accent("🚀 Technology Stack:"));
  
  // Layer 1: Base (always shown)
  console.log(colors.secondary(`   📦 Base: ${colors.success("JavaScript" + (config.typescript ? " + TypeScript" : ""))}`));
  
  // Layer 2: Frameworks
  const frameworks = [];
  if (config.frontend && config.frontend.length > 0 && !config.frontend.includes('none')) {
    frameworks.push(`Frontend: ${config.frontend.join(", ")}`);
  }
  if (config.backend && config.backend !== 'none') {
    frameworks.push(`Backend: ${config.backend}`);
  }
  if (frameworks.length > 0) {
    console.log(colors.secondary(`   🏗️  Frameworks: ${colors.success(frameworks.join(" | "))}`));
  }
  
  // Layer 3: Integrations
  const integrations = [];
  if (config.database && config.database !== 'none') {
    integrations.push(`Database: ${config.database}`);
  }
  if (config.orm && config.orm !== 'none') {
    integrations.push(`ORM: ${config.orm}`);
  }
  if (integrations.length > 0) {
    console.log(colors.secondary(`   🔗 Integrations: ${colors.success(integrations.join(" | "))}`));
  }
  
  // Layer 4: Features
  const features = [];
  if (config.auth && config.auth !== 'none') {
    features.push(`Auth: ${config.auth}`);
  }
  if (features.length > 0) {
    console.log(colors.secondary(`   ⚡ Features: ${colors.success(features.join(" | "))}`));
  }
  
  // Layer 5: Tooling & Addons
  if (config.addons && config.addons.length > 0) {
    console.log(colors.secondary(`   🛠️  Tooling: ${colors.success(config.addons.join(", "))}`));
  }
  
  // Layer 6: Deployment
  if (config.deployment && config.deployment !== 'none') {
    console.log(colors.secondary(`   🚀 Deployment: ${colors.success(config.deployment)}`));
  }

  console.log();

  // Package Management
  console.log(colors.accent("📦 Package Management:"));
  console.log(colors.secondary(`   Package Manager: ${colors.success(config.packageManager)}`));
  console.log();

  // Development Tools
  if (config.addons && config.addons.length > 0) {
    console.log(colors.accent("🛠️  Development Tools:"));
    config.addons.forEach(addon => {
      console.log(colors.secondary(`   • ${colors.success(addon)}`));
    });
    console.log();
  }

  // Additional Options
  console.log(colors.accent("⚙️  Setup Options:"));
  console.log(colors.secondary(`   Git Repository: ${config.git ? colors.success("Yes") : colors.muted("No")}`));
  console.log(colors.secondary(`   Install Dependencies: ${config.install ? colors.success("Yes") : colors.muted("No")}`));
  console.log();

  // Estimated setup time
  const estimatedTime = calculateSetupTime(config);
  console.log(colors.info(`⏱️  Estimated setup time: ${estimatedTime}`));
  console.log();
}

/**
 * Calculate estimated setup time based on configuration
 */
function calculateSetupTime(config) {
  let timeMinutes = 2; // Base time

  // Frontend frameworks add time
  if (config.frontend && config.frontend.length > 0) {
    timeMinutes += config.frontend.length * 1.5;
  }

  // Backend frameworks
  if (config.backend && config.backend !== 'none') {
    timeMinutes += 2;
  }

  // Database setup
  if (config.database && config.database !== 'none') {
    timeMinutes += 1.5;
  }

  // ORM setup
  if (config.orm && config.orm !== 'none') {
    timeMinutes += 1;
  }

  // Authentication
  if (config.auth && config.auth !== 'none') {
    timeMinutes += 2;
  }

  // Development tools
  if (config.addons && config.addons.length > 0) {
    timeMinutes += config.addons.length * 0.5;
  }

  // Dependency installation
  if (config.install) {
    timeMinutes += 3;
  }

  const minutes = Math.ceil(timeMinutes);
  if (minutes < 60) {
    return `~${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `~${hours}h ${remainingMinutes}m` : `~${hours}h`;
  }
}

/**
 * Display interactive project overview
 */
export function displayProjectOverview(config) {
  console.log();
  console.log(colors.highlight("🎉 Project Overview"));
  console.log(colors.primary("════════════════════════════════════════"));
  console.log();

  // Architecture visualization
  displayArchitectureVisualization(config);
  
  // Key features
  displayKeyFeatures(config);
  
  // Next steps
  displayNextSteps(config);
}

/**
 * Display visual architecture representation
 */
function displayArchitectureVisualization(config) {
  console.log(colors.accent("🏗️  Architecture Overview:"));
  console.log();

  const hasfrontend = config.frontend && config.frontend.length > 0 && !config.frontend.includes('none');
  const hasBackend = config.backend && config.backend !== 'none';
  const hasDatabase = config.database && config.database !== 'none';

  // Client Layer
  if (hasfrontend) {
    console.log(colors.primary("   ┌─────────────────────────────┐"));
    console.log(colors.primary("   │         CLIENT LAYER        │"));
    console.log(colors.primary("   ├─────────────────────────────┤"));
    config.frontend.forEach((frontend, index) => {
      const isLast = index === config.frontend.length - 1;
      console.log(colors.success(`   │  ${frontend.padEnd(27)} │`));
    });
    console.log(colors.primary("   └─────────────┬───────────────┘"));
    console.log(colors.muted("                 │"));
  }

  // API Layer
  if (hasBackend) {
    if (hasfrontend) {
      console.log(colors.muted("                 ▼"));
    }
    console.log(colors.primary("   ┌─────────────────────────────┐"));
    console.log(colors.primary("   │          API LAYER          │"));
    console.log(colors.primary("   ├─────────────────────────────┤"));
    console.log(colors.success(`   │  ${config.backend.padEnd(27)} │`));
    if (config.auth && config.auth !== 'none') {
      console.log(colors.info(`   │  ${config.auth.padEnd(27)} │`));
    }
    console.log(colors.primary("   └─────────────┬───────────────┘"));
    console.log(colors.muted("                 │"));
  }

  // Data Layer
  if (hasDatabase) {
    if (hasBackend || hasDatabase) {
      console.log(colors.muted("                 ▼"));
    }
    console.log(colors.primary("   ┌─────────────────────────────┐"));
    console.log(colors.primary("   │         DATA LAYER          │"));
    console.log(colors.primary("   ├─────────────────────────────┤"));
    if (config.orm && config.orm !== 'none') {
      console.log(colors.warning(`   │  ${config.orm.padEnd(27)} │`));
    }
    console.log(colors.success(`   │  ${config.database.padEnd(27)} │`));
    console.log(colors.primary("   └─────────────────────────────┘"));
  }

  console.log();
}

/**
 * Display key features based on configuration
 */
function displayKeyFeatures(config) {
  console.log(colors.accent("✨ Key Features:"));
  console.log();

  const features = [];

  // Frontend features
  if (config.frontend?.includes(FRONTEND_OPTIONS.NEXTJS)) {
    features.push("🔸 Server-side rendering (SSR)");
    features.push("🔸 Static site generation (SSG)");
    features.push("🔸 API routes");
  }
  
  if (config.frontend?.includes(FRONTEND_OPTIONS.REACT)) {
    features.push("🔸 Component-based architecture");
    features.push("🔸 Virtual DOM");
  }

  // Backend features
  if (config.backend && config.backend !== 'none') {
    features.push("🔸 RESTful API endpoints");
    if (config.backend === BACKEND_OPTIONS.FASTIFY) {
      features.push("🔸 High-performance HTTP server");
    }
    if (config.backend === BACKEND_OPTIONS.NESTJS) {
      features.push("🔸 Modular architecture");
      features.push("🔸 Dependency injection");
    }
  }

  // Database features
  if (config.database && config.database !== 'none') {
    features.push("🔸 Data persistence");
    if (config.database === DATABASE_OPTIONS.POSTGRES) {
      features.push("🔸 ACID transactions");
      features.push("🔸 JSON support");
    }
    if (config.database === DATABASE_OPTIONS.MONGODB) {
      features.push("🔸 Flexible schema");
      features.push("🔸 Horizontal scaling");
    }
  }

  // ORM features
  if (config.orm === ORM_OPTIONS.PRISMA) {
    features.push("🔸 Type-safe database queries");
    features.push("🔸 Auto-generated client");
  }

  // Authentication features
  if (config.auth && config.auth !== 'none') {
    features.push("🔸 User authentication");
    if (config.auth === AUTH_OPTIONS.JWT) {
      features.push("🔸 Stateless authentication");
    }
    if (config.auth === AUTH_OPTIONS.OAUTH) {
      features.push("🔸 Social login integration");
    }
  }

  // Development tool features
  if (config.addons?.includes(ADDON_OPTIONS.TAILWIND)) {
    features.push("🔸 Utility-first CSS styling");
  }
  if (config.addons?.includes(ADDON_OPTIONS.ESLINT)) {
    features.push("🔸 Code quality enforcement");
  }
  if (config.addons?.includes(ADDON_OPTIONS.TESTING)) {
    features.push("🔸 Automated testing suite");
  }
  if (config.addons?.includes(ADDON_OPTIONS.DOCKER)) {
    features.push("🔸 Containerized deployment");
  }

  // Display features in columns
  const midPoint = Math.ceil(features.length / 2);
  const leftColumn = features.slice(0, midPoint);
  const rightColumn = features.slice(midPoint);

  for (let i = 0; i < Math.max(leftColumn.length, rightColumn.length); i++) {
    const left = leftColumn[i] || "";
    const right = rightColumn[i] || "";
    console.log(`   ${colors.success(left.padEnd(35))} ${colors.success(right)}`);
  }
  console.log();
}

/**
 * Display recommended next steps
 */
function displayNextSteps(config) {
  console.log(colors.accent("🚀 Recommended Next Steps:"));
  console.log();

  const steps = [
    "1️⃣  Review the generated project structure",
    "2️⃣  Configure environment variables",
  ];

  if (config.database && config.database !== 'none') {
    if (config.database === DATABASE_OPTIONS.POSTGRES || config.database === DATABASE_OPTIONS.MYSQL) {
      steps.push("3️⃣  Set up your database server");
    }
    if (config.orm && config.orm !== 'none') {
      steps.push("4️⃣  Run database migrations");
    }
  }

  if (config.install) {
    steps.push(`${steps.length + 1}️⃣  Dependencies will be installed automatically`);
  } else {
    steps.push(`${steps.length + 1}️⃣  Install dependencies with ${config.packageManager}`);
  }

  steps.push(`${steps.length + 1}️⃣  Start the development server`);

  if (config.addons?.includes(ADDON_OPTIONS.STORYBOOK)) {
    steps.push(`${steps.length + 1}️⃣  Explore components in Storybook`);
  }

  if (config.addons?.includes(ADDON_OPTIONS.TESTING)) {
    steps.push(`${steps.length + 1}️⃣  Run the test suite`);
  }

  steps.push(`${steps.length + 1}️⃣  Start building your application!`);

  steps.forEach(step => {
    console.log(`   ${colors.info(step)}`);
  });
  console.log();
}

/**
 * Display helpful commands based on configuration
 */
export function displayHelpfulCommands(config) {
  console.log(colors.accent("💡 Helpful Commands:"));
  console.log(colors.primary("─────────────────────────────────────"));
  console.log();

  const pm = config.packageManager;
  const commands = [];

  // Development commands
  commands.push({
    command: `${pm} run dev`,
    description: "Start development server",
    icon: "🔥"
  });

  // Build commands
  commands.push({
    command: `${pm} run build`,
    description: "Build for production",
    icon: "📦"
  });

  // Database commands
  if (config.orm === ORM_OPTIONS.PRISMA) {
    commands.push({
      command: `${pm} run db:migrate`,
      description: "Run database migrations",
      icon: "🗄️"
    });
    commands.push({
      command: `${pm} run db:studio`,
      description: "Open Prisma Studio",
      icon: "👀"
    });
  }

  // Testing commands
  if (config.addons?.includes(ADDON_OPTIONS.TESTING)) {
    commands.push({
      command: `${pm} test`,
      description: "Run test suite",
      icon: "🧪"
    });
  }

  // Linting commands
  if (config.addons?.includes(ADDON_OPTIONS.ESLINT)) {
    commands.push({
      command: `${pm} run lint`,
      description: "Lint code",
      icon: "🔍"
    });
  }

  // Storybook commands
  if (config.addons?.includes(ADDON_OPTIONS.STORYBOOK)) {
    commands.push({
      command: `${pm} run storybook`,
      description: "Start Storybook",
      icon: "📚"
    });
  }

  // Format commands
  if (config.addons?.includes(ADDON_OPTIONS.PRETTIER)) {
    commands.push({
      command: `${pm} run format`,
      description: "Format code",
      icon: "💅"
    });
  }

  // Display commands in a nice format
  const maxCommandLength = Math.max(...commands.map(c => c.command.length));
  
  commands.forEach(({ command, description, icon }) => {
    const paddedCommand = command.padEnd(maxCommandLength + 2);
    console.log(`   ${icon} ${colors.success(paddedCommand)} ${colors.muted(description)}`);
  });

  console.log();
  console.log(colors.primary("─────────────────────────────────────"));
  console.log(colors.muted("   Navigate to your project directory and run these commands"));
  console.log();
}

/**
 * Display final success message
 */
export function displaySuccessMessage(config) {
  console.log();
  console.log(colors.highlight("🎉 SUCCESS! Your project has been created!"));
  console.log();
  console.log(colors.success(`   Project: ${colors.primary(config.projectName)}`));
  console.log(colors.success(`   Location: ${colors.muted(config.projectDir)}`));
  console.log();
  console.log(colors.accent("Happy coding! 🚀"));
  console.log();
}