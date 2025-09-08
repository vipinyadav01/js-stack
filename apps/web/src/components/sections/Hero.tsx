export function Hero({ onStartBuilding, onAIAssist }: { onStartBuilding?: () => void; onAIAssist?: () => void }) {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Build Modern JavaScript Stacks
					</h1>
					<p className="text-xl md:text-2xl mb-8 text-blue-100">
						Generate full-stack applications with your preferred technologies
					</p>
					<div className="mt-8 flex gap-4 justify-center">
						<button
							onClick={onStartBuilding}
							className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold"
						>
							Start Building
						</button>
						<button
							onClick={onAIAssist}
							className="px-6 py-3 bg-transparent border border-white/60 rounded-lg font-semibold"
						>
							Ask AI
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
