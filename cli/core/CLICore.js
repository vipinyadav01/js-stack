/**
 * Unified CLI Core System
 * Centralizes common functionality, reduces duplication, and provides robust error handling
 */

import chalk from "chalk";
import boxen from "boxen";
import gradient from "gradient-string";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// Unified color and icon system
export const UI = {
  colors: {
    primary: chalk.blue.bold,
    secondary: chalk.cyan,
    accent: chalk.yellow.bold,
    success: chalk.green.bold,
    warning: chalk.yellow.bold,
    error: chalk.red.bold,
    info: chalk.blue,
    muted: chalk.gray,
    dim: chalk.gray.dim,
    bg: "black",
    text: chalk.white,
  },

  icons: {
    rocket: "🚀",
    sparkles: "✨",
    gear: "⚙️",
    package: "📦",
    database: "🗄️",
    shield: "🛡️",
    paint: "🎨",
    test: "🧪",
    lightning: "⚡",
    check: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
    bulb: "💡",
    target: "🎯",
    book: "📚",
    link: "🔗",
    search: "🔍",
    heart: "❤️",
    star: "⭐",
    crystal: "💎",
    lock: "🔒",
    terminal: "🖥️",
    fire: "🔥",
    cross: "❌",
    file: "📄",
  },

  // Unified logging methods
  log: {
    success: (message, details = "") => {
      console.log(chalk.green.bold(`✅ ${message}`));
      if (details) console.log(chalk.gray(`   ${details}`));
    },

    error: (message, details = "") => {
      console.log(chalk.red.bold(`❌ ${message}`));
      if (details) console.log(chalk.gray(`   ${details}`));
    },

    warning: (message, details = "") => {
      console.log(chalk.yellow.bold(`⚠️ ${message}`));
      if (details) console.log(chalk.gray(`   ${details}`));
    },

    info: (message, details = "") => {
      console.log(chalk.blue.bold(`ℹ️ ${message}`));
      if (details) console.log(chalk.gray(`   ${details}`));
    },

    step: (message, step = "", total = "") => {
      const stepText = step && total ? ` (${step}/${total})` : "";
      console.log(chalk.cyan.bold(`🔄 ${message}${stepText}`));
    },

    muted: (message) => {
      console.log(chalk.gray(message));
    },
  },

  // Unified box creation
  createBox: (content, options = {}) => {
    const defaultOptions = {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "blue",
      backgroundColor: "black",
    };

    return boxen(content, { ...defaultOptions, ...options });
  },

  // Unified gradient creation
  createGradient: (colors, text) => {
    const g = gradient(colors);
    return g(text);
  },
};

// Package.json reader
export function getPackageInfo() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return JSON.parse(
    readFileSync(join(__dirname, "../../package.json"), "utf-8"),
  );
}

// Enhanced error handling
export class CLIError extends Error {
  constructor(message, code = "CLI_ERROR", suggestions = []) {
    super(message);
    this.name = "CLIError";
    this.code = code;
    this.suggestions = suggestions;
  }
}

// Unified error handler
export function handleError(error, context = {}) {
  console.log();

  if (error instanceof CLIError) {
    UI.log.error(error.message);
    if (error.suggestions.length > 0) {
      console.log();
      UI.log.info("Suggestions:");
      error.suggestions.forEach((suggestion) => {
        console.log(UI.colors.muted(`  • ${suggestion}`));
      });
    }
  } else {
    UI.log.error("An unexpected error occurred", error.message);

    if (context.verbose && error.stack) {
      console.log();
      UI.log.muted("Stack trace:");
      console.log(UI.colors.dim(error.stack));
    }
  }

  console.log();

  // Show helpful tips
  const tips = [
    "Check your Node.js version (requires 18+)",
    "Try running with --verbose for more details",
    "Report issues: https://github.com/vipinyadav01/js-stack/issues",
  ];

  UI.log.info("Troubleshooting Tips");
  tips.forEach((tip) => console.log(UI.colors.muted(`  • ${tip}`)));

  process.exit(1);
}

// System information
export function getSystemInfo() {
  const platform = process.platform;
  const platformIcons = {
    win32: "🪟",
    darwin: "🍎",
    linux: "🐧",
    freebsd: "👹",
    openbsd: "🐡",
    sunos: "☀️",
    aix: "🔵",
  };

  const used = process.memoryUsage();
  const memoryUsage = Math.round((used.heapUsed / 1024 / 1024) * 100) / 100;

  return {
    platform: platformIcons[platform] || "💻",
    nodeVersion: process.version,
    memoryUsage: `${memoryUsage}MB`,
    workingDirectory: process.cwd(),
  };
}

// Progress tracking
export class ProgressTracker {
  constructor(totalSteps, title = "Progress") {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.title = title;
    this.startTime = Date.now();
  }

  nextStep(message) {
    this.currentStep++;
    const percentage = Math.round((this.currentStep / this.totalSteps) * 100);
    const progress =
      "█".repeat(Math.floor(percentage / 5)) +
      "░".repeat(20 - Math.floor(percentage / 5));

    console.log();
    console.log(
      UI.createBox(
        `${UI.icons.target} ${UI.colors.primary(this.title)}
${UI.colors.muted(message)}
[${progress}] ${percentage}%`,
        {
          padding: 1,
          margin: { top: 0, bottom: 0, left: 2, right: 2 },
          borderStyle: "round",
          borderColor: "cyan",
        },
      ),
    );
  }

  complete() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log();
    UI.log.success("All steps completed!", `Finished in ${duration}s`);
  }
}

// Configuration validator
export function validateConfig(config, schema) {
  const errors = [];
  const warnings = [];

  // Basic validation
  if (!config.projectName) {
    errors.push("Project name is required");
  }

  if (config.projectName && !/^[a-zA-Z0-9-_]+$/.test(config.projectName)) {
    errors.push(
      "Project name can only contain letters, numbers, hyphens, and underscores",
    );
  }

  // Add more validation logic here based on schema

  return { isValid: errors.length === 0, errors, warnings };
}
