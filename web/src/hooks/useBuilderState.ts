import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  type BuilderState, 
  type Frontend,
  type Backend,
  type Database,
  type ORM,
  type Auth,
  type Addon,
  type PackageManager,
  defaultConfig, 
  normalizeState, 
  applyCompatibility,
  validateConfiguration,
  requiresManualSetup,
  buildCliCommand
} from "@/components/builder/config";

export function useBuilderState() {
  const [state, setState] = useState<BuilderState>(() => normalizeState(defaultConfig));
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("name", state.projectName);
    if (state.frontend && state.frontend !== 'none') params.set("fe", state.frontend);
    if (state.backend && state.backend !== 'none') params.set("be", state.backend);
    if (state.database && state.database !== 'none') params.set("db", state.database);
    if (state.orm && state.orm !== 'none') params.set("orm", state.orm);
    if (state.auth && state.auth !== 'none') params.set("auth", state.auth);
    if (state.addons.length) params.set("addons", state.addons.join(","));
    if (state.packageManager && state.packageManager !== 'npm') params.set("pm", state.packageManager);
    if (!state.installDependencies) params.set("no-install", "true");
    if (!state.initializeGit) params.set("no-git", "true");
    
    const url = `${location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlState: Partial<BuilderState> = {};
    
    if (params.get("name")) urlState.projectName = params.get("name")!;
    if (params.get("fe")) urlState.frontend = params.get("fe") as Frontend;
    if (params.get("be")) urlState.backend = params.get("be") as Backend;
    if (params.get("db")) urlState.database = params.get("db") as Database;
    if (params.get("orm")) urlState.orm = params.get("orm") as ORM;
    if (params.get("auth")) urlState.auth = params.get("auth") as Auth;
    if (params.get("addons")) {
      urlState.addons = params.get("addons")!.split(",") as Addon[];
    }
    if (params.get("pm")) urlState.packageManager = params.get("pm") as PackageManager;
    urlState.installDependencies = !params.has("no-install");
    urlState.initializeGit = !params.has("no-git");
    
    if (Object.keys(urlState).length > 0) {
      setState(normalizeState({ ...defaultConfig, ...urlState }));
    }
  }, []);

  // Apply compatibility with animation
  const safeState = useMemo(() => {
    const applied = applyCompatibility(state);
    const hasChanges = JSON.stringify(applied) !== JSON.stringify(state);
    
    if (hasChanges && !isAutoFixing) {
      setIsAutoFixing(true);
      setTimeout(() => setIsAutoFixing(false), 1000);
    }
    
    return applied;
  }, [state, isAutoFixing]);

  const validation = useMemo(() => validateConfiguration(safeState), [safeState]);
  const manualSetup = useMemo(() => requiresManualSetup(safeState), [safeState]);
  const command = useMemo(() => buildCliCommand(safeState), [safeState]);

  const onToggle = useCallback((category: keyof BuilderState, value: string) => {
    setState(prev => {
      if (category === "addons") {
        const set = new Set<import("@/components/builder/config").Addon>(prev.addons);
        const val = value as import("@/components/builder/config").Addon;
        if (set.has(val)) set.delete(val); else set.add(val);
        return { ...prev, addons: Array.from(set) };
      }
      if (category === "frontend") {
        return { ...prev, frontend: value as Frontend };
      }
      return { ...prev, [category]: value } as BuilderState;
    });
  }, []);

  const onNameChange = useCallback((name: string) => {
    setState(prev => ({ ...prev, projectName: name }));
  }, []);

  const onPackageManagerChange = useCallback((packageManager: string) => {
    setState(prev => ({ ...prev, packageManager: packageManager as PackageManager }));
  }, []);

  const onBooleanToggle = useCallback((category: 'installDependencies' | 'initializeGit', value: boolean) => {
    setState(prev => ({ ...prev, [category]: value } as BuilderState));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(normalizeState(defaultConfig));
  }, []);

  return {
    state: safeState,
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
  };
}
