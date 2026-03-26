import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Bookmark, Volume2, Square, Eye, Calendar, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAppData } from "../contexts/AppDataContext";
import { mockContent } from "../data/articles";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { FontSizeControl } from "../components/FontSizeControl";
import { TTSSpeedControl } from "../components/TTSSpeedControl";
import { ArticleReactions } from "../components/ArticleReactions";
import { ReadingListsPanel } from "../components/ReadingListsPanel";
import { PrintButton } from "../components/PrintButton";
import { KeyboardShortcuts } from "../components/KeyboardShortcuts";
import { NewBadge } from "../components/NewBadge";
import { ShareSubscribe } from "../components/ShareSubscribe";

export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, savedArticles, toggleSaveArticle } = useAuth();
  const { 
    incrementViews, 
    addToHistory, 
    updateReadingStreak, 
    analytics,
    fontSize,
    ttsSpeed
  } = useAppData();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const article = mockContent.find(post => post.id === Number(id));

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);

    // Track views and reading history
    if (article) {
      incrementViews(article.id);
      addToHistory(article.id);
      if (user) {
        updateReadingStreak();
      }
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min((scrolled / documentHeight) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Article not found</h1>
          <Link 
            to="/" 
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedArticles.includes(article.id);

  const handleTextToSpeech = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article.title}. ${article.excerpt}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      utterance.rate = ttsSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ReadingProgressBar />
      <KeyboardShortcuts currentArticleId={article.id} />
      
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-800 sticky top-0 z-50 shadow-md backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="size-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="size-9 relative">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="24" cy="24" r="23" fill="url(#gradient1)" />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                    <circle cx="24" cy="26" r="8" fill="white" opacity="0.95" />
                    <path d="M24 8 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M24 34 L24 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M40 24 L34 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M14 24 L8 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M35 13 L31 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M17 31 L13 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M35 35 L31 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M17 17 L13 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="24" cy="26" r="3" fill="#F97316" />
                  </svg>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent hidden sm:block">
                  Daily Insight
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b dark:border-gray-800">
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="size-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{article.author}</p>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTextToSpeech}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                isSpeaking ? 'bg-amber-100 dark:bg-amber-900/30' : ''
              }`}
              aria-label={isSpeaking ? "Stop reading" : "Read article aloud"}
              title={isSpeaking ? "Stop reading" : "Read article aloud"}
            >
              {isSpeaking ? (
                <Square className="size-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Volume2 className="size-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            {user && (
              <button
                onClick={() => toggleSaveArticle(article.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label={isSaved ? "Unsave article" : "Save article"}
              >
                <Bookmark 
                  className={`size-5 ${isSaved ? "fill-amber-500 text-amber-500" : "text-gray-700 dark:text-gray-300"}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Tools Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <FontSizeControl />
          <TTSSpeedControl />
          <PrintButton />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Eye className="size-4" />
            <span>{(analytics.views[article.id] || 0).toLocaleString()} views</span>
          </div>
          <NewBadge date={article.date} />
        </div>

        {/* Article Content */}
        <div className={`prose max-w-none ${
          fontSize === 'small' ? 'prose-sm' : fontSize === 'large' ? 'prose-xl' : 'prose-lg'
        }`}>
          {article.content.split('\n\n').map((paragraph, index) => {
            // Check if paragraph is a heading (starts with **)
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              const heading = paragraph.replace(/\*\*/g, '');
              return (
                <h2 key={index} className={`font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 ${
                  fontSize === 'small' ? 'text-xl' : fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                }`}>
                  {heading}
                </h2>
              );
            }
            
            // Regular paragraph
            return (
              <p key={index} className={`text-gray-700 dark:text-gray-400 leading-relaxed mb-4 ${
                fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-xl' : 'text-base'
              }`}>
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Share and Subscribe Section */}
        <ShareSubscribe 
          articleTitle={article.title} 
          articleUrl={typeof window !== 'undefined' ? window.location.href : ''} 
        />

        {/* Reactions */}
        <ArticleReactions articleId={article.id} />

        {/* Reading Lists */}
        <ReadingListsPanel articleId={article.id} />

        {/* Related Articles */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">More from {article.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockContent
              .filter(post => post.category === article.category && post.id !== article.id)
              .slice(0, 2)
              .map(post => (
                <Link key={post.id} to={`/article/${post.id}`} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}
