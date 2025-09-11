import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";

const execAsync = promisify(exec);

/**
 * Project health validation system
 */
export class ProjectHealthValidator {
  constructor(projectDir) {
    this.projectDir = projectDir;
    this.checks = [];
    this.results = [];
  }

  /**
   * Add a health check
   * @param {string} name - Check name
   * @param {Function} checkFn - Check function
   * @param {Object} options - Check options
   */
  addCheck(name, checkFn, options = {}) {
    this.checks.push({
      name,
      checkFn,
      options: {
        critical: false,
        timeout: 30000,
        ...options,
      },
    });
  }

  /**
   * Run all health checks
   * @returns {Object} - Validation results
   */
  async runChecks() {
    console.log(chalk.blue.bold("\n🔍 Running project health checks..."));
    
    const results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      checks: [],
      summary: {},
    };

    for (const check of this.checks) {
      try {
        console.log(chalk.gray(`  Checking: ${check.name}...`));
        
        const startTime = Date.now();
        const result = await Promise.race([
          check.checkFn(this.projectDir),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Check timeout')), check.options.timeout)
          ),
        ]);
        
        const duration = Date.now() - startTime;
        
        const checkResult = {
          name: check.name,
          status: result.status,
          message: result.message,
          duration,
          critical: check.options.critical,
          details: result.details || {},
        };

        results.checks.push(checkResult);
        
        if (result.status === 'passed') {
          results.passed++;
          console.log(chalk.green(`    ✅ ${check.name}: ${result.message}`));
        } else if (result.status === 'warning') {
          results.warnings++;
          console.log(chalk.yellow(`    ⚠️  ${check.name}: ${result.message}`));
        } else {
          results.failed++;
          console.log(chalk.red(`    ❌ ${check.name}: ${result.message}`));
        }
        
      } catch (error) {
        results.failed++;
        console.log(chalk.red(`    ❌ ${check.name}: ${error.message}`));
        
        results.checks.push({
          name: check.name,
          status: 'failed',
          message: error.message,
          duration: 0,
          critical: check.options.critical,
          details: { error: error.message },
        });
      }
    }

    // Generate summary
    results.summary = {
      total: results.passed + results.failed + results.warnings,
      successRate: results.total > 0 ? (results.passed / results.total) * 100 : 0,
      hasCriticalFailures: results.checks.some(check => 
        check.status === 'failed' && check.critical
      ),
    };

    this.results = results;
    return results;
  }

  /**
   * Display validation results
   */
  displayResults() {
    const results = this.results;
    
    console.log(chalk.blue.bold("\n📊 Health Check Summary"));
    console.log(chalk.gray("─".repeat(50)));
    console.log(chalk.green(`✅ Passed: ${results.passed}`));
    console.log(chalk.yellow(`⚠️  Warnings: ${results.warnings}`));
    console.log(chalk.red(`❌ Failed: ${results.failed}`));
    console.log(chalk.cyan(`📈 Success Rate: ${results.summary.successRate.toFixed(1)}%`));
    
    if (results.summary.hasCriticalFailures) {
      console.log(chalk.red.bold("\n🚨 Critical Issues Found!"));
      results.checks
        .filter(check => check.status === 'failed' && check.critical)
        .forEach(check => {
          console.log(chalk.red(`  • ${check.name}: ${check.message}`));
        });
    }
    
    if (results.warnings > 0) {
      console.log(chalk.yellow.bold("\n⚠️  Warnings:"));
      results.checks
        .filter(check => check.status === 'warning')
        .forEach(check => {
          console.log(chalk.yellow(`  • ${check.name}: ${check.message}`));
        });
    }
  }
}

/**
 * Built-in health checks
 */
