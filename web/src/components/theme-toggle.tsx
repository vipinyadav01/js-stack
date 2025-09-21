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
					"inline-flex h-8 w-16 shrink-0 cursor-not-allowed items-center rounded border border-border bg-muted/50 opacity-50 relative p-1",
					className,
				)}
				aria-label="Toggle theme (loading)"
			>
				<div className="h-6 w-6 rounded bg-background shadow-sm border border-border" />
			</div>
		);
	}

	return (
		<div className="relative group">
			<SwitchPrimitives.Root
				checked={isChecked}
				onCheckedChange={handleCheckedChange}
				className={cn(
					"peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded border transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden shadow-sm p-1",

					"data-[state=unchecked]:bg-muted/30 data-[state=unchecked]:border-border data-[state=unchecked]:hover:border-primary/50",
					"data-[state=checked]:bg-primary/20 data-[state=checked]:border-primary data-[state=checked]:hover:border-primary/70",							
					"hover:shadow-md transition-all duration-200",
					
					isAnimating && "animate-pulse",
					className,
				)}
				aria-label="Toggle theme between light and dark"
			>
				{/* Background overlay gradients */}
				<div className="absolute inset-1 rounded pointer-events-none">
					{!isChecked && (
						<div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded transition-opacity duration-300" />
					)}
					{isChecked && (
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded transition-opacity duration-300" />
					)}
				</div>

				{/* Animation sparkles */}
				{isAnimating && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<Sparkles className="h-4 w-4 text-primary animate-spin" />
					</div>
				)}

				{/* Switch thumb */}
				<SwitchPrimitives.Thumb
					className={cn(
						"pointer-events-none flex h-6 w-6 items-center justify-center rounded shadow-sm ring-0 transition-all duration-300 ease-in-out relative z-10",
						
						// Position and movement
						"data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0",
						
						// Appearance
						"bg-background border border-border",
						
						// Hover and animation effects
						"group-hover:shadow-md group-hover:scale-105",
						isAnimating && "animate-bounce",
					)}
				>
					<div className="flex items-center justify-center">
						{isChecked ? (
							<Moon className="h-3.5 w-3.5 text-primary transition-all duration-300" />
						) : (
							<Sun className="h-3.5 w-3.5 text-primary transition-all duration-300" />
						)}
					</div>
				</SwitchPrimitives.Thumb>
			</SwitchPrimitives.Root>

			{/* Tooltip */}
			<div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-background border border-border text-foreground text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
				{isChecked ? "Switch to light mode" : "Switch to dark mode"}
				<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-background" />
			</div>
		</div>
	);
}