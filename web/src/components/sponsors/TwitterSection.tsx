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

export default function TwitterSection({
  tweets,
  loading,
  error,
}: TwitterSectionProps) {
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <Twitter className="h-6 w-6 text-primary" />
          <div>
            <span className="font-bold text-xl sm:text-2xl">
              TWITTER_MENTIONS.LOG
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Community feedback and discussions
            </p>
          </div>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="text-muted-foreground text-sm font-medium">
          {tweets.length} {tweets.length === 1 ? "Tweet" : "Tweets"}
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Loading tweets...
              </p>
              <p className="text-sm text-muted-foreground">
                Fetching latest mentions
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3 w-fit mx-auto">
              <Twitter className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Failed to load tweets
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && tweets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full bg-muted/50 p-4 w-fit">
            <Twitter className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No posts or comments yet
          </h3>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            No recent mentions of &quot;js-stack&quot; found on Twitter. Be the
            first to share your experience with the community!
          </p>
        </div>
      )}

      {!loading && !error && tweets.length > 0 && (
        <>
          <div className="block sm:hidden">
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getResponsiveColumns(2, tweets).map((column, colIndex) => (
                <motion.div
                  key={`col-mobile-${column.length > 0 ? column[0].id : `empty-${colIndex}`}`}
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

          <div className="hidden sm:block lg:hidden">
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getResponsiveColumns(2, tweets).map((column, colIndex) => (
                <motion.div
                  key={`col-2-${column.length > 0 ? column[0].id : `empty-${colIndex}`}`}
                  className="flex min-w-0 flex-col gap-6"
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
              className="grid grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getResponsiveColumns(3, tweets).map((column, colIndex) => (
                <motion.div
                  key={`col-3-${column.length > 0 ? column[0].id : `empty-${colIndex}`}`}
                  className="flex min-w-0 flex-col gap-6"
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
