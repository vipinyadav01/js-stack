import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LucideProps } from 'lucide-react';

export function Features({
	features,
}: {
	features: { icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>; title: string; description: string; gradient: string }[];
}) {
	return (
		<div className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((f, i) => (
							<div key={i} className="text-center">
								<div className={`mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center`}>
									<f.icon className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-semibold mb-2">{f.title}</h3>
								<p className="text-gray-600">{f.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
