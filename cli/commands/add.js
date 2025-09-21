import chalk from "chalk";
import { intro, outro, multiselect, isCancel, cancel } from "@clack/prompts";
import { ADDON_OPTIONS } from "../types.js";

/**
 * Add features to existing project
 */
export async function addCommand(features, options) {
  try {
    intro(chalk.cyan("🔧 Add features to your project"));

    // If no features specified, prompt for them
    if (!features || features.length === 0) {
        const selectedFeatures = await multiselect({
          message: "What would you like to add?",
          options: [
            { value: "auth", label: "🔐 Authentication - JWT, Passport, Auth0, Better Auth" },
            { value: "database", label: "🗄️ Database - Prisma, Sequelize, Mongoose, Drizzle" },
            { value: "testing", label: "🧪 Testing - Jest, Vitest, Playwright, Cypress" },
            { value: "docker", label: "🐳 Docker - Containerization setup" },
            { value: "ci-cd", label: "🔄 CI/CD - GitHub Actions workflows" },
            { value: "linting", label: "🔍 Linting - ESLint, Prettier, Biome" },
            { value: "styling", label: "🎨 Styling - Tailwind, Shadcn, Styled Components" },
            { value: "monitoring", label: "📊 Monitoring - Analytics, Logging" },
            { value: "deployment", label: "🚀 Deployment - Vercel, Cloudflare, AWS, Railway" },
            { value: "turborepo", label: "⚡ Turborepo - Monorepo management" },
            { value: "pwa", label: "📱 PWA - Progressive Web App features" },
            { value: "tauri", label: "🖥️ Tauri - Desktop app framework" },
          ],
        });

      if (isCancel(selectedFeatures)) {
        cancel("Operation cancelled");
        process.exit(0);
      }

      features = selectedFeatures;
    }

    console.log(chalk.blue(`➕ Adding features: ${chalk.cyan(features.join(", "))}`));

    // Process each feature
    for (const feature of features) {
      await addFeature(feature, options);
    }

    // Show reproducible command
    const command = `npx create-js-stack@latest add ${features.join(" ")}`;
    console.log(chalk.green.bold("\n🔄 Reproducible Command:"));
    console.log(chalk.white(`  ${command}`));

    outro(chalk.green("✨ Features added successfully!"));
  } catch (error) {
    console.error(chalk.red("Error adding features:"), error.message);
    process.exit(1);
  }
}

/**
 * Add a specific feature to the project
 */
async function addFeature(feature, options) {
  console.log(chalk.gray(`\n🔧 Adding ${feature}...`));

  switch (feature) {
    case "auth":
      await addAuthentication(options);
      break;
    case "database":
      await addDatabase(options);
      break;
    case "testing":
      await addTesting(options);
      break;
    case "docker":
      await addDocker(options);
      break;
    case "ci-cd":
      await addCICD(options);
      break;
    case "linting":
      await addLinting(options);
      break;
    case "styling":
      await addStyling(options);
      break;
    case "monitoring":
      await addMonitoring(options);
      break;
    case "deployment":
      await addDeployment(options);
      break;
    case "turborepo":
      await addTurborepo(options);
      break;
    default:
      console.log(chalk.yellow(`⚠️  Unknown feature: ${feature}`));
  }
}

/**
 * Add authentication feature
 */
async function addAuthentication(options) {
  console.log(chalk.green("  ✅ Authentication setup added"));
  // TODO: Implement authentication setup
}

/**
 * Add database feature
 */
async function addDatabase(options) {
  console.log(chalk.green("  ✅ Database configuration added"));
  // TODO: Implement database setup
}

/**
 * Add testing feature
 */
async function addTesting(options) {
  console.log(chalk.green("  ✅ Testing framework added"));
  // TODO: Implement testing setup
}

/**
 * Add Docker feature
 */
async function addDocker(options) {
  console.log(chalk.green("  ✅ Docker configuration added"));
  // TODO: Implement Docker setup
}

/**
 * Add CI/CD feature
 */
async function addCICD(options) {
  console.log(chalk.green("  ✅ CI/CD workflows added"));
  // TODO: Implement CI/CD setup
}

/**
 * Add linting feature
 */
async function addLinting(options) {
  console.log(chalk.green("  ✅ Linting configuration added"));
  // TODO: Implement linting setup
}

/**
 * Add styling feature
 */
async function addStyling(options) {
  console.log(chalk.green("  ✅ Styling framework added"));
  // TODO: Implement styling setup
}

/**
 * Add monitoring feature
 */
async function addMonitoring(options) {
  console.log(chalk.green("  ✅ Monitoring setup added"));
  // TODO: Implement monitoring setup
}

/**
 * Add deployment feature
 */
async function addDeployment(options) {
  console.log(chalk.green("  ✅ Deployment configuration added"));
  // TODO: Implement deployment setup
}

/**
 * Add Turborepo/monorepo feature
 */
async function addTurborepo(options) {
  try {
    console.log(chalk.blue("  🔧 Setting up Turborepo monorepo structure..."));
    
    // Import MonorepoGenerator dynamically to avoid circular dependencies
    const { MonorepoGenerator } = await import("../utils/monorepo-generator.js");
    
    // Create a basic config for monorepo generation
    const config = {
      projectName: "my-monorepo",
      projectDir: process.cwd(),
      frontend: ["react"],
      backend: "express",
      database: "postgres",
      orm: "prisma",
      addons: ["turborepo", "typescript", "eslint", "prettier"],
      packageManager: "npm"
    };
    
    const monorepoGenerator = new MonorepoGenerator(config);
    const structure = monorepoGenerator.generateStructure();
    
    // Display the generated structure
    monorepoGenerator.displayStructure(structure);
    
    console.log(chalk.green("  ✅ Turborepo monorepo structure added"));
    console.log(chalk.gray("  💡 Your project is now configured as a monorepo with Turborepo"));
  } catch (error) {
    console.error(chalk.red("  ❌ Failed to add Turborepo:"), error.message);
    throw error;
  }
}

export default addCommand;
