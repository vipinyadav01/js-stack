import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";
import Table from "cli-table3";
import { displayOptionsGrid } from "../utils/modern-render.js";
import {
  DATABASE_OPTIONS,
  ORM_OPTIONS,
  BACKEND_OPTIONS,
  FRONTEND_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
} from "../types.js";

/**
 * List all available options
 */
export async function listOptions() {
  console.clear();

  // Create gradient banner
  const g = gradient(["#5ee7df", "#b490ca"]);
  console.log();
  console.log(
    g.multiline(
      [
        "╔══════════════════════════════════════════╗",
        "║    JS Stack - Available Options    ║",
        "╚══════════════════════════════════════════╝",
      ].join("\n"),
    ),
  );
  console.log();

  // Databases with icons
  const databases = {
    sqlite: { icon: "💾", description: "Lightweight file-based" },
    postgres: { icon: "🐘", description: "Enterprise-ready" },
    mysql: { icon: "🐬", description: "Popular & reliable" },
    mongodb: { icon: "🍃", description: "NoSQL & flexible" },
    none: { icon: "⏭️", description: "Skip database" },
  };
  displayOptionsGrid("📦 Database Options", databases);

  // Backend frameworks with icons
  const backends = {
    express: { icon: "🚂", description: "Minimal & flexible" },
    fastify: { icon: "⚡", description: "High performance" },
    nestjs: { icon: "🦁", description: "Enterprise-grade" },
    koa: { icon: "🌊", description: "Modern & lightweight" },
    hapi: { icon: "🎪", description: "Configuration-centric" },
    none: { icon: "⏭️", description: "Skip backend" },
  };
  displayOptionsGrid("⚙️  Backend Frameworks", backends);

  // Frontend frameworks with icons
  const frontends = {
    react: { icon: "⚛️", description: "Component-based" },
    vue: { icon: "💚", description: "Progressive framework" },
    angular: { icon: "🅰️", description: "Full-featured" },
    svelte: { icon: "🔥", description: "Compile-time optimized" },
    nextjs: { icon: "▲", description: "Full-stack React" },
    nuxt: { icon: "💚", description: "Full-stack Vue" },
    "react-native": { icon: "📱", description: "Mobile apps" },
    none: { icon: "⏭️", description: "Skip frontend" },
  };
  displayOptionsGrid("🎨 Frontend Frameworks", frontends);

  // ORMs with icons
  const orms = {
    prisma: { icon: "▲", description: "Type-safe & modern" },
    sequelize: { icon: "🔷", description: "Feature-rich ORM" },
    mongoose: { icon: "🍃", description: "MongoDB modeling" },
    typeorm: { icon: "📘", description: "TypeScript-first" },
    none: { icon: "⏭️", description: "Skip ORM" },
  };
  displayOptionsGrid("🔧 ORM/ODM Options", orms);

  // Authentication with icons
  const auths = {
    jwt: { icon: "🔑", description: "Token-based" },
    passport: { icon: "🛂", description: "Multiple strategies" },
    auth0: { icon: "🔒", description: "Managed service" },
    firebase: { icon: "🔥", description: "Google Auth" },
    none: { icon: "⏭️", description: "Skip auth" },
  };
  displayOptionsGrid("🔐 Authentication", auths);

  // Development tools
  const addons = {
    eslint: { icon: "🔍", description: "Code linting" },
    prettier: { icon: "✨", description: "Code formatting" },
    husky: { icon: "🐕", description: "Git hooks" },
    docker: { icon: "🐳", description: "Containerization" },
    "github-actions": { icon: "🔄", description: "CI/CD workflows" },
    testing: { icon: "🧪", description: "Test setup" },
  };
  displayOptionsGrid("🛠️  Development Tools", addons);

  // Example command
  console.log(
    boxen(
      chalk.bold("Example Commands:\n\n") +
        chalk.gray("Interactive mode:\n") +
        chalk.cyan("  npx create-js-stack init my-app\n\n") +
        chalk.gray("With options:\n") +
        chalk.cyan("  npx create-js-stack init my-app \\\n") +
        chalk.cyan("    --backend express \\\n") +
        chalk.cyan("    --frontend react \\\n") +
        chalk.cyan("    --database postgres \\\n") +
        chalk.cyan("    --orm prisma\n\n") +
        chalk.gray("Quick setup:\n") +
        chalk.cyan("  npx create-js-stack init my-app --yes"),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        backgroundColor: "#1e1e1e",
      },
    ),
  );
  console.log();
}

export default { listOptions };
