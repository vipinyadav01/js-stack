import { intro, outro, text, select, multiselect, confirm, spinner, cancel, isCancel, note, log } from '@clack/prompts';
import chalk from 'chalk';
import gradient from 'gradient-string';
import validatePackageName from 'validate-npm-package-name';
import boxen from 'boxen';
import { 
  DATABASE_OPTIONS, 
  ORM_OPTIONS, 
  BACKEND_OPTIONS, 
  FRONTEND_OPTIONS,
  PACKAGE_MANAGER_OPTIONS,
  AUTH_OPTIONS,
  ADDON_OPTIONS
} from './types.js';
import { displayBanner, displayWelcome, createModernSpinner } from './utils/modern-render.js';

// Gradient presets
const g = {
  title: gradient(['#5ee7df', '#b490ca']),
  success: gradient(['#77a1d3', '#79cbca']),
  warning: gradient(['#ff5f6d', '#ffc371']),
  info: gradient(['#bdfff3', '#4ac29a'])
};

export async function promptProjectName(suggestedName) {
  console.log();
  console.log(g.title('🏗️  Project Setup'));
  console.log();
  
  const projectName = await text({
    message: chalk.cyan('What should we call your project?'),
    placeholder: suggestedName || 'my-awesome-app',
    defaultValue: suggestedName || '',
    validate(value) {
      if (!value) return chalk.red('⚠️  Project name is required');
      
      const validation = validatePackageName(value);
      if (!validation.validForNewPackages) {
        const errors = [
          ...(validation.errors || []),
          ...(validation.warnings || [])
        ];
        return chalk.red(`⚠️  ${errors[0] || 'Invalid project name'}`);
      }
    }
  });

  if (isCancel(projectName)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return projectName;
}

export async function promptDatabase() {
  console.log();
  console.log(g.info('💾 Database Configuration'));
  
  const database = await select({
    message: chalk.cyan('Choose your database'),
    options: [
      { 
        value: DATABASE_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip database'),
        hint: 'No database integration'
      },
      { 
        value: DATABASE_OPTIONS.SQLITE, 
        label: `${chalk.yellow('💾')} SQLite`,
        hint: 'Lightweight, file-based, perfect for development'
      },
      { 
        value: DATABASE_OPTIONS.POSTGRES, 
        label: `${chalk.blue('🐘')} PostgreSQL`,
        hint: 'Advanced features, enterprise-ready'
      },
      { 
        value: DATABASE_OPTIONS.MYSQL, 
        label: `${chalk.cyan('🐬')} MySQL`,
        hint: 'Popular, well-supported, reliable'
      },
      { 
        value: DATABASE_OPTIONS.MONGODB, 
        label: `${chalk.green('🍃')} MongoDB`,
        hint: 'NoSQL, flexible schemas, scalable'
      },
    ],
  });

  if (isCancel(database)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return database;
}

export async function promptORM(database) {
  if (database === DATABASE_OPTIONS.NONE) {
    return ORM_OPTIONS.NONE;
  }

  console.log();
  console.log(g.info('🔧 ORM/ODM Selection'));
  
  const ormOptions = [];
  
  if (database === DATABASE_OPTIONS.MONGODB) {
    ormOptions.push(
      { 
        value: ORM_OPTIONS.MONGOOSE, 
        label: `${chalk.green('🍃')} Mongoose`,
        hint: 'Elegant MongoDB object modeling'
      },
      { 
        value: ORM_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip ORM'),
        hint: 'Use native MongoDB driver'
      }
    );
  } else {
    ormOptions.push(
      { 
        value: ORM_OPTIONS.PRISMA, 
        label: `${chalk.magenta('▲')} Prisma`,
        hint: 'Modern, type-safe, auto-generated queries'
      },
      { 
        value: ORM_OPTIONS.SEQUELIZE, 
        label: `${chalk.blue('🔷')} Sequelize`,
        hint: 'Feature-rich, supports multiple databases'
      },
      { 
        value: ORM_OPTIONS.TYPEORM, 
        label: `${chalk.cyan('📘')} TypeORM`,
        hint: 'TypeScript-first, decorators, migrations'
      },
      { 
        value: ORM_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip ORM'),
        hint: 'Use raw SQL queries'
      }
    );
  }

  const orm = await select({
    message: chalk.cyan('Select an ORM/ODM'),
    options: ormOptions,
  });

  if (isCancel(orm)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return orm;
}

export async function promptBackend() {
  console.log();
  console.log(g.info('⚙️  Backend Framework'));
  
  const backend = await select({
    message: chalk.cyan('Choose your backend framework'),
    options: [
      { 
        value: BACKEND_OPTIONS.EXPRESS, 
        label: `${chalk.green('🚂')} Express`,
        hint: 'Minimal, flexible, huge ecosystem'
      },
      { 
        value: BACKEND_OPTIONS.FASTIFY, 
        label: `${chalk.yellow('⚡')} Fastify`,
        hint: 'High performance, schema-based'
      },
      { 
        value: BACKEND_OPTIONS.NESTJS, 
        label: `${chalk.red('🦁')} NestJS`,
        hint: 'Enterprise-grade, Angular-inspired'
      },
      { 
        value: BACKEND_OPTIONS.KOA, 
        label: `${chalk.blue('🌊')} Koa`,
        hint: 'Modern, lightweight, by Express team'
      },
      { 
        value: BACKEND_OPTIONS.HAPI, 
        label: `${chalk.magenta('🎪')} Hapi`,
        hint: 'Configuration-centric, battle-tested'
      },
      { 
        value: BACKEND_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip backend'),
        hint: 'Frontend only project'
      },
    ],
  });

  if (isCancel(backend)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return backend;
}

export async function promptFrontend() {
  console.log();
  console.log(g.info('🎨 Frontend Framework'));
  
  const frontend = await multiselect({
    message: chalk.cyan('Select frontend framework(s)'),
    options: [
      { 
        value: FRONTEND_OPTIONS.REACT, 
        label: `${chalk.cyan('⚛️')} React`,
        hint: 'Component-based, virtual DOM, huge ecosystem'
      },
      { 
        value: FRONTEND_OPTIONS.NEXTJS, 
        label: `${chalk.white('▲')} Next.js`,
        hint: 'Full-stack React framework with SSR/SSG'
      },
      { 
        value: FRONTEND_OPTIONS.VUE, 
        label: `${chalk.green('💚')} Vue`,
        hint: 'Progressive, approachable, versatile'
      },
      { 
        value: FRONTEND_OPTIONS.NUXT, 
        label: `${chalk.green('💚')} Nuxt`,
        hint: 'Full-stack Vue framework'
      },
      { 
        value: FRONTEND_OPTIONS.ANGULAR, 
        label: `${chalk.red('🅰️')} Angular`,
        hint: 'Full-featured, TypeScript-first'
      },
      { 
        value: FRONTEND_OPTIONS.SVELTE, 
        label: `${chalk.orange('🔥')} Svelte`,
        hint: 'Compile-time optimized, no virtual DOM'
      },
      { 
        value: FRONTEND_OPTIONS.REACT_NATIVE, 
        label: `${chalk.blue('📱')} React Native`,
        hint: 'Build native mobile apps'
      },
      { 
        value: FRONTEND_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip frontend'),
        hint: 'Backend only project'
      },
    ],
    required: false,
  });

  if (isCancel(frontend)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return frontend.length === 0 ? [FRONTEND_OPTIONS.NONE] : frontend;
}

export async function promptAuth() {
  console.log();
  console.log(g.info('🔐 Authentication Setup'));
  
  const auth = await select({
    message: chalk.cyan('Choose authentication method'),
    options: [
      { 
        value: AUTH_OPTIONS.JWT, 
        label: `${chalk.yellow('🔑')} JWT`,
        hint: 'JSON Web Tokens - stateless, scalable'
      },
      { 
        value: AUTH_OPTIONS.PASSPORT, 
        label: `${chalk.blue('🛂')} Passport`,
        hint: 'Multiple strategies, OAuth support'
      },
      { 
        value: AUTH_OPTIONS.AUTH0, 
        label: `${chalk.green('🔒')} Auth0`,
        hint: 'Managed authentication service'
      },
      { 
        value: AUTH_OPTIONS.FIREBASE, 
        label: `${chalk.orange('🔥')} Firebase Auth`,
        hint: 'Google\'s authentication service'
      },
      { 
        value: AUTH_OPTIONS.NONE, 
        label: chalk.gray('⏭️  Skip authentication'),
        hint: 'No authentication needed'
      },
    ],
  });

  if (isCancel(auth)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return auth;
}

export async function promptAddons() {
  console.log();
  console.log(g.info('🛠️  Development Tools'));
  
  const addons = await multiselect({
    message: chalk.cyan('Select additional tools'),
    options: [
      { 
        value: ADDON_OPTIONS.ESLINT, 
        label: `${chalk.blue('🔍')} ESLint`,
        hint: 'Code linting and error checking'
      },
      { 
        value: ADDON_OPTIONS.PRETTIER, 
        label: `${chalk.magenta('✨')} Prettier`,
        hint: 'Automatic code formatting'
      },
      { 
        value: ADDON_OPTIONS.HUSKY, 
        label: `${chalk.yellow('🐕')} Husky`,
        hint: 'Git hooks for better commits'
      },
      { 
        value: ADDON_OPTIONS.DOCKER, 
        label: `${chalk.blue('🐳')} Docker`,
        hint: 'Container configuration'
      },
      { 
        value: ADDON_OPTIONS.GITHUB_ACTIONS, 
        label: `${chalk.black('🔄')} GitHub Actions`,
        hint: 'CI/CD workflows'
      },
      { 
        value: ADDON_OPTIONS.TESTING, 
        label: `${chalk.green('🧪')} Testing`,
        hint: 'Jest & Testing Library setup'
      },
    ],
    required: false,
    initialValues: [ADDON_OPTIONS.ESLINT, ADDON_OPTIONS.PRETTIER],
  });

  if (isCancel(addons)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return addons;
}

export async function promptPackageManager() {
  console.log();
  console.log(g.info('📦 Package Manager'));
  
  const pm = await select({
    message: chalk.cyan('Choose your package manager'),
    options: [
      { 
        value: PACKAGE_MANAGER_OPTIONS.NPM, 
        label: `${chalk.red('📦')} npm`,
        hint: 'Default Node.js package manager'
      },
      { 
        value: PACKAGE_MANAGER_OPTIONS.YARN, 
        label: `${chalk.blue('🧶')} Yarn`,
        hint: 'Fast, reliable, secure'
      },
      { 
        value: PACKAGE_MANAGER_OPTIONS.PNPM, 
        label: `${chalk.yellow('📦')} pnpm`,
        hint: 'Fast, disk space efficient'
      },
      { 
        value: PACKAGE_MANAGER_OPTIONS.BUN, 
        label: `${chalk.gray('🥟')} Bun`,
        hint: 'All-in-one JavaScript runtime'
      },
    ],
  });

  if (isCancel(pm)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return pm;
}

export async function promptGit() {
  const git = await confirm({
    message: chalk.cyan('Initialize git repository?'),
    initialValue: true,
  });

  if (isCancel(git)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return git;
}

export async function promptInstall() {
  const install = await confirm({
    message: chalk.cyan('Install dependencies now?'),
    initialValue: true,
  });

  if (isCancel(install)) {
    cancel(chalk.red('Operation cancelled'));
    process.exit(0);
  }

  return install;
}

export async function collectProjectConfig(projectName, options = {}) {
  // Display banner if not in CI mode
  if (!options.ci) {
    await displayBanner();
    await displayWelcome();
  }

  const config = {
    projectName: projectName || await promptProjectName(),
    database: options.database || await promptDatabase(),
    backend: options.backend || await promptBackend(),
    frontend: options.frontend || await promptFrontend(),
    auth: options.auth || await promptAuth(),
    addons: options.addons || await promptAddons(),
    packageManager: options.pm || await promptPackageManager(),
    git: options.git !== false ? (options.git || await promptGit()) : false,
    install: options.install !== false ? (options.install || await promptInstall()) : false,
  };

  // Get ORM based on database selection
  config.orm = options.orm || await promptORM(config.database);

  // Show configuration summary
  if (!options.ci) {
    console.log();
    note(
      chalk.dim('Project: ') + chalk.cyan(config.projectName) + '\n' +
      chalk.dim('Stack: ') + chalk.yellow(`${config.backend} + ${config.frontend.join(', ')}`) + '\n' +
      chalk.dim('Database: ') + chalk.green(`${config.database}${config.orm !== 'none' ? ' + ' + config.orm : ''}`),
      g.success('Configuration Complete!')
    );
  }

  return config;
}

export { spinner, outro, intro, cancel, note, log };
