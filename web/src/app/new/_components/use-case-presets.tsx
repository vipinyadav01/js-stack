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
} from "@/components/ui/card";
import {
  getAllUseCaseRecommendations,
  type UseCaseRecommendation,
} from "@/lib/recommendations";
import { cn } from "@/lib/utils";
import type { StackState } from "./use-stack-state";

interface UseCasePresetsProps {
  onSelectPreset: (preset: Partial<StackState>) => void;
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono">
            Use Case Presets
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Quick-start templates for common project types
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((preset) => (
          <motion.div
            key={preset.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-base font-bold leading-tight">
                      {preset.name}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {preset.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-semibold shrink-0",
                      difficultyColors[preset.difficulty],
                    )}
                  >
                    {preset.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {preset.why}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {preset.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {preset.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 border-primary/20"
                    >
                      +{preset.tags.length - 3}
                    </Badge>
                  )}
                </div>
                {preset.estimatedTime && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{preset.estimatedTime} setup</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button
                  size="sm"
                  className="w-full font-semibold"
                  onClick={() => handleSelect(preset)}
                >
                  <TrendingUp className="mr-2 h-3.5 w-3.5" />
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
