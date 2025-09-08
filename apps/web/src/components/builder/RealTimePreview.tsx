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

export function RealTimePreview({ stack, onClose }: { stack: StackConfig; onClose: () => void }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Preview</h3>
					<button onClick={onClose} className="text-sm text-gray-500">Close</button>
				</div>
				<div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
					Stack items: {stack.items.length}
				</div>
			</div>
		</div>
	);
}
