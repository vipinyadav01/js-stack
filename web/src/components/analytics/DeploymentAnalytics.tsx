"use client";

import { useEffect, useState } from "react";

type Deployment = {
  buildsPerDay: number;
  successRatePct: number;
  avgBuildSeconds: number;
  geo: { region: string; share: number }[];
};

export default function DeploymentAnalytics() {
  const [data, setData] = useState<Deployment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/deployments")
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError("Failed to load deployments"));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading deployments…</div>;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b pb-2 font-mono text-xs text-muted-foreground">
        <span>[DEPLOYMENT_ANALYTICS]</span>
        <span>analytics.log</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Builds / day</div>
          <div className="text-2xl font-semibold">{data.buildsPerDay}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Success rate</div>
          <div className="text-2xl font-semibold">{data.successRatePct}%</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Avg build time</div>
          <div className="text-2xl font-semibold">{data.avgBuildSeconds}s</div>
        </div>
      </div>
    </div>
  );
}


