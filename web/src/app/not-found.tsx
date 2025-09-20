"use client";

import { FileX, Home, Terminal, ArrowLeft, Search, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
	const [currentPath, setCurrentPath] = useState('/unknown');
	
	useEffect(() => {
		setCurrentPath(window.location.pathname);
	}, []);
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<motion.main 
				className="mx-auto px-4 pt-12"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Terminal Header */}
				<motion.div className="mb-8" variants={itemVariants}>
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-destructive" />
							<span className="font-bold text-lg sm:text-xl">
								ERROR_404.LOG
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[PAGE_NOT_FOUND]
						</span>
					</div>
				</motion.div>

				{/* Error Details Section */}
				<motion.div className="mb-8" variants={itemVariants}>
					<div className="w-full min-w-0 overflow-hidden rounded border border-border">
						<div className="sticky top-0 z-10 border-border border-b px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-destructive text-xs">❌</span>
								<span className="font-semibold text-xs">
									[ERROR_DETAILS]
								</span>
							</div>
						</div>
						<div className="p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between rounded border border-destructive/20 bg-destructive/5 p-3">
									<div className="flex items-center gap-2 font-mono text-sm">
										<span className="text-destructive">$</span>
										<span className="text-foreground">
											HTTP 404 - Resource not found
										</span>
									</div>
									<div className="rounded border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive text-xs font-bold">
										CRITICAL
									</div>
								</div>
								
								<div className="rounded border border-border bg-muted/20 p-3">
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span className="text-primary">→</span>
											<span>Requested URL: <code className="bg-muted px-1 rounded">{currentPath}</code></span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span className="text-primary">→</span>
											<span>Method: <code className="bg-muted px-1 rounded">GET</code></span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span className="text-primary">→</span>
											<span>Status: <code className="bg-destructive/10 text-destructive px-1 rounded">404 Not Found</code></span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span className="text-primary">→</span>
											<span>Timestamp: <code className="bg-muted px-1 rounded">{new Date().toISOString()}</code></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Navigation Options */}
				<div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
					{/* Go Home Option */}
					<Link href="/">
						<motion.div 
							className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-all duration-300 hover:bg-muted/10 hover:border-primary/30"
							variants={itemVariants}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Home className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
									<span className="font-semibold text-sm">GO_HOME</span>
								</div>
								<div className="rounded border border-border bg-primary/10 px-2 py-1 text-primary text-xs font-bold">
									RECOMMENDED
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between rounded border border-border p-3">
									<div className="flex items-center gap-2 text-sm">
										<Home className="h-4 w-4 text-primary" />
										<span className="text-foreground">Return to homepage</span>
									</div>
									<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
										NAVIGATE
									</div>
								</div>
								<div className="text-xs text-muted-foreground">
									Access the main dashboard and navigation menu
								</div>
							</div>
						</motion.div>
					</Link>

					{/* Go Back Option */}
					<motion.div 
						className="group flex h-full cursor-pointer flex-col justify-between rounded border border-border p-4 transition-all duration-300 hover:bg-muted/10 hover:border-primary/30"
						variants={itemVariants}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => window.history.back()}
					>
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
								<span className="font-semibold text-sm">GO_BACK</span>
							</div>
							<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
								SAFE
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between rounded border border-border p-3">
								<div className="flex items-center gap-2 text-sm">
									<ArrowLeft className="h-4 w-4 text-primary" />
									<span className="text-foreground">Return to previous page</span>
								</div>
								<div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
									BACK
								</div>
							</div>
							<div className="text-xs text-muted-foreground">
								Navigate back to the page you came from
							</div>
						</div>
					</motion.div>
				</div>

				{/* Quick Actions */}
				<motion.div className="mb-8" variants={itemVariants}>
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Search className="h-5 w-5 text-primary" />
							<span className="font-bold text-lg sm:text-xl">
								QUICK_ACTIONS.LOG
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[HELPFUL_LINKS]
						</span>
					</div>
					
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<Link href="/features">
							<motion.div 
								className="group flex cursor-pointer flex-col justify-between rounded border border-border p-4 transition-all duration-300 hover:bg-muted/10 hover:border-primary/30"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-2 mb-3">
									<Terminal className="h-4 w-4 text-primary" />
									<span className="font-semibold text-sm">FEATURES</span>
								</div>
								<div className="text-xs text-muted-foreground">
									Explore js-stack capabilities and features
								</div>
							</motion.div>
						</Link>

						<Link href="/analytics">
							<motion.div 
								className="group flex cursor-pointer flex-col justify-between rounded border border-border p-4 transition-all duration-300 hover:bg-muted/10 hover:border-primary/30"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-2 mb-3">
									<RefreshCw className="h-4 w-4 text-primary" />
									<span className="font-semibold text-sm">ANALYTICS</span>
								</div>
								<div className="text-xs text-muted-foreground">
									View project statistics and insights
								</div>
							</motion.div>
						</Link>

						<Link href="/sponsors">
							<motion.div 
								className="group flex cursor-pointer flex-col justify-between rounded border border-border p-4 transition-all duration-300 hover:bg-muted/10 hover:border-primary/30"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-2 mb-3">
									<FileX className="h-4 w-4 text-primary" />
									<span className="font-semibold text-sm">SPONSORS</span>
								</div>
								<div className="text-xs text-muted-foreground">
									Check out our supporters and contributors
								</div>
							</motion.div>
						</Link>
					</div>
				</motion.div>

				{/* End of File */}
				<motion.div className="mb-4 mt-8" variants={itemVariants}>
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
						<div className="flex items-center gap-2">
							<Terminal className="h-5 w-5 text-muted-foreground" />
							<span className="font-bold text-lg sm:text-xl text-muted-foreground">
								END_OF_ERROR_LOG
							</span>
						</div>
						<div className="hidden h-px flex-1 bg-border sm:block" />
						<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
							[404.LOG]
						</span>
					</div>
				</motion.div>
			</motion.main>
		</div>
	);
}
