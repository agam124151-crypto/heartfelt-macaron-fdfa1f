import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for all app data
interface ReadingHistoryItem {
  articleId: number;
  timestamp: number;
  progress: number; // 0-100%
}

interface Reaction {
  articleId: number;
  type: 'like' | 'love' | 'fire' | 'think';
  timestamp: number;
}

interface ReadingList {
  id: string;
  name: string;
  articleIds: number[];
  color: string;
}

interface UserStats {
  totalArticlesRead: number;
  readingStreak: number;
  lastReadDate: string | null;
  favoriteCategory: string;
  totalReadingTime: number; // in minutes
}

interface ArticleAnalytics {
  views: Record<number, number>;
  shareCount: Record<number, number>;
  completionRate: Record<number, number>;
}

interface AppDataContextType {
  // Reading History
  readingHistory: ReadingHistoryItem[];
  addToHistory: (articleId: number, progress?: number) => void;
  getArticleProgress: (articleId: number) => number;
  
  // Reactions
  reactions: Reaction[];
  addReaction: (articleId: number, type: 'like' | 'love' | 'fire' | 'think') => void;
  removeReaction: (articleId: number) => void;
  getArticleReactions: (articleId: number) => Reaction | undefined;
  getReactionStats: (articleId: number) => Record<string, number>;
  
  // Reading Lists
  readingLists: ReadingList[];
  createReadingList: (name: string, color: string) => void;
  addToReadingList: (listId: string, articleId: number) => void;
  removeFromReadingList: (listId: string, articleId: number) => void;
  deleteReadingList: (listId: string) => void;
  
  // User Stats
  userStats: UserStats;
  updateReadingStreak: () => void;
  
  // Article Analytics
  analytics: ArticleAnalytics;
  incrementViews: (articleId: number) => void;
  incrementShares: (articleId: number) => void;
  updateCompletionRate: (articleId: number, rate: number) => void;
  
  // Followed Topics
  followedTopics: string[];
  toggleFollowTopic: (topic: string) => void;
  
  // Font Size
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // TTS Speed
  ttsSpeed: number;
  setTTSSpeed: (speed: number) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => {
    const saved = localStorage.getItem('readingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [reactions, setReactions] = useState<Reaction[]>(() => {
    const saved = localStorage.getItem('reactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [readingLists, setReadingLists] = useState<ReadingList[]>(() => {
    const saved = localStorage.getItem('readingLists');
    return saved ? JSON.parse(saved) : [
      { id: 'favorites', name: 'Favorites', articleIds: [], color: '#f59e0b' }
    ];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      totalArticlesRead: 0,
      readingStreak: 0,
      lastReadDate: null,
      favoriteCategory: 'Technology',
      totalReadingTime: 0
    };
  });

  const [analytics, setAnalytics] = useState<ArticleAnalytics>(() => {
    const saved = localStorage.getItem('analytics');
    return saved ? JSON.parse(saved) : {
      views: {},
      shareCount: {},
      completionRate: {}
    };
  });

