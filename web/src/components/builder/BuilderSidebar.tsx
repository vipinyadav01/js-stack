"use client";
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, AlertTriangle, Info, Download, GitBranch } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { type BuilderState, validateConfiguration, buildPostSetupCommands, generateSetupInstructions, requiresManualSetup } from "./config";

interface Props {
  state: BuilderState;
  command: string;
  onNameChange: (name: string) => void;
  onPackageManagerChange: (pm: string) => void;
}

export default function BuilderSidebar({ state, command, onNameChange, onPackageManagerChange }: Props) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [localProjectName, setLocalProjectName] = useState(state.projectName);
  
  // Debounce project name changes to avoid excessive URL updates
  const debouncedProjectName = useDebounce(localProjectName, 300);

  const validation = useMemo(() => validateConfiguration(state), [state]);
  const postCommands = useMemo(() => buildPostSetupCommands(state), [state]);
  const setupInstructions = useMemo(() => {
    const instructions = generateSetupInstructions(state);
    return typeof instructions === 'string' ? instructions : instructions.steps.join('\n');
  }, [state]);
  const manualSetup = useMemo(() => requiresManualSetup(state), [state]);


  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
    }
  };

  // Update parent when debounced name changes
  useMemo(() => {
    if (debouncedProjectName !== state.projectName) {
      onNameChange(debouncedProjectName);
    }
  }, [debouncedProjectName, state.projectName, onNameChange]);

  // Update local state when prop changes
  useMemo(() => {
    if (state.projectName !== localProjectName) {
      setLocalProjectName(state.projectName);
    }
  }, [state.projectName, localProjectName]);

  const copyInstructions = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(setupInstructions);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
    }
  }, [setupInstructions]);

  return (
    <div className="rounded border border-border p-3 sm:p-4 space-y-4">
      {/* Project Name Input */}
      <div>
        <label className="mb-1 block text-xs text-muted-foreground font-medium">
          PROJECT NAME
        </label>
        <input
          value={localProjectName}
          onChange={(e) => setLocalProjectName(e.target.value)}
          className="w-full rounded border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-all"
          placeholder="my-awesome-app"
        />
      </div>

      {/* Package Manager Selection */}
      <div>
        <label className="mb-2 block text-xs text-muted-foreground font-medium">
          PACKAGE MANAGER
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["npm", "yarn", "pnpm", "bun"].map((pm) => (
            <button
              key={pm}
              onClick={() => onPackageManagerChange(pm)}
              className={`rounded border px-3 py-2 text-xs font-medium transition-all ${
                state.packageManager === pm
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Setup Configuration Status */}
      <div>
        <label className="mb-2 block text-xs text-muted-foreground font-medium">
          SETUP CONFIGURATION
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Dependencies will be installed automatically
            </span>
            <span className={state.installDependencies ? "text-green-600" : "text-amber-600"}>
              {state.installDependencies ? "Auto Install" : "Manual"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              Git Repository
            </span>
            <span className={state.initializeGit ? "text-green-600" : "text-amber-600"}>
              {state.initializeGit ? "Auto Init" : "Manual"}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {(!validation.isValid || validation.warnings.length > 0) && (
        <div className="space-y-2">
          {!validation.isValid && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-red-700">
                {validation.errors.length} compatibility issue(s)
              </span>
            </div>
          )}
          {validation.warnings.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
              <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="text-amber-700">
                {validation.warnings.length} optimization suggestion(s)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Generated Command */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground font-medium">
            GENERATED COMMAND
          </label>
          {manualSetup.hasManualSteps && (
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-xs text-primary hover:text-primary/80 underline"
            >
              {showInstructions ? "Hide" : "Show"} Instructions
            </button>
          )}
        </div>
        <div className="relative">
          <pre className="rounded border border-border bg-muted/20 p-3 text-xs font-mono text-foreground whitespace-pre-wrap break-words pr-12">
            {command}
          </pre>
          <motion.button
            onClick={copy}
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border border-border bg-background/80 backdrop-blur px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {copySuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 text-green-600"
                >
                  <Check className="h-3 w-3" />
                  Copied
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Setup Instructions (expandable) */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground font-medium">
                  SETUP INSTRUCTIONS
                </label>
                <button
                  onClick={copyInstructions}
                  className="text-xs text-primary hover:text-primary/80 underline"
                >
                  Copy All
                </button>
              </div>
              <div className="rounded border border-border bg-muted/20 p-3 text-xs font-mono text-foreground whitespace-pre-wrap">
                {setupInstructions}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional Commands (if manual setup required) */}
      {manualSetup.hasManualSteps && (
        <div>
          <label className="mb-2 block text-xs text-muted-foreground font-medium">
            ADDITIONAL COMMANDS
          </label>
          <div className="space-y-2">
            {Array.isArray(postCommands) ? postCommands.map((cmd: string, index: number) => (
              <div key={index} className="rounded border border-border bg-muted/20 p-2 text-xs font-mono text-foreground">
                {cmd}
              </div>
            )) : (
              <div className="rounded border border-border bg-muted/20 p-2 text-xs font-mono text-foreground">
                {postCommands.cdCommand}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}