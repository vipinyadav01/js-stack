import chalk from "chalk";
import { 
  DATABASE_OPTIONS, 
  ORM_OPTIONS, 
  BACKEND_OPTIONS, 
  FRONTEND_OPTIONS,
  AUTH_OPTIONS 
} from "../types.js";

/**
 * Technology compatibility matrix
 * Defines which technologies work well together
 */
export const COMPATIBILITY_MATRIX = {
  // Database-ORM compatibility
  database_orm: {
    [DATABASE_OPTIONS.SQLITE]: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM],
    [DATABASE_OPTIONS.POSTGRES]: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM],
    [DATABASE_OPTIONS.MYSQL]: [ORM_OPTIONS.PRISMA, ORM_OPTIONS.SEQUELIZE, ORM_OPTIONS.TYPEORM],
    [DATABASE_OPTIONS.MONGODB]: [ORM_OPTIONS.MONGOOSE, ORM_OPTIONS.PRISMA],
    [DATABASE_OPTIONS.NONE]: [ORM_OPTIONS.NONE],
  },

  // Backend-Database compatibility
  backend_database: {
    [BACKEND_OPTIONS.EXPRESS]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.FASTIFY]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.KOA]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.HAPI]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.NESTJS]: Object.values(DATABASE_OPTIONS),
    [BACKEND_OPTIONS.NONE]: [DATABASE_OPTIONS.NONE],
  },

  // Frontend-Backend compatibility
  frontend_backend: {
    [FRONTEND_OPTIONS.REACT]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.VUE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.ANGULAR]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.SVELTE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.NEXTJS]: [BACKEND_OPTIONS.NONE], // Next.js is full-stack
    [FRONTEND_OPTIONS.NUXT]: [BACKEND_OPTIONS.NONE], // Nuxt is full-stack
    [FRONTEND_OPTIONS.REACT_NATIVE]: Object.values(BACKEND_OPTIONS),
    [FRONTEND_OPTIONS.NONE]: Object.values(BACKEND_OPTIONS),
  },

  // Auth-Backend compatibility
  auth_backend: {
    [AUTH_OPTIONS.JWT]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.PASSPORT]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.AUTH0]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.FIREBASE]: Object.values(BACKEND_OPTIONS),
    [AUTH_OPTIONS.NONE]: Object.values(BACKEND_OPTIONS),
  },
};

/**
 * Dependency version compatibility matrix
 * Ensures compatible package versions across the stack
 */
export const DEPENDENCY_VERSIONS = {
  // React ecosystem
  react: {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
  },
  
  // Vue ecosystem
  vue: {
    "vue": "^3.3.0",
    "@vitejs/plugin-vue": "^4.4.0",
  },

  // Express ecosystem
  express: {
    "express": "^4.18.0",
    "@types/express": "^4.17.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
  },

  // Database drivers
  database: {
    [DATABASE_OPTIONS.POSTGRES]: {
      "pg": "^8.11.0",
      "@types/pg": "^8.10.0",
    },
    [DATABASE_OPTIONS.MYSQL]: {
      "mysql2": "^3.6.0",
      "@types/mysql": "^2.15.0",
    },
    [DATABASE_OPTIONS.MONGODB]: {
      "mongodb": "^6.0.0",
    },
    [DATABASE_OPTIONS.SQLITE]: {
      "sqlite3": "^5.1.0",
    },
  },

  // ORM packages
  orm: {
    [ORM_OPTIONS.PRISMA]: {
      "prisma": "^5.0.0",
      "@prisma/client": "^5.0.0",
    },
    [ORM_OPTIONS.SEQUELIZE]: {
      "sequelize": "^6.32.0",
      "@types/sequelize": "^4.28.0",
    },
    [ORM_OPTIONS.MONGOOSE]: {
      "mongoose": "^7.5.0",
      "@types/mongoose": "^5.11.0",
    },
    [ORM_OPTIONS.TYPEORM]: {
      "typeorm": "^0.3.17",
      "reflect-metadata": "^0.1.13",
    },
  },

  // Authentication packages
  auth: {
    [AUTH_OPTIONS.JWT]: {
      "jsonwebtoken": "^9.0.0",
      "@types/jsonwebtoken": "^9.0.0",
    },
    [AUTH_OPTIONS.PASSPORT]: {
      "passport": "^0.6.0",
      "passport-jwt": "^4.0.0",
      "@types/passport": "^1.0.0",
    },
  },
};

