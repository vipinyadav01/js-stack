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
  TrendingUp,
  ArrowUpRight,
  Terminal,
  Sparkles,
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
  loading: () => <div className="animate-pulse bg-muted/20 rounded-2xl h-32" />,
});

const TopStacksBar = dynamic(
  () => import("@/components/analytics/TopStacksBar"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-64" />
    ),
  },
);

const StackUsagePie = dynamic(
  () => import("@/components/analytics/StackUsagePie"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-64" />
    ),
  },
);

const StackTrendsLine = dynamic(
  () => import("@/components/analytics/StackTrendsLine"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-64" />
    ),
  },
);

const PackageManagerStats = dynamic(
  () => import("@/components/analytics/PackageManagerStats"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const SystemMetrics = dynamic(
  () => import("@/components/analytics/SystemMetrics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const DeploymentAnalytics = dynamic(
  () => import("@/components/analytics/DeploymentAnalytics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const PerformanceMetrics = dynamic(
  () => import("@/components/analytics/PerformanceMetrics"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const ContributorsSection = dynamic(
  () => import("@/components/analytics/ContributorsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const DownloadTrendsSection = dynamic(
  () => import("@/components/analytics/DownloadTrendsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const ReleasesSection = dynamic(
  () => import("@/components/analytics/ReleasesSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const RepositoryMetricsSection = dynamic(
  () => import("@/components/analytics/RepositoryMetricsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

const QuickActionsSection = dynamic(
  () => import("@/components/analytics/QuickActionsSection"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted/20 rounded-2xl h-48" />
    ),
  },
);

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: number;
  color: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5">
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient,
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn("inline-flex p-2.5 rounded-xl", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
              trend >= 0
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-red-600 bg-red-500/10",
            )}
          >
            <TrendingUp className={cn("h-3 w-3", trend < 0 && "rotate-180")} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Chart Card Component
function ChartCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

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

  const isLoading = loading.npm || loading.github;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

        <div className="relative container mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary via-primary to-purple-600 shadow-lg shadow-primary/25">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    Analytics
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                    <Sparkles className="h-3 w-3" />
                    Live
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm lg:text-base">
                  Real-time insights and metrics for JS-Stack CLI
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Last Updated */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(lastUpdated, "h:mm a")}
                </span>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={() => {
                  fetchNpmData();
                  fetchGitHubData();
                }}
                disabled={isLoading}
                variant="outline"
                className="gap-2 rounded-xl h-10 px-4 border-border/50 hover:bg-muted/50"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {(error.npm || error.github) && (
            <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <Activity className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-destructive">
                    Data Loading Issues
                  </p>
                  {error.npm && (
                    <p className="text-destructive/80 mt-1">NPM: {error.npm}</p>
                  )}
                  {error.github && (
                    <p className="text-destructive/80 mt-1">
                      GitHub: {error.github}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="space-y-12">
          {/* Key Stats Overview */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Star}
                label="GitHub Stars"
                value={formatNumber(githubData?.info?.stargazersCount || 0)}
                trend={12}
                color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                gradient="bg-gradient-to-br from-amber-500/5 to-orange-500/5"
              />
              <StatCard
                icon={Download}
                label="Weekly Downloads"
                value={formatNumber(npmData?.totalLast7Days || 0)}
                trend={8}
                color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                gradient="bg-gradient-to-br from-emerald-500/5 to-teal-500/5"
              />
              <StatCard
                icon={GitFork}
                label="Forks"
                value={formatNumber(githubData?.info?.forksCount || 0)}
                color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                gradient="bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
              />
              <StatCard
                icon={Eye}
                label="Watchers"
                value={formatNumber(githubData?.info?.watchersCount || 0)}
                color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                gradient="bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5"
              />
            </div>
          </section>

          {/* Overview Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Activity}
              title="Overview"
              description="Key performance indicators and metrics"
            />
            <ChartCard className="p-6">
              <KPICards
                npmData={npmData}
                githubData={githubData}
                formatNumber={formatNumber}
              />
            </ChartCard>
          </section>

          {/* Technology Stacks Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Terminal}
              title="Technology Stacks"
              description="Popular technology combinations and usage trends"
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <ChartCard>
                <TopStacksBar />
              </ChartCard>
              <ChartCard>
                <StackUsagePie />
              </ChartCard>
            </div>

            <ChartCard>
              <StackTrendsLine />
            </ChartCard>
          </section>

          {/* Systems & Tools Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Package}
              title="Systems & Tools"
              description="Package managers and system configurations"
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard className="p-6">
                <PackageManagerStats />
              </ChartCard>
              <ChartCard className="p-6">
                <SystemMetrics />
              </ChartCard>
            </div>
          </section>

          {/* Deployment & Performance Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Zap}
              title="Deployment & Performance"
              description="Platform usage and performance insights"
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard className="p-6">
                <DeploymentAnalytics />
              </ChartCard>
              <ChartCard className="p-6">
                <PerformanceMetrics />
              </ChartCard>
            </div>
          </section>

          {/* Repository & Downloads Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Globe}
              title="Repository & Downloads"
              description="GitHub metrics and NPM download statistics"
            />

            {githubData && (
              <ChartCard className="p-6">
                <RepositoryMetricsSection
                  githubData={githubData}
                  npmData={npmData}
                  formatNumber={formatNumber}
                />
              </ChartCard>
            )}

            {npmData && (
              <ChartCard className="p-6">
                <DownloadTrendsSection
                  npmData={npmData}
                  formatNumber={formatNumber}
                />
              </ChartCard>
            )}

            {githubData && (
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard className="p-6">
                  <ReleasesSection releases={githubData.releases} />
                </ChartCard>
                <ChartCard className="p-6">
                  <QuickActionsSection />
                </ChartCard>
              </div>
            )}
          </section>

          {/* Community Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Users}
              title="Community"
              description="Contributors and community engagement"
            />

            {githubData && (
              <ChartCard className="p-6">
                <ContributorsSection
                  contributors={githubData.contributors}
                  formatNumber={formatNumber}
                />
              </ChartCard>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
