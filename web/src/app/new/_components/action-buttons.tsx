"use client";

interface ActionButtonsProps {
  onReset: () => void;
  onRandom: () => void;
  isPending: boolean;
}

export function ActionButtons({
  onReset,
  onRandom,
  isPending,
}: ActionButtonsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-2">
      <button
        onClick={onReset}
        disabled={isPending}
        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
      >
        🔄 Reset
      </button>
      <button
        onClick={onRandom}
        disabled={isPending}
        className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-md transition-colors disabled:opacity-50"
      >
        🎲 Random Stack
      </button>
    </div>
  );
}
