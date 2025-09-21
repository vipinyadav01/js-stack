import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import chalk from "chalk";

/**
 * Conflict resolution system for overlapping templates
 */
export class ConflictResolver {
  constructor() {
    this.rules = {
      // Later templates override earlier ones
      override: [
        'src/**/*',
        'components/**/*',
        'pages/**/*',
        'routes/**/*',
        '*.config.js',
        '*.config.ts',
        '*.config.json'
      ],
      
      // Merge dependencies in package.json
      merge: [
        'package.json'
      ],
      
      // Append to files
      append: [
        '.env',
        '.env.example',
        '.gitignore',
        'README.md'
      ],
      
      // Special renaming rules
      rename: {
        '_gitignore': '.gitignore',
        '_npmrc': '.npmrc',
        '_env': '.env'
      }
    };
  }

  /**
   * Resolve conflicts between templates
   * @param {string} targetPath - Target file path
   * @param {string} sourcePath - Source file path
   * @param {string} layer - Template layer (base, framework, etc.)
   * @returns {Object} - Resolution result
   */
  resolveConflict(targetPath, sourcePath, layer) {
    const relativePath = this.getRelativePath(targetPath);
    
    // Check for special renaming
    if (this.rules.rename[relativePath]) {
      return {
        action: 'rename',
        newPath: this.rules.rename[relativePath],
        reason: 'Special file naming rule'
      };
    }

    // Check for merge rules
    if (this.rules.merge.some(pattern => this.matchesPattern(relativePath, pattern))) {
      return {
        action: 'merge',
        reason: 'File requires merging (package.json, etc.)'
      };
    }

    // Check for append rules
    if (this.rules.append.some(pattern => this.matchesPattern(relativePath, pattern))) {
      return {
        action: 'append',
        reason: 'File content should be appended'
      };
    }

    // Check for override rules
    if (this.rules.override.some(pattern => this.matchesPattern(relativePath, pattern))) {
      return {
        action: 'override',
        reason: 'Later template overrides earlier one'
      };
    }

    // Default: override
    return {
      action: 'override',
      reason: 'Default behavior: later template wins'
    };
  }

  /**
   * Merge package.json files
   * @param {Object} targetPackage - Target package.json
   * @param {Object} sourcePackage - Source package.json
   * @returns {Object} - Merged package.json
   */
  mergePackageJson(targetPackage, sourcePackage) {
    const merged = { ...targetPackage };

    // Merge dependencies
    if (sourcePackage.dependencies) {
      merged.dependencies = {
        ...merged.dependencies,
        ...sourcePackage.dependencies
      };
    }

    // Merge devDependencies
    if (sourcePackage.devDependencies) {
      merged.devDependencies = {
        ...merged.devDependencies,
        ...sourcePackage.devDependencies
      };
    }

    // Merge scripts
    if (sourcePackage.scripts) {
      merged.scripts = {
        ...merged.scripts,
        ...sourcePackage.scripts
      };
    }

    // Merge other properties (keep target values, add missing from source)
    Object.keys(sourcePackage).forEach(key => {
      if (!['dependencies', 'devDependencies', 'scripts'].includes(key)) {
        if (!merged[key]) {
          merged[key] = sourcePackage[key];
        }
      }
    });

    return merged;
  }

  /**
   * Append content to file
   * @param {string} targetPath - Target file path
   * @param {string} content - Content to append
   * @param {string} separator - Separator between existing and new content
   */
  appendToFile(targetPath, content, separator = '\n') {
    let existingContent = '';
    
    if (existsSync(targetPath)) {
      existingContent = readFileSync(targetPath, 'utf-8');
    }

    const newContent = existingContent + separator + content;
    writeFileSync(targetPath, newContent, 'utf-8');
  }

  /**
   * Get relative path from project root
   * @param {string} filePath - Full file path
   * @returns {string} - Relative path
   */
  getRelativePath(filePath) {
    // Remove project directory prefix
    const parts = filePath.split('/');
    const projectIndex = parts.findIndex(part => part.endsWith('.json') || part === 'src' || part === 'components');
    
    if (projectIndex > 0) {
      return parts.slice(projectIndex).join('/');
    }
    
    return filePath;
  }

  /**
   * Check if path matches pattern
   * @param {string} path - File path
   * @param {string} pattern - Pattern to match
   * @returns {boolean} - Whether path matches pattern
   */
  matchesPattern(path, pattern) {
    // Simple glob pattern matching
    if (pattern.includes('**')) {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(path);
    }
    
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(path);
    }
    
    return path === pattern || path.endsWith(pattern);
  }

  /**
   * Display conflict resolution summary
   * @param {Array} conflicts - Array of resolved conflicts
   */
  displaySummary(conflicts) {
    if (conflicts.length === 0) {
      console.log(chalk.green('✅ No conflicts detected'));
      return;
    }

    console.log(chalk.blue.bold('\n🔧 Conflict Resolution Summary:'));
    
    const actions = {
      override: conflicts.filter(c => c.action === 'override'),
      merge: conflicts.filter(c => c.action === 'merge'),
      append: conflicts.filter(c => c.action === 'append'),
      rename: conflicts.filter(c => c.action === 'rename')
    };

    if (actions.override.length > 0) {
      console.log(chalk.yellow(`\n📝 Overridden files (${actions.override.length}):`));
      actions.override.forEach(conflict => {
        console.log(chalk.gray(`  • ${conflict.file} - ${conflict.reason}`));
      });
    }

    if (actions.merge.length > 0) {
      console.log(chalk.cyan(`\n🔀 Merged files (${actions.merge.length}):`));
      actions.merge.forEach(conflict => {
        console.log(chalk.gray(`  • ${conflict.file} - ${conflict.reason}`));
      });
    }

    if (actions.append.length > 0) {
      console.log(chalk.green(`\n➕ Appended to files (${actions.append.length}):`));
      actions.append.forEach(conflict => {
        console.log(chalk.gray(`  • ${conflict.file} - ${conflict.reason}`));
      });
    }

    if (actions.rename.length > 0) {
      console.log(chalk.magenta(`\n🏷️  Renamed files (${actions.rename.length}):`));
      actions.rename.forEach(conflict => {
        console.log(chalk.gray(`  • ${conflict.file} → ${conflict.newPath} - ${conflict.reason}`));
      });
    }

    console.log();
  }
}

export default ConflictResolver;
