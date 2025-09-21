import inquirer from "inquirer";
import {
  createGhostMenu,
  createGhostConfirm,
  createGhostInput,
  createGhostSpinner,
  showGhostSuccess,
  showGhostError,
  showGhostWarning,
  showGhostInfo,
  ghostColors,
  ghostIcons,
} from "./terminal-ui.js";

/**
 * Enhanced interactive prompts with ghost theme
 */

/**
 * Create project name prompt
 */
export async function promptProjectName(defaultName = "my-awesome-app") {
  const result = await createGhostInput(
    "What's your project name?",
    defaultName
  );
  
  if (!result.value || result.value.trim() === "") {
    showGhostWarning("Project name cannot be empty, using default name");
    return defaultName;
  }
  
  return result.value.trim();
}

/**
 * Create backend framework selection prompt
 */
export async function promptBackendFramework() {
  const options = [
    { name: "Express.js - Fast, minimalist web framework", value: "express", icon: ghostIcons.rocket },
    { name: "Fastify - High-performance, low-overhead framework", value: "fastify", icon: ghostIcons.lightning },
    { name: "Koa.js - Lightweight, expressive middleware framework", value: "koa", icon: ghostIcons.gear },
    { name: "Hapi.js - Rich ecosystem with built-in validation", value: "hapi", icon: ghostIcons.shield },
    { name: "NestJS - Scalable Node.js framework with TypeScript", value: "nestjs", icon: ghostIcons.crystal },
    { name: "None - No backend", value: "none", icon: ghostIcons.cross },
  ];
  
  const result = await createGhostMenu("Choose your backend framework:", options);
  return result.choice;
}

/**
 * Create frontend framework selection prompt
 */
export async function promptFrontendFramework() {
  const options = [
    { name: "React - With Vite, TypeScript, and modern tooling", value: "react", icon: ghostIcons.paint },
    { name: "Vue.js - Vue 3 with Composition API and Vite", value: "vue", icon: ghostIcons.sparkles },
    { name: "Angular - Latest Angular with CLI integration", value: "angular", icon: ghostIcons.gear },
    { name: "Svelte - SvelteKit with optimized builds", value: "svelte", icon: ghostIcons.lightning },
    { name: "Next.js - Full-stack React framework", value: "nextjs", icon: ghostIcons.rocket },
    { name: "Nuxt - Vue.js full-stack framework", value: "nuxt", icon: ghostIcons.crystal },
    { name: "React Native - Mobile app development", value: "react-native", icon: ghostIcons.mobile },
    { name: "None - No frontend", value: "none", icon: ghostIcons.cross },
  ];
  
  const result = await createGhostMenu("Choose your frontend framework:", options);
  return result.choice;
}

/**
 * Create database selection prompt
 */
export async function promptDatabase() {
  const options = [
    { name: "SQLite - Lightweight, serverless database", value: "sqlite", icon: ghostIcons.database },
    { name: "PostgreSQL - Advanced open-source database", value: "postgres", icon: ghostIcons.database },
    { name: "MySQL - Popular relational database", value: "mysql", icon: ghostIcons.database },
    { name: "MongoDB - NoSQL document database", value: "mongodb", icon: ghostIcons.database },
    { name: "None - No database", value: "none", icon: ghostIcons.cross },
  ];
  
  const result = await createGhostMenu("Choose your database:", options);
  return result.choice;
}

/**
 * Create ORM selection prompt
 */
export async function promptORM(database) {
  if (database === "none") return "none";
  
  const options = [
    { name: "Prisma - Next-generation ORM with type safety", value: "prisma", icon: ghostIcons.shield },
    { name: "Sequelize - Feature-rich ORM for SQL databases", value: "sequelize", icon: ghostIcons.gear },
    { name: "Mongoose - Elegant MongoDB object modeling", value: "mongoose", icon: ghostIcons.database },
    { name: "TypeORM - Advanced ORM with decorator support", value: "typeorm", icon: ghostIcons.crystal },
    { name: "None - No ORM", value: "none", icon: ghostIcons.cross },
  ];
  
  const result = await createGhostMenu("Choose your ORM/ODM:", options);
  return result.choice;
}

/**
 * Create authentication selection prompt
 */
export async function promptAuthentication() {
  const options = [
    { name: "JWT - JSON Web Token implementation", value: "jwt", icon: ghostIcons.key },
    { name: "Passport - Flexible authentication middleware", value: "passport", icon: ghostIcons.shield },
    { name: "Auth0 - Identity platform integration", value: "auth0", icon: ghostIcons.lock },
    { name: "None - No authentication", value: "none", icon: ghostIcons.cross },
  ];
  
  const result = await createGhostMenu("Choose your authentication method:", options);
  return result.choice;
}

/**
 * Create addons selection prompt
 */
