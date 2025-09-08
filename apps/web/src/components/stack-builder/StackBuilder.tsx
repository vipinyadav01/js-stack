import type { SetStateAction } from 'react';

export function StackBuilder({ onStackChange, showAIAssist }: { onStackChange?: (value: SetStateAction<null>) => void; showAIAssist?: boolean }) {
	return (
		<div className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-8">Build Your Stack</h2>
					<p className="text-lg text-gray-600 mb-8">
						Configure your ideal development stack with our interactive builder
					</p>
					<div className="bg-gray-100 rounded-lg p-8">
						<p className="text-gray-500">Stack builder interface coming soon...</p>
						{showAIAssist && (
							<p className="mt-2 text-sm text-gray-400">AI assistance enabled</p>
						)}
						<button
							onClick={() => onStackChange?.(null)}
							className="mt-4 px-4 py-2 text-sm rounded bg-blue-600 text-white"
						>
							Save Stack
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
