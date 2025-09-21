import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import { TECHNOLOGY_OPTIONS } from "../config/ValidationSchemas.js";

/**
 * Monorepo structure generator
 */
export class MonorepoGenerator {
  constructor(config) {
    this.config = config;
    this.projectDir = config.projectDir;
  }

  /**
   * Generate monorepo structure
   * @returns {Object} - Generation result
   */
  generateStructure() {
    const structure = {
      apps: [],
      packages: [],
      configs: []
    };

    // Create apps directory
    this.safeCreateDir(join(this.projectDir, 'apps'));

    // Create packages directory
    this.safeCreateDir(join(this.projectDir, 'packages'));

    // Create configs directory
    this.safeCreateDir(join(this.projectDir, 'configs'));

    // Generate frontend app
    if (this.config.frontend && this.config.frontend.length > 0) {
      const webApp = this.generateWebApp();
      structure.apps.push(webApp);
    }

    // Generate backend app
    if (this.config.backend && this.config.backend !== 'none') {
      const serverApp = this.generateServerApp();
      structure.apps.push(serverApp);
    }

    // Generate shared packages
    const sharedPackages = this.generateSharedPackages();
    structure.packages.push(...sharedPackages);

    // Generate configs
    const configs = this.generateConfigs();
    structure.configs.push(...configs);

    // Generate root package.json
    this.generateRootPackageJson();

    // Generate Turborepo config
    if (this.config.addons.includes('turborepo')) {
      this.generateTurborepoConfig();
    }

    return structure;
  }

  /**
   * Generate web app structure
   * @returns {Object} - Web app info
   */
  generateWebApp() {
    const webDir = join(this.projectDir, 'apps', 'web');
    this.safeCreateDir(webDir);

    // Create package.json for web app
    const webPackageJson = {
      name: `${this.config.projectName}-web`,
      version: "1.0.0",
      private: true,
      author: "Vipin Yadav",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
        lint: "eslint . --ext js,jsx,ts,tsx",
        format: "prettier --write ."
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@repo/ui": "workspace:*"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.2.0",
        "vite": "^5.0.0"
      }
    };

    this.safeWriteFile(
      join(webDir, 'package.json'),
      JSON.stringify(webPackageJson, null, 2)
    );

