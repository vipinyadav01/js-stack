"use client";

import { StackState } from "./use-stack-state";
import { toast } from "sonner";

interface ShareButtonProps {
  stack: StackState;
}

export function ShareButton({ stack }: ShareButtonProps) {
  const handleShare = () => {
    const params = new URLSearchParams();

    // Add all non-default values to URL
    Object.entries(stack).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      } else {
        params.set(key, value.toString());
      }
    });

    const url = `${window.location.origin}/new?${params.toString()}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <button
      onClick={handleShare}
      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
    >
      🔗 Share Stack
    </button>
  );
}
