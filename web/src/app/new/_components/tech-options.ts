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
                    : opt.key === "sveltekit"
                      ? "🍊"
                      : opt.key === "remix"
                        ? "💿"
                        : opt.key === "astro"
                          ? "🚀"
                          : opt.key === "solid"
                            ? "🔵"
                            : opt.key === "qwik"
                              ? "⚡"
                              : opt.key === "tanstack-start"
                                ? "🥞"
                                : opt.key === "tanstack-router"
                                  ? "🛣️"
                                  : opt.key === "react-router"
                                    ? "🛣️"
                                    : opt.key === "native-nativewind"
                                      ? "🌬️"
                                      : opt.key === "native-unistyles"
                                        ? "🦄"
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
                : opt.key === "hono"
                  ? "🔥"
                  : opt.key === "elysia"
                    ? "🦊"
                    : opt.key === "convex"
                      ? "🔮"
                      : opt.key === "next"
                        ? "▲"
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
              : opt.key === "drizzle"
                ? "🌧️"
                : opt.key === "mikro-orm"
                  ? "🐘"
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
                : opt.key === "clerk"
                  ? "👤"
                  : opt.key === "lucia"
                    ? "🗝️"
                    : opt.key === "kinde"
                      ? "🔑"
                      : opt.key === "next-auth"
                        ? "🛡️"
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
              : opt.key === "pwa"
                ? "📱"
                : opt.key === "tauri"
                  ? "🦀"
                  : opt.key === "husky"
                    ? "🐶"
                    : opt.key === "storybook"
                      ? "📕"
                      : opt.key === "changesets"
                        ? "🦋"
                        : opt.key === "vitest"
                          ? "⚡"
                          : opt.key === "playwright"
                            ? "🎭"
                            : opt.key === "cypress"
                              ? "🌲"
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
  dbSetup: techCatalog.dbSetup.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "docker-compose"
        ? "🐳"
        : opt.key === "turso"
          ? "💿"
          : opt.key === "neon"
            ? "🌈"
            : opt.key === "supabase"
              ? "⚡"
              : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  webDeploy: techCatalog.webDeploy.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "cloudflare-pages"
        ? "🌩️"
        : opt.key === "vercel"
          ? "▲"
          : opt.key === "netlify"
            ? "💠"
            : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
  serverDeploy: techCatalog.serverDeploy.map((opt) => ({
    id: opt.key,
    name: opt.name,
    description: opt.desc,
    emoji:
      opt.key === "cloudflare-workers"
        ? "👷"
        : opt.key === "fly"
          ? "🎈"
          : opt.key === "railway"
            ? "🚂"
            : opt.key === "alchemy"
              ? "⚗️"
              : "🚫",
    badge: "badge" in opt ? opt.badge : undefined,
  })),
};

export const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "database",
  "orm",
  "auth",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "addons",
  "packageManager",
];
