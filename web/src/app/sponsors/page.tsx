"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  fetchTwitterMentions, 
  type TwitterTweet,
  type SponsorAnalytics,
  type Sponsor
} from "@/lib/sponsors-api";

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
        isSpecial: s.amount >= 500,
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
  const githubUsername = "vipinyadav01";

  // Fetch functions
  const fetchSponsorsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, analytics: true, sponsors: true }));
    setError(prev => ({ ...prev, analytics: "", sponsors: "" }));
    try {
      const response = await fetch(`/api/sponsors?username=${githubUsername}&analytics=true`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const isFallback = data?.meta?.isFallback === true;
      const realSponsors: Sponsor[] = Array.isArray(data?.sponsors) ? data.sponsors : [];
      if (!isFallback) {
        setAnalytics(data.analytics || null);
        if (realSponsors.length > 0) {
          setSponsorsData(mapSponsorsToSectionData(realSponsors));
        } else {
          setSponsorsData({ specialSponsors: [], sponsors: [], pastSponsors: [] });
        }
      } else {
        setSponsorsData({ specialSponsors: [], sponsors: [], pastSponsors: [] });
        setError(prev => ({ ...prev, sponsors: "No real sponsor data available yet." }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, analytics: err instanceof Error ? err.message : 'Unknown error', sponsors: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, analytics: false, sponsors: false }));
    }
  }, [githubUsername]);

  const fetchTweetsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, twitter: true }));
    setError(prev => ({ ...prev, twitter: "" }));
    try {
      const { tweets, meta } = await fetchTwitterMentions(twitterQuery, twitterCount);
      if (meta?.isFallback) {
        // Ignore demo tweets
        setTweets([]);
        setError(prev => ({ ...prev, twitter: "No real tweets available for this query yet." }));
      } else {
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
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [LIVE DASHBOARD]
            </span>
          </div>
        </motion.div>

        {/* Analytics Overview */}
        {analytics && (
          <AnalyticsSection analytics={analytics} />
        )}

        {/* GitHub Sponsors Section */}
        {(sponsorsData && ((sponsorsData.specialSponsors.length + sponsorsData.sponsors.length) > 0)) && (
          <motion.div className="mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <GitHubSponsorsSection sponsorsData={sponsorsData} />
            </div>
          </motion.div>
        )}

        {/* Twitter Feed Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <TwitterSection 
              tweets={tweets} 
              loading={loading.twitter} 
              error={error.twitter} 
            />
          </div>
        </motion.div>

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