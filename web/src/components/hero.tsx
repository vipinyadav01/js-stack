import NpmVersion from "./NpmVersion";
import { Terminal, Code2, Zap, Package, Github } from "lucide-react";

export default function Hero() {
	return (
		<div className="w-full max-w-full overflow-hidden px-4">
			<main className="mx-auto max-w-[1280px]">
				{/* Terminal Header */}
				<div className="mb-8">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-5 w-5 text-primary" />
							<span className="font-bold text-lg sm:text-xl">
								WELCOME.TXT
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[CLI TOOL INITIALIZATION]
						</span>
					</div>
				</div>

				{/* ASCII Art Section */}
				<div className="mb-8">
					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Code2 className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">ASCII_ART</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								DISPLAY
							</div>
						</div>

						<div className="rounded border border-border p-4">
							<div className="text-xs text-muted-foreground mb-3">LOGO_DISPLAY</div>
							<div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 w-full">
								<pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
									{` ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   █████╗  
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝  
╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝`}
								</pre>

								<pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
									{`     ██╗███████╗
     ██║██╔════╝
     ██║███████╗
██   ██║╚════██║
╚█████╔╝███████║
 ╚════╝ ╚══════╝`}
								</pre>

								<pre className="ascii-art text-primary text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm xl:text-base leading-tight overflow-x-auto max-w-full whitespace-pre-wrap break-words font-mono">
									{`███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝ 
╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
								</pre>
							</div>
						</div>
					</div>
				</div>

				{/* Description Section */}
				<div className="mb-8">
					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">PROJECT_DESCRIPTION</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								INFO
							</div>
						</div>

						<div className="rounded border border-border p-4">
							<div className="text-xs text-muted-foreground mb-2">DESCRIPTION</div>
							<div className="text-sm text-foreground">
								A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in.
							</div>
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Package className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">NPM_PACKAGE</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								PUBLIC
							</div>
						</div>
						<div className="rounded border border-border p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm">
									<span className="text-foreground font-mono">create-js-stack</span>
								</div>
								<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
									LATEST
								</div>
							</div>
						</div>
					</div>

					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Github className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">GITHUB_REPO</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								OPEN
							</div>
						</div>
						<div className="rounded border border-border p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm">
									<span className="text-foreground font-mono">vipinyadav01/js-stack</span>
								</div>
								<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
									ACTIVE
								</div>
							</div>
						</div>
					</div>

					<div className="rounded border border-border p-4">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-primary" />
								<span className="font-semibold text-sm">VERSION</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								CURRENT
							</div>
						</div>
						<div className="rounded border border-border p-3">
							<NpmVersion />
						</div>
					</div>
				</div>

				{/* End of File */}
				<div className="mb-4 mt-8">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-5 w-5 text-muted-foreground" />
							<span className="font-bold text-lg sm:text-xl text-muted-foreground">
								END_OF_FILE
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[HERO.LOG]
						</span>
					</div>
				</div>
			</main>
		</div>
	);
}