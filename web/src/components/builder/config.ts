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

export type Database =
  | "none"
  | "sqlite"
  | "postgres"
  | "mysql"
  | "mongodb";

export type ORM =
  | "none"
  | "prisma"
  | "sequelize"
  | "mongoose"
  | "typeorm";

export type Auth =
  | "none"
  | "jwt"
  | "passport"
  | "auth0"
  | "oauth"
  | "better-auth";

export type Addon =
  | "docker"
  | "testing"
  | "biome"
  | "turborepo";

export type PackageManager =
  | "npm"
  | "yarn"
  | "pnpm"
  | "bun";

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
  projectName: "my-app",
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
    none: ["none"]
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
    none: ["none"]
  },

  // Backend-Database compatibility (tested combinations)
  backendDatabase: {
    express: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    fastify: ["postgres", "mysql", "sqlite", "mongodb", "none"], // Fastify works great with SQL
    koa: ["mongodb", "postgres", "mysql", "sqlite", "none"],
    hapi: ["postgres", "mysql", "sqlite", "mongodb", "none"],
    nestjs: ["postgres", "mysql", "sqlite", "mongodb", "none"], // NestJS supports all major DBs
    none: ["none"]
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
    none: ["docker", "testing", "biome", "turborepo"] // Backend-only supports all
  }
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
    packageManager: "npm"
  },
  "react-express-postgres": {
    frontend: "react",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm"
  },
  "vue-express-mysql": {
    frontend: "vue",
    backend: "express",
    database: "mysql",
    orm: "sequelize",
    auth: "passport",
    addons: ["testing", "biome"],
    packageManager: "npm"
  },
  // API-only combinations
  "fastify-postgres-prisma": {
    frontend: "none",
    backend: "fastify",
    database: "postgres",
    orm: "prisma",
    auth: "jwt",
    addons: ["testing", "docker"],
    packageManager: "npm"
  },
  "nestjs-postgres-typeorm": {
    frontend: "none",
    backend: "nestjs",
    database: "postgres",
    orm: "typeorm",
    auth: "passport",
    addons: ["testing", "docker"],
    packageManager: "npm"
  },
  // NoSQL combinations
  "react-express-mongo": {
    frontend: "react",
    backend: "express",
    database: "mongodb",
    orm: "mongoose",
    auth: "jwt",
    addons: ["testing"],
    packageManager: "npm"
  },
  // Mobile combinations
  "react-native-express": {
    frontend: "react-native",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    auth: "auth0",
    addons: ["testing"],
    packageManager: "npm"
  },
  // Rapid prototyping
  "react-express-sqlite": {
    frontend: "react",
    backend: "express",
    database: "sqlite",
    orm: "prisma",
    auth: "none",
    addons: [],
    packageManager: "npm"
  }
};

