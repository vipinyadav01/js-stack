"use client";
import React, { useState, useEffect } from "react";
import {
  Activity,
  Download,
  GitBranch,
  TrendingUp,
  Code2,
  Users2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PackageStats {
  downloads: {
    total: number;
    weekly: number;
    monthly: number;
    daily: number;
  };
  github: {
    stars: number;
    forks: number;
    issues: number;
    watchers: number;
  };
  package: {
    version: string;
    license: string;
    dependencies: number;
    size: string;
    lastUpdate: string;
  };
  loading: boolean;
  error: string | null;
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: string;
  href?: string;
  loading?: boolean;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  href,
  loading = false,
}: StatCardProps) => {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block group transition-all duration-200 hover:scale-[1.02]"
        >
          {children}
        </a>
      );
    }
    return <div className="group">{children}</div>;
  };

  return (
    <CardWrapper>
      <Card className="transition-all duration-200 hover:shadow-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-muted/50">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-medium text-foreground">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 mb-1">
            <div className="text-2xl font-bold text-foreground">
              {loading ? (
                <div className="w-16 h-7 bg-muted rounded animate-pulse" />
              ) : typeof value === "number" ? (
                value.toLocaleString()
              ) : (
                value
              )}
            </div>
            {trend && !loading && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

const useRealPackageStats = (packageName: string, githubRepo: string) => {
  // Helper to sanitize githubRepo input (removes accidental encoding)
  const getGithubRepoPath = (repo: string) => repo.replace(/%2F/g, "/");

  // Example: If you fetch releases or contributors, always use sanitized path
  // Usage:
  // const repoPath = getGithubRepoPath(githubRepo);
  // fetch(`https://api.github.com/repos/${repoPath}/releases?per_page=5`)
  // fetch(`https://api.github.com/repos/${repoPath}/contributors?per_page=10`)
  type DownloadDay = { downloads: number };
  const [stats, setStats] = useState<PackageStats>({
    downloads: { total: 0, weekly: 0, monthly: 0, daily: 0 },
    github: { stars: 0, forks: 0, issues: 0, watchers: 0 },
    package: {
      version: "",
      license: "",
      dependencies: 0,
      size: "",
      lastUpdate: "",
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch NPM download statistics
        const downloadsResponse = await fetch(
          `https://api.npmjs.org/downloads/range/last-year/${packageName}`,
        );

        let downloadData = { total: 0, weekly: 0, monthly: 0, daily: 0 };
        if (downloadsResponse.ok) {
          const downloadsJson = await downloadsResponse.json();
          if (downloadsJson.downloads) {
            const totalDownloads = downloadsJson.downloads.reduce(
              (sum: number, day: DownloadDay) => sum + day.downloads,
              0,
            );
            const last7Days = downloadsJson.downloads.slice(-7);
            const last30Days = downloadsJson.downloads.slice(-30);
            const weeklyDownloads = last7Days.reduce(
              (sum: number, day: DownloadDay) => sum + day.downloads,
              0,
            );
            const monthlyDownloads = last30Days.reduce(
              (sum: number, day: DownloadDay) => sum + day.downloads,
              0,
            );
            const dailyAverage = Math.round(weeklyDownloads / 7);

            downloadData = {
              total: totalDownloads,
              weekly: weeklyDownloads,
              monthly: monthlyDownloads,
              daily: dailyAverage,
            };
          }
        }

        // Fetch package information
        const packageResponse = await fetch(
          `https://registry.npmjs.org/${packageName}`,
        );
        let packageData = {
          version: "N/A",
          license: "N/A",
          dependencies: 0,
          size: "N/A",
          lastUpdate: "N/A",
        };

        if (packageResponse.ok) {
          const packageJson = await packageResponse.json();
          const latestVersion = packageJson["dist-tags"]?.latest;
          const versionInfo = packageJson.versions?.[latestVersion];

          if (versionInfo) {
            packageData = {
              version: latestVersion || "N/A",
              license: versionInfo.license || "N/A",
              dependencies: Object.keys(versionInfo.dependencies || {}).length,
              size: "N/A", // Would need bundlephobia API for accurate size
              lastUpdate: packageJson.time?.[latestVersion]
                ? new Date(packageJson.time[latestVersion]).toLocaleDateString()
                : "N/A",
            };
          }
        }

        // Fetch GitHub statistics
        let githubData = { stars: 0, forks: 0, issues: 0, watchers: 0 };
        try {
          const repoPath = getGithubRepoPath(githubRepo);
          const githubResponse = await fetch(
            `https://api.github.com/repos/${repoPath}`,
          );
          // If you need releases or contributors, always use repoPath:
          // const releasesResponse = await fetch(`https://api.github.com/repos/${repoPath}/releases?per_page=5`);
          // const contributorsResponse = await fetch(`https://api.github.com/repos/${repoPath}/contributors?per_page=10`);
          if (!githubResponse.ok) {
            throw new Error(
              `GitHub API error: ${githubResponse.status} ${githubResponse.statusText}`,
            );
          }
          const githubJson = await githubResponse.json();
          githubData = {
            stars: githubJson.stargazers_count || 0,
            forks: githubJson.forks_count || 0,
            issues: githubJson.open_issues_count || 0,
            watchers: githubJson.watchers_count || 0,
          };
        } catch (err) {
          console.error("Error fetching GitHub data:", err);
          setStats((prev) => ({
            ...prev,
            loading: false,
            error:
              "Failed to fetch GitHub statistics. This may be due to rate limits, CORS, or network issues.",
          }));
        }

        setStats({
          downloads: downloadData,
          github: githubData,
          package: packageData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch package statistics",
        }));
      }
    };

    if (packageName && githubRepo) {
      fetchStats();
    }
  }, [packageName, githubRepo]);

  return {
    stats,
    refetch: () => setStats((prev) => ({ ...prev, loading: true })),
  };
};

