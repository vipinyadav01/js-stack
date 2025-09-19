"use client";

import { Twitter, Heart, MessageCircle, Repeat2, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TwitterTweet {
  id: string;
  text: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  timestamp: string;
  url: string;
}

interface TwitterFeedSectionProps {
  tweets: TwitterTweet[];
  loading: boolean;
  error: string;
}

export default function TwitterFeedSection({ tweets, loading, error }: TwitterFeedSectionProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatEngagement = (count: number) => {
    return count > 0 ? formatNumber(count) : "0";
  };

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Twitter className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">TWITTER_MENTIONS</span>
        </div>
        <div className="rounded border border-border bg-blue-500/20 px-2 py-1 text-xs text-blue-600">
          LIVE FEED
        </div>
      </div>

      <div className="space-y-3">
        {/* Error State */}
        {error && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">Error loading tweets: {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="h-4 w-4 text-primary animate-spin" />
              <span className="text-foreground">Loading recent mentions...</span>
            </div>
          </div>
        )}

        {/* Tweets */}
        {!loading && !error && tweets.length > 0 && (
          <div className="space-y-3">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="rounded border border-border p-3 hover:bg-muted/5 transition-colors">
                {/* Tweet Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={tweet.user.avatar} alt={tweet.user.name} />
                      <AvatarFallback className="text-xs">
                        {tweet.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {tweet.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{tweet.user.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {tweet.timestamp}
                    </span>
                    <a 
                      href={tweet.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Tweet Content */}
                <div className="mb-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    {tweet.text}
                  </p>
                </div>

                {/* Tweet Engagement */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span className="font-mono">{formatEngagement(tweet.engagement.replies)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Repeat2 className="h-3 w-3" />
                    <span className="font-mono">{formatEngagement(tweet.engagement.retweets)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    <span className="font-mono">{formatEngagement(tweet.engagement.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tweets.length === 0 && (
          <div className="rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No recent mentions found</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            <Twitter className="h-4 w-4 text-primary" />
            <span className="text-foreground">Top 20 recent mentions of js-stack</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <Twitter className="h-3 w-3" />
              VIEW MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
