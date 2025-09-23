import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { UI } from "./CLICore.js";
import { PACKAGE_MANAGER_OPTIONS } from "../types.js";
import { DEPENDENCY_VERSIONS, resolveDependencies } from "../utils/validation.js";

function getAddCommand(packageManager, packages, isDev = false) {
  const list = Array.isArray(packages) ? packages : Object.keys(packages || {});
  if (!list || list.length === 0) return null;

  switch (packageManager) {
    case PACKAGE_MANAGER_OPTIONS.PNPM:
      return `pnpm add ${isDev ? "-D " : ""}${list.join(" ")}`;
    case PACKAGE_MANAGER_OPTIONS.YARN:
      return `yarn add ${isDev ? "-D " : ""}${list.join(" ")}`;
    case PACKAGE_MANAGER_OPTIONS.BUN:
      return `bun add ${isDev ? "-d " : ""}${list.join(" ")}`;
    case PACKAGE_MANAGER_OPTIONS.NPM:
    default:
      return `npm install ${isDev ? "-D " : ""}${list.join(" ")}`;
  }
}

export class DynamicInstaller {
  constructor(projectDir, packageManager) {
    this.projectDir = projectDir;
    this.packageManager = packageManager || PACKAGE_MANAGER_OPTIONS.NPM;
  }

  async ensureBaseDependencies(config) {
    const spinner = ora("Resolving base dependencies...").start();
    try {
      const { dependencies, devDependencies } = resolveDependencies(config);

      const depList = Object.entries(dependencies).map(([name, version]) => `${name}@${version}`);
      const devDepList = Object.entries(devDependencies).map(([name, version]) => `${name}@${version}`);

      spinner.succeed("Resolved base dependencies");

      if (depList.length > 0) {
        await this.installPackages(depList, false);
      }
      if (devDepList.length > 0) {
        await this.installPackages(devDepList, true);
      }

      return true;
    } catch (error) {
      spinner.fail("Failed to resolve dependencies");
      UI.log.error(error.message);
      return false;
    }
  }

  async installPackages(packages, isDev = false) {
    const cmd = getAddCommand(this.packageManager, packages, isDev);
    if (!cmd) return true;

    const spinner = ora(`Installing ${isDev ? "dev " : ""}packages...`).start();
    try {
      const [bin, ...args] = cmd.split(" ");
      await execa(bin, args, { cwd: this.projectDir, stdio: "ignore" });
      spinner.succeed(`Installed ${packages.length} ${isDev ? "dev " : ""}packages`);
      return true;
    } catch (error) {
      spinner.fail("Package installation failed");
      UI.log.error(error.message);
      return false;
    }
  }

  async installSuggestedAddons(suggestions = []) {
    if (!suggestions || suggestions.length === 0) return;

    const addonPackages = [];
    for (const s of suggestions) {
      // future: map suggestions to concrete packages
      // placeholder keeps API stable
    }

    if (addonPackages.length > 0) {
      await this.installPackages(addonPackages, true);
    }
  }
}
