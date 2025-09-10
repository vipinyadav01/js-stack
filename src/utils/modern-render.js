import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import Table from "cli-table3";
import terminalLink from "terminal-link";
import { createSpinner } from "nanospinner";
import chalkAnimation from "chalk-animation";

// Clean color scheme
const colors = {
  primary: chalk.blue.bold,
  secondary: chalk.gray,
  success: chalk.green.bold,
  warning: chalk.yellow.bold,
  error: chalk.red.bold,
  muted: chalk.gray,
  accent: chalk.cyan.bold,
  white: chalk.white.bold,
};

/**
 * Display animated banner
 */
export async function displayBanner() {
  console.clear();

  // Clean banner design
  console.log(colors.white("╭─────────────────────────────────────────────────────────╮"));
  console.log(colors.white("│") + colors.primary("  🚀 JS Stack Generator") + colors.white("                                    │"));
  console.log(colors.white("│") + colors.secondary("  Modern JavaScript Project Scaffolding Tool") + colors.white("        │"));
  console.log(colors.white("╰─────────────────────────────────────────────────────────╯"));
  console.log();

  // Welcome message
  console.log(
    boxen(
      colors.accent("Build full-stack JavaScript applications with ease!\n") +
        colors.muted("Choose your stack • Generate instantly • Start coding"),
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

/**
 * Display welcome message with animation
 */
export async function displayWelcome() {
  console.log(colors.white("╔════════════════════════════════════════╗"));
  console.log(colors.white("║") + colors.primary("     Welcome to JS Stack Generator     ") + colors.white("║"));
  console.log(colors.white("╚════════════════════════════════════════╝"));
  console.log();
  console.log(colors.accent("Let's create something amazing! 🚀"));
  console.log();
}

/**
 * Display configuration in a beautiful table
 */
export function displayConfigTable(config) {
  console.log();
  console.log(colors.primary("╭─ Your Configuration"));
  console.log(colors.secondary("│  Review your project setup"));
  console.log(colors.primary("╰─────────────────────────────────────"));
  console.log();

  const table = new Table({
    head: [colors.accent("Category"), colors.accent("Selection")],
    style: {
      head: [],
      border: ["blue"],
      "padding-left": 2,
      "padding-right": 2,
    },
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│",
    },
  });

  // Add configuration rows with icons
  const rows = [
    ["📦 Project", chalk.yellow(config.projectName)],
    [
      "💾 Database",
      getIconForDatabase(config.database) + " " + chalk.green(config.database),
    ],
    ["🔧 ORM", chalk.blue(config.orm)],
    [
      "⚙️  Backend",
      getIconForBackend(config.backend) + " " + chalk.magenta(config.backend),
    ],
    [
      "🎨 Frontend",
      getIconForFrontend(config.frontend[0]) +
        " " +
        chalk.cyan(config.frontend.join(", ")),
    ],
    ["🔐 Auth", chalk.red(config.auth)],
    ["📦 Package Manager", chalk.white(config.packageManager)],
    [
      "🛠️  Addons",
      config.addons.length > 0
        ? chalk.gray(config.addons.join(", "))
        : chalk.dim("none"),
    ],
  ];

  rows.forEach((row) => table.push(row));
  console.log(table.toString());
  console.log();
}

/**
 * Display step progress with animation
 */
export function createStepProgress(steps) {
  let currentStep = 0;
  const totalSteps = steps.length;

  return {
    nextStep: async (message) => {
      if (currentStep < totalSteps) {
        const step = steps[currentStep];
        const progress = `[${currentStep + 1}/${totalSteps}]`;

        console.log();
        console.log(
          chalk.dim(progress) +
            " " +
            colors.warning(step.icon + " " + step.title),
        );

        if (message) {
          console.log(chalk.gray("  └─ " + message));
        }

        currentStep++;
      }
    },
    complete: () => {
      console.log();
      console.log(colors.success("✅ All steps completed!"));
    },
  };
}

/**
 * Create modern spinner
 */
export function createModernSpinner(text) {
  return createSpinner(text, {
    color: "cyan",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    },
  });
}

/**
 * Display success message with celebration
 */
export async function displaySuccess(projectName, projectPath) {
  console.log();

  // Success banner
  const successBox = boxen(
    colors.success("🎉 PROJECT CREATED SUCCESSFULLY! 🎉\n\n") +
      colors.white(`Project: ${colors.accent(projectName)}\n`) +
      colors.white(`Location: ${colors.muted(projectPath)}`),
    {
      padding: 2,
      margin: 1,
      borderStyle: "double",
      borderColor: "green",
      backgroundColor: "#0d1117",
    },
  );

  console.log(successBox);
  console.log(colors.accent("🚀 Ready to build amazing things! 🚀"));
  console.log();
}

/**
 * Display next steps with links
 */
export function displayNextSteps(config) {
  console.log(colors.accent("📚 Next Steps:"));
  console.log();

  const steps = [
    {
      icon: "📁",
      text: `Navigate to project: ${chalk.cyan(`cd ${config.projectName}`)}`,
    },
    {
      icon: "📦",
      text: config.install
        ? "Dependencies already installed!"
        : `Install dependencies: ${chalk.cyan(`${config.packageManager} install`)}`,
    },
    {
      icon: "🚀",
      text: `Start development: ${chalk.cyan(`${config.packageManager} ${config.packageManager === "npm" ? "run " : ""}dev`)}`,
    },
    {
      icon: "📖",
      text: `Documentation: ${terminalLink("View Docs", "https://github.com/vipinyadav01/create-js-stack-cli#readme")}`,
    },
  ];

  steps.forEach((step, index) => {
    console.log(`  ${chalk.dim(`${index + 1}.`)} ${step.icon}  ${step.text}`);
  });

  console.log();
}

/**
 * Display error with style
 */
export function displayError(error, context) {
  console.log();
  console.log(
    boxen(
      chalk.red.bold("❌ ERROR OCCURRED\n\n") +
        chalk.white(`Context: ${context}\n`) +
        chalk.gray(`Message: ${error.message}\n\n`) +
        chalk.dim("Please check the error details above and try again."),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "red",
        backgroundColor: "#1a0000",
      },
    ),
  );
  console.log();
}

