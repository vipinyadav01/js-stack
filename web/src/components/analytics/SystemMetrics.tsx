"use client";

import { useEffect, useState } from "react";

type SystemMetrics = {
  os: { name: string; share: number }[];
  versions: { os: string; version: string; share: number }[];
  hardware: {
    cpuCoresP50: number;
    ramGBp50: number;
    storageUsedPctP50: number;
  };
};

export default function SystemMetrics() {
  const [data, setData] = useState<SystemMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/system")
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError("Failed to load system metrics"));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data)
    return (
      <div className="text-sm text-muted-foreground">
        Loading system metrics…
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b pb-2 font-mono text-xs text-muted-foreground">
        <span>[SYSTEM_METRICS]</span>
        <span>analytics.log</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border p-3">
          <div className="mb-2 font-medium">Operating Systems</div>
          <div className="space-y-2">
            {data.os.map((o) => (
              <div key={o.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{o.name}</span>
                  <span className="text-muted-foreground">{o.share}%</span>
                </div>
                <div className="h-2 w-full rounded bg-muted">
                  <div
                    className="h-2 rounded bg-emerald-500"
                    style={{ width: `${o.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border p-3">
          <div className="mb-2 font-medium">Hardware (p50)</div>
          <div className="text-sm grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">CPU Cores</div>
              <div className="text-lg font-semibold">
                {data.hardware.cpuCoresP50}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">RAM (GB)</div>
              <div className="text-lg font-semibold">
                {data.hardware.ramGBp50}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Storage Used</div>
              <div className="text-lg font-semibold">
                {data.hardware.storageUsedPctP50}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