export const techCatalog = {
  frontend: [
    { key: "react", name: "React", desc: "Vite + React app", badge: "Popular" },
    { key: "nextjs", name: "Next.js", desc: "React meta-framework", badge: "Full-Stack" },
    { key: "vue", name: "Vue", desc: "Progressive framework" },
    { key: "nuxt", name: "Nuxt", desc: "Vue meta-framework" },
    { key: "svelte", name: "Svelte", desc: "Compile-time framework" },
    { key: "angular", name: "Angular", desc: "Enterprise framework" },
    { key: "react-native", name: "React Native", desc: "Mobile development" },
    { key: "none", name: "None", desc: "Backend/API only" },
  ],
  backend: [
    { key: "express", name: "Express", desc: "Minimal and flexible", badge: "Popular" },
    { key: "fastify", name: "Fastify", desc: "High performance", badge: "Fast" },
    { key: "nestjs", name: "NestJS", desc: "Enterprise grade", badge: "Enterprise" },
    { key: "koa", name: "Koa", desc: "Next-gen Express" },
    { key: "hapi", name: "Hapi", desc: "Configuration-centric" },
    { key: "none", name: "None", desc: "Frontend only" },
  ],
  database: [
    { key: "postgres", name: "PostgreSQL", desc: "Advanced relational", badge: "Popular" },
    { key: "mysql", name: "MySQL", desc: "Widely adopted" },
    { key: "mongodb", name: "MongoDB", desc: "Document database", badge: "NoSQL" },
    { key: "sqlite", name: "SQLite", desc: "Embedded database" },
    { key: "none", name: "None", desc: "No persistence" },
  ],
  orm: [
    { key: "prisma", name: "Prisma", desc: "Type-safe ORM", badge: "Modern" },
    { key: "mongoose", name: "Mongoose", desc: "MongoDB ODM", badge: "MongoDB" },
    { key: "sequelize", name: "Sequelize", desc: "SQL ORM" },
    { key: "typeorm", name: "TypeORM", desc: "ActiveRecord/DataMapper" },
    { key: "none", name: "None", desc: "Raw queries" },
  ],
  auth: [
    { key: "better-auth", name: "Better Auth", desc: "Modern auth toolkit", badge: "New" },
    { key: "auth0", name: "Auth0", desc: "Authentication as a service", badge: "Hosted" },
    { key: "jwt", name: "JWT", desc: "Stateless tokens", badge: "Simple" },
    { key: "passport", name: "Passport", desc: "Authentication middleware" },
    { key: "oauth", name: "OAuth", desc: "Third-party login" },
    { key: "none", name: "None", desc: "No authentication" },
  ],
  addons: [
    { key: "testing", name: "Testing", desc: "Jest/Vitest setup", badge: "Recommended" },
    { key: "biome", name: "Biome", desc: "Fast linter & formatter", badge: "Fast" },
    { key: "docker", name: "Docker", desc: "Containerization" },
    { key: "turborepo", name: "Turborepo", desc: "Monorepo tooling" },
  ],
  packageManager: [
    { key: "npm", name: "npm", desc: "Node Package Manager", badge: "Default" },
    { key: "yarn", name: "Yarn", desc: "Fast, reliable, secure" },
    { key: "pnpm", name: "pnpm", desc: "Fast, disk space efficient" },
    { key: "bun", name: "Bun", desc: "All-in-one JavaScript runtime", badge: "Fast" },
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
    installDependencies: input.installDependencies ?? defaultConfig.installDependencies,
    initializeGit: input.initializeGit ?? defaultConfig.initializeGit,
  };
}

// Check if two technologies are compatible
export function isCompatible(
  type: 'databaseOrm' | 'frontendAuth' | 'backendDatabase' | 'frontendAddons',
  primary: string,
  secondary: string | string[]
): boolean {
  const rules = compatibilityRules[type];
  const compatibleOptions = (rules as Record<string, readonly string[]>)[primary] || [];
  
  if (Array.isArray(secondary)) {
    return secondary.every(item => compatibleOptions.includes(item));
  }
  
  return compatibleOptions.includes(secondary);
}

// Get compatible options for a given selection
export function getCompatibleOptions<T extends string>(
  type: 'databaseOrm' | 'frontendAuth' | 'backendDatabase' | 'frontendAddons',
  primary: string
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
    if (state.addons.length > 0 && combo.addons && combo.addons.some(addon => state.addons.includes(addon))) score++;

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
    suggestions: bestSuggestions
  };
}

