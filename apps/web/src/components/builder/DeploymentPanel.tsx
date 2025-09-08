import React from 'react';

interface StackItem {
	id: string;
	name: string;
}

interface StackConfig {
	id: string;
	name: string;
	items: StackItem[];
	score: number;
	compatibility: number;
	performance: number;
	popularity: number;
}

export function DeploymentPanel({ stack }: { stack: StackConfig }) {
	return (
		<div className="rounded-2xl border bg-white dark:bg-gray-900 p-4">
			<div className="text-sm text-gray-600 dark:text-gray-300">Ready to deploy {stack.name}.</div>
			<button className="mt-2 rounded bg-green-600 px-3 py-1 text-xs text-white">Deploy</button>
		</div>
	);
}
