"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchNpmPackageData, fetchGitHubRepoData, NpmPackageData, GitHubRepoData } from "@/lib/api";
import Contributors from "@/components/analytics/Contributors";
import Releases from "@/components/analytics/Releases";
import RepoInfo from "@/components/analytics/RepoInfo";
import NpmDownloads from "@/components/analytics/NpmDownloads";
import QuickActions from "@/components/analytics/QuickActions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  GitFork, 
  Eye, 
  AlertCircle, 
  Package, 
  Activity, 
  ExternalLink, 
  RefreshCw 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

export default function Analytics() {
  // State management
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [githubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState({ npm: false, github: false });
  const [error, setError] = useState({ npm: "", github: "" });
  
  // Configuration
  const npmPackage = process.env.NPM_PACKAGE_NAME || "create-js-stack";
  const githubRepo = process.env.GITHUB_REPO || "vipinyadav01/js-stack";

  // Fetch NPM data
  const fetchNpmData = useCallback(async () => {
    setLoading(prev => ({ ...prev, npm: true }));
    setError(prev => ({ ...prev, npm: "" }));
    try {
      const data = await fetchNpmPackageData(npmPackage);
      setNpmData(data);
    } catch (err) {
      setError(prev => ({ ...prev, npm: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, npm: false }));
    }
  }, [npmPackage]);

  // Fetch GitHub data
  const fetchGitHubData = useCallback(async () => {
    setLoading(prev => ({ ...prev, github: true }));
    setError(prev => ({ ...prev, github: "" }));
    try {
      const data = await fetchGitHubRepoData(githubRepo);
      setGitHubData(data);
    } catch (err) {
      setError(prev => ({ ...prev, github: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, github: false }));
    }
  }, [githubRepo]);

  // Load data on component mount
  useEffect(() => {
    fetchNpmData();
    fetchGitHubData();
  }, [fetchNpmData, fetchGitHubData]);

  // Utility function for formatting numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="mx-auto min-h-svh max-w-[1280px]">
      <main className="mx-auto px-4 pt-12">
        {/* Terminal Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                ANALYTICS_DASHBOARD.TXT
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-xs">
              [REAL-TIME DATA]
            </span>
          </div>
        </div>

        {/* Refresh Controls */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10" onClick={fetchNpmData}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm">REFRESH_NPM</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                {loading.npm ? "LOADING" : "READY"}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className={`h-4 w-4 text-primary ${loading.npm ? 'animate-spin' : ''}`} />
                  <span className="text-foreground">Update NPM package data</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  FETCH
                </div>
              </div>
            </div>
          </div>

          <div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10" onClick={fetchGitHubData}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm">REFRESH_GITHUB</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                {loading.github ? "LOADING" : "READY"}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className={`h-4 w-4 text-primary ${loading.github ? 'animate-spin' : ''}`} />
                  <span className="text-foreground">Update GitHub repository data</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  FETCH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics Tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              DATA_SECTIONS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [ANALYTICS VIEWS]
          </span>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
            <TabsTrigger value="npm">NPM_DATA</TabsTrigger>
            <TabsTrigger value="github">GITHUB_DATA</TabsTrigger>
          </TabsList>

        {/* Overview Tab - All Analytics Together */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPM Downloads Component */}
            <NpmDownloads npmData={npmData} error={error.npm} />
            
            {/* GitHub Repo Info Component */}
            <RepoInfo info={githubData?.info} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contributors Component */}
            <Contributors contributors={githubData?.contributors || []} />
            
            {/* Releases Component */}
            <Releases releases={githubData?.releases || []} />
          </div>

          {/* Quick Actions Component */}
          <QuickActions />
        </TabsContent>

        {/* NPM Analytics Tab */}
        <TabsContent value="npm" className="space-y-6">
          {/* Error Display */}
          {error.npm && (
            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-sm">NPM_ERROR</span>
                </div>
                <div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
                  ERROR
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">Error loading NPM data: {error.npm}</span>
                  </div>
                  <div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
                    FAILED
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Display */}
          {loading.npm && (
            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                  <span className="font-semibold text-sm">NPM_LOADING</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  LOADING
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-foreground">Loading NPM data...</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    FETCHING
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NPM Data Display */}
          {npmData && (
            <>
              {/* Package Info */}
              <div className="flex h-full flex-col justify-between rounded border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">PACKAGE_INFO</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    v{npmData.info.version}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded border border-border p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-mono">{npmData.info.name}</span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      PACKAGE
                    </div>
                  </div>

                  {npmData.info.description && (
                    <div className="rounded border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                      <div className="text-sm text-foreground">{npmData.info.description}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono text-lg font-bold">{formatNumber(npmData.totalLast7Days)}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        7 DAYS
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono text-lg font-bold">{npmData.info.versionsCount}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        VERSIONS
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono text-lg font-bold">{npmData.downloads.length}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        TRACKED
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono text-lg font-bold">
                          {Math.round(npmData.totalLast7Days / npmData.downloads.length)}
                        </span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        DAILY
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downloads Chart */}
              <div className="flex h-full flex-col justify-between rounded border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">DOWNLOAD_TRENDS</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    7 DAYS
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-2">CHART_DATA</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={npmData.downloads}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="day" 
                          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        />
                        <YAxis tickFormatter={formatNumber} />
                        <Tooltip 
                          labelFormatter={(value) => format(new Date(value as string), 'MMM dd, yyyy')}
                          formatter={(value: number) => [formatNumber(value), 'Downloads']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="downloads" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Modular NPM Downloads Component */}
          <NpmDownloads npmData={npmData} error={error.npm} />
        </TabsContent>

        {/* GitHub Analytics Tab */}
        <TabsContent value="github" className="space-y-6">
          {/* Error Display */}
          {error.github && (
            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-sm">GITHUB_ERROR</span>
                </div>
                <div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
                  ERROR
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">Error loading GitHub data: {error.github}</span>
                  </div>
                  <div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
                    FAILED
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Display */}
          {loading.github && (
            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                  <span className="font-semibold text-sm">GITHUB_LOADING</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  LOADING
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-foreground">Loading GitHub data...</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    FETCHING
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Data Display */}
          {githubData && (
            <>
              {/* Repository Info */}
              <div className="flex h-full flex-col justify-between rounded border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">REPOSITORY_INFO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      ACTIVE
                    </div>
                    <a href={githubData.info.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded border border-border p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-mono">{githubData.info.fullName}</span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      REPO
                    </div>
                  </div>

                  {githubData.info.description && (
                    <div className="rounded border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                      <div className="text-sm text-foreground">{githubData.info.description}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-foreground font-mono text-lg font-bold">{formatNumber(githubData.info.stargazersCount)}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        STARS
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <GitFork className="h-4 w-4 text-blue-500" />
                        <span className="text-foreground font-mono text-lg font-bold">{formatNumber(githubData.info.forksCount)}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        FORKS
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-green-500" />
                        <span className="text-foreground font-mono text-lg font-bold">{formatNumber(githubData.info.watchersCount)}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        WATCHERS
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-foreground font-mono text-lg font-bold">{githubData.info.openIssuesCount}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        ISSUES
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  {githubData.info.topics.length > 0 && (
                    <div className="rounded border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-2">TOPICS</div>
                      <div className="flex flex-wrap gap-2">
                        {githubData.info.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono">{githubData.info.language || "N/A"}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        LANGUAGE
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono">{formatNumber(githubData.info.size)} KB</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        SIZE
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-mono">{githubData.info.license?.name || "N/A"}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        LICENSE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributors and Releases Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Contributors contributors={githubData.contributors} />
                <Releases releases={githubData.releases} />
              </div>

              {/* Contribution Chart */}
              {githubData.contributors.length > 0 && (
                <div className="flex h-full flex-col justify-between rounded border border-border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">CONTRIBUTION_DISTRIBUTION</span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      TOP 8
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-2">CHART_DATA</div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={githubData.contributors.slice(0, 8)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="login" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="contributions" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modular GitHub Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RepoInfo info={githubData?.info} />
            <Contributors contributors={githubData?.contributors || []} />
          </div>
          <Releases releases={githubData?.releases || []} />
        </TabsContent>
      </Tabs>
      </main>
    </div>
  );
}