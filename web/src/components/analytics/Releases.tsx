import { Tag, ExternalLink, Package } from "lucide-react";
import { GitHubRepoData } from "@/lib/api";

export default function Releases({ releases }: { releases: GitHubRepoData["releases"] }) {
  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">RELEASES</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {releases?.length || 0}
        </div>
      </div>

      <div className="space-y-3">
        {releases?.length ? (
          releases.slice(0, 5).map((r, index) => (
            <a 
              key={r.tagName} 
              href={r.htmlUrl} 
              target="_blank" 
              rel="noopener"
              className="group flex items-center justify-between rounded border border-border p-3 transition-colors hover:bg-muted/10 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="text-foreground font-mono">{r.name || r.tagName}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  v{index + 1}
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
            </a>
          ))
        ) : (
          <div className="flex items-center justify-between rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No releases found</span>
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