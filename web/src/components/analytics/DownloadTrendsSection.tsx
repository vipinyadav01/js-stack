"use client";

import { TrendingUp, Download, Calendar, BarChart3 } from "lucide-react";
import { NpmPackageData } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface DownloadTrendsSectionProps {
  npmData: NpmPackageData;
  formatNumber: (num: number) => string;
}

export default function DownloadTrendsSection({
  npmData,
  formatNumber,
}: DownloadTrendsSectionProps) {
  // Calculate some stats
  const totalDownloads = npmData.totalLast7Days;
  const avgDaily = Math.round(totalDownloads / 7);
  const maxDaily = Math.max(...npmData.downloads.map((d) => d.downloads));
  const minDaily = Math.min(...npmData.downloads.map((d) => d.downloads));

  // Chart colors - will work in both light and dark mode
  const chartColors = {
    primary: "#3b82f6", // Blue-500
    primaryLight: "#60a5fa", // Blue-400
    background: "var(--color-background)",
    border: "var(--color-border)",
    text: "var(--color-foreground)",
    textMuted: "var(--color-muted-foreground)",
    grid: "var(--color-border)",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">Download Trends</span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          Last 7 days analysis
        </span>
      </div>

      {/* Download Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Total Downloads</span>
          </div>
          <div className="text-xl font-bold mt-1">
            {formatNumber(totalDownloads)}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Avg Daily</span>
          </div>
          <div className="text-xl font-bold mt-1">{formatNumber(avgDaily)}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Peak Day</span>
          </div>
          <div className="text-xl font-bold mt-1">{formatNumber(maxDaily)}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Lowest Day</span>
          </div>
          <div className="text-xl font-bold mt-1">{formatNumber(minDaily)}</div>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded border border-border">
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="font-semibold text-xs">Download Trends Chart</span>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-foreground mb-1">
              Daily download statistics for {npmData.info.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Package: {npmData.info.name} v{npmData.info.version} • Total:{" "}
              {formatNumber(npmData.totalLast7Days)} downloads over 7 days
            </div>
          </div>

          <div className="h-80 w-full text-foreground">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={npmData.downloads}>
                <defs>
                  <linearGradient
                    id="downloadGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartColors.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.primary}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  className="text-border"
                />
                <XAxis
                  dataKey="day"
                  tickFormatter={(value) => format(new Date(value), "MMM dd")}
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
                  labelFormatter={(value) =>
                    format(new Date(value as string), "EEEE, MMM dd, yyyy")
                  }
                  formatter={(value: number) => [
                    formatNumber(value),
                    "Downloads",
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
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke={chartColors.primary}
                  fill="url(#downloadGradient)"
                  strokeWidth={2}
                  activeDot={{
                    r: 4,
                    fill: chartColors.primary,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
