"use client";

import {
  TrendingUp,
  TrendingDown,
  Download,
  Star,
  Users,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";
import { NpmPackageData, GitHubRepoData } from "@/lib/api";

interface AnalyticsOverviewSectionProps {
  npmData: NpmPackageData | null;
  githubData: GitHubRepoData | null;
  trendData: {
    trend: number;
    direction: "up" | "down";
    recentAvg: number;
    previousAvg: number;
  } | null;
  formatNumber: (num: number) => string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    scale: 1.02,
  },
};

export default function AnalyticsOverviewSection({
  npmData,
  githubData,
  trendData,
  formatNumber,
}: AnalyticsOverviewSectionProps) {
  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">Key Metrics</span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          Real-time analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <motion.div
          className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
          variants={cardVariants}
          whileHover="hover"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Downloads
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {npmData ? formatNumber(npmData.totalLast7Days) : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Last 7 days</div>
              {trendData && (
                <div className="flex items-center space-x-2 text-sm">
                  {trendData.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      trendData.direction === "up"
                        ? "text-green-500 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {Math.abs(trendData.trend).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* GitHub Stars */}
        <motion.div
          className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
          variants={cardVariants}
          whileHover="hover"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  GitHub Stars
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {githubData
                  ? formatNumber(githubData.info.stargazersCount)
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                Repository popularity
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contributors */}
        <motion.div
          className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
          variants={cardVariants}
          whileHover="hover"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Contributors
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {githubData ? githubData.contributors.length : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                Active contributors
              </div>
            </div>
          </div>
        </motion.div>

        {/* Releases */}
        <motion.div
          className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
          variants={cardVariants}
          whileHover="hover"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Releases
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {githubData ? githubData.releases.length : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                Total releases
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
