import { VerifiedIcon, Heart, Repeat2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

/**
 * @author: @dorian_baffier
 * @description: Tweet Card
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

interface ReplyProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
}

interface TweetCardProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string[];
  isVerified?: boolean;
  timestamp: string;
  reply?: ReplyProps;
  href: string;
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

export default function TweetCard({
  authorName,
  authorHandle,
  authorImage,
  content,
  isVerified,
  timestamp,
  reply,
  href,
  engagement,
}: TweetCardProps) {
  return (
    <Link href={href} target="_blank">
      <div
        className={cn(
          "w-full max-w-full p-1.5 rounded-2xl relative isolate overflow-hidden",
          "bg-white/5 dark:bg-black/90",
          "bg-linear-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "border border-black/10 dark:border-white/10",
          "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
          "will-change-transform translate-z-0",
        )}
      >
        <div
          className={cn(
            "w-full p-5 rounded-xl relative",
            "bg-linear-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
            "backdrop-blur-md backdrop-saturate-150",
            "border border-black/[0.05] dark:border-white/[0.08]",
            "text-black/90 dark:text-white",
            "shadow-xs",
            "will-change-transform translate-z-0",
            "before:absolute before:inset-0 before:bg-linear-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
            "hover:before:opacity-100",
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={authorImage}
                  alt={authorName}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                      {authorName}
                    </span>
                    {isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <span className="text-black dark:text-white/60 text-sm">
                    @{authorHandle}
                  </span>
                </div>
                <button
                  type="button"
                  className="h-8 w-8 text-black dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1200"
                    height="1227"
                    fill="none"
                    viewBox="0 0 1200 1227"
                    className="w-4 h-4"
                  >
                    <title>X</title>
                    <path
                      fill="currentColor"
                      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {content.map((item, index) => (
              <p
                key={index}
                className="text-black dark:text-white/90 text-base"
              >
                {item}
              </p>
            ))}
            <span className="text-black dark:text-white/50 text-sm mt-2 block">
              {timestamp}
            </span>
          </div>

          {reply && (
            <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={reply.authorImage}
                      alt={reply.authorName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                      {reply.authorName}
                    </span>
                    {reply.isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="text-black dark:text-white/60 text-sm">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-black dark:text-white/60 text-sm">
                      ·
                    </span>
                    <span className="text-black dark:text-white/60 text-sm">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="text-black dark:text-white/80 text-sm mt-1">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          )}

          {engagement && (
            <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-black/70 dark:text-white/70 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    <span>{engagement.replies}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Repeat2 className="h-4 w-4" />
                    <span>{engagement.retweets}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4" />
                    <span>{engagement.likes}</span>
                  </div>
                </div>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {timestamp}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
