import { StackState } from "./use-stack-state";
import {
  buildCliCommand,
  BuilderState,
} from "../../../components/builder/config";

export function generateStackCommand(stack: StackState): string {
  // Ensure frontend array is valid
  const frontends =
    Array.isArray(stack.frontend) && stack.frontend.length > 0
      ? stack.frontend
      : ["none"];

  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: (frontends[0] || "none") as BuilderState["frontend"],
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

  // If multiple frontends selected, update the frontend flag
  if (frontends.length > 1 && frontends[0] !== "none") {
    // Replace single frontend with multiple frontends
    const frontendPattern = /--frontend\s+[\w-]+/;
    if (frontendPattern.test(command)) {
      command = command.replace(
        frontendPattern,
        `--frontend ${frontends.join(",")}`,
      );
    } else {
      // If frontend flag doesn't exist, add it
      const projectNameMatch = command.match(/create-js-stack@latest\s+(\S+)/);
      if (projectNameMatch) {
        command = command.replace(
          projectNameMatch[0],
          `${projectNameMatch[0]} --frontend ${frontends.join(",")}`,
        );
      }
    }
  }

  return command;
}
