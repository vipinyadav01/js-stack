"use client";

import { Globe, Star, GitFork, Eye, AlertCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubRepoData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface RepositoryMetricsSectionProps {
  githubData: GitHubRepoData;
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

export default function RepositoryMetricsSection({ githubData, formatNumber }: RepositoryMetricsSectionProps) {
  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            Repository Metrics
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          Repository information
        </span>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Repository Overview */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">📊</span>
              <span className="font-semibold text-xs">
                Repository Overview
              </span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Repository</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{githubData.info.fullName}</span>
                <a href={githubData.info.htmlUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                </a>
              </div>
            </div>
            
            {githubData.info.description && (
              <div className="text-sm text-muted-foreground">
                {githubData.info.description}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{formatNumber(githubData.info.stargazersCount)} stars</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitFork className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{formatNumber(githubData.info.forksCount)} forks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">{formatNumber(githubData.info.watchersCount)} watchers</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">{githubData.info.openIssuesCount} issues</span>
              </div>
            </div>

            {/* Topics */}
            {githubData.info.topics.length > 0 && (
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">TOPICS</div>
                <div className="flex flex-wrap gap-2">
                  {githubData.info.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Package Information */}
        <motion.div 
          className="w-full min-w-0 overflow-hidden rounded border border-border"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">📦</span>
              <span className="font-semibold text-xs">
                Package Information
              </span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <span className="font-mono text-sm">{githubData.info.language || "N/A"}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Size</span>
              <span className="font-mono text-sm">{formatNumber(githubData.info.size)} KB</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">License</span>
              <span className="font-mono text-sm">{githubData.info.license?.name || "N/A"}</span>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground mb-2">Repository Status</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Public</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
