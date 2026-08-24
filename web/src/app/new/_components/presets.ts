export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stack: Record<string, string | string[] | boolean>;
}

// Comprehensive pre-configured stack templates
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "nextjs-fullstack",
    name: "Next.js Full-Stack (T3-like)",
    description: "Next.js + Express + Postgres + Prisma + Better Auth",
    stack: {
      projectName: "next-fullstack",
      frontend: "nextjs",
      backend: "express",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      addons: ["docker", "vitest"],
      packageManager: "pnpm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "react-fastify",
    name: "React + Fastify Enterprise",
    description: "React + Fastify + Postgres + Drizzle ORM",
    stack: {
      projectName: "react-fastify-app",
      frontend: "react",
      backend: "fastify",
      database: "postgres",
      orm: "drizzle",
      auth: "jwt",
      addons: ["docker", "biome"],
      packageManager: "pnpm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "vue-nestjs",
    name: "Vue 3 + NestJS & Mongo",
    description: "Vue 3 + NestJS + MongoDB + Mongoose",
    stack: {
      projectName: "vue-nest-app",
      frontend: "vue",
      backend: "nestjs",
      database: "mongodb",
      orm: "mongoose",
      auth: "jwt",
      addons: ["docker"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "monorepo-turbo",
    name: "Turborepo Monorepo",
    description: "Turborepo workspace with Next.js & Express",
    stack: {
      projectName: "my-monorepo",
      frontend: "nextjs",
      backend: "express",
      database: "postgres",
      orm: "prisma",
      auth: "jwt",
      addons: ["turborepo", "docker", "biome"],
      packageManager: "pnpm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "svelte-express",
    name: "Svelte + Express Minimal",
    description: "Svelte + Express + SQLite + Prisma + Bun",
    stack: {
      projectName: "svelte-express-app",
      frontend: "svelte",
      backend: "express",
      database: "sqlite",
      orm: "prisma",
      auth: "none",
      addons: ["vitest"],
      packageManager: "bun",
      git: "true",
      install: "true",
    },
  },
  {
    id: "todo",
    name: "Todo App (Simple Starter)",
    description: "React + Express + SQLite + Vitest",
    stack: {
      projectName: "todo-app",
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
];
