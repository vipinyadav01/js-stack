import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";

export class EntryPointPlugin extends GeneratorPlugin {
  constructor() {
    super("EntryPointPlugin", "1.0.0");
    this.priority = 55; // After files and package.json, before README
    this.registerHook(HOOK_TYPES.POST_GENERATE, this.postGenerate);
  }

  canHandle() {
    return true;
  }

  async execute() {
    return { success: true };
  }

  async postGenerate(context) {
    const projectDir = context.projectDir || context.context?.projectDir;
    const indexPath = path.join(projectDir, "index.js");

    const exists = await fs.pathExists(indexPath);
    if (!exists) {
      const content = this.generateIndexContent(
        context.config || context.context?.config,
      );
      await fs.writeFile(indexPath, content);
    }

    return context;
  }

  generateIndexContent(config) {
    const name = config?.projectName || "App";
    return `#!/usr/bin/env node

/**
 * Main entry point for ${name}
 */

console.log('🚀 ${name} - Starting application...');

const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, 'backend', 'server.js');
const frontendPath = path.join(__dirname, 'frontend');

if (fs.existsSync(backendPath)) {
  console.log('📡 Backend server found.');
  console.log('💡 Start backend: cd backend && npm start');
}

if (fs.existsSync(frontendPath)) {
  console.log('🎨 Frontend found.');
  console.log('💡 Start frontend: cd frontend && npm start');
}
`;
  }
}

export default EntryPointPlugin;
