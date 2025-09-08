export function Stats({ stats }: { stats: { value: string; label: string; trend?: string }[] }) {
	return (
		<div className="py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-8">By the Numbers</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{stats.map((s, i) => (
							<div key={i} className="text-center">
								<div className="text-4xl font-bold text-blue-600 mb-2">{s.value}</div>
								<p className="text-gray-600">{s.label}</p>
								{s.trend && <div className="text-xs text-green-600 mt-1">{s.trend}</div>}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
