import { Github, Star, GitFork, AlertCircle, Code, FileText, Database } from "lucide-react";
import { GitHubRepoData } from "@/lib/api";

export default function RepoInfo({ info }: { info: GitHubRepoData["info"] | undefined }) {
  const repoStats = [
    { icon: Star, label: "STARS", value: info?.stargazersCount || 0, status: "POPULAR" },
    { icon: GitFork, label: "FORKS", value: info?.forksCount || 0, status: "FORKS" },
    { icon: AlertCircle, label: "ISSUES", value: info?.openIssuesCount || 0, status: "OPEN" },
    { icon: Code, label: "LANGUAGE", value: info?.language || "N/A", status: "LANG" },
    { icon: FileText, label: "LICENSE", value: info?.license?.name || "None", status: "LEGAL" }
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">REPO_INFO</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {info ? "ACTIVE" : "N/A"}
        </div>
      </div>

      <div className="space-y-3">
        {info ? (
          <>
            <div className="flex items-center justify-between rounded border border-border p-3">
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-foreground font-mono">{info.name}</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                REPO
              </div>
            </div>
            
            {info.description && (
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                <div className="text-sm text-foreground">{info.description}</div>
              </div>
            )}

            {repoStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <stat.icon className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-mono">{stat.value}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  {stat.status}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-between rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <Github className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No repo info found</span>
            </div>
            <div className="rounded border border-border bg-destructive/10 px-2 py-1 text-destructive text-xs">
              EMPTY
            </div>
          </div>
        )}
      </div>
    </div>
  );
}