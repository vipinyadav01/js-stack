"use client";

import { Tag, ExternalLink, Package, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubRepoData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ReleasesSectionProps {
  releases: GitHubRepoData["releases"];
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

export default function ReleasesSection({ releases }: ReleasesSectionProps) {
  if (!releases || releases.length === 0) {
    return (
      <motion.div className="mb-4" variants={containerVariants}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Releases</span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            No releases
          </span>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 p-6">
          <div className="text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No releases found</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="mb-4" variants={containerVariants}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Releases</span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          {releases.length} releases
        </span>
      </div>

      <motion.div
        className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="border-border border-b px-3 py-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">🚀</span>
            <span className="font-semibold text-xs">Recent Releases</span>
          </div>
        </div>
        <div className="p-3">
          <div className="space-y-2">
            {releases.slice(0, 4).map((release, index) => (
              <motion.a
                key={release.tagName}
                href={release.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 hover:bg-muted/30 transition-all duration-200"
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    <Package className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-sm truncate">
                      {release.name || release.tagName}
                    </span>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(
                            new Date(release.publishedAt),
                            "MMM dd, yyyy",
                          )}
                        </span>
                      </div>
                      {release.prerelease && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5 text-orange-600 border-orange-200"
                        >
                          Prerelease
                        </Badge>
                      )}
                      {release.draft && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5 text-gray-600 border-gray-200"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                  <Badge variant="outline" className="text-xs font-mono">
                    {release.tagName}
                  </Badge>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </motion.a>
            ))}

            {releases.length > 4 && (
              <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                +{releases.length - 4} more releases
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
