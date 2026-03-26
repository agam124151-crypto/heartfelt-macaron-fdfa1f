import { Bell, BellOff } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useAuth } from "../contexts/AuthContext";
import { mockContent } from "../data/articles";

export function FollowTopics() {
  const { followedTopics, toggleFollowTopic } = useAppData();
  const { user } = useAuth();

  const categories = Array.from(new Set(mockContent.map(post => post.category)));

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Follow Topics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Log in to follow topics and get personalized content recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Bell className="size-5 text-amber-500" />
        Follow Topics
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Get notified about new articles in your favorite topics
      </p>

      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const isFollowing = followedTopics.includes(category);
          
          return (
            <button
              key={category}
              onClick={() => toggleFollowTopic(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                isFollowing
                  ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-500'
              }`}
            >
              {isFollowing ? (
                <Bell className="size-4" />
              ) : (
                <BellOff className="size-4" />
              )}
              <span className="font-medium">{category}</span>
            </button>
          );
        })}
      </div>

      {followedTopics.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            📬 You're following {followedTopics.length} topic{followedTopics.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
