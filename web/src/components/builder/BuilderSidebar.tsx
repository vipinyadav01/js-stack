"use client";

import {
  Check,
  ClipboardCopy,
  AlertCircle,
  Settings,
  Terminal,
  Star,
  Zap,
  RefreshCw,
  Sparkles,
  Package,
  GitBranch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type BuilderState,
  techCatalog,
  defaultConfig,
  validateConfiguration,
} from "@/components/builder/config";
import { cn } from "@/lib/utils";

interface Props {
  state: BuilderState;
  command: string;
  onNameChange: (name: string) => void;
  onPackageManagerChange: (pm: string) => void;
  onStackChange: (stack: BuilderState) => void;
}

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "database",
  "orm",
  "auth",
  "addons",
];

// Removed unused function

const validateProjectName = (name: string): string | null => {
  if (!name.trim()) return "Project name is required";
  if (name.length < 2) return "Must be at least 2 characters";
  if (name.length > 50) return "Must be less than 50 characters";
  if (!/^[a-zA-Z0-9-_\s]+$/.test(name))
    return "Only letters, numbers, hyphens, underscores, and spaces allowed";
  return null;
};

const getBadgeColors = (category: string): string => {
  const colors: Record<string, string> = {
    frontend: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    backend: "bg-green-500/10 text-green-700 border-green-500/20",
    database: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    orm: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    auth: "bg-red-500/10 text-red-700 border-red-500/20",
    addons: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  };
  return colors[category] || "bg-gray-500/10 text-gray-700 border-gray-500/20";
};

const PACKAGE_MANAGERS = [
  { key: "npm", name: "npm", desc: "Node Default", icon: "📦", color: "red" },
  {
    key: "yarn",
    name: "yarn",
    desc: "Fast & Reliable",
    icon: "🧶",
    color: "blue",
  },
  {
    key: "pnpm",
    name: "pnpm",
    desc: "Disk Efficient",
    icon: "⚡",
    color: "amber",
  },
  {
    key: "bun",
    name: "bun",
    desc: "Blazing Fast",
    icon: "🚀",
    color: "orange",
  },
];

