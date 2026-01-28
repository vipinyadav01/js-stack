"use client";

import { useEffect, useState } from "react";
import { Twitter, MessageCircle } from "lucide-react";
import { fetchTwitterMentions, type TwitterTweet } from "@/lib/sponsors-api";
import { isLocalhost, demoTweets } from "@/lib/demo-data";
import TweetCard from "@/components/sponsors/TweetCard";

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
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="font-bold text-lg sm:text-xl text-muted-foreground">
              COMMUNITY_FEEDBACK
            </span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            [FEEDBACK.JSON]
          </span>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-sm">
            Loading comments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold text-lg sm:text-xl text-muted-foreground">
            COMMUNITY_FEEDBACK
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [FEEDBACK.JSON]
        </span>
      </div>

      {tweets.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-muted p-3">
              <MessageCircle className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            No mentions found
          </div>
          <div className="text-xs text-muted-foreground">
            Be the first to share your experience on Twitter!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tweets.map((tweet, index) => (
            <TweetCard key={tweet.id} tweet={tweet} index={index} />
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={`https://twitter.com/search?q=${repository} OR from:vipinyadav9m`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Twitter className="h-4 w-4" />
          <span>View More on Twitter</span>
        </a>
      </div>
    </div>
  );
}