export async function promptAddons() {
  const options = [
    { name: "TypeScript - Full TypeScript support", value: "typescript", icon: ghostIcons.code },
    { name: "ESLint - Code linting and quality", value: "eslint", icon: ghostIcons.gear },
    { name: "Prettier - Code formatting", value: "prettier", icon: ghostIcons.paint },
    { name: "Husky - Git hooks for code quality", value: "husky", icon: ghostIcons.shield },
    { name: "Docker - Containerization support", value: "docker", icon: ghostIcons.terminal },
    { name: "GitHub Actions - CI/CD workflows", value: "github-actions", icon: ghostIcons.rocket },
    { name: "Testing - Jest, Vitest configurations", value: "testing", icon: ghostIcons.test },
    { name: "Tailwind CSS - Utility-first CSS framework", value: "tailwind", icon: ghostIcons.paint },
    { name: "Turborepo - Monorepo with workspace management", value: "turborepo", icon: ghostIcons.package },
    { name: "Redis - Caching and session storage", value: "redis", icon: ghostIcons.database },
    { name: "Socket.IO - Real-time communication", value: "socketio", icon: ghostIcons.lightning },
  ];
  
  const result = await inquirer.prompt([
    {
      type: "checkbox",
      name: "addons",
      message: `${ghostIcons.ghost} ${ghostColors.ghost("Select additional features:")}`,
      choices: options.map(option => ({
        name: `${option.icon} ${option.name}`,
        value: option.value,
        checked: false,
      })),
      prefix: ghostIcons.ghost,
      suffix: ghostColors.muted("(Use space to select, Enter to confirm)"),
    },
  ]);
  
  return result.addons || [];
}

/**
 * Create package manager selection prompt
 */
export async function promptPackageManager() {
  const options = [
    { name: "npm - Node.js default package manager", value: "npm", icon: ghostIcons.package },
    { name: "yarn - Fast, reliable dependency management", value: "yarn", icon: ghostIcons.rocket },
    { name: "pnpm - Efficient disk space usage", value: "pnpm", icon: ghostIcons.lightning },
    { name: "bun - All-in-one JavaScript runtime", value: "bun", icon: ghostIcons.zap },
  ];
  
  const result = await createGhostMenu("Choose your package manager:", options);
  return result.choice;
}

/**
 * Create confirmation prompt for project creation
 */
export async function promptProjectConfirmation(config) {
  console.log();
  console.log(ghostColors.ghost("🎯 Project Configuration Summary:"));
  console.log(ghostColors.terminal("┌─────────────────────────────────────────────────────────────┐"));
  
  const configItems = [
    { label: "Project Name", value: config.projectName },
    { label: "Backend", value: config.backend },
    { label: "Frontend", value: config.frontend },
    { label: "Database", value: config.database },
    { label: "ORM", value: config.orm },
    { label: "Authentication", value: config.auth },
    { label: "Addons", value: config.addons?.join(", ") || "None" },
    { label: "Package Manager", value: config.packageManager },
  ];
  
  configItems.forEach(item => {
    console.log(ghostColors.terminal("│") + 
      ` ${ghostColors.primary(item.label.padEnd(20))} ${ghostColors.muted(item.value.padEnd(30))}` + 
      ghostColors.terminal("│"));
  });
  
  console.log(ghostColors.terminal("└─────────────────────────────────────────────────────────────┘"));
  console.log();
  
  const result = await createGhostConfirm("Create this project?", true);
  return result.confirmed;
}

/**
 * Create interactive project setup flow
 */
export async function createInteractiveProjectSetup() {
  const config = {};
  
  // Project name
  config.projectName = await promptProjectName();
  
  // Backend framework
  config.backend = await promptBackendFramework();
  
  // Frontend framework
  config.frontend = await promptFrontendFramework();
  
  // Database
  config.database = await promptDatabase();
  
  // ORM
  config.orm = await promptORM(config.database);
  
  // Authentication
  config.auth = await promptAuthentication();
  
  // Addons
  config.addons = await promptAddons();
  
  // Package manager
  config.packageManager = await promptPackageManager();
  
  // Confirmation
  const confirmed = await promptProjectConfirmation(config);
  
  if (!confirmed) {
    showGhostWarning("Project creation cancelled by user");
    process.exit(0);
  }
  
  return config;
}

/**
 * Create preset selection prompt
 */
export async function promptPresetSelection() {
  const presets = [
    { name: "Full-Stack React + Express", value: "fullstack-react", icon: ghostIcons.rocket },
    { name: "Vue.js + NestJS Enterprise", value: "vue-nestjs", icon: ghostIcons.crystal },
    { name: "Next.js Full-Stack", value: "nextjs-fullstack", icon: ghostIcons.lightning },
    { name: "Mobile + Backend", value: "mobile-backend", icon: ghostIcons.mobile },
    { name: "Monorepo with Turborepo", value: "monorepo", icon: ghostIcons.package },
    { name: "Custom Setup", value: "custom", icon: ghostIcons.gear },
  ];
  
  const result = await createGhostMenu("Choose a preset or create custom setup:", presets);
  return result.choice;
}

export default {
  promptProjectName,
  promptBackendFramework,
  promptFrontendFramework,
  promptDatabase,
  promptORM,
  promptAuthentication,
  promptAddons,
  promptPackageManager,
  promptProjectConfirmation,
  createInteractiveProjectSetup,
  promptPresetSelection,
};
