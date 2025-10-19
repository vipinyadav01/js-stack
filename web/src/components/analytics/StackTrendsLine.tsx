"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Calendar, BarChart3, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Trend = { t: string; value: number };

export default function StackTrendsLine({
  range = "30d" as "7d" | "30d" | "90d",
}) {
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

  const rangeLabels = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Process data for Recharts
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item, index) => ({
      name: item.t,
      value: item.value,
      date: item.t,
      index,
    }));
  }, [data]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-800">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">Error loading trends</span>
        </div>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">Loading trends data...</span>
        </div>
      </div>
    );
  }

  // Calculate stats
  const maxValue = Math.max(...data.map((p) => p.value));
  const minValue = Math.min(...data.map((p) => p.value));
  const avgValue = Math.round(
    data.reduce((sum, p) => sum + p.value, 0) / data.length,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Stack Usage Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              Technology stack adoption over time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{rangeLabels[range]}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Peak Usage
            </span>
          </div>
          <div className="text-xl font-bold text-foreground mt-1">
            {formatNumber(maxValue)}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Average
            </span>
          </div>
          <div className="text-xl font-bold text-foreground mt-1">
            {formatNumber(avgValue)}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">
              Lowest
            </span>
          </div>
          <div className="text-xl font-bold text-foreground mt-1">
            {formatNumber(minValue)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              Usage Timeline
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Total data points: {data.length}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
                className="text-border"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                tickLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                tickLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                className="text-muted-foreground"
              />
              <Tooltip
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number) => [formatNumber(value), "Usage"]}
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
