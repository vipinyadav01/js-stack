"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface StackState {
  projectName: string;
  frontend: string[];
  backend: string;
  database: string;
  orm: string;
  auth: string;
  addons: string[];
  dbSetup: string;
  webDeploy: string;
  serverDeploy: string;
  packageManager: string;
  git: string;
  install: string;
  yolo: string;
}

const DEFAULT_STACK: StackState = {
  projectName: "my-app", // Default project name - always customizable
  frontend: [],
  backend: "none",
  database: "none",
  orm: "none",
  auth: "none",
  addons: [],
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "npm",
  git: "true",
  install: "true",
  yolo: "true",
};

export function useStackState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse stack from URL parameters
  const stack = useMemo(() => {
    const state: Partial<StackState> = { ...DEFAULT_STACK };

    for (const [key, value] of searchParams.entries()) {
      if (key in DEFAULT_STACK && value !== null && value !== undefined) {
        const defaultValue = DEFAULT_STACK[key as keyof StackState];
        if (Array.isArray(defaultValue)) {
          // Handle array values (frontend, addons)
          const parsedValue = value.trim()
            ? value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            : [];
          (state as Record<string, unknown>)[key] = parsedValue;
        } else {
          // Handle string values
          (state as Record<string, unknown>)[key] =
            value.trim() || defaultValue;
        }
      }
    }

    // Ensure required fields have valid defaults
    return {
      ...DEFAULT_STACK,
      ...state,
      frontend: Array.isArray(state.frontend)
        ? state.frontend
        : DEFAULT_STACK.frontend,
      addons: Array.isArray(state.addons) ? state.addons : DEFAULT_STACK.addons,
    } as StackState;
  }, [searchParams]);

  // Update stack and URL
  const setStack = useCallback(
    (updates: Partial<StackState>) => {
      // Merge updates with current stack, ensuring arrays are properly handled
      const newStack: StackState = {
        ...stack,
        ...updates,
        // Ensure arrays are properly set
        frontend:
          updates.frontend !== undefined
            ? Array.isArray(updates.frontend)
              ? updates.frontend
              : [updates.frontend as string]
            : stack.frontend,
        addons:
          updates.addons !== undefined
            ? Array.isArray(updates.addons)
              ? updates.addons
              : [updates.addons as string]
            : stack.addons,
      };

      const params = new URLSearchParams();

      // Add all non-default values to URL
      Object.entries(newStack).forEach(([key, value]) => {
        const defaultValue = DEFAULT_STACK[key as keyof StackState];

        // Check if value is different from default
        const isDefault =
          JSON.stringify(value) === JSON.stringify(defaultValue);

        if (!isDefault) {
          if (Array.isArray(value)) {
            // Only add array params if they have values
            if (
              value.length > 0 &&
              !(value.length === 1 && value[0] === "none")
            ) {
              params.set(key, value.join(","));
            }
          } else if (value !== undefined && value !== null && value !== "") {
            // Only add non-empty string values
            const stringValue = value.toString().trim();
            if (stringValue) {
              params.set(key, stringValue);
            }
          }
        }
      });

      // Update URL without reloading
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      router.push(newUrl, { scroll: false });
    },
    [stack, router],
  );

  return [stack, setStack] as const;
}
