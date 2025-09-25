import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import chalkAnimation from "chalk-animation";
import ora from "ora";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import cliProgress from "cli-progress";
import os from "os";
import process from "process";

/**
 * Modern Terminal UI Components with Ghost/Terminal Design
 * Enhanced visual elements with improved accuracy and error handling
 */

// Validated Ghost/Terminal Color Palette with proper hex values
export const ghostColors = {
  // Primary ghost colors - Matrix green theme
  ghost: chalk.hex("#00FF41").bold,
  ghostMuted: chalk.hex("#00CC33"),
  ghostDim: chalk.hex("#008822"),

  // Terminal colors - Classic green phosphor
  terminal: chalk.hex("#00FF88").bold,
  terminalMuted: chalk.hex("#00DD66"),
  terminalDim: chalk.hex("#00BB44"),

  // Accent colors - Improved contrast
  accent: chalk.hex("#FF4757").bold,
  accentMuted: chalk.hex("#FF3742"),

  // Status colors - WCAG compliant contrast ratios
  success: chalk.hex("#2ED573").bold,
  warning: chalk.hex("#FFA502").bold,
  error: chalk.hex("#FF4757").bold,
  info: chalk.hex("#5352ED").bold,

  // Text colors - Improved readability
  primary: chalk.hex("#FFFFFF").bold,
  secondary: chalk.hex("#E5E7EB"),
  muted: chalk.hex("#9CA3AF"),
  dim: chalk.hex("#6B7280"),

  // Background colors
  bg: chalk.bgHex("#0A0A0A"),
  bgCard: chalk.bgHex("#1A1A1A"),
  bgHighlight: chalk.bgHex("#2A2A2A"),
};

// Comprehensive icons with fallbacks
export const ghostIcons = {
  ghost: "👻",
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
  terminal: "🖥️",
  code: "💻",
  fire: "🔥",
  zap: "⚡",
  brain: "🧠",
  magic: "🪄",
  eye: "👁️",
  lock: "🔒",
  key: "🔑",
  globe: "🌐",
  cloud: "☁️",
  moon: "🌙",
  sun: "☀️",
  // ASCII fallbacks for systems without emoji support
  fallback: {
    ghost: "[G]",
    check: "[✓]",
    error: "[✗]",
    warning: "[!]",
    info: "[i]",
  },
};

/**
 * Detect terminal capabilities and adjust output accordingly
 */
function getTerminalCapabilities() {
  const hasColor = chalk.supportsColor && chalk.supportsColor.level > 0;
  const hasUnicode = process.env.LANG && process.env.LANG.includes("UTF-8");
  const terminalWidth = process.stdout.columns || 80;

  return {
    hasColor,
    hasUnicode,
    terminalWidth,
    isInteractive: process.stdout.isTTY,
  };
}

/**
 * Safe icon getter with fallback support
 */
function getSafeIcon(iconName) {
  const caps = getTerminalCapabilities();
  if (!caps.hasUnicode && ghostIcons.fallback[iconName]) {
    return ghostIcons.fallback[iconName];
  }
  return ghostIcons[iconName] || ghostIcons.fallback[iconName] || "[?]";
}

/**
 * Create animated ghost banner with error handling
 */
export function createGhostBanner(title = "JS Stack CLI") {
  try {
    const caps = getTerminalCapabilities();

    if (caps.isInteractive) {
      console.clear();
    }

    // Adjust title length based on terminal width
    const maxWidth = Math.min(caps.terminalWidth - 10, 80);

    // Create ASCII art title with error handling
    let asciiTitle;
    try {
      asciiTitle = figlet.textSync(title, {
        font: "Big",
        horizontalLayout: "fitted",
        width: maxWidth,
      });
    } catch (error) {
      // Fallback to simple title if figlet fails
      asciiTitle = `\n${title.toUpperCase()}\n`;
    }

    // Create gradient with fallback
    if (caps.hasColor) {
      const ghostGradient = gradient([
        "#00FF41",
        "#00DD33",
        "#00BB22",
        "#00FF88",
      ]);
      console.log();
      console.log(ghostGradient(asciiTitle));
    } else {
      console.log();
      console.log(asciiTitle);
    }

    console.log();

    // Subtitle with responsive width
    const subtitle = caps.hasColor
      ? ghostColors.ghost(
          `${getSafeIcon("sparkles")} Next-Generation JavaScript Project Generator ${getSafeIcon("sparkles")}`,
        )
      : "Next-Generation JavaScript Project Generator";

    const boxWidth = Math.min(subtitle.length + 4, caps.terminalWidth - 4);

    console.log(
      boxen(subtitle, {
        padding: 1,
        margin: 1,
        borderStyle: caps.hasUnicode ? "double" : "single",
        borderColor: caps.hasColor ? "#00FF41" : undefined,
        backgroundColor: caps.hasColor ? "#1A1A1A" : undefined,
        width: boxWidth,
        textAlignment: "center",
      }),
    );
    console.log();
  } catch (error) {
    // Ultimate fallback
    console.log("\n=== JS Stack CLI ===\n");
    console.error("Banner display error:", error.message);
  }
}

