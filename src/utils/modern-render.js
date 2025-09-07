import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import boxen from 'boxen';
import Table from 'cli-table3';
import terminalLink from 'terminal-link';
import { createSpinner } from 'nanospinner';
import chalkAnimation from 'chalk-animation';

// Gradient themes
const gradients = {
  atlas: gradient(['#feac5e', '#c779d0', '#4bc0c8']),
  cristal: gradient(['#bdfff3', '#4ac29a']),
  teen: gradient(['#77a1d3', '#79cbca', '#e684ae']),
  mind: gradient(['#473b7b', '#3584a7', '#30d2be']),
  morning: gradient(['#ff5f6d', '#ffc371']),
  vice: gradient(['#5ee7df', '#b490ca']),
  passion: gradient(['#f43b47', '#453a94']),
  fruit: gradient(['#fa709a', '#fee140']),
  instagram: gradient(['#833ab4', '#fd1d1d', '#fcb045']),
  retro: gradient(['#3f51b1', '#5a55ae', '#7b5fac', '#8f48a8', '#a237a0']),
  summer: gradient(['#fdbb2d', '#22c1c3']),
  rainbow: gradient.rainbow,
  pastel: gradient.pastel
};

/**
 * Display animated banner
 */
export async function displayBanner() {
  console.clear();
  
  // Create ASCII art
  const title = figlet.textSync('JS Stack', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  });

  // Apply gradient
  console.log(gradients.passion(title));
  
  // Add animated tagline
  const tagline = chalkAnimation.rainbow('✨ Modern JavaScript Project Generator ✨');
  await sleep(2000);
  tagline.stop();
  
  console.log();
  console.log(boxen(
    chalk.cyan('Build full-stack JavaScript applications with ease!\n') +
    chalk.gray('Choose your stack • Generate instantly • Start coding'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1e1e1e'
    }
  ));
  console.log();
}

/**
 * Display welcome message with animation
 */
export async function displayWelcome() {
  const welcomeText = gradients.atlas.multiline([
    '╔════════════════════════════════════════╗',
    '║                                        ║',
    '║     Welcome to JS Stack Generator     ║',
    '║                                        ║',
    '╚════════════════════════════════════════╝'
  ].join('\n'));
  
  console.log(welcomeText);
  console.log();
  
  // Add pulsing effect
  const pulsingText = chalkAnimation.pulse('Let\'s create something amazing! 🚀');
  await sleep(1500);
  pulsingText.stop();
  console.log();
}

/**
 * Display configuration in a beautiful table
 */
export function displayConfigTable(config) {
  console.log();
  console.log(gradients.cristal('📋 Your Configuration'));
  console.log();
  
  const table = new Table({
    head: [chalk.cyan('Category'), chalk.cyan('Selection')],
    style: {
      head: [],
      border: ['cyan'],
      'padding-left': 2,
      'padding-right': 2
    },
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });

  // Add configuration rows with icons
  const rows = [
    ['📦 Project', chalk.yellow(config.projectName)],
    ['💾 Database', getIconForDatabase(config.database) + ' ' + chalk.green(config.database)],
    ['🔧 ORM', chalk.blue(config.orm)],
    ['⚙️  Backend', getIconForBackend(config.backend) + ' ' + chalk.magenta(config.backend)],
    ['🎨 Frontend', getIconForFrontend(config.frontend[0]) + ' ' + chalk.cyan(config.frontend.join(', '))],
    ['🔐 Auth', chalk.red(config.auth)],
    ['📦 Package Manager', chalk.white(config.packageManager)],
    ['🛠️  Addons', config.addons.length > 0 ? chalk.gray(config.addons.join(', ')) : chalk.dim('none')]
  ];

  rows.forEach(row => table.push(row));
  console.log(table.toString());
  console.log();
}

/**
 * Display step progress with animation
 */
export function createStepProgress(steps) {
  let currentStep = 0;
  const totalSteps = steps.length;
  
  return {
    nextStep: async (message) => {
      if (currentStep < totalSteps) {
        const step = steps[currentStep];
        const progress = `[${currentStep + 1}/${totalSteps}]`;
        
        console.log();
        console.log(
          chalk.dim(progress) + ' ' +
          gradients.morning(step.icon + ' ' + step.title)
        );
        
        if (message) {
          console.log(chalk.gray('  └─ ' + message));
        }
        
        currentStep++;
      }
    },
    complete: () => {
      console.log();
      console.log(gradients.summer('✅ All steps completed!'));
    }
  };
}

