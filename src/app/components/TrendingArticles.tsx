import { TrendingUp, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { mockContent } from "../data/articles";
import { useAppData } from "../contexts/AppDataContext";

interface TrendingArticlesProps {
  onCategoryClick?: (category: string) => void;
}

export function TrendingArticles({ onCategoryClick }: TrendingArticlesProps) {
  const { analytics } = useAppData();
  const navigate = useNavigate();

  // Sort articles by views
  const trendingArticles = mockContent
    .map(article => ({
      ...article,
      viewCount: analytics.views[article.id] || Math.floor(Math.random() * 1000) + 100
    }))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(category);
      // Scroll to top of page to see filtered results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <TrendingUp className="size-5 text-orange-500" />
        Trending Now
      </h2>

      <div className="space-y-4">
        {trendingArticles.map((article, index) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="flex gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="size-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                <button
                  onClick={(e) => handleCategoryClick(e, article.category)}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {article.category}
                </button>
                <div className="flex items-center gap-1">
                  <Eye className="size-3" />
                  <span>{article.viewCount.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}