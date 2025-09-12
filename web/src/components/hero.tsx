import NpmVersion from "./NpmVersion";

export default function Hero() {
	return (
		<div>
			<div className="mb-8 flex items-center justify-center">
				<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{` ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   █████╗  
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝  
╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝`}
					</pre>

					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`     ██╗███████╗
     ██║██╔════╝
     ██║███████╗
██   ██║╚════██║
╚█████╔╝███████║
 ╚════╝ ╚══════╝`}
					</pre>

					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝ 
╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
					</pre>
				</div>
			</div>

			<div className="text-center">
				<p className="mx-auto text-lg text-muted-foreground">
					A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in.
				</p>
				<NpmVersion/>
			
			</div>
		</div>
	);
}