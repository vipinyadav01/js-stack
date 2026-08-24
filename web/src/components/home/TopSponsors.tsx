"use client";

import { useEffect, useState } from "react";
import { Heart, Github, Globe } from "lucide-react";
import Image from "next/image";
import { type Sponsor } from "@/lib/sponsors-api";
import { isLocalhost, demoSponsors } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";

interface TopSponsorsProps {
  repository?: string;
  limit?: number;
}

export default function TopSponsors({
  repository = "vipinyadav01",
  limit = 10,
}: TopSponsorsProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        if (isLocalhost()) {
          setTimeout(() => {
            const topSponsors = demoSponsors
              .filter((sponsor: Sponsor) => sponsor.isActive)
              .sort((a: Sponsor, b: Sponsor) => b.amount - a.amount)
              .slice(0, limit);
            setSponsors(topSponsors);
            setLoading(false);
          }, 500);
          return;
        }

        const response = await fetch(
          `/api/sponsors?username=${repository}&analytics=false`,
        );
        const data = await response.json();

        if (response.ok && data.sponsors) {
          const topSponsors = data.sponsors
            .filter((sponsor: Sponsor) => sponsor.isActive)
            .sort((a: Sponsor, b: Sponsor) => b.amount - a.amount)
            .slice(0, limit);
          setSponsors(topSponsors);
        } else {
          throw new Error("Failed to fetch sponsors");
        }
      } catch (error) {
        console.error("Error loading sponsors:", error);
        // Fallback or empty
        setSponsors([]);
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, [repository, limit]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 font-mono text-sm tracking-tight text-foreground">
          <Heart className="h-4 w-4 text-primary" />
          <span className="font-bold text-primary">PROJECT_SPONSORS</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground font-normal">sponsors.json</span>
        </div>
        <span className="w-full text-right font-mono text-muted-foreground text-xs sm:w-auto sm:text-left">
          [COMMUNITY SUPPORT]
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-muted/20"
            ></div>
          ))}
        </div>
      ) : sponsors.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold mb-2">Become a Sponsor</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Your support helps us maintain and improve JS-Stack
          </p>
          <Button asChild>
            <a
              href={`https://github.com/sponsors/${repository}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Support Project
            </a>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sponsors.map((sponsor, index) => {
              const isTopSponsor = index === 0;

              return (
                <div
                  key={sponsor.id}
                  className="relative overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
                >
                  {isTopSponsor && (
                    <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-600 px-2 py-0.5 text-[10px] font-bold uppercase rounded-bl-lg border-b border-l border-yellow-500/20">
                      Top Supporter
                    </div>
                  )}
                  <div className="p-4 flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={sponsor.avatar}
                        alt={`${sponsor.name}`}
                        width={48}
                        height={48}
                        className="rounded-full border border-border"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {sponsor.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {sponsor.tier || "Supporter"}
                      </p>

                      <div className="flex gap-2">
                        {sponsor.github && (
                          <a
                            href={sponsor.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a
                href={`https://github.com/sponsors/${repository}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart className="mr-2 h-4 w-4 text-pink-500" />
                Become a Sponsor
              </a>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
