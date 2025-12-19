/**
 * PostHog API integration for analytics dashboard
 * Fetches real analytics data from PostHog
 */

// Note: This is a placeholder implementation
// In production, you would use PostHog's API to fetch insights
// For now, we'll return mock data that can be replaced with real API calls

export async function getStackAdoptionRate(): Promise<number> {
  // TODO: Query PostHog API for stack adoption rate
  // Example: Query events where stack_option_selected occurred
  // Calculate: (unique users who selected stack) / (total unique users) * 100
  return 67; // Mock data
}

export async function getTopStacks(
  limit = 10,
): Promise<Array<{ stack: string; count: number; percentage: number }>> {
  // TODO: Query PostHog API for top stack combinations
  // Example: Query cli_command_completed events
  // Group by stack_combination property
  // Return top N stacks with counts and percentages

  // Mock data - replace with real PostHog query
  return [
    { stack: "react-express-postgresql", count: 820, percentage: 28 },
    { stack: "nextjs-express-postgresql", count: 640, percentage: 22 },
    { stack: "vue-fastify-postgresql", count: 410, percentage: 14 },
    { stack: "nestjs-react-postgresql", count: 360, percentage: 12 },
    { stack: "svelte-express-sqlite", count: 230, percentage: 8 },
  ].slice(0, limit);
}

export async function getPackageManagerStats(): Promise<{
  usage: Record<string, number>;
  installTimes: Record<string, number>;
}> {
  // TODO: Query PostHog API for package manager stats
  // Example: Query cli_command_completed events
  // Group by package_manager property
  // Calculate P50 install times from duration_ms

  // Mock data - replace with real PostHog query
  return {
    usage: {
      npm: 48,
      pnpm: 32,
      yarn: 18,
      bun: 2,
    },
    installTimes: {
      npm: 8200,
      pnpm: 5400,
      yarn: 7400,
      bun: 3100,
    },
  };
}

export async function getSystemMetrics(): Promise<{
  os: Record<string, number>;
  cpu_p50: number;
  memory_p50: number;
}> {
  // TODO: Query PostHog API for system metrics
  // Example: Query cli_command_started events
  // Group by os property
  // Calculate P50 for cpu_cores and total_memory_gb

  // Mock data - replace with real PostHog query
  return {
    os: {
      Windows: 56,
      macOS: 28,
      Linux: 16,
    },
    cpu_p50: 8,
    memory_p50: 16,
  };
}

export async function getDeploymentAnalytics(): Promise<{
  buildsPerDay: number;
  successRatePct: number;
  avgBuildSeconds: number;
}> {
  // TODO: Query PostHog API for deployment analytics
  // Example: Query cli_command_completed events
  // Calculate: builds per day, success rate, average build time

  // Mock data - replace with real PostHog query
  return {
    buildsPerDay: 126,
    successRatePct: 97,
    avgBuildSeconds: 86,
  };
}

export async function getStackTrends(
  days = 30,
): Promise<Array<{ date: string; value: number }>> {
  // TODO: Query PostHog API for stack trends over time
  // Example: Query cli_command_completed events grouped by day
  // Return time series data

  // Mock data - replace with real PostHog query
  const trends = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    trends.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(50 + Math.random() * 50),
    });
  }
  return trends;
}
