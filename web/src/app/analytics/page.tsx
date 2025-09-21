"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchNpmPackageData, fetchGitHubRepoData, NpmPackageData, GitHubRepoData } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Activity, 
  Terminal, 
  RefreshCw,
  Clock
} from "lucide-react";
import { format } from "date-fns";

// Import new components (we'll create these)
import AnalyticsOverviewSection from "@/components/analytics/AnalyticsOverviewSection";
import DownloadTrendsSection from "@/components/analytics/DownloadTrendsSection";
import RepositoryMetricsSection from "@/components/analytics/RepositoryMetricsSection";
import ContributorsSection from "@/components/analytics/ContributorsSection";
import ReleasesSection from "@/components/analytics/ReleasesSection";
import QuickActionsSection from "@/components/analytics/QuickActionsSection";

export default function Analytics() {
  // State management
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [githubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState({ npm: false, github: false });
  const [, setError] = useState({ npm: "", github: "" });
  
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

  // Calculate trends and metrics
  const getTrendData = () => {
    if (!npmData?.downloads || npmData.downloads.length < 2) return null;
    const recent = npmData.downloads.slice(-7);
    const previous = npmData.downloads.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, day) => sum + day.downloads, 0) / recent.length;
    const previousAvg = previous.reduce((sum, day) => sum + day.downloads, 0) / previous.length;
    
    const trend = ((recentAvg - previousAvg) / previousAvg) * 100;
    return {
      trend: trend,
      direction: trend > 0 ? 'up' as const : 'down' as const,
      recentAvg: Math.round(recentAvg),
      previousAvg: Math.round(previousAvg)
    };
  };

  const trendData = getTrendData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  return (
    <div className="w-full max-w-full overflow-hidden px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Terminal Header */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                ANALYTICS_DASHBOARD.LOG
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Last updated: {format(new Date(), 'MMM dd, HH:mm')}</span>
                <span className="sm:hidden">{format(new Date(), 'HH:mm')}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={fetchNpmData}
                  disabled={loading.npm}
                  className="inline-flex items-center space-x-1 rounded border border-border bg-background px-2 py-1 text-xs font-mono transition-colors hover:bg-muted disabled:opacity-50"
                  title="Refresh NPM data"
                >
                  <RefreshCw className={`h-3 w-3 ${loading.npm ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">NPM</span>
                </button>
                <button
                  onClick={fetchGitHubData}
                  disabled={loading.github}
                  className="inline-flex items-center space-x-1 rounded border border-border bg-background px-2 py-1 text-xs font-mono transition-colors hover:bg-muted disabled:opacity-50"
                  title="Refresh GitHub data"
                >
                  <RefreshCw className={`h-3 w-3 ${loading.github ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">GH</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Overview Section */}
        {(npmData || githubData) && (
          <AnalyticsOverviewSection 
            npmData={npmData} 
            githubData={githubData} 
            trendData={trendData}
            formatNumber={formatNumber}
          />
        )}

        {/* Download Trends Section */}
        {npmData && (
          <DownloadTrendsSection 
            npmData={npmData} 
            formatNumber={formatNumber}
          />
        )}

        {/* Repository Metrics Section */}
        {githubData && (
          <RepositoryMetricsSection 
            githubData={githubData}
            formatNumber={formatNumber}
          />
        )}

        {/* Contributors Section */}
        {githubData?.contributors && (
          <ContributorsSection 
            contributors={githubData.contributors}
            formatNumber={formatNumber}
          />
        )}

        {/* Releases Section */}
        {githubData?.releases && (
          <ReleasesSection 
            releases={githubData.releases}
          />
        )}

        {/* Quick Actions Section */}
        <QuickActionsSection />

        {/* End of File */}
        <motion.div className="mb-4 mt-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold text-lg sm:text-xl text-muted-foreground">
                END_OF_FILE
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [ANALYTICS.LOG]
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}