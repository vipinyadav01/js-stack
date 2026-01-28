"use client";

import { type TwitterTweet } from "@/lib/sponsors-api";
import KokonutTweetCard from "@/components/kokonutui/tweet-card";

interface TweetCardProps {
  tweet: TwitterTweet;
  index: number;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  return (
    <div className="w-full min-w-0">
      <KokonutTweetCard
        authorName={tweet.user.name}
        authorHandle={tweet.user.username}
        authorImage={tweet.user.avatar}
        isVerified={tweet.user.verified}
        content={tweet.text.split(/\n+/).filter(Boolean)}
        timestamp={tweet.timestamp}
        href={tweet.url}
        engagement={{
          likes: tweet.engagement.likes,
          retweets: tweet.engagement.retweets,
          replies: tweet.engagement.replies,
        }}
      />
    </div>
  );
}