/**
 * Validate technology compatibility
 * @param {Object} config - Project configuration
 * @returns {Object} - Validation result with errors and warnings
 */
export function validateCompatibility(config) {
  const errors = [];
  const warnings = [];

  // Check database-ORM compatibility
  if (config.database !== DATABASE_OPTIONS.NONE && config.orm !== ORM_OPTIONS.NONE) {
    const compatibleORMs = COMPATIBILITY_MATRIX.database_orm[config.database];
    if (!compatibleORMs.includes(config.orm)) {
      errors.push({
        type: 'incompatible',
        message: `${config.database} database is not compatible with ${config.orm} ORM`,
        suggestion: `Use one of: ${compatibleORMs.join(', ')}`,
      });
    }
  }

  // Check backend-database compatibility
  if (config.backend !== BACKEND_OPTIONS.NONE && config.database !== DATABASE_OPTIONS.NONE) {
    const compatibleDatabases = COMPATIBILITY_MATRIX.backend_database[config.backend];
    if (!compatibleDatabases.includes(config.database)) {
      warnings.push({
        type: 'suboptimal',
        message: `${config.backend} backend with ${config.database} database is not optimal`,
        suggestion: `Consider using: ${compatibleDatabases.join(', ')}`,
      });
    }
  }

  // Check frontend-backend compatibility
  if (config.frontend && config.frontend.length > 0) {
    for (const frontend of config.frontend) {
      if (frontend !== FRONTEND_OPTIONS.NONE) {
        const compatibleBackends = COMPATIBILITY_MATRIX.frontend_backend[frontend];
        if (config.backend !== BACKEND_OPTIONS.NONE && !compatibleBackends.includes(config.backend)) {
          warnings.push({
            type: 'suboptimal',
            message: `${frontend} frontend with ${config.backend} backend is not optimal`,
            suggestion: `Consider using: ${compatibleBackends.join(', ')}`,
          });
        }
      }
    }
  }

  // Check for full-stack frameworks
  if (config.frontend?.includes(FRONTEND_OPTIONS.NEXTJS) && config.backend !== BACKEND_OPTIONS.NONE) {
    warnings.push({
      type: 'redundant',
      message: 'Next.js includes backend functionality, separate backend may be redundant',
      suggestion: 'Consider using Next.js API routes instead',
    });
  }

  if (config.frontend?.includes(FRONTEND_OPTIONS.NUXT) && config.backend !== BACKEND_OPTIONS.NONE) {
    warnings.push({
      type: 'redundant',
      message: 'Nuxt.js includes backend functionality, separate backend may be redundant',
      suggestion: 'Consider using Nuxt.js server routes instead',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get compatible options for a given technology
 * @param {string} type - Technology type (database, orm, backend, frontend)
 * @param {string} currentValue - Current selected value
 * @param {Object} config - Current configuration
 * @returns {Array} - Compatible options
 */
export function getCompatibleOptions(type, currentValue, config) {
  switch (type) {
    case 'orm':
      if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
        return COMPATIBILITY_MATRIX.database_orm[config.database] || [];
      }
      return Object.values(ORM_OPTIONS);

    case 'database':
      if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
        return COMPATIBILITY_MATRIX.backend_database[config.backend] || [];
      }
      return Object.values(DATABASE_OPTIONS);

    case 'backend':
      if (config.frontend && config.frontend.length > 0) {
        const compatibleBackends = new Set();
        config.frontend.forEach(frontend => {
          COMPATIBILITY_MATRIX.frontend_backend[frontend]?.forEach(backend => {
            compatibleBackends.add(backend);
          });
        });
        return Array.from(compatibleBackends);
      }
      return Object.values(BACKEND_OPTIONS);

    default:
      return [];
  }
}

/**
 * Resolve dependency versions for a given configuration
 * @param {Object} config - Project configuration
 * @returns {Object} - Resolved dependencies
 */
export function resolveDependencies(config) {
  const dependencies = {};
  const devDependencies = {};

  // Add frontend dependencies
  if (config.frontend && config.frontend.length > 0) {
    config.frontend.forEach(frontend => {
      if (frontend !== FRONTEND_OPTIONS.NONE) {
        const frontendDeps = DEPENDENCY_VERSIONS[frontend];
        if (frontendDeps) {
          Object.assign(dependencies, frontendDeps);
        }
      }
    });
  }

  // Add backend dependencies
  if (config.backend && config.backend !== BACKEND_OPTIONS.NONE) {
    const backendDeps = DEPENDENCY_VERSIONS[config.backend];
    if (backendDeps) {
      Object.assign(dependencies, backendDeps);
    }
  }

  // Add database dependencies
  if (config.database && config.database !== DATABASE_OPTIONS.NONE) {
    const dbDeps = DEPENDENCY_VERSIONS.database[config.database];
    if (dbDeps) {
      Object.assign(dependencies, dbDeps);
    }
  }

  // Add ORM dependencies
  if (config.orm && config.orm !== ORM_OPTIONS.NONE) {
    const ormDeps = DEPENDENCY_VERSIONS.orm[config.orm];
    if (ormDeps) {
      Object.assign(dependencies, ormDeps);
    }
  }

  // Add auth dependencies
  if (config.auth && config.auth !== AUTH_OPTIONS.NONE) {
    const authDeps = DEPENDENCY_VERSIONS.auth[config.auth];
    if (authDeps) {
      Object.assign(dependencies, authDeps);
    }
  }

  return { dependencies, devDependencies };
}

/**
 * Display validation results in a user-friendly format
 * @param {Object} validation - Validation result
 */
export function displayValidationResults(validation) {
  if (validation.errors.length > 0) {
    console.log(chalk.red.bold("\n❌ Configuration Errors:"));
    validation.errors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.gray(`     💡 ${error.suggestion}`));
      }
    });
  }

  if (validation.warnings.length > 0) {
    console.log(chalk.yellow.bold("\n⚠️  Configuration Warnings:"));
    validation.warnings.forEach((warning, index) => {
      console.log(chalk.yellow(`  ${index + 1}. ${warning.message}`));
      if (warning.suggestion) {
        console.log(chalk.gray(`     💡 ${warning.suggestion}`));
      }
    });
  }

  if (validation.isValid && validation.warnings.length === 0) {
    console.log(chalk.green.bold("\n✅ Configuration is valid!"));
  }
}

