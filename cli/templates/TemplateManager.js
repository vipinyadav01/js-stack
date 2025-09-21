import path from "path";
import fs from "fs-extra";
import { getTemplateDir } from "../utils/file-utils.js";

export class TemplateManager {
  constructor(baseDir) {
    this.baseDir = baseDir || getTemplateDir();
  }

  async exists(dirPath) {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  getBaseDir() {
    return this.baseDir;
  }

  resolveBackend(backend) {
    return path.join(this.baseDir, "backend", backend);
  }

  resolveFrontend(frontend) {
    return path.join(this.baseDir, "frontend", frontend);
  }

  resolveDatabase(database, orm) {
    return path.join(this.baseDir, "database", orm || database);
  }

  resolveAuth(auth) {
    return path.join(this.baseDir, "auth", auth);
  }

  resolveAddon(addon) {
    return path.join(this.baseDir, "addons", addon);
  }
}

export default TemplateManager;


