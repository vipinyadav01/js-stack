"use client";

import { Crown, Heart, Star, Zap, ExternalLink, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SponsorshipTier {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  features: string[];
  benefits: string[];
  popular?: boolean;
}

interface SponsorshipTiersProps {
  // This could be extended to accept props in the future
}

export default function SponsorshipTiers({}: SponsorshipTiersProps) {
  const tiers: SponsorshipTier[] = [
    {
      id: "bronze",
      name: "Bronze",
      amount: 10,
      icon: <Star className="h-5 w-5" />,
      color: "border-orange-500/30 bg-orange-500/10 text-orange-600",
      description: "Support js-stack development",
      features: [
        "Your name in README.md",
        "Thank you message",
        "Community recognition"
      ],
      benefits: [
        "Early access to new features",
        "Community support priority"
      ]
    },
    {
      id: "silver", 
      name: "Silver",
      amount: 50,
      icon: <Zap className="h-5 w-5" />,
      color: "border-gray-500/30 bg-gray-500/10 text-gray-600",
      description: "Enhanced recognition and benefits",
      features: [
        "Everything in Bronze",
        "Logo on website",
        "Social media shoutout",
        "Monthly update emails"
      ],
      benefits: [
        "Feature request priority",
        "Direct communication channel",
        "Beta testing access"
      ]
    },
    {
      id: "gold",
      name: "Gold", 
      amount: 100,
      icon: <Heart className="h-5 w-5" />,
      color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
      description: "Premium sponsor benefits",
      features: [
        "Everything in Silver",
        "Prominent logo placement",
        "Dedicated sponsor page",
        "Custom badge in docs",
        "Quarterly progress reports"
      ],
      benefits: [
        "Direct developer access",
        "Custom template requests",
        "White-label solutions"
      ],
      popular: true
    },
    {
      id: "platinum",
      name: "Platinum",
      amount: 500,
      icon: <Crown className="h-5 w-5" />,
      color: "border-purple-500/30 bg-purple-500/10 text-purple-600",
      description: "Maximum visibility and impact",
      features: [
        "Everything in Gold",
        "Top banner placement",
        "Video testimonials",
        "Speaking opportunities",
        "Annual sponsor meeting"
      ],
      benefits: [
        "Strategic partnership",
        "Roadmap influence",
        "Enterprise support",
        "Custom integrations"
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">SPONSORSHIP_TIERS</span>
        </div>
        <div className="rounded border border-border bg-primary/20 px-2 py-1 text-xs text-primary">
          TIERS
        </div>
      </div>

      <div className="space-y-3">
        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <div 
              key={tier.id} 
              className={cn(
                "relative flex flex-col justify-between rounded border p-4 transition-all hover:shadow-md",
                tier.popular ? "border-primary shadow-lg scale-105" : "border-border",
                tier.color
              )}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-xs font-mono">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tier.icon}
                  <span className="font-semibold text-sm font-mono">{tier.name.toUpperCase()}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  {formatCurrency(tier.amount)}/mo
                </div>
              </div>

              {/* Tier Description */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">DESCRIPTION</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">FEATURES</p>
                <div className="space-y-1">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">BENEFITS</p>
                <div className="space-y-1">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                      <span className="text-xs text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <Button 
                  variant={tier.popular ? "default" : "outline"}
                  size="sm" 
                  className="w-full font-mono text-xs"
                >
                  <Heart className="h-3 w-3" />
                  SPONSOR NOW
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="rounded border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">SPONSORSHIP_INFO</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded border border-border p-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono">PAYMENT</span>
                </div>
                <span className="text-xs font-mono text-foreground">
                  MONTHLY
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-border p-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono">PLATFORM</span>
                </div>
                <span className="text-xs font-mono text-foreground">
                  GITHUB SPONSORS
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded border border-border p-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono">CANCELLATION</span>
                </div>
                <span className="text-xs font-mono text-foreground">
                  ANYTIME
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-border p-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono">SUPPORT</span>
                </div>
                <span className="text-xs font-mono text-foreground">
                  PRIORITY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-foreground">Support open source development</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ExternalLink className="h-3 w-3" />
              VIEW ON GITHUB
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
