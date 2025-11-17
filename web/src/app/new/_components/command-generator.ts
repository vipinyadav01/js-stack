import { StackState } from "./use-stack-state";
import {
  buildCliCommand,
  BuilderState,
} from "../../../components/builder/config";

export function generateStackCommand(stack: StackState): string {
  const builderState: BuilderState = {
    projectName: stack.projectName || "my-app",
    frontend: (stack.frontend[0] || "none") as BuilderState["frontend"],
    backend: stack.backend as BuilderState["backend"],
    database: stack.database as BuilderState["database"],
    orm: stack.orm as BuilderState["orm"],
    auth: stack.auth as BuilderState["auth"],
    addons: stack.addons as BuilderState["addons"],
    packageManager: stack.packageManager as BuilderState["packageManager"],
    installDependencies: stack.install === "true",
    initializeGit: stack.git === "true",
  };

  // Use buildCliCommand which generates proper command format
  let command = buildCliCommand(builderState);

  // If multiple frontends selected, update the frontend flag
  if (stack.frontend.length > 1) {
    // Replace single frontend with multiple frontends
    command = command.replace(
      /--frontend \w+/,
      `--frontend ${stack.frontend.join(" ")}`,
    );
  }

  return command;
}
