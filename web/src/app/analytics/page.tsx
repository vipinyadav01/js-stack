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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
    <div className="flex h-screen w-full overflow-hidden border-border text-foreground lg:grid lg:grid-cols-[30%_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm">
        <ScrollArea className="flex-1">
          <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
            {/* Analytics Sidebar Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold font-mono text-foreground">
                    Analytics
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Real-time insights
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              {(npmData || githubData) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {githubData && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                        <Star className="h-3 w-3 text-yellow-600" />
                        <div>
                          <div className="text-xs font-semibold">
                            {formatNumber(
                              githubData.info?.stargazersCount || 0,
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Stars
                          </div>
                        </div>
                      </div>
                    )}

                    {githubData && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                        <GitFork className="h-3 w-3 text-blue-600" />
                        <div>
                          <div className="text-xs font-semibold">
                            {formatNumber(githubData.info?.forksCount || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Forks
                          </div>
                        </div>
                      </div>
                    )}

                    {npmData && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                        <Download className="h-3 w-3 text-green-600" />
                        <div>
                          <div className="text-xs font-semibold">
                            {formatNumber(npmData.totalLast7Days || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Weekly
                          </div>
                        </div>
                      </div>
                    )}

                    {githubData && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                        <Eye className="h-3 w-3 text-purple-600" />
                        <div>
                          <div className="text-xs font-semibold">
                            {formatNumber(githubData.info?.watchersCount || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Watch
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section Filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Sections
                </h3>
                <div className="space-y-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleSection(category.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                        visibleSections.has(category.id)
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      <category.icon className="h-3 w-3" />
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Controls
                </h3>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
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
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <List className="h-3 w-3" />
                    List
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => {
                    fetchNpmData();
                    fetchGitHubData();
                  }}
                  disabled={loading.npm || loading.github}
                  className="w-full inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:bg-muted hover:border-primary/40 disabled:opacity-50"
                >
                  <RefreshCw
                    className={cn(
                      "h-3 w-3",
                      (loading.npm || loading.github) && "animate-spin",
                    )}
                  />
                  <span>Refresh Data</span>
                </button>

                {/* Last Updated */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Updated: {format(lastUpdated, "HH:mm")}</span>
                </div>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {(error.npm || error.github) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <div className="text-xs text-red-800">
                      <div className="font-semibold">Data Issues:</div>
                      {error.npm && <div>NPM: {error.npm}</div>}
                      {error.github && <div>GitHub: {error.github}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden h-9 w-9"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
              {/* Mobile Sidebar Content - Same as desktop */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold font-mono text-foreground">
                      Analytics
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Real-time insights
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                {(npmData || githubData) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {githubData && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                          <Star className="h-3 w-3 text-yellow-600" />
                          <div>
                            <div className="text-xs font-semibold">
                              {formatNumber(
                                githubData.info?.stargazersCount || 0,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Stars
                            </div>
                          </div>
                        </div>
                      )}

                      {githubData && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                          <GitFork className="h-3 w-3 text-blue-600" />
                          <div>
                            <div className="text-xs font-semibold">
                              {formatNumber(githubData.info?.forksCount || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Forks
                            </div>
                          </div>
                        </div>
                      )}

                      {npmData && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                          <Download className="h-3 w-3 text-green-600" />
                          <div>
                            <div className="text-xs font-semibold">
                              {formatNumber(npmData.totalLast7Days || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Weekly
                            </div>
                          </div>
                        </div>
                      )}

                      {githubData && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                          <Eye className="h-3 w-3 text-purple-600" />
                          <div>
                            <div className="text-xs font-semibold">
                              {formatNumber(
                                githubData.info?.watchersCount || 0,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Watch
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Filters */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Sections
                  </h3>
                  <div className="space-y-2">
                    {filterCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleSection(category.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                          visibleSections.has(category.id)
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <category.icon className="h-3 w-3" />
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Controls
                  </h3>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background/50">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
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
                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <List className="h-3 w-3" />
                      List
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => {
                      fetchNpmData();
                      fetchGitHubData();
                    }}
                    disabled={loading.npm || loading.github}
                    className="w-full inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:bg-muted hover:border-primary/40 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={cn(
                        "h-3 w-3",
                        (loading.npm || loading.github) && "animate-spin",
                      )}
                    />
                    <span>Refresh Data</span>
                  </button>

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated: {format(lastUpdated, "HH:mm")}</span>
                  </div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {(error.npm || error.github) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg border border-red-200 bg-red-50 p-3"
                    >
                      <div className="text-xs text-red-800">
                        <div className="font-semibold">Data Issues:</div>
                        {error.npm && <div>NPM: {error.npm}</div>}
                        {error.github && <div>GitHub: {error.github}</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 lg:p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 sm:space-y-8"
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
                            viewMode === "grid"
                              ? "lg:grid-cols-2"
                              : "grid-cols-1",
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
                      <h2 className="text-2xl font-bold font-mono">
                        Community
                      </h2>
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
        </ScrollArea>
      </main>
    </div>
  );
}