/**
 * Preset configurations for common use cases
 */
export const PRESET_CONFIGS = {
  'saas-app': {
    name: 'SaaS Application',
    description: 'Full-stack SaaS application with authentication',
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.REACT],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: 'npm',
      addons: ['typescript', 'eslint', 'prettier', 'docker', 'testing'],
    },
  },
  'api-service': {
    name: 'API Service',
    description: 'RESTful API service with database',
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.JWT,
      packageManager: 'npm',
      addons: ['typescript', 'eslint', 'prettier', 'docker', 'testing'],
    },
  },
  'mobile-app': {
    name: 'Mobile Application',
    description: 'React Native mobile app with backend',
    config: {
      backend: BACKEND_OPTIONS.EXPRESS,
      frontend: [FRONTEND_OPTIONS.REACT_NATIVE],
      database: DATABASE_OPTIONS.MONGODB,
      orm: ORM_OPTIONS.MONGOOSE,
      auth: AUTH_OPTIONS.FIREBASE,
      packageManager: 'npm',
      addons: ['typescript', 'eslint', 'prettier'],
    },
  },
  'fullstack-nextjs': {
    name: 'Next.js Full-Stack',
    description: 'Next.js application with API routes',
    config: {
      backend: BACKEND_OPTIONS.NONE,
      frontend: [FRONTEND_OPTIONS.NEXTJS],
      database: DATABASE_OPTIONS.POSTGRES,
      orm: ORM_OPTIONS.PRISMA,
      auth: AUTH_OPTIONS.AUTH0,
      packageManager: 'npm',
      addons: ['typescript', 'eslint', 'prettier', 'tailwind', 'testing'],
    },
  },
  'microservice': {
    name: 'Microservice',
    description: 'Lightweight microservice',
    config: {
      backend: BACKEND_OPTIONS.FASTIFY,
      frontend: [FRONTEND_OPTIONS.NONE],
      database: DATABASE_OPTIONS.SQLITE,
      orm: ORM_OPTIONS.NONE,
      auth: AUTH_OPTIONS.JWT,
      packageManager: 'npm',
      addons: ['typescript', 'eslint', 'prettier', 'docker'],
    },
  },
};

/**
 * Get preset configuration by name
 * @param {string} presetName - Name of the preset
 * @returns {Object|null} - Preset configuration or null if not found
 */
export function getPresetConfig(presetName) {
  return PRESET_CONFIGS[presetName] || null;
}

/**
 * List all available presets
 * @returns {Array} - Array of preset information
 */
export function listPresets() {
  return Object.entries(PRESET_CONFIGS).map(([key, preset]) => ({
    key,
    name: preset.name,
    description: preset.description,
  }));
}
