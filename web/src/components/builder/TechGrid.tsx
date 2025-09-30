"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
import { MemoizedCard } from "./MemoizedCard";
import {
  type BuilderState,
  type Addon,
  isCompatible,
  validateConfiguration,
} from "./config";

interface CatalogItem {
  key: string;
  name: string;
  desc?: string;
  badge?: string;
  default?: boolean;
}

interface Catalog {
  frontend: readonly CatalogItem[];
  backend: readonly CatalogItem[];
  database: readonly CatalogItem[];
  orm: readonly CatalogItem[];
  auth: readonly CatalogItem[];
  addons: readonly CatalogItem[];
}

interface Props {
  state: BuilderState;
  catalog: Catalog;
  onToggle: (category: keyof BuilderState, value: string) => void;
  onBooleanToggle: (
    category: "installDependencies" | "initializeGit",
    value: boolean,
  ) => void;
}

function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <section className="mb-6 sm:mb-8">
      {/* Terminal-style section header */}
      <div className="mb-4 flex items-center border-border border-b pb-2 text-muted-foreground">
        <Terminal className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
        <h2 className="font-semibold text-foreground text-sm sm:text-base font-mono">
          {title.toUpperCase()}
        </h2>
        {icon && <div className="ml-2">{icon}</div>}
      </div>

      {/* Content */}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="rounded border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm font-mono">{label}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-1 font-mono">
              {description}
            </div>
          )}
        </div>
        <motion.button
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
            animate={{
              x: enabled ? 24 : 4,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>
    </div>
  );
}

export function TechGrid({ state, catalog, onToggle, onBooleanToggle }: Props) {
  const isSelected = (category: keyof BuilderState, key: string): boolean => {
    if (category === "addons") {
      return state.addons.includes(key as Addon);
    }
    return state[category] === key;
  };

  const validation = useMemo(() => validateConfiguration(state), [state]);

  const isIncompatible = (
    category: keyof BuilderState,
    key: string,
  ): boolean => {
    // Check specific compatibility rules
    switch (category) {
      case "orm":
        return !isCompatible("databaseOrm", state.database, key);
      case "auth":
        return !isCompatible("frontendAuth", state.frontend, key);
      case "database":
        return !isCompatible("backendDatabase", state.backend, key);
      case "addons":
        return !isCompatible("frontendAddons", state.frontend, [key]);
      default:
        return false;
    }
  };

  // Helper functions for section-specific validation (available for future use)

  const handleSingleSelection = (category: keyof BuilderState, key: string) => {
    if (category === "addons") {
      onToggle(category, key);
    } else {
      onToggle(category, key);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Frontend Framework">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.frontend.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("frontend", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("frontend", item.key)}
              incompatible={isIncompatible("frontend", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Backend Framework">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.backend.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("backend", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("backend", item.key)}
              incompatible={isIncompatible("backend", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Database">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.database.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("database", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("database", item.key)}
              incompatible={isIncompatible("database", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="ORM / ODM">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.orm.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("orm", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("orm", item.key)}
              incompatible={isIncompatible("orm", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Authentication">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.auth.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("auth", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("auth", item.key)}
              incompatible={isIncompatible("auth", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Development Tools & Addons">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {catalog.addons.map((item) => (
            <MemoizedCard
              key={item.key}
              selected={isSelected("addons", item.key)}
              name={item.name}
              desc={item.desc}
              badge={item.badge}
              onClick={() => handleSingleSelection("addons", item.key)}
              incompatible={isIncompatible("addons", item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Project Setup Options">
        <div className="space-y-3">
          <ToggleSwitch
            enabled={state.installDependencies}
            onChange={(value) => onBooleanToggle("installDependencies", value)}
            label="Auto Install Dependencies"
            description="Automatically install npm packages after project creation"
          />
          <ToggleSwitch
            enabled={state.initializeGit}
            onChange={(value) => onBooleanToggle("initializeGit", value)}
            label="Initialize Git Repository"
            description="Set up git repository with initial commit"
          />
        </div>
      </Section>

      {/* Terminal-style Validation Status */}
      <AnimatePresence>
        {(!validation.isValid || validation.warnings.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded border border-border p-4 bg-muted/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm font-mono">
                  VALIDATION_STATUS
                </span>
              </div>
              <div
                className={`rounded border border-border px-2 py-1 text-xs font-mono ${
                  validation.isValid
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {validation.isValid ? "VALID" : "ERROR"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!validation.isValid ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-800 text-sm font-mono">
                      {validation.errors.length} COMPATIBILITY_ISSUE
                      {validation.errors.length > 1 ? "S" : ""}
                    </div>
                    <div className="text-red-600 text-xs font-mono">
                      Please resolve the errors above to continue
                    </div>
                  </div>
                </div>
              ) : validation.warnings.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-amber-800 text-sm font-mono">
                      {validation.warnings.length} OPTIMIZATION_SUGGESTION
                      {validation.warnings.length > 1 ? "S" : ""}
                    </div>
                    <div className="text-amber-600 text-xs font-mono">
                      Consider these improvements for better performance
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800 text-sm font-mono">
                    CONFIGURATION_LOOKS_GREAT
                  </div>
                </div>
              )}

              {/* Production Ready indicator */}
              {validation.testedCombination?.isWellTested && (
                <div className="flex items-center gap-1 ml-auto">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 text-xs font-medium font-mono">
                    PRODUCTION_READY
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
