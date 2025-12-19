"use client";

import { RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onReset: () => void;
  onRandom: () => void;
}

export function ActionButtons({ onReset, onRandom }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1 font-semibold hover:bg-destructive/10 hover:border-destructive/50"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset to default configuration</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRandom}
              className="flex-1 font-semibold hover:bg-primary/10 hover:border-primary/50"
            >
              <Shuffle className="mr-2 h-3.5 w-3.5" />
              Random
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate a random valid stack</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