    return {
      name: 'web',
      path: 'apps/web',
      type: 'frontend',
      framework: this.config.frontend[0]
    };
  }

  /**
   * Generate server app structure
   * @returns {Object} - Server app info
   */
  generateServerApp() {
    const serverDir = join(this.projectDir, 'apps', 'server');
    this.safeCreateDir(serverDir);

    // Create package.json for server app
    const serverPackageJson = {
      name: `${this.config.projectName}-server`,
      version: "1.0.0",
      private: true,
      author: "Vipin Yadav",
      scripts: {
        dev: "tsx watch src/index.ts",
        build: "tsc",
        start: "node dist/index.js",
        lint: "eslint . --ext js,ts",
        format: "prettier --write ."
      },
      dependencies: {
        "express": "^4.18.0",
        "@repo/database": "workspace:*",
        "@repo/shared": "workspace:*"
      },
      devDependencies: {
        "@types/express": "^4.17.0",
        "tsx": "^4.0.0",
        "typescript": "^5.0.0"
      }
    };

    this.safeWriteFile(
      join(serverDir, 'package.json'),
      JSON.stringify(serverPackageJson, null, 2)
    );

    return {
      name: 'server',
      path: 'apps/server',
      type: 'backend',
      framework: this.config.backend
    };
  }

  /**
   * Generate shared packages
   * @returns {Array} - Array of shared packages
   */
  generateSharedPackages() {
    const packages = [];

    // UI package
    const uiPackage = this.generateUIPackage();
    packages.push(uiPackage);

    // Database package
    if (this.config.database !== 'none') {
      const dbPackage = this.generateDatabasePackage();
      packages.push(dbPackage);
    }

    // Shared utilities package
    const sharedPackage = this.generateSharedPackage();
    packages.push(sharedPackage);

    return packages;
  }

  /**
   * Generate UI package
   * @returns {Object} - UI package info
   */
  generateUIPackage() {
    const uiDir = join(this.projectDir, 'packages', 'ui');
    this.safeCreateDir(uiDir);

    const uiPackageJson = {
      name: "@repo/ui",
      version: "1.0.0",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      author: "Vipin Yadav",
      scripts: {
        build: "tsc",
        dev: "tsc --watch",
        lint: "eslint . --ext js,ts,tsx",
        format: "prettier --write ."
      },
      dependencies: {
        "react": "^18.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.0",
        "typescript": "^5.0.0"
      },
      peerDependencies: {
        "react": "^18.2.0"
      }
    };

    this.safeWriteFile(
      join(uiDir, 'package.json'),
      JSON.stringify(uiPackageJson, null, 2)
    );

    return {
      name: 'ui',
      path: 'packages/ui',
      type: 'shared-ui'
    };
  }

  /**
   * Generate database package
   * @returns {Object} - Database package info
   */
  generateDatabasePackage() {
    const dbDir = join(this.projectDir, 'packages', 'database');
    this.safeCreateDir(dbDir);

    const dbPackageJson = {
      name: "@repo/database",
      version: "1.0.0",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      author: "Vipin Yadav",
      scripts: {
        build: "tsc",
        dev: "tsc --watch",
        lint: "eslint . --ext js,ts",
        format: "prettier --write ."
      },
      dependencies: this.getDatabaseDependencies(),
      devDependencies: this.getDatabaseDevDependencies()
    };

    this.safeWriteFile(
      join(dbDir, 'package.json'),
      JSON.stringify(dbPackageJson, null, 2)
    );

    return {
      name: 'database',
      path: 'packages/database',
      type: 'shared-database'
    };
  }

  /**
   * Generate shared utilities package
   * @returns {Object} - Shared package info
   */
  generateSharedPackage() {
    const sharedDir = join(this.projectDir, 'packages', 'shared');
    this.safeCreateDir(sharedDir);

    const sharedPackageJson = {
      name: "@repo/shared",
      version: "1.0.0",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      author: "Vipin Yadav",
      scripts: {
        build: "tsc",
        dev: "tsc --watch",
        lint: "eslint . --ext js,ts",
        format: "prettier --write ."
      },
      dependencies: {},
      devDependencies: {
        "typescript": "^5.0.0"
      }
    };

    this.safeWriteFile(
      join(sharedDir, 'package.json'),
      JSON.stringify(sharedPackageJson, null, 2)
    );

    return {
      name: 'shared',
      path: 'packages/shared',
      type: 'shared-utils'
    };
  }

  /**
   * Generate configuration files
   * @returns {Array} - Array of config files
   */
  generateConfigs() {
    const configs = [];

    // ESLint config
    if (this.config.addons.includes('eslint')) {
      const eslintConfig = this.generateESLintConfig();
      configs.push(eslintConfig);
    }

    // TypeScript config
    if (this.config.typescript) {
      const tsConfig = this.generateTypeScriptConfig();
      configs.push(tsConfig);
    }

    // Prettier config
    if (this.config.addons.includes('prettier')) {
      const prettierConfig = this.generatePrettierConfig();
      configs.push(prettierConfig);
    }

    return configs;
  }

  /**
   * Generate ESLint configuration
   * @returns {Object} - ESLint config info
   */
  generateESLintConfig() {
    const eslintDir = join(this.projectDir, 'configs', 'eslint');
    this.safeCreateDir(eslintDir);

    const eslintPackageJson = {
      name: "@repo/eslint-config",
      version: "1.0.0",
      main: "index.js",
      author: "Vipin Yadav",
      dependencies: {
        "eslint": "^8.0.0",
        "@eslint/js": "^8.0.0"
      }
    };

    this.safeWriteFile(
      join(eslintDir, 'package.json'),
      JSON.stringify(eslintPackageJson, null, 2)
    );

    return {
      name: 'eslint-config',
      path: 'configs/eslint',
      type: 'eslint'
    };
  }

  /**
   * Generate TypeScript configuration
   * @returns {Object} - TypeScript config info
   */
  generateTypeScriptConfig() {
    const tsDir = join(this.projectDir, 'configs', 'typescript');
    this.safeCreateDir(tsDir);

    const tsPackageJson = {
      name: "@repo/typescript-config",
      version: "1.0.0",
      main: "base.json",
      author: "Vipin Yadav",
      dependencies: {
        "typescript": "^5.0.0"
      }
    };

    this.safeWriteFile(
      join(tsDir, 'package.json'),
      JSON.stringify(tsPackageJson, null, 2)
    );

    return {
      name: 'typescript-config',
      path: 'configs/typescript',
      type: 'typescript'
    };
  }

  /**
   * Generate Prettier configuration
   * @returns {Object} - Prettier config info
   */
  generatePrettierConfig() {
    const prettierDir = join(this.projectDir, 'configs', 'prettier');
    this.safeCreateDir(prettierDir);

    const prettierPackageJson = {
      name: "@repo/prettier-config",
      version: "1.0.0",
      main: "index.js",
      author: "Vipin Yadav",
      dependencies: {
        "prettier": "^3.0.0"
      }
    };

    this.safeWriteFile(
      join(prettierDir, 'package.json'),
      JSON.stringify(prettierPackageJson, null, 2)
    );

    return {
      name: 'prettier-config',
      path: 'configs/prettier',
      type: 'prettier'
    };
  }

  /**
   * Generate root package.json
   */
  generateRootPackageJson() {
    const rootPackageJson = {
      name: this.config.projectName,
      version: "1.0.0",
      private: true,
      author: "Vipin Yadav",
      workspaces: [
        "apps/*",
        "packages/*",
        "configs/*"
      ],
      scripts: {
        "build": "turbo run build",
        "dev": "turbo run dev",
        "lint": "turbo run lint",
        "format": "turbo run format",
        "test": "turbo run test",
        "clean": "turbo run clean"
      },
      devDependencies: {
        "turbo": "^1.11.0"
      },
      packageManager: `${this.config.packageManager}@latest`
    };

    this.safeWriteFile(
      join(this.projectDir, 'package.json'),
      JSON.stringify(rootPackageJson, null, 2)
    );
  }

  /**
   * Generate Turborepo configuration
   */
  generateTurborepoConfig() {
    const turboConfig = {
      "$schema": "https://turbo.build/schema.json",
      "globalDependencies": ["**/.env.*local"],
      "pipeline": {
        "build": {
          "dependsOn": ["^build"],
          "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
        },
        "dev": {
          "cache": false,
          "persistent": true
        },
        "lint": {
          "dependsOn": ["^lint"]
        },
        "format": {
          "dependsOn": ["^format"]
        },
        "test": {
          "dependsOn": ["^build"],
          "outputs": ["coverage/**"]
        },
        "clean": {
          "cache": false
        }
      }
    };

    this.safeWriteFile(
      join(this.projectDir, 'turbo.json'),
      JSON.stringify(turboConfig, null, 2)
    );
  }

  /**
   * Get database dependencies based on ORM
   * @returns {Object} - Database dependencies
   */
  getDatabaseDependencies() {
    const deps = {};
    
    if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.PRISMA) {
      deps["@prisma/client"] = "^5.0.0";
    } else if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.MONGOOSE) {
      deps["mongoose"] = "^8.0.0";
    } else if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.SEQUELIZE) {
      deps["sequelize"] = "^6.0.0";
    } else if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.TYPEORM) {
      deps["typeorm"] = "^0.3.0";
    } else if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.DRIZZLE) {
      deps["drizzle-orm"] = "^0.29.0";
    }
    
    return deps;
  }

  /**
   * Get database dev dependencies based on ORM
   * @returns {Object} - Database dev dependencies
   */
  getDatabaseDevDependencies() {
    const deps = {
      "typescript": "^5.0.0"
    };
    
    if (this.config.orm === TECHNOLOGY_OPTIONS.ORM.PRISMA) {
      deps["prisma"] = "^5.0.0";
    }
    
    return deps;
  }

  /**
   * Safely create directory
   * @param {string} dirPath - Directory path
   */
  safeCreateDir(dirPath) {
    try {
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    } catch (error) {
      console.error(chalk.red(`Failed to create directory ${dirPath}:`), error.message);
      throw error;
    }
  }

  /**
   * Safely write file
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  safeWriteFile(filePath, content) {
    try {
      writeFileSync(filePath, content);
    } catch (error) {
      console.error(chalk.red(`Failed to write file ${filePath}:`), error.message);
      throw error;
    }
  }

  /**
   * Display monorepo structure
   * @param {Object} structure - Generated structure
   */
  displayStructure(structure) {
    console.log(chalk.blue.bold('\n📁 Monorepo Structure Generated:'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.cyan.bold('\n📱 Apps:'));
    structure.apps.forEach(app => {
      console.log(chalk.gray(`  • ${app.name} (${app.type}) - ${app.framework}`));
    });

    console.log(chalk.cyan.bold('\n📦 Packages:'));
    structure.packages.forEach(pkg => {
      console.log(chalk.gray(`  • ${pkg.name} (${pkg.type})`));
    });

    console.log(chalk.cyan.bold('\n⚙️  Configs:'));
    structure.configs.forEach(config => {
      console.log(chalk.gray(`  • ${config.name} (${config.type})`));
    });

    console.log();
  }
}

export default MonorepoGenerator;
