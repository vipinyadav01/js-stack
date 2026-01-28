import React from "react";
import { Code, Zap, Rocket, Terminal } from "lucide-react";
import Link from "next/link";

export default function ProjectInt() {
  const features = [
    {
      icon: Code,
      title: "Modern Stack",
      description: "React, Next.js, Node.js, and more",
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Get started in seconds, not hours",
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Best practices built-in",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold text-lg sm:text-xl text-muted-foreground">
            FEATURES
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [FEATURES.JSON]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <feature.icon className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-base">{feature.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-base mb-1">
              Ready to build something amazing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure your perfect stack with our interactive builder
            </p>
          </div>
          <Link
            href="/new"
            className="whitespace-nowrap rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open Builder
          </Link>
        </div>
      </div>
    </section>
  );
}
