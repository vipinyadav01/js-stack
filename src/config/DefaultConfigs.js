import { TECHNOLOGY_OPTIONS } from "./ValidationSchemas.js";

/**
 * Default configurations for JS Stack Generator
 * Centralized technology defaults and presets
 */

// Default technology configurations
export const DEFAULT_CONFIGS = {
  // Basic defaults
  basic: {
    database: TECHNOLOGY_OPTIONS.DATABASE.SQLITE,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [TECHNOLOGY_OPTIONS.ADDON.ESLINT, TECHNOLOGY_OPTIONS.ADDON.PRETTIER],
    git: true,
    install: true,
    typescript: false,
  },

  // TypeScript defaults
  typescript: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
    ],
    git: true,
    install: true,
    typescript: true,
  },

  // Full-stack defaults
  fullstack: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
      TECHNOLOGY_OPTIONS.ADDON.TESTING,
    ],
    git: true,
    install: true,
    typescript: true,
  },

  // API-only defaults
  api: {
    database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NONE],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
      TECHNOLOGY_OPTIONS.ADDON.TESTING,
    ],
    git: true,
    install: true,
    typescript: true,
  },

  // Frontend-only defaults
  frontend: {
    database: TECHNOLOGY_OPTIONS.DATABASE.NONE,
    orm: TECHNOLOGY_OPTIONS.ORM.NONE,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
    auth: TECHNOLOGY_OPTIONS.AUTH.NONE,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
    ],
    git: true,
    install: true,
    typescript: true,
  },

  // Mobile defaults
  mobile: {
    database: TECHNOLOGY_OPTIONS.DATABASE.SQLITE,
    orm: TECHNOLOGY_OPTIONS.ORM.NONE,
    backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
    frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT_NATIVE],
    auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
    packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
    addons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
    ],
    git: true,
    install: true,
    typescript: true,
  },
};

// Preset configurations
export const PRESET_CONFIGS = {
  saas: {
    name: "SaaS Application",
    description: "Full-stack SaaS with authentication, database, and payments",
    config: {
      database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
      orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
      backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
      auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
      packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
      addons: [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.ESLINT,
        TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
        TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
        TECHNOLOGY_OPTIONS.ADDON.TESTING,
        TECHNOLOGY_OPTIONS.ADDON.DOCKER,
      ],
      git: true,
      install: true,
      typescript: true,
    },
  },

  api: {
    name: "REST API Server",
    description: "RESTful API with database and authentication",
    config: {
      database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
      orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
      backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.NONE],
      auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
      packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
      addons: [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.ESLINT,
        TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
        TECHNOLOGY_OPTIONS.ADDON.TESTING,
        TECHNOLOGY_OPTIONS.ADDON.DOCKER,
      ],
      git: true,
      install: true,
      typescript: true,
    },
  },

  fullstack: {
    name: "Full-Stack Web App",
    description: "Full-stack web application with modern tooling",
    config: {
      database: TECHNOLOGY_OPTIONS.DATABASE.POSTGRES,
      orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
      backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
      auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
      packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
      addons: [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.ESLINT,
        TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
        TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
        TECHNOLOGY_OPTIONS.ADDON.TESTING,
      ],
      git: true,
      install: true,
      typescript: true,
    },
  },

  minimal: {
    name: "Minimal Starter",
    description: "Lightweight starter template",
    config: {
      database: TECHNOLOGY_OPTIONS.DATABASE.SQLITE,
      orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
      backend: TECHNOLOGY_OPTIONS.BACKEND.EXPRESS,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT],
      auth: TECHNOLOGY_OPTIONS.AUTH.NONE,
      packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
      addons: [TECHNOLOGY_OPTIONS.ADDON.PRETTIER],
      git: true,
      install: true,
      typescript: false,
    },
  },

  mobile: {
    name: "Mobile Application",
    description: "React Native mobile application",
    config: {
      database: TECHNOLOGY_OPTIONS.DATABASE.SQLITE,
      orm: TECHNOLOGY_OPTIONS.ORM.NONE,
      backend: TECHNOLOGY_OPTIONS.BACKEND.NONE,
      frontend: [TECHNOLOGY_OPTIONS.FRONTEND.REACT_NATIVE],
      auth: TECHNOLOGY_OPTIONS.AUTH.JWT,
      packageManager: TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM,
      addons: [
        TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
        TECHNOLOGY_OPTIONS.ADDON.ESLINT,
        TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
      ],
      git: true,
      install: true,
      typescript: true,
    },
  },
};

// Technology-specific defaults
export const TECHNOLOGY_DEFAULTS = {
  [TECHNOLOGY_OPTIONS.DATABASE.MONGODB]: {
    orm: TECHNOLOGY_OPTIONS.ORM.MONGOOSE,
    incompatibleORMs: [
      TECHNOLOGY_OPTIONS.ORM.PRISMA,
      TECHNOLOGY_OPTIONS.ORM.SEQUELIZE,
      TECHNOLOGY_OPTIONS.ORM.TYPEORM,
    ],
  },
  [TECHNOLOGY_OPTIONS.DATABASE.POSTGRES]: {
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    compatibleORMs: [
      TECHNOLOGY_OPTIONS.ORM.PRISMA,
      TECHNOLOGY_OPTIONS.ORM.SEQUELIZE,
      TECHNOLOGY_OPTIONS.ORM.TYPEORM,
    ],
  },
  [TECHNOLOGY_OPTIONS.DATABASE.SQLITE]: {
    orm: TECHNOLOGY_OPTIONS.ORM.PRISMA,
    compatibleORMs: [
      TECHNOLOGY_OPTIONS.ORM.PRISMA,
      TECHNOLOGY_OPTIONS.ORM.SEQUELIZE,
      TECHNOLOGY_OPTIONS.ORM.TYPEORM,
    ],
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.NEXTJS]: {
    recommendedAddons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
    ],
    backendRecommendation: TECHNOLOGY_OPTIONS.BACKEND.NONE,
  },
  [TECHNOLOGY_OPTIONS.FRONTEND.REACT]: {
    recommendedAddons: [
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
      TECHNOLOGY_OPTIONS.ADDON.TAILWIND,
    ],
  },
  [TECHNOLOGY_OPTIONS.BACKEND.NESTJS]: {
    recommendedAddons: [
      TECHNOLOGY_OPTIONS.ADDON.TYPESCRIPT,
      TECHNOLOGY_OPTIONS.ADDON.ESLINT,
      TECHNOLOGY_OPTIONS.ADDON.PRETTIER,
    ],
    typescript: true,
  },
};

