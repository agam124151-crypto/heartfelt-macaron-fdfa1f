import { Badge } from "./ui/badge";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterBar({ categories, selectedCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Horizontal scrollable container for mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            <Badge
              variant={selectedCategory === "All" ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-4 py-2 whitespace-nowrap"
              onClick={() => onCategoryChange("All")}
            >
              All Topics
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-4 py-2 whitespace-nowrap"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}