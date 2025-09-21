"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);
	const [isAnimating, setIsAnimating] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const isChecked = mounted ? resolvedTheme === "dark" : false;

	const handleCheckedChange = (checked: boolean) => {
		setIsAnimating(true);
		setTheme(checked ? "dark" : "light");
		setTimeout(() => setIsAnimating(false), 300);
	};

	if (!mounted) {
		return (
			<div
				className={cn(
					"inline-flex h-8 w-16 shrink-0 cursor-not-allowed items-center rounded-full border border-slate-300 dark:border-slate-600 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 opacity-50 relative shadow-inner p-1",
					className,
				)}
				aria-label="Toggle theme (loading)"
			>
				<div className="h-6 w-6 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-600" />
			</div>
		);
	}

	return (
		<div className="relative group">
			<SwitchPrimitives.Root
				checked={isChecked}
				onCheckedChange={handleCheckedChange}
				className={cn(
					"peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden shadow-lg p-1",
					
					// Light mode (unchecked) styles
					"data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-amber-200 data-[state=unchecked]:to-orange-300 data-[state=unchecked]:border-amber-300 data-[state=unchecked]:shadow-amber-200/30",
					
					// Dark mode (checked) styles
					"data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-slate-700 data-[state=checked]:to-slate-900 data-[state=checked]:border-slate-600 data-[state=checked]:shadow-slate-900/30",
					
					// Hover effects
					"hover:scale-[1.02] hover:shadow-xl transition-all duration-200",
					
					isAnimating && "animate-pulse",
					className,
				)}
				aria-label="Toggle theme between light and dark"
			>
				{/* Background overlay gradients */}
				<div className="absolute inset-1 rounded-full pointer-events-none">
					{!isChecked && (
						<div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-orange-400/20 to-red-400/20 rounded-full transition-opacity duration-300" />
					)}
					{isChecked && (
						<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-indigo-600/20 rounded-full transition-opacity duration-300" />
					)}
				</div>

				{/* Animation sparkles */}
				{isAnimating && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<Sparkles className="h-4 w-4 text-white/80 animate-spin" />
					</div>
				)}

				{/* Switch thumb */}
				<SwitchPrimitives.Thumb
					className={cn(
						"pointer-events-none flex h-6 w-6 items-center justify-center rounded-full shadow-md ring-0 transition-all duration-300 ease-in-out relative z-10",
						
						// Position and movement
						"data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0",
						
						// Appearance
						"bg-white border border-slate-200 dark:border-slate-600",
						
						// Hover and animation effects
						"group-hover:shadow-lg group-hover:scale-105",
						isAnimating && "animate-bounce",
					)}
				>
					<div className="flex items-center justify-center">
						{isChecked ? (
							<Moon className="h-3.5 w-3.5 text-slate-600 transition-all duration-300" />
						) : (
							<Sun className="h-3.5 w-3.5 text-amber-600 transition-all duration-300" />
						)}
					</div>
				</SwitchPrimitives.Thumb>
			</SwitchPrimitives.Root>

			{/* Tooltip */}
			<div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
				{isChecked ? "Switch to light mode" : "Switch to dark mode"}
				<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-900 dark:border-t-slate-100" />
			</div>
		</div>
	);
}