// Package manager specific configurations
export const PACKAGE_MANAGER_CONFIGS = {
  [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM]: {
    lockFile: "package-lock.json",
    installCommand: "npm install",
    addCommand: "npm install",
    devCommand: "npm run dev",
    buildCommand: "npm run build",
  },
  [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.YARN]: {
    lockFile: "yarn.lock",
    installCommand: "yarn install",
    addCommand: "yarn add",
    devCommand: "yarn dev",
    buildCommand: "yarn build",
  },
  [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.PNPM]: {
    lockFile: "pnpm-lock.yaml",
    installCommand: "pnpm install",
    addCommand: "pnpm add",
    devCommand: "pnpm dev",
    buildCommand: "pnpm build",
  },
  [TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.BUN]: {
    lockFile: "bun.lockb",
    installCommand: "bun install",
    addCommand: "bun add",
    devCommand: "bun dev",
    buildCommand: "bun build",
  },
};

/**
 * Default configuration helper class
 */
export class DefaultConfigHelper {
  /**
   * Get default configuration by type
   * @param {string} type - Configuration type
   * @returns {Object} - Default configuration
   */
  static getDefaultConfig(type = "basic") {
    return DEFAULT_CONFIGS[type] || DEFAULT_CONFIGS.basic;
  }

  /**
   * Get preset configuration
   * @param {string} presetName - Preset name
   * @returns {Object} - Preset configuration
   */
  static getPresetConfig(presetName) {
    return PRESET_CONFIGS[presetName] || null;
  }

  /**
   * Get technology defaults
   * @param {string} technology - Technology name
   * @returns {Object} - Technology defaults
   */
  static getTechnologyDefaults(technology) {
    return TECHNOLOGY_DEFAULTS[technology] || {};
  }

  /**
   * Get package manager configuration
   * @param {string} packageManager - Package manager name
   * @returns {Object} - Package manager configuration
   */
  static getPackageManagerConfig(packageManager) {
    return PACKAGE_MANAGER_CONFIGS[packageManager] || PACKAGE_MANAGER_CONFIGS[TECHNOLOGY_OPTIONS.PACKAGE_MANAGER.NPM];
  }

  /**
   * Get all available presets
   * @returns {Array} - Array of preset names and descriptions
   */
  static getAvailablePresets() {
    return Object.entries(PRESET_CONFIGS).map(([key, preset]) => ({
      key,
      name: preset.name,
      description: preset.description,
    }));
  }

  /**
   * Merge default configuration with custom configuration
   * @param {Object} defaults - Default configuration
   * @param {Object} custom - Custom configuration
   * @returns {Object} - Merged configuration
   */
  static mergeConfig(defaults, custom) {
    return {
      ...defaults,
      ...custom,
      addons: [...new Set([...(defaults.addons || []), ...(custom.addons || [])])],
      frontend: custom.frontend || defaults.frontend,
    };
  }

  /**
   * Apply technology-specific defaults
   * @param {Object} config - Base configuration
   * @returns {Object} - Configuration with technology defaults applied
   */
  static applyTechnologyDefaults(config) {
    const updatedConfig = { ...config };

    // Apply database-specific defaults
    if (config.database && TECHNOLOGY_DEFAULTS[config.database]) {
      const dbDefaults = TECHNOLOGY_DEFAULTS[config.database];
      if (dbDefaults.orm && !config.orm) {
        updatedConfig.orm = dbDefaults.orm;
      }
    }

    // Apply frontend-specific defaults
    if (config.frontend) {
      for (const frontend of config.frontend) {
        if (TECHNOLOGY_DEFAULTS[frontend]) {
          const frontendDefaults = TECHNOLOGY_DEFAULTS[frontend];
          if (frontendDefaults.recommendedAddons) {
            updatedConfig.addons = [
              ...new Set([
                ...(updatedConfig.addons || []),
                ...frontendDefaults.recommendedAddons,
              ]),
            ];
          }
          if (frontendDefaults.typescript) {
            updatedConfig.typescript = true;
          }
        }
      }
    }

    // Apply backend-specific defaults
    if (config.backend && TECHNOLOGY_DEFAULTS[config.backend]) {
      const backendDefaults = TECHNOLOGY_DEFAULTS[config.backend];
      if (backendDefaults.recommendedAddons) {
        updatedConfig.addons = [
          ...new Set([
            ...(updatedConfig.addons || []),
            ...backendDefaults.recommendedAddons,
          ]),
        ];
      }
      if (backendDefaults.typescript) {
        updatedConfig.typescript = true;
      }
    }

    return updatedConfig;
  }
}

export default {
  DEFAULT_CONFIGS,
  PRESET_CONFIGS,
  TECHNOLOGY_DEFAULTS,
  PACKAGE_MANAGER_CONFIGS,
  DefaultConfigHelper,
};
