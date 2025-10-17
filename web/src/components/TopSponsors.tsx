"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Github, Globe } from "lucide-react";
import Image from "next/image";
import { type Sponsor } from "@/lib/sponsors-api";

interface TopSponsorsProps {
  repository?: string; // GitHub username or repository owner
  limit?: number; // Number of top sponsors to show
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
        // Fetch sponsors from the specified repository
        const response = await fetch(
          `/api/sponsors?username=${repository}&analytics=false`,
        );
        const data = await response.json();

        if (response.ok && data.sponsors) {
          // Get top sponsors by amount from the specified repository
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
        // For testing: Add mock data when GitHub Sponsors is not set up
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

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "gold":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "silver":
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
      case "bronze":
        return "bg-orange-500/20 text-orange-600 border-orange-500/30";
      default:
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="rounded border border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">TOP_SPONSORS</span>
          </div>
          <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
            LOADING
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-sm">
            Loading sponsors...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">TOP_SPONSORS</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {sponsors.length}
        </div>
      </div>

      {sponsors.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="text-muted-foreground text-sm mb-2">
            No sponsors found
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            No active sponsors found for{" "}
            <span className="font-mono text-primary">{repository}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Be the first to support this project!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor, index) => (
            <div key={sponsor.id} className="rounded border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src={sponsor.avatar}
                    alt={sponsor.name}
                    width={48}
                    height={48}
                    className="rounded border border-border"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {sponsor.name}
                    </h3>
                    {index < 3 && <Star className="h-3 w-3 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getTierColor(sponsor.tier)}`}
                    >
                      {sponsor.tier}
                    </span>
                    <span className="text-primary text-xs font-mono">
                      ${sponsor.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sponsor.github && (
                      <a
                        href={sponsor.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="h-3 w-3" />
                      </a>
                    )}
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={`https://github.com/sponsors/${repository}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-primary hover:text-accent transition-colors text-sm"
        >
          <Heart className="h-4 w-4" />
          <span>Become a Sponsor</span>
        </a>
      </div>
    </div>
  );
}
