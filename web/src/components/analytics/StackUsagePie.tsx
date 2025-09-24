"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Circle } from "lucide-react";

type Item = { stack: string; percentage: number };

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

export default function StackUsagePie() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/stacks/usage")
      .then((r) => r.json())
      .then((d) => mounted && setItems(d))
      .catch(() => mounted && setError("Failed to load stack usage"));
    return () => {
      mounted = false;
    };
  }, []);

  const segments = useMemo(() => {
    if (!items) return [] as { stack: string; from: number; to: number }[];
    let acc = 0;
    return items.map((it) => {
      const from = acc;
      const to = acc + it.percentage;
      acc = to;
      return { stack: it.stack, from, to };
    });
  }, [items]);

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#22D3EE"];
  const gradient = segments
    .map((s, i) => `${colors[i % colors.length]} ${s.from}% ${s.to}%`)
    .join(", ");

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!items) return <div className="text-sm text-muted-foreground">Loading stack usage…</div>;

  return (
    <motion.div variants={containerVariants}>
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Stack Usage Distribution</span>
        </div>
        <span className="text-xs text-muted-foreground">Technology breakdown</span>
      </div>
      <div className="flex items-center gap-6">
        <motion.div 
          className="relative h-48 w-48 rounded-full border-4 border-border shadow-lg"
          style={{ background: `conic-gradient(${gradient})` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-background">
            <div className="text-center">
              <Circle className="h-6 w-6 text-primary mx-auto mb-1" />
              <div className="text-xs font-semibold text-muted-foreground">Total</div>
            </div>
          </div>
        </motion.div>
        <div className="flex-1 space-y-3">
          {items.slice(0, 8).map((it, i) => (
            <motion.div 
              key={it.stack} 
              className="group flex items-center justify-between rounded-lg border border-border bg-card/50 p-3 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: colors[i % colors.length] }} 
                />
                <span className="font-medium text-sm">{it.stack}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{it.percentage}%</span>
                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${it.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


