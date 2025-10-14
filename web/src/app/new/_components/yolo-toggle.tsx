"use client";

interface YoloToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function YoloToggle({ enabled, onChange }: YoloToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            YOLO Mode
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Disable all compatibility checks
          </div>
        </div>
      </label>
    </div>
  );
}
