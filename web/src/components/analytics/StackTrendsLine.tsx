"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";

type Trend = { t: string; value: number };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function StackTrendsLine({ range = "30d" as "7d" | "30d" | "90d" }) {
  const [data, setData] = useState<Trend[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/analytics/stacks/trends?range=${range}`)
      .then((r) => r.json())
      .then((d) => mounted && setData(d.points))
      .catch(() => mounted && setError("Failed to load trends"));
    return () => {
      mounted = false;
    };
  }, [range]);

  const maxV = Math.max(...(data?.map((p) => p.value) || [1]), 1);
  const points = useMemo(() => {
    const arr = data || [];
    return arr
      .map((p, i) => {
        const x = (i / Math.max(1, arr.length - 1)) * 100;
        const y = 100 - (p.value / maxV) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, maxV]);

  const rangeLabels = {
    "7d": "Last 7 days",
    "30d": "Last 30 days", 
    "90d": "Last 90 days"
  };

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading trends…</div>;

  return (
    <motion.div variants={containerVariants}>
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Stack Usage Trends</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{rangeLabels[range]}</span>
        </div>
      </div>
      <div className="relative">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">Usage over time</div>
            <div className="text-xs text-muted-foreground">
              Peak: {Math.max(...data.map(p => p.value)).toLocaleString()}
            </div>
          </div>
          <div className="relative h-48 w-full">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.polyline 
                fill="url(#trendGradient)" 
                stroke="#3B82F6" 
                strokeWidth="2" 
                points={points}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.polyline 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2" 
                points={points}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{data[0]?.t || 'Start'}</span>
            <span>{data[data.length - 1]?.t || 'End'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


