import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import chalkAnimation from "chalk-animation";
import ora from "ora";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import cliProgress from "cli-progress";

/**
 * Modern Terminal UI Components with Ghost/Terminal Design
 * Enhanced visual elements for better user experience
 */

// Ghost/Terminal Color Palette
export const ghostColors = {
  // Primary ghost colors
  ghost: chalk.hex("#00ff88").bold,
  ghostMuted: chalk.hex("#00cc6a"),
  ghostDim: chalk.hex("#009944"),
  
  // Terminal colors
  terminal: chalk.hex("#00ff41").bold,
  terminalMuted: chalk.hex("#00cc33"),
  terminalDim: chalk.hex("#009922"),
  
  // Accent colors
  accent: chalk.hex("#ff6b6b").bold,
  accentMuted: chalk.hex("#ff5252"),
  
  // Status colors
  success: chalk.hex("#4ade80").bold,
  warning: chalk.hex("#fbbf24").bold,
  error: chalk.hex("#ef4444").bold,
  info: chalk.hex("#3b82f6").bold,
  
  // Text colors
  primary: chalk.hex("#ffffff").bold,
  secondary: chalk.hex("#e5e7eb"),
  muted: chalk.hex("#9ca3af"),
  dim: chalk.hex("#6b7280"),
  
  // Background colors
  bg: chalk.bgHex("#0a0a0a"),
  bgCard: chalk.bgHex("#1a1a1a"),
  bgHighlight: chalk.bgHex("#2a2a2a"),
};

// Enhanced Icons with Ghost Theme
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
};

/**
 * Create animated ghost banner
 */
export function createGhostBanner(title = "JS Stack CLI") {
  console.clear();
  
  // Create ASCII art title
  const asciiTitle = figlet.textSync(title, {
    font: "Big",
    horizontalLayout: "fitted",
    width: 80,
  });

  // Create ghost gradient
  const ghostGradient = gradient(["#00ff88", "#00cc6a", "#009944", "#00ff41"]);
  
  console.log();
  console.log(ghostGradient(asciiTitle));
  console.log();
  
  // Subtitle with ghost effect
  const subtitle = ghostColors.ghost("✨ Next-Generation JavaScript Project Generator ✨");
  console.log(boxen(subtitle, {
    padding: 1,
    margin: 1,
    borderStyle: "double",
    borderColor: "#00ff88",
    backgroundColor: "#1a1a1a",
    dimBorder: true,
  }));
  console.log();
}

/**
 * Create terminal-style header
 */
export function createTerminalHeader() {
  const header = `
${ghostColors.terminal("┌─────────────────────────────────────────────────────────────┐")}
${ghostColors.terminal("│")} ${ghostColors.ghost("👻 JS Stack - Ghost Mode Activated 👻")} ${ghostColors.terminal("│")}
${ghostColors.terminal("│")} ${ghostColors.muted("   Terminal Interface • Interactive Experience")} ${ghostColors.terminal("│")}
${ghostColors.terminal("└─────────────────────────────────────────────────────────────┘")}
  `;
  
  console.log(header);
}

/**
 * Create animated loading spinner with ghost theme
 */
export function createGhostSpinner(text = "Loading...") {
  return ora({
    text: `${ghostIcons.ghost} ${ghostColors.ghost(text)}`,
    spinner: {
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
    },
    color: "green",
  });
}

/**
 * Create progress bar with ghost theme
 */
export function createGhostProgressBar(total = 100, title = "Progress") {
  const progressBar = new cliProgress.SingleBar({
    format: `${ghostIcons.ghost} ${ghostColors.ghost(title)} |${ghostColors.terminal("{bar}")}| {percentage}% | {value}/{total} | {eta}s`,
    barCompleteChar: "█",
    barIncompleteChar: "░",
    hideCursor: true,
    stopOnComplete: true,
    clearOnComplete: false,
    linewrap: false,
  });
  
  progressBar.start(total, 0);
  return progressBar;
}

/**
 * Create interactive prompt with ghost theme
 */
export function createGhostPrompt(questions) {
  return inquirer.prompt(questions.map(q => ({
    ...q,
    prefix: `${ghostIcons.ghost} ${ghostColors.ghost("?")}`,
    suffix: ghostColors.muted("(Use arrow keys)"),
  })));
}

/**
 * Display success message with ghost animation
 */
export function showGhostSuccess(message, details = null) {
  const successBox = boxen(
    `${ghostIcons.check} ${ghostColors.success(message)}\n${details ? ghostColors.muted(details) : ""}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "#4ade80",
      backgroundColor: "#1a1a1a",
      dimBorder: true,
    }
  );
  
  console.log(successBox);
}

/**
 * Display error message with ghost theme
 */
export function showGhostError(message, details = null) {
  const errorBox = boxen(
    `${ghostIcons.error} ${ghostColors.error(message)}\n${details ? ghostColors.muted(details) : ""}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "#ef4444",
      backgroundColor: "#1a1a1a",
      dimBorder: true,
    }
  );
  
  console.log(errorBox);
}

/**
 * Display warning message with ghost theme
 */
export function showGhostWarning(message, details = null) {
  const warningBox = boxen(
    `${ghostIcons.warning} ${ghostColors.warning(message)}\n${details ? ghostColors.muted(details) : ""}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "#fbbf24",
      backgroundColor: "#1a1a1a",
      dimBorder: true,
    }
  );
  
  console.log(warningBox);
}

/**
 * Display info message with ghost theme
 */
export function showGhostInfo(message, details = null) {
  const infoBox = boxen(
    `${ghostIcons.info} ${ghostColors.info(message)}\n${details ? ghostColors.muted(details) : ""}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "#3b82f6",
      backgroundColor: "#1a1a1a",
      dimBorder: true,
    }
  );
  
  console.log(infoBox);
}

