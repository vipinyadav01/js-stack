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
  packageManager: string;
  git: string;
  install: string;
  yolo: string;
}

const DEFAULT_STACK: StackState = {
  projectName: "my-app",
  frontend: [],
  backend: "none",
  database: "none",
  orm: "none",
  auth: "none",
  addons: [],
  packageManager: "npm",
  git: "true",
  install: "true",
  yolo: "false",
};

export function useStackState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse stack from URL parameters
  const stack = useMemo(() => {
    const state: Partial<StackState> = { ...DEFAULT_STACK };

    for (const [key, value] of searchParams.entries()) {
      if (key in DEFAULT_STACK) {
        const defaultValue = DEFAULT_STACK[key as keyof StackState];
        if (Array.isArray(defaultValue)) {
          (state as Record<string, unknown>)[key] = value
            ? value.split(",")
            : [];
        } else {
          (state as Record<string, unknown>)[key] = value;
        }
      }
    }

    return state as StackState;
  }, [searchParams]);

  // Update stack and URL
  const setStack = useCallback(
    (updates: Partial<StackState>) => {
      const newStack = { ...stack, ...updates };
      const params = new URLSearchParams();

      // Add all non-default values to URL
      Object.entries(newStack).forEach(([key, value]) => {
        const defaultValue = DEFAULT_STACK[key as keyof StackState];
        if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(","));
            }
          } else {
            params.set(key, value.toString());
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