/**
 * Create modern spinner
 */
export function createModernSpinner(text) {
  return createSpinner(text, {
    color: 'cyan',
    spinner: {
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  });
}

/**
 * Display success message with celebration
 */
export async function displaySuccess(projectName, projectPath) {
  console.log();
  
  // Success banner
  const successBox = boxen(
    gradients.summer('🎉 PROJECT CREATED SUCCESSFULLY! 🎉\n\n') +
    chalk.white(`Project: ${chalk.bold.cyan(projectName)}\n`) +
    chalk.white(`Location: ${chalk.underline.gray(projectPath)}`),
    {
      padding: 2,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green',
      backgroundColor: '#0d1117'
    }
  );
  
  console.log(successBox);
  
  // Animated celebration
  const celebration = chalkAnimation.rainbow('🚀 Ready to build amazing things! 🚀');
  await sleep(2000);
  celebration.stop();
  console.log();
}

/**
 * Display next steps with links
 */
export function displayNextSteps(config) {
  console.log(gradients.vice('📚 Next Steps:'));
  console.log();
  
  const steps = [
    { 
      icon: '📁', 
      text: `Navigate to project: ${chalk.cyan(`cd ${config.projectName}`)}`
    },
    { 
      icon: '📦', 
      text: config.install ? 'Dependencies already installed!' : `Install dependencies: ${chalk.cyan(`${config.packageManager} install`)}`
    },
    { 
      icon: '🚀', 
      text: `Start development: ${chalk.cyan(`${config.packageManager} ${config.packageManager === 'npm' ? 'run ' : ''}dev`)}`
    },
    { 
      icon: '📖', 
      text: `Documentation: ${terminalLink('View Docs', 'https://github.com/yourusername/create-js-stack#readme')}`
    }
  ];
  
  steps.forEach((step, index) => {
    console.log(`  ${chalk.dim(`${index + 1}.`)} ${step.icon}  ${step.text}`);
  });
  
  console.log();
}

/**
 * Display error with style
 */
export function displayError(error, context) {
  console.log();
  console.log(boxen(
    chalk.red.bold('❌ ERROR OCCURRED\n\n') +
    chalk.white(`Context: ${context}\n`) +
    chalk.gray(`Message: ${error.message}\n\n`) +
    chalk.dim('Please check the error details above and try again.'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red',
      backgroundColor: '#1a0000'
    }
  ));
  console.log();
}

/**
 * Display available options in a grid
 */
export function displayOptionsGrid(title, options) {
  console.log();
  console.log(gradients.retro(title));
  console.log();
  
  const table = new Table({
    style: {
      border: ['cyan'],
      'padding-left': 1,
      'padding-right': 1
    },
    chars: {
      'mid': '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': ''
    }
  });
  
  // Create grid layout (3 columns)
  const columns = 3;
  const rows = [];
  let currentRow = [];
  
  Object.entries(options).forEach(([key, value], index) => {
    const formattedOption = `${value.icon || '•'} ${chalk.bold(key)}\n  ${chalk.dim(value.description || value)}`;
    currentRow.push(formattedOption);
    
    if ((index + 1) % columns === 0 || index === Object.entries(options).length - 1) {
      // Fill empty cells if needed
      while (currentRow.length < columns) {
        currentRow.push('');
      }
      rows.push(currentRow);
      currentRow = [];
    }
  });
  
  rows.forEach(row => table.push(row));
  console.log(table.toString());
  console.log();
}

// Helper functions
function getIconForDatabase(db) {
  const icons = {
    sqlite: '💾',
    postgres: '🐘',
    mysql: '🐬',
    mongodb: '🍃',
    none: '❌'
  };
  return icons[db] || '📊';
}

function getIconForBackend(backend) {
  const icons = {
    express: '🚂',
    fastify: '⚡',
    koa: '🌊',
    hapi: '🎪',
    nestjs: '🦁',
    none: '❌'
  };
  return icons[backend] || '⚙️';
}

function getIconForFrontend(frontend) {
  const icons = {
    react: '⚛️',
    vue: '💚',
    angular: '🅰️',
    svelte: '🔥',
    nextjs: '▲',
    nuxt: '💚',
    'react-native': '📱',
    none: '❌'
  };
  return icons[frontend] || '🎨';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  displayBanner,
  displayWelcome,
  displayConfigTable,
  createStepProgress,
  createModernSpinner,
  displaySuccess,
  displayNextSteps,
  displayError,
  displayOptionsGrid
};
