"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, TrendingUp } from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Item = { stack: string; percentage: number };

const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#22D3EE",
];

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

  // Prepare data for Recharts
  const chartData = useMemo(() => {
    if (!items) return [];
    return items.map((item, index) => ({
      name: item.stack,
      value: item.percentage,
      color: colors[index % colors.length],
    }));
  }, [items]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-800">
          <PieChart className="h-4 w-4" />
          <span className="text-sm font-medium">Error loading stack usage</span>
        </div>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <PieChart className="h-4 w-4" />
          <span className="text-sm">Loading stack usage...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Stack Usage Distribution
            </h3>
            <p className="text-sm text-muted-foreground">
              Technology breakdown by adoption
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Distribution</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Section */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-sm font-semibold text-foreground">
              Usage Breakdown
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: "500",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend/List Section */}
        <div className="space-y-3">
          <div className="text-center lg:text-left">
            <span className="text-sm font-semibold text-foreground">
              Stack Details
            </span>
          </div>
          <div className="space-y-2">
            {chartData.slice(0, 8).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-sm text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-primary">
                    {item.value}%
                  </div>
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        backgroundColor: item.color,
                        width: `${item.value}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
