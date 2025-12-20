export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stack: Record<string, string | string[] | boolean>;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "todo-app",
    name: "Todo App Example",
    description: "A simple Todo application to get you started",
    stack: {
      frontend: "react", // Changed from array to single string
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
];
