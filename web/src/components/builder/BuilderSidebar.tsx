"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  AlertTriangle,
  Info,
  Download,
  GitBranch,
  Zap,
  Star,
  TrendingUp,
  Shield,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  type BuilderState,
  validateConfiguration,
  buildPostSetupCommands,
  generateSetupInstructions,
  requiresManualSetup,
} from "./config";

interface Props {
  state: BuilderState;
  command: string;
  onNameChange: (name: string) => void;
  onPackageManagerChange: (pm: string) => void;
}

export default function BuilderSidebar({
  state,
  command,
  onNameChange,
  onPackageManagerChange,
}: Props) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [localProjectName, setLocalProjectName] = useState(state.projectName);

  // Debounce project name changes to avoid excessive URL updates
  const debouncedProjectName = useDebounce(localProjectName, 300);

  const validation = useMemo(() => validateConfiguration(state), [state]);
  const postCommands = useMemo(() => buildPostSetupCommands(state), [state]);
  const setupInstructions = useMemo(() => {
    const instructions = generateSetupInstructions(state);
    return typeof instructions === "string"
      ? instructions
      : instructions.steps.join("\n");
  }, [state]);
  const manualSetup = useMemo(() => requiresManualSetup(state), [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
  };

  // Update parent when debounced name changes
  useEffect(() => {
    if (
      debouncedProjectName !== state.projectName &&
      debouncedProjectName.trim()
    ) {
      onNameChange(debouncedProjectName);
    }
  }, [debouncedProjectName, state.projectName, onNameChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (state.projectName !== localProjectName) {
      setLocalProjectName(state.projectName);
    }
  }, [state.projectName, localProjectName]);

  const copyInstructions = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(setupInstructions);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
  }, [setupInstructions]);

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 space-y-6 shadow-sm">
      {/* Header Status Section */}
      <div className="space-y-4">
        {/* Stack Quality Score */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Stack Quality</span>
            </div>
            <div className="flex items-center gap-1">
              {validation.testedCombination?.isWellTested && (
                <motion.div
                  className="flex items-center gap-1 text-green-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-medium">Production Ready</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              className={`flex items-center gap-1 ${
                validation.isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  validation.isValid ? "bg-green-500" : "bg-red-500"
                }`}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-medium">
                {validation.isValid
                  ? "Valid"
                  : `${validation.errors.length} Issues`}
              </span>
            </div>

            <div
              className={`flex items-center gap-1 ${
                manualSetup.hasManualSteps ? "text-amber-600" : "text-blue-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  manualSetup.hasManualSteps ? "bg-amber-500" : "bg-blue-500"
                }`}
              />
              <span className="font-medium">
                {manualSetup.hasManualSteps ? "Manual Setup" : "Auto Setup"}
              </span>
            </div>
          </div>

          {/* Compatibility Score */}
          {validation.testedCombination && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Compatibility Score
                </span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {Math.round(validation.testedCombination.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </motion.button>

          <motion.button
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="h-3 w-3" />
            Optimize
          </motion.button>
        </div>
      </div>
      {/* Project Name Input */}
      <div>
        <label className="mb-1 block text-xs text-muted-foreground font-medium">
          PROJECT NAME
        </label>
        <input
          value={localProjectName}
          onChange={(e) => setLocalProjectName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/60"
          placeholder="my-awesome-app"
        />
      </div>

      {/* Current Stack Summary */}
      <div>
        <label className="mb-3 block text-xs text-muted-foreground font-medium">
          CURRENT STACK OVERVIEW
        </label>
        <div className="space-y-2">
          {[
            { label: "Frontend", value: state.frontend, icon: "🎨" },
            { label: "Backend", value: state.backend, icon: "⚙️" },
            { label: "Database", value: state.database, icon: "🗄️" },
            { label: "ORM", value: state.orm, icon: "🔗" },
            { label: "Auth", value: state.auth, icon: "🔐" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
              <span
                className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${
                  value === "none"
                    ? "text-muted-foreground bg-muted/50"
                    : "text-primary bg-primary/10"
                }`}
              >
                {value === "none" ? "None" : value}
              </span>
            </div>
          ))}

          {/* Addons */}
          {state.addons.length > 0 && (
            <div className="flex items-start justify-between py-2 px-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-sm">🛠️</span>
                <span className="text-xs font-medium text-muted-foreground">
                  Addons
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[120px]">
                {state.addons.map((addon) => (
                  <span
                    key={addon}
                    className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full"
                  >
                    {addon}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Manager Selection */}
      <div>
        <label className="mb-2 block text-xs text-muted-foreground font-medium">
          PACKAGE MANAGER
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "npm", name: "npm", desc: "Default" },
            { key: "yarn", name: "Yarn", desc: "Fast" },
            { key: "pnpm", name: "pnpm", desc: "Efficient" },
            { key: "bun", name: "Bun", desc: "Ultra Fast" },
          ].map((pm) => (
            <motion.button
              key={pm.key}
              onClick={() => onPackageManagerChange(pm.key)}
              className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                state.packageManager === pm.key
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium">{pm.name}</div>
              <div className="text-xs opacity-70">{pm.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Enhanced Setup Configuration */}
      <div>
        <label className="mb-3 block text-xs text-muted-foreground font-medium">
          SETUP CONFIGURATION
        </label>
        <div className="space-y-3">
          {/* Auto Install Toggle */}
          <motion.div
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              state.installDependencies
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2">
              <Download
                className={`h-4 w-4 ${
                  state.installDependencies
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              />
              <div>
                <div className="font-medium text-sm">
                  {state.installDependencies
                    ? "Auto-Install Dependencies"
                    : "Manual Installation"}
                </div>
                <div
                  className={`text-xs ${
                    state.installDependencies
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {state.installDependencies
                    ? "Packages installed automatically"
                    : "Run install command manually"}
                </div>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                state.installDependencies
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {state.installDependencies ? "AUTO" : "MANUAL"}
            </div>
          </motion.div>

          {/* Git Init Toggle */}
          <motion.div
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              state.initializeGit
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2">
              <GitBranch
                className={`h-4 w-4 ${
                  state.initializeGit ? "text-green-600" : "text-amber-600"
                }`}
              />
              <div>
                <div className="font-medium text-sm">
                  {state.initializeGit
                    ? "Auto-Initialize Git"
                    : "Manual Git Setup"}
                </div>
                <div
                  className={`text-xs ${
                    state.initializeGit ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {state.initializeGit
                    ? "Git repo created automatically"
                    : "Initialize git repository manually"}
                </div>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                state.initializeGit
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {state.initializeGit ? "AUTO" : "MANUAL"}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comprehensive Validation & Recommendations */}
      <div className="space-y-4">
        <label className="block text-xs text-muted-foreground font-medium">
          CONFIGURATION STATUS
        </label>

        {/* Validation Summary */}
        <div className="space-y-3">
          {/* Errors */}
          <AnimatePresence>
            {!validation.isValid && (
              <motion.div
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-red-800 text-sm mb-2">
                      {validation.errors.length} Critical Issue
                      {validation.errors.length > 1 ? "s" : ""}
                    </div>
                    <div className="space-y-1">
                      {validation.errors.slice(0, 3).map((error, index) => (
                        <div
                          key={index}
                          className="text-red-600 text-xs leading-relaxed"
                        >
                          • {error}
                        </div>
                      ))}
                      {validation.errors.length > 3 && (
                        <div className="text-red-500 text-xs font-medium">
                          +{validation.errors.length - 3} more issues
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warnings */}
          <AnimatePresence>
            {validation.warnings.length > 0 && (
              <motion.div
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-amber-800 text-sm mb-2">
                      {validation.warnings.length} Optimization Tip
                      {validation.warnings.length > 1 ? "s" : ""}
                    </div>
                    <div className="space-y-1">
                      {validation.warnings.slice(0, 3).map((warning, index) => (
                        <div
                          key={index}
                          className="text-amber-600 text-xs leading-relaxed"
                        >
                          • {warning}
                        </div>
                      ))}
                      {validation.warnings.length > 3 && (
                        <div className="text-amber-500 text-xs font-medium">
                          +{validation.warnings.length - 3} more suggestions
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {validation.isValid && validation.warnings.length === 0 && (
              <motion.div
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="h-4 w-4 text-green-600" />
                  </motion.div>
                  <div>
                    <div className="font-medium text-green-800 text-sm">
                      Perfect Configuration!
                    </div>
                    <div className="text-green-600 text-xs">
                      Your stack is optimized and ready to build
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
          <pre className="rounded-lg border border-border bg-muted/30 p-4 text-xs font-mono text-foreground whitespace-pre-wrap break-words pr-14 leading-relaxed">
            {command}
          </pre>
          <motion.button
            onClick={copy}
            className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-border bg-background/90 backdrop-blur px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-sm"
            whileHover={{ scale: 1.05 }}
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
            {Array.isArray(postCommands) ? (
              postCommands.map((cmd: string, index: number) => (
                <div
                  key={index}
                  className="rounded border border-border bg-muted/20 p-2 text-xs font-mono text-foreground"
                >
                  {cmd}
                </div>
              ))
            ) : (
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
