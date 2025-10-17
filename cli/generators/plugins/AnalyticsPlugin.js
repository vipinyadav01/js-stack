import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";

export class AnalyticsPlugin extends GeneratorPlugin {
  constructor() {
    super("AnalyticsPlugin", "1.0.0");
    this.priority = 1; // Run very early to capture timing
    this.metrics = {
      startTime: 0,
      endTime: 0,
      stages: [],
      plugins: [],
      technologies: {},
      warnings: [],
      errors: [],
    };
    this.registerHook(HOOK_TYPES.PRE_GENERATE, this.preGenerate);
    this.registerHook(HOOK_TYPES.POST_GENERATE, this.postGenerate);
    this.registerHook(HOOK_TYPES.ON_WARNING, this.onWarning);
    this.registerHook(HOOK_TYPES.ON_ERROR, this.onError);
  }

  canHandle() {
    return true;
  }

  async preGenerate(context) {
    this.metrics.startTime = Date.now();
    this.metrics.technologies = {
      frontend: context.config.frontend,
      backend: context.config.backend,
      database: context.config.database,
      orm: context.config.orm,
      auth: context.config.auth,
      addons: context.config.addons,
      packageManager: context.config.packageManager,
      typescript: !!context.config.typescript,
    };
    return context;
  }

  async execute(config, context) {
    // Collect plugin metadata snapshot
    this.metrics.plugins.push({ name: this.name, version: this.version });
    return { success: true };
  }

  async postGenerate(context) {
    this.metrics.endTime = Date.now();
    const durationMs = this.metrics.endTime - this.metrics.startTime;
    const report = {
      summary: {
        durationMs,
        durationSeconds: +(durationMs / 1000).toFixed(3),
        technologies: this.metrics.technologies,
      },
      stages: this.metrics.stages,
      plugins: this.metrics.plugins,
      warnings: this.metrics.warnings,
      errors: this.metrics.errors,
      timestamp: new Date().toISOString(),
    };

    const projectDir = context.projectDir || context.context?.projectDir;
    const outPath = path.join(projectDir, "generation-report.json");
    await fs.writeJson(outPath, report, { spaces: 2 });
    return context;
  }

  async onWarning(context) {
    this.metrics.warnings.push(context?.message || "");
    return context;
  }

  async onError(context) {
    this.metrics.errors.push(context?.message || "");
    return context;
  }
}

export default AnalyticsPlugin;
