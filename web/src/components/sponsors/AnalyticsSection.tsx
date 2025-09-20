"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, type SponsorAnalytics } from "@/lib/sponsors-api";

interface AnalyticsSectionProps {
  analytics: SponsorAnalytics;
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

export default function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            ANALYTICS_REPORT.LOG
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [{analytics.totalSponsors} SPONSORS]
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">💰</span>
              <span className="font-semibold text-xs">
                [TOTAL_REVENUE]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {formatCurrency(analytics.totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              Total sponsorship value
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">👥</span>
              <span className="font-semibold text-xs">
                [SPONSOR_COUNT]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {analytics.totalSponsors}
            </div>
            <div className="text-xs text-muted-foreground">
              Active sponsors
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">📈</span>
              <span className="font-semibold text-xs">
                [GROWTH_RATE]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              +{analytics.monthlyGrowth}%
            </div>
            <div className="text-xs text-muted-foreground">
              Monthly growth
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">🏆</span>
              <span className="font-semibold text-xs">
                [TOP_TIER]
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-mono font-bold text-foreground mb-2">
              {analytics.topTier}
            </div>
            <div className="text-xs text-muted-foreground">
              Popular tier
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
