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
        <Button variant="outline" size="sm" className="flex-1">
          <Zap className="mr-2 h-3.5 w-3.5" />
          Presets
          <ChevronDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background">
        {PRESET_TEMPLATES.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className="flex flex-col items-start gap-1 p-3"
          >
            <div className="font-medium text-sm">{preset.name}</div>
            <div className="text-xs">{preset.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
