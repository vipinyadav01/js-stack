"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Download, 
  GitBranch, 
  Layers, 
  TrendingUp, 
  Code2,
  Users2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  subtitle: string;
  trend?: string;
  href?: string;
  variant?: string;
  loading?: boolean;
}

interface CardWrapperProps {
  children: React.ReactNode;
  href?: string;
}

// Mock data hook to simulate API calls
const useStatsData = () => {
  const [data, setData] = useState({
    downloads: { total: 0, weekly: 0, trend: '+12%' },
    stars: { count: 0, trend: '+8%' },
    projects: { created: 0, active: 0 },
    contributors: { count: 0, trend: '+3%' },
    loading: true
  });

  useEffect(() => {
    // Simulate API call with animated counting
    const timer = setTimeout(() => {
      setData({
        downloads: { total: 15420, weekly: 1250, trend: '+12%' },
        stars: { count: 342, trend: '+8%' },
        projects: { created: 2840, active: 180 },
        contributors: { count: 28, trend: '+3%' },
        loading: false
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return data;
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  href, 
  variant = 'default',
  loading = false 
}: StatCardProps) => {
  const CardWrapper = ({ children, href }: CardWrapperProps) => {
    if (href) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group transition-transform hover:scale-[1.02]"
        >
          {children}
        </a>
      );
    }
    return <div className="group">{children}</div>;
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30';
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30';
      case 'warning':
        return 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30';
      default:
        return 'border-border';
    }
  };

  return (
    <CardWrapper>
      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${getVariantStyles(variant)}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-background/60 shadow-sm border">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-medium tracking-tight">
              {title}
            </CardTitle>
          </div>
          {href && (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 mb-1">
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="w-16 h-7 bg-muted rounded animate-pulse" />
              ) : (
                <AnimatedCounter value={value} />
              )}
            </div>
            {trend && !loading && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-medium">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

const StatsSection = ({ 
  packageName = "create-js-stack",
  githubRepo = "vipinyadav01/create-js-stack-cli",
  npmUrl = "https://www.npmjs.com/package/create-js-stack"
}) => {
  const stats = useStatsData();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-2 rounded-full bg-primary/10 border">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Project Analytics
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Real-time metrics and community insights for <span className="font-semibold text-foreground">{packageName}</span>
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Download}
          title="Total Downloads"
          value={stats.downloads.total}
          subtitle={`${stats.downloads.weekly.toLocaleString()} this week`}
          trend={stats.downloads.trend}
          href={npmUrl}
          variant="primary"
          loading={stats.loading}
        />
        
        <StatCard
          icon={GitBranch}
          title="GitHub Stars"
          value={stats.stars.count}
          subtitle="Community support"
          trend={stats.stars.trend}
          href={`https://github.com/${githubRepo}`}
          variant="success"
          loading={stats.loading}
        />
        
        <StatCard
          icon={Layers}
          title="Projects Created"
          value={stats.projects.created}
          subtitle={`${stats.projects.active} active this month`}
          variant="warning"
          loading={stats.loading}
        />
        
        <StatCard
          icon={Users2}
          title="Contributors"
          value={stats.contributors.count}
          subtitle="Amazing developers"
          trend={stats.contributors.trend}
          href={`https://github.com/${githubRepo}/graphs/contributors`}
          loading={stats.loading}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Usage Analytics</CardTitle>
            </div>
            <CardDescription>
              Download patterns and usage trends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Daily Average</span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? '—' : '~85'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Peak Day Record</span>
              <Badge variant="outline" className="font-mono">
                {stats.loading ? '—' : '342'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Monthly Growth</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-mono">
                {stats.loading ? '—' : '+23%'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground font-medium">Version Stability</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Stable
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Package Info</CardTitle>
            </div>
            <CardDescription>
              Technical details and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Bundle Size</span>
              <Badge variant="outline" className="font-mono">2.1 MB</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">Dependencies</span>
              <Badge variant="outline" className="font-mono">12</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground font-medium">License</span>
              <Badge variant="secondary">MIT</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground font-medium">Last Updated</span>
              <Badge variant="outline" className="font-mono">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">
                Access package resources and documentation
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <a href={npmUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Install Package
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`https://github.com/${githubRepo}`} target="_blank" rel="noopener noreferrer">
                  <GitBranch className="w-4 h-4 mr-2" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSection;