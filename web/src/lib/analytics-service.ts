// Lightweight mock analytics service with cached aggregates
// Replace implementations with real data sources over time.

export type KPI = {
  label: string;
  value: string | number;
  help?: string;
};

export type StackUsageItem = {
  stack: string;
  percentage: number; // 0-100
  users: number;
};

export type TrendPoint = {
  t: string; // ISO date (day)
  value: number;
};

export type PackageManagerStat = {
  name: string;
  share: number; // 0-100
  versions: { version: string; share: number }[];
  perf: { installMsP50: number; resolveMsP50: number };
};

export type SystemMetrics = {
  os: { name: string; share: number }[];
  versions: { os: string; version: string; share: number }[];
  hardware: {
    cpuCoresP50: number;
    ramGBp50: number;
    storageUsedPctP50: number;
  };
};

export type DeploymentAnalytics = {
  buildsPerDay: number;
  successRatePct: number;
  avgBuildSeconds: number;
  geo: { region: string; share: number }[];
};

export type PerformanceMetrics = {
  ttfbMsP50: number;
  fcpMsP50: number;
  lcpMsP50: number;
  bundleKBp50: number;
  cacheHitRatePct: number;
  bandwidthGB: number;
};

const now = new Date();
const days = (n: number) => {
  const out: TrendPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({
      t: d.toISOString().slice(0, 10),
      value: Math.round(50 + Math.random() * 50),
    });
  }
  return out;
};

export async function getKPIs(): Promise<KPI[]> {
  return [
    {
      label: "Stack adoption",
      value: "67%",
      help: "Share of users with preferred stacks",
    },
    { label: "Avg users/stack", value: 124 },
    { label: "System compatibility", value: "95%" },
    { label: "PM efficiency", value: "A-" },
    { label: "CF performance", value: "92" },
  ];
}

export async function getStackUsage(): Promise<StackUsageItem[]> {
  return [
    { stack: "react+express", percentage: 28, users: 820 },
    { stack: "nextjs", percentage: 22, users: 640 },
    { stack: "vue+fastify", percentage: 14, users: 410 },
    { stack: "nestjs+react", percentage: 12, users: 360 },
    { stack: "svelte", percentage: 8, users: 230 },
    { stack: "nuxt", percentage: 6, users: 180 },
    { stack: "angular", percentage: 5, users: 150 },
    { stack: "other", percentage: 5, users: 140 },
  ];
}

export async function getStackTrends(
  range: "7d" | "30d" | "90d" = "30d",
): Promise<{ range: string; points: TrendPoint[] }> {
  const n = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  return { range, points: days(n) };
}

export async function getTopStacks(n = 3): Promise<StackUsageItem[]> {
  const all = await getStackUsage();
  return all.slice(0, n);
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  return {
    os: [
      { name: "Windows", share: 56 },
      { name: "macOS", share: 28 },
      { name: "Linux", share: 16 },
    ],
    versions: [
      { os: "Windows", version: "11", share: 40 },
      { os: "Windows", version: "10", share: 16 },
      { os: "macOS", version: "14", share: 18 },
      { os: "macOS", version: "13", share: 10 },
      { os: "Linux", version: "Ubuntu 22.04", share: 8 },
    ],
    hardware: { cpuCoresP50: 8, ramGBp50: 16, storageUsedPctP50: 42 },
  };
}

export async function getPackageManagerStats(): Promise<PackageManagerStat[]> {
  return [
    {
      name: "npm",
      share: 48,
      versions: [
        { version: "10", share: 60 },
        { version: "9", share: 35 },
      ],
      perf: { installMsP50: 8200, resolveMsP50: 1200 },
    },
    {
      name: "pnpm",
      share: 32,
      versions: [
        { version: "9", share: 70 },
        { version: "8", share: 25 },
      ],
      perf: { installMsP50: 5400, resolveMsP50: 900 },
    },
    {
      name: "yarn",
      share: 18,
      versions: [{ version: "1", share: 85 }],
      perf: { installMsP50: 7400, resolveMsP50: 1100 },
    },
    {
      name: "bun",
      share: 2,
      versions: [{ version: "1", share: 100 }],
      perf: { installMsP50: 3100, resolveMsP50: 700 },
    },
  ];
}

export async function getDeploymentAnalytics(): Promise<DeploymentAnalytics> {
  return {
    buildsPerDay: 126,
    successRatePct: 97,
    avgBuildSeconds: 86,
    geo: [
      { region: "NA", share: 39 },
      { region: "EU", share: 34 },
      { region: "APAC", share: 22 },
      { region: "LATAM", share: 5 },
    ],
  };
}

export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  return {
    ttfbMsP50: 120,
    fcpMsP50: 890,
    lcpMsP50: 1650,
    bundleKBp50: 180,
    cacheHitRatePct: 78,
    bandwidthGB: 42,
  };
}

export async function getGeoMetrics(): Promise<
  { region: string; value: number }[]
> {
  return [
    { region: "US", value: 320 },
    { region: "DE", value: 140 },
    { region: "IN", value: 260 },
    { region: "BR", value: 80 },
    { region: "JP", value: 90 },
  ];
}
