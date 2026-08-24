"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  Clock,
  Zap,
  Package,
  Globe,
  Users,
  Download,
  Star,
  GitFork,
  Eye,
  TrendingUp,
  Terminal,
} from "lucide-react";
import { format } from "date-fns";
import {
  fetchNpmPackageData,
  fetchGitHubRepoData,
  NpmPackageData,
  GitHubRepoData,
} from "@/lib/api";
import { cn } from "@/lib/utils";

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
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card dark:bg-[#0d0d0d] p-5 transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="inline-flex text-primary group-hover:scale-110 transition-transform">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
              {label}
            </p>
            <p className="text-2xl font-mono font-bold mt-1 tracking-tight text-foreground">{value}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md border",
              trend >= 0
                ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                : "text-rose-400 border-rose-500/20 bg-rose-500/10",
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
  fileTag,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  fileTag?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-3">
      <div className="flex items-center gap-2 font-mono text-sm tracking-tight text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-bold text-primary">{title.toUpperCase().replace(/\s+/g, "_")}</span>
        {description && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground font-normal">{description}</span>
          </>
        )}
      </div>
      {fileTag && (
        <span className="font-mono text-muted-foreground text-xs uppercase">
          [{fileTag}]
        </span>
      )}
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
        "rounded-xl border border-border/70 bg-card dark:bg-[#0d0d0d] shadow-xl overflow-hidden p-6 hover:border-primary/40 transition-colors",
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
  const npmPackage = process.env.NPM_PACKAGE_NAME || "@vipinyadav02/createjsstack";
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Header */}
      <div className="border-b border-border/50 bg-background dark:bg-[#090a0f] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono w-fit mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ANALYTICAL_ENGINE // V1.2.16</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-mono tracking-tight text-foreground font-bold">
                Analytics<span className="text-primary">.sh</span>
              </h1>
              <p className="text-muted-foreground font-sans text-sm lg:text-base max-w-xl">
                Real-time performance telemetry, package downloads, and repository statistics for JS-Stack CLI.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Last Updated */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-secondary/80 border border-border text-xs font-mono text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Updated {format(lastUpdated, "h:mm a")}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  fetchNpmData();
                  fetchGitHubData();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isLoading && "animate-spin")}
                />
                <span>Refresh Data</span>
              </button>
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
      <div className="container mx-auto px-4 lg:px-6 pt-8 pb-28 lg:pt-12 lg:pb-36">
        <div className="space-y-12">
          {/* Key Stats Overview */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Star}
                label="GitHub Stars"
                value={formatNumber(githubData?.info?.stargazersCount || 0)}
                trend={12}
                
              />
              <StatCard
                icon={Download}
                label="Weekly Downloads"
                value={formatNumber(npmData?.totalLast7Days || 0)}
                trend={8}
                
              />
              <StatCard
                icon={GitFork}
                label="Forks"
                value={formatNumber(githubData?.info?.forksCount || 0)}
                
              />
              <StatCard
                icon={Eye}
                label="Watchers"
                value={formatNumber(githubData?.info?.watchersCount || 0)}
                
              />
            </div>
          </section>

          {/* Overview Section */}
          <section className="space-y-6">
            <SectionHeader
              icon={Activity}
              title="Overview"
              description="overview.log"
              fileTag="KPIs & Metrics"
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
              description="stacks.json"
              fileTag="Usage & Trends"
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
              description="systems.conf"
              fileTag="Environments"
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
              description="deployments.yml"
              fileTag="Infrastructure"
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
              description="repository.json"
              fileTag="Telemetry"
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
              description="contributors.md"
              fileTag="Engagement"
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
