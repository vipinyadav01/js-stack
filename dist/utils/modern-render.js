import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import Table from "cli-table3";
import terminalLink from "terminal-link";
import { createSpinner } from "nanospinner";
import chalkAnimation from "chalk-animation";
import ora from "ora";

// Modern color palette with hex colors
const modernColors = {
  primary: "#6366f1", // Indigo
  secondary: "#14b8a6", // Teal
  accent: "#f59e0b", // Amber
  success: "#10b981", // Emerald
  warning: "#f59e0b", // Amber
  error: "#ef4444", // Red
  info: "#3b82f6", // Blue
  muted: "#6b7280", // Gray-500
  dark: "#111827", // Gray-900
  light: "#f9fafb", // Gray-50
  border: "#374151", // Gray-700
  background: "#1f2937", // Gray-800
};

// Legacy chalk colors for compatibility
const colors = {
  primary: chalk.hex(modernColors.primary).bold,
  secondary: chalk.hex(modernColors.secondary),
  success: chalk.hex(modernColors.success).bold,
  warning: chalk.hex(modernColors.warning).bold,
  error: chalk.hex(modernColors.error).bold,
  info: chalk.hex(modernColors.info).bold,
  muted: chalk.hex(modernColors.muted),
  accent: chalk.hex(modernColors.accent).bold,
  white: chalk.white.bold,
};

// Modern icon set with semantic meaning
const modernIcons = {
  // Status
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  loading: "⏳",

  // Actions
  rocket: "🚀",
  sparkles: "✨",
  magic: "🪄",
  target: "🎯",
  fire: "🔥",
  lightning: "⚡",

  // Tech
  gear: "⚙️",
  package: "📦",
  folder: "📁",
  file: "📄",
  database: "🗄️",
  shield: "🛡️",
  paint: "🎨",
  test: "🧪",
  docker: "🐳",

  // UI
  arrow: "→",
  check: "✓",
  cross: "✗",
  bullet: "•",
  diamond: "◆",
  star: "⭐",
  heart: "❤️",
  crown: "👑",
  crystal: "💎",

  // Misc
  book: "📚",
  link: "🔗",
  search: "🔍",
  bulb: "💡",
  party: "🎉",
  trophy: "🏆",
  medal: "🏅",
};

/**
 * Ultra-modern animated banner with ASCII art and gradients
 */
export async function displayBanner() {
  // Minimal, accessible output in CI or non-TTY environments
  const isCI = Boolean(process.env.CI) || !process.stdout.isTTY;
  if (isCI) {
    console.log(chalk.hex(modernColors.primary).bold("JS Stack"));
    console.log(
      chalk.hex(modernColors.muted)(
        "Next-Generation JavaScript Project Generator",
      ),
    );
    console.log();
    return;
  }

  console.clear();
  let title = "JS Stack";
  try {
    title = figlet.textSync("JS Stack", {
      font: "ANSI Shadow",
      horizontalLayout: "fitted",
      width: 100,
    });
  } catch {
    // Fallback to plain title
  }

  const gradientTitle = gradient([
    modernColors.primary,
    modernColors.secondary,
    modernColors.accent,
    modernColors.success,
  ]);

  console.log(gradientTitle(title));
  console.log();

  const subtitle = `${modernIcons.magic} Next-Generation JavaScript Project Generator ${modernIcons.magic}`;
  console.log(chalk.hex(modernColors.light).bold(`    ${subtitle}`));
  console.log();

  const features = [
    `${modernIcons.lightning} Lightning Fast Setup`,
    `${modernIcons.crystal} Production Ready`,
    `${modernIcons.shield} Best Practices Built-in`,
    `${modernIcons.rocket} Deploy Anywhere`,
  ];

  const featureBox = boxen(features.join("  |  "), {
    padding: { top: 1, bottom: 1, left: 3, right: 3 },
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
    backgroundColor: modernColors.dark,
    title: `${modernIcons.star} Why Choose JS Stack?`,
    titleAlignment: "center",
  });

  console.log(
    gradient([modernColors.info, modernColors.secondary])(featureBox),
  );
}

/**
 * Modern loading spinner with customizable messages
 */