/**
 * Display available options in a grid
 */
export function displayOptionsGrid(title, options) {
  console.log();
  console.log(colors.primary(title));
  console.log();

  const table = new Table({
    style: {
      border: ["cyan"],
      "padding-left": 1,
      "padding-right": 1,
    },
    chars: {
      mid: "",
      "left-mid": "",
      "mid-mid": "",
      "right-mid": "",
    },
  });

  // Create grid layout (3 columns)
  const columns = 3;
  const rows = [];
  let currentRow = [];

  Object.entries(options).forEach(([key, value], index) => {
    const formattedOption = `${value.icon || "•"} ${chalk.bold(key)}\n  ${chalk.dim(value.description || value)}`;
    currentRow.push(formattedOption);

    if (
      (index + 1) % columns === 0 ||
      index === Object.entries(options).length - 1
    ) {
      // Fill empty cells if needed
      while (currentRow.length < columns) {
        currentRow.push("");
      }
      rows.push(currentRow);
      currentRow = [];
    }
  });

  rows.forEach((row) => table.push(row));
  console.log(table.toString());
  console.log();
}

// Helper functions
function getIconForDatabase(db) {
  const icons = {
    sqlite: "💾",
    postgres: "🐘",
    mysql: "🐬",
    mongodb: "🍃",
    none: "❌",
  };
  return icons[db] || "📊";
}

function getIconForBackend(backend) {
  const icons = {
    express: "🚂",
    fastify: "⚡",
    koa: "🌊",
    hapi: "🎪",
    nestjs: "🦁",
    none: "❌",
  };
  return icons[backend] || "⚙️";
}

function getIconForFrontend(frontend) {
  const icons = {
    react: "⚛️",
    vue: "💚",
    angular: "🅰️",
    svelte: "🔥",
    nextjs: "▲",
    nuxt: "💚",
    "react-native": "📱",
    none: "❌",
  };
  return icons[frontend] || "🎨";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  displayBanner,
  displayWelcome,
  displayConfigTable,
  createStepProgress,
  createModernSpinner,
  displaySuccess,
  displayNextSteps,
  displayError,
  displayOptionsGrid,
};
