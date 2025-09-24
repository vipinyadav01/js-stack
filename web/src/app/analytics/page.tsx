"use client";
import dynamic from "next/dynamic";
const KPICards = dynamic(() => import("@/components/analytics/KPICards"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading KPIs…</div> });
const TopStacksBar = dynamic(() => import("@/components/analytics/TopStacksBar"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading top stacks…</div> });
const StackUsagePie = dynamic(() => import("@/components/analytics/StackUsagePie"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading stack usage…</div> });
const StackTrendsLine = dynamic(() => import("@/components/analytics/StackTrendsLine"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading trends…</div> });
const PackageManagerStats = dynamic(() => import("@/components/analytics/PackageManagerStats"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading package managers…</div> });
const SystemMetrics = dynamic(() => import("@/components/analytics/SystemMetrics"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading system metrics…</div> });
const DeploymentAnalytics = dynamic(() => import("@/components/analytics/DeploymentAnalytics"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading deployments…</div> });
const PerformanceMetrics = dynamic(() => import("@/components/analytics/PerformanceMetrics"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading performance…</div> });
const ContributorsSection = dynamic(() => import("@/components/analytics/ContributorsSection"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading contributors…</div> });
const DownloadTrendsSection = dynamic(() => import("@/components/analytics/DownloadTrendsSection"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading download trends…</div> });
const ReleasesSection = dynamic(() => import("@/components/analytics/ReleasesSection"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading releases…</div> });
const RepositoryMetricsSection = dynamic(() => import("@/components/analytics/RepositoryMetricsSection"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading repository metrics…</div> });
const QuickActionsSection = dynamic(() => import("@/components/analytics/QuickActionsSection"), { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading quick actions…</div> });

import { useEffect, useState, useCallback } from "react";
import { fetchNpmPackageData, fetchGitHubRepoData, NpmPackageData, GitHubRepoData } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Activity, 
  RefreshCw,
  Clock,
  Zap,
  BarChart3,
  Package,
  Globe,
  Users,
} from "lucide-react";
import { format } from "date-fns";

