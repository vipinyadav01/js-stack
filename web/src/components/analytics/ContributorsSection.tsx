"use client";

import { Users, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GitHubRepoData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface ContributorsSectionProps {
  contributors: GitHubRepoData["contributors"];
  formatNumber: (num: number) => string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContributorsSection({
  contributors,
  formatNumber,
}: ContributorsSectionProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <motion.div className="mb-8" variants={containerVariants}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              CONTRIBUTORS.LOG
            </span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            [NO_CONTRIBUTORS]
          </span>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded border border-border p-8">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No contributors found</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">Contributors</span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          {contributors.length} contributors
        </span>
      </div>

      <motion.div
        className="w-full min-w-0 overflow-hidden rounded border border-border"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">👥</span>
            <span className="font-semibold text-xs">Top Contributors</span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {contributors.slice(0, 8).map((contributor, index) => (
              <motion.div
                key={contributor.login}
                className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    width={32}
                    height={32}
                    className="rounded-full border border-border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {contributor.login}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(contributor.contributions)} contributions
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <a
                    href={`https://github.com/${contributor.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))}

            {contributors.length > 8 && (
              <div className="text-center text-xs text-muted-foreground pt-2 border-t">
                +{contributors.length - 8} more contributors
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
