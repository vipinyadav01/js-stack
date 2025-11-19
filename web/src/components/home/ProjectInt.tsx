import React from "react";
import { Terminal, Code, Zap, Rocket } from "lucide-react";
import Link from "next/link";

export default function ProjectInt() {
  const features = [
    {
      icon: Code,
      title: "Modern Stack",
      description: "React, Next.js, Node.js, and more",
      color: "text-blue-500",
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Get started in seconds, not hours",
      color: "text-yellow-500",
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Best practices built-in",
      color: "text-green-500",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
              Quick Integration
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Everything you need to get started
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-lg bg-primary/10 p-2 ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base">{feature.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-blue-500/5 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Ready to build something amazing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Use our interactive builder to configure your perfect stack
            </p>
          </div>
          <Link
            href="/new"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            Open Stack Builder
          </Link>
        </div>
      </div>
    </section>
  );
}
