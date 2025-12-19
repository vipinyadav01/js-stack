"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  getAllUseCaseRecommendations,
  type UseCaseRecommendation,
} from "@/lib/recommendations";
import { cn } from "@/lib/utils";
import type { StackState } from "./use-stack-state";

interface UseCasePresetsProps {
  onSelectPreset: (preset: Partial<StackState>) => void;
  currentStack?: Partial<StackState>;
}

const difficultyColors = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function UseCasePresets({ onSelectPreset }: UseCasePresetsProps) {
  const recommendations = getAllUseCaseRecommendations();

  const handleSelect = (preset: UseCaseRecommendation) => {
    const stackUpdate: Partial<StackState> = {
      frontend: preset.recommended.frontend || "none",
      backend: preset.recommended.backend || "none",
      database: preset.recommended.database || "none",
      orm: preset.recommended.orm || "none",
      auth: preset.recommended.auth || "none",
      addons: preset.recommended.addons || [],
      packageManager: preset.recommended.packageManager || "npm",
      git: preset.recommended.initializeGit ? "true" : "false",
      install: preset.recommended.installDependencies ? "true" : "false",
    };
    onSelectPreset(stackUpdate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Use Case Presets</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recommendations.map((preset) => (
          <motion.div
            key={preset.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold">
                      {preset.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {preset.description}
                    </CardDescription>
                  </div>
                  <CardAction>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-medium",
                        difficultyColors[preset.difficulty],
                      )}
                    >
                      {preset.difficulty}
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {preset.why}
                </p>
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {preset.estimatedTime && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>~{preset.estimatedTime} setup</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelect(preset)}
                >
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Apply Preset
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
