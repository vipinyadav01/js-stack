import { testedStackCombinations } from "../../../components/builder/config";

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stack: Record<string, string | string[] | boolean>;
}

// Convert testedStackCombinations to PRESET_TEMPLATES format
export const PRESET_TEMPLATES: PresetTemplate[] = Object.entries(
  testedStackCombinations,
).map(([key, value]) => ({
  id: key,
  name: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  description: `${value.frontend || "API"}-only with ${value.database || "no database"}`,
  stack: {
    frontend: value.frontend ? [value.frontend] : [],
    backend: value.backend || "none",
    database: value.database || "none",
    orm: value.orm || "none",
    auth: value.auth || "none",
    addons: value.addons || [],
    packageManager: value.packageManager || "npm",
    git: value.initializeGit ? "true" : "false",
    install: value.installDependencies ? "true" : "false",
  },
}));
