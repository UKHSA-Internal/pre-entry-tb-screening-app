import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HISTORY_KEY = "navigationHistory";
const MAX_HISTORY_SIZE = 50;

const getNavigationHistory = (): string[] => {
  try {
    const stored = sessionStorage.getItem(HISTORY_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
};

const setNavigationHistory = (history: string[]): void => {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to set navigation history:", error);
  }
};

export const clearNavigationHistory = (): void => {
  try {
    sessionStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear navigation history:", error);
  }
};

export const useNavigationHistory = (shouldClearHistory = false) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldClearHistory) {
      clearNavigationHistory();
      return;
    }

    const history = getNavigationHistory();
    const currentPath = location.pathname + location.search + location.hash;

    if (history.length === 0 || history[history.length - 1] !== currentPath) {
      const newHistory = [...history, currentPath];
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }
      setNavigationHistory(newHistory);
    }
  }, [location, shouldClearHistory]);

  const goBack = (fallbackUrl: string) => {
    const history = getNavigationHistory();
    const currentPath = location.pathname + location.search + location.hash;

    if (history.length > 1) {
      const currentIndex = history.lastIndexOf(currentPath);
      if (currentIndex > 0) {
        const previousPath = history[currentIndex - 1];
        const newHistory = history.slice(0, currentIndex);
        setNavigationHistory(newHistory);
        navigate(previousPath);
        return;
      }
    }

    navigate(fallbackUrl);
  };

  return { goBack };
};
