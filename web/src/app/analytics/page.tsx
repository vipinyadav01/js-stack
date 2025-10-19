"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  Clock,
  Zap,
  BarChart3,
  Package,
  Globe,
  Users,
  Download,
  Star,
  GitFork,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import {
  fetchNpmPackageData,
  fetchGitHubRepoData,
  NpmPackageData,
  GitHubRepoData,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const KPICards = dynamic(() => import("@/components/analytics/KPICards"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/20 rounded-lg h-32" />,
});

const TopStacksBar = dynamic(
  () => import("@/components/analytics/TopStacksBar"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-64" />
    ),
  },
);

const StackUsagePie = dynamic(
  () => import("@/components/analytics/StackUsagePie"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-64" />
    ),
  },
);

const StackTrendsLine = dynamic(
  () => import("@/components/analytics/StackTrendsLine"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-64" />
    ),
  },
);

const PackageManagerStats = dynamic(
  () => import("@/components/analytics/PackageManagerStats"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const SystemMetrics = dynamic(
  () => import("@/components/analytics/SystemMetrics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const DeploymentAnalytics = dynamic(
  () => import("@/components/analytics/DeploymentAnalytics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const PerformanceMetrics = dynamic(
  () => import("@/components/analytics/PerformanceMetrics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const ContributorsSection = dynamic(
  () => import("@/components/analytics/ContributorsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const DownloadTrendsSection = dynamic(
  () => import("@/components/analytics/DownloadTrendsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const ReleasesSection = dynamic(
  () => import("@/components/analytics/ReleasesSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const RepositoryMetricsSection = dynamic(
  () => import("@/components/analytics/RepositoryMetricsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

const QuickActionsSection = dynamic(
  () => import("@/components/analytics/QuickActionsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-lg h-48" />
    ),
  },
);

export default function AnalyticsPage() {
  // State management
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [githubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState({ npm: false, github: false });
  const [error, setError] = useState({ npm: "", github: "" });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Configuration
  const npmPackage = process.env.NPM_PACKAGE_NAME || "create-js-stack";
  const githubRepo = process.env.GITHUB_REPO || "vipinyadav01/js-stack";

  // Fetch NPM data
  const fetchNpmData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, npm: true }));
    setError((prev) => ({ ...prev, npm: "" }));
    try {
      const data = await fetchNpmPackageData(npmPackage);
      setNpmData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError((prev) => ({
        ...prev,
        npm: err instanceof Error ? err.message : "Failed to load NPM data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, npm: false }));
    }
  }, [npmPackage]);

  // Fetch GitHub data
  const fetchGitHubData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, github: true }));
    setError((prev) => ({ ...prev, github: "" }));
    try {
      const data = await fetchGitHubRepoData(githubRepo);
      setGitHubData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError((prev) => ({
        ...prev,
        github:
          err instanceof Error ? err.message : "Failed to load GitHub data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, github: false }));
    }
  }, [githubRepo]);

  // Load data on component mount
  useEffect(() => {
    fetchNpmData();
    fetchGitHubData();
  }, [fetchNpmData, fetchGitHubData]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchNpmData();
        fetchGitHubData();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [fetchNpmData, fetchGitHubData]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time insights for JS-Stack
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Last Updated */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated: {format(lastUpdated, "HH:mm")}</span>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={() => {
                  fetchNpmData();
                  fetchGitHubData();
                }}
                disabled={loading.npm || loading.github}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    (loading.npm || loading.github) && "animate-spin",
                  )}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {(error.npm || error.github) && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="text-sm text-red-800">
                <div className="font-semibold">Data Issues:</div>
                {error.npm && <div>NPM: {error.npm}</div>}
                {error.github && <div>GitHub: {error.github}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="space-y-8">
          {/* Key Stats Quick Overview */}
          {(npmData || githubData) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {githubData && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {formatNumber(githubData.info?.stargazersCount || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Stars</div>
                    </div>
                  </div>
                </div>
              )}

              {githubData && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <GitFork className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {formatNumber(githubData.info?.forksCount || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Forks</div>
                    </div>
                  </div>
                </div>
              )}

              {npmData && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {formatNumber(npmData.totalLast7Days || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Weekly Downloads
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {githubData && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {formatNumber(githubData.info?.watchersCount || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Watchers
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Overview Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-mono">Overview</h2>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <KPICards
                npmData={npmData}
                githubData={githubData}
                formatNumber={formatNumber}
              />
            </div>
          </section>

          {/* Technology Stacks Section */}
          <section className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono">
                    Technology Stacks
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Popular technology combinations and trends
                  </p>
                </div>
              </div>
            </div>

            {/* Top Stacks and Usage Distribution */}
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl border border-border bg-card">
                <TopStacksBar />
              </div>
              <div className="rounded-xl border border-border bg-card">
                <StackUsagePie />
              </div>
            </div>

            {/* Trends Chart - Full Width */}
            <div className="rounded-xl border border-border bg-card">
              <StackTrendsLine />
            </div>
          </section>

          {/* Systems Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-mono">Systems & Tools</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <PackageManagerStats />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <SystemMetrics />
              </div>
            </div>
          </section>

          {/* Deployment Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-mono">
                Deployment & Performance
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <DeploymentAnalytics />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <PerformanceMetrics />
              </div>
            </div>
          </section>

          {/* Repository Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-mono">
                Repository & Downloads
              </h2>
            </div>

            {githubData && (
              <div className="rounded-xl border border-border bg-card p-6">
                <RepositoryMetricsSection
                  githubData={githubData}
                  npmData={npmData}
                  formatNumber={formatNumber}
                />
              </div>
            )}

            {npmData && (
              <div className="rounded-xl border border-border bg-card p-6">
                <DownloadTrendsSection
                  npmData={npmData}
                  formatNumber={formatNumber}
                />
              </div>
            )}

            {githubData && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                  <ReleasesSection releases={githubData.releases} />
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <QuickActionsSection />
                </div>
              </div>
            )}
          </section>

          {/* Community Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-mono">Community</h2>
            </div>

            {githubData && (
              <div className="rounded-xl border border-border bg-card p-6">
                <ContributorsSection
                  contributors={githubData.contributors}
                  formatNumber={formatNumber}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
