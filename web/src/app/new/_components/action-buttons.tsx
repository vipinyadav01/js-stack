"use client";

import { RotateCcw, Shuffle, Save, Download } from "lucide-react";
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
  onSave: () => void;
  onLoad: () => void;
  hasSavedStack: boolean;
}

export function ActionButtons({
  onReset,
  onRandom,
  onSave,
  onLoad,
  hasSavedStack,
}: ActionButtonsProps) {
  return (
    <div className="space-y-1.5">
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

      <div className="flex gap-1.5 sm:gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="flex-1 font-semibold hover:bg-green-500/10 hover:border-green-500/50 text-[10px] sm:text-xs h-7 sm:h-8"
              >
                <Save className="mr-1 sm:mr-1.5 h-3 w-3" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] sm:text-xs">
              Save current configuration to browser
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onLoad}
                disabled={!hasSavedStack}
                className="flex-1 font-semibold hover:bg-blue-500/10 hover:border-blue-500/50 text-[10px] sm:text-xs h-7 sm:h-8 disabled:opacity-50"
              >
                <Download className="mr-1 sm:mr-1.5 h-3 w-3" />
                Load
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] sm:text-xs">
              {hasSavedStack
                ? "Load saved configuration"
                : "No saved configuration found"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
