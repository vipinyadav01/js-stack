/**
 * PostHog Analytics for CLI
 * Tracks CLI usage, errors, and system metrics
 */

import { PostHog } from "posthog-node";
import os from "os";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

class Analytics {
  private client: PostHog | null = null;
  private userId: string;
  private enabled: boolean = true;

  constructor() {
    // Get or create anonymous user ID
    this.userId = this.getOrCreateUserId();

    // Only initialize if not in CI or test environment
    const apiKey = process.env.POSTHOG_API_KEY;
    const apiHost = process.env.POSTHOG_HOST || "https://app.posthog.com";

    if (
      !process.env.CI &&
      process.env.NODE_ENV !== "test" &&
      !this.isOptedOut() &&
      apiKey
    ) {
      try {
        this.client = new PostHog(apiKey, {
          host: apiHost,
        });
      } catch (error) {
        // Silently fail if PostHog can't be initialized
        this.enabled = false;
      }
    } else {
      this.enabled = false;
    }
  }

  private getOrCreateUserId(): string {
    const configDir = path.join(os.homedir(), ".create-js-stack");
    const idFile = path.join(configDir, "user-id");

    try {
      if (fs.existsSync(idFile)) {
        return fs.readFileSync(idFile, "utf-8").trim();
      }
    } catch (e) {
      // Ignore read errors
    }

    // Create new ID (using crypto.randomBytes for UUID v4-like ID)
    const newId = `${randomBytes(16).toString("hex")}-${randomBytes(8).toString("hex")}-${randomBytes(8).toString("hex")}-${randomBytes(8).toString("hex")}-${randomBytes(12).toString("hex")}`;
    try {
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(idFile, newId);
    } catch (e) {
      // Ignore write errors
    }

    return newId;
  }

  private isOptedOut(): boolean {
    const optOut =
      process.env.DISABLE_ANALYTICS === "true" ||
      fs.existsSync(
        path.join(os.homedir(), ".create-js-stack", "no-analytics"),
      );

    return optOut === true;
  }

  private getSystemInfo() {
    return {
      os: os.platform(),
      os_version: os.release(),
      arch: os.arch(),
      node_version: process.version,
      cpu_cores: os.cpus().length,
      total_memory_gb: Math.round(os.totalmem() / 1024 / 1024 / 1024),
      free_memory_gb: Math.round(os.freemem() / 1024 / 1024 / 1024),
    };
  }

  track(event: string, properties?: Record<string, unknown>) {
    if (!this.enabled || !this.client) return;

    try {
      this.client.capture({
        distinctId: this.userId,
        event,
        properties: {
          ...properties,
          ...this.getSystemInfo(),
          cli_version: process.env.npm_package_version || "unknown",
        },
      });
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  identify(properties?: Record<string, unknown>) {
    if (!this.enabled || !this.client) return;

    try {
      this.client.identify({
        distinctId: this.userId,
        properties,
      });
    } catch (error) {
      // Silently fail if identification fails
    }
  }

  async shutdown() {
    if (this.client) {
      try {
        await this.client.shutdown();
      } catch (error) {
        // Ignore shutdown errors
      }
    }
  }
}

export const analytics = new Analytics();
