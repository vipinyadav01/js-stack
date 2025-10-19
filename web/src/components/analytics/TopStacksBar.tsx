"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

type Item = { stack: string; percentage: number; users: number };

export default function TopStacksBar() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/stacks/top?n=6")
      .then((r) => r.json())
      .then((d) => mounted && setItems(d))
      .catch(() => mounted && setError("Failed to load top stacks"));
    return () => {
      mounted = false;
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-800">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Error loading top stacks</span>
        </div>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm">Loading top stacks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Terminal Header - Not Found Style */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 border border-primary/30 p-2">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-xl sm:text-2xl text-foreground leading-tight">
              Top Technology Stacks
            </span>
          </div>
        </div>
        <span className="hidden sm:block text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
          [TOP_STACKS.LOG]
        </span>
      </div>

      {/* Stack Data Section */}
      <div className="w-full min-w-0 overflow-hidden rounded border border-border">
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs">[STACK_STATISTICS]</span>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.stack}
                className="rounded border border-border bg-muted/20 p-4"
              >
                {/* Stack Header */}
                <div className="mb-3 flex items-center justify-between rounded border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/30 bg-primary/10">
                      <span className="font-mono text-primary font-bold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {item.stack}
                      </div>
                    </div>
                  </div>
                  <div className="rounded border border-primary/30 bg-primary/10 px-3 py-1 text-primary text-sm font-bold font-mono">
                    {item.percentage}%
                  </div>
                </div>

                {/* Stack Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">→</span>
                    <span>
                      Users:{" "}
                      <code className="bg-muted px-1 rounded">
                        {formatNumber(item.users)}
                      </code>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">→</span>
                    <span>
                      Adoption Rate:{" "}
                      <code className="bg-primary/10 text-primary px-1 rounded">
                        {item.percentage}%
                      </code>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Usage Share</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-700 ease-out"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
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
