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
    <section className="py-12">
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Heart className="h-5 w-5 text-primary fill-primary/20" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">sponsors.json</h2>
        </div>
        <p className="text-muted-foreground max-w-[600px]">
          Our generous community members who make this project possible.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-lg border border-border bg-muted/20"
            ></div>
          ))}
        </div>
      ) : sponsors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Become a Sponsor</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Your support helps us maintain and improve JS-Stack. Join the list
            of contributors!
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
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sponsors.map((sponsor, index) => {
              const isTopSponsor = index === 0;

              return (
                <div
                  key={sponsor.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300 hover:border-primary/50"
                >
                  {isTopSponsor && (
                    <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-600 px-2 py-1 text-[10px] font-bold uppercase rounded-bl-lg border-b border-l border-yellow-500/10">
                      Top Supporter
                    </div>
                  )}
                  <div className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={sponsor.avatar}
                        alt={`${sponsor.name}`}
                        width={50}
                        height={50}
                        className="rounded-full border border-border"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
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
          <div className="flex justify-center mt-8">
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