export default function Analytics() {
  // State management
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [githubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState({ npm: false, github: false });
  const [error, setError] = useState({ npm: "", github: "" });
  const [showOverview, setShowOverview] = useState(true);
  const [showStacks, setShowStacks] = useState(true);
  const [showSystems, setShowSystems] = useState(true);
  const [showDeploy, setShowDeploy] = useState(true);
  const [showRepository, setShowRepository] = useState(true);
  const [showCommunity, setShowCommunity] = useState(true);
  
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
  // const getTrendData = () => {
  //   if (!npmData?.downloads || npmData.downloads.length < 2) return null;
  //   const recent = npmData.downloads.slice(-7);
  //   const previous = npmData.downloads.slice(-14, -7);
  //   
  //   const recentAvg = recent.reduce((sum, day) => sum + day.downloads, 0) / recent.length;
  //   const previousAvg = previous.reduce((sum, day) => sum + day.downloads, 0) / previous.length;
  //   
  //   const trend = ((recentAvg - previousAvg) / previousAvg) * 100;
  //   return {
  //     trend: trend,
  //     direction: trend > 0 ? 'up' as const : 'down' as const,
  //     recentAvg: Math.round(recentAvg),
  //     previousAvg: Math.round(previousAvg)
  //   };
  // };

  // const trendData = getTrendData(); // Unused for now

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  return (
    <div className="w-full max-w-full overflow-hidden px-4">
      {/* Hero/header in sponsor-page style */}
      <div className="mx-auto max-w-[1280px] py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {/* Terminal Header */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-xl sm:text-2xl">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time project metrics and insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Last updated: {format(new Date(), 'MMM dd, HH:mm')}</span>
                <span className="sm:hidden">{format(new Date(), 'HH:mm')}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={fetchNpmData}
                  disabled={loading.npm}
                  className="inline-flex items-center space-x-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:bg-muted hover:border-primary/20 disabled:opacity-50"
                  title="Refresh NPM data"
                >
                  <RefreshCw className={`h-3 w-3 ${loading.npm ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">NPM</span>
                </button>
                <button
                  onClick={fetchGitHubData}
                  disabled={loading.github}
                  className="inline-flex items-center space-x-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:bg-muted hover:border-primary/20 disabled:opacity-50"
                  title="Refresh GitHub data"
                >
                  <RefreshCw className={`h-3 w-3 ${loading.github ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
          <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setShowOverview((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showOverview ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showOverview}
            >
              <Activity className="h-3 w-3" />
              Overview
            </button>
            <button
              type="button"
              onClick={() => setShowStacks((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showStacks ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showStacks}
            >
              <BarChart3 className="h-3 w-3" />
              Stacks
            </button>
            <button
              type="button"
              onClick={() => setShowSystems((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showSystems ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showSystems}
            >
              <Package className="h-3 w-3" />
              Systems
            </button>
            <button
              type="button"
              onClick={() => setShowDeploy((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showDeploy ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showDeploy}
            >
              <Zap className="h-3 w-3" />
              Deploy
            </button>
            <button
              type="button"
              onClick={() => setShowRepository((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showRepository ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showRepository}
            >
              <Globe className="h-3 w-3" />
              Repository
            </button>
            <button
              type="button"
              onClick={() => setShowCommunity((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${showCommunity ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'}`}
              aria-pressed={showCommunity}
            >
              <Users className="h-3 w-3" />
              Community
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error.npm || error.github) && (
        <motion.div className="mx-auto mb-8 max-w-[1280px]" variants={containerVariants}>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-semibold">Error loading data:</span>
              {error.npm && <span>NPM: {error.npm}</span>}
              {error.github && <span>GitHub: {error.github}</span>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Overview KPI section */}
      {showOverview && (
        <motion.div className="mx-auto mb-8 max-w-[1280px]" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Overview
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              Key metrics
            </span>
          </div>
          <KPICards />
        </motion.div>
      )}

      {/* Stacks section */}
      {showStacks && (
        <motion.div className="mx-auto mb-8 max-w-[1280px] space-y-6" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Technology Stacks
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              Stack analytics
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <TopStacksBar />
            </div>
            <div className="rounded-md border p-4">
              <StackUsagePie />
            </div>
          </div>
          <div className="rounded-md border p-4">
            <StackTrendsLine />
          </div>
        </motion.div>
      )}

      {/* Systems section */}
      {showSystems && (
        <motion.div className="mx-auto mb-8 max-w-[1280px]" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Systems & Environments
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              System metrics
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <PackageManagerStats />
            </div>
            <div className="rounded-md border p-4">
              <SystemMetrics />
            </div>
          </div>
        </motion.div>
      )}

      {/* Deployment section */}
      {showDeploy && (
        <motion.div className="mx-auto mb-8 max-w-[1280px]" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Deployments & Performance
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              Performance metrics
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <DeploymentAnalytics />
            </div>
            <div className="rounded-md border p-4">
              <PerformanceMetrics />
            </div>
          </div>
        </motion.div>
      )}

      {/* Repository section */}
      {showRepository && (
        <motion.div className="mx-auto mb-8 max-w-[1280px] space-y-6" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Repository & Downloads
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              Repository data
            </span>
          </div>
          <div className="space-y-6">
            {githubData && (
              <RepositoryMetricsSection githubData={githubData} formatNumber={formatNumber} />
            )}
            {npmData && (
              <DownloadTrendsSection npmData={npmData} formatNumber={formatNumber} />
            )}
            {githubData && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <ReleasesSection releases={githubData.releases} />
                </div>
                <div className="rounded-md border p-4">
                  <QuickActionsSection />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Community section */}
      {showCommunity && (
        <motion.div className="mx-auto mb-8 max-w-[1280px] space-y-6" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                Community
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              Community data
            </span>
          </div>
          <div className="space-y-6">
            {githubData && (
              <div className="rounded-md border p-4">
                <ContributorsSection contributors={githubData.contributors} formatNumber={formatNumber} />
              </div>
            )}
          </div>
        </motion.div>
      )}
      {/* Legacy analytics sections removed to prevent duplicate data */}
    </div>
  );
}