const StatsSection = ({
  packageName = "create-js-stack",
  githubRepo = "vipinyadav01/js-stack",
  npmUrl = "https://www.npmjs.com/package/create-js-stack",
}) => {
  const { stats, refetch } = useRealPackageStats(packageName, githubRepo);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Package Statistics
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Real-time metrics and insights for{" "}
          <span className="font-semibold text-foreground">{packageName}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={stats.loading}
          className="gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${stats.loading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Error State */}
      {stats.error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{stats.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Download}
          title="Total Downloads"
          value={stats.downloads.total}
          subtitle={`${stats.downloads.weekly.toLocaleString()} this week`}
          href={npmUrl}
          loading={stats.loading}
        />

        <StatCard
          icon={GitBranch}
          title="GitHub Stars"
          value={stats.github.stars}
          subtitle="Community support"
          href={`https://github.com/${githubRepo}`}
          loading={stats.loading}
        />

        <StatCard
          icon={Users2}
          title="GitHub Forks"
          value={stats.github.forks}
          subtitle="Community contributions"
          href={`https://github.com/${githubRepo}/network/members`}
          loading={stats.loading}
        />

        <StatCard
          icon={Activity}
          title="Open Issues"
          value={stats.github.issues}
          subtitle="Active development"
          href={`https://github.com/${githubRepo}/issues`}
          loading={stats.loading}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Download Analytics</CardTitle>
            </div>
            <CardDescription>
              Usage patterns and download trends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Daily Average
              </span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? "—" : stats.downloads.daily.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Weekly Total
              </span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? "—" : stats.downloads.weekly.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Monthly Total
              </span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? "—" : stats.downloads.monthly.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">
                Yearly Total
              </span>
              <Badge variant="secondary" className="font-mono">
                {stats.loading ? "—" : stats.downloads.total.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Package Details</CardTitle>
            </div>
            <CardDescription>
              Technical information and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Current Version
              </span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? "—" : stats.package.version}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Dependencies
              </span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? "—" : stats.package.dependencies}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">License</span>
              <Badge variant="secondary">
                {stats.loading ? "—" : stats.package.license}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                {stats.loading ? "—" : stats.package.lastUpdate}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">
                Access package resources and documentation
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <a href={npmUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  View on NPM
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://github.com/${githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  View Repository
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://github.com/${githubRepo}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Report Issue
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSection;
