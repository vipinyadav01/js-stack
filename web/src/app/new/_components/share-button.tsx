"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex-1"
    >
      <Share2 className="mr-2 h-3.5 w-3.5" />
      Share
    </Button>
  );
}
