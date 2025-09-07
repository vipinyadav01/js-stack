import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

/**
 * Check if git is installed
 */
export async function isGitInstalled() {
  try {
    await execa('git', ['--version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize git repository
 */
export async function initGitRepo(projectDir) {
  try {
    // Check if git is installed
    if (!await isGitInstalled()) {
      console.log('Git is not installed. Skipping git initialization.');
      return false;
    }

    // Initialize git repo
    await execa('git', ['init'], { cwd: projectDir });
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
      await createGitignore(projectDir);
    }
    
    // Add all files to staging
    await execa('git', ['add', '.'], { cwd: projectDir });
    
    // Create initial commit
    await execa('git', ['commit', '-m', 'Initial commit'], { cwd: projectDir });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize git repository:', error.message);
    return false;
  }
}

/**
 * Create .gitignore file
 */
export async function createGitignore(projectDir) {
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Production
build/
dist/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*.swn
*.bak
.DS_Store
Thumbs.db

# Package manager
.npm
.yarn-integrity
.yarn/
.pnpm-store/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Misc
*.log
tmp/
temp/
`;

  const gitignorePath = path.join(projectDir, '.gitignore');
  await fs.writeFile(gitignorePath, gitignoreContent);
}

export default {
  isGitInstalled,
  initGitRepo,
  createGitignore
};
