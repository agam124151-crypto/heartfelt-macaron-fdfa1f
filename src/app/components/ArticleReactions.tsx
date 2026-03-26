import { ThumbsUp, Heart, Flame, Lightbulb } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useAuth } from "../contexts/AuthContext";

interface ArticleReactionsProps {
  articleId: number;
}

export function ArticleReactions({ articleId }: ArticleReactionsProps) {
  const { reactions, addReaction, removeReaction, getArticleReactions, getReactionStats } = useAppData();
  const { user } = useAuth();
  
  const currentReaction = getArticleReactions(articleId);
  const stats = getReactionStats(articleId);

  const reactionTypes = [
    { type: 'like' as const, icon: ThumbsUp, label: 'Like', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', count: stats.like },
    { type: 'love' as const, icon: Heart, label: 'Love', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', count: stats.love },
    { type: 'fire' as const, icon: Flame, label: 'Fire', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', count: stats.fire },
    { type: 'think' as const, icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30', count: stats.think },
  ];

  const handleReaction = (type: 'like' | 'love' | 'fire' | 'think') => {
    if (!user) {
      alert('Please log in to react to articles');
      return;
    }

    if (currentReaction?.type === type) {
      removeReaction(articleId);
    } else {
      addReaction(articleId, type);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 my-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        How did you find this article?
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {reactionTypes.map(({ type, icon: Icon, label, color, bg, count }) => {
          const isActive = currentReaction?.type === type;
          
          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${
                isActive
                  ? `${bg} border-current ${color}`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              title={label}
            >
              <Icon className={`size-5 ${isActive ? color : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`font-medium ${isActive ? color : 'text-gray-700 dark:text-gray-300'}`}>
                {label}
              </span>
              <span className={`text-sm ${isActive ? color : 'text-gray-500 dark:text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {!user && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
          Log in to react to articles and see your reaction history
        </p>
      )}
    </div>
  );
}
