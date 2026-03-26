import { Type } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";

export function FontSizeControl() {
  const { fontSize, setFontSize } = useAppData();

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
      <Type className="size-5 text-gray-600 dark:text-gray-400" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFontSize('small')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            fontSize === 'small'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Small font size"
        >
          A
        </button>
        <button
          onClick={() => setFontSize('medium')}
          className={`px-3 py-1.5 rounded text-base font-medium transition-colors ${
            fontSize === 'medium'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Medium font size"
        >
          A
        </button>
        <button
          onClick={() => setFontSize('large')}
          className={`px-3 py-1.5 rounded text-lg font-medium transition-colors ${
            fontSize === 'large'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Large font size"
        >
          A
        </button>
      </div>
    </div>
  );
}
