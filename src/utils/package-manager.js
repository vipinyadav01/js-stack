import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { PACKAGE_MANAGER_OPTIONS } from '../types.js';

/**
 * Get install command for package manager
 */
export function getInstallCommand(packageManager) {
  switch (packageManager) {
    case PACKAGE_MANAGER_OPTIONS.YARN:
      return 'yarn';
    case PACKAGE_MANAGER_OPTIONS.PNPM:
      return 'pnpm install';
    case PACKAGE_MANAGER_OPTIONS.BUN:
      return 'bun install';
    case PACKAGE_MANAGER_OPTIONS.NPM:
    default:
      return 'npm install';
  }
}

/**
 * Get add command for package manager
 */
export function getAddCommand(packageManager, packages, isDev = false) {
  const pkgString = packages.join(' ');
  const devFlag = isDev ? '-D' : '';
  
  switch (packageManager) {
    case PACKAGE_MANAGER_OPTIONS.YARN:
      return `yarn add ${devFlag} ${pkgString}`;
    case PACKAGE_MANAGER_OPTIONS.PNPM:
      return `pnpm add ${devFlag} ${pkgString}`;
    case PACKAGE_MANAGER_OPTIONS.BUN:
      return `bun add ${devFlag} ${pkgString}`;
    case PACKAGE_MANAGER_OPTIONS.NPM:
    default:
      return `npm install ${devFlag} ${pkgString}`;
  }
}

/**
 * Get run command for package manager
 */
export function getRunCommand(packageManager, script) {
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
 * Check if package manager is installed
 */
export async function isPackageManagerInstalled(packageManager) {
  try {
    const command = packageManager === PACKAGE_MANAGER_OPTIONS.NPM ? 'npm' : packageManager;
    await execa(command, ['--version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Install dependencies
 */
export async function installDependencies(projectDir, packageManager) {
  const spinner = ora('Installing dependencies...').start();
  
  try {
    // Check if package manager is installed
    if (!await isPackageManagerInstalled(packageManager)) {
      spinner.fail(`${packageManager} is not installed`);
      console.log(chalk.yellow(`Falling back to npm...`));
      packageManager = PACKAGE_MANAGER_OPTIONS.NPM;
    }
    
    const installCmd = getInstallCommand(packageManager);
    const [cmd, ...args] = installCmd.split(' ');
    
    await execa(cmd, args, { 
      cwd: projectDir,
      stdio: 'ignore' 
    });
    
    spinner.succeed('Dependencies installed successfully');
    return true;
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(chalk.red(error.message));
    return false;
  }
}

/**
 * Add packages to project
 */
export async function addPackages(projectDir, packages, packageManager, isDev = false) {
  if (!packages || packages.length === 0) return true;
  
  const spinner = ora(`Adding ${isDev ? 'dev ' : ''}dependencies...`).start();
  
  try {
    const addCmd = getAddCommand(packageManager, packages, isDev);
    const [cmd, ...args] = addCmd.split(' ');
    
    await execa(cmd, args, { 
      cwd: projectDir,
      stdio: 'ignore' 
    });
    
    spinner.succeed(`${isDev ? 'Dev dependencies' : 'Dependencies'} added successfully`);
    return true;
  } catch (error) {
    spinner.fail(`Failed to add ${isDev ? 'dev ' : ''}dependencies`);
    console.error(chalk.red(error.message));
    return false;
  }
}

/**
 * Get lock file name for package manager
 */
export function getLockFileName(packageManager) {
  switch (packageManager) {
    case PACKAGE_MANAGER_OPTIONS.YARN:
      return 'yarn.lock';
    case PACKAGE_MANAGER_OPTIONS.PNPM:
      return 'pnpm-lock.yaml';
    case PACKAGE_MANAGER_OPTIONS.BUN:
      return 'bun.lockb';
    case PACKAGE_MANAGER_OPTIONS.NPM:
    default:
      return 'package-lock.json';
  }
}

export default {
  getInstallCommand,
  getAddCommand,
  getRunCommand,
  isPackageManagerInstalled,
  installDependencies,
  addPackages,
  getLockFileName
};
