import { ArrowUpDown, Filter } from "lucide-react";

export type SortOption = 'latest' | 'oldest' | 'popular' | 'shortest' | 'longest';

interface SortFilterPanelProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFilters?: boolean;
}

export function SortFilterPanel({ sortBy, onSortChange, showFilters = true }: SortFilterPanelProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'shortest', label: 'Shortest Read' },
    { value: 'longest', label: 'Longest Read' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-0">
        <ArrowUpDown className="size-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
      </div>

      {/* Scrollable container on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0 pt-2 sm:pt-0">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                sortBy === option.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}