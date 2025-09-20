"use client";

import { Twitter, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import TweetCard from "./TweetCard";
import { type TwitterTweet } from "@/lib/sponsors-api";

interface TwitterSectionProps {
  tweets: TwitterTweet[];
  loading: boolean;
  error: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const columnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function TwitterSection({ tweets, loading, error }: TwitterSectionProps) {
  const getResponsiveColumns = <T,>(numCols: number, items: T[]): T[][] => {
    const columns: T[][] = Array(numCols)
      .fill(null)
      .map(() => []);

    items.forEach((item, index) => {
      const colIndex = index % numCols;
      columns[colIndex].push(item);
    });

    return columns;
  };

  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Twitter className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            TWITTER_MENTIONS.LOG
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [{tweets.length} TWEETS]
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading tweets...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <span className="text-destructive">Error: {error}</span>
        </div>
      )}

      {!loading && !error && tweets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Twitter className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts or comments yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No recent mentions of &quot;js-stack&quot; found on Twitter. Be the first to share your experience with the community!
          </p>
        </div>
      )}

      {!loading && !error && tweets.length > 0 && (
        <>
          <div className="block sm:hidden">
            <motion.div
              className="flex flex-col gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tweets.map((tweet, index) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          <div className="hidden sm:block lg:hidden">
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getResponsiveColumns(2, tweets).map((column, colIndex) => (
                <motion.div
                  key={`col-2-${column.length > 0 ? column[0].id : `empty-${colIndex}`}`}
                  className="flex min-w-0 flex-col gap-4"
                  variants={columnVariants}
                >
                  {column.map((tweet: TwitterTweet, tweetIndex: number) => {
                    const globalIndex = colIndex + tweetIndex * 2;
                    return (
                      <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        index={globalIndex}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <motion.div
              className="grid grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getResponsiveColumns(3, tweets).map((column, colIndex) => (
                <motion.div
                  key={`col-3-${column.length > 0 ? column[0].id : `empty-${colIndex}`}`}
                  className="flex min-w-0 flex-col gap-4"
                  variants={columnVariants}
                >
                  {column.map((tweet: TwitterTweet, tweetIndex: number) => {
                    const globalIndex = colIndex + tweetIndex * 3;
                    return (
                      <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        index={globalIndex}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