/**
 * Create terminal-style header with responsive design
 */
export function createTerminalHeader() {
  try {
    const caps = getTerminalCapabilities();
    const width = Math.min(caps.terminalWidth - 4, 65);
    const border = "─".repeat(width - 2);

    const header = caps.hasColor
      ? `
${ghostColors.terminal(`┌${border}┐`)}
${ghostColors.terminal("│")} ${ghostColors.ghost(`${getSafeIcon("ghost")} JS Stack - Ghost Mode Activated ${getSafeIcon("ghost")}`).padEnd(width - 4)} ${ghostColors.terminal("│")}
${ghostColors.terminal("│")} ${ghostColors.muted("Terminal Interface • Interactive Experience").padEnd(width - 4)} ${ghostColors.terminal("│")}
${ghostColors.terminal(`└${border}┘`)}
    `
      : `
+${"-".repeat(width - 2)}+
| JS Stack - Ghost Mode Activated |
| Terminal Interface • Interactive Experience |
+${"-".repeat(width - 2)}+
    `;

    console.log(header);
  } catch (error) {
    console.log("=== JS Stack CLI - Terminal Mode ===");
    console.error("Header display error:", error.message);
  }
}

/**
 * Create animated loading spinner with improved error handling
 */
export function createGhostSpinner(text = "Loading...") {
  try {
    const caps = getTerminalCapabilities();

    if (!caps.isInteractive) {
      console.log(`${getSafeIcon("ghost")} ${text}`);
      return {
        start: () => {},
        stop: () => {},
        succeed: () => {},
        fail: () => {},
      };
    }

    return ora({
      text: caps.hasColor
        ? `${getSafeIcon("ghost")} ${ghostColors.ghost(text)}`
        : `${getSafeIcon("ghost")} ${text}`,
      spinner: caps.hasUnicode
        ? {
            interval: 100,
            frames: [
              "👻     ",
              " 👻    ",
              "  👻   ",
              "   👻  ",
              "    👻 ",
              "     👻",
              "    👻 ",
              "   👻  ",
              "  👻   ",
              " 👻    ",
            ],
          }
        : "dots",
      color: caps.hasColor ? "green" : undefined,
    });
  } catch (error) {
    console.error("Spinner creation error:", error.message);
    return {
      start: () => {},
      stop: () => {},
      succeed: () => {},
      fail: () => {},
    };
  }
}

/**
 * Create progress bar with enhanced accuracy
 */
export function createGhostProgressBar(total = 100, title = "Progress") {
  try {
    const caps = getTerminalCapabilities();

    if (!caps.isInteractive) {
      let current = 0;
      return {
        start: () => {},
        update: (value) => {
          current = value;
          const percent = Math.round((current / total) * 100);
          console.log(`${title}: ${current}/${total} (${percent}%)`);
        },
        stop: () => {},
      };
    }

    const barFormat = caps.hasColor
      ? `${getSafeIcon("ghost")} ${ghostColors.ghost(title)} |${ghostColors.terminal("{bar}")}| {percentage}% | {value}/{total} | ETA: {eta}s`
      : `${getSafeIcon("ghost")} ${title} |{bar}| {percentage}% | {value}/{total} | ETA: {eta}s`;

    const progressBar = new cliProgress.SingleBar({
      format: barFormat,
      barCompleteChar: caps.hasUnicode ? "█" : "#",
      barIncompleteChar: caps.hasUnicode ? "░" : "-",
      hideCursor: true,
      stopOnComplete: true,
      clearOnComplete: false,
      linewrap: false,
      barsize: Math.min(30, caps.terminalWidth - 50),
    });

    progressBar.start(total, 0);
    return progressBar;
  } catch (error) {
    console.error("Progress bar creation error:", error.message);
    return { start: () => {}, update: () => {}, stop: () => {} };
  }
}

