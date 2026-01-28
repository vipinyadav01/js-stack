export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stack: Record<string, string | string[] | boolean>;
}

// Only include templates that exist in the CLI (templates/examples/)
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "todo",
    name: "Todo App",
    description: "A simple Todo application example",
    stack: {
      frontend: "react",
      backend: "express",
      database: "sqlite",
      orm: "prisma",
      auth: "none",
      addons: ["vitest"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  // Add more templates here as they become available in templates/examples/
];
