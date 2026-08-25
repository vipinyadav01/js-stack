/**
 * Built-in stack presets.
 *
 * A preset is a named bundle of configuration applied as the base layer before
 * any explicit CLI flags. Explicit flags always win over the preset values.
 */

import type { ProjectConfig } from "./types.js";

export type PresetName =
  | "mern"
  | "next-fullstack"
  | "react-vite"
  | "express-api";

export const PRESET_NAMES: PresetName[] = [
  "mern",
  "next-fullstack",
  "react-vite",
  "express-api",
];

type PresetConfig = Partial<
  Pick<
    ProjectConfig,
    | "frontend"
    | "backend"
    | "database"
    | "orm"
    | "runtime"
    | "api"
    | "auth"
    | "packageManager"
  >
>;

export const PRESETS: Record<PresetName, PresetConfig> = {
  // MongoDB + Express + React + Node
  mern: {
    frontend: "react",
    backend: "express",
    database: "mongodb",
    orm: "mongoose",
    runtime: "node",
    api: "none",
  },
  // Next.js full-stack app with Postgres + Prisma
  "next-fullstack": {
    frontend: "next",
    backend: "next",
    database: "postgres",
    orm: "prisma",
    runtime: "node",
    api: "none",
  },
  // React single-page app (no backend)
  "react-vite": {
    frontend: "react",
    backend: "none",
    database: "none",
    orm: "none",
    runtime: "node",
    api: "none",
  },
  // Standalone Express REST API with Postgres + Prisma
  "express-api": {
    frontend: "none",
    backend: "express",
    database: "postgres",
    orm: "prisma",
    runtime: "node",
    api: "none",
  },
};

/**
 * Resolve a preset name (case-insensitive) to its configuration, or null if the
 * name is not a known preset.
 */
export function resolvePreset(name?: string): PresetConfig | null {
  if (!name) return null;
  const key = name.trim().toLowerCase() as PresetName;
  return PRESETS[key] ?? null;
}
