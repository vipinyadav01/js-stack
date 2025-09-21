import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";

export class ReadmePlugin extends GeneratorPlugin {
  constructor() {
    super("ReadmePlugin", "1.0.0");
    this.priority = 60; // After files and package.json
    this.registerHook(HOOK_TYPES.POST_GENERATE, this.postGenerate);
  }

  canHandle() { return true; }

  async execute() {
    return { success: true };
  }

  async postGenerate(context) {
    const projectDir = context.projectDir || context.context?.projectDir;
    const config = context.config || context.context?.config;
    const content = this.renderReadme(config);
    const outPath = path.join(projectDir, "README.md");
    await fs.writeFile(outPath, content);
    return context;
  }

  renderReadme(config) {
    const fe = (config.frontend && config.frontend.length) ? config.frontend.join(", ") : "none";
    return `# ${config.projectName}\n\n` +
`## Stack\n` +
`- Backend: ${config.backend}\n` +
`- Frontend: ${fe}\n` +
`- Database: ${config.database}${config.orm && config.orm !== 'none' ? ' ('+config.orm+')' : ''}\n` +
`- Auth: ${config.auth}\n` +
`- Package Manager: ${config.packageManager}\n` +
`- Addons: ${(config.addons && config.addons.length) ? config.addons.join(', ') : 'none'}\n\n` +
`## Getting Started\n` +
"```bash\n" +
`cd ${config.projectName}\n` +
`${config.packageManager} install\n` +
`${config.packageManager} run dev\n` +
"```\n\n" +
`## Scripts\n` +
"- dev: Start development mode\n" +
"- build: Build the application\n" +
"- test: Run tests\n\n" +
`## Notes\n` +
`This project was generated with JS Stack Generator (modular).\n`;
  }
}

export default ReadmePlugin;
