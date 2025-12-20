/**
 * Web Analytics Tracking Hooks
 * Track user interactions on the web app using PostHog
 */

"use client";

import { useCallback } from "react";
import { usePostHog } from "posthog-js/react";

// Stack Builder Events
export interface StackSelectionEvent {
  category: "frontend" | "backend" | "database" | "orm" | "auth" | "addon";
  value: string;
  previousValue?: string;
}

export interface PresetSelectionEvent {
  presetName: string;
  presetId: string;
}

export interface CommandGeneratedEvent {
  command: string;
  stack: {
    frontend?: string;
    backend?: string;
    database?: string;
    orm?: string;
    auth?: string;
    addons?: string[];
  };
  source: "builder" | "preset" | "direct";
}

export interface CommandCopiedEvent {
  command: string;
  stack: {
    frontend?: string;
    backend?: string;
    database?: string;
    orm?: string;
    auth?: string;
  };
}

export interface CompatibilityErrorEvent {
  errorType: string;
  conflictingItems: string[];
  suggestion?: string;
}

// Hook for tracking stack builder interactions
export function useStackBuilderTracking() {
  const posthog = usePostHog();

  const trackStackSelection = useCallback(
    (event: StackSelectionEvent) => {
      posthog?.capture("stack_option_selected", {
        category: event.category,
        selected_value: event.value,
        previous_value: event.previousValue,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackPresetSelection = useCallback(
    (event: PresetSelectionEvent) => {
      posthog?.capture("preset_selected", {
        preset_name: event.presetName,
        preset_id: event.presetId,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackCommandGenerated = useCallback(
    (event: CommandGeneratedEvent) => {
      posthog?.capture("command_generated", {
        command: event.command,
        stack_frontend: event.stack.frontend,
        stack_backend: event.stack.backend,
        stack_database: event.stack.database,
        stack_orm: event.stack.orm,
        stack_auth: event.stack.auth,
        stack_addons: event.stack.addons?.join(","),
        stack_combination: `${event.stack.frontend}-${event.stack.backend}-${event.stack.database}`,
        source: event.source,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackCommandCopied = useCallback(
    (event: CommandCopiedEvent) => {
      posthog?.capture("command_copied", {
        command: event.command,
        stack_frontend: event.stack.frontend,
        stack_backend: event.stack.backend,
        stack_database: event.stack.database,
        stack_combination: `${event.stack.frontend}-${event.stack.backend}-${event.stack.database}`,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackCompatibilityError = useCallback(
    (event: CompatibilityErrorEvent) => {
      posthog?.capture("compatibility_error", {
        error_type: event.errorType,
        conflicting_items: event.conflictingItems.join(","),
        suggestion: event.suggestion,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackBuilderStepCompleted = useCallback(
    (step: string, stepNumber: number, totalSteps: number) => {
      posthog?.capture("builder_step_completed", {
        step_name: step,
        step_number: stepNumber,
        total_steps: totalSteps,
        completion_percentage: Math.round((stepNumber / totalSteps) * 100),
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackBuilderAbandoned = useCallback(
    (lastStep: string, stepNumber: number, totalSteps: number) => {
      posthog?.capture("builder_abandoned", {
        last_step: lastStep,
        step_number: stepNumber,
        total_steps: totalSteps,
        completion_percentage: Math.round((stepNumber / totalSteps) * 100),
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  return {
    trackStackSelection,
    trackPresetSelection,
    trackCommandGenerated,
    trackCommandCopied,
    trackCompatibilityError,
    trackBuilderStepCompleted,
    trackBuilderAbandoned,
  };
}

// Hook for tracking page performance
export function usePerformanceTracking() {
  const posthog = usePostHog();

  const trackPageLoad = useCallback(
    (metrics: {
      ttfb?: number;
      fcp?: number;
      lcp?: number;
      cls?: number;
      fid?: number;
    }) => {
      posthog?.capture("page_performance", {
        ttfb_ms: metrics.ttfb,
        fcp_ms: metrics.fcp,
        lcp_ms: metrics.lcp,
        cls: metrics.cls,
        fid_ms: metrics.fid,
        page_url: typeof window !== "undefined" ? window.location.pathname : "",
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  return { trackPageLoad };
}

// Hook for tracking user engagement
export function useEngagementTracking() {
  const posthog = usePostHog();

  const trackDocumentationView = useCallback(
    (docPath: string, docTitle: string) => {
      posthog?.capture("documentation_viewed", {
        doc_path: docPath,
        doc_title: docTitle,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackExternalLinkClick = useCallback(
    (url: string, linkType: "github" | "npm" | "docs" | "other") => {
      posthog?.capture("external_link_clicked", {
        url,
        link_type: linkType,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackFeatureInterest = useCallback(
    (featureName: string) => {
      posthog?.capture("feature_interest", {
        feature_name: featureName,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  const trackSponsorClick = useCallback(
    (sponsorName: string, tier: string) => {
      posthog?.capture("sponsor_clicked", {
        sponsor_name: sponsorName,
        sponsor_tier: tier,
        timestamp: new Date().toISOString(),
      });
    },
    [posthog],
  );

  return {
    trackDocumentationView,
    trackExternalLinkClick,
    trackFeatureInterest,
    trackSponsorClick,
  };
}

// Privacy-safe analytics identifier
export function useAnalyticsId() {
  const posthog = usePostHog();

  const getAnonymousId = useCallback(() => {
    return posthog?.get_distinct_id() || null;
  }, [posthog]);

  const optOut = useCallback(() => {
    posthog?.opt_out_capturing();
  }, [posthog]);

  const optIn = useCallback(() => {
    posthog?.opt_in_capturing();
  }, [posthog]);

  const hasOptedOut = useCallback(() => {
    return posthog?.has_opted_out_capturing() || false;
  }, [posthog]);

  return {
    getAnonymousId,
    optOut,
    optIn,
    hasOptedOut,
  };
}
