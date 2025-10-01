"use client";

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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="text-muted-foreground text-sm font-medium">
          {analytics.totalSponsors}{" "}
          {analytics.totalSponsors === 1 ? "Sponsor" : "Sponsors"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 shadow-sm hover:shadow-md transition-all duration-300"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm">💰</span>
              <span className="font-semibold text-sm">[TOTAL_REVENUE]</span>
            </div>
          </div>
          <div className="p-5">
            <div className="text-3xl font-mono font-bold text-foreground mb-2">
              {formatCurrency(analytics.totalAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total sponsorship value
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 shadow-sm hover:shadow-md transition-all duration-300"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm">👥</span>
              <span className="font-semibold text-sm">[SPONSOR_COUNT]</span>
            </div>
          </div>
          <div className="p-5">
            <div className="text-3xl font-mono font-bold text-foreground mb-2">
              {analytics.totalSponsors}
            </div>
            <div className="text-sm text-muted-foreground">Active sponsors</div>
          </div>
        </motion.div>

        <motion.div
          className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 shadow-sm hover:shadow-md transition-all duration-300"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm">📈</span>
              <span className="font-semibold text-sm">[GROWTH_RATE]</span>
            </div>
          </div>
          <div className="p-5">
            <div className="text-3xl font-mono font-bold text-foreground mb-2">
              +{analytics.monthlyGrowth}%
            </div>
            <div className="text-sm text-muted-foreground">Monthly growth</div>
          </div>
        </motion.div>

        <motion.div
          className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 shadow-sm hover:shadow-md transition-all duration-300"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm">🏆</span>
              <span className="font-semibold text-sm">[TOP_TIER]</span>
            </div>
          </div>
          <div className="p-5">
            <div className="text-3xl font-mono font-bold text-foreground mb-2">
              {analytics.topTier}
            </div>
            <div className="text-sm text-muted-foreground">Popular tier</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
