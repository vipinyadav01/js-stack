"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Check if we're in development mode
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Clear any PostHog localStorage data to prevent script loading issues
 */
function clearPostHogData() {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("ph_") ||
        key.startsWith("posthog") ||
        key.startsWith("jsstack_ph"),
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore errors
  }
}

/**
 * PostHog Provider - Only initializes in production with valid API key
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Skip in development and clear any existing data
    if (IS_DEVELOPMENT) {
      clearPostHogData();
      return;
    }

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    // Only initialize if we have a valid API key
    if (
      posthogKey &&
      posthogKey.startsWith("phc_") &&
      typeof window !== "undefined"
    ) {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: "identified_only",
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: true,
          capture_performance: false, // Disable web vitals in all environments
          disable_external_dependency_loading: true, // Prevent external script loading
          respect_dnt: true,
          property_denylist: ["$ip"],
          persistence: "localStorage+cookie",
          persistence_name: "jsstack_ph",
        });
      } catch {
        // Silently fail
      }
    }
  }, []);

  // In development, just render children without PostHog wrapper
  if (IS_DEVELOPMENT) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * PageView tracking - noop in development
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    // Skip in development
    if (IS_DEVELOPMENT) return;
    if (!pathname || !posthogClient) return;

    const fullPath = `${pathname}${searchParams ? `?${searchParams.toString()}` : ""}`;
    if (fullPath === lastPathRef.current) return;
    lastPathRef.current = fullPath;

    posthogClient.capture("$pageview", {
      $current_url: window.origin + fullPath,
      $pathname: pathname,
    });
  }, [pathname, searchParams, posthogClient]);

  return null;
}

/**
 * Privacy controls hook
 */
export function usePrivacyControls() {
  const posthogClient = usePostHog();

  return {
    isOptedOut: posthogClient?.has_opted_out_capturing() || false,
    optOut: () => {
      posthogClient?.opt_out_capturing();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("posthog_opted_out", "true");
      }
    },
    optIn: () => {
      posthogClient?.opt_in_capturing();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("posthog_opted_out");
      }
    },
  };
}
