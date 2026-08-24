"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Heart } from "lucide-react";
import { motion } from "framer-motion";
import {
  fetchTwitterMentionsPreferDemoOnLocal,
  fetchSponsorsPreferDemoOnLocal,
  type TwitterTweet,
  type SponsorAnalytics,
  type Sponsor,
} from "@/lib/sponsors-api";
import { isLocalhost } from "@/lib/env";
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
    sponsors: false,
  });
  const [error, setError] = useState<{
    twitter?: string;
    analytics?: string;
    sponsors?: string;
    global?: string;
  }>({});
  const [notice, setNotice] = useState({
    twitter: "",
    sponsors: "",
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
    const specialSponsors = sponsors
      .filter((s) => s.amount >= 500)
      .map(toEntry);
    const regularSponsors = sponsors.filter((s) => s.amount < 500).map(toEntry);

    return {
      specialSponsors,
      sponsors: regularSponsors,
      pastSponsors: [],
    };
  };
  const twitterQuery = "js-stack OR from:vipinyadav9m";
  const twitterCount = 20;
  const fetchSponsorsData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, analytics: true, sponsors: true }));
    setError((prev) => ({ ...prev, analytics: "", sponsors: "" }));
    try {
      const isLocal = isLocalhost();
      const { sponsors, analytics, meta } =
        await fetchSponsorsPreferDemoOnLocal(true);
      const isFallback = meta?.isFallback === true;
      if (!isLocal && isFallback) {
        setSponsorsData({
          specialSponsors: [],
          sponsors: [],
          pastSponsors: [],
        });
        setAnalytics(null);
        setNotice((prev) => ({
          ...prev,
          sponsors: "Sponsor data will appear here once available.",
        }));
        return;
      }
      setAnalytics(analytics || null);
      if (Array.isArray(sponsors) && sponsors.length > 0) {
        setSponsorsData(mapSponsorsToSectionData(sponsors as Sponsor[]));
      } else {
        setSponsorsData({
          specialSponsors: [],
          sponsors: [],
          pastSponsors: [],
        });
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        analytics: err instanceof Error ? err.message : "Unknown error",
        sponsors: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, analytics: false, sponsors: false }));
    }
  }, []);

  const fetchTweetsData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, twitter: true }));
    setError((prev) => ({ ...prev, twitter: "" }));
    try {
      const isLocal = isLocalhost();
      const { tweets, meta } = await fetchTwitterMentionsPreferDemoOnLocal(
        twitterQuery,
        twitterCount,
      );
      if (meta?.isFallback) {
        if (!isLocal) {
          setTweets([]);
          setNotice((prev) => ({
            ...prev,
            twitter: "Tweets will appear here once available.",
          }));
          return;
        }
      } else {
        setTweets(tweets);
      }
      if (isLocal) {
        setTweets(tweets);
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        twitter: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, twitter: false }));
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
    <div className="w-full max-w-full overflow-hidden pb-12">
      {/* Top Hero Header */}
      <div className="border-b border-border/50 bg-background dark:bg-[#090a0f] relative overflow-hidden mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SPONSORSHIP_ENGINE // OPEN_COLLECTIVE
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-mono">
                Sponsor<span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Community support, GitHub sponsors, and real-time community engagement telemetry.
              </p>
            </div>

            {/* Section Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTweets((v) => !v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition-all duration-200 ${
                  showTweets
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
                aria-pressed={showTweets}
              >
                [ TWEETS ]
              </button>
              <button
                type="button"
                onClick={() => setShowSponsors((v) => !v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition-all duration-200 ${
                  showSponsors
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
                aria-pressed={showSponsors}
              >
                [ SPONSORS ]
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pt-12 lg:pb-36">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Global Notice when no real data */}
          {!loading.twitter &&
            !loading.sponsors &&
            (() => {
              const sponsorsCount =
                (sponsorsData?.specialSponsors.length || 0) +
                (sponsorsData?.sponsors.length || 0);
              const noTweets = tweets.length === 0;
              const noSponsors = sponsorsCount === 0;
              if (noTweets && noSponsors) {
                return (
                  <div className="rounded-lg border border-border/60 bg-[#0d0d0d] p-4 text-muted-foreground text-xs font-mono">
                    {notice.sponsors ||
                      notice.twitter ||
                      "Content will appear here once available."}
                  </div>
                );
              }
              return null;
            })()}

          {analytics && <AnalyticsSection analytics={analytics} />}

          {/* GitHub Sponsors Section */}
          {showSponsors && sponsorsData && (
            <motion.div variants={containerVariants}>
              <GitHubSponsorsSection sponsorsData={sponsorsData} />
            </motion.div>
          )}

          {/* Twitter Feed Section */}
          {showTweets && (
            <motion.div variants={containerVariants}>
              <TwitterSection
                tweets={tweets}
                loading={loading.twitter}
                error={error.twitter || ""}
              />
            </motion.div>
          )}

          {/* Become a Sponsor CTA */}
          <motion.div variants={containerVariants}>
            <CTASection />
          </motion.div>

          {/* End of File */}
          <motion.div className="pt-4" variants={containerVariants}>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap border-t border-border/50 pt-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  EOF // SPONSORS_COMPLETE
                </span>
              </div>
              <span className="text-muted-foreground font-mono text-xs">
                [SPONSORS.LOG]
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
