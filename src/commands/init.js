import path from "path";
import chalk from "chalk";
import gradient from "gradient-string";
import { collectProjectConfig, outro, note } from "../prompts-modern.js";
import { createProject } from "../generators/project-generator.js";
import {
  displayConfigTable,
  displaySuccess,
  displayNextSteps,
  displayError,
  createStepProgress,
} from "../utils/modern-render.js";
import { BACKEND_OPTIONS, FRONTEND_OPTIONS } from "../types.js";

/**
 * Initialize a new project
 */
export async function initCommand(projectName, options) {
  try {
    // If --yes flag is provided, use defaults
    if (options.yes) {
      options = {
        ...options,
        database: "sqlite",
        orm: "prisma",
        backend: "express",
        frontend: ["react"],
        auth: "jwt",
        addons: ["eslint", "prettier"],
        packageManager: "npm",
        git: true,
        install: true,
      };
    }

    // Collect project configuration
    const config = await collectProjectConfig(projectName, {
      ...options,
      ci: options.yes,
    });

    // Set project directory
    config.projectDir = path.resolve(process.cwd(), config.projectName);

    // Show configuration summary
    displayConfigTable(config);

    // Create progress steps
    const steps = [
      { icon: "📁", title: "Creating project structure" },
      { icon: "⚙️", title: "Setting up backend" },
      { icon: "🎨", title: "Configuring frontend" },
      { icon: "💾", title: "Setting up database" },
      { icon: "🔐", title: "Adding authentication" },
      { icon: "🛠️", title: "Installing tools" },
      { icon: "📦", title: "Installing dependencies" },
      { icon: "🚀", title: "Finalizing project" },
    ];

    const progress = createStepProgress(steps);

    // Create the project with progress updates
    await createProject(config, progress);

    // Show success message
    await displaySuccess(config.projectName, config.projectDir);

    // Show next steps
    displayNextSteps(config);

    // Final outro
    const g = gradient(["#77a1d3", "#79cbca"]);
    outro(g("🎊 Happy coding!"));
  } catch (error) {
    console.error(chalk.red("Error creating project:"), error.message);
    process.exit(1);
  }
}

export default initCommand;