// Apply compatibility rules and fix conflicts with intelligent suggestions
export function applyCompatibility(state: BuilderState): BuilderState {
  const next = { ...state };
  
  // Check if current combination is a known tested stack
  // const testedCombo = findBestTestedCombination(next);
  
  // Fix database-ORM compatibility (critical - must be compatible)
  if (!isCompatible('databaseOrm', next.database, next.orm)) {
    const compatibleOrms = getCompatibleOptions<ORM>('databaseOrm', next.database);
    next.orm = compatibleOrms[0] || 'none';
  }
  
  // Fix frontend-auth compatibility (prefer optimal pairings)
  if (!isCompatible('frontendAuth', next.frontend, next.auth)) {
    const compatibleAuth = getCompatibleOptions<Auth>('frontendAuth', next.frontend);
    next.auth = compatibleAuth[0] || 'none';
  }
  
  // Fix backend-database compatibility (ensure supported combination)
  if (!isCompatible('backendDatabase', next.backend, next.database)) {
    const compatibleDbs = getCompatibleOptions<Database>('backendDatabase', next.backend);
    next.database = compatibleDbs[0] || 'none';
    
    // Recheck ORM compatibility after database change
    if (!isCompatible('databaseOrm', next.database, next.orm)) {
      const compatibleOrms = getCompatibleOptions<ORM>('databaseOrm', next.database);
      next.orm = compatibleOrms[0] || 'none';
    }
  }
  
  // Filter incompatible addons based on frontend framework
  const compatibleAddons = getCompatibleOptions<Addon>('frontendAddons', next.frontend);
  next.addons = next.addons.filter(addon => compatibleAddons.includes(addon));
  
  return next;
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
  
  // Critical compatibility checks
  if (!isCompatible('databaseOrm', state.database, state.orm)) {
    errors.push(`${state.orm} ORM is not compatible with ${state.database} database`);
  }
  
  if (!isCompatible('backendDatabase', state.backend, state.database)) {
    errors.push(`${state.database} database is not well-supported with ${state.backend} backend`);
  }
  
  // Optimization suggestions
  if (!isCompatible('frontendAuth', state.frontend, state.auth)) {
    warnings.push(`Consider using a different auth solution for better ${state.frontend} integration`);
  }
  
  // Check for tested combinations
  const testedCombo = findBestTestedCombination(state);
  const isWellTested = testedCombo.confidence >= 0.7;
  
  if (!isWellTested && testedCombo.confidence > 0.3) {
    warnings.push(`This combination is experimental. Consider using a tested stack for production`);
  }
  
  // Specific technology warnings
  if (state.database === 'sqlite' && state.backend !== 'none') {
    warnings.push('SQLite is great for development but consider PostgreSQL for production');
  }
  
  if (state.frontend === 'angular' && state.addons.includes('biome')) {
    warnings.push('Angular has built-in linting. Biome may conflict with Angular CLI tools');
  }
  
  if (state.frontend === 'react-native' && state.addons.includes('turborepo')) {
    warnings.push('Turborepo setup for React Native requires additional configuration');
  }
  
  // Setup warnings
  if (!state.installDependencies) {
    warnings.push('Manual dependency installation required after project creation');
  }
  
  if (!state.initializeGit) {
    warnings.push('Manual git repository initialization required');
  }
  
  // Database-specific warnings
  if ((state.database === 'postgres' || state.database === 'mysql') && !state.installDependencies) {
    warnings.push('Database connection setup required before running the application');
  }
  
  if (state.auth === 'auth0' && !state.installDependencies) {
    warnings.push('Auth0 configuration and environment variables setup required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    testedCombination: {
      match: testedCombo.match,
      confidence: testedCombo.confidence,
      isWellTested
    }
  };
}

// Build CLI command with proper formatting
export function buildCliCommand(state: BuilderState): string {
  const parts = [
    `npx create-js-stack@latest ${state.projectName}`
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
    parts.push(`--addons ${state.addons.join(',')}`);
  }
  
  // Add package manager
  parts.push(`--package-manager ${state.packageManager}`);
  
  // Add git flag
  if (state.initializeGit) {
    parts.push('--git');
  }
  
  // Add install flag
  if (state.installDependencies) {
    parts.push('--install');
  }
  
  return parts.join(' ');
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
    startCommand: state.frontend === 'none' ? `${state.packageManager} start` : `${state.packageManager} run dev`
  };
  
  if (!state.installDependencies) {
    commands.installCommand = `${state.packageManager} install`;
  }
  
  if (!state.initializeGit) {
    commands.gitCommands = [
      'git init',
      'git add .',
      'git commit -m "Initial commit"'
    ];
  }
  
  // Add database setup commands for local databases
  if (state.database === 'postgres') {
    commands.databaseSetup = [
      'createdb ' + state.projectName,
      'npx prisma migrate dev' // if using Prisma
    ];
  } else if (state.database === 'mysql') {
    commands.databaseSetup = [
      'mysql -e "CREATE DATABASE ' + state.projectName + '"',
      'npx prisma migrate dev' // if using Prisma
    ];
  }
  
  return commands;
}

