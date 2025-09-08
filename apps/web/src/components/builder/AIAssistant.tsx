import React from 'react';
import type { StackConfig } from '@/lib/stack-logic';

export function AIAssistant({ stack, onSuggestion }: { stack: StackConfig; onSuggestion: (s: unknown) => void }) {
	return (
		<div className="rounded-2xl border bg-white dark:bg-gray-900 p-4">
			<div className="text-sm text-gray-600 dark:text-gray-300">AI suggestions will appear here.</div>
			<div className="mt-2 text-xs text-gray-500">Stack size: {stack.items.length}</div>
			<button onClick={() => onSuggestion({ type: 'example' })} className="mt-2 text-xs text-blue-600">
				Generate suggestion
			</button>
		</div>
	);
}
