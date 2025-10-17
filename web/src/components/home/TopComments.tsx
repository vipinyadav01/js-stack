"use client";

import { useEffect, useState } from "react";
import { Twitter, MessageCircle } from "lucide-react";
import { fetchTwitterMentions, type TwitterTweet } from "@/lib/sponsors-api";
import { isLocalhost, demoTweets } from "@/lib/demo-data";
import TweetCard from "@/components/sponsors/TweetCard";
import { motion, AnimatePresence } from "framer-motion";

interface TopCommentsProps {
  repository?: string;
  limit?: number;
}

export default function TopComments({
  repository = "js-stack",
  limit = 10,
}: TopCommentsProps) {
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTweets = async () => {
      try {
        // Use demo data on localhost
        if (isLocalhost()) {
          const topTweets = demoTweets
            .sort(
              (a, b) =>
                b.engagement.likes +
                b.engagement.retweets -
                (a.engagement.likes + a.engagement.retweets),
            )
            .slice(0, limit);
          setTweets(topTweets);
          setLoading(false);
          return;
        }

        const { tweets } = await fetchTwitterMentions(repository, limit);
        // Get top tweets by engagement (likes + retweets)
        const topTweets = tweets
          .sort(
            (a, b) =>
              b.engagement.likes +
              b.engagement.retweets -
              (a.engagement.likes + a.engagement.retweets),
          )
          .slice(0, limit);
        setTweets(topTweets);
      } catch (error) {
        console.error("Error loading tweets:", error);
        // Set empty array when there's an error
        setTweets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTweets();
  }, [repository, limit]);

  if (loading) {
    return (
      <div className="rounded border border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">TOP_COMMENTS</span>
          </div>
          <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
            LOADING
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-sm">
            Loading comments...
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Top Comments</h3>
              <p className="text-sm text-muted-foreground">
                Community feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <Twitter className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">
              {tweets.length}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tweets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-muted/30 p-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-2 font-medium">
                No mentions found
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                No recent mentions found for{" "}
                <span className="font-mono text-primary">{repository}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Be the first to share your experience on Twitter!
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tweets"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {tweets.map((tweet, index) => (
                <TweetCard key={tweet.id} tweet={tweet} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          className="mt-6 pt-4 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <a
            href={`https://twitter.com/search?q=${repository} OR from:vipinyadav9m`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:shadow-primary/20"
          >
            <Twitter className="h-4 w-4 transition-transform group-hover/cta:scale-110" />
            <span>View More on Twitter</span>
            <MessageCircle className="h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
