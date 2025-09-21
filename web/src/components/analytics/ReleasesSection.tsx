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
      <motion.div className="mb-8" variants={containerVariants}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              RELEASES.LOG
            </span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            [NO_RELEASES]
          </span>
        </div>
        
        <div className="w-full min-w-0 overflow-hidden rounded border border-border p-8">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No releases found</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            RELEASES.LOG
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [{releases.length} RELEASES]
        </span>
      </div>
      
      <motion.div 
        className="w-full min-w-0 overflow-hidden rounded border border-border"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">🚀</span>
            <span className="font-semibold text-xs">
              [RECENT_RELEASES]
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {releases.slice(0, 6).map((release, index) => (
              <motion.a
                key={release.tagName}
                href={release.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Package className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-sm truncate">
                      {release.name || release.tagName}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(release.publishedAt), 'MMM dd, yyyy')}</span>
                      {release.prerelease && (
                        <>
                          <span className="text-orange-500">•</span>
                          <span className="text-orange-500">Prerelease</span>
                        </>
                      )}
                      {release.draft && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">Draft</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {release.tagName}
                  </Badge>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
            
            {releases.length > 6 && (
              <div className="text-center text-xs text-muted-foreground pt-2 border-t">
                +{releases.length - 6} more releases
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
