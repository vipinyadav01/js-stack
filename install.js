#!/usr/bin/env node

/**
 * Installation helper script
 * Helps with first-time setup and resolves common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up create-js-stack-cli...\n');

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Function to run command safely
function runCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

// Create necessary directories
const dirs = [
  'dist',
  'templates',
  'scripts',
  '.husky'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create a dummy build script if it doesn't exist
const buildScriptPath = path.join('scripts', 'build.js');
if (!fs.existsSync(buildScriptPath)) {
  fs.writeFileSync(buildScriptPath, `
#!/usr/bin/env node
console.log('Building CLI...');
// Add your build logic here
console.log('Build complete!');
  `.trim());
  console.log('📝 Created build script');
}

// Install dependencies based on package manager
console.log('\n📦 Installing dependencies...\n');

// Detect package manager
let packageManager = 'npm';
if (fs.existsSync('pnpm-lock.yaml')) {
  packageManager = 'pnpm';
} else if (fs.existsSync('yarn.lock')) {
  packageManager = 'yarn';
}

console.log(`Using ${packageManager}...\n`);

// Install root dependencies
if (packageManager === 'npm') {
  console.log('Installing root dependencies...');
  runCommand('npm install --legacy-peer-deps');
  
  // Install husky separately if needed
  if (!fs.existsSync('.husky/_/husky.sh')) {
    console.log('\nSetting up Husky...');
    runCommand('npx husky install');
  }
  
  // Install web app dependencies
  console.log('\nInstalling web app dependencies...');
  runCommand('npm install --legacy-peer-deps', { cwd: 'apps/web' });
  
} else if (packageManager === 'pnpm') {
  runCommand('pnpm install');
} else if (packageManager === 'yarn') {
  runCommand('yarn install');
}

// Create .env files if they don't exist
if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
  fs.copyFileSync('.env.example', '.env');
  console.log('\n📝 Created .env from .env.example');
}

if (!fs.existsSync('apps/web/.env.local') && fs.existsSync('apps/web/.env.example')) {
  fs.copyFileSync('apps/web/.env.example', 'apps/web/.env.local');
  console.log('📝 Created apps/web/.env.local from .env.example');
}

console.log('\n✅ Setup complete!\n');
console.log('Next steps:');
console.log('1. Edit .env and apps/web/.env.local with your API keys');
console.log('2. Run "npm run dev" to start development');
console.log('3. Visit http://localhost:3000 for the web app');
console.log('\nFor CLI development: npm run dev:cli');
console.log('For web development: npm run dev:web');
console.log('\nHappy coding! 🎉');
