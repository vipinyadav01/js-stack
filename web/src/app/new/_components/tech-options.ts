export interface TechOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  emoji?: string;
  color?: string;
  default?: boolean;
}

export const TECH_OPTIONS: Record<string, TechOption[]> = {
  frontend: [
    {
      id: "react",
      name: "React",
      description: "A JavaScript library for building user interfaces",
      emoji: "⚛️",
      color: "bg-blue-500",
    },
    {
      id: "vue",
      name: "Vue",
      description: "Progressive JavaScript framework",
      emoji: "💚",
      color: "bg-green-500",
    },
    {
      id: "angular",
      name: "Angular",
      description: "Platform for building mobile and desktop web applications",
      emoji: "🔴",
      color: "bg-red-500",
    },
    {
      id: "svelte",
      name: "Svelte",
      description: "Cybernetically enhanced web apps",
      emoji: "🍊",
      color: "bg-orange-500",
    },
    {
      id: "nextjs",
      name: "Next.js",
      description: "React framework for production",
      emoji: "▲",
      color: "bg-black",
    },
    {
      id: "nuxt",
      name: "Nuxt",
      description: "Vue framework for production",
      emoji: "💚",
      color: "bg-green-600",
    },
  ],
  backend: [
    {
      id: "none",
      name: "None",
      description: "No backend",
      emoji: "🚫",
      color: "bg-gray-400",
    },
    {
      id: "express",
      name: "Express",
      description: "Fast, unopinionated web framework for Node.js",
      emoji: "🚂",
      color: "bg-gray-800",
    },
    {
      id: "fastify",
      name: "Fastify",
      description: "Fast and low overhead web framework",
      emoji: "⚡",
      color: "bg-yellow-500",
    },
    {
      id: "koa",
      name: "Koa",
      description: "Next generation web framework for Node.js",
      emoji: "🎋",
      color: "bg-green-700",
    },
    {
      id: "hapi",
      name: "Hapi",
      description: "Rich framework for building applications and services",
      emoji: "🎯",
      color: "bg-purple-500",
    },
    {
      id: "nestjs",
      name: "NestJS",
      description: "Progressive Node.js framework",
      emoji: "🪺",
      color: "bg-red-600",
    },
  ],
  database: [
    {
      id: "none",
      name: "None",
      description: "No database",
      emoji: "🚫",
      color: "bg-gray-400",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "NoSQL document database",
      emoji: "🍃",
      color: "bg-green-600",
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Advanced open source relational database",
      emoji: "🐘",
      color: "bg-blue-700",
    },
    {
      id: "mysql",
      name: "MySQL",
      description: "World's most popular open source database",
      emoji: "🐬",
      color: "bg-blue-500",
    },
    {
      id: "sqlite",
      name: "SQLite",
      description: "Self-contained SQL database engine",
      emoji: "🗄️",
      color: "bg-gray-600",
    },
  ],
  orm: [
    {
      id: "none",
      name: "None",
      description: "No ORM",
      emoji: "🚫",
      color: "bg-gray-400",
    },
    {
      id: "mongoose",
      name: "Mongoose",
      description: "MongoDB object modeling for Node.js",
      emoji: "🦫",
      color: "bg-green-700",
    },
    {
      id: "prisma",
      name: "Prisma",
      description: "Next-generation ORM",
      emoji: "⚡",
      color: "bg-indigo-600",
    },
    {
      id: "sequelize",
      name: "Sequelize",
      description: "Promise-based Node.js ORM",
      emoji: "🔷",
      color: "bg-blue-600",
    },
    {
      id: "typeorm",
      name: "TypeORM",
      description: "ORM for TypeScript and JavaScript",
      emoji: "📘",
      color: "bg-blue-700",
    },
  ],
  auth: [
    {
      id: "none",
      name: "None",
      description: "No authentication",
      emoji: "🚫",
      color: "bg-gray-400",
    },
    {
      id: "jwt",
      name: "JWT",
      description: "JSON Web Token authentication",
      emoji: "🔑",
      color: "bg-purple-500",
    },
    {
      id: "passport",
      name: "Passport",
      description: "Authentication middleware for Node.js",
      emoji: "🛂",
      color: "bg-blue-500",
    },
    {
      id: "auth0",
      name: "Auth0",
      description: "Identity and access management",
      emoji: "🔐",
      color: "bg-orange-500",
    },
    {
      id: "oauth",
      name: "OAuth",
      description: "Open standard for access delegation",
      emoji: "🔓",
      color: "bg-green-500",
    },
  ],
  addons: [
    {
      id: "turborepo",
      name: "Turborepo",
      description: "High-performance build system",
      emoji: "⚡",
      color: "bg-black",
    },
    {
      id: "biome",
      name: "Biome",
      description: "Fast formatter and linter",
      emoji: "🌿",
      color: "bg-green-600",
    },
    {
      id: "docker",
      name: "Docker",
      description: "Containerization platform",
      emoji: "🐳",
      color: "bg-blue-600",
    },
    {
      id: "testing",
      name: "Testing",
      description: "Jest and Vitest setup",
      emoji: "🧪",
      color: "bg-purple-500",
    },
  ],
  packageManager: [
    {
      id: "npm",
      name: "npm",
      description: "Node Package Manager",
      emoji: "📦",
      color: "bg-red-600",
    },
    {
      id: "yarn",
      name: "Yarn",
      description: "Fast, reliable, and secure dependency management",
      emoji: "🧶",
      color: "bg-blue-600",
    },
    {
      id: "pnpm",
      name: "pnpm",
      description: "Fast, disk space efficient package manager",
      emoji: "⚡",
      color: "bg-orange-600",
    },
    {
      id: "bun",
      name: "Bun",
      description: "Incredibly fast JavaScript runtime",
      emoji: "🥖",
      color: "bg-yellow-500",
    },
  ],
};

export const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "database",
  "orm",
  "auth",
  "addons",
  "packageManager",
];
