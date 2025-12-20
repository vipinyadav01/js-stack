/**
 * Stack utilities for URL generation and command building
 */

export interface StackState {
  projectName: string;
  frontend: string;
  backend: string;
  database: string;
  orm: string;
  auth: string;
  addons: string[];
  dbSetup: string;
  webDeploy: string;
  serverDeploy: string;
  packageManager: string;
  git: string;
  install: string;
  yolo: string;
}

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

/**
 * Generate a shareable URL for the current stack configuration
 */
export function generateStackSharingUrl(stack: StackState): string {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(stack).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && !(value.length === 1 && value[0] === "none")) {
        params.set(key, value.join(","));
      }
    } else if (value && value !== "none" && value !== "") {
      params.set(key, value.toString());
    }
  });

  return `${window.location.origin}/new?${params.toString()}`;
}

/**
 * Generate the CLI command for the current stack configuration
 */
export function generateStackCommand(stack: StackState): string {
  const parts: string[] = ["npx create-js-stack@latest"];

  // Project name
  const projectName = stack.projectName || "my-app";
  parts.push(projectName.replace(/\s+/g, "-"));

  // Frontend
  if (stack.frontend && stack.frontend !== "none") {
    parts.push(`--frontend=${stack.frontend}`);
  }

  // Backend
  if (stack.backend && stack.backend !== "none") {
    parts.push(`--backend=${stack.backend}`);
  }

  // Database
  if (stack.database && stack.database !== "none") {
    parts.push(`--database=${stack.database}`);
  }

  // ORM
  if (stack.orm && stack.orm !== "none") {
    parts.push(`--orm=${stack.orm}`);
  }

  // Auth
  if (stack.auth && stack.auth !== "none") {
    parts.push(`--auth=${stack.auth}`);
  }

  // DB Setup
  if (stack.dbSetup && stack.dbSetup !== "none") {
    parts.push(`--db-setup=${stack.dbSetup}`);
  }

  // Web Deploy
  if (stack.webDeploy && stack.webDeploy !== "none") {
    parts.push(`--web-deploy=${stack.webDeploy}`);
  }

  // Server Deploy
  if (stack.serverDeploy && stack.serverDeploy !== "none") {
    parts.push(`--server-deploy=${stack.serverDeploy}`);
  }

  // Addons
  if (stack.addons && stack.addons.length > 0) {
    const filteredAddons = stack.addons.filter((a) => a !== "none");
    if (filteredAddons.length > 0) {
      parts.push(`--addons=${filteredAddons.join(",")}`);
    }
  }

  // Package Manager (only if not npm which is default)
  if (stack.packageManager && stack.packageManager !== "npm") {
    parts.push(`--package-manager=${stack.packageManager}`);
  }

  // Git (only if disabled)
  if (stack.git === "false") {
    parts.push("--no-git");
  }

  // Install (only if disabled)
  if (stack.install === "false") {
    parts.push("--no-install");
  }

  // Yolo mode
  if (stack.yolo === "true") {
    parts.push("--yolo");
  }

  return parts.join(" ");
}
