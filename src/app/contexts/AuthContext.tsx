import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  savedArticles: number[];
  toggleSaveArticle: (articleId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedArticles, setSavedArticles] = useState<number[]>([]);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("dailyInsightUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load saved articles from localStorage
    const storedSaved = localStorage.getItem("dailyInsightSaved");
    if (storedSaved) {
      setSavedArticles(JSON.parse(storedSaved));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Simulate login - in real app, this would call an API
    const newUser = { email, name: email.split("@")[0] };
    setUser(newUser);
    localStorage.setItem("dailyInsightUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dailyInsightUser");
  };

  const toggleSaveArticle = (articleId: number) => {
    setSavedArticles((prev) => {
      const newSaved = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      
      localStorage.setItem("dailyInsightSaved", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, savedArticles, toggleSaveArticle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
