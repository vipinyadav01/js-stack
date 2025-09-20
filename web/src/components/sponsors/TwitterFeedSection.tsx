"use client";

import { Twitter, Heart, MessageCircle, Repeat2, ExternalLink, RefreshCw, AlertCircle, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TwitterTweet {
  id: string;
  text: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
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
  isFallback?: boolean;
}

export default function TwitterFeedSection({ tweets, loading, error, isFallback = false }: TwitterFeedSectionProps) {
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
        <div className="flex items-center gap-2">
          {isFallback && (
            <div className="rounded border border-orange-500/30 bg-orange-500/20 px-2 py-1 text-xs text-orange-600">
              DEMO DATA
            </div>
          )}
          <div className="rounded border border-border bg-blue-500/20 px-2 py-1 text-xs text-blue-600">
            LIVE FEED
          </div>
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

        {/* Tweets - Twitter-like Design */}
        {!loading && !error && tweets.length > 0 && (
          <div className="space-y-1">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="group relative border-b border-border/50 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                {/* Tweet Header - Twitter Style */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={tweet.user.avatar} alt={tweet.user.name} />
                    <AvatarFallback className="text-xs font-medium">
                      {tweet.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {tweet.user.name}
                      </span>
                      {tweet.user.verified && (
                        <Verified className="h-3 w-3 text-blue-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-muted-foreground truncate">
                        @{tweet.user.username}
                      </span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {tweet.timestamp}
                      </span>
                      <a 
                        href={tweet.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>

                    {/* Tweet Content */}
                    <div className="mb-3">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {tweet.text}
                      </p>
                    </div>

                    {/* Tweet Actions - Twitter Style */}
                    <div className="flex items-center justify-between max-w-md">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors group/action">
                        <MessageCircle className="h-4 w-4 group-hover/action:scale-110 transition-transform" />
                        <span className="text-xs">
                          {formatEngagement(tweet.engagement.replies)}
                        </span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-500 transition-colors group/action">
                        <Repeat2 className="h-4 w-4 group-hover/action:scale-110 transition-transform" />
                        <span className="text-xs">
                          {formatEngagement(tweet.engagement.retweets)}
                        </span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors group/action">
                        <Heart className="h-4 w-4 group-hover/action:scale-110 transition-transform" />
                        <span className="text-xs">
                          {formatEngagement(tweet.engagement.likes)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tweets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Twitter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts or comments yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No recent mentions of &quot;js-stack&quot; found on Twitter. Be the first to share your experience with the community!
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between rounded border border-border p-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Twitter className="h-4 w-4 text-primary" />
            <span className="text-foreground">Top {tweets.length} recent mentions of js-stack</span>
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