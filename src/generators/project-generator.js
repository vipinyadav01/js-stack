import path from "path";
import chalk from "chalk";
import { createModernSpinner } from "../utils/modern-render.js";
import {
  ensureDir,
  directoryExists,
  copyTemplates,
  mergePackageJson,
  writeJson,
  getTemplateDir,
} from "../utils/file-utils.js";
import { initGitRepo } from "../utils/git.js";
import { installDependencies } from "../utils/package-manager.js";
import { generateBackend } from "./backend-generator.js";
import { generateFrontend } from "./frontend-generator.js";
import { generateDatabase } from "./database-generator.js";
import { generateAuth } from "./auth-generator.js";
import { generateAddons } from "./addon-generator.js";

/**
 * Create a new project
 */
export async function createProject(config, progress = null) {
  let spinner = null;

  try {
    // Check if directory already exists
    if (await directoryExists(config.projectDir)) {
      throw new Error(`Directory ${config.projectName} already exists`);
    }

    // Step 1: Create project structure
    if (progress) await progress.nextStep("Creating directories");
    else spinner = createModernSpinner("Creating project structure...");

    await ensureDir(config.projectDir);

    // Create base package.json
    const basePackageJson = {
      name: config.projectName,
      version: "1.0.0",
      description: "A JavaScript full-stack project",
      main: "index.js",
      scripts: {},
      keywords: [],
      author: "",
      license: "MIT",
      dependencies: {},
      devDependencies: {},
    };

    await writeJson(
      path.join(config.projectDir, "package.json"),
      basePackageJson,
    );
    if (spinner) spinner.success();

    // Step 2: Generate backend
    if (config.backend !== "none") {
      if (progress) await progress.nextStep(`Setting up ${config.backend}`);
      else {
        spinner = createModernSpinner("Generating backend...");
      }
      await generateBackend(config);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping backend");
    }

    // Step 3: Generate frontend
    if (config.frontend[0] !== "none") {
      if (progress)
        await progress.nextStep(`Configuring ${config.frontend.join(", ")}`);
      else {
        spinner = createModernSpinner("Generating frontend...");
      }
      await generateFrontend(config);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping frontend");
    }

    // Step 4: Generate database
    if (config.database !== "none") {
      if (progress) await progress.nextStep(`Configuring ${config.database}`);
      else {
        spinner = createModernSpinner("Setting up database...");
      }
      await generateDatabase(config);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping database");
    }

    // Step 5: Generate authentication
    if (config.auth !== "none") {
      if (progress)
        await progress.nextStep(`Adding ${config.auth} authentication`);
      else {
        spinner = createModernSpinner("Setting up authentication...");
      }
      await generateAuth(config);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping authentication");
    }

    // Step 6: Generate addons
    if (config.addons.length > 0) {
      if (progress)
        await progress.nextStep(`Adding ${config.addons.length} tools`);
      else {
        spinner = createModernSpinner("Adding development tools...");
      }
      await generateAddons(config);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping additional tools");
    }

    // Create README
    await createReadme(config);

    // Step 7: Install dependencies
    if (config.install) {
      if (progress)
        await progress.nextStep(`Installing with ${config.packageManager}`);
      else {
        spinner = createModernSpinner("Installing dependencies...");
      }
      await installDependencies(config.projectDir, config.packageManager);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping dependency installation");
    }

    // Step 8: Initialize git
    if (config.git) {
      if (progress) await progress.nextStep("Initializing git repository");
      else {
        spinner = createModernSpinner("Initializing git...");
      }
      await initGitRepo(config.projectDir);
      if (spinner) spinner.success();
    } else if (progress) {
      await progress.nextStep("Skipping git initialization");
    }

    // Complete progress
    if (progress) {
      progress.complete();
    }
  } catch (error) {
    if (spinner) spinner.error();
    throw error;
  }
}

/**
 * Create README file
 */
async function createReadme(config) {
  const readmeContent = `# ${config.projectName}

## Description
A JavaScript full-stack project generated with create-js-stack.

## Project Configuration
- **Database**: ${config.database}
- **ORM**: ${config.orm}
- **Backend**: ${config.backend}
- **Frontend**: ${config.frontend.join(", ")}
- **Authentication**: ${config.auth}
- **Package Manager**: ${config.packageManager}

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- ${config.packageManager}

### Installation
\`\`\`bash
${config.packageManager === "npm" ? "npm install" : config.packageManager + " install"}
\`\`\`

### Development
\`\`\`bash
${config.packageManager === "npm" ? "npm run dev" : config.packageManager + " dev"}
\`\`\`

### Build
\`\`\`bash
${config.packageManager === "npm" ? "npm run build" : config.packageManager + " build"}
\`\`\`

## Project Structure
\`\`\`
${config.projectName}/
├── package.json
${config.backend !== "none" ? "├── backend/\n│   └── server.js" : ""}
${config.frontend[0] !== "none" ? "├── frontend/\n│   └── src/\n│       └── App.js" : ""}
${config.database !== "none" ? "├── database/\n│   └── config.js" : ""}
└── README.md
\`\`\`

## License
MIT
`;

  await writeJson(
    path.join(config.projectDir, "README.md"),
    readmeContent,
    { spaces: 0 }, // Write as plain text
  );
}

export default { createProject };
