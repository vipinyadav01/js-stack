import type { BuilderState } from "@/components/builder/config";

export interface UseCaseRecommendation {
  id: string;
  name: string;
  description: string;
  recommended: Partial<BuilderState>;
  why: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  estimatedTime?: string;
}

export interface CompatibilityInfo {
  compatible: string[];
  recommended: string;
  reason: string;
  alternatives?: Array<{ id: string; reason: string }>;
}

export interface PerformanceInfo {
  speed: string;
  overhead: string;
  bestFor: string;
  tradeoffs: string;
}

export const USE_CASE_RECOMMENDATIONS: Record<string, UseCaseRecommendation> = {
  "modern-fullstack": {
    id: "modern-fullstack",
    name: "Modern Full-Stack Web App",
    description: "Best for SaaS, dashboards, and web applications",
    recommended: {
      frontend: "nextjs",
      backend: "none", // Next.js has built-in API routes
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      addons: ["vitest", "biome", "docker"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Next.js for SSR/SEO, Prisma for type-safe DB access, Better Auth for modern auth patterns",
    difficulty: "Intermediate",
    tags: ["popular", "production-ready", "type-safe"],
    estimatedTime: "2-3 hours",
  },

  "high-performance-api": {
    id: "high-performance-api",
    name: "High-Performance API",
    description: "REST/GraphQL APIs with maximum speed",
    recommended: {
      frontend: "none",
      backend: "fastify",
      database: "postgres",
      orm: "drizzle",
      auth: "lucia",
      addons: ["docker", "vitest"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Fastify is 2x faster than Express, Drizzle has minimal overhead",
    difficulty: "Intermediate",
    tags: ["performance", "api-only"],
    estimatedTime: "1-2 hours",
  },

  enterprise: {
    id: "enterprise",
    name: "Enterprise Application",
    description: "Large-scale apps with strict architecture",
    recommended: {
      frontend: "angular",
      backend: "nestjs",
      database: "postgres",
      orm: "typeorm",
      auth: "better-auth",
      addons: ["docker", "vitest", "turborepo"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "NestJS + Angular = TypeScript everywhere, strict DI patterns, enterprise-tested",
    difficulty: "Advanced",
    tags: ["enterprise", "scalable", "typescript"],
    estimatedTime: "4-6 hours",
  },

  "rapid-prototyping": {
    id: "rapid-prototyping",
    name: "Rapid Prototyping",
    description: "MVP and quick projects",
    recommended: {
      frontend: "react",
      backend: "express",
      database: "sqlite",
      orm: "prisma",
      auth: "clerk",
      addons: ["biome"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Fast setup, no DB hosting needed, Clerk handles auth UI",
    difficulty: "Beginner",
    tags: ["fast", "simple", "beginner-friendly"],
    estimatedTime: "30-60 minutes",
  },

  "serverless-edge": {
    id: "serverless-edge",
    name: "Serverless/Edge Apps",
    description: "Deploy to Vercel, Cloudflare, Deno Deploy",
    recommended: {
      frontend: "nextjs",
      backend: "hono",
      database: "postgres",
      orm: "drizzle",
      auth: "better-auth",
      addons: ["vitest"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Hono works on any edge runtime, Drizzle has no dependencies, minimal bundle size",
    difficulty: "Intermediate",
    tags: ["edge", "serverless", "modern"],
    estimatedTime: "2-3 hours",
  },

  "mobile-cross-platform": {
    id: "mobile-cross-platform",
    name: "Mobile + Web Cross-Platform",
    description: "React Native mobile + web dashboard",
    recommended: {
      frontend: "native-nativewind",
      backend: "nestjs",
      database: "postgres",
      orm: "prisma",
      auth: "clerk",
      addons: ["docker", "vitest", "turborepo"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Share code between mobile/web, Clerk for universal auth",
    difficulty: "Advanced",
    tags: ["mobile", "cross-platform"],
    estimatedTime: "4-6 hours",
  },

  realtime: {
    id: "realtime",
    name: "Real-Time Applications",
    description: "Chat, collaboration, live updates",
    recommended: {
      frontend: "react",
      backend: "convex",
      database: "none", // Convex includes DB
      orm: "none",
      auth: "clerk",
      addons: ["vitest"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Convex provides real-time DB and backend in one. Auto-syncs state",
    difficulty: "Intermediate",
    tags: ["real-time", "reactive", "modern"],
    estimatedTime: "2-3 hours",
  },

  "content-heavy": {
    id: "content-heavy",
    name: "Content-Heavy Sites",
    description: "Blogs, marketing sites, documentation",
    recommended: {
      frontend: "nextjs",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "none",
      addons: ["docker", "pwa"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Next.js SSG for SEO, fast page loads, optional backend for CMS",
    difficulty: "Beginner",
    tags: ["seo", "content", "static"],
    estimatedTime: "1-2 hours",
  },

  "bleeding-edge": {
    id: "bleeding-edge",
    name: "Bleeding Edge/Experimental",
    description: "Latest tech, maximum performance",
    recommended: {
      frontend: "svelte",
      backend: "elysia",
      database: "sqlite",
      orm: "drizzle",
      auth: "lucia",
      addons: ["biome"],
      packageManager: "bun",
      installDependencies: true,
      initializeGit: true,
    },
    why: "Bun runtime (3x faster), Svelte's compiler, Drizzle's speed, lightweight auth",
    difficulty: "Advanced",
    tags: ["experimental", "performance", "cutting-edge"],
    estimatedTime: "3-4 hours",
  },
};

export const COMPATIBILITY_MATRIX = {
  database_orm: {
    postgres: {
      compatible: ["prisma", "typeorm", "drizzle", "mikro-orm"],
      recommended: "prisma",
      reason: "Best TypeScript support, great developer experience",
      alternatives: [
        { id: "drizzle", reason: "Lightweight, 2x faster than Prisma" },
        { id: "typeorm", reason: "Active Record pattern, good for migrations" },
      ],
    },
    mysql: {
      compatible: ["prisma", "typeorm", "drizzle", "mikro-orm"],
      recommended: "prisma",
      reason: "Consistent API across SQL databases",
      alternatives: [
        { id: "drizzle", reason: "Lightweight, minimal overhead" },
        { id: "typeorm", reason: "Mature, feature-rich" },
      ],
    },
    sqlite: {
      compatible: ["prisma", "typeorm", "drizzle"],
      recommended: "drizzle",
      reason: "Lightweight, perfect for SQLite's use case",
      alternatives: [
        { id: "prisma", reason: "Great DX, type-safe" },
        { id: "typeorm", reason: "Good for migrations" },
      ],
    },
    mongodb: {
      compatible: ["mongoose"],
      recommended: "mongoose",
      reason: "Only ORM designed for MongoDB's document model",
      alternatives: [],
    },
  },

  frontend_auth: {
    nextjs: {
      compatible: ["next-auth", "clerk", "better-auth", "lucia"],
      recommended: "next-auth",
      reason: "Built specifically for Next.js, seamless integration",
      alternatives: [
        { id: "better-auth", reason: "Modern, framework-agnostic" },
        { id: "clerk", reason: "Drop-in components, handles UI" },
      ],
    },
    react: {
      compatible: ["clerk", "better-auth", "lucia"],
      recommended: "clerk",
      reason: "Drop-in components, handles UI + backend",
      alternatives: [
        { id: "better-auth", reason: "Modern, flexible" },
        { id: "lucia", reason: "Lightweight, full control" },
      ],
    },
    vue: {
      compatible: ["better-auth", "lucia"],
      recommended: "better-auth",
      reason: "Framework-agnostic, works great with Vue",
      alternatives: [
        { id: "lucia", reason: "Lightweight, gives full control" },
        { id: "clerk", reason: "Hosted solution" },
      ],
    },
    angular: {
      compatible: ["clerk", "better-auth"],
      recommended: "clerk",
      reason: "Enterprise-grade, good Angular support",
      alternatives: [{ id: "better-auth", reason: "Flexible auth solution" }],
    },
    svelte: {
      compatible: ["better-auth", "lucia"],
      recommended: "lucia",
      reason: "Lightweight, gives full control",
      alternatives: [{ id: "better-auth", reason: "Modern, flexible" }],
    },
  },

  backend_performance: {
    express: {
      speed: "baseline (27k req/s)",
      overhead: "medium",
      bestFor: "General purpose, large ecosystem",
      tradeoffs: "Older, slower than modern alternatives",
    },
    fastify: {
      speed: "2x faster than Express (68k req/s)",
      overhead: "low",
      bestFor: "High-throughput APIs",
      tradeoffs: "Smaller ecosystem than Express",
    },
    koa: {
      speed: "similar to Express (28k req/s)",
      overhead: "low",
      bestFor: "Async/await, modern middleware",
      tradeoffs: "Smaller community",
    },
    nestjs: {
      speed: "slightly slower than Express (25k req/s)",
      overhead: "high",
      bestFor: "Large teams, enterprise, TypeScript-first",
      tradeoffs: "More boilerplate, steeper learning curve",
    },
    hono: {
      speed: "4x faster than Express (180k req/s)",
      overhead: "minimal",
      bestFor: "Edge computing, serverless",
      tradeoffs: "Newer, smaller ecosystem",
    },
    elysia: {
      speed: "10x faster than Express (270k req/s) - Bun only",
      overhead: "minimal",
      bestFor: "Maximum performance, Bun projects",
      tradeoffs: "Requires Bun, very new",
    },
    convex: {
      speed: "N/A (managed service)",
      overhead: "N/A",
      bestFor: "Real-time apps, rapid development",
      tradeoffs: "Vendor lock-in, less control",
    },
  },
} as const;

export interface RecommendationResult {
  orm?: {
    id: string;
    reason: string;
    strength: "required" | "recommended" | "suggested";
  };
  auth?: {
    id: string;
    reason: string;
    strength: "required" | "recommended" | "suggested";
  };
  backend?: {
    id: string;
    reason: string;
    strength: "required" | "recommended" | "suggested";
  };
  warnings: Array<{
    type: "incompatibility" | "performance" | "warning";
    message: string;
    severity: "high" | "medium" | "low";
    fix?: string;
  }>;
  alternatives: Array<{
    category: string;
    id: string;
    reason: string;
  }>;
  compatibilityScore: number;
}

/**
 * Get smart recommendations based on current selections
 */
export function getRecommendations(
  selections: Partial<BuilderState>,
): RecommendationResult {
  const result: RecommendationResult = {
    warnings: [],
    alternatives: [],
    compatibilityScore: 100,
  };

  // Database-based ORM recommendation
  if (selections.database) {
    const dbInfo =
      COMPATIBILITY_MATRIX.database_orm[
        selections.database as keyof typeof COMPATIBILITY_MATRIX.database_orm
      ];

    if (dbInfo) {
      // Check if current ORM is compatible
      if (
        selections.orm &&
        selections.orm !== "none" &&
        !(dbInfo.compatible as readonly string[]).includes(selections.orm)
      ) {
        result.warnings.push({
          type: "incompatibility",
          message: `${selections.database} is not compatible with ${selections.orm}. Use ${dbInfo.recommended} instead.`,
          severity: "high",
          fix: dbInfo.recommended,
        });
        result.compatibilityScore -= 30;
      } else if (selections.orm !== dbInfo.recommended) {
        result.orm = {
          id: dbInfo.recommended,
          reason: dbInfo.reason,
          strength: "recommended",
        };
        result.compatibilityScore -= 5;
      }

      // Add alternatives
      dbInfo.alternatives?.forEach((alt) => {
        result.alternatives.push({
          category: "orm",
          id: alt.id,
          reason: alt.reason,
        });
      });
    }
  }

  // Frontend-based auth recommendation
  if (selections.frontend && selections.frontend !== "none") {
    const frontendInfo =
      COMPATIBILITY_MATRIX.frontend_auth[
        selections.frontend as keyof typeof COMPATIBILITY_MATRIX.frontend_auth
      ];

    if (frontendInfo && selections.auth !== frontendInfo.recommended) {
      result.auth = {
        id: frontendInfo.recommended,
        reason: frontendInfo.reason,
        strength: "recommended",
      };
      result.compatibilityScore -= 5;
    }
  }

  // Performance warnings
  if (selections.backend === "express" && selections.database === "postgres") {
    result.warnings.push({
      type: "performance",
      message: "Consider Fastify for 2x better performance with similar API",
      severity: "low",
      fix: "fastify",
    });
    result.compatibilityScore -= 2;
  }

  // Special incompatibilities
  if (
    selections.database === "mongodb" &&
    selections.orm &&
    selections.orm !== "mongoose" &&
    selections.orm !== "none"
  ) {
    result.warnings.push({
      type: "incompatibility",
      message:
        "MongoDB requires Mongoose ORM. Other ORMs don't support MongoDB.",
      severity: "high",
      fix: "mongoose",
    });
    result.compatibilityScore -= 30;
  }

  if (
    selections.frontend === "nextjs" &&
    selections.backend &&
    selections.backend !== "none"
  ) {
    result.warnings.push({
      type: "warning",
      message:
        "Next.js has built-in API routes. Separate backend may be unnecessary.",
      severity: "medium",
    });
    result.compatibilityScore -= 5;
  }

  if (selections.backend === "elysia" && selections.packageManager !== "bun") {
    result.warnings.push({
      type: "incompatibility",
      message:
        "Elysia requires Bun runtime. Install Bun or choose a different backend.",
      severity: "high",
      fix: "bun",
    });
    result.compatibilityScore -= 20;
  }

  if (
    selections.backend === "convex" &&
    selections.database &&
    selections.database !== "none"
  ) {
    result.warnings.push({
      type: "warning",
      message:
        "Convex includes its own database. External database may be redundant.",
      severity: "medium",
    });
    result.compatibilityScore -= 5;
  }

  return result;
}

/**
 * Get use case recommendation by ID
 */
export function getUseCaseRecommendation(
  useCaseId: string,
): UseCaseRecommendation | undefined {
  return USE_CASE_RECOMMENDATIONS[useCaseId];
}

/**
 * Get all use case recommendations
 */
export function getAllUseCaseRecommendations(): UseCaseRecommendation[] {
  return Object.values(USE_CASE_RECOMMENDATIONS);
}

/**
 * Find best matching use case for current selections
 */
export function findBestMatchingUseCase(
  selections: Partial<BuilderState>,
): UseCaseRecommendation | null {
  let bestMatch: UseCaseRecommendation | null = null;
  let bestScore = 0;

  for (const useCase of Object.values(USE_CASE_RECOMMENDATIONS)) {
    let score = 0;
    const maxScore = 5;

    if (useCase.recommended.frontend === selections.frontend) score++;
    if (useCase.recommended.backend === selections.backend) score++;
    if (useCase.recommended.database === selections.database) score++;
    if (useCase.recommended.orm === selections.orm) score++;
    if (useCase.recommended.auth === selections.auth) score++;

    const confidence = score / maxScore;
    if (confidence > bestScore && confidence >= 0.4) {
      bestScore = confidence;
      bestMatch = useCase;
    }
  }

  return bestMatch;
}
