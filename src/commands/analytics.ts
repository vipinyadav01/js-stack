/**
 * Analytics command for CLI
 * Allows users to manage analytics preferences
 */

import chalk from "chalk";
import {
  analytics,
  optOutOfAnalytics,
  optInToAnalytics,
  showAnalyticsStatus,
} from "../analytics/posthog.js";

interface AnalyticsOptions {
  enable?: boolean;
  disable?: boolean;
  status?: boolean;
}

export function analyticsCommand(options: AnalyticsOptions): void {
  console.log(
    chalk.cyan(`
    📊 JS-Stack Analytics
    `),
  );

  if (options.disable) {
    optOutOfAnalytics();
    console.log(
      chalk.dim(`
  We respect your privacy. Anonymous analytics help us improve JS-Stack.
  No personally identifiable information is ever collected.
    `),
    );
    return;
  }

  if (options.enable) {
    optInToAnalytics();
    console.log(
      chalk.dim(`
  Thank you! Anonymous analytics help us understand usage patterns
  and improve JS-Stack for everyone.
    `),
    );
    return;
  }

  // Default: show status
  showAnalyticsStatus();

  console.log(chalk.cyan("\n  What we collect (anonymously):"));
  console.log(chalk.dim("  • Command usage (create, list, etc.)"));
  console.log(chalk.dim("  • Stack combinations selected"));
  console.log(chalk.dim("  • Build success/failure rates"));
  console.log(chalk.dim("  • System info (OS, Node version, CPU cores)"));
  console.log(chalk.dim("  • Build duration"));

  console.log(chalk.cyan("\n  What we DON'T collect:"));
  console.log(chalk.dim("  • Personal information"));
  console.log(chalk.dim("  • Project names or file contents"));
  console.log(chalk.dim("  • IP addresses (stripped before storage)"));
  console.log(chalk.dim("  • Credentials or tokens"));

  console.log(chalk.cyan("\n  Privacy features:"));
  console.log(chalk.dim("  • Anonymous ID (not linked to you)"));
  console.log(chalk.dim("  • Auto-disabled in CI environments"));
  console.log(chalk.dim("  • Respects DO_NOT_TRACK environment variable"));
  console.log(chalk.dim("  • Easy opt-out at any time"));

  if (analytics.isEnabled()) {
    console.log(
      chalk.dim(
        `\n  Your anonymous ID: ${analytics.getAnonymousId().slice(0, 8)}...`,
      ),
    );
  }

  console.log("");
}
