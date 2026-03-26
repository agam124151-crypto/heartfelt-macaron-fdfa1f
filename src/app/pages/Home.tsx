import { useState } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { ContentCard } from "../components/ContentCard";
import { AuthModal } from "../components/AuthModal";
import { UserStatsPanel } from "../components/UserStatsPanel";
import { TrendingArticles } from "../components/TrendingArticles";
import { FollowTopics } from "../components/FollowTopics";
import { SortFilterPanel, SortOption } from "../components/SortFilterPanel";
import { useAuth } from "../contexts/AuthContext";
import { useAppData } from "../contexts/AppDataContext";
import { mockContent } from "../data/articles";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  const { login, savedArticles, user } = useAuth();
  const { analytics } = useAppData();

  const categories = Array.from(new Set(mockContent.map(post => post.category)));
  
  // Filter by saved articles if needed
  let content = showSavedOnly 
    ? mockContent.filter(post => savedArticles.includes(post.id))
    : mockContent;

  // Filter by category
  const categoryFiltered = selectedCategory === "All" 
    ? content 
    : content.filter(post => post.category === selectedCategory);
  
  // Filter by search query
  const filteredContent = searchQuery.trim() === ""
    ? categoryFiltered
    : categoryFiltered.filter(post => {
        const query = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(query) ||
               post.excerpt.toLowerCase().includes(query) ||
               post.content.toLowerCase().includes(query) ||
               post.category.toLowerCase().includes(query);
      });

  // Sort content based on the selected sort option
  const sortedContent = filteredContent.sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    login(email, password);
    setIsAuthModalOpen(false);
  };

  const handleSavedClick = () => {
    setShowSavedOnly(!showSavedOnly);
    if (!showSavedOnly) {
      setSelectedCategory("All");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header 
        searchQuery={searchQuery} 
        onSearch={setSearchQuery}
        onSearchClick={() => setIsSearchOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onSavedClick={handleSavedClick}
      />
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
      />

      {!showSavedOnly && (
        <FilterBar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Panel */}
        {user && <UserStatsPanel />}

        {/* Sort Options */}
        {!showSavedOnly && (
          <div className="mb-6">
            <SortFilterPanel sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        )}

        {showSavedOnly && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Saved Articles</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {savedArticles.length === 0 
                ? "You haven't saved any articles yet. Start exploring and save articles to read later!"
                : `You have ${savedArticles.length} saved article${savedArticles.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
        )}

        {searchQuery && sortedContent.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {sortedContent.length} {sortedContent.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
        )}

        {/* Main Content Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-2">
            {sortedContent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No articles found matching your criteria.</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedContent.map((post) => (
                  <ContentCard 
                    key={post.id} 
                    {...post} 
                    searchQuery={searchQuery}
                    onSpeakingChange={setCurrentSpeakingId}
                    currentSpeakingId={currentSpeakingId}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrendingArticles onCategoryClick={setSelectedCategory} />
            <FollowTopics />
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}