/**
 * Create interactive prompt with enhanced validation
 */
export function createGhostPrompt(questions) {
  try {
    const caps = getTerminalCapabilities();

    if (!Array.isArray(questions)) {
      throw new Error("Questions must be an array");
    }

    return inquirer.prompt(
      questions.map((q) => {
        if (!q.name || !q.message) {
          throw new Error(
            "Each question must have 'name' and 'message' properties",
          );
        }

        return {
          ...q,
          prefix: caps.hasColor
            ? `${getSafeIcon("ghost")} ${ghostColors.ghost("?")}`
            : `${getSafeIcon("ghost")} ?`,
          suffix: caps.hasColor
            ? ghostColors.muted("(Use arrow keys)")
            : "(Use arrow keys)",
          // Add validation if not present
          validate:
            q.validate ||
            ((input) => {
              if (q.type === "input" && !input && q.required !== false) {
                return "This field is required";
              }
              return true;
            }),
        };
      }),
    );
  } catch (error) {
    console.error("Prompt creation error:", error.message);
    return Promise.reject(error);
  }
}

/**
 * Enhanced message display functions with proper error handling
 */
export function showGhostSuccess(message, details = null) {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const caps = getTerminalCapabilities();
    const content = `${getSafeIcon("check")} ${message}${details ? "\n" + details : ""}`;

    if (caps.hasColor && caps.isInteractive) {
      const successBox = boxen(`${ghostColors.success(content)}`, {
        padding: 1,
        margin: 1,
        borderStyle: caps.hasUnicode ? "round" : "single",
        borderColor: "#2ED573",
        backgroundColor: "#1A1A1A",
        width: Math.min(caps.terminalWidth - 4, 80),
      });
      console.log(successBox);
    } else {
      console.log(`✓ ${message}`);
      if (details) console.log(`  ${details}`);
    }
  } catch (error) {
    console.log(`Success: ${message}`);
    console.error("Success display error:", error.message);
  }
}

export function showGhostError(message, details = null) {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const caps = getTerminalCapabilities();
    const content = `${getSafeIcon("error")} ${message}${details ? "\n" + details : ""}`;

    if (caps.hasColor && caps.isInteractive) {
      const errorBox = boxen(`${ghostColors.error(content)}`, {
        padding: 1,
        margin: 1,
        borderStyle: caps.hasUnicode ? "round" : "single",
        borderColor: "#FF4757",
        backgroundColor: "#1A1A1A",
        width: Math.min(caps.terminalWidth - 4, 80),
      });
      console.log(errorBox);
    } else {
      console.error(`✗ ${message}`);
      if (details) console.error(`  ${details}`);
    }
  } catch (error) {
    console.error(`Error: ${message}`);
    console.error("Error display error:", error.message);
  }
}

export function showGhostWarning(message, details = null) {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const caps = getTerminalCapabilities();
    const content = `${getSafeIcon("warning")} ${message}${details ? "\n" + details : ""}`;

    if (caps.hasColor && caps.isInteractive) {
      const warningBox = boxen(`${ghostColors.warning(content)}`, {
        padding: 1,
        margin: 1,
        borderStyle: caps.hasUnicode ? "round" : "single",
        borderColor: "#FFA502",
        backgroundColor: "#1A1A1A",
        width: Math.min(caps.terminalWidth - 4, 80),
      });
      console.log(warningBox);
    } else {
      console.warn(`! ${message}`);
      if (details) console.warn(`  ${details}`);
    }
  } catch (error) {
    console.warn(`Warning: ${message}`);
    console.error("Warning display error:", error.message);
  }
}

export function showGhostInfo(message, details = null) {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const caps = getTerminalCapabilities();
    const content = `${getSafeIcon("info")} ${message}${details ? "\n" + details : ""}`;

    if (caps.hasColor && caps.isInteractive) {
      const infoBox = boxen(`${ghostColors.info(content)}`, {
        padding: 1,
        margin: 1,
        borderStyle: caps.hasUnicode ? "round" : "single",
        borderColor: "#5352ED",
        backgroundColor: "#1A1A1A",
        width: Math.min(caps.terminalWidth - 4, 80),
      });
      console.log(infoBox);
    } else {
      console.info(`i ${message}`);
      if (details) console.info(`  ${details}`);
    }
  } catch (error) {
    console.info(`Info: ${message}`);
    console.error("Info display error:", error.message);
  }
}

