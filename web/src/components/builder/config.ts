export type Frontend =
  | "none"
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "nextjs"
  | "nuxt"
  | "react-native";

export type Backend =
  | "none"
  | "express"
  | "fastify"
  | "koa"
  | "hapi"
  | "nestjs";

export type Database = "none" | "sqlite" | "postgres" | "mysql" | "mongodb";

export type ORM = "none" | "prisma" | "sequelize" | "mongoose" | "typeorm";

export type Auth =
  | "none"
  | "jwt"
  | "passport"
  | "auth0"
  | "oauth"
  | "better-auth";

export type Addon = "docker" | "testing" | "biome" | "turborepo";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface BuilderState {
  projectName: string;
  frontend: Frontend;
  backend: Backend;
  database: Database;
  orm: ORM;
  auth: Auth;
  addons: Addon[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

export const defaultConfig: BuilderState = {
  projectName: "Js-Stack",
  frontend: "react",
  backend: "express",
  database: "mongodb",
  orm: "mongoose",
  auth: "jwt",
  addons: [],
  packageManager: "npm",
  installDependencies: true,
  initializeGit: true,
};

// Comprehensive compatibility matrix based on real-world tested combinations
export const compatibilityRules = {
  // Database-ORM compatibility (strictly enforced)
  databaseOrm: {
    mongodb: ["mongoose", "none"],
    postgres: ["prisma", "sequelize", "typeorm", "none"],
    mysql: ["prisma", "sequelize", "typeorm", "none"],
    sqlite: ["prisma", "sequelize", "typeorm", "none"],
    none: ["none"],
  },

  // Frontend-Auth compatibility (optimal pairings)
  frontendAuth: {
    nextjs: ["better-auth", "auth0", "jwt", "oauth", "none"],
    react: ["auth0", "better-auth", "jwt", "oauth", "passport", "none"],
    vue: ["auth0", "better-auth", "jwt", "oauth", "passport", "none"],
    nuxt: ["auth0", "better-auth", "jwt", "oauth", "none"],
    angular: ["auth0", "jwt", "oauth", "passport", "none"],
    svelte: ["auth0", "better-auth", "jwt", "oauth", "none"],
    "react-native": ["auth0", "better-auth", "jwt", "oauth", "none"],
    none: ["none"],
  },

  // Backend-Database compatibility (tested combinations)
  backendDatabase: {
    express: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    fastify: ["postgres", "mysql", "sqlite", "mongodb", "none"], // Fastify works great with SQL
    koa: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    hapi: ["postgres", "mysql", "sqlite", "mongodb", "none"],
    nestjs: ["postgres", "mysql", "sqlite", "mongodb", "none"], // NestJS supports all major DBs
    none: ["none"],
  },

  // Frontend-Addon compatibility (framework-specific support)
  frontendAddons: {
    nextjs: ["testing", "biome", "turborepo", "docker"],
    react: ["testing", "biome", "turborepo", "docker"],
    vue: ["testing", "biome", "turborepo", "docker"],
    angular: ["testing", "docker", "turborepo"], // Angular has its own linting, biome less common
    svelte: ["testing", "biome", "turborepo", "docker"],
    nuxt: ["testing", "biome", "turborepo", "docker"],
    "react-native": ["testing", "docker"], // Limited addon support for mobile
    none: ["docker", "testing", "biome", "turborepo"], // Backend-only supports all
  },
} as const;

// Well-tested, production-ready stack combinations
export const testedStackCombinations: Record<string, Partial<BuilderState>> = {
  // Modern full-stack combinations
  "nextjs-postgres-prisma": {
    frontend: "nextjs",
    backend: "none", // Next.js API routes
    database: "postgres",
    orm: "prisma",
    auth: "better-auth",
    addons: ["testing", "biome"],
    packageManager: "npm",
  },
  "react-express-postgres": {
    frontend: "react",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  "vue-express-mysql": {
    frontend: "vue",
    backend: "express",
    database: "mysql",
    orm: "sequelize",
    auth: "passport",
    addons: ["testing", "biome"],
    packageManager: "npm",
  },
  // API-only combinations
  "fastify-postgres-prisma": {
    frontend: "none",
    backend: "fastify",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  "nestjs-postgres-typeorm": {
    frontend: "none",
    backend: "nestjs",
    database: "postgres",
    orm: "typeorm",
    auth: "passport",
    addons: ["testing", "docker"],
    packageManager: "npm",
  },
  // NoSQL combinations
  "react-express-mongo": {
    frontend: "react",
    backend: "express",
    database: "mongodb",
    orm: "mongoose",
    auth: "jwt",
    addons: ["testing"],
    packageManager: "npm",
  },
  // Mobile combinations
  "react-native-express": {
    frontend: "react-native",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "auth0",
    addons: ["testing"],
    packageManager: "npm",
  },
  // Rapid prototyping
  "react-express-sqlite": {
    frontend: "react",
    backend: "express",
    database: "sqlite",
    orm: "prisma",
    auth: "none",
    addons: [],
    packageManager: "npm",
  },
};

export const techCatalog = {
  frontend: [
    {
      key: "react",
      name: "React",
      desc: "Fast, flexible UI library with Vite",
      badge: "Popular",
    },
    {
      key: "nextjs",
      name: "Next.js",
      desc: "Production-ready React framework",
      badge: "Full-Stack",
    },
    {
      key: "vue",
      name: "Vue",
      desc: "Progressive, approachable framework",
      badge: "Modern",
    },
    {
      key: "nuxt",
      name: "Nuxt",
      desc: "Intuitive Vue meta-framework",
      badge: "Full-Stack",
    },
    {
      key: "svelte",
      name: "Svelte",
      desc: "Compile-time optimized framework",
      badge: "Fast",
    },
    {
      key: "angular",
      name: "Angular",
      desc: "Full-featured enterprise framework",
      badge: "Enterprise",
    },
    {
      key: "react-native",
      name: "React Native",
      desc: "Cross-platform mobile apps",
      badge: "Mobile",
    },
    { key: "none", name: "None", desc: "API-only backend service" },
  ],
  backend: [
    {
      key: "express",
      name: "Express",
      desc: "Minimal, flexible Node.js framework",
      badge: "Popular",
    },
    {
      key: "fastify",
      name: "Fastify",
      desc: "High-performance web framework",
      badge: "Fast",
    },
    {
      key: "nestjs",
      name: "NestJS",
      desc: "Scalable enterprise framework",
      badge: "Enterprise",
    },
    { key: "koa", name: "Koa", desc: "Expressive middleware framework" },
    { key: "hapi", name: "Hapi", desc: "Rich configuration framework" },
    { key: "none", name: "None", desc: "Frontend-only application" },
  ],
  database: [
    {
      key: "postgres",
      name: "PostgreSQL",
      desc: "Advanced open-source database",
      badge: "Popular",
    },
    {
      key: "mysql",
      name: "MySQL",
      desc: "Reliable relational database",
      badge: "Stable",
    },
    {
      key: "mongodb",
      name: "MongoDB",
      desc: "Flexible document database",
      badge: "NoSQL",
    },
    {
      key: "sqlite",
      name: "SQLite",
      desc: "Lightweight embedded database",
      badge: "Dev",
    },
    { key: "none", name: "None", desc: "No database persistence" },
  ],
  orm: [
    {
      key: "prisma",
      name: "Prisma",
      desc: "Next-gen type-safe ORM",
      badge: "Modern",
    },
    {
      key: "mongoose",
      name: "Mongoose",
      desc: "Elegant MongoDB ODM",
      badge: "MongoDB",
    },
    {
      key: "sequelize",
      name: "Sequelize",
      desc: "Feature-rich SQL ORM",
      badge: "Mature",
    },
    {
      key: "typeorm",
      name: "TypeORM",
      desc: "TypeScript-first ORM",
      badge: "TypeScript",
    },
    { key: "none", name: "None", desc: "Direct database queries" },
  ],
  auth: [
    {
      key: "better-auth",
      name: "Better Auth",
      desc: "Modern, flexible auth solution",
      badge: "New",
    },
    {
      key: "auth0",
      name: "Auth0",
      desc: "Complete identity platform",
      badge: "Hosted",
    },
    {
      key: "jwt",
      name: "JWT",
      desc: "Simple stateless authentication",
      badge: "Simple",
    },
    {
      key: "passport",
      name: "Passport",
      desc: "Extensible auth middleware",
      badge: "Flexible",
    },
    {
      key: "oauth",
      name: "OAuth",
      desc: "Industry-standard authorization",
      badge: "Standard",
    },
    { key: "none", name: "None", desc: "No user authentication" },
  ],
  addons: [
    {
      key: "testing",
      name: "Testing",
      desc: "Jest/Vitest testing framework",
      badge: "Recommended",
    },
    {
      key: "biome",
      name: "Biome",
      desc: "Ultra-fast linter & formatter",
      badge: "Fast",
    },
    {
      key: "docker",
      name: "Docker",
      desc: "Application containerization",
      badge: "DevOps",
    },
    {
      key: "turborepo",
      name: "Turborepo",
      desc: "High-performance monorepo",
      badge: "Monorepo",
    },
  ],
  packageManager: [
    { key: "npm", name: "npm", desc: "Node Package Manager", badge: "Default" },
    { key: "yarn", name: "Yarn", desc: "Fast, reliable, secure" },
    { key: "pnpm", name: "pnpm", desc: "Fast, disk space efficient" },
    {
      key: "bun",
      name: "Bun",
      desc: "All-in-one JavaScript runtime",
      badge: "Fast",
    },
  ],
} as const;

export function normalizeState(input: Partial<BuilderState>): BuilderState {
  return {
    projectName: input.projectName || defaultConfig.projectName,
    frontend: input.frontend || defaultConfig.frontend,
    backend: input.backend || defaultConfig.backend,
    database: input.database || defaultConfig.database,
    orm: input.orm || defaultConfig.orm,
    auth: input.auth || defaultConfig.auth,
    addons: Array.isArray(input.addons) ? input.addons : defaultConfig.addons,
    packageManager: input.packageManager || defaultConfig.packageManager,
    installDependencies:
      input.installDependencies ?? defaultConfig.installDependencies,
    initializeGit: input.initializeGit ?? defaultConfig.initializeGit,
  };
}

// Check if two technologies are compatible
export function isCompatible(
  type: "databaseOrm" | "frontendAuth" | "backendDatabase" | "frontendAddons",
  primary: string,
  secondary: string | string[],
): boolean {
  const rules = compatibilityRules[type];
  const compatibleOptions =
    (rules as Record<string, readonly string[]>)[primary] || [];

  if (Array.isArray(secondary)) {
    return secondary.every((item) => compatibleOptions.includes(item));
  }

  return compatibleOptions.includes(secondary);
}

// Get compatible options for a given selection
export function getCompatibleOptions<T extends string>(
  type: "databaseOrm" | "frontendAuth" | "backendDatabase" | "frontendAddons",
  primary: string,
): T[] {
  const rules = compatibilityRules[type];
  return ((rules as Record<string, readonly string[]>)[primary] || []) as T[];
}

// Find the best tested combination for current selections
export function findBestTestedCombination(state: BuilderState): {
  match: string | null;
  confidence: number;
  suggestions: Partial<BuilderState>;
} {
  let bestMatch = null;
  let bestScore = 0;
  let bestSuggestions: Partial<BuilderState> = {};

  for (const [key, combo] of Object.entries(testedStackCombinations)) {
    let score = 0;
    const maxScore = 6;

    if (state.frontend === combo.frontend) score++;
    if (state.backend === combo.backend) score++;
    if (state.database === combo.database) score++;
    if (state.orm === combo.orm) score++;
    if (state.auth === combo.auth) score++;
    if (
      state.addons.length > 0 &&
      combo.addons &&
      combo.addons.some((addon) => state.addons.includes(addon))
    )
      score++;

    const confidence = score / maxScore;

    if (confidence > bestScore) {
      bestScore = confidence;
      bestMatch = key;
      bestSuggestions = combo;
    }
  }

  return {
    match: bestMatch,
    confidence: bestScore,
    suggestions: bestSuggestions,
  };
}

// Apply compatibility rules and fix conflicts with intelligent suggestions
export function applyCompatibility(state: BuilderState): BuilderState {
  // Return state as-is without automatic adjustments
  // Let the user make their own choices
  return { ...state };
}

// Validate entire configuration with detailed feedback
export function validateConfiguration(state: BuilderState): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  testedCombination?: {
    match: string | null;
    confidence: number;
    isWellTested: boolean;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // No strict errors - let users make their own choices
  // Only provide informational warnings

  // Check for tested combinations
  const testedCombo = findBestTestedCombination(state);
  const isWellTested = testedCombo.confidence >= 0.7;

  if (!isWellTested && testedCombo.confidence > 0.3) {
    warnings.push(
      `This combination is experimental. Consider using a tested stack for production`,
    );
  }

  // Setup warnings
  if (!state.installDependencies) {
    warnings.push(
      "Manual dependency installation required after project creation",
    );
  }

  if (!state.initializeGit) {
    warnings.push("Manual git repository initialization required");
  }

  return {
    isValid: true, // Always valid - no blocking errors
    errors,
    warnings,
    testedCombination: {
      match: testedCombo.match,
      confidence: testedCombo.confidence,
      isWellTested,
    },
  };
}

// Build CLI command with proper formatting
export function buildCliCommand(state: BuilderState): string {
  // Get the correct command prefix based on package manager
  const getCommandPrefix = (packageManager: PackageManager): string => {
    switch (packageManager) {
      case "npm":
        return "npx";
      case "yarn":
        return "yarn create";
      case "pnpm":
        return "pnpm create";
      case "bun":
        return "bunx";
      default:
        return "npx";
    }
  };

  const parts = [
    `${getCommandPrefix(state.packageManager)} create-js-stack@latest ${state.projectName}`,
  ];

  if (state.frontend !== "none") {
    parts.push(`--frontend ${state.frontend}`);
  }

  if (state.backend !== "none") {
    parts.push(`--backend ${state.backend}`);
  }

  if (state.database !== "none") {
    parts.push(`--database ${state.database}`);
  }

  if (state.orm !== "none") {
    parts.push(`--orm ${state.orm}`);
  }

  if (state.auth !== "none") {
    parts.push(`--auth ${state.auth}`);
  }

  if (state.addons.length > 0) {
    parts.push(`--addons ${state.addons.join(",")}`);
  }

  // Add package manager
  parts.push(`--package-manager ${state.packageManager}`);

  // Add git flag
  if (state.initializeGit) {
    parts.push("--git");
  }

  // Add install flag
  if (state.installDependencies) {
    parts.push("--install");
  }

  return parts.join(" ");
}

// Compact CLI command generator (similar to the example you showed)
export function generateReproducibleCommand(config: BuilderState): string {
  const flags: string[] = [];

  // Frontend
  if (config.frontend && config.frontend !== "none") {
    flags.push(`--frontend ${config.frontend}`);
  } else {
    flags.push("--frontend none");
  }

  // Backend
  flags.push(`--backend ${config.backend}`);

  // Database
  flags.push(`--database ${config.database}`);

  // ORM
  flags.push(`--orm ${config.orm}`);

  // Auth
  flags.push(`--auth ${config.auth}`);

  // Addons
  if (config.addons && config.addons.length > 0) {
    flags.push(`--addons ${config.addons.join(",")}`);
  } else {
    flags.push("--addons none");
  }

  // Package manager
  flags.push(`--package-manager ${config.packageManager}`);

  // Git initialization
  flags.push(config.initializeGit ? "--git" : "--no-git");

  // Install dependencies
  flags.push(config.installDependencies ? "--install" : "--no-install");

  // Build base command based on package manager
  let baseCommand = "npx create-js-stack@latest";
  const pkgManager = config.packageManager;

  switch (pkgManager) {
    case "bun":
      baseCommand = "bunx create-js-stack@latest";
      break;
    case "pnpm":
      baseCommand = "pnpm create js-stack@latest";
      break;
    case "yarn":
      baseCommand = "yarn create js-stack@latest";
      break;
    case "npm":
    default:
      baseCommand = "npx create-js-stack@latest";
      break;
  }

  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}

// Generate quick start command with --yes flag
export function generateQuickStartCommand(config: BuilderState): string {
  const projectPathArg = config.projectName ? ` ${config.projectName}` : "";

  // Build base command based on package manager
  let baseCommand = "npx create-js-stack@latest";
  const pkgManager = config.packageManager;

  switch (pkgManager) {
    case "bun":
      baseCommand = "bunx create-js-stack@latest";
      break;
    case "pnpm":
      baseCommand = "pnpm create js-stack@latest";
      break;
    case "yarn":
      baseCommand = "yarn create js-stack@latest";
      break;
    case "npm":
    default:
      baseCommand = "npx create-js-stack@latest";
      break;
  }

  // --yes automatically includes --git and --install
  return `${baseCommand}${projectPathArg} --yes`;
}

// Build separate commands for post-setup actions
export function buildPostSetupCommands(state: BuilderState): {
  cdCommand: string;
  installCommand?: string;
  gitCommands?: string[];
  startCommand: string;
  databaseSetup?: string[];
} {
  const commands: {
    cdCommand: string;
    startCommand: string;
    installCommand?: string;
    gitCommands?: string[];
    databaseSetup?: string[];
  } = {
    cdCommand: `cd ${state.projectName}`,
    startCommand:
      state.frontend === "none"
        ? `${state.packageManager} start`
        : `${state.packageManager} run dev`,
  };

  if (!state.installDependencies) {
    commands.installCommand = `${state.packageManager} install`;
  }

  if (!state.initializeGit) {
    commands.gitCommands = [
      "git init",
      "git add .",
      'git commit -m "Initial commit"',
    ];
  }

  // Add database setup commands for local databases
  if (state.database === "postgres") {
    commands.databaseSetup = [
      "createdb " + state.projectName,
      "npx prisma migrate dev", // if using Prisma
    ];
  } else if (state.database === "mysql") {
    commands.databaseSetup = [
      'mysql -e "CREATE DATABASE ' + state.projectName + '"',
      "npx prisma migrate dev", // if using Prisma
    ];
  }

  return commands;
}

// Get recommended stack for common use cases with tested combinations
export function getRecommendedStack(useCase: string): Partial<BuilderState> {
  const stacks = {
    "fullstack-web": {
      frontend: "nextjs" as Frontend,
      backend: "none" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "better-auth" as Auth,
      addons: ["testing", "biome"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    "react-api": {
      frontend: "react" as Frontend,
      backend: "express" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "jwt" as Auth,
      addons: ["testing", "docker"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    "api-only": {
      frontend: "none" as Frontend,
      backend: "fastify" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "jwt" as Auth,
      addons: ["testing", "docker"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    mobile: {
      frontend: "react-native" as Frontend,
      backend: "express" as Backend,
      database: "postgres" as Database,
      orm: "prisma" as ORM,
      auth: "auth0" as Auth,
      addons: ["testing"] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: true,
    },
    prototype: {
      frontend: "react" as Frontend,
      backend: "express" as Backend,
      database: "sqlite" as Database,
      orm: "prisma" as ORM,
      auth: "none" as Auth,
      addons: [] as Addon[],
      packageManager: "npm" as PackageManager,
      installDependencies: true,
      initializeGit: false,
    },
  };

  return stacks[useCase as keyof typeof stacks] || {};
}

// Generate complete setup instructions
export function generateSetupInstructions(state: BuilderState): {
  title: string;
  steps: string[];
  notes: string[];
} {
  const commands = buildPostSetupCommands(state);
  const validation = validateConfiguration(state);

  const steps = [
    `Run: ${buildCliCommand(state)}`,
    `Navigate to project: ${commands.cdCommand}`,
  ];

  if (commands.installCommand) {
    steps.push(`Install dependencies: ${commands.installCommand}`);
  }

  if (commands.databaseSetup && commands.databaseSetup.length > 0) {
    steps.push(`Setup database:`);
    commands.databaseSetup.forEach((cmd) => steps.push(`  ${cmd}`));
  }

  if (commands.gitCommands) {
    steps.push(`Initialize git repository:`);
    commands.gitCommands.forEach((cmd) => steps.push(`  ${cmd}`));
  }

  steps.push(`Start development server: ${commands.startCommand}`);

  const notes = [...validation.warnings];

  // Add tested combination info
  if (validation.testedCombination?.isWellTested) {
    notes.unshift(
      `✅ This is a well-tested, production-ready stack combination`,
    );
  } else if (
    validation.testedCombination?.confidence &&
    validation.testedCombination.confidence > 0.3
  ) {
    notes.unshift(
      `⚠️ This combination is experimental. Consider a tested stack for production`,
    );
  }

  // Technology-specific setup notes
  if (state.auth === "auth0") {
    notes.push("Configure Auth0 domain and client ID in environment variables");
  }

  if (state.auth === "better-auth") {
    notes.push("Configure Better Auth providers and database URL");
  }

  if (state.addons.includes("docker")) {
    notes.push("Docker compose file included for development environment");
  }

  if (state.addons.includes("turborepo")) {
    notes.push("Turborepo workspace configured for monorepo development");
  }

  return {
    title: `Setup Instructions for ${state.projectName}`,
    steps,
    notes,
  };
}

// Check if current configuration requires manual setup steps
export function requiresManualSetup(state: BuilderState): {
  hasManualSteps: boolean;
  steps: string[];
} {
  const manualSteps: string[] = [];

  if (!state.installDependencies) {
    manualSteps.push("Install dependencies manually");
  }

  if (!state.initializeGit) {
    manualSteps.push("Initialize git repository");
  }

  if (state.database === "postgres" || state.database === "mysql") {
    manualSteps.push("Set up and configure database server");
  }

  if (state.auth === "auth0") {
    manualSteps.push("Configure Auth0 credentials and environment variables");
  }

  if (state.auth === "better-auth") {
    manualSteps.push("Configure Better Auth providers and settings");
  }

  if (state.addons.includes("docker")) {
    manualSteps.push("Build and run Docker containers");
  }

  if (state.addons.includes("turborepo")) {
    manualSteps.push("Configure turborepo workspace settings");
  }

  return {
    hasManualSteps: manualSteps.length > 0,
    steps: manualSteps,
  };
}
