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

export function StackVisualizer({ stack, onRemoveItem }: { stack: StackConfig; onRemoveItem: (id: string) => void }) {
	return (
		<div className="space-y-2">
			{stack.items.length === 0 ? (
				<div className="text-sm text-gray-500">No items in stack yet.</div>
			) : (
				<ul className="space-y-2">
					{stack.items.map((item) => (
						<li key={item.id} className="flex items-center justify-between rounded border p-2">
							<span>{item.name}</span>
							<button onClick={() => onRemoveItem(item.id)} className="text-xs text-red-600">
								Remove
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
