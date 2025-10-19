"use client";

import {
  Globe,
  Star,
  GitFork,
  Eye,
  AlertCircle,
  ExternalLink,
  Package,
} from "lucide-react";
import { GitHubRepoData, NpmPackageData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RepositoryMetricsSectionProps {
  githubData: GitHubRepoData;
  npmData?: NpmPackageData | null;
  formatNumber: (num: number) => string;
}

export default function RepositoryMetricsSection({
  githubData,
  npmData,
  formatNumber,
}: RepositoryMetricsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            Repository & Package Metrics
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          Real-time data
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Repository Overview */}
        <div className="w-full min-w-0 overflow-hidden rounded border border-border">
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-primary" />
              <span className="font-semibold text-xs">Repository Overview</span>
            </div>
          </div>
          <div className="p-4 space-y-6">
            {/* Repository Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Repository Name
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {githubData.info.fullName}
                  </span>
                  <a
                    href={githubData.info.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
              </div>

              {githubData.info.description && (
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">
                    Description
                  </span>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
                    {githubData.info.description}
                  </div>
                </div>
              )}
            </div>

            {/* Repository Stats */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-foreground">
                Repository Statistics
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {formatNumber(githubData.info.stargazersCount)}
                    </div>
                    <div className="text-xs text-muted-foreground">Stars</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <GitFork className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {formatNumber(githubData.info.forksCount)}
                    </div>
                    <div className="text-xs text-muted-foreground">Forks</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                    <Eye className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {formatNumber(githubData.info.watchersCount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Watchers
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {formatNumber(githubData.info.openIssuesCount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Open Issues
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Repository Details */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-foreground">
                Repository Details
              </span>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <span className="text-sm font-medium text-foreground">
                    Languages
                  </span>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                      TypeScript (Web)
                    </span>
                    <span className="font-mono text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                      JavaScript (CLI)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <span className="text-sm font-medium text-foreground">
                    Repository Size
                  </span>
                  <span className="font-mono text-sm">
                    {formatNumber(githubData.info.size)} KB
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <span className="text-sm font-medium text-foreground">
                    Default Branch
                  </span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {githubData.info.defaultBranch}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <span className="text-sm font-medium text-foreground">
                    Last Updated
                  </span>
                  <span className="font-mono text-sm">
                    {format(
                      new Date(githubData.info.updatedAt),
                      "MMM dd, yyyy",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Topics */}
            {githubData.info.topics.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-semibold text-foreground">
                  Repository Topics
                </span>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex flex-wrap gap-2">
                    {githubData.info.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Package Information */}
        <div className="w-full min-w-0 overflow-hidden rounded border border-border">
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-primary" />
              <span className="font-semibold text-xs">Package Information</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {/* NPM Package Info */}
            {npmData && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Package Name</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {npmData.info.name}
                    </span>
                    {npmData.info.homepage && (
                      <a
                        href={npmData.info.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </div>
                </div>

                {npmData.info.description && (
                  <div className="text-sm text-muted-foreground">
                    {npmData.info.description}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Latest Version</span>
                  <span className="font-mono text-sm">
                    {npmData.info.version}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Versions</span>
                  <span className="font-mono text-sm">
                    {npmData.info.versionsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Downloads</span>
                  <span className="font-mono text-sm">
                    {formatNumber(npmData.totalLast7Days)}
                  </span>
                </div>

                <div className="pt-2 border-t" />
              </>
            )}

            {/* Repository Info */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Languages</span>
              <div className="text-right">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  TypeScript (Web)
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-mono">
                  JavaScript (CLI)
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Repository Size</span>
              <span className="font-mono text-sm">
                {formatNumber(githubData.info.size)} KB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">License</span>
              <span className="font-mono text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                MIT Open Source
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Default Branch</span>
              <span className="font-mono text-sm">
                {githubData.info.defaultBranch}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Updated</span>
              <span className="font-mono text-sm">
                {format(new Date(githubData.info.updatedAt), "MMM dd, yyyy")}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground mb-2">
                Repository Status
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Public</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
