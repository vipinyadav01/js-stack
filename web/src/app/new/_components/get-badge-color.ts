/**
 * Get badge colors based on category for visual distinction
 */
export function getBadgeColors(category: string): string {
  const colorMap: Record<string, string> = {
    frontend:
      "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    backend:
      "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
    database:
      "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orm: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    auth: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    addons:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    dbSetup:
      "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    webDeploy:
      "border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400",
    serverDeploy:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    packageManager:
      "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  };

  return colorMap[category] || "border-border bg-muted text-muted-foreground";
}
