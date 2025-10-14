"use client";

import { TechOption } from "./tech-options";

interface TechCategoryProps {
  category: string;
  options: TechOption[];
  selected: string | string[];
  onSelect: (category: string, techId: string) => void;
  isMultiSelect: boolean;
  notes?: {
    notes: string[];
    hasIssue: boolean;
  };
}

export function TechCategory({
  category,
  options,
  selected,
  onSelect,
  isMultiSelect,
  notes,
}: TechCategoryProps) {
  const isSelected = (techId: string) => {
    if (isMultiSelect) {
      return (selected as string[]).includes(techId);
    }
    return selected === techId;
  };

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      frontend: "Frontend Frameworks",
      backend: "Backend Frameworks",
      database: "Database",
      orm: "ORM/ODM",
      auth: "Authentication",
      addons: "Add-ons",
      packageManager: "Package Manager",
      git: "Git Repository",
      install: "Install Dependencies",
    };
    return titles[cat] || cat;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {getCategoryTitle(category)}
        </h2>
        {notes && notes.hasIssue && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ {notes.notes.join(", ")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(category, option.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${
                isSelected(option.id)
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${option.color || "bg-gray-200 dark:bg-gray-700"}
                `}
              >
                {option.icon ? (
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-2xl">{option.emoji || "📦"}</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.name}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              {isSelected(option.id) && (
                <div className="text-blue-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
