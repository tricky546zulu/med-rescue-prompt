
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'med-rescue-favorites';
const RECENT_SEARCHES_KEY = 'med-rescue-recent-searches';
const RECENT_MEDICATIONS_KEY = 'med-rescue-recent-medications';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentMedications, setRecentMedications] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedRecentSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    const savedRecentMedications = localStorage.getItem(RECENT_MEDICATIONS_KEY);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecentSearches) {
      setRecentSearches(JSON.parse(savedRecentSearches));
    }
    if (savedRecentMedications) {
      setRecentMedications(JSON.parse(savedRecentMedications));
    }
  }, []);

  const toggleFavorite = (medicationId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(medicationId)
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const addRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(term => term !== searchTerm);
      const newRecent = [searchTerm, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const addRecentMedication = (medicationId: string) => {
    setRecentMedications(prev => {
      const filtered = prev.filter(id => id !== medicationId);
      const newRecent = [medicationId, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_MEDICATIONS_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const clearRecentMedications = () => {
    setRecentMedications([]);
    localStorage.removeItem(RECENT_MEDICATIONS_KEY);
  };

  const isFavorite = (medicationId: string) => favorites.includes(medicationId);

  return {
    favorites,
    recentSearches,
    recentMedications,
    toggleFavorite,
    addRecentSearch,
    addRecentMedication,
    clearRecentSearches,
    clearRecentMedications,
    isFavorite
  };
};
