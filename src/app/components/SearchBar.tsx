import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, isOpen, onClose }: SearchBarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Search Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg animate-in slide-in-from-top duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-12 py-4 text-lg rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 transition-colors"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close search"
            >
              <X className="size-6" />
            </button>
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Press Enter to search or Esc to close
            </div>
          )}
        </div>
      </div>
    </>
  );
}