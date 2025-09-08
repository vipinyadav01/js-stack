import path from "path";
import {
  ensureDir,
  writeJson,
  writeFile,
  mergePackageJson,
  copyTemplates,
  getTemplateDir,
} from "../utils/file-utils.js";
import { BACKEND_OPTIONS } from "../types.js";

/**
 * Generate backend structure
 */
export async function generateBackend(config) {
  const backendDir = path.join(config.projectDir, "backend");
  await ensureDir(backendDir);

  const templateDir = getTemplateDir();

  switch (config.backend) {
    case BACKEND_OPTIONS.EXPRESS:
      await generateBackendFromTemplate(
        config,
        backendDir,
        "express",
        templateDir,
      );
      break;
    case BACKEND_OPTIONS.FASTIFY:
      await generateBackendFromTemplate(
        config,
        backendDir,
        "fastify",
        templateDir,
      );
      break;
    case BACKEND_OPTIONS.KOA:
      await generateBackendFromTemplate(config, backendDir, "koa", templateDir);
      break;
    case BACKEND_OPTIONS.HAPI:
      await generateBackendFromTemplate(
        config,
        backendDir,
        "hapi",
        templateDir,
      );
      break;
    case BACKEND_OPTIONS.NESTJS:
      await generateBackendFromTemplate(
        config,
        backendDir,
        "nestjs",
        templateDir,
      );
      break;
  }
}

async function generateBackendFromTemplate(
  config,
  backendDir,
  frameworkName,
  templateDir,
) {
  const backendTemplateDir = path.join(templateDir, "backend", frameworkName);

  // Template context
  const context = {
    projectName: config.projectName,
    projectDescription:
      config.description || `A ${frameworkName} backend application`,
    backend: {
      [frameworkName]: true,
    },
    database: {
      [config.database]: config.database !== "none",
    },
    orm: {
      [config.orm]: config.orm !== "none",
    },
    auth: {
      [config.auth]: config.auth !== "none",
    },
    typescript: config.typescript || false,
    testing: {
      jest: config.addons?.includes("testing"),
      vitest: false,
    },
    useTypeScript: config.typescript || false,
    useJWT: config.auth === "jwt",
    usePrisma: config.orm === "prisma",
    useMongoose: config.orm === "mongoose",
    useSequelize: config.orm === "sequelize",
    useTypeORM: config.orm === "typeorm",
    useRedis: config.addons?.includes("redis") || false,
    authorName: config.authorName || "",
    packageManager: {
      [config.packageManager]: true,
    },
  };

  // Copy templates with context
  try {
    await copyTemplates(backendTemplateDir, backendDir, context);
  } catch (error) {
    console.warn(
      `Warning: Could not find templates for ${frameworkName} backend. Using fallback generation.`,
    );
    await generateFallbackBackend(config, backendDir, frameworkName);
  }
}

async function generateFallbackBackend(config, backendDir, frameworkName) {
  // Fallback: Create basic package.json and server file when templates are missing
  const packageJson = {
    name: `${config.projectName}-backend`,
    version: "1.0.0",
    description: `${config.projectName} backend`,
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "nodemon server.js",
    },
    dependencies: {
      express: "^4.18.2",
      cors: "^2.8.5",
      helmet: "^7.0.0",
      dotenv: "^16.3.1",
    },
    devDependencies: {
      nodemon: "^3.0.1",
    },
  };

  await writeJson(path.join(backendDir, "package.json"), packageJson);

  // Create basic server file
  const serverContent = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;

  await writeFile(path.join(backendDir, "server.js"), serverContent);
}

export default generateBackend;
