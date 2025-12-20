"use client";

import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StackState } from "./use-stack-state";

interface YoloToggleProps {
  stack: StackState;
  onToggle: (enabled: boolean) => void;
}

export function YoloToggle({ stack, onToggle }: YoloToggleProps) {
  const isYoloEnabled = stack.yolo === "true";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="flex w-full items-center gap-2 p-2 bg-background">
            <AlertTriangle
              className={cn(
                "h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0",
                isYoloEnabled ? "text-destructive" : "text-muted-foreground",
              )}
            />
            <div className="flex flex-1 flex-col items-start">
              <div className="font-medium text-[10px] sm:text-xs">
                YOLO Mode
              </div>
              <div className="text-muted-foreground text-[9px] sm:text-[10px]">
                {isYoloEnabled
                  ? "Skip validation checks"
                  : "Compatibility checks enabled"}
              </div>
            </div>
            <Switch
              checked={isYoloEnabled}
              onCheckedChange={onToggle}
              className={cn(
                "scale-75 sm:scale-100",
                isYoloEnabled && "data-[state=checked]:bg-destructive",
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-xs">
          <p className="text-[10px] sm:text-xs">
            When enabled, skips all validation checks and adds --yolo flag to
            the command. Allows any combination of technologies without
            compatibility warnings.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