export default function BuilderSidebar({
  state,
  command,
  onNameChange,
  onPackageManagerChange,
  onStackChange,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<BuilderState | null>(
    null,
  );
  const [isCommandExpanded, setIsCommandExpanded] = useState(false);

  const validation = validateConfiguration(state);
  const projectNameError = validateProjectName(state.projectName || "");

  const formatProjectName = (name: string): string => {
    return name.replace(/\s+/g, "-").toLowerCase();
  };

  const getRandomStack = () => {
    const randomStack: BuilderState = {
      projectName: state.projectName || "my-better-t-app",
      frontend:
        techCatalog.frontend[
          Math.floor(Math.random() * techCatalog.frontend.length)
        ].key,
      backend:
        techCatalog.backend[
          Math.floor(Math.random() * techCatalog.backend.length)
        ].key,
      database:
        techCatalog.database[
          Math.floor(Math.random() * techCatalog.database.length)
        ].key,
      orm: techCatalog.orm[Math.floor(Math.random() * techCatalog.orm.length)]
        .key,
      auth: techCatalog.auth[
        Math.floor(Math.random() * techCatalog.auth.length)
      ].key,
      addons: [],
      packageManager: state.packageManager,
      installDependencies: state.installDependencies,
      initializeGit: state.initializeGit,
    };

    onStackChange(randomStack);
    toast.success("Random stack configuration generated!");
  };

  const selectedTechnologies = (() => {
    const technologies: Array<{ name: string; category: string }> = [];

    for (const category of CATEGORY_ORDER) {
      const categoryKey = category as keyof BuilderState;
      const options = techCatalog[category as keyof typeof techCatalog];
      const selectedValue = state[categoryKey];

      if (!options) continue;

      if (Array.isArray(selectedValue)) {
        for (const id of selectedValue) {
          const tech = options.find(
            (opt: { key: string; name: string }) => opt.key === id,
          );
          if (tech) {
            technologies.push({ name: tech.name, category });
          }
        }
      } else {
        const tech = options.find(
          (opt: { key: string; name: string }) => opt.key === selectedValue,
        );
        if (tech && tech.key !== "none") {
          technologies.push({ name: tech.name, category });
        }
      }
    }
    return technologies;
  })();

  useEffect(() => {
    const savedStack = localStorage.getItem("JS-STACKPreference");
    if (savedStack) {
      try {
        const parsedStack = JSON.parse(savedStack) as BuilderState;
        setLastSavedStack(parsedStack);
      } catch {
        console.error("Failed to parse saved stack");
        localStorage.removeItem("JS-STACKPreference");
      }
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy command");
    }
  };

  const resetStack = () => {
    onStackChange(defaultConfig);
    toast.success("Stack reset to default configuration");
  };

  const saveCurrentStack = () => {
    const projectName = state.projectName || "my-better-t-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackToSave = { ...state, projectName: formattedProjectName };
    localStorage.setItem("JS-STACKPreference", JSON.stringify(stackToSave));
    setLastSavedStack(stackToSave);
    toast.success("Stack configuration saved successfully");
  };

  const loadSavedStack = () => {
    if (lastSavedStack) {
      onStackChange(lastSavedStack);
      toast.success("Saved configuration loaded");
    }
  };

  const toggleSetupOption = (
    option: "installDependencies" | "initializeGit",
  ) => {
    onStackChange({
      ...state,
      [option]: !state[option],
    });
  };

  return (
    <TooltipProvider>
      <div className="h-full overflow-y-auto bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-4 p-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-foreground">
                    Stack Builder
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Configure your project
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 ring-1 ring-green-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Project Configuration */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Project Configuration
              </h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Project Name
              </label>
              <input
                type="text"
                value={state.projectName || ""}
                onChange={(e) => onNameChange(e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm font-mono transition-all focus:outline-none focus:ring-2",
                  projectNameError
                    ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-200"
                    : "border-input bg-background focus:border-primary focus:ring-primary/20",
                )}
                placeholder="my-awesome-project"
              />
              <AnimatePresence>
                {projectNameError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-1.5 text-xs text-red-600"
                  >
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{projectNameError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {!projectNameError &&
                state.projectName &&
                state.projectName.includes(" ") && (
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>
                      Will be formatted as:{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                        {formatProjectName(state.projectName)}
                      </code>
                    </span>
                  </div>
                )}
            </div>
          </motion.div>

          {/* Stack Overview */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Stack Overview
                </h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {selectedTechnologies.length} selected
              </span>
            </div>

            {selectedTechnologies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedTechnologies.map((tech, index) => (
                  <motion.span
                    key={`${tech.category}-${tech.name}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                      getBadgeColors(tech.category),
                    )}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-6 text-center">
                <div className="space-y-2">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    No technologies selected
                  </p>
                </div>
              </div>
            )}

            {/* Quality Indicator */}
            <div className="mt-3 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5 p-3 ring-1 ring-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-xs font-medium">
                    Configuration Status
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    validation.isValid ? "text-green-600" : "text-red-600",
                  )}
                >
                  {validation.isValid
                    ? "Valid"
                    : `${validation.errors.length} Issue${validation.errors.length > 1 ? "s" : ""}`}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Generated Command */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Generated Command
                </h3>
              </div>
              <button
                onClick={() => setIsCommandExpanded(!isCommandExpanded)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isCommandExpanded ? "Collapse" : "Expand"}
              </button>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-start gap-2">
                <span className="select-none text-green-500 font-mono text-sm mt-0.5">
                  $
                </span>
                <code
                  className={cn(
                    "flex-1 text-xs font-mono text-foreground/90 leading-relaxed",
                    !isCommandExpanded && "line-clamp-2",
                  )}
                >
                  {command}
                </code>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all focus:outline-none focus:ring-2",
                  copied
                    ? "bg-green-500/10 text-green-700 ring-1 ring-green-500/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20 ring-1 ring-primary/20",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" />
                      <span>Copy Command</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Validation Status */}
          <AnimatePresence>
            {!validation.isValid && (
              <motion.div
                className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-semibold text-red-900">
                    Configuration Issues
                  </h3>
                </div>
                <ul className="space-y-1.5 pl-6">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-xs text-red-700 list-disc">
                      {error}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Package Manager */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Package Manager
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PACKAGE_MANAGERS.map((pm) => {
                const isSelected = state.packageManager === pm.key;
                return (
                  <motion.button
                    key={pm.key}
                    type="button"
                    onClick={() => onPackageManagerChange(pm.key)}
                    className={cn(
                      "flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-input bg-background hover:border-primary/40 hover:bg-muted/50",
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{pm.icon}</span>
                      <span className="text-sm font-semibold font-mono">
                        {pm.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {pm.desc}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Setup Options */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Setup Options
              </h3>
            </div>
            <div className="space-y-2">
              {/* Install Dependencies */}
              <motion.button
                onClick={() => toggleSetupOption("installDependencies")}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border p-3 transition-all focus:outline-none focus:ring-2",
                  state.installDependencies
                    ? "border-green-200 bg-green-50 focus:ring-green-200"
                    : "border-amber-200 bg-amber-50 focus:ring-amber-200",
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg ring-1",
                      state.installDependencies
                        ? "bg-green-100 text-green-600 ring-green-200"
                        : "bg-amber-100 text-amber-600 ring-amber-200",
                    )}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      Install Dependencies
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {state.installDependencies
                        ? "Auto-install packages"
                        : "Manual installation"}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-all ring-1",
                    state.installDependencies
                      ? "bg-green-500 ring-green-600/20"
                      : "bg-gray-300 ring-gray-400/20",
                  )}
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                    animate={{ x: state.installDependencies ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </motion.button>

              {/* Initialize Git */}
              <motion.button
                onClick={() => toggleSetupOption("initializeGit")}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border p-3 transition-all focus:outline-none focus:ring-2",
                  state.initializeGit
                    ? "border-green-200 bg-green-50 focus:ring-green-200"
                    : "border-amber-200 bg-amber-50 focus:ring-amber-200",
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg ring-1",
                      state.initializeGit
                        ? "bg-green-100 text-green-600 ring-green-200"
                        : "bg-amber-100 text-amber-600 ring-amber-200",
                    )}
                  >
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Initialize Git</div>
                    <div className="text-xs text-muted-foreground">
                      {state.initializeGit
                        ? "Auto-initialize repo"
                        : "Manual setup"}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-all ring-1",
                    state.initializeGit
                      ? "bg-green-500 ring-green-600/20"
                      : "bg-gray-300 ring-gray-400/20",
                  )}
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                    animate={{ x: state.initializeGit ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={saveCurrentStack}
                    className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Save
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Save current configuration</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={loadSavedStack}
                    disabled={!lastSavedStack}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2",
                      lastSavedStack
                        ? "border-input bg-background text-foreground hover:bg-muted/50 focus:ring-primary/20"
                        : "border-input bg-muted/30 text-muted-foreground/50 cursor-not-allowed",
                    )}
                    whileHover={lastSavedStack ? { scale: 1.02 } : {}}
                    whileTap={lastSavedStack ? { scale: 0.98 } : {}}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Load
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  {lastSavedStack
                    ? "Load saved configuration"
                    : "No saved configuration"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={getRandomStack}
                    className="flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-medium text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Random
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Generate random stack</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={resetStack}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Reset to defaults</TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