/**
 * Enhanced feature showcase with validation
 */
export function showGhostFeatures(features) {
  try {
    if (!Array.isArray(features)) {
      throw new Error("Features must be an array");
    }

    const caps = getTerminalCapabilities();
    const maxWidth = Math.min(caps.terminalWidth - 4, 80);

    console.log();
    if (caps.hasColor) {
      console.log(
        ghostColors.ghost(`${getSafeIcon("target")} Available Features:`),
      );
    } else {
      console.log(`${getSafeIcon("target")} Available Features:`);
    }

    const border = caps.hasUnicode ? "─" : "-";
    const cornerTL = caps.hasUnicode ? "┌" : "+";
    const cornerTR = caps.hasUnicode ? "┐" : "+";
    const cornerBL = caps.hasUnicode ? "└" : "+";
    const cornerBR = caps.hasUnicode ? "┘" : "+";
    const vertical = caps.hasUnicode ? "│" : "|";

    const line = border.repeat(maxWidth - 2);

    if (caps.hasColor) {
      console.log(ghostColors.terminal(`${cornerTL}${line}${cornerTR}`));
    } else {
      console.log(`${cornerTL}${line}${cornerTR}`);
    }

    features.forEach((feature) => {
      if (!feature.name) {
        console.warn("Feature missing name, skipping");
        return;
      }

      const icon = getSafeIcon(feature.icon || "sparkles");
      const name = String(feature.name).padEnd(20);
      const description = String(feature.description || "").padEnd(25);
      const status = feature.status || getSafeIcon("check");

      const content = ` ${icon} ${name} ${description} ${status}`;
      const paddedContent = content.padEnd(maxWidth - 4);

      if (caps.hasColor) {
        console.log(
          ghostColors.terminal(vertical) +
            ghostColors.primary(paddedContent) +
            ghostColors.terminal(vertical),
        );
      } else {
        console.log(`${vertical}${paddedContent}${vertical}`);
      }
    });

    if (caps.hasColor) {
      console.log(ghostColors.terminal(`${cornerBL}${line}${cornerBR}`));
    } else {
      console.log(`${cornerBL}${line}${cornerBR}`);
    }

    console.log();
  } catch (error) {
    console.error("Feature display error:", error.message);
    console.log(
      "Available features: " +
        (features?.map((f) => f.name).join(", ") || "None"),
    );
  }
}

/**
 * Enhanced step indicator with validation
 */
export function showGhostStep(step, total, title, description = null) {
  try {
    if (
      !Number.isInteger(step) ||
      !Number.isInteger(total) ||
      step < 0 ||
      total < 1 ||
      step > total
    ) {
      throw new Error("Invalid step parameters");
    }

    if (!title) {
      throw new Error("Title is required");
    }

    const caps = getTerminalCapabilities();
    const progress = Math.round((step / total) * 100);
    const barLength = Math.min(20, Math.floor(caps.terminalWidth / 4));
    const filledLength = Math.floor((progress / 100) * barLength);

    const progressBar = caps.hasUnicode
      ? "█".repeat(filledLength) + "░".repeat(barLength - filledLength)
      : "#".repeat(filledLength) + "-".repeat(barLength - filledLength);

    console.log();
    if (caps.hasColor) {
      console.log(ghostColors.ghost(`Step ${step}/${total}: ${title}`));
      if (description) {
        console.log(ghostColors.muted(`   ${description}`));
      }
      console.log(ghostColors.terminal(`[${progressBar}] ${progress}%`));
    } else {
      console.log(`Step ${step}/${total}: ${title}`);
      if (description) {
        console.log(`   ${description}`);
      }
      console.log(`[${progressBar}] ${progress}%`);
    }
    console.log();
  } catch (error) {
    console.error("Step display error:", error.message);
    console.log(`Step: ${title || "Unknown"}`);
  }
}

/**
 * Safe type writer effect with proper error handling
 */
