"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Heart, Twitter, Github, Users, TrendingUp, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TwitterFeedSection from "@/components/sponsors/TwitterFeedSection";
import CurrentSponsorsSection from "@/components/sponsors/CurrentSponsorsSection";
import PotentialSponsorsSection from "@/components/sponsors/PotentialSponsorsSection";
import SponsorshipTiers from "@/components/sponsors/SponsorshipTiers";
import { cn } from "@/lib/utils";
import { 
  fetchSponsors, 
  fetchTwitterMentions, 
  formatCurrency, 
  formatNumber,
  type Sponsor,
  type TwitterTweet,
  type SponsorAnalytics
} from "@/lib/sponsors-api";

// Component state interfaces

export default function SponsorsPage() {
  // State management
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [analytics, setAnalytics] = useState<SponsorAnalytics | null>(null);
  const [loading, setLoading] = useState({
    sponsors: false,
    twitter: false,
    analytics: false
  });
  const [error, setError] = useState({
    sponsors: "",
    twitter: "",
    analytics: ""
  });

  // Configuration
  const twitterQuery = "js-stack";
  const twitterCount = 20;

  // Fetch functions
  const fetchSponsorsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, sponsors: true }));
    setError(prev => ({ ...prev, sponsors: "" }));
    try {
      const { sponsors, analytics } = await fetchSponsors(true);
      setSponsors(sponsors);
      setAnalytics(analytics);
    } catch (err) {
      setError(prev => ({ ...prev, sponsors: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, sponsors: false }));
    }
  }, []);

  const fetchTweetsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, twitter: true }));
    setError(prev => ({ ...prev, twitter: "" }));
    try {
      const tweets = await fetchTwitterMentions(twitterQuery, twitterCount);
      setTweets(tweets);
    } catch (err) {
      setError(prev => ({ ...prev, twitter: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, twitter: false }));
    }
  }, [twitterQuery, twitterCount]);

  // Load data on component mount
  useEffect(() => {
    fetchSponsorsData();
    fetchTweetsData();
  }, [fetchSponsorsData, fetchTweetsData]);


  return (
    <div className="mx-auto min-h-svh max-w-[1280px]">
      <main className="mx-auto px-4 pt-12">
        {/* Terminal Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                SPONSORS_DASHBOARD.TXT
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-xs">
              [SPONSORSHIP OVERVIEW]
            </span>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">TOTAL_REVENUE</span>
                </div>
                <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                  ACTIVE
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-mono text-lg font-bold">{formatCurrency(analytics.totalAmount)}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    MONTHLY
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">TOTAL_SPONSORS</span>
                </div>
                <div className="rounded border border-border bg-blue-500/20 px-2 py-1 text-xs text-blue-600">
                  COUNT
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-mono text-lg font-bold">{analytics.totalSponsors}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    SPONSORS
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">GROWTH_RATE</span>
                </div>
                <div className="rounded border border-border bg-yellow-500/20 px-2 py-1 text-xs text-yellow-600">
                  TRENDING
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-mono text-lg font-bold">+{analytics.monthlyGrowth}%</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    MONTHLY
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">TOP_TIER</span>
                </div>
                <div className="rounded border border-border bg-purple-500/20 px-2 py-1 text-xs text-purple-600">
                  PREMIUM
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-mono text-lg font-bold">{analytics.topTier}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    TIER
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Controls */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10" onClick={fetchSponsorsData}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm">REFRESH_SPONSORS</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                {loading.sponsors ? "LOADING" : "READY"}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className={`h-4 w-4 text-primary ${loading.sponsors ? 'animate-spin' : ''}`} />
                  <span className="text-foreground">Update sponsor data from GitHub</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  FETCH
                </div>
              </div>
            </div>
          </div>

          <div className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-colors hover:bg-muted/10" onClick={fetchTweetsData}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm">REFRESH_TWITTER</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                {loading.twitter ? "LOADING" : "READY"}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className={`h-4 w-4 text-primary ${loading.twitter ? 'animate-spin' : ''}`} />
                  <span className="text-foreground">Update Twitter mentions</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  FETCH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              SPONSORSHIP_SECTIONS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [SPONSOR DASHBOARD]
          </span>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
            <TabsTrigger value="sponsors">SPONSORS</TabsTrigger>
            <TabsTrigger value="twitter">TWITTER</TabsTrigger>
            <TabsTrigger value="tiers">TIERS</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrentSponsorsSection sponsors={sponsors} loading={loading.sponsors} error={error.sponsors} />
              <TwitterFeedSection tweets={tweets} loading={loading.twitter} error={error.twitter} />
            </div>
            <SponsorshipTiers />
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <CurrentSponsorsSection sponsors={sponsors} loading={loading.sponsors} error={error.sponsors} />
            <PotentialSponsorsSection />
          </TabsContent>

          {/* Twitter Tab */}
          <TabsContent value="twitter" className="space-y-6">
            <TwitterFeedSection tweets={tweets} loading={loading.twitter} error={error.twitter} />
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <SponsorshipTiers />
          </TabsContent>
        </Tabs>

        {/* Become a Sponsor CTA */}
        <div className="mt-12 rounded border border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">BECOME_A_SPONSOR</span>
            </div>
            <div className="rounded border border-border bg-primary/20 px-2 py-1 text-xs text-primary">
              CALL_TO_ACTION
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded border border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">SPONSORSHIP_OPPORTUNITIES</div>
              <div className="text-sm text-foreground mb-4">
                Support js-stack development and get featured recognition across our platforms. 
                Help us build the best full-stack development tool for the community.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" className="font-mono">
                  <Heart className="h-4 w-4" />
                  SPONSOR ON GITHUB
                </Button>
                <Button variant="outline" className="font-mono">
                  <ExternalLink className="h-4 w-4" />
                  LEARN MORE
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* End of File */}
        <div className="mb-4 mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg sm:text-xl text-muted-foreground">
                END_OF_FILE
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-xs">
              [SPONSORS]
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
