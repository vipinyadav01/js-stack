/**
 * PostHog Analytics for CLI
 * Tracks CLI usage, errors, and system metrics with privacy controls
 */

import { PostHog } from "posthog-node";
import os from "os";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

// Event types for CLI tracking
export interface CLIEvent {
  command: string;
  [key: string]: unknown;
}

export interface StackConfig {
  frontend?: string;
  backend?: string;
  database?: string;
  orm?: string;
  auth?: string;
  addons?: string[];
  packageManager?: string;
}

class Analytics {
  private client: PostHog | null = null;
  private userId: string;
  private enabled: boolean = true;
  private sessionId: string;
  private commandStartTime: number = 0;

  constructor() {
    // Generate session ID for this CLI run
    this.sessionId = randomBytes(8).toString("hex");

    // Get or create anonymous user ID
    this.userId = this.getOrCreateUserId();

    // Check if analytics should be enabled
    this.enabled = this.shouldEnableAnalytics();

    if (this.enabled) {
      const apiKey = process.env.POSTHOG_API_KEY;
      const apiHost = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

      if (apiKey) {
        try {
          this.client = new PostHog(apiKey, {
            host: apiHost,
            flushAt: 1, // Flush immediately for CLI
            flushInterval: 0,
          });
        } catch {
          // Silently fail if PostHog can't be initialized
          this.enabled = false;
        }
      } else {
        this.enabled = false;
      }
    }
  }

  /**
   * Check if analytics should be enabled based on environment and user preferences
   */
  private shouldEnableAnalytics(): boolean {
    // Disable in CI environments
    if (this.isCI()) {
      return false;
    }

    // Disable in test environments
    if (process.env.NODE_ENV === "test") {
      return false;
    }

    // Check for user opt-out
    if (this.isOptedOut()) {
      return false;
    }

    // Check for environment variable opt-out
    if (
      process.env.DISABLE_ANALYTICS === "true" ||
      process.env.DO_NOT_TRACK === "1" ||
      process.env.JSSTACK_NO_TELEMETRY === "true"
    ) {
      return false;
    }

    return true;
  }

  /**
   * Detect CI environment
   */
  private isCI(): boolean {
    return !!(
      process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.CIRCLECI ||
      process.env.TRAVIS ||
      process.env.JENKINS_URL ||
      process.env.BUILDKITE ||
      process.env.CODEBUILD_BUILD_ID ||
      process.env.TF_BUILD // Azure Pipelines
    );
  }

  /**
   * Get or create persistent anonymous user ID
   */
  private getOrCreateUserId(): string {
    const configDir = path.join(os.homedir(), ".create-js-stack");
    const idFile = path.join(configDir, "anonymous-id");

    try {
      if (fs.existsSync(idFile)) {
        const id = fs.readFileSync(idFile, "utf-8").trim();
        if (id && id.length > 0) {
          return id;
        }
      }
    } catch {
      // Ignore read errors
    }

    // Create new anonymous ID (UUID v4-like)
    const bytes = randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant
    const hex = bytes.toString("hex");
    const newId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;

    try {
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(idFile, newId);
    } catch {
      // Ignore write errors
    }

    return newId;
  }

  /**
   * Check if user has opted out of analytics
   */
  private isOptedOut(): boolean {
    const optOutFile = path.join(
      os.homedir(),
      ".create-js-stack",
      "no-analytics",
    );
    return fs.existsSync(optOutFile);
  }

  /**
   * Get system information (anonymized)
   */
  private getSystemInfo() {
    const cpus = os.cpus();
    return {
      os: os.platform(),
      os_version: os.release(),
      arch: os.arch(),
      node_version: process.version,
      cpu_cores: cpus.length,
      cpu_model: cpus[0]?.model?.split("@")[0]?.trim() || "unknown",
      total_memory_gb: Math.round(os.totalmem() / 1024 / 1024 / 1024),
      free_memory_gb: Math.round(os.freemem() / 1024 / 1024 / 1024),
      shell: process.env.SHELL || process.env.COMSPEC || "unknown",
      terminal: process.env.TERM_PROGRAM || process.env.TERM || "unknown",
    };
  }

  /**
   * Track an event
   */
  track(event: string, properties?: Record<string, unknown>) {
    if (!this.enabled || !this.client) return;

    try {
      this.client.capture({
        distinctId: this.userId,
        event,
        properties: {
          ...properties,
          ...this.getSystemInfo(),
          session_id: this.sessionId,
          cli_version: process.env.npm_package_version || "unknown",
          timestamp: new Date().toISOString(),
        },
      });
    } catch {
      // Silently fail if tracking fails
    }
  }

  /**
   * Track command start
   */
  trackCommandStart(command: string, options?: Record<string, unknown>) {
    this.commandStartTime = Date.now();
    this.track("cli_command_started", {
      command,
      options,
    });
  }

