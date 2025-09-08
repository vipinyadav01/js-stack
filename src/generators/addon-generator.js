import path from "path";
import { writeJson, writeFile, mergePackageJson } from "../utils/file-utils.js";
import { ADDON_OPTIONS } from "../types.js";

/**
 * Generate addons and development tools
 */
export async function generateAddons(config) {
  for (const addon of config.addons) {
    switch (addon) {
      case ADDON_OPTIONS.ESLINT:
        await generateESLint(config);
        break;
      case ADDON_OPTIONS.PRETTIER:
        await generatePrettier(config);
        break;
      case ADDON_OPTIONS.HUSKY:
        await generateHusky(config);
        break;
      case ADDON_OPTIONS.DOCKER:
        await generateDocker(config);
        break;
      case ADDON_OPTIONS.GITHUB_ACTIONS:
        await generateGithubActions(config);
        break;
      case ADDON_OPTIONS.TESTING:
        await generateTesting(config);
        break;
    }
  }
}

async function generateESLint(config) {
  const eslintConfig = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
  };

  await writeJson(path.join(config.projectDir, ".eslintrc.json"), eslintConfig);

  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    scripts: {
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
    },
    devDependencies: {
      eslint: "^8.56.0",
    },
  });
}

async function generatePrettier(config) {
  const prettierConfig = {
    semi: true,
    trailingComma: "es5",
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
  };

  await writeJson(path.join(config.projectDir, ".prettierrc"), prettierConfig);

  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    scripts: {
      format: "prettier --write .",
      "format:check": "prettier --check .",
    },
    devDependencies: {
      prettier: "^3.1.1",
    },
  });
}

async function generateHusky(config) {
  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    scripts: {
      prepare: "husky install",
    },
    devDependencies: {
      husky: "^8.0.3",
      "lint-staged": "^15.2.0",
    },
    "lint-staged": {
      "*.js": ["eslint --fix", "prettier --write"],
      "*.{json,md}": ["prettier --write"],
    },
  });
}

async function generateDocker(config) {
  const dockerfileContent = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]
`;

  const dockerIgnoreContent = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
`;

  await writeFile(
    path.join(config.projectDir, "Dockerfile"),
    dockerfileContent,
  );
  await writeFile(
    path.join(config.projectDir, ".dockerignore"),
    dockerIgnoreContent,
  );

  const dockerComposeContent = `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
`;

  await writeFile(
    path.join(config.projectDir, "docker-compose.yml"),
    dockerComposeContent,
  );
}

async function generateGithubActions(config) {
  const workflowContent = `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run lint
`;

  await writeFile(
    path.join(config.projectDir, ".github", "workflows", "ci.yml"),
    workflowContent,
  );
}

async function generateTesting(config) {
  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    scripts: {
      test: "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage",
    },
    devDependencies: {
      jest: "^29.7.0",
      "@testing-library/jest-dom": "^6.1.5",
      "@testing-library/react": "^14.1.2",
      "@testing-library/user-event": "^14.5.1",
    },
  });
}

export default { generateAddons };
