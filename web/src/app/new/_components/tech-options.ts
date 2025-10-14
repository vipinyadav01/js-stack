import { techCatalog } from "../../../components/builder/config";

export interface TechOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  emoji?: string;
  color?: string;
  default?: boolean;
  badge?: string;
}

// Convert techCatalog to TECH_OPTIONS format
export const TECH_OPTIONS: Record<string, TechOption[]> = {
  frontend: techCatalog.frontend.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "react"
        ? "⚛️"
        : opt.key === "vue"
          ? "💚"
          : opt.key === "angular"
            ? "🔴"
            : opt.key === "svelte"
              ? "🍊"
              : opt.key === "nextjs"
                ? "▲"
                : opt.key === "nuxt"
                  ? "💚"
                  : opt.key === "react-native"
                    ? "📱"
                    : "📦",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  backend: techCatalog.backend.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "express"
        ? "🚂"
        : opt.key === "fastify"
          ? "⚡"
          : opt.key === "koa"
            ? "🎋"
            : opt.key === "hapi"
              ? "🎯"
              : opt.key === "nestjs"
                ? "🪺"
                : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  database: techCatalog.database.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "mongodb"
        ? "🍃"
        : opt.key === "postgres"
          ? "🐘"
          : opt.key === "mysql"
            ? "🐬"
            : opt.key === "sqlite"
              ? "🗄️"
              : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  orm: techCatalog.orm.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "mongoose"
        ? "🦫"
        : opt.key === "prisma"
          ? "⚡"
          : opt.key === "sequelize"
            ? "🔷"
            : opt.key === "typeorm"
              ? "📘"
              : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  auth: techCatalog.auth.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "jwt"
        ? "🔑"
        : opt.key === "passport"
          ? "🛂"
          : opt.key === "auth0"
            ? "🔐"
            : opt.key === "oauth"
              ? "🔓"
              : opt.key === "better-auth"
                ? "🔒"
                : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  addons: techCatalog.addons.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "turborepo"
        ? "⚡"
        : opt.key === "biome"
          ? "🌿"
          : opt.key === "docker"
            ? "🐳"
            : opt.key === "testing"
              ? "🧪"
              : "📦",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  packageManager: techCatalog.packageManager.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "npm"
        ? "📦"
        : opt.key === "yarn"
          ? "🧶"
          : opt.key === "pnpm"
            ? "⚡"
            : opt.key === "bun"
              ? "🥖"
              : "📦",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
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