/**
 * Create feature showcase with ghost theme
 */
export function showGhostFeatures(features) {
  console.log();
  console.log(ghostColors.ghost("🎯 Available Features:"));
  console.log(ghostColors.terminal("┌─────────────────────────────────────────────────────────────┐"));
  
  features.forEach((feature, index) => {
    const icon = feature.icon || ghostIcons.sparkles;
    const name = feature.name;
    const description = feature.description;
    const status = feature.status || "✅";
    
    console.log(ghostColors.terminal("│") + 
      ` ${icon} ${ghostColors.primary(name.padEnd(20))} ${ghostColors.muted(description.padEnd(30))} ${status}` + 
      ghostColors.terminal("│"));
  });
  
  console.log(ghostColors.terminal("└─────────────────────────────────────────────────────────────┘"));
  console.log();
}

/**
 * Create step indicator with ghost theme
 */
export function showGhostStep(step, total, title, description = null) {
  const progress = Math.round((step / total) * 100);
  const progressBar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
  
  console.log();
  console.log(ghostColors.ghost(`Step ${step}/${total}: ${title}`));
  if (description) {
    console.log(ghostColors.muted(`   ${description}`));
  }
  console.log(ghostColors.terminal(`[${progressBar}] ${progress}%`));
  console.log();
}

/**
 * Create animated typing effect
 */
export function typeWriter(text, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      process.stdout.write(ghostColors.ghost(text[i]));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        console.log();
        resolve();
      }
    }, speed);
  });
}

/**
 * Create ghost-themed menu
 */
export function createGhostMenu(title, options) {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: `${ghostIcons.ghost} ${ghostColors.ghost(title)}`,
      choices: options.map(option => ({
        name: `${option.icon || ghostIcons.sparkles} ${option.name}`,
        value: option.value,
        short: option.name,
      })),
      prefix: ghostIcons.ghost,
      suffix: ghostColors.muted("(Use arrow keys)"),
    },
  ]);
}

/**
 * Create ghost-themed confirmation
 */
export function createGhostConfirm(message, defaultValue = true) {
  return inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `${ghostIcons.ghost} ${ghostColors.ghost(message)}`,
      default: defaultValue,
      prefix: ghostIcons.ghost,
      suffix: ghostColors.muted("(y/n)"),
    },
  ]);
}

/**
 * Create ghost-themed input
 */
export function createGhostInput(message, defaultValue = null) {
  return inquirer.prompt([
    {
      type: "input",
      name: "value",
      message: `${ghostIcons.ghost} ${ghostColors.ghost(message)}`,
      default: defaultValue,
      prefix: ghostIcons.ghost,
      suffix: ghostColors.muted("(Press Enter to confirm)"),
    },
  ]);
}

/**
 * Display system information with ghost theme
 */
export function showGhostSystemInfo() {
  const systemInfo = [
    { label: "Node.js Version", value: process.version, icon: ghostIcons.terminal },
    { label: "Platform", value: `${process.platform} ${process.arch}`, icon: ghostIcons.gear },
    { label: "Memory Usage", value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, icon: ghostIcons.brain },
    { label: "CLI Version", value: "2.0.0", icon: ghostIcons.package },
  ];
  
  console.log();
  console.log(ghostColors.ghost("🖥️ System Information:"));
  console.log(ghostColors.terminal("┌─────────────────────────────────────────────────────────────┐"));
  
  systemInfo.forEach(info => {
    console.log(ghostColors.terminal("│") + 
      ` ${info.icon} ${ghostColors.primary(info.label.padEnd(20))} ${ghostColors.muted(info.value.padEnd(30))}` + 
      ghostColors.terminal("│"));
  });
  
  console.log(ghostColors.terminal("└─────────────────────────────────────────────────────────────┘"));
  console.log();
}

/**
 * Create ghost-themed footer
 */
export function createGhostFooter() {
  const footer = `
${ghostColors.terminal("┌─────────────────────────────────────────────────────────────┐")}
${ghostColors.terminal("│")} ${ghostColors.ghost("👻 Built with ❤️ by Vipin Yadav 👻")} ${ghostColors.terminal("│")}
${ghostColors.terminal("│")} ${ghostColors.muted("   https://vipinyadav01.vercel.app")} ${ghostColors.terminal("│")}
${ghostColors.terminal("└─────────────────────────────────────────────────────────────┘")}
  `;
  
  console.log(footer);
}

/**
 * Create animated ghost logo
 */
export function createAnimatedGhostLogo() {
  const frames = [
    "👻",
    "👻✨",
    "👻✨👻",
    "✨👻✨",
    "👻✨👻",
    "👻✨",
    "👻",
  ];
  
  let frameIndex = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${ghostColors.ghost(frames[frameIndex])} `);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 200);
  
  return () => clearInterval(interval);
}

export default {
  createGhostBanner,
  createTerminalHeader,
  createGhostSpinner,
  createGhostProgressBar,
  createGhostPrompt,
  showGhostSuccess,
  showGhostError,
  showGhostWarning,
  showGhostInfo,
  showGhostFeatures,
  showGhostStep,
  typeWriter,
  createGhostMenu,
  createGhostConfirm,
  createGhostInput,
  showGhostSystemInfo,
  createGhostFooter,
  createAnimatedGhostLogo,
  ghostColors,
  ghostIcons,
};
