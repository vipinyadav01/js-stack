"use client";

import { memo } from "react";
import { motion } from "framer-motion";

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
  incompatible 
}: MemoizedCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-left rounded-lg border p-2 transition-all relative ${
        selected 
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20" 
          : incompatible 
            ? "border-red-300 bg-red-50/50 opacity-60 cursor-not-allowed"
            : "border-border hover:bg-muted/40 hover:border-primary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start justify-between font-thin">
        <div className="flex-2 min-w-0">
          <div className={`font-semibold text-base mb-1 ${incompatible ? "text-red-600" : ""} font-thin`}>
            {name}
          </div>
          {desc && (
            <div className={`text-sm leading-relaxed ${incompatible ? "text-red-500" : "text-muted-foreground"} font-thin`}>
              {desc}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-1 font-thin">
          {badge && (
            <span className="rounded-full border border-border bg-muted/30 px-2 py-1 text-xs  font-thin">
              {badge}
            </span>
          )}
          {incompatible && (
            <span className="rounded-full border border-red-300 bg-red-100 px-2 py-1 text-xs text-red-700  font-thin">
              Incompatible
            </span>
          )}
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}
    </motion.button>
  );
});
