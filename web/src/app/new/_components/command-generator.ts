import { StackState } from "./use-stack-state";
import {
  generateReproducibleCommand,
  BuilderState,
} from "../../../components/builder/config";

export function generateStackCommand(stack: StackState): string {
  // Convert StackState to BuilderState format
  const builderState: BuilderState = {
    projectName: stack.projectName,
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

  return generateReproducibleCommand(builderState);
}
