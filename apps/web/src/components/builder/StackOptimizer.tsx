import React from 'react';
import type { StackConfig } from '@/lib/stack-logic';
import type { NPMPackageData, GitHubRepoData } from '@/services/api';

export function StackOptimizer({
	stack,
	npmData,
	githubData,
}: {
	stack: StackConfig;
	npmData: Record<string, NPMPackageData | null>;
	githubData: Record<string, GitHubRepoData | null>;
}) {
	const totalDownloads = Object.values(npmData).reduce((sum, d) => sum + (d?.downloads.weekly || 0), 0);
	const totalStars = Object.values(githubData).reduce((sum, g) => sum + (g?.stars || 0), 0);

	return (
		<div className="mt-6 rounded-2xl border bg-white dark:bg-gray-900 p-4">
			<div className="text-sm text-gray-600 dark:text-gray-300">Optimization insights coming soon.</div>
			<div className="mt-2 text-xs text-gray-500">Items: {stack.items.length}</div>
			<div className="mt-2 text-xs text-gray-500">Weekly downloads: {totalDownloads.toLocaleString()}</div>
			<div className="mt-1 text-xs text-gray-500">GitHub stars: {totalStars.toLocaleString()}</div>
		</div>
	);
}
