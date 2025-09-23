"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  fetchTwitterMentionsPreferDemoOnLocal,
  fetchSponsorsPreferDemoOnLocal,
  type TwitterTweet,
  type SponsorAnalytics,
  type Sponsor
} from "@/lib/sponsors-api";
import { isLocalhost } from "@/lib/env";

// Import components
import AnalyticsSection from "@/components/sponsors/AnalyticsSection";
import GitHubSponsorsSection from "@/components/sponsors/GitHubSponsorsSection";
import TwitterSection from "@/components/sponsors/TwitterSection";
import CTASection from "@/components/sponsors/CTASection";
import { type SponsorsData } from "@/lib/sponsor-utils";

export default function SponsorsPage() {
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [analytics, setAnalytics] = useState<SponsorAnalytics | null>(null);
  const [sponsorsData, setSponsorsData] = useState<SponsorsData | null>(null);
  const [showTweets, setShowTweets] = useState(true);
  const [showSponsors, setShowSponsors] = useState(true);
  const [loading, setLoading] = useState({
    twitter: false,
    analytics: false,
    sponsors: false
  });
  const [error, setError] = useState({
    twitter: "",
    analytics: "",
    sponsors: "",
    global: ""
  });
  const mapSponsorsToSectionData = (sponsors: Sponsor[]): SponsorsData => {
    const toEntry = (s: Sponsor) => {
      const githubUrl = s.github || "";
      const githubId = (() => {
        try {
          const url = new URL(githubUrl);
          return url.pathname.replace(/\/+/, "").split("/")[0] || s.name;
        } catch {
          return s.name;
        }
      })();
      return {
        githubId,
        name: s.name,
        avatarUrl: s.avatar,
        tierName: s.tier,
        formattedAmount: `$${s.amount}`,
        sinceWhen: s.duration,
        githubUrl: githubUrl,
        websiteUrl: s.website,
        isSpecial: s.amount >= 300,
      };
    };
    const specialSponsors = sponsors.filter(s => s.amount >= 500).map(toEntry);
    const regularSponsors = sponsors.filter(s => s.amount < 500).map(toEntry);

    return {
      specialSponsors,
      sponsors: regularSponsors,
      pastSponsors: [],
    };
  };
  const twitterQuery = "js-stack OR from:vipinyadav9m";
  const twitterCount = 20;
  const fetchSponsorsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, analytics: true, sponsors: true }));
    setError(prev => ({ ...prev, analytics: "", sponsors: "" }));
    try {
      const isLocal = isLocalhost();
      const { sponsors, analytics, meta } = await fetchSponsorsPreferDemoOnLocal(true);
      const isFallback = meta?.isFallback === true;
      if (!isLocal && isFallback) {
        setSponsorsData({ specialSponsors: [], sponsors: [], pastSponsors: [] });
        setAnalytics(null);
        setError(prev => ({ ...prev, sponsors: "No real sponsor data available yet." }));
        return;
      }
      setAnalytics(analytics || null);
      if (Array.isArray(sponsors) && sponsors.length > 0) {
        setSponsorsData(mapSponsorsToSectionData(sponsors as Sponsor[]));
      } else {
        setSponsorsData({ specialSponsors: [], sponsors: [], pastSponsors: [] });
      }
    } catch (err) {
      setError(prev => ({ ...prev, analytics: err instanceof Error ? err.message : 'Unknown error', sponsors: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, analytics: false, sponsors: false }));
    }
  }, []);

  const fetchTweetsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, twitter: true }));
    setError(prev => ({ ...prev, twitter: "" }));
    try {
      const isLocal = isLocalhost();
      const { tweets, meta } = await fetchTwitterMentionsPreferDemoOnLocal(twitterQuery, twitterCount);
      if (meta?.isFallback) {
        if (!isLocal) {
          setTweets([]);
          setError(prev => ({ ...prev, twitter: "No real tweets available for this query yet." }));
          return;
        }
      } else {
        setTweets(tweets);
      }
      if (isLocal) {
        setTweets(tweets);
      }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  return (
    <div className="w-full max-w-full overflow-hidden px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Global Error Banner when no real data */}
        {(!loading.twitter && !loading.sponsors) && (() => {
          const sponsorsCount = (sponsorsData?.specialSponsors.length || 0) + (sponsorsData?.sponsors.length || 0);
          const noTweets = tweets.length === 0;
          const noSponsors = sponsorsCount === 0;
          if (noTweets && noSponsors) {
            return (
              <div className="mb-4 rounded border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm">
                No real sponsors or tweets found yet. Data will appear once available.
              </div>
            );
          }
          return null;
        })()}
        {/* Terminal Header */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                SPONSOR_DASHBOARD.LOG
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => setShowTweets((v) => !v)}
                className={`rounded border px-2 py-1 text-xs transition-colors ${showTweets ? 'border-primary text-primary' : 'border-border text-muted-foreground'} hover:border-primary/70`}
                aria-pressed={showTweets}
              >
                Show Tweets
              </button>
              <button
                type="button"
                onClick={() => setShowSponsors((v) => !v)}
                className={`rounded border px-2 py-1 text-xs transition-colors ${showSponsors ? 'border-primary text-primary' : 'border-border text-muted-foreground'} hover:border-primary/70`}
                aria-pressed={showSponsors}
              >
                Show Sponsors
              </button>
            </div>
          </div>
        </motion.div>
        {analytics && (
          <AnalyticsSection analytics={analytics} />
        )}

        {/* GitHub Sponsors Section */}
        {showSponsors && (sponsorsData && ((sponsorsData.specialSponsors.length + sponsorsData.sponsors.length) > 0)) && (
          <motion.div className="mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <GitHubSponsorsSection sponsorsData={sponsorsData} />
            </div>
          </motion.div>
        )}

        {/* Twitter Feed Section */}
        {showTweets && (
          <motion.div className="mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <TwitterSection 
                tweets={tweets} 
                loading={loading.twitter} 
                error={error.twitter} 
              />
            </div>
          </motion.div>
        )}

        {/* Become a Sponsor CTA */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <CTASection />
          </div>
        </motion.div>

        {/* End of File */}
        <motion.div className="mb-4 mt-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold text-lg sm:text-xl text-muted-foreground">
                END_OF_FILE
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [SPONSORS.LOG]
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}