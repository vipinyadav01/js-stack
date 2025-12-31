"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { StackState } from "./use-stack-state";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  stackUrl: string;
  stackState: StackState;
}

export function ShareButton({
  stackUrl,
  className,
}: ShareButtonProps & { className?: string }) {
  const handleShare = () => {
    navigator.clipboard.writeText(stackUrl);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={cn(
        "flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2",
        className,
      )}
    >
      <Share2 className="mr-1 sm:mr-1.5 h-3 w-3" />
      Share
    </Button>
  );
}
