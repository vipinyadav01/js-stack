"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
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
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-sm">{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </div>
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
    <div className="flex items-center justify-between p-3 rounded border border-border bg-muted/20">
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
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
            label="Dependencies will be installed automatically"
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

      {/* Overall Validation Status */}
      <AnimatePresence>
        {(!validation.isValid || validation.warnings.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              {!validation.isValid ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-800 text-sm">
                      {validation.errors.length} Compatibility Issue
                      {validation.errors.length > 1 ? "s" : ""}
                    </div>
                    <div className="text-red-600 text-xs">
                      Please resolve the errors above to continue
                    </div>
                  </div>
                </div>
              ) : validation.warnings.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-amber-800 text-sm">
                      {validation.warnings.length} Optimization Suggestion
                      {validation.warnings.length > 1 ? "s" : ""}
                    </div>
                    <div className="text-amber-600 text-xs">
                      Consider these improvements for better performance
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800 text-sm">
                    Configuration looks great!
                  </div>
                </div>
              )}

              {/* Auto-fix indicator */}
              {validation.testedCombination?.isWellTested && (
                <div className="flex items-center gap-1 ml-auto">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 text-xs font-medium">
                    Production Ready
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
