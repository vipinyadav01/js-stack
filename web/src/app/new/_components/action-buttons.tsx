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
    <div className="flex gap-1.5 sm:gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1 font-semibold hover:bg-destructive/10 hover:border-destructive/50 text-[10px] sm:text-xs h-7 sm:h-8"
            >
              <RotateCcw className="mr-1 sm:mr-1.5 h-3 w-3" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-[10px] sm:text-xs">
            Reset to default configuration
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRandom}
              className="flex-1 font-semibold hover:bg-primary/10 hover:border-primary/50 text-[10px] sm:text-xs h-7 sm:h-8"
            >
              <Shuffle className="mr-1 sm:mr-1.5 h-3 w-3" />
              Random
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-[10px] sm:text-xs">
            Generate a random valid stack
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
