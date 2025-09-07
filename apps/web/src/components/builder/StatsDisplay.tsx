'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Star, 
  GitFork, 
  Package, 
  TrendingUp,
  Users,
  Activity,
  AlertCircle
} from 'lucide-react';
import { NPMPackageData, GitHubRepoData } from '@/services/api';

interface StatsDisplayProps {
  npmData: Record<string, NPMPackageData | null>;
  githubData: Record<string, GitHubRepoData | null>;
  stack: any;
}

export function StatsDisplay({ npmData, githubData, stack }: StatsDisplayProps) {
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalForks, setTotalForks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate totals from real data
    let downloads = 0;
    let stars = 0;
    let forks = 0;

    Object.values(npmData).forEach(data => {
      if (data) {
        downloads += data.downloads.weekly || 0;
      }
    });

    Object.values(githubData).forEach(data => {
      if (data) {
        stars += data.stars || 0;
        forks += data.forks || 0;
      }
    });

    setTotalDownloads(downloads);
    setTotalStars(stars);
    setTotalForks(forks);
  }, [npmData, githubData]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex items-center gap-3">
      {/* NPM Downloads */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg"
      >
        <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
        <div>
          <div className="text-xs text-green-600 dark:text-green-400">Downloads</div>
          <div className="text-sm font-bold text-green-900 dark:text-green-100">
            {formatNumber(totalDownloads)}/week
          </div>
        </div>
      </motion.div>

      {/* GitHub Stars */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg"
      >
        <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">Stars</div>
          <div className="text-sm font-bold text-yellow-900 dark:text-yellow-100">
            {formatNumber(totalStars)}
          </div>
        </div>
      </motion.div>

      {/* GitHub Forks */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
      >
        <GitFork className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Forks</div>
          <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
            {formatNumber(totalForks)}
          </div>
        </div>
      </motion.div>

      {/* Stack Size */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg"
      >
        <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Technologies</div>
          <div className="text-sm font-bold text-purple-900 dark:text-purple-100">
            {stack.items.length}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Detailed stats modal component
export function DetailedStats({ npmData, githubData }: Omit<StatsDisplayProps, 'stack'>) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Package Statistics</h3>
      
      <div className="space-y-4">
        {Object.entries(npmData).map(([pkg, data]) => {
          if (!data) return null;
          
          const ghData = Object.values(githubData).find(
            gh => gh?.name.toLowerCase() === pkg.toLowerCase()
          );
          
          return (
            <div key={pkg} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{data.name}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">v{data.version}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Weekly Downloads</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {data.downloads.weekly.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Monthly Downloads</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {data.downloads.monthly.toLocaleString()}
                  </div>
                </div>
                
                {ghData && (
                  <>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">GitHub Stars</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {ghData.stars.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Open Issues</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {ghData.open_issues}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {data.description && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {data.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
