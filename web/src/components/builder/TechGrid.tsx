"use client";

import { MemoizedCard } from "./MemoizedCard";
import { type BuilderState, type Addon } from "./config";

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
  onBooleanToggle: (category: 'installDependencies' | 'initializeGit', value: boolean) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
  description 
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
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
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
    if (category === 'addons') {
      return state.addons.includes(key as Addon);
    }
    return state[category] === key;
  };

  const isIncompatible = (_category: keyof BuilderState, _key: string): boolean => {
    // Add your compatibility logic here
    return false;
  };


  const handleSingleSelection = (category: keyof BuilderState, key: string) => {
    if (category === 'addons') {
      onToggle(category, key);
    } else {
      onToggle(category, key);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Frontend Framework">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {catalog.frontend.map(item => (
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
          {catalog.backend.map(item => (
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
          {catalog.database.map(item => (
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
          {catalog.orm.map(item => (
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
          {catalog.auth.map(item => (
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
          {catalog.addons.map(item => (
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
            onChange={(value) => onBooleanToggle('installDependencies', value)}
            label="Dependencies will be installed automatically"
            description="Automatically install npm packages after project creation"
          />
          <ToggleSwitch
            enabled={state.initializeGit}
            onChange={(value) => onBooleanToggle('initializeGit', value)}
            label="Initialize Git Repository"
            description="Set up git repository with initial commit"
          />
        </div>
      </Section>

      {/* Compatibility Warnings */}
      {(isIncompatible("orm", state.orm) || 
        isIncompatible("auth", state.auth) || 
        state.addons.some((addon: string) => isIncompatible("addons", addon))) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-yellow-800 text-xs font-bold">!</span>
            </div>
            <span className="text-yellow-800 font-medium text-sm">Compatibility Notice</span>
          </div>
          <div className="text-yellow-700 text-xs mt-1">
            Some selected technologies may not be optimally compatible. Consider reviewing your choices for better integration.
          </div>
        </div>
      )}
    </div>
  );
}