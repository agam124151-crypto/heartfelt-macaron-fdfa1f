import { Plus, List, Trash2, FolderPlus } from "lucide-react";
import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { mockContent } from "../data/articles";

interface ReadingListsPanelProps {
  articleId?: number;
  showArticles?: boolean;
}

export function ReadingListsPanel({ articleId, showArticles = false }: ReadingListsPanelProps) {
  const { readingLists, createReadingList, addToReadingList, removeFromReadingList, deleteReadingList } = useAppData();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState("#f59e0b");

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-600 dark:text-gray-400">Log in to create and manage reading lists</p>
      </div>
    );
  }

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createReadingList(newListName.trim(), newListColor);
      setNewListName("");
      setIsCreating(false);
    }
  };

  const colors = [
    "#f59e0b", // amber
    "#ef4444", // red
    "#3b82f6", // blue
    "#10b981", // green
    "#8b5cf6", // purple
    "#ec4899", // pink
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <List className="size-5" />
          Reading Lists
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Create new list"
        >
          <Plus className="size-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateList} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewListColor(color)}
                className={`size-6 rounded-full border-2 ${
                  newListColor === color ? 'border-gray-900 dark:border-gray-100' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewListName("");
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {readingLists.map(list => {
          const isInList = articleId ? list.articleIds.includes(articleId) : false;
          const articlesInList = showArticles ? mockContent.filter(a => list.articleIds.includes(a.id)) : [];

          return (
            <div key={list.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {list.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    ({list.articleIds.length})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {articleId && (
                    <button
                      onClick={() => {
                        if (isInList) {
                          removeFromReadingList(list.id, articleId);
                        } else {
                          addToReadingList(list.id, articleId);
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        isInList
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {isInList ? 'Added' : 'Add'}
                    </button>
                  )}
                  {list.id !== 'favorites' && (
                    <button
                      onClick={() => deleteReadingList(list.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors"
                      aria-label="Delete list"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {showArticles && articlesInList.length > 0 && (
                <div className="mt-2 space-y-1">
                  {articlesInList.map(article => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 truncate"
                    >
                      • {article.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {readingLists.length === 0 && !isCreating && (
        <div className="text-center py-6">
          <FolderPlus className="size-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Create your first reading list to organize articles
          </p>
        </div>
      )}
    </div>
  );
}