// Get recommended stack for common use cases with tested combinations
export function getRecommendedStack(useCase: string): Partial<BuilderState> {
  const stacks = {
    'fullstack-web': {
      frontend: 'nextjs' as Frontend,
      backend: 'none' as Backend,
      database: 'postgres' as Database,
      orm: 'prisma' as ORM,
      auth: 'better-auth' as Auth,
      addons: ['testing', 'biome'] as Addon[],
      packageManager: 'npm' as PackageManager,
      installDependencies: true,
      initializeGit: true
    },
    'react-api': {
      frontend: 'react' as Frontend,
      backend: 'express' as Backend,
      database: 'postgres' as Database,
      orm: 'prisma' as ORM,
      auth: 'jwt' as Auth,
      addons: ['testing', 'docker'] as Addon[],
      packageManager: 'npm' as PackageManager,
      installDependencies: true,
      initializeGit: true
    },
    'api-only': {
      frontend: 'none' as Frontend,
      backend: 'fastify' as Backend,
      database: 'postgres' as Database,
      orm: 'prisma' as ORM,
      auth: 'jwt' as Auth,
      addons: ['testing', 'docker'] as Addon[],
      packageManager: 'npm' as PackageManager,
      installDependencies: true,
      initializeGit: true
    },
    'mobile': {
      frontend: 'react-native' as Frontend,
      backend: 'express' as Backend,
      database: 'postgres' as Database,
      orm: 'prisma' as ORM,
      auth: 'auth0' as Auth,
      addons: ['testing'] as Addon[],
      packageManager: 'npm' as PackageManager,
      installDependencies: true,
      initializeGit: true
    },
    'prototype': {
      frontend: 'react' as Frontend,
      backend: 'express' as Backend,
      database: 'sqlite' as Database,
      orm: 'prisma' as ORM,
      auth: 'none' as Auth,
      addons: [] as Addon[],
      packageManager: 'npm' as PackageManager,
      installDependencies: true,
      initializeGit: false
    }
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
    `Navigate to project: ${commands.cdCommand}`
  ];
  
  if (commands.installCommand) {
    steps.push(`Install dependencies: ${commands.installCommand}`);
  }
  
  if (commands.databaseSetup && commands.databaseSetup.length > 0) {
    steps.push(`Setup database:`);
    commands.databaseSetup.forEach(cmd => steps.push(`  ${cmd}`));
  }
  
  if (commands.gitCommands) {
    steps.push(`Initialize git repository:`);
    commands.gitCommands.forEach(cmd => steps.push(`  ${cmd}`));
  }
  
  steps.push(`Start development server: ${commands.startCommand}`);
  
  const notes = [...validation.warnings];
  
  // Add tested combination info
  if (validation.testedCombination?.isWellTested) {
    notes.unshift(`✅ This is a well-tested, production-ready stack combination`);
  } else if (validation.testedCombination?.confidence && validation.testedCombination.confidence > 0.3) {
    notes.unshift(`⚠️ This combination is experimental. Consider a tested stack for production`);
  }
  
  // Technology-specific setup notes
  if (state.auth === 'auth0') {
    notes.push('Configure Auth0 domain and client ID in environment variables');
  }
  
  if (state.auth === 'better-auth') {
    notes.push('Configure Better Auth providers and database URL');
  }
  
  if (state.addons.includes('docker')) {
    notes.push('Docker compose file included for development environment');
  }
  
  if (state.addons.includes('turborepo')) {
    notes.push('Turborepo workspace configured for monorepo development');
  }
  
  return {
    title: `Setup Instructions for ${state.projectName}`,
    steps,
    notes
  };
}

// Check if current configuration requires manual setup steps
export function requiresManualSetup(state: BuilderState): {
  hasManualSteps: boolean;
  steps: string[];
} {
  const manualSteps: string[] = [];
  
  if (!state.installDependencies) {
    manualSteps.push('Install dependencies manually');
  }
  
  if (!state.initializeGit) {
    manualSteps.push('Initialize git repository');
  }
  
  if (state.database === 'postgres' || state.database === 'mysql') {
    manualSteps.push('Set up and configure database server');
  }
  
  if (state.auth === 'auth0') {
    manualSteps.push('Configure Auth0 credentials and environment variables');
  }
  
  if (state.auth === 'better-auth') {
    manualSteps.push('Configure Better Auth providers and settings');
  }
  
  if (state.addons.includes('docker')) {
    manualSteps.push('Build and run Docker containers');
  }
  
  if (state.addons.includes('turborepo')) {
    manualSteps.push('Configure turborepo workspace settings');
  }
  
  return {
    hasManualSteps: manualSteps.length > 0,
    steps: manualSteps
  };
}