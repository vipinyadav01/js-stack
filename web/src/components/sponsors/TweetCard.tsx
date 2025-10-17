"use client";

import { motion } from "framer-motion";
import { type TwitterTweet } from "@/lib/sponsors-api";
import KokonutTweetCard from "@/components/kokonutui/tweet-card";

interface TweetCardProps {
  tweet: TwitterTweet;
  index: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TweetCard({ tweet, index }: TweetCardProps) {
  return (
    <motion.div
      className="w-full min-w-0"
      variants={itemVariants}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
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
    </motion.div>
  );
}