export function createModernLoader(text, options = {}) {
  const {
    spinner = "dots12",
    color = "cyan",
    successText = null,
    failText = null,
  } = options;

  return ora({
    text: ` ${text}`,
    spinner,
    color,
    stream: process.stdout,
    hideCursor: true,
  });
}

/**
 * Advanced progress bar with steps and animations
 */
export function createAdvancedProgress(steps) {
  let currentStep = 0;
  const totalSteps = steps.length;

  const renderProgressBar = (current, total, width = 40) => {
    const progress = current / total;
    const filled = Math.round(progress * width);
    const empty = width - filled;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    const percentage = Math.round(progress * 100);

    return `${chalk.hex(modernColors.primary)(bar)} ${chalk.hex(modernColors.accent).bold(`${percentage}%`)}`;
  };

  return {
    start: () => {
      console.log(
        `\n${modernIcons.rocket} ${chalk.hex(modernColors.info).bold("Starting project creation...")}`,
      );
      console.log();
    },

    next: async (customMessage) => {
      if (currentStep < totalSteps) {
        const step = steps[currentStep];
        const progress = renderProgressBar(currentStep + 1, totalSteps);

        console.log(`${progress}`);
        console.log(
          `${modernIcons.arrow} ${step.icon} ${chalk.hex(modernColors.light).bold(step.title)}`,
        );

        if (customMessage || step.description) {
          console.log(
            `   ${chalk.hex(modernColors.muted)(customMessage || step.description)}`,
          );
        }

        console.log();
        currentStep++;

        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    },

    complete: async () => {
      const progress = renderProgressBar(totalSteps, totalSteps);
      console.log(`${progress}`);
      console.log(
        `${modernIcons.success} ${chalk.hex(modernColors.success).bold("All steps completed successfully!")}`,
      );
      console.log();

      // Celebration animation
      const celebration = chalkAnimation.rainbow("🎉 Project Created! 🎉");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      celebration.stop();
      console.log();
    },

    fail: (error) => {
      console.log(
        `${modernIcons.error} ${chalk.hex(modernColors.error).bold("Process failed:")} ${error}`,
      );
      console.log();
    },
  };
}

/**
 * Display welcome message with animation
 */
export async function displayWelcome() {
  console.log(colors.white("╔════════════════════════════════════════╗"));
  console.log(
    colors.white("║") +
      colors.primary("     Welcome to JS Stack Generator     ") +
      colors.white("║"),
  );
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

  const safeFrontend = Array.isArray(config.frontend) ? config.frontend : [];
  const frontendLabel =
    safeFrontend.length > 0 ? safeFrontend.join(", ") : "none";
  const frontendIcon =
    safeFrontend.length > 0
      ? getIconForFrontend(safeFrontend[0])
      : getIconForFrontend("none");
  const addonsLabel =
    Array.isArray(config.addons) && config.addons.length > 0
      ? config.addons.join(", ")
      : "none";

  const rows = [];
  rows.push(["📦 Project", chalk.yellow(String(config.projectName || ""))]);
  rows.push([
    "💾 Database",
    `${getIconForDatabase(config.database)} ${chalk.green(config.database || "none")}`,
  ]);
  rows.push(["🔧 ORM", chalk.blue(config.orm || "none")]);
  rows.push([
    "⚙️  Backend",
    `${getIconForBackend(config.backend)} ${chalk.magenta(config.backend || "none")}`,
  ]);
  rows.push(["🎨 Frontend", `${frontendIcon} ${chalk.cyan(frontendLabel)}`]);
  rows.push(["🔐 Auth", chalk.red(config.auth || "none")]);
  rows.push([
    "📦 Package Manager",
    chalk.white(config.packageManager || "npm"),
  ]);
  rows.push([
    "🛠️  Addons",
    addonsLabel !== "none" ? chalk.gray(addonsLabel) : chalk.dim("none"),
  ]);

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
      text: `Documentation: ${terminalLink("View Docs", "https://github.com/vipinyadav01/js-stack#readme")}`,
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
      top: "─",
      "top-mid": "┬",
      "top-left": "┌",
      "top-right": "┐",
      bottom: "─",
      "bottom-mid": "┴",
      "bottom-left": "└",
      "bottom-right": "┘",
      left: "│",
      "left-mid": "├",
      mid: "─",
      "mid-mid": "┼",
      right: "│",
      "right-mid": "┤",
      middle: "│",
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
