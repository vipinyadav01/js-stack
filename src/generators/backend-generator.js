import path from 'path';
import { ensureDir, writeJson, mergePackageJson } from '../utils/file-utils.js';
import { BACKEND_OPTIONS } from '../types.js';

/**
 * Generate backend structure
 */
export async function generateBackend(config) {
  const backendDir = path.join(config.projectDir, 'backend');
  await ensureDir(backendDir);
  
  switch (config.backend) {
    case BACKEND_OPTIONS.EXPRESS:
      await generateExpressBackend(config, backendDir);
      break;
    case BACKEND_OPTIONS.FASTIFY:
      await generateFastifyBackend(config, backendDir);
      break;
    case BACKEND_OPTIONS.KOA:
      await generateKoaBackend(config, backendDir);
      break;
    case BACKEND_OPTIONS.HAPI:
      await generateHapiBackend(config, backendDir);
      break;
    case BACKEND_OPTIONS.NESTJS:
      await generateNestBackend(config, backendDir);
      break;
  }
}

async function generateExpressBackend(config, backendDir) {
  // Create server.js
  const serverContent = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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

  await writeJson(path.join(backendDir, 'server.js'), serverContent, { spaces: 0 });
  
  // Update package.json
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    scripts: {
      'dev:backend': 'nodemon backend/server.js',
      'start:backend': 'node backend/server.js'
    },
    dependencies: {
      'express': '^4.18.2',
      'cors': '^2.8.5',
      'helmet': '^7.1.0'
    },
    devDependencies: {
      'nodemon': '^3.0.2'
    }
  });
}

async function generateFastifyBackend(config, backendDir) {
  // Similar implementation for Fastify
  // Stub for now
  const serverContent = `// Fastify backend implementation`;
  await writeJson(path.join(backendDir, 'server.js'), serverContent, { spaces: 0 });
}

async function generateKoaBackend(config, backendDir) {
  // Stub for Koa
  const serverContent = `// Koa backend implementation`;
  await writeJson(path.join(backendDir, 'server.js'), serverContent, { spaces: 0 });
}

async function generateHapiBackend(config, backendDir) {
  // Stub for Hapi
  const serverContent = `// Hapi backend implementation`;
  await writeJson(path.join(backendDir, 'server.js'), serverContent, { spaces: 0 });
}

async function generateNestBackend(config, backendDir) {
  // Stub for NestJS
  const serverContent = `// NestJS backend implementation`;
  await writeJson(path.join(backendDir, 'server.js'), serverContent, { spaces: 0 });
}

export default { generateBackend };
