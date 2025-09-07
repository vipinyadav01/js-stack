import chalk from 'chalk';
import { PACKAGE_MANAGER_OPTIONS } from '../types.js';

/**
 * Render CLI title banner
 */
export function renderTitle() {
  console.log();
  console.log(chalk.bold.cyan('╔══════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Create JavaScript Stack CLI    ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════╝'));
  console.log();
}

/**
 * Render success message
 */
export function renderSuccess(projectName, projectPath) {
  console.log();
  console.log(chalk.green('✨ Project created successfully!'));
  console.log();
  console.log(chalk.bold('Next steps:'));
  console.log(chalk.gray('  Navigate to your project:'));
  console.log(`    ${chalk.cyan(`cd ${projectPath}`)}`);
  console.log();
}

/**
 * Render project summary
 */
export function renderProjectSummary(config) {
  console.log();
  console.log(chalk.bold('📦 Project Configuration:'));
  console.log(chalk.gray('─'.repeat(30)));
  
  const items = [
    ['Project', config.projectName],
    ['Database', config.database],
    ['ORM', config.orm],
    ['Backend', config.backend],
    ['Frontend', config.frontend.join(', ')],
    ['Auth', config.auth],
    ['Package Manager', config.packageManager],
    ['Addons', config.addons.length > 0 ? config.addons.join(', ') : 'none'],
  ];
  
  items.forEach(([label, value]) => {
    console.log(`  ${chalk.blue(label.padEnd(15))} ${value}`);
  });
  
  console.log(chalk.gray('─'.repeat(30)));
  console.log();
}

/**
 * Get start command for package manager
 */
export function getStartCommand(packageManager, script = 'dev') {
  switch (packageManager) {
    case PACKAGE_MANAGER_OPTIONS.YARN:
      return `yarn ${script}`;
    case PACKAGE_MANAGER_OPTIONS.PNPM:
      return `pnpm ${script}`;
    case PACKAGE_MANAGER_OPTIONS.BUN:
      return `bun ${script}`;
    case PACKAGE_MANAGER_OPTIONS.NPM:
    default:
      return `npm run ${script}`;
  }
}

/**
 * Render post-installation instructions
 */
export function renderInstructions(projectName, projectPath, packageManager, hasBackend, hasFrontend) {
  console.log();
  console.log(chalk.green.bold('🎉 Success!') + ' Your project is ready.');
  console.log();
  console.log(chalk.bold('To get started:'));
  console.log();
  console.log(chalk.gray('  1. Navigate to your project:'));
  console.log(`     ${chalk.cyan(`cd ${projectPath}`)}`);
  console.log();
  
  if (!packageManager) {
    console.log(chalk.gray('  2. Install dependencies:'));
    console.log(`     ${chalk.cyan('npm install')}`);
    console.log();
  }
  
  const scripts = [];
  if (hasBackend && hasFrontend) {
    scripts.push(['dev', 'Start development servers']);
    scripts.push(['dev:backend', 'Start backend server']);
    scripts.push(['dev:frontend', 'Start frontend server']);
  } else if (hasBackend) {
    scripts.push(['dev', 'Start backend server']);
  } else if (hasFrontend) {
    scripts.push(['dev', 'Start frontend server']);
  }
  
  if (scripts.length > 0) {
    console.log(chalk.gray(`  ${packageManager ? '2' : '3'}. Available scripts:`));
    scripts.forEach(([script, description]) => {
      const command = getStartCommand(packageManager || PACKAGE_MANAGER_OPTIONS.NPM, script);
      console.log(`     ${chalk.cyan(command.padEnd(20))} ${chalk.gray(description)}`);
    });
    console.log();
  }
  
  console.log(chalk.bold('Happy coding! 🚀'));
  console.log();
}

export default {
  renderTitle,
  renderSuccess,
  renderProjectSummary,
  renderInstructions,
  getStartCommand
};