  /**
   * Track successful command completion
   */
  trackCommandSuccess(
    command: string,
    stack?: StackConfig,
    metadata?: Record<string, unknown>,
  ) {
    const duration = Date.now() - this.commandStartTime;
    this.track("cli_command_completed", {
      command,
      success: true,
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
      stack_combination: stack
        ? `${stack.frontend || "none"}-${stack.backend || "none"}-${stack.database || "none"}`
        : undefined,
      stack_frontend: stack?.frontend,
      stack_backend: stack?.backend,
      stack_database: stack?.database,
      stack_orm: stack?.orm,
      stack_auth: stack?.auth,
      stack_addons: stack?.addons?.join(","),
      package_manager: stack?.packageManager,
      ...metadata,
    });
  }

  /**
   * Track command failure
   */
  trackCommandFailure(
    command: string,
    error: Error | string,
    metadata?: Record<string, unknown>,
  ) {
    const duration = Date.now() - this.commandStartTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorType = error instanceof Error ? error.name : "Error";

    this.track("cli_command_failed", {
      command,
      success: false,
      duration_ms: duration,
      error_message: this.sanitizeErrorMessage(errorMessage),
      error_type: errorType,
      ...metadata,
    });
  }

  /**
   * Track template generation
   */
  trackTemplateGeneration(
    stack: StackConfig,
    options?: Record<string, unknown>,
  ) {
    this.track("template_generation_started", {
      stack_combination: `${stack.frontend || "none"}-${stack.backend || "none"}-${stack.database || "none"}`,
      stack_frontend: stack.frontend,
      stack_backend: stack.backend,
      stack_database: stack.database,
      stack_orm: stack.orm,
      stack_auth: stack.auth,
      stack_addons: stack.addons?.join(","),
      package_manager: stack.packageManager,
      ...options,
    });
  }

  /**
   * Track dependency installation
   */
  trackInstallation(
    packageManager: string,
    success: boolean,
    durationMs: number,
    dependencyCount?: number,
  ) {
    this.track("dependency_installation", {
      package_manager: packageManager,
      success,
      duration_ms: durationMs,
      dependency_count: dependencyCount,
    });
  }

  /**
   * Track validation events
   */
  trackValidation(valid: boolean, errors?: string[], autoFixed?: boolean) {
    this.track("config_validation", {
      valid,
      error_count: errors?.length || 0,
      errors: errors?.slice(0, 5), // Limit to first 5 errors
      auto_fixed: autoFixed,
    });
  }

  /**
   * Sanitize error messages to remove potentially sensitive information
   */
  private sanitizeErrorMessage(message: string): string {
    // Remove file paths
    let sanitized = message.replace(/[A-Z]:\\[^\s]+|\/[^\s]+/gi, "[PATH]");
    // Remove URLs
    sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, "[URL]");
    // Remove potential tokens or keys
    sanitized = sanitized.replace(/[a-zA-Z0-9]{32,}/g, "[REDACTED]");
    return sanitized.slice(0, 500); // Limit length
  }

  /**
   * Identify user (for linking sessions)
   */
  identify(properties?: Record<string, unknown>) {
    if (!this.enabled || !this.client) return;

    try {
      this.client.identify({
        distinctId: this.userId,
        properties: {
          first_seen: new Date().toISOString(),
          ...this.getSystemInfo(),
          ...properties,
        },
      });
    } catch {
      // Silently fail if identification fails
    }
  }

  /**
   * Flush and shutdown analytics
   */
  async shutdown(): Promise<void> {
    if (this.client) {
      try {
        await this.client.shutdown();
      } catch {
        // Ignore shutdown errors
      }
    }
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get the anonymous user ID (for transparency)
   */
  getAnonymousId(): string {
    return this.userId;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export functions for opting out
export function optOutOfAnalytics(): void {
  const configDir = path.join(os.homedir(), ".create-js-stack");
  const optOutFile = path.join(configDir, "no-analytics");

  try {
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(optOutFile, "opted-out\n");
    console.log("✓ Analytics disabled. You can re-enable by deleting:");
    console.log(`  ${optOutFile}`);
  } catch {
    console.error("Failed to disable analytics");
  }
}

export function optInToAnalytics(): void {
  const optOutFile = path.join(
    os.homedir(),
    ".create-js-stack",
    "no-analytics",
  );

  try {
    if (fs.existsSync(optOutFile)) {
      fs.unlinkSync(optOutFile);
      console.log("✓ Analytics enabled");
    } else {
      console.log("Analytics was already enabled");
    }
  } catch {
    console.error("Failed to enable analytics");
  }
}

export function showAnalyticsStatus(): void {
  const optOutFile = path.join(
    os.homedir(),
    ".create-js-stack",
    "no-analytics",
  );
  const isOptedOut = fs.existsSync(optOutFile);
  const isCI = !!(
    process.env.CI ||
    process.env.CONTINUOUS_INTEGRATION ||
    process.env.GITHUB_ACTIONS
  );

  console.log("\n📊 Analytics Status:");
  console.log(`  Opted Out: ${isOptedOut ? "Yes" : "No"}`);
  console.log(`  CI Environment: ${isCI ? "Yes (disabled)" : "No"}`);
  console.log(
    `  Environment Opt-Out: ${process.env.DISABLE_ANALYTICS === "true" ? "Yes" : "No"}`,
  );
  console.log("\nTo opt out, run: jsstack analytics --disable");
  console.log("To opt in, run: jsstack analytics --enable\n");
}
