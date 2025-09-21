"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  fetchTwitterMentions, 
  type TwitterTweet,
  type SponsorAnalytics
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
  const [loading, setLoading] = useState({
    twitter: false,
    analytics: false
  });
  const [error, setError] = useState({
    twitter: "",
    analytics: ""
  });

  // Mock GitHub sponsors data
  const mockGitHubSponsorsData: SponsorsData = {
    specialSponsors: [
      {
        githubId: "acmecorp",
        name: "Acme Corporation",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=acme",
        tierName: "Gold Sponsor",
        formattedAmount: "$500",
        sinceWhen: "6 months",
        githubUrl: "https://github.com/acmecorp",
        websiteUrl: "https://acme.com",
        isSpecial: true
      },
      {
        githubId: "techstartinc",
        name: "TechStart Inc",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstart",
        tierName: "Silver Sponsor",
        formattedAmount: "$200",
        sinceWhen: "3 months",
        githubUrl: "https://github.com/techstartinc",
        websiteUrl: "https://techstart.io",
        isSpecial: true
      }
    ],
    sponsors: [
      {
        githubId: "devtoolsllc",
        name: "DevTools LLC",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=devtools",
        tierName: "Bronze Sponsor",
        formattedAmount: "$100",
        sinceWhen: "1 month",
        githubUrl: "https://github.com/devtoolsllc",
        websiteUrl: "https://devtools.dev"
      },
      {
        githubId: "opensourcefound",
        name: "OpenSource Foundation",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=opensource",
        tierName: "Platinum Sponsor",
        formattedAmount: "$1000",
        sinceWhen: "12 months",
        githubUrl: "https://github.com/opensourcefound",
        websiteUrl: "https://opensource.org"
      },
      {
        githubId: "edutechsolutions",
        name: "EduTech Solutions",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=edutech",
        tierName: "Silver Sponsor",
        formattedAmount: "$150",
        sinceWhen: "4 months",
        githubUrl: "https://github.com/edutechsolutions",
        websiteUrl: "https://edutech.edu"
      }
    ],
    pastSponsors: [
      {
        githubId: "oldsponsor1",
        name: "Previous Sponsor",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=old1",
        tierName: "Bronze Sponsor",
        formattedAmount: "$50",
        sinceWhen: "past 2 months",
        githubUrl: "https://github.com/oldsponsor1",
        websiteUrl: "https://oldsponsor1.com"
      }
    ]
  };

  // Configuration
  const twitterQuery = "js-stack OR from:vipinyadav9m";
  const twitterCount = 20;
  const githubUsername = "vipinyadav01";

  // Fetch functions
  const fetchSponsorsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, analytics: true }));
    setError(prev => ({ ...prev, analytics: "" }));
    try {
      const response = await fetch(`/api/sponsors?username=${githubUsername}&analytics=true`);
      const data = await response.json();
      if (response.ok && data.analytics) {
        setAnalytics(data.analytics);
      } else {
        throw new Error('Failed to fetch sponsor analytics');
      }
    } catch (err) {
      setError(prev => ({ ...prev, analytics: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  }, [githubUsername]);

  const fetchTweetsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, twitter: true }));
    setError(prev => ({ ...prev, twitter: "" }));
    try {
      const { tweets } = await fetchTwitterMentions(twitterQuery, twitterCount);
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
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <GitHubSponsorsSection sponsorsData={mockGitHubSponsorsData} />
          </div>
        </motion.div>

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