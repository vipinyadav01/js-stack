"use client";

import { useEffect, useState } from "react";
import { Twitter, MessageCircle, Heart, Repeat, Reply } from "lucide-react";
import Image from "next/image";
import { fetchTwitterMentions, type TwitterTweet } from "@/lib/sponsors-api";

interface TopCommentsProps {
  repository?: string; 
  limit?: number;
}

export default function TopComments({ repository = "js-stack", limit = 10 }: TopCommentsProps) {
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTweets = async () => {
      try {
        const { tweets } = await fetchTwitterMentions(repository, limit);
        // Get top tweets by engagement (likes + retweets)
        const topTweets = tweets
          .sort((a, b) => (b.engagement.likes + b.engagement.retweets) - (a.engagement.likes + a.engagement.retweets))
          .slice(0, limit);
        setTweets(topTweets);
      } catch (error) {
        console.error('Error loading tweets:', error);
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
          <div className="text-muted-foreground text-sm">Loading comments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">TOP_COMMENTS</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {tweets.length}
        </div>
      </div>

      {tweets.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="text-muted-foreground text-sm mb-2">No mentions found</div>
          <div className="text-xs text-muted-foreground mb-4">
            No recent mentions found for <span className="font-mono text-primary">{repository}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Be the first to share your experience on Twitter!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="rounded border border-border p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src={tweet.user.avatar}
                    alt={tweet.user.name}
                    width={40}
                    height={40}
                    className="rounded border border-border"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm text-foreground">
                      {tweet.user.name}
                    </h4>
                    {tweet.user.verified && (
                      <div className="text-blue-500 text-xs">✓</div>
                    )}
                    <span className="text-muted-foreground text-xs">
                      @{tweet.user.username}
                    </span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">
                      {tweet.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {tweet.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Heart className="h-3 w-3" />
                      <span>{tweet.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Repeat className="h-3 w-3" />
                      <span>{tweet.engagement.retweets}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Reply className="h-3 w-3" />
                      <span>{tweet.engagement.replies}</span>
                    </div>
                    <a
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-primary hover:text-accent transition-colors"
                    >
                      <Twitter className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={`https://twitter.com/search?q=${repository} OR from:vipinyadav9m`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-primary hover:text-accent transition-colors text-sm"
        >
          <Twitter className="h-4 w-4" />
          <span>View More on Twitter</span>
        </a>
      </div>
    </div>
  );
}
