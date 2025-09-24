"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp } from "lucide-react";

type KPI = { label: string; value: string | number; help?: string };

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

export default function KPICards() {
  const [kpis, setKpis] = useState<KPI[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/kpis")
      .then((r) => r.json())
      .then((d) => mounted && setKpis(d))
      .catch(() => mounted && setError("Failed to load KPIs"));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!kpis) return <div className="text-sm text-muted-foreground">Loading KPIs…</div>;

  return (
    <motion.div variants={containerVariants}>
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Key Performance Indicators</span>
        </div>
        <span className="text-xs text-muted-foreground">Real-time metrics</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <motion.div 
            key={k.label} 
            className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{k.value}</div>
              {k.help ? <div className="text-xs text-muted-foreground">{k.help}</div> : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


