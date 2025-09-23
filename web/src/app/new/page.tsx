"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, Zap, RefreshCw } from "lucide-react";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import { TechGrid } from "@/components/builder/TechGrid";
import { ResponsiveLayout } from "@/components/builder/ResponsiveLayout";
import { ErrorBoundary } from "@/components/builder/ErrorBoundary";
import { SkeletonGrid } from "@/components/builder/LoadingState";
import { useBuilderState } from "@/hooks/useBuilderState";
import { 
  techCatalog as baseCatalog, 
  getRecommendedStack
} from "@/components/builder/config";

type PresetType = 'fullstack-web' | 'react-api' | 'api-only' | 'mobile' | 'prototype';

const presets = [
  {
    key: 'fullstack-web' as PresetType,
    name: 'Full-Stack Web App',
    desc: 'Next.js + Supabase + Prisma',
    icon: '🚀',
    color: 'border-blue-200 bg-blue-50 hover:bg-blue-100'
  },
  {
    key: 'react-api' as PresetType,
    name: 'React + API',
    desc: 'React + Express + MongoDB',
    icon: '⚛️',
    color: 'border-green-200 bg-green-50 hover:bg-green-100'
  },
  {
    key: 'api-only' as PresetType,
    name: 'API Only',
    desc: 'Express + PostgreSQL + Prisma',
    icon: '🔧',
    color: 'border-purple-200 bg-purple-50 hover:bg-purple-100'
  },
  {
    key: 'mobile' as PresetType,
    name: 'Mobile App',
    desc: 'React Native + Firebase',
    icon: '📱',
    color: 'border-orange-200 bg-orange-50 hover:bg-orange-100'
  },
  {
    key: 'prototype' as PresetType,
    name: 'Quick Prototype',
    desc: 'Next.js + SQLite + Prisma',
    icon: '⚡',
    color: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function BuilderPage() {
  const {
    state,
    validation,
    manualSetup,
    command,
    isAutoFixing,
    onToggle,
    onNameChange,
    onPackageManagerChange,
    onBooleanToggle,
    resetToDefaults,
    setState
  } = useBuilderState();

  const [showPresets, setShowPresets] = useState(false);
  const [available] = useState<{ frontend: string[]; backend: string[]; orm: string[]; database: string[] } | null>(null);

  const applyPreset = useCallback((presetType: PresetType) => {
    const preset = getRecommendedStack(presetType);
    setState(prev => ({ ...prev, ...preset }));
    setShowPresets(false);
  }, [setState]);

  const filteredCatalog = useMemo(() => {
    if (!available) return baseCatalog;
    const clone = <T extends { key: string }>(arr: readonly T[]) => arr.map(i => ({ ...i }));
    const filterBy = <T extends { key: string }>(items: readonly T[], allow: string[]) => 
      clone(items).filter(i => allow.includes(i.key) || i.key === 'none');
    
    return {
      frontend: filterBy(baseCatalog.frontend, available.frontend),
      backend: filterBy(baseCatalog.backend, available.backend),
      database: filterBy(baseCatalog.database, available.database.concat(['none'])),
      orm: filterBy(baseCatalog.orm, available.orm.concat(['none'])),
      auth: clone(baseCatalog.auth),
      addons: clone(baseCatalog.addons),
    };
  }, [available]);

  return (
    <ErrorBoundary>
      <div className="w-full max-w-full overflow-hidden px-4 py-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header Section */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative"
                  animate={isAutoFixing ? { rotate: 360 } : {}}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <Terminal className="h-6 w-6 text-primary" />
                  {isAutoFixing && (
                    <motion.div
                      className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <div>
                  <h1 className="font-bold text-xl text-foreground">JS Stack Builder</h1>
                  <p className="text-sm text-muted-foreground">Create your perfect JavaScript stack</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2">
                {/* Status Indicators */}
                <div className="hidden md:flex items-center gap-3 text-xs">
                  <div className={`flex items-center gap-1 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                    {validation.isValid ? 'Valid' : 'Issues'}
                  </div>
                  <div className={`flex items-center gap-1 ${manualSetup.hasManualSteps ? 'text-amber-600' : 'text-blue-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${manualSetup.hasManualSteps ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    {manualSetup.hasManualSteps ? 'Manual' : 'Auto'}
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Presets</span>
                </button>
                
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Reset to defaults"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Auto-fix notification */}
            <AnimatePresence>
              {isAutoFixing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
                >
                  <Zap className="h-4 w-4" />
                  Auto-fixing compatibility issues...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Presets Panel */}
            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden rounded-md border border-border bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Quick Start Presets</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => applyPreset(preset.key)}
                        className={`text-left rounded-md border p-3 transition-all hover:scale-105 ${preset.color}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{preset.icon}</span>
                          <span className="font-medium text-sm">{preset.name}</span>
                        </div>
                        <div className="text-xs opacity-80">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <ResponsiveLayout
              sidebar={
                <BuilderSidebar 
                  state={state}
                  command={command}
                  onNameChange={onNameChange}
                  onPackageManagerChange={onPackageManagerChange}
                />
              }
              main={
                <ErrorBoundary fallback={<SkeletonGrid count={12} />}>
                  <TechGrid 
                    state={state} 
                    catalog={filteredCatalog} 
                    onToggle={onToggle} 
                    onBooleanToggle={onBooleanToggle} 
                  />
                </ErrorBoundary>
              }
            />
          </motion.div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}