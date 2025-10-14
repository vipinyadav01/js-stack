import { StackState } from "./use-stack-state";

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stack: Partial<StackState>;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "full-stack-mongo",
    name: "Full Stack (MongoDB)",
    description: "React + Express + MongoDB + JWT",
    stack: {
      frontend: ["react"],
      backend: "express",
      database: "mongodb",
      orm: "mongoose",
      auth: "jwt",
      addons: ["biome"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "full-stack-postgres",
    name: "Full Stack (PostgreSQL)",
    description: "React + Express + PostgreSQL + Prisma",
    stack: {
      frontend: ["react"],
      backend: "express",
      database: "postgresql",
      orm: "prisma",
      auth: "jwt",
      addons: ["biome"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "frontend-only",
    name: "Frontend Only",
    description: "React frontend without backend",
    stack: {
      frontend: ["react"],
      backend: "none",
      database: "none",
      orm: "none",
      auth: "none",
      addons: ["biome"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "nextjs-full",
    name: "Next.js Full Stack",
    description: "Next.js with API routes and database",
    stack: {
      frontend: ["nextjs"],
      backend: "express",
      database: "postgresql",
      orm: "prisma",
      auth: "jwt",
      addons: ["biome", "turborepo"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "nestjs-stack",
    name: "NestJS Stack",
    description: "NestJS backend with TypeORM",
    stack: {
      frontend: ["react"],
      backend: "nestjs",
      database: "postgresql",
      orm: "typeorm",
      auth: "jwt",
      addons: ["biome", "docker"],
      packageManager: "npm",
      git: "true",
      install: "true",
    },
  },
  {
    id: "fastify-stack",
    name: "Fastify Stack",
    description: "Fastify backend with Prisma",
    stack: {
      frontend: ["vue"],
      backend: "fastify",
      database: "postgresql",
      orm: "prisma",
      auth: "passport",
      addons: ["biome"],
      packageManager: "pnpm",
      git: "true",
      install: "true",
    },
  },
];
