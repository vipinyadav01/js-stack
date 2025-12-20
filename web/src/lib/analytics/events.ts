/**
 * Analytics Events Reference
 * Comprehensive list of all tracked events for PostHog
 *
 * This file serves as documentation and type definitions for analytics events
 */

// ============================================================================
// CLI EVENTS
// ============================================================================

/**
 * Fired when a CLI command starts execution
 */
export interface CLICommandStartedEvent {
  event: "cli_command_started";
  properties: {
    command: "create" | "list" | "add-preset" | "info" | "analytics";
    project_name?: string;
    options?: Record<string, unknown>;
    // System info (auto-added)
    os: string;
    os_version: string;
    arch: string;
    node_version: string;
    cpu_cores: number;
    total_memory_gb: number;
    cli_version: string;
  };
}

/**
 * Fired when a CLI command completes successfully
 */
export interface CLICommandCompletedEvent {
  event: "cli_command_completed";
  properties: {
    command: string;
    success: true;
    duration_ms: number;
    duration_seconds: number;
    // Stack info (for create command)
    stack_combination?: string; // e.g., "react-express-postgresql"
    stack_frontend?: string;
    stack_backend?: string;
    stack_database?: string;
    stack_orm?: string;
    stack_auth?: string;
    stack_addons?: string;
    package_manager?: string;
    has_git?: boolean;
    has_install?: boolean;
    dry_run?: boolean;
  };
}

/**
 * Fired when a CLI command fails
 */
export interface CLICommandFailedEvent {
  event: "cli_command_failed";
  properties: {
    command: string;
    success: false;
    duration_ms: number;
    error_message: string;
    error_type: string;
  };
}

/**
 * Fired when template generation starts
 */
export interface TemplateGenerationStartedEvent {
  event: "template_generation_started";
  properties: {
    stack_combination: string;
    stack_frontend?: string;
    stack_backend?: string;
    stack_database?: string;
    stack_orm?: string;
    stack_auth?: string;
    stack_addons?: string;
    package_manager?: string;
  };
}

/**
 * Fired when dependencies are installed
 */
export interface DependencyInstallationEvent {
  event: "dependency_installation";
  properties: {
    package_manager: string;
    success: boolean;
    duration_ms: number;
    dependency_count?: number;
  };
}

/**
 * Fired when config validation runs
 */
export interface ConfigValidationEvent {
  event: "config_validation";
  properties: {
    valid: boolean;
    error_count: number;
    errors?: string[];
    auto_fixed?: boolean;
  };
}

// ============================================================================
// WEB EVENTS
// ============================================================================

/**
 * Fired when user selects an option in the stack builder
 */
export interface StackOptionSelectedEvent {
  event: "stack_option_selected";
  properties: {
    category: "frontend" | "backend" | "database" | "orm" | "auth" | "addon";
    selected_value: string;
    previous_value?: string;
  };
}

/**
 * Fired when user selects a preset
 */
export interface PresetSelectedEvent {
  event: "preset_selected";
  properties: {
    preset_name: string;
    preset_id: string;
  };
}

/**
 * Fired when a command is generated from the builder
 */
export interface CommandGeneratedEvent {
  event: "command_generated";
  properties: {
    command: string;
    stack_frontend?: string;
    stack_backend?: string;
    stack_database?: string;
    stack_orm?: string;
    stack_auth?: string;
    stack_addons?: string;
    stack_combination: string;
    source: "builder" | "preset" | "direct";
  };
}

/**
 * Fired when user copies a command
 */
export interface CommandCopiedEvent {
  event: "command_copied";
  properties: {
    command: string;
    stack_combination: string;
  };
}

/**
 * Fired when a compatibility error occurs
 */
export interface CompatibilityErrorEvent {
  event: "compatibility_error";
  properties: {
    error_type: string;
    conflicting_items: string;
    suggestion?: string;
  };
}

/**
 * Fired when user completes a step in the builder
 */
export interface BuilderStepCompletedEvent {
  event: "builder_step_completed";
  properties: {
    step_name: string;
    step_number: number;
    total_steps: number;
    completion_percentage: number;
  };
}

/**
 * Fired when user abandons the builder
 */
export interface BuilderAbandonedEvent {
  event: "builder_abandoned";
  properties: {
    last_step: string;
    step_number: number;
    total_steps: number;
    completion_percentage: number;
  };
}

/**
 * Fired when documentation is viewed
 */
export interface DocumentationViewedEvent {
  event: "documentation_viewed";
  properties: {
    doc_path: string;
    doc_title: string;
  };
}

/**
 * Fired when external link is clicked
 */
export interface ExternalLinkClickedEvent {
  event: "external_link_clicked";
  properties: {
    url: string;
    link_type: "github" | "npm" | "docs" | "other";
  };
}

/**
 * Fired when sponsor is clicked
 */
export interface SponsorClickedEvent {
  event: "sponsor_clicked";
  properties: {
    sponsor_name: string;
    sponsor_tier: string;
  };
}

// ============================================================================
// PERFORMANCE EVENTS
// ============================================================================

/**
 * Page load performance metrics
 */
export interface PageLoadPerformanceEvent {
  event: "page_load_performance";
  properties: {
    dns_lookup_ms: number;
    connection_ms: number;
    ttfb_ms: number;
    dom_interactive_ms: number;
    dom_complete_ms: number;
    load_complete_ms: number;
    transfer_size_kb: number;
  };
}

