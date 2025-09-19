"use client";

import { Target, TrendingUp, Mail, ExternalLink, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PotentialSponsor {
  id: string;
  name: string;
  avatar: string;
  company: string;
  reason: string;
  estimatedAmount: number;
  priority: 'high' | 'medium' | 'low';
  lastActivity: string;
  website?: string;
  github?: string;
}

interface PotentialSponsorsSectionProps {
  // This could be extended to accept props in the future
}

export default function PotentialSponsorsSection({}: PotentialSponsorsSectionProps) {
  // Mock data for potential sponsors
  const potentialSponsors: PotentialSponsor[] = [
    {
      id: "1",
      name: "TechCorp Solutions",
      avatar: "/api/placeholder/40/40",
      company: "Enterprise Software",
      reason: "Uses js-stack for internal tooling and wants to support development",
      estimatedAmount: 1000,
      priority: 'high',
      lastActivity: "2 days ago",
      website: "https://techcorp.com",
      github: "https://github.com/techcorp"
    },
    {
      id: "2",
      name: "StartupXYZ",
      avatar: "/api/placeholder/40/40",
      company: "Early Stage Startup",
      reason: "Building their MVP with js-stack templates",
      estimatedAmount: 500,
      priority: 'medium',
      lastActivity: "1 week ago",
      website: "https://startupxyz.io"
    },
    {
      id: "3",
      name: "DevAgency Pro",
      avatar: "/api/placeholder/40/40",
      company: "Development Agency",
      reason: "Uses js-stack for client projects and wants to contribute back",
      estimatedAmount: 750,
      priority: 'high',
      lastActivity: "3 days ago",
      github: "https://github.com/devagency"
    },
    {
      id: "4",
      name: "OpenSource Foundation",
      avatar: "/api/placeholder/40/40",
      company: "Non-Profit",
      reason: "Supports open source tools that benefit the community",
      estimatedAmount: 2000,
      priority: 'high',
      lastActivity: "1 week ago",
      website: "https://opensource.org"
    },
    {
      id: "5",
      name: "EduTech Inc",
      avatar: "/api/placeholder/40/40",
      company: "Educational Technology",
      reason: "Teaching full-stack development using js-stack",
      estimatedAmount: 300,
      priority: 'medium',
      lastActivity: "2 weeks ago",
      website: "https://edutech.edu"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⭐';
      case 'low':
        return '📌';
      default:
        return '💡';
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">POTENTIAL_SPONSORS</span>
        </div>
        <div className="rounded border border-border bg-orange-500/20 px-2 py-1 text-xs text-orange-600">
          {potentialSponsors.length} LEADS
        </div>
      </div>

      <div className="space-y-3">
        {/* Potential Sponsors List */}
        <div className="space-y-3">
          {potentialSponsors.map((sponsor, index) => (
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
                    <span className="text-xs text-muted-foreground">
                      {sponsor.company}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs font-mono border", getPriorityColor(sponsor.priority))}
                  >
                    {getPriorityIcon(sponsor.priority)} {sponsor.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Sponsor Details */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">REASON FOR SPONSORSHIP</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {sponsor.reason}
                </p>
              </div>

              {/* Financial and Activity Info */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center justify-between rounded border border-border p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-mono">ESTIMATED</span>
                  </div>
                  <span className="text-xs font-mono text-foreground font-bold">
                    {formatCurrency(sponsor.estimatedAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded border border-border p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-mono">LAST SEEN</span>
                  </div>
                  <span className="text-xs font-mono text-foreground">
                    {sponsor.lastActivity}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-mono text-xs"
                >
                  <Mail className="h-3 w-3" />
                  CONTACT
                </Button>
                {sponsor.website && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-mono text-xs"
                    asChild
                  >
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
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
                      <ExternalLink className="h-3 w-3" />
                      GITHUB
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded border border-border p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-mono">TOTAL LEADS</span>
            </div>
            <span className="text-xs font-mono text-foreground font-bold">
              {potentialSponsors.length}
            </span>
          </div>
          <div className="flex items-center justify-between rounded border border-border p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span className="font-mono">POTENTIAL</span>
            </div>
            <span className="text-xs font-mono text-foreground font-bold">
              {formatCurrency(potentialSponsors.reduce((sum, sponsor) => sum + sponsor.estimatedAmount, 0))}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-foreground">AI-powered sponsor recommendations</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <TrendingUp className="h-3 w-3" />
              ANALYZE MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
