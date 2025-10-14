"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { StackState } from "./use-stack-state";

interface ShareButtonProps {
  stackUrl: string;
  stackState: StackState;
}

export function ShareButton({ stackUrl }: ShareButtonProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(stackUrl);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
    >
      <Share2 className="h-3 w-3" />
      Share
    </button>
  );
}
