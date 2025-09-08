import React from 'react';

export function TechnologyPalette() {
	const tech = [
		'Next.js',
		'React',
		'TypeScript',
		'Tailwind',
		'Node.js',
		'PostgreSQL',
	];
	return (
		<div className="rounded-2xl border bg-white dark:bg-gray-900 p-4">
			<h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</h3>
			<ul className="space-y-1 text-sm">
				{tech.map((t) => (
					<li key={t} className="rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
						{t}
					</li>
				))}
			</ul>
		</div>
	);
}
