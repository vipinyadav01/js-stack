"use client";

import { useState } from "react";
import { PresetTemplate } from "./presets";

interface PresetDropdownProps {
  presets: PresetTemplate[];
  onSelect: (presetId: string) => void;
}

export function PresetDropdown({ presets, onSelect }: PresetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <span className="font-medium text-gray-700 dark:text-gray-300">
          📋 Presets
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                onSelect(preset.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {preset.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