/**
 * Web Vitals metrics (auto-captured by PostHog)
 */
export interface WebVitalsEvent {
  event: "$web_vitals";
  properties: {
    $web_vitals_LCP_value?: number;
    $web_vitals_FCP_value?: number;
    $web_vitals_CLS_value?: number;
    $web_vitals_FID_value?: number;
    $web_vitals_TTFB_value?: number;
  };
}

// ============================================================================
// POSTHOG INSIGHTS CONFIGURATION
// ============================================================================

/**
 * Pre-configured PostHog insights for the dashboard
 * These can be imported into PostHog to create dashboards
 */
export const posthogInsights = {
  // Stack Usage Distribution
  stackUsageDistribution: {
    name: "Stack Usage Distribution",
    query: `
      SELECT 
        properties.stack_combination AS stack,
        count() AS count
      FROM events
      WHERE event = 'cli_command_completed'
        AND properties.success = true
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY stack
      ORDER BY count DESC
      LIMIT 10
    `,
    visualization: "pie",
  },

  // Daily Command Volume
  dailyCommandVolume: {
    name: "Daily Command Volume",
    query: `
      SELECT 
        toDate(timestamp) AS date,
        count() AS commands
      FROM events
      WHERE event IN ('cli_command_completed', 'cli_command_failed')
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC
    `,
    visualization: "line",
  },

  // Success Rate Over Time
  successRateOverTime: {
    name: "Success Rate Over Time",
    query: `
      SELECT 
        toDate(timestamp) AS date,
        round(countIf(event = 'cli_command_completed' AND properties.success = true) * 100.0 / 
              count(), 2) AS success_rate
      FROM events
      WHERE event IN ('cli_command_completed', 'cli_command_failed')
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC
    `,
    visualization: "line",
  },

  // Package Manager Distribution
  packageManagerDistribution: {
    name: "Package Manager Distribution",
    query: `
      SELECT 
        properties.package_manager AS pm,
        count() AS count
      FROM events
      WHERE event = 'cli_command_completed'
        AND properties.package_manager IS NOT NULL
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY pm
      ORDER BY count DESC
    `,
    visualization: "bar",
  },

  // OS Distribution
  osDistribution: {
    name: "OS Distribution",
    query: `
      SELECT 
        properties.os AS os,
        count() AS count
      FROM events
      WHERE event = 'cli_command_started'
        AND properties.os IS NOT NULL
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY os
      ORDER BY count DESC
    `,
    visualization: "pie",
  },

  // Geographic Distribution
  geoDistribution: {
    name: "Geographic Distribution",
    query: `
      SELECT 
        properties.$geoip_country_code AS country,
        count() AS count
      FROM events
      WHERE timestamp > now() - INTERVAL 30 DAY
        AND properties.$geoip_country_code IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 15
    `,
    visualization: "world_map",
  },

  // Average Build Time by Stack
  avgBuildTimeByStack: {
    name: "Average Build Time by Stack",
    query: `
      SELECT 
        properties.stack_combination AS stack,
        round(avg(properties.duration_ms) / 1000, 1) AS avg_seconds,
        count() AS builds
      FROM events
      WHERE event = 'cli_command_completed'
        AND properties.success = true
        AND properties.duration_ms IS NOT NULL
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY stack
      HAVING builds > 5
      ORDER BY avg_seconds ASC
      LIMIT 10
    `,
    visualization: "bar",
  },

  // Error Rate by Error Type
  errorsByType: {
    name: "Errors by Type",
    query: `
      SELECT 
        properties.error_type AS error_type,
        count() AS count
      FROM events
      WHERE event = 'cli_command_failed'
        AND properties.error_type IS NOT NULL
        AND timestamp > now() - INTERVAL 30 DAY
      GROUP BY error_type
      ORDER BY count DESC
      LIMIT 10
    `,
    visualization: "bar",
  },

  // Web Builder Funnel
  builderFunnel: {
    name: "Stack Builder Funnel",
    events: [
      "stack_option_selected (category=frontend)",
      "stack_option_selected (category=backend)",
      "stack_option_selected (category=database)",
      "command_generated",
      "command_copied",
    ],
    visualization: "funnel",
  },

  // Web Vitals P50
  webVitalsP50: {
    name: "Web Vitals P50",
    query: `
      SELECT 
        quantile(0.5)(properties.$web_vitals_TTFB_value) AS ttfb_p50,
        quantile(0.5)(properties.$web_vitals_FCP_value) AS fcp_p50,
        quantile(0.5)(properties.$web_vitals_LCP_value) AS lcp_p50
      FROM events
      WHERE event = '$web_vitals'
        AND timestamp > now() - INTERVAL 7 DAY
    `,
    visualization: "number",
  },
};

// Export all event types for type checking
export type AnalyticsEvent =
  | CLICommandStartedEvent
  | CLICommandCompletedEvent
  | CLICommandFailedEvent
  | TemplateGenerationStartedEvent
  | DependencyInstallationEvent
  | ConfigValidationEvent
  | StackOptionSelectedEvent
  | PresetSelectedEvent
  | CommandGeneratedEvent
  | CommandCopiedEvent
  | CompatibilityErrorEvent
  | BuilderStepCompletedEvent
  | BuilderAbandonedEvent
  | DocumentationViewedEvent
  | ExternalLinkClickedEvent
  | SponsorClickedEvent
  | PageLoadPerformanceEvent
  | WebVitalsEvent;