export function typeWriter(text, speed = 50) {
  return new Promise((resolve, reject) => {
    try {
      if (!text || typeof text !== "string") {
        throw new Error("Text must be a non-empty string");
      }

      if (!Number.isInteger(speed) || speed < 1) {
        speed = 50;
      }

      const caps = getTerminalCapabilities();

      if (!caps.isInteractive) {
        console.log(caps.hasColor ? ghostColors.ghost(text) : text);
        resolve();
        return;
      }

      let i = 0;
      const timer = setInterval(() => {
        try {
          const char = caps.hasColor ? ghostColors.ghost(text[i]) : text[i];
          process.stdout.write(char);
          i++;

          if (i >= text.length) {
            clearInterval(timer);
            console.log();
            resolve();
          }
        } catch (writeError) {
          clearInterval(timer);
          console.log(text.slice(i)); // Print remaining text
          resolve();
        }
      }, speed);

      // Safety timeout
      setTimeout(
        () => {
          clearInterval(timer);
          if (i < text.length) {
            console.log(text.slice(i)); // Print remaining text
          }
          resolve();
        },
        text.length * speed + 5000,
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Enhanced system information with accurate data
 */
export async function showGhostSystemInfo() {
  try {
    const caps = getTerminalCapabilities();
    const nodeVersion = process.version;
    const platform = `${os.type()} ${os.release()} (${os.arch()})`;
    const memoryUsage = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`;
    const uptime = `${Math.round(os.uptime() / 3600)}h ${Math.round((os.uptime() % 3600) / 60)}m`;
    const cpuCount = os.cpus().length;
    const nodeEnv = process.env.NODE_ENV || "development";

    // Get CLI version from package.json if available
    let cliVersion = "2.0.0";
    try {
      const { readFile } = await import("fs/promises");
      const packagePath = new URL("../package.json", import.meta.url);
      const packageData = JSON.parse(await readFile(packagePath, "utf8"));
      cliVersion = packageData.version || "2.0.0";
    } catch {
      // Fallback version if package.json not found
    }

    const systemInfo = [
      { label: "Node.js Version", value: nodeVersion, icon: "terminal" },
      { label: "Platform", value: platform, icon: "gear" },
      { label: "Memory Usage", value: memoryUsage, icon: "brain" },
      { label: "System Uptime", value: uptime, icon: "clock" },
      { label: "CPU Cores", value: cpuCount.toString(), icon: "zap" },
      { label: "Environment", value: nodeEnv, icon: "globe" },
      { label: "CLI Version", value: cliVersion, icon: "package" },
      {
        label: "Terminal Size",
        value: `${caps.terminalWidth}x${process.stdout.rows || "unknown"}`,
        icon: "terminal",
      },
    ];

    const maxWidth = Math.min(caps.terminalWidth - 4, 80);
    const border = caps.hasUnicode ? "─" : "-";
    const vertical = caps.hasUnicode ? "│" : "|";
    const line = border.repeat(maxWidth - 2);

    console.log();
    if (caps.hasColor) {
      console.log(
        ghostColors.ghost(`${getSafeIcon("terminal")} System Information:`),
      );
      console.log(ghostColors.terminal(`┌${line}┐`));

      systemInfo.forEach((info) => {
        const icon = getSafeIcon(info.icon);
        const content = ` ${icon} ${info.label.padEnd(20)} ${info.value.padEnd(25)}`;
        console.log(
          ghostColors.terminal(vertical) +
            ghostColors.primary(content.padEnd(maxWidth - 4)) +
            ghostColors.terminal(vertical),
        );
      });

      console.log(ghostColors.terminal(`└${line}┘`));
    } else {
      console.log(`${getSafeIcon("terminal")} System Information:`);
      console.log(`+${line}+`);

      systemInfo.forEach((info) => {
        const icon = getSafeIcon(info.icon);
        const content = ` ${icon} ${info.label.padEnd(20)} ${info.value}`;
        console.log(`${vertical}${content.padEnd(maxWidth - 4)}${vertical}`);
      });

      console.log(`+${line}+`);
    }
    console.log();
  } catch (error) {
    console.error("System info display error:", error.message);
    console.log(
      `Node.js: ${process.version} | Platform: ${os.type()} ${os.arch()}`,
    );
  }
}

/**
 * Enhanced menu creation with validation
 */
export function createGhostMenu(title, options) {
  try {
    if (!title) {
      throw new Error("Menu title is required");
    }

    if (!Array.isArray(options) || options.length === 0) {
      throw new Error("Menu options must be a non-empty array");
    }

    // Validate options
    options.forEach((option, index) => {
      if (!option.name || !option.value) {
        throw new Error(
          `Option at index ${index} must have 'name' and 'value' properties`,
        );
      }
    });

    const caps = getTerminalCapabilities();

    return inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: caps.hasColor
          ? `${getSafeIcon("ghost")} ${ghostColors.ghost(title)}`
          : `${getSafeIcon("ghost")} ${title}`,
        choices: options.map((option) => ({
          name: `${getSafeIcon(option.icon) || getSafeIcon("sparkles")} ${option.name}`,
          value: option.value,
          short: option.name,
        })),
        prefix: getSafeIcon("ghost"),
        suffix: caps.hasColor
          ? ghostColors.muted("(Use arrow keys)")
          : "(Use arrow keys)",
        pageSize: Math.min(options.length, 10), // Limit visible options
      },
    ]);
  } catch (error) {
    console.error("Menu creation error:", error.message);
    return Promise.reject(error);
  }
}

/**
 * Enhanced confirmation with validation
 */
export function createGhostConfirm(message, defaultValue = true) {
  try {
    if (!message) {
      throw new Error("Confirmation message is required");
    }

    const caps = getTerminalCapabilities();

    return inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: caps.hasColor
          ? `${getSafeIcon("ghost")} ${ghostColors.ghost(message)}`
          : `${getSafeIcon("ghost")} ${message}`,
        default: Boolean(defaultValue),
        prefix: getSafeIcon("ghost"),
        suffix: caps.hasColor ? ghostColors.muted("(y/n)") : "(y/n)",
      },
    ]);
  } catch (error) {
    console.error("Confirmation creation error:", error.message);
    return Promise.reject(error);
  }
}

/**
 * Enhanced input with validation
 */
export function createGhostInput(message, defaultValue = null, options = {}) {
  try {
    if (!message) {
      throw new Error("Input message is required");
    }

    const caps = getTerminalCapabilities();

    return inquirer.prompt([
      {
        type: "input",
        name: "value",
        message: caps.hasColor
          ? `${getSafeIcon("ghost")} ${ghostColors.ghost(message)}`
          : `${getSafeIcon("ghost")} ${message}`,
        default: defaultValue,
        prefix: getSafeIcon("ghost"),
        suffix: caps.hasColor
          ? ghostColors.muted("(Press Enter to confirm)")
          : "(Press Enter to confirm)",
        validate:
          options.validate ||
          ((input) => {
            if (options.required && !input.trim()) {
              return "This field is required";
            }
            if (options.minLength && input.length < options.minLength) {
              return `Input must be at least ${options.minLength} characters`;
            }
            if (options.maxLength && input.length > options.maxLength) {
              return `Input must be no more than ${options.maxLength} characters`;
            }
            return true;
          }),
        filter: options.filter || ((input) => input.trim()),
      },
    ]);
  } catch (error) {
    console.error("Input creation error:", error.message);
    return Promise.reject(error);
  }
}

/**
 * Enhanced footer with accurate information
 */
export function createGhostFooter(
  author = "Vipin Yadav",
  website = "https://vipinyadav01.vercel.app",
) {
  try {
    const caps = getTerminalCapabilities();
    const maxWidth = Math.min(caps.terminalWidth - 4, 65);
    const border = caps.hasUnicode ? "─" : "-";
    const vertical = caps.hasUnicode ? "│" : "|";
    const cornerTL = caps.hasUnicode ? "┌" : "+";
    const cornerTR = caps.hasUnicode ? "┐" : "+";
    const cornerBL = caps.hasUnicode ? "└" : "+";
    const cornerBR = caps.hasUnicode ? "┘" : "+";

    const line = border.repeat(maxWidth - 2);
    const authorLine = ` ${getSafeIcon("ghost")} Built with ${getSafeIcon("heart")} by ${author} ${getSafeIcon("ghost")}`;
    const websiteLine = `    ${website}`;

    if (caps.hasColor) {
      const footer = `
${ghostColors.terminal(`${cornerTL}${line}${cornerTR}`)}
${ghostColors.terminal(vertical)} ${ghostColors.ghost(authorLine.padEnd(maxWidth - 4))} ${ghostColors.terminal(vertical)}
${ghostColors.terminal(vertical)} ${ghostColors.muted(websiteLine.padEnd(maxWidth - 4))} ${ghostColors.terminal(vertical)}
${ghostColors.terminal(`${cornerBL}${line}${cornerBR}`)}
      `;
      console.log(footer);
    } else {
      const footer = `
${cornerTL}${line}${cornerTR}
${vertical} ${authorLine.padEnd(maxWidth - 4)} ${vertical}
${vertical} ${websiteLine.padEnd(maxWidth - 4)} ${vertical}
${cornerBL}${line}${cornerBR}
      `;
      console.log(footer);
    }
  } catch (error) {
    console.error("Footer display error:", error.message);
    console.log(`\nBuilt with love by ${author}\n${website}\n`);
  }
}

/**
 * Enhanced animated ghost logo with cleanup
 */
export function createAnimatedGhostLogo() {
  try {
    const caps = getTerminalCapabilities();

    if (!caps.isInteractive) {
      console.log(getSafeIcon("ghost"));
      return () => {};
    }

    const frames = caps.hasUnicode
      ? ["👻", "👻✨", "👻✨👻", "✨👻✨", "👻✨👻", "👻✨", "👻"]
      : ["[G]", "[G]*", "[G]*[G]", "*[G]*", "[G]*[G]", "[G]*", "[G]"];

    let frameIndex = 0;
    let isRunning = true;

    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }

      try {
        const frame = caps.hasColor
          ? ghostColors.ghost(frames[frameIndex])
          : frames[frameIndex];
        process.stdout.write(`\r${frame} `);
        frameIndex = (frameIndex + 1) % frames.length;
      } catch (writeError) {
        clearInterval(interval);
        isRunning = false;
      }
    }, 200);

    // Return cleanup function
    return () => {
      isRunning = false;
      clearInterval(interval);
      process.stdout.write("\r"); // Clear the line
    };
  } catch (error) {
    console.error("Animated logo error:", error.message);
    return () => {};
  }
}

/**
 * Utility function to check if terminal supports colors
 */
export function supportsColor() {
  return getTerminalCapabilities().hasColor;
}

/**
 * Utility function to check if terminal supports Unicode
 */
export function supportsUnicode() {
  return getTerminalCapabilities().hasUnicode;
}

/**
 * Utility function to get terminal dimensions
 */
export function getTerminalDimensions() {
  return {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24,
  };
}

/**
 * Enhanced table display with responsive design
 */
export function showGhostTable(headers, rows, title = null) {
  try {
    if (!Array.isArray(headers) || headers.length === 0) {
      throw new Error("Headers must be a non-empty array");
    }

    if (!Array.isArray(rows)) {
      throw new Error("Rows must be an array");
    }

    const caps = getTerminalCapabilities();
    const maxWidth = caps.terminalWidth - 4;
    const colWidth = Math.floor(
      (maxWidth - headers.length - 1) / headers.length,
    );

    // Title
    if (title && caps.hasColor) {
      console.log();
      console.log(ghostColors.ghost(`${getSafeIcon("terminal")} ${title}`));
    } else if (title) {
      console.log();
      console.log(`${getSafeIcon("terminal")} ${title}`);
    }

    // Border characters
    const border = caps.hasUnicode ? "─" : "-";
    const vertical = caps.hasUnicode ? "│" : "|";
    const cross = caps.hasUnicode ? "┼" : "+";
    const cornerTL = caps.hasUnicode ? "┌" : "+";
    const cornerTR = caps.hasUnicode ? "┐" : "+";
    const cornerBL = caps.hasUnicode ? "└" : "+";
    const cornerBR = caps.hasUnicode ? "┘" : "+";
    const teeDown = caps.hasUnicode ? "┬" : "+";
    const teeUp = caps.hasUnicode ? "┴" : "+";

    // Top border
    let topBorder = cornerTL;
    headers.forEach((_, index) => {
      topBorder += border.repeat(colWidth);
      topBorder += index < headers.length - 1 ? teeDown : cornerTR;
    });

    // Header row
    let headerRow = vertical;
    headers.forEach((header) => {
      headerRow += ` ${String(header).padEnd(colWidth - 1)}${vertical}`;
    });

    // Separator
    let separator = caps.hasUnicode ? "├" : "+";
    headers.forEach((_, index) => {
      separator += border.repeat(colWidth);
      separator +=
        index < headers.length - 1 ? cross : caps.hasUnicode ? "┤" : "+";
    });

    // Bottom border
    let bottomBorder = cornerBL;
    headers.forEach((_, index) => {
      bottomBorder += border.repeat(colWidth);
      bottomBorder += index < headers.length - 1 ? teeUp : cornerBR;
    });

    // Display table
    if (caps.hasColor) {
      console.log(ghostColors.terminal(topBorder));
      console.log(ghostColors.ghost(headerRow));
      console.log(ghostColors.terminal(separator));

      rows.forEach((row) => {
        let dataRow = vertical;
        headers.forEach((_, colIndex) => {
          const cellData = String(row[colIndex] || "").padEnd(colWidth - 1);
          dataRow += ` ${cellData}${vertical}`;
        });
        console.log(ghostColors.primary(dataRow));
      });

      console.log(ghostColors.terminal(bottomBorder));
    } else {
      console.log(topBorder);
      console.log(headerRow);
      console.log(separator);

      rows.forEach((row) => {
        let dataRow = vertical;
        headers.forEach((_, colIndex) => {
          const cellData = String(row[colIndex] || "").padEnd(colWidth - 1);
          dataRow += ` ${cellData}${vertical}`;
        });
        console.log(dataRow);
      });

      console.log(bottomBorder);
    }

    console.log();
  } catch (error) {
    console.error("Table display error:", error.message);
    // Fallback simple table
    console.log("\nTable:", title || "");
    console.log("Headers:", headers?.join(" | ") || "None");
    rows?.forEach((row, index) => {
      console.log(
        `Row ${index + 1}:`,
        Array.isArray(row) ? row.join(" | ") : row,
      );
    });
    console.log();
  }
}

/**
 * Enhanced multi-select prompt
 */
export function createGhostMultiSelect(message, choices, options = {}) {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    if (!Array.isArray(choices) || choices.length === 0) {
      throw new Error("Choices must be a non-empty array");
    }

    const caps = getTerminalCapabilities();

    return inquirer.prompt([
      {
        type: "checkbox",
        name: "selected",
        message: caps.hasColor
          ? `${getSafeIcon("ghost")} ${ghostColors.ghost(message)}`
          : `${getSafeIcon("ghost")} ${message}`,
        choices: choices.map((choice) => {
          if (typeof choice === "string") {
            return {
              name: choice,
              value: choice,
            };
          }
          return {
            name: `${getSafeIcon(choice.icon) || getSafeIcon("sparkles")} ${choice.name}`,
            value: choice.value || choice.name,
            checked: choice.checked || false,
          };
        }),
        prefix: getSafeIcon("ghost"),
        suffix: caps.hasColor
          ? ghostColors.muted("(Use space to select, Enter to confirm)")
          : "(Use space to select, Enter to confirm)",
        pageSize: Math.min(choices.length, 10),
        validate:
          options.validate ||
          ((selected) => {
            if (
              options.minSelections &&
              selected.length < options.minSelections
            ) {
              return `Please select at least ${options.minSelections} option(s)`;
            }
            if (
              options.maxSelections &&
              selected.length > options.maxSelections
            ) {
              return `Please select no more than ${options.maxSelections} option(s)`;
            }
            return true;
          }),
      },
    ]);
  } catch (error) {
    console.error("Multi-select creation error:", error.message);
    return Promise.reject(error);
  }
}

/**
 * Export all functions as default object with enhanced error handling
 */
export default {
  // Core display functions
  createGhostBanner,
  createTerminalHeader,
  createGhostFooter,

  // Interactive elements
  createGhostSpinner,
  createGhostProgressBar,
  createGhostPrompt,
  createGhostMenu,
  createGhostConfirm,
  createGhostInput,
  createGhostMultiSelect,

  // Message display
  showGhostSuccess,
  showGhostError,
  showGhostWarning,
  showGhostInfo,

  // Information display
  showGhostFeatures,
  showGhostStep,
  showGhostSystemInfo,
  showGhostTable,

  // Animation and effects
  typeWriter,
  createAnimatedGhostLogo,

  // Utility functions
  supportsColor,
  supportsUnicode,
  getTerminalDimensions,
  getTerminalCapabilities,
  getSafeIcon,

  // Constants
  ghostColors,
  ghostIcons,
};
