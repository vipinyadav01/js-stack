"use client";

import { Heart, MessageCircle, Repeat2, ExternalLink, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { formatTimeAgo, type TwitterTweet } from "@/lib/sponsors-api";

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
      <div className="w-full min-w-0 overflow-hidden rounded border border-border">
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">▶</span>
            <span className="font-semibold text-xs">
              [TWEET_{String(index + 1).padStart(3, "0")}]
            </span>
          </div>
        </div>
        <div className="w-full min-w-0 overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tweet.user.avatar} alt={tweet.user.name} />
              <AvatarFallback>{tweet.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-foreground">{tweet.user.name}</span>
                {tweet.user.verified && <CheckCircle className="h-3 w-3 text-blue-500" />}
              </div>
              <span className="text-xs text-muted-foreground">@{tweet.user.username}</span>
            </div>
            <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary">
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-sm text-foreground mb-3">{tweet.text}</p>
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{tweet.engagement.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Repeat2 className="h-3 w-3" />
                <span>{tweet.engagement.retweets}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{tweet.engagement.likes}</span>
              </div>
            </div>
            <span className="font-mono">{formatTimeAgo(tweet.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}