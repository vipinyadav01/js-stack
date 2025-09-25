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
      className={`group relative text-left rounded-xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        disabled
          ? "opacity-50 cursor-not-allowed border-border bg-muted/20"
          : incompatible
            ? "border-red-200 bg-red-50/50 text-red-700 hover:border-red-300"
            : selected
              ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm"
              : "border-border bg-card hover:bg-muted/30 hover:border-primary/50 hover:shadow-md"
      }`}
      whileHover={
        !disabled && !incompatible
          ? {
              scale: 1.02,
              y: -2,
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
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div
            className={`font-semibold text-base mb-1 transition-colors ${
              incompatible
                ? "text-red-600"
                : selected
                  ? "text-primary"
                  : "text-foreground"
            }`}
          >
            {name}
          </div>
          {desc && (
            <div
              className={`text-sm leading-relaxed transition-colors ${
                incompatible ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {desc}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 flex-shrink-0">
          {/* Badges */}
          <div className="flex flex-col gap-1">
            {badge && (
              <motion.span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "border-primary/30 bg-primary/20 text-primary"
                    : "border-border bg-muted/50 text-muted-foreground"
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {badge === "Popular" && <Sparkles className="h-3 w-3" />}
                {badge}
              </motion.span>
            )}

            {incompatible && (
              <motion.span
                className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertTriangle className="h-3 w-3" />
                Incompatible
              </motion.span>
            )}
          </div>
        </div>
      </div>
      {/* Selection Indicator */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background"
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
          !disabled && !incompatible ? "group-hover:bg-primary/5" : ""
        }`}
      />
    </motion.button>
  );
});
