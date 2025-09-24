"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, Zap } from "lucide-react";

type PM = { name: string; share: number; versions: { version: string; share: number }[]; perf: { installMsP50: number; resolveMsP50: number } };

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

export default function PackageManagerStats() {
  const [data, setData] = useState<PM[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/package-managers")
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError("Failed to load PM stats"));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading package managers…</div>;

  return (
    <motion.div variants={containerVariants}>
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Package Manager Statistics</span>
        </div>
        <span className="text-xs text-muted-foreground">Performance metrics</span>
      </div>
      <div className="space-y-4">
        {data.map((pm) => (
          <motion.div 
            key={pm.name} 
            className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{pm.name}</div>
                    <div className="text-xs text-muted-foreground">{pm.share}% market share</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{pm.share}%</div>
                  <div className="text-xs text-muted-foreground">share</div>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Version Distribution</span>
                  </div>
                  <div className="space-y-2">
                    {pm.versions.slice(0, 3).map((v) => (
                      <div key={v.version} className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1">
                        <span className="text-xs font-mono">{v.version}</span>
                        <span className="text-xs font-semibold text-primary">{v.share}%</span>
                      </div>
                    ))}
                    {pm.versions.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{pm.versions.length - 3} more versions
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Performance (P50)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1">
                      <span className="text-xs text-muted-foreground">Install Time</span>
                      <span className="text-xs font-semibold text-primary">
                        {Math.round(pm.perf.installMsP50 / 1000)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1">
                      <span className="text-xs text-muted-foreground">Resolve Time</span>
                      <span className="text-xs font-semibold text-primary">
                        {pm.perf.resolveMsP50}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


