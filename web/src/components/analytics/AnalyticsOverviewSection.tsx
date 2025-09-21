"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { NpmPackageData, GitHubRepoData } from "@/lib/api";

interface AnalyticsOverviewSectionProps {
  npmData: NpmPackageData | null;
  githubData: GitHubRepoData | null;
  trendData: {
    trend: number;
    direction: 'up' | 'down';
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnalyticsOverviewSection({ 
  npmData, 
  githubData, 
  trendData, 
  formatNumber 
}: AnalyticsOverviewSectionProps) {
  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            ANALYTICS_OVERVIEW.LOG
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [KEY_METRICS]
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">📦</span>
              <span className="font-semibold text-xs">
                [TOTAL_DOWNLOADS]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {npmData ? formatNumber(npmData.totalLast7Days) : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Last 7 days
            </div>
            {trendData && (
              <div className="flex items-center space-x-2 text-xs">
                {trendData.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={trendData.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(trendData.trend).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* GitHub Stars */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">⭐</span>
              <span className="font-semibold text-xs">
                [GITHUB_STARS]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {githubData ? formatNumber(githubData.info.stargazersCount) : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Repository popularity
            </div>
          </div>
        </motion.div>

        {/* Contributors */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">👥</span>
              <span className="font-semibold text-xs">
                [CONTRIBUTORS]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {githubData ? githubData.contributors.length : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Active contributors
            </div>
          </div>
        </motion.div>

        {/* Releases */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">🚀</span>
              <span className="font-semibold text-xs">
                [RELEASES]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {githubData ? githubData.releases.length : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Total releases
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
