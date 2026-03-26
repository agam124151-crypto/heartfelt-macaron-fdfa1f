import { Calendar, Clock } from "lucide-react";
import { Bookmark, Volume2, Square } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { useState, useEffect } from "react";

interface ContentCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  searchQuery?: string;
  onSpeakingChange?: (id: number | null) => void;
  currentSpeakingId?: number | null;
}

export function ContentCard({ 
  id, 
  title, 
  excerpt, 
  category, 
  date, 
  readTime, 
  image, 
  searchQuery,
  onSpeakingChange,
  currentSpeakingId
}: ContentCardProps) {
  const { user, savedArticles, toggleSaveArticle } = useAuth();
  const isSaved = savedArticles.includes(id);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Stop speaking if another card is speaking
    if (currentSpeakingId !== null && currentSpeakingId !== id && isSpeaking) {
      setIsSpeaking(false);
    }
  }, [currentSpeakingId, id, isSpeaking]);

  const handleTextToSpeech = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(null);
    } else {
      // Cancel any other speaking
      speechSynthesis.cancel();
      
      const textToRead = `${title}. ${excerpt}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(null);
      };

      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      onSpeakingChange?.(id);
    }
  };

  // Function to highlight search terms
  const highlightText = (text: string, query?: string) => {
    if (!query || query.trim() === "") {
      return <span>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-gray-100 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <Link to={`/article/${id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800 dark:text-gray-200">
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleTextToSpeech}
              className={`p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all ${
                isSpeaking ? 'ring-2 ring-amber-500' : ''
              }`}
              aria-label={isSpeaking ? "Stop reading" : "Read article aloud"}
              title={isSpeaking ? "Stop reading" : "Read article aloud"}
            >
              {isSpeaking ? (
                <Square className="size-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Volume2 className="size-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            {user && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleSaveArticle(id);
                }}
                className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label={isSaved ? "Unsave article" : "Save article"}
              >
                <Bookmark 
                  className={`size-4 ${isSaved ? "fill-amber-500 text-amber-500" : "text-gray-700 dark:text-gray-300"}`}
                />
              </button>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {highlightText(title, searchQuery)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {highlightText(excerpt, searchQuery)}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}