"use client";

import { useEffect, useState } from "react";
import { Heart, Github, Globe, Star, Terminal } from "lucide-react";
import Image from "next/image";
import { type Sponsor } from "@/lib/sponsors-api";
import { isLocalhost, demoSponsors } from "@/lib/demo-data";

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
        // Use demo data on localhost
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
        if (repository === "vipinyadav01") {
          const mockSponsors: Sponsor[] = [
            {
              id: "mock-1",
              name: "Community Supporter",
              avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=supporter1",
              amount: 25,
              tier: "Bronze",
              duration: "1 month",
              frequency: "monthly" as const,
              startDate: "2025-01-01",
              website: "https://example.com",
              github: "https://github.com/supporter1",
              isActive: true,
            },
          ];
          setSponsors(mockSponsors);
        } else {
          setSponsors([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, [repository, limit]);

  if (loading) {
    return (
      <div className="">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg sm:text-xl">SPONSORS_DATA</span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">[LOADING...]</span>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded border border-border">
                <div className="border-border border-b px-3 py-2">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 bg-muted rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-16 bg-muted/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">SPONSORS_DATA</span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            [{sponsors.length} RECORDS]
          </span>
        </div>
      </div>

      {sponsors.length === 0 ? (
        <div className="space-y-4">
          <div className="rounded border border-border p-8">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="text-muted-foreground">
                  NO_SPONSORS_FOUND.NULL
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">
                  Be the first to support this project!
                </span>
              </div>
            </div>
          </div>
          <div className="rounded border border-border p-4">
            <a
              href={`https://github.com/sponsors/${repository}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-primary transition-colors hover:text-accent"
            >
              <Heart className="h-4 w-4" />
              <span>BECOME_SPONSOR.SH</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sponsors.map((sponsor, index) => {
                const isTopSponsor = index === 0;

                return (
                  <div
                    key={sponsor.id}
                    className="rounded border border-border"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="border-border border-b px-3 py-2">
                      <div className="flex items-center gap-2">
                        {isTopSponsor ? (
                          <Star className="h-4 w-4 text-yellow-500/90" />
                        ) : (
                          <span className="text-primary text-xs">▶</span>
                        )}
                        <div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
                          {isTopSponsor && <span>TOP</span>}
                          {isTopSponsor && <span>•</span>}
                          <span>{sponsor.frequency.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={sponsor.avatar}
                            alt={`${sponsor.name} - Sponsor avatar`}
                            width={100}
                            height={100}
                            className="rounded border border-border transition-colors duration-300"
                            loading="lazy"
                            unoptimized
                          />
                        </div>
                        <div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between py-2">
                          <div>
                            <h3 className="truncate font-semibold text-foreground text-sm">
                              {sponsor.name}
                            </h3>
                            {sponsor.tier && (
                              <p className="text-primary text-xs">
                                {sponsor.tier}
                              </p>
                            )}
                            <p className="text-muted-foreground text-xs">
                              ${sponsor.amount}/{sponsor.frequency}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            {sponsor.github && (
                              <a
                                href={sponsor.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
                              >
                                <Github className="size-3" />
                                <span className="truncate">GitHub</span>
                              </a>
                            )}
                            {sponsor.website && (
                              <a
                                href={sponsor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
                              >
                                <Globe className="size-3" />
                                <span className="truncate">Website</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded border border-border p-4">
            <a
              href={`https://github.com/sponsors/${repository}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-primary transition-colors hover:text-accent"
            >
              <Heart className="h-4 w-4" />
              <span>SUPPORT_PROJECT.SH</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
