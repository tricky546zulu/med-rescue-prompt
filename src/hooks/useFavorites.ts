
import { useState, useEffect } from 'react';

/** Maximum number of items to store in recent searches and medications lists. */
const MAX_RECENT_ITEMS = 10;

/** localStorage key for storing favorited medication IDs. */
const FAVORITES_KEY = 'med-rescue-favorites';
/** localStorage key for storing recent search terms. */
const RECENT_SEARCHES_KEY = 'med-rescue-recent-searches';
/** localStorage key for storing recently viewed medication IDs. */
const RECENT_MEDICATIONS_KEY = 'med-rescue-recent-medications';

/**
 * @typedef {function(string[]): void} SetStringArrayFunction
 */

/**
 * Helper function to add an item to a list of recent items,
 * manage its size, and persist to localStorage.
 * Not exported from the hook.
 * @param {string} item - The item to add to the list.
 * @param {string[]} list - The current list of items.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} setListFunction - The React state setter for the list.
 * @param {string} listKey - The localStorage key for persisting the list.
 */
const _addItemToRecentList = (
  item: string,
  list: string[],
  setListFunction: React.Dispatch<React.SetStateAction<string[]>>,
  listKey: string
) => {
  const filteredList = list.filter(existingItem => existingItem !== item);
  const newList = [item, ...filteredList].slice(0, MAX_RECENT_ITEMS);
  setListFunction(newList);
  localStorage.setItem(listKey, JSON.stringify(newList));
};

/**
 * Custom hook to manage user's favorite medications, recent searches, and recently viewed medications.
 * Data is persisted to localStorage.
 * @returns {{
 *   favorites: string[],
 *   recentSearches: string[],
 *   recentMedications: string[],
 *   toggleFavorite: (medicationId: string) => void,
 *   addRecentSearch: (searchTerm: string) => void,
 *   addRecentMedication: (medicationId: string) => void,
 *   clearRecentSearches: () => void,
 *   clearRecentMedications: () => void,
 *   isFavorite: (medicationId: string) => boolean
 * }}
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentMedications, setRecentMedications] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
      setFavorites([]); // Fallback to empty array on error
    }

    // Load recent searches from localStorage
    try {
      const savedRecentSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (savedRecentSearches) {
        setRecentSearches(JSON.parse(savedRecentSearches));
      }
    } catch (error) {
      console.error('Error parsing recent searches from localStorage:', error);
      setRecentSearches([]); // Fallback to empty array on error
    }

    // Load recent medications from localStorage
    try {
      const savedRecentMedications = localStorage.getItem(RECENT_MEDICATIONS_KEY);
      if (savedRecentMedications) {
        setRecentMedications(JSON.parse(savedRecentMedications));
      }
    } catch (error) {
      console.error('Error parsing recent medications from localStorage:', error);
      setRecentMedications([]); // Fallback to empty array on error
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
    _addItemToRecentList(searchTerm, recentSearches, setRecentSearches, RECENT_SEARCHES_KEY);
  };

  const addRecentMedication = (medicationId: string) => {
    // Assuming medicationId will always be a non-empty string if this function is called
    if (!medicationId) return;
    _addItemToRecentList(medicationId, recentMedications, setRecentMedications, RECENT_MEDICATIONS_KEY);
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
