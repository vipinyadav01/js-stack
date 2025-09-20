"use client";

import { Users, ExternalLink, Github, Globe, RefreshCw, AlertCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Sponsor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  tier: string;
  duration: string;
  frequency: 'one-time' | 'monthly' | 'yearly';
  startDate: string;
  website?: string;
  github?: string;
}

interface CurrentSponsorsSectionProps {
  sponsors: Sponsor[];
  loading: boolean;
  error: string;
}

export default function CurrentSponsorsSection({ sponsors, loading, error }: CurrentSponsorsSectionProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return '💳';
      case 'monthly':
        return '📅';
      case 'yearly':
        return '🗓️';
      default:
        return '💰';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return 'ONE-TIME';
      case 'monthly':
        return 'MONTHLY';
      case 'yearly':
        return 'YEARLY';
      default:
        return 'SPONSOR';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'monthly':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'yearly':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };


  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return '💎';
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '⭐';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'silver':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'bronze':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">CURRENT_SPONSORS</span>
        </div>
        <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
          {sponsors.length} ACTIVE
        </div>
      </div>

      <div className="space-y-3">
        {/* Error State */}
        {error && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">Error loading sponsors: {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="h-4 w-4 text-primary animate-spin" />
              <span className="text-foreground">Loading sponsor data...</span>
            </div>
          </div>
        )}

        {/* Sponsors Grid */}
        {!loading && !error && sponsors.length > 0 && (
          <div className="space-y-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="rounded border border-border p-3 hover:bg-muted/5 transition-colors">
                {/* Sponsor Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
                      <AvatarFallback className="text-xs font-mono">
                        {sponsor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {sponsor.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-mono border", getTierColor(sponsor.tier))}
                        >
                          {getTierIcon(sponsor.tier)} {sponsor.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-foreground">
                      {formatCurrency(sponsor.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {sponsor.frequency === 'one-time' ? '' : 
                       sponsor.frequency === 'monthly' ? '/mo' : 
                       sponsor.frequency === 'yearly' ? '/yr' : ''}
                    </span>
                  </div>
                </div>

                {/* Sponsor Details */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="flex items-center justify-between rounded border border-border p-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-mono">FREQUENCY</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs font-mono border", getFrequencyColor(sponsor.frequency))}
                    >
                      {getFrequencyIcon(sponsor.frequency)} {getFrequencyLabel(sponsor.frequency)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded border border-border p-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-mono">DURATION</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">
                      {sponsor.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded border border-border p-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-mono">STATUS</span>
                    </div>
                    <span className="text-xs font-mono text-green-600">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Sponsor Links */}
                <div className="flex items-center gap-2">
                  {sponsor.website && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono text-xs"
                      asChild
                    >
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3 w-3" />
                        WEBSITE
                      </a>
                    </Button>
                  )}
                  {sponsor.github && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono text-xs"
                      asChild
                    >
                      <a href={sponsor.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3" />
                        GITHUB
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sponsors.length === 0 && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No active sponsors found</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-foreground">Supporting js-stack development</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ExternalLink className="h-3 w-3" />
              VIEW ALL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
