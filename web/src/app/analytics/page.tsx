"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { format } from "date-fns";
import {
  fetchNpmPackageData,
  fetchGitHubRepoData,
  NpmPackageData,
  GitHubRepoData,
} from "@/lib/api";
import { cn } from "@/lib/utils";

// Dynamic imports for analytics components
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

// Filter categories
const filterCategories = [
  {
    id: "overview",
    label: "Overview",
    icon: Activity,
    description: "Key metrics and KPIs",
  },
  {
    id: "stacks",
    label: "Technology Stacks",
    icon: BarChart3,
    description: "Stack usage and trends",
  },
  {
    id: "systems",
    label: "Systems",
    icon: Package,
    description: "Package managers and tools",
  },
  {
    id: "deployment",
    label: "Deployment",
    icon: Zap,
    description: "Performance and deployment",
  },
  {
    id: "repository",
    label: "Repository",
    icon: Globe,
    description: "GitHub and download data",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    description: "Contributors and engagement",
  },
];

export default function AnalyticsPage() {
  // State management
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [githubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState({ npm: false, github: false });
  const [error, setError] = useState({ npm: "", github: "" });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter state - all sections visible by default
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set([
      "overview",
      "stacks",
      "systems",
      "deployment",
      "repository",
      "community",
    ]),
  );

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

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold font-mono text-foreground">
                    Analytics Dashboard
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    Real-time insights and usage metrics
                  </p>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 p-1 rounded-lg border border-border bg-background/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Grid3X3 className="h-3 w-3" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <List className="h-3 w-3" />
                    List
                  </button>
                </div>

                {/* Refresh Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Updated:</span>
                    <span>{format(lastUpdated, "HH:mm")}</span>
                  </div>
                  <button
                    onClick={() => {
                      fetchNpmData();
                      fetchGitHubData();
                    }}
                    disabled={loading.npm || loading.github}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:bg-muted hover:border-primary/40 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4",
                        (loading.npm || loading.github) && "animate-spin",
                      )}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            {(npmData || githubData) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {githubData && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {formatNumber(githubData.info?.stargazersCount || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                  </div>
                )}

                {githubData && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                    <GitFork className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {formatNumber(githubData.info?.forksCount || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Forks</div>
                    </div>
                  </div>
                )}

                {npmData && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                    <Download className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {formatNumber(npmData.totalLast7Days || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Weekly DL
                      </div>
                    </div>
                  </div>
                )}

                {githubData && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {formatNumber(githubData.info?.watchersCount || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Watchers
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Sections:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleSection(category.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                    visibleSections.has(category.id)
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
                  )}
                  title={category.description}
                >
                  <category.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">
                    {category.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {(error.npm || error.github) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-red-200 bg-red-50"
          >
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <div className="flex items-center gap-2 text-red-800">
                <span className="font-semibold">Data Loading Issues:</span>
                {error.npm && <span>NPM: {error.npm}</span>}
                {error.github && <span>GitHub: {error.github}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Overview Section */}
          <AnimatePresence>
            {visibleSections.has("overview") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">Overview</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Key Performance Indicators
                  </span>
                </div>
                <KPICards />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Technology Stacks Section */}
          <AnimatePresence>
            {visibleSections.has("stacks") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">
                    Technology Stacks
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Usage Analytics
                  </span>
                </div>

                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1",
                  )}
                >
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <TopStacksBar />
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <StackUsagePie />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <StackTrendsLine />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Systems Section */}
          <AnimatePresence>
            {visibleSections.has("systems") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">
                    Systems & Tools
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Environment Analytics
                  </span>
                </div>

                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1",
                  )}
                >
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <PackageManagerStats />
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <SystemMetrics />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Deployment Section */}
          <AnimatePresence>
            {visibleSections.has("deployment") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">
                    Deployment & Performance
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Performance Metrics
                  </span>
                </div>

                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1",
                  )}
                >
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <DeploymentAnalytics />
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <PerformanceMetrics />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Repository Section */}
          <AnimatePresence>
            {visibleSections.has("repository") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">
                    Repository & Downloads
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Repository Data
                  </span>
                </div>

                <div className="space-y-6">
                  {githubData && (
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <RepositoryMetricsSection
                        githubData={githubData}
                        formatNumber={formatNumber}
                      />
                    </div>
                  )}

                  {npmData && (
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <DownloadTrendsSection
                        npmData={npmData}
                        formatNumber={formatNumber}
                      />
                    </div>
                  )}

                  {githubData && (
                    <div
                      className={cn(
                        "grid gap-6",
                        viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1",
                      )}
                    >
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <ReleasesSection releases={githubData.releases} />
                      </div>
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <QuickActionsSection />
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Community Section */}
          <AnimatePresence>
            {visibleSections.has("community") && (
              <motion.section
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-mono">Community</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Community Engagement
                  </span>
                </div>

                {githubData && (
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <ContributorsSection
                      contributors={githubData.contributors}
                      formatNumber={formatNumber}
                    />
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
