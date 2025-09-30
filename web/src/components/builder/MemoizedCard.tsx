"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Sparkles } from "lucide-react";

interface MemoizedCardProps {
  selected?: boolean;
  disabled?: boolean;
  name: string;
  desc?: string;
  badge?: string;
  onClick?: () => void;
  incompatible?: boolean;
}

export const MemoizedCard = memo(function Card({
  selected,
  disabled,
  name,
  desc,
  badge,
  onClick,
  incompatible,
}: MemoizedCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative text-left rounded border p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] sm:min-h-[50px] ${
        disabled
          ? "opacity-50 cursor-not-allowed border-border bg-muted/20"
          : incompatible
            ? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
            : selected
              ? "border-primary bg-primary/10 text-primary shadow-sm"
              : "border-border hover:border-muted hover:bg-muted"
      }`}
      whileHover={
        !disabled && !incompatible
          ? {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
          : {}
      }
      whileTap={
        !disabled && !incompatible
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : {}
      }
      layout
    >
      <div className="flex items-start">
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className={`font-medium text-xs sm:text-sm transition-colors ${
                  incompatible
                    ? "text-destructive"
                    : selected
                      ? "text-primary"
                      : "text-foreground"
                }`}
              >
                {name}
              </span>
            </div>
          </div>
          {desc && (
            <p className="mt-1 text-muted-foreground text-[10px] leading-tight">
              {desc}
            </p>
          )}
        </div>
      </div>

      {/* Badges and Status */}
      <div className="absolute top-1 right-1 flex items-center gap-1">
        {badge && (
          <motion.span
            className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
              selected
                ? "border-primary/30 bg-primary/20 text-primary"
                : "border-border bg-muted/50 text-muted-foreground"
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {badge === "Popular" && <Sparkles className="h-2.5 w-2.5" />}
            {badge}
          </motion.span>
        )}

        {incompatible && (
          <motion.span
            className="inline-flex items-center gap-1 rounded border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            Error
          </motion.span>
        )}
      </div>
      {/* Selection Indicator */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm border border-background"
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default indicator */}
      {!selected && (
        <span className="absolute top-1 right-1 ml-2 flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
          Default
        </span>
      )}
    </motion.button>
  );
});
