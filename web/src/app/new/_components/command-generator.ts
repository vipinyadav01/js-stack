import { StackState } from "./use-stack-state";
import {
  buildCliCommand,
  BuilderState,
} from "../../../components/builder/config";
import {
  getRecommendations,
  findBestMatchingUseCase,
  COMPATIBILITY_MATRIX,
} from "@/lib/recommendations";

export function generateStackCommand(
  stack: StackState,
  includeComments = true,
): string {
  // Frontend is now a single string value (not an array)
  const frontend =
    typeof stack.frontend === "string"
      ? stack.frontend
      : Array.isArray(stack.frontend) && (stack.frontend as string[]).length > 0
        ? (stack.frontend as string[])[0] // Backward compatibility: if array, use first value
        : "none";

  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: frontend as BuilderState["frontend"],
    backend: (stack.backend || "none") as BuilderState["backend"],
    database: (stack.database || "none") as BuilderState["database"],
    orm: (stack.orm || "none") as BuilderState["orm"],
    auth: (stack.auth || "none") as BuilderState["auth"],
    addons: (Array.isArray(stack.addons)
      ? stack.addons
      : []) as BuilderState["addons"],
    dbSetup: (stack.dbSetup || "none") as BuilderState["dbSetup"],
    webDeploy: (stack.webDeploy || "none") as BuilderState["webDeploy"],
    serverDeploy: (stack.serverDeploy ||
      "none") as BuilderState["serverDeploy"],
    packageManager: (stack.packageManager ||
      "npm") as BuilderState["packageManager"],
    installDependencies: stack.install === "true",
    initializeGit: stack.git === "true",
  };

  // Use buildCliCommand which generates proper command format
  let command = buildCliCommand(builderState);

  // Add explanatory comments if requested
  if (includeComments) {
    const comments: string[] = [];
    const recommendations = getRecommendations(builderState);
    const matchingUseCase = findBestMatchingUseCase(builderState);

    // Add use case match comment
    if (matchingUseCase) {
      comments.push(`# Best match: ${matchingUseCase.name}`);
      comments.push(`# ${matchingUseCase.why}`);
    }

    // Add frontend comment
    if (builderState.frontend !== "none") {
      const frontendName =
        builderState.frontend === "nextjs"
          ? "Next.js"
          : builderState.frontend === "react-native"
            ? "React Native"
            : builderState.frontend.charAt(0).toUpperCase() +
              builderState.frontend.slice(1);
      comments.push(`# Frontend: ${frontendName}`);
    }

    // Add backend comment with performance info
    if (builderState.backend !== "none") {
      const backendPerf =
        COMPATIBILITY_MATRIX.backend_performance[
          builderState.backend as keyof typeof COMPATIBILITY_MATRIX.backend_performance
        ];
      if (backendPerf) {
        comments.push(
          `# Backend: ${builderState.backend} - ${backendPerf.speed}`,
        );
        comments.push(`# Best for: ${backendPerf.bestFor}`);
      }
    }

    // Add database-ORM comment
    if (builderState.database !== "none" && builderState.orm !== "none") {
      const dbInfo =
        COMPATIBILITY_MATRIX.database_orm[
          builderState.database as keyof typeof COMPATIBILITY_MATRIX.database_orm
        ];
      if (dbInfo && dbInfo.recommended === builderState.orm) {
        comments.push(
          `# Database + ORM: ${builderState.database} + ${builderState.orm} - ${dbInfo.reason}`,
        );
      }
    }

    // Add auth recommendation comment
    if (builderState.auth !== "none" && recommendations.auth) {
      if (recommendations.auth.id === builderState.auth) {
        comments.push(
          `# Auth: ${builderState.auth} - ${recommendations.auth.reason}`,
        );
      }
    }

    // Add warnings as comments
    if (recommendations.warnings.length > 0) {
      recommendations.warnings.forEach((warning) => {
        comments.push(`# ⚠️ ${warning.message}`);
      });
    }

    // Prepend comments to command
    if (comments.length > 0) {
      command = comments.join("\n") + "\n\n" + command;
    }
  }

  return command;
}
