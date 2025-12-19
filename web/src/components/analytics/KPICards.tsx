"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Star,
  GitFork,
  Download,
  Users,
  Code2,
  BarChart3,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { NpmPackageData, GitHubRepoData } from "@/lib/api";

type KPI = {
  label: string;
  value: string | number;
  help?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface KPICardsProps {
  npmData?: NpmPackageData | null;
  githubData?: GitHubRepoData | null;
  formatNumber?: (num: number) => string;
}

export default function KPICards({
  npmData,
  githubData,
  formatNumber = (num) => num.toString(),
}: KPICardsProps) {
  const [posthogKPIs, setPosthogKPIs] = useState<KPI[]>([]);
  const [loadingKPIs, setLoadingKPIs] = useState(true);

  // Fetch PostHog KPIs
  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/kpis")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && Array.isArray(d)) {
          const kpis: KPI[] = d.map(
            (kpi: {
              label: string;
              value: string | number;
              help?: string;
            }) => ({
              label: kpi.label,
              value: kpi.value,
              help: kpi.help,
              icon: kpi.label.includes("adoption")
                ? BarChart3
                : kpi.label.includes("compatibility")
                  ? CheckCircle2
                  : kpi.label.includes("efficiency")
                    ? Zap
                    : TrendingUp,
            }),
          );
          setPosthogKPIs(kpis);
        }
      })
      .catch(() => {
        // Silently fail - PostHog KPIs are optional
      })
      .finally(() => {
        if (mounted) setLoadingKPIs(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getKPIs = (): KPI[] => {
    const kpis: KPI[] = [];

    // PostHog analytics KPIs (from PostHog data)
    if (!loadingKPIs && posthogKPIs.length > 0) {
      kpis.push(...posthogKPIs);
    }

    // GitHub stats
    if (githubData?.info) {
      kpis.push(
        {
          label: "GitHub Stars",
          value: formatNumber(githubData.info.stargazersCount || 0),
          help: "Total repository stars",
          icon: Star,
        },
        {
          label: "Forks",
          value: formatNumber(githubData.info.forksCount || 0),
          help: "Repository forks",
          icon: GitFork,
        },
        {
          label: "Watchers",
          value: formatNumber(githubData.info.watchersCount || 0),
          help: "Active watchers",
          icon: Users,
        },
        {
          label: "Open Issues",
          value: formatNumber(githubData.info.openIssuesCount || 0),
          help: "Current open issues",
          icon: Code2,
        },
      );
    }

    // NPM stats
    if (npmData) {
      kpis.push(
        {
          label: "Weekly Downloads",
          value: formatNumber(npmData.totalLast7Days || 0),
          help: "Downloads in last 7 days",
          icon: Download,
        },
        {
          label: "Package Versions",
          value: npmData.info.versionsCount || 0,
          help: "Total published versions",
          icon: TrendingUp,
        },
      );
    }

    return kpis;
  };

  const kpis = getKPIs();

  if (kpis.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No data available</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon || TrendingUp;
          return (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {kpi.value}
                </div>
                {kpi.help && (
                  <div className="text-xs text-muted-foreground">
                    {kpi.help}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
