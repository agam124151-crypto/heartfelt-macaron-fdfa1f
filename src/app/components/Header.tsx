import { Calendar } from "lucide-react";
import { Search, Bookmark, User, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onSearchClick: () => void;
  onAuthClick: () => void;
  onSavedClick?: () => void;
}

export function Header({ onSearch, searchQuery, onSearchClick, onAuthClick, onSavedClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-800 sticky top-0 z-50 shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="relative flex-shrink-0">
              {/* Creative Logo - Sunrise with Insight Rays */}
              <div className="size-9 sm:size-11 relative">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background circle */}
                  <circle cx="24" cy="24" r="23" fill="url(#gradient1)" />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                  
                  {/* Sun/Insight symbol */}
                  <circle cx="24" cy="26" r="8" fill="white" opacity="0.95" />
                  
                  {/* Rays representing daily insights */}
                  <path d="M24 8 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M24 34 L24 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40 24 L34 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M14 24 L8 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M35 13 L31 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M17 31 L13 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M35 35 L31 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M17 17 L13 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Center dot for "insight" */}
                  <circle cx="24" cy="26" r="3" fill="#F97316" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent truncate">
                Daily Insight
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate">Your daily dose of knowledge</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
            </button>

            {user && onSavedClick && (
              <button
                onClick={onSavedClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Saved articles"
              >
                <Bookmark className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <User className="size-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="size-4 sm:size-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                Log In
              </button>
            )}
            
            <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 ml-2">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}