  const [followedTopics, setFollowedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('followedTopics');
    return saved ? JSON.parse(saved) : [];
  });

  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });

  const [ttsSpeed, setTTSSpeedState] = useState<number>(() => {
    const saved = localStorage.getItem('ttsSpeed');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
  }, [readingHistory]);

  useEffect(() => {
    localStorage.setItem('reactions', JSON.stringify(reactions));
  }, [reactions]);

  useEffect(() => {
    localStorage.setItem('readingLists', JSON.stringify(readingLists));
  }, [readingLists]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem('followedTopics', JSON.stringify(followedTopics));
  }, [followedTopics]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ttsSpeed', ttsSpeed.toString());
  }, [ttsSpeed]);

  // Reading History Functions
  const addToHistory = (articleId: number, progress: number = 0) => {
    setReadingHistory(prev => {
      const filtered = prev.filter(item => item.articleId !== articleId);
      return [{ articleId, timestamp: Date.now(), progress }, ...filtered].slice(0, 50);
    });
  };

  const getArticleProgress = (articleId: number) => {
    const item = readingHistory.find(h => h.articleId === articleId);
    return item?.progress || 0;
  };

  // Reactions Functions
  const addReaction = (articleId: number, type: 'like' | 'love' | 'fire' | 'think') => {
    setReactions(prev => {
      const filtered = prev.filter(r => r.articleId !== articleId);
      return [...filtered, { articleId, type, timestamp: Date.now() }];
    });
  };

  const removeReaction = (articleId: number) => {
    setReactions(prev => prev.filter(r => r.articleId !== articleId));
  };

  const getArticleReactions = (articleId: number) => {
    return reactions.find(r => r.articleId === articleId);
  };

  const getReactionStats = (articleId: number) => {
    // In a real app, this would aggregate from all users
    // For now, return mock data
    return {
      like: Math.floor(Math.random() * 100) + 20,
      love: Math.floor(Math.random() * 80) + 10,
      fire: Math.floor(Math.random() * 60) + 5,
      think: Math.floor(Math.random() * 40) + 3
    };
  };

  // Reading Lists Functions
  const createReadingList = (name: string, color: string) => {
    const newList: ReadingList = {
      id: Date.now().toString(),
      name,
      articleIds: [],
      color
    };
    setReadingLists(prev => [...prev, newList]);
  };

  const addToReadingList = (listId: string, articleId: number) => {
    setReadingLists(prev => prev.map(list => {
      if (list.id === listId && !list.articleIds.includes(articleId)) {
        return { ...list, articleIds: [...list.articleIds, articleId] };
      }
      return list;
    }));
  };

  const removeFromReadingList = (listId: string, articleId: number) => {
    setReadingLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, articleIds: list.articleIds.filter(id => id !== articleId) };
      }
      return list;
    }));
  };

  const deleteReadingList = (listId: string) => {
    if (listId !== 'favorites') { // Prevent deleting default list
      setReadingLists(prev => prev.filter(list => list.id !== listId));
    }
  };

  // User Stats Functions
  const updateReadingStreak = () => {
    const today = new Date().toDateString();
    const lastRead = userStats.lastReadDate ? new Date(userStats.lastReadDate).toDateString() : null;
    
    if (lastRead === today) {
      return; // Already read today
    }
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastRead === yesterday ? userStats.readingStreak + 1 : 1;
    
    setUserStats(prev => ({
      ...prev,
      readingStreak: newStreak,
      lastReadDate: today,
      totalArticlesRead: prev.totalArticlesRead + 1
    }));
  };

  // Analytics Functions
  const incrementViews = (articleId: number) => {
    setAnalytics(prev => ({
      ...prev,
      views: {
        ...prev.views,
        [articleId]: (prev.views[articleId] || 0) + 1
      }
    }));
  };

  const incrementShares = (articleId: number) => {
    setAnalytics(prev => ({
      ...prev,
      shareCount: {
        ...prev.shareCount,
        [articleId]: (prev.shareCount[articleId] || 0) + 1
      }
    }));
  };

  const updateCompletionRate = (articleId: number, rate: number) => {
    setAnalytics(prev => ({
      ...prev,
      completionRate: {
        ...prev.completionRate,
        [articleId]: rate
      }
    }));
  };

  // Followed Topics Functions
  const toggleFollowTopic = (topic: string) => {
    setFollowedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  // Font Size Functions
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
  };

  // TTS Speed Functions
  const setTTSSpeed = (speed: number) => {
    setTTSSpeedState(speed);
  };

  const value: AppDataContextType = {
    readingHistory,
    addToHistory,
    getArticleProgress,
    reactions,
    addReaction,
    removeReaction,
    getArticleReactions,
    getReactionStats,
    readingLists,
    createReadingList,
    addToReadingList,
    removeFromReadingList,
    deleteReadingList,
    userStats,
    updateReadingStreak,
    analytics,
    incrementViews,
    incrementShares,
    updateCompletionRate,
    followedTopics,
    toggleFollowTopic,
    fontSize,
    setFontSize,
    ttsSpeed,
    setTTSSpeed
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
