"use client";

import { useEffect, useState } from "react";

type Perf = {
  ttfbMsP50: number;
  fcpMsP50: number;
  lcpMsP50: number;
  bundleKBp50: number;
  cacheHitRatePct: number;
  bandwidthGB: number;
};

export default function PerformanceMetrics() {
  const [data, setData] = useState<Perf | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/performance")
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError("Failed to load performance"));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data)
    return (
      <div className="text-sm text-muted-foreground">Loading performance…</div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b pb-2 font-mono text-xs text-muted-foreground">
        <span>[PERFORMANCE_METRICS]</span>
        <span>analytics.log</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">TTFB (p50)</div>
          <div className="text-2xl font-semibold">{data.ttfbMsP50}ms</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">FCP (p50)</div>
          <div className="text-2xl font-semibold">{data.fcpMsP50}ms</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">LCP (p50)</div>
          <div className="text-2xl font-semibold">{data.lcpMsP50}ms</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Bundle (p50)</div>
          <div className="text-2xl font-semibold">{data.bundleKBp50}KB</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Cache hit rate</div>
          <div className="text-2xl font-semibold">{data.cacheHitRatePct}%</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Bandwidth</div>
          <div className="text-2xl font-semibold">{data.bandwidthGB} GB</div>
        </div>
      </div>
    </div>
  );
}
