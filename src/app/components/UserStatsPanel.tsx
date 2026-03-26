import { Flame, Book, Target, Trophy, TrendingUp } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useAuth } from "../contexts/AuthContext";

export function UserStatsPanel() {
  const { userStats, readingHistory } = useAppData();
  const { user } = useAuth();

  if (!user) return null;

  const achievements = [
    { threshold: 10, label: "Getting Started", icon: "🌱" },
    { threshold: 50, label: "Avid Reader", icon: "📚" },
    { threshold: 100, label: "Knowledge Seeker", icon: "🎓" },
    { threshold: 500, label: "Master Reader", icon: "👑" }
  ];

  const currentAchievement = achievements.reverse().find(
    a => userStats.totalArticlesRead >= a.threshold
  ) || achievements[achievements.length - 1];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Trophy className="size-6 text-amber-500" />
        Your Reading Stats
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Reading Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="size-5 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {userStats.readingStreak}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">days</p>
        </div>

        {/* Articles Read */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Book className="size-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Articles</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {userStats.totalArticlesRead}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">read</p>
        </div>

        {/* Reading Time */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="size-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {Math.floor(userStats.totalReadingTime / 60)}h
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {userStats.totalReadingTime % 60}m
          </p>
        </div>

        {/* Achievement */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentAchievement.icon}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {currentAchievement.label}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border-t dark:border-gray-800 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Recently Read ({readingHistory.slice(0, 5).length})
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {readingHistory.length === 0 ? (
            <p>Start reading to see your history here!</p>
          ) : (
            <p>
              Keep up the great work! You've read {readingHistory.length} articles recently.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
