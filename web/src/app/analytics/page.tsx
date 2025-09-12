"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchNpmPackageData, fetchGitHubRepoData, NpmPackageData, GitHubRepoData } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Contributors from "@/components/analytics/Contributors";
import Releases from "@/components/analytics/Releases";
import RepoInfo from "@/components/analytics/RepoInfo";
import NpmDownloads from "@/components/analytics/NpmDownloads";
import QuickActions from "@/components/analytics/QuickActions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  const githubRepo = process.env.GITHUB_REPO || "vipinyadav01/create-js-stack-cli";

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time data from NPM and GitHub APIs
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchNpmData}
              disabled={loading.npm}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading.npm ? 'animate-spin' : ''}`} />
              Refresh NPM
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchGitHubData}
              disabled={loading.github}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading.github ? 'animate-spin' : ''}`} />
              Refresh GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="npm">NPM Analytics</TabsTrigger>
          <TabsTrigger value="github">GitHub Analytics</TabsTrigger>
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
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error loading NPM data: {error.npm}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Display */}
          {loading.npm && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading NPM data...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NPM Data Display */}
          {npmData && (
            <>
              {/* Package Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {npmData.info.name}
                    <Badge variant="secondary">v{npmData.info.version}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {npmData.info.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatNumber(npmData.totalLast7Days)}</div>
                      <div className="text-sm text-muted-foreground">Downloads (7 days)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{npmData.info.versionsCount}</div>
                      <div className="text-sm text-muted-foreground">Total Versions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{npmData.downloads.length}</div>
                      <div className="text-sm text-muted-foreground">Days Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(npmData.totalLast7Days / npmData.downloads.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Daily</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Downloads Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Download Trends</CardTitle>
                  <CardDescription>Daily downloads over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </>
          )}

          {/* Modular NPM Downloads Component */}
          <NpmDownloads npmData={npmData} error={error.npm} />
        </TabsContent>

        {/* GitHub Analytics Tab */}
        <TabsContent value="github" className="space-y-6">
          {/* Error Display */}
          {error.github && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error loading GitHub data: {error.github}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Display */}
          {loading.github && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading GitHub data...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GitHub Data Display */}
          {githubData && (
            <>
              {/* Repository Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {githubData.info.fullName}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={githubData.info.htmlUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {githubData.info.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="font-semibold">{formatNumber(githubData.info.stargazersCount)}</div>
                          <div className="text-xs text-muted-foreground">Stars</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitFork className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-semibold">{formatNumber(githubData.info.forksCount)}</div>
                          <div className="text-xs text-muted-foreground">Forks</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-semibold">{formatNumber(githubData.info.watchersCount)}</div>
                          <div className="text-xs text-muted-foreground">Watchers</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-semibold">{githubData.info.openIssuesCount}</div>
                          <div className="text-xs text-muted-foreground">Issues</div>
                        </div>
                      </div>
                    </div>

                    {/* Topics */}
                    {githubData.info.topics.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Topics</div>
                        <div className="flex flex-wrap gap-2">
                          {githubData.info.topics.map((topic) => (
                            <Badge key={topic} variant="secondary">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Language:</span>{" "}
                        <span className="font-medium">{githubData.info.language || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>{" "}
                        <span className="font-medium">{formatNumber(githubData.info.size)} KB</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License:</span>{" "}
                        <span className="font-medium">{githubData.info.license?.name || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contributors and Releases Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Contributors contributors={githubData.contributors} />
                <Releases releases={githubData.releases} />
              </div>

              {/* Contribution Chart */}
              {githubData.contributors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Distribution</CardTitle>
                    <CardDescription>Contributions by top contributors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={githubData.contributors.slice(0, 8)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="login" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="contributions" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
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
    </div>
  );
}