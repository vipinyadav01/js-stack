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

  // Base layer templates
  resolveBase() {
    return path.join(this.baseDir, "01-base");
  }

  resolveBackend(backend) {
    // 02-frameworks/backend/<backend>
    return path.join(this.baseDir, "02-frameworks", "backend", backend);
  }

  resolveFrontend(frontend) {
    // 02-frameworks/frontend/<frontend>
    return path.join(this.baseDir, "02-frameworks", "frontend", frontend);
  }

  resolveDatabase(database, orm) {
    // 03-integrations/database/<orm-or-database>
    const folder = orm && orm !== "none" ? orm : database;
    return path.join(this.baseDir, "03-integrations", "database", folder);
  }

  resolveAuth(auth) {
    // 04-features/auth/<auth>
    return path.join(this.baseDir, "04-features", "auth", auth);
  }

  resolveAddon(addon) {
    // 05-tooling/<addon>
    return path.join(this.baseDir, "05-tooling", addon);
  }

  // Deployment templates (optional)
  resolveDeployment(provider) {
    return path.join(this.baseDir, "06-deployment", provider);
  }
}

export default TemplateManager;