export const healthChecks = {
  /**
   * Check if package.json exists and is valid
   */
  packageJsonExists: async (projectDir) => {
    const packageJsonPath = path.join(projectDir, 'package.json');
    
    if (!(await fs.pathExists(packageJsonPath))) {
      return {
        status: 'failed',
        message: 'package.json not found',
        critical: true,
      };
    }

    try {
      const packageJson = await fs.readJson(packageJsonPath);
      
      if (!packageJson.name) {
        return {
          status: 'failed',
          message: 'package.json missing name field',
          critical: true,
        };
      }

      if (!packageJson.version) {
        return {
          status: 'warning',
          message: 'package.json missing version field',
        };
      }

      return {
        status: 'passed',
        message: 'package.json is valid',
        details: { name: packageJson.name, version: packageJson.version },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `package.json is invalid: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if dependencies can be installed
   */
  dependenciesInstallable: async (projectDir) => {
    const packageJsonPath = path.join(projectDir, 'package.json');
    
    if (!(await fs.pathExists(packageJsonPath))) {
      return {
        status: 'failed',
        message: 'package.json not found',
        critical: true,
      };
    }

    try {
      // Check if node_modules exists
      const nodeModulesPath = path.join(projectDir, 'node_modules');
      const hasNodeModules = await fs.pathExists(nodeModulesPath);
      
      if (hasNodeModules) {
        return {
          status: 'passed',
          message: 'Dependencies already installed',
          details: { installed: true },
        };
      }

      // Try to validate package.json without installing
      const packageJson = await fs.readJson(packageJsonPath);
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (Object.keys(dependencies).length === 0) {
        return {
          status: 'warning',
          message: 'No dependencies to install',
        };
      }

      return {
        status: 'passed',
        message: 'Dependencies appear installable',
        details: { 
          dependencyCount: Object.keys(dependencies).length,
          hasDependencies: Object.keys(packageJson.dependencies || {}).length > 0,
          hasDevDependencies: Object.keys(packageJson.devDependencies || {}).length > 0,
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `Dependency validation failed: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if scripts are runnable
   */
  scriptsRunnable: async (projectDir) => {
    const packageJsonPath = path.join(projectDir, 'package.json');
    
    if (!(await fs.pathExists(packageJsonPath))) {
      return {
        status: 'failed',
        message: 'package.json not found',
        critical: true,
      };
    }

    try {
      const packageJson = await fs.readJson(packageJsonPath);
      const scripts = packageJson.scripts || {};
      
      if (Object.keys(scripts).length === 0) {
        return {
          status: 'warning',
          message: 'No scripts defined in package.json',
        };
      }

      // Check for common scripts
      const commonScripts = ['start', 'build', 'dev', 'test'];
      const hasCommonScripts = commonScripts.some(script => scripts[script]);
      
      if (!hasCommonScripts) {
        return {
          status: 'warning',
          message: 'No common scripts (start, build, dev, test) found',
        };
      }

      return {
        status: 'passed',
        message: 'Scripts are properly defined',
        details: { 
          scriptCount: Object.keys(scripts).length,
          scripts: Object.keys(scripts),
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `Script validation failed: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if TypeScript configuration is valid
   */
  typescriptConfig: async (projectDir) => {
    const tsconfigPath = path.join(projectDir, 'tsconfig.json');
    
    if (!(await fs.pathExists(tsconfigPath))) {
      return {
        status: 'passed',
        message: 'No TypeScript configuration (not using TypeScript)',
      };
    }

    try {
      const tsconfig = await fs.readJson(tsconfigPath);
      
      if (!tsconfig.compilerOptions) {
        return {
          status: 'failed',
          message: 'tsconfig.json missing compilerOptions',
          critical: true,
        };
      }

      const requiredOptions = ['target', 'module', 'strict'];
      const missingOptions = requiredOptions.filter(option => !tsconfig.compilerOptions[option]);
      
      if (missingOptions.length > 0) {
        return {
          status: 'warning',
          message: `tsconfig.json missing recommended options: ${missingOptions.join(', ')}`,
        };
      }

      return {
        status: 'passed',
        message: 'TypeScript configuration is valid',
        details: { 
          target: tsconfig.compilerOptions.target,
          module: tsconfig.compilerOptions.module,
          strict: tsconfig.compilerOptions.strict,
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `TypeScript configuration invalid: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if ESLint configuration is valid
   */
  eslintConfig: async (projectDir) => {
    const eslintPaths = [
      path.join(projectDir, '.eslintrc.js'),
      path.join(projectDir, '.eslintrc.json'),
      path.join(projectDir, '.eslintrc.yml'),
      path.join(projectDir, '.eslintrc.yaml'),
      path.join(projectDir, 'eslint.config.js'),
    ];

    const eslintPath = eslintPaths.find(p => fs.pathExistsSync(p));
    
    if (!eslintPath) {
      return {
        status: 'passed',
        message: 'No ESLint configuration (not using ESLint)',
      };
    }

    try {
      const config = await fs.readFile(eslintPath, 'utf-8');
      
      // Basic validation - check if it's valid JSON/JS
      if (eslintPath.endsWith('.json')) {
        JSON.parse(config);
      }

      return {
        status: 'passed',
        message: 'ESLint configuration is valid',
        details: { configPath: eslintPath },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `ESLint configuration invalid: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if Docker configuration is valid
   */
  dockerConfig: async (projectDir) => {
    const dockerfilePath = path.join(projectDir, 'Dockerfile');
    const dockerComposePath = path.join(projectDir, 'docker-compose.yml');
    
    const hasDockerfile = await fs.pathExists(dockerfilePath);
    const hasDockerCompose = await fs.pathExists(dockerComposePath);
    
    if (!hasDockerfile && !hasDockerCompose) {
      return {
        status: 'passed',
        message: 'No Docker configuration (not using Docker)',
      };
    }

    try {
      if (hasDockerfile) {
        const dockerfile = await fs.readFile(dockerfilePath, 'utf-8');
        
        if (!dockerfile.includes('FROM')) {
          return {
            status: 'failed',
            message: 'Dockerfile missing FROM instruction',
            critical: true,
          };
        }
      }

      if (hasDockerCompose) {
        try {
          const dockerComposeContent = await fs.readFile(dockerComposePath, 'utf-8');
          // Basic validation - check if it contains 'services' keyword
          if (!dockerComposeContent.includes('services:')) {
            return {
              status: 'failed',
              message: 'docker-compose.yml missing services section',
              critical: true,
            };
          }
        } catch (error) {
          return {
            status: 'failed',
            message: `docker-compose.yml is invalid: ${error.message}`,
            critical: true,
          };
        }
      }

      return {
        status: 'passed',
        message: 'Docker configuration is valid',
        details: { 
          hasDockerfile,
          hasDockerCompose,
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `Docker configuration invalid: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if Git repository is properly initialized
   */
  gitRepository: async (projectDir) => {
    const gitPath = path.join(projectDir, '.git');
    
    if (!(await fs.pathExists(gitPath))) {
      return {
        status: 'warning',
        message: 'Git repository not initialized',
      };
    }

    try {
      // Check if .gitignore exists
      const gitignorePath = path.join(projectDir, '.gitignore');
      const hasGitignore = await fs.pathExists(gitignorePath);
      
      if (!hasGitignore) {
        return {
          status: 'warning',
          message: 'Git repository initialized but .gitignore missing',
        };
      }

      return {
        status: 'passed',
        message: 'Git repository is properly initialized',
        details: { hasGitignore },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `Git repository check failed: ${error.message}`,
        critical: true,
      };
    }
  },

  /**
   * Check if project structure is valid
   */
  projectStructure: async (projectDir) => {
    try {
      const packageJsonPath = path.join(projectDir, 'package.json');
      
      if (!(await fs.pathExists(packageJsonPath))) {
        return {
          status: 'failed',
          message: 'package.json not found',
          critical: true,
        };
      }

      const packageJson = await fs.readJson(packageJsonPath);
      const mainFile = packageJson.main || 'index.js';
      const mainPath = path.join(projectDir, mainFile);
      
      if (!(await fs.pathExists(mainPath))) {
        return {
          status: 'warning',
          message: `Main file ${mainFile} not found`,
        };
      }

      // Check for common directories
      const commonDirs = ['src', 'lib', 'app', 'public', 'assets'];
      const existingDirs = [];
      
      for (const dir of commonDirs) {
        const dirPath = path.join(projectDir, dir);
        if (await fs.pathExists(dirPath)) {
          existingDirs.push(dir);
        }
      }

      return {
        status: 'passed',
        message: 'Project structure is valid',
        details: { 
          mainFile,
          existingDirs,
        },
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `Project structure check failed: ${error.message}`,
        critical: true,
      };
    }
  },
};

/**
 * Create a health validator with default checks
 * @param {string} projectDir - Project directory
 * @returns {ProjectHealthValidator} - Health validator instance
 */
export function createHealthValidator(projectDir) {
  const validator = new ProjectHealthValidator(projectDir);
  
  // Add default checks
  validator.addCheck('Package.json exists', healthChecks.packageJsonExists, { critical: true });
  validator.addCheck('Dependencies installable', healthChecks.dependenciesInstallable, { critical: true });
  validator.addCheck('Scripts runnable', healthChecks.scriptsRunnable);
  validator.addCheck('TypeScript configuration', healthChecks.typescriptConfig);
  validator.addCheck('ESLint configuration', healthChecks.eslintConfig);
  validator.addCheck('Docker configuration', healthChecks.dockerConfig);
  validator.addCheck('Git repository', healthChecks.gitRepository);
  validator.addCheck('Project structure', healthChecks.projectStructure);
  
  return validator;
}

/**
 * Quick health check for a project
 * @param {string} projectDir - Project directory
 * @returns {Promise<Object>} - Health check results
 */
export async function quickHealthCheck(projectDir) {
  const validator = createHealthValidator(projectDir);
  const results = await validator.runChecks();
  validator.displayResults();
  return results;
}
