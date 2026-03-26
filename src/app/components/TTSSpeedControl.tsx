import { Gauge } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";

export function TTSSpeedControl() {
  const { ttsSpeed, setTTSSpeed } = useAppData();

  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <Gauge className="size-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Speed:</span>
      </div>
      
      {/* Scrollable container on mobile */}
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="flex items-center gap-2 min-w-max sm:flex-wrap sm:min-w-0 pt-2 sm:pt-0 sm:ml-auto">
          {speeds.map(speed => (
            <button
              key={speed.value}
              onClick={() => setTTSSpeed(speed.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                ttsSpeed === speed.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label={`${speed.label} speed`}
            >
              {speed.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}