import { StackState } from "./use-stack-state";

export function generateStackCommand(stack: StackState): string {
  // Base command varies by package manager
  const packageManagerCommands: Record<string, string> = {
    npm: "npx create-js-stack@latest",
    pnpm: "pnpm create js-stack@latest",
    yarn: "yarn create js-stack@latest",
    bun: "bunx create-js-stack@latest",
  };

  const base =
    packageManagerCommands[stack.packageManager] || packageManagerCommands.npm;

  // Check if stack is default (only need project name)
  const isDefault =
    stack.frontend.length === 0 &&
    stack.backend === "none" &&
    stack.database === "none" &&
    stack.orm === "none" &&
    stack.auth === "none" &&
    stack.addons.length === 0 &&
    stack.git === "true" &&
    stack.install === "true";

  if (isDefault) {
    return `${base} ${stack.projectName} --yes`;
  }

  // Build full command with all flags
  const flags: string[] = [];

  // Frontend
  if (stack.frontend.length > 0) {
    flags.push(`--frontend ${stack.frontend.join(" ")}`);
  } else {
    flags.push("--frontend none");
  }

  // Backend
  flags.push(`--backend ${stack.backend}`);

  // Database
  flags.push(`--database ${stack.database}`);

  // ORM
  flags.push(`--orm ${stack.orm}`);

  // Auth
  flags.push(`--auth ${stack.auth}`);

  // Addons
  if (stack.addons.length > 0) {
    flags.push(`--addons ${stack.addons.join(",")}`);
  } else {
    flags.push("--addons none");
  }

  // Package manager
  flags.push(`--package-manager ${stack.packageManager}`);

  // Git
  if (stack.git === "true") {
    flags.push("--git");
  } else {
    flags.push("--no-git");
  }

  // Install
  if (stack.install === "true") {
    flags.push("--install");
  } else {
    flags.push("--no-install");
  }

  return `${base} ${stack.projectName} ${flags.join(" ")}`;
}
