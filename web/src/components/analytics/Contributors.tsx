import Image from "next/image";
import { Users, User } from "lucide-react";
import { GitHubRepoData } from "@/lib/api";

export default function Contributors({ contributors }: { contributors: GitHubRepoData["contributors"] }) {
  return (
    <div className="flex h-full flex-col justify-between rounded border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">CONTRIBUTORS</span>
        </div>
        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
          {contributors?.length || 0}
        </div>
      </div>

      <div className="space-y-3">
        {contributors?.length ? (
          contributors.slice(0, 5).map((c, index) => (
            <div key={c.login} className="flex items-center justify-between rounded border border-border p-3">
              <div className="flex items-center gap-2 text-sm">
                <Image src={c.avatarUrl} alt={c.login} width={20} height={20} className="rounded-full" />
                <span className="text-foreground font-mono">{c.login}</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                #{index + 1}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-between rounded border border-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">No contributors found</span>
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