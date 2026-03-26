import { useEffect } from "react";
import { useNavigate } from "react-router";
import { mockContent } from "../data/articles";

interface KeyboardShortcutsProps {
  currentArticleId?: number;
}

export function KeyboardShortcuts({ currentArticleId }: KeyboardShortcutsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'h':
          navigate('/');
          break;
        case 'j':
          // Next article
          if (currentArticleId) {
            const currentIndex = mockContent.findIndex(a => a.id === currentArticleId);
            if (currentIndex < mockContent.length - 1) {
              navigate(`/article/${mockContent[currentIndex + 1].id}`);
            }
          }
          break;
        case 'k':
          // Previous article
          if (currentArticleId) {
            const currentIndex = mockContent.findIndex(a => a.id === currentArticleId);
            if (currentIndex > 0) {
              navigate(`/article/${mockContent[currentIndex - 1].id}`);
            }
          }
          break;
        case '/':
          e.preventDefault();
          // Trigger search
          document.querySelector<HTMLButtonElement>('[aria-label="Search"]')?.click();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentArticleId, navigate]);

  return null; // This component doesn't render anything
}
