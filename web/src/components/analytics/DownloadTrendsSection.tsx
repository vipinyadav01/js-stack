"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { NpmPackageData } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface DownloadTrendsSectionProps {
  npmData: NpmPackageData;
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

export default function DownloadTrendsSection({ npmData, formatNumber }: DownloadTrendsSectionProps) {
  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            Download Trends
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          7-day chart
        </span>
      </div>
      
      <motion.div 
        className="w-full min-w-0 overflow-hidden rounded border border-border"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">📈</span>
            <span className="font-semibold text-xs">
              Chart Data
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-foreground mb-1">
              Daily download statistics with trend analysis
            </div>
            <div className="text-xs text-muted-foreground">
              Package: {npmData.info.name} • Total: {formatNumber(npmData.totalLast7Days)} downloads
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={npmData.downloads}>
                <defs>
                  <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="opacity-30" 
                  stroke="hsl(var(--border))"
                />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  className="text-xs fill-muted-foreground"
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tickFormatter={formatNumber} 
                  className="text-xs fill-muted-foreground"
                  stroke="hsl(var(--border))"
                />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value as string), 'EEEE, MMM dd, yyyy')}
                  formatter={(value: number) => [formatNumber(value), 'Downloads']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="downloads" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#downloadGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
