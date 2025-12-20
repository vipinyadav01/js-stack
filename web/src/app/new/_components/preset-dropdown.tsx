"use client";

import { ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRESET_TEMPLATES } from "./presets";

interface PresetDropdownProps {
  onApplyPreset: (presetId: string) => void;
}

export function PresetDropdown({ onApplyPreset }: PresetDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2"
        >
          <Zap className="mr-1 sm:mr-1.5 h-3 w-3" />
          Presets
          <ChevronDown className="ml-1 sm:ml-1.5 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 sm:w-64 bg-background">
        {PRESET_TEMPLATES.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className="flex flex-col items-start gap-0.5 p-2"
          >
            <div className="font-medium text-[10px] sm:text-xs">
              {preset.name}
            </div>
            <div className="text-[9px] sm:text-[10px] text-muted-foreground">
              {preset.description}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
