import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites'; // Adjust path if necessary
import {
  FAVORITES_KEY,
  RECENT_SEARCHES_KEY,
  RECENT_MEDICATIONS_KEY,
  // MAX_RECENT_ITEMS // Not directly exported, but used internally by the hook. We'll use a local const for test assertions.
} from './useFavorites';

const MAX_RECENT_ITEMS_FOR_TEST = 10; // Align with the hook's internal constant

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFavorites Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    // Spy on console.error for testing corrupted JSON handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty arrays if localStorage is empty', () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual([]);
      expect(result.current.recentSearches).toEqual([]);
      expect(result.current.recentMedications).toEqual([]);
    });

    it('should initialize with data from localStorage if present', () => {
      const mockFavorites = ['med1', 'med2'];
      const mockSearches = ['search1', 'search2'];
      const mockMedications = ['medHist1', 'medHist2'];
      localStorageMock.setItem(FAVORITES_KEY, JSON.stringify(mockFavorites));
      localStorageMock.setItem(RECENT_SEARCHES_KEY, JSON.stringify(mockSearches));
      localStorageMock.setItem(RECENT_MEDICATIONS_KEY, JSON.stringify(mockMedications));

      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual(mockFavorites);
      expect(result.current.recentSearches).toEqual(mockSearches);
      expect(result.current.recentMedications).toEqual(mockMedications);
    });

    it('should handle corrupted JSON in localStorage for favorites', () => {
      localStorageMock.setItem(FAVORITES_KEY, 'corrupted_json');
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error parsing favorites from localStorage:', expect.any(SyntaxError));
    });

    it('should handle corrupted JSON in localStorage for recent searches', () => {
      localStorageMock.setItem(RECENT_SEARCHES_KEY, 'corrupted_json_searches');
      const { result } = renderHook(() => useFavorites());
      expect(result.current.recentSearches).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error parsing recent searches from localStorage:', expect.any(SyntaxError));
    });

    it('should handle corrupted JSON in localStorage for recent medications', () => {
      localStorageMock.setItem(RECENT_MEDICATIONS_KEY, 'corrupted_json_meds');
      const { result } = renderHook(() => useFavorites());
      expect(result.current.recentMedications).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error parsing recent medications from localStorage:', expect.any(SyntaxError));
    });
  });

  describe('Favorites', () => {
    it('should add a favorite, update state and localStorage', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite('med1');
      });
      expect(result.current.favorites).toEqual(['med1']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(FAVORITES_KEY, JSON.stringify(['med1']));
      expect(result.current.isFavorite('med1')).toBe(true);
    });

    it('should remove a favorite, update state and localStorage', () => {
      localStorageMock.setItem(FAVORITES_KEY, JSON.stringify(['med1', 'med2']));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite('med1');
      });
      expect(result.current.favorites).toEqual(['med2']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(FAVORITES_KEY, JSON.stringify(['med2']));
      expect(result.current.isFavorite('med1')).toBe(false);
      expect(result.current.isFavorite('med2')).toBe(true);
    });

    it('should not add a duplicate favorite', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite('med1');
      });
      act(() => {
        result.current.toggleFavorite('med1'); // Attempt to remove it
      });
       act(() => {
        result.current.toggleFavorite('med1'); // Attempt to add it again
      });
      expect(result.current.favorites).toEqual(['med1']); // Should still be just ['med1']
    });

    it('isFavorite should return false for non-favorite item', () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.isFavorite('nonexistent')).toBe(false);
    });
  });

  describe('Recent Searches', () => {
    it('should add a recent search term', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentSearch('aspirin');
      });
      expect(result.current.recentSearches).toEqual(['aspirin']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_SEARCHES_KEY, JSON.stringify(['aspirin']));
    });

    it('should move an existing search term to the top', () => {
      localStorageMock.setItem(RECENT_SEARCHES_KEY, JSON.stringify(['ibuprofen', 'paracetamol']));
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentSearch('paracetamol');
      });
      expect(result.current.recentSearches).toEqual(['paracetamol', 'ibuprofen']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_SEARCHES_KEY, JSON.stringify(['paracetamol', 'ibuprofen']));
    });

    it('should maintain MAX_RECENT_ITEMS limit', () => {
      const initialSearches = Array.from({ length: MAX_RECENT_ITEMS_FOR_TEST }, (_, i) => `search${i}`);
      localStorageMock.setItem(RECENT_SEARCHES_KEY, JSON.stringify(initialSearches));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addRecentSearch('newSearch');
      });

      const expectedSearches = ['newSearch', ...initialSearches.slice(0, MAX_RECENT_ITEMS_FOR_TEST - 1)];
      expect(result.current.recentSearches).toEqual(expectedSearches);
      expect(result.current.recentSearches.length).toBe(MAX_RECENT_ITEMS_FOR_TEST);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_SEARCHES_KEY, JSON.stringify(expectedSearches));
    });

    it('should clear recent searches', () => {
      localStorageMock.setItem(RECENT_SEARCHES_KEY, JSON.stringify(['search1']));
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.clearRecentSearches();
      });
      expect(result.current.recentSearches).toEqual([]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(RECENT_SEARCHES_KEY);
    });

    it('should not add empty or short search terms', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentSearch('  ');
      });
      expect(result.current.recentSearches).toEqual([]);
      act(() => {
        result.current.addRecentSearch('a');
      });
      expect(result.current.recentSearches).toEqual([]);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Recent Medications', () => {
    it('should add a recent medication ID', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentMedication('medID1');
      });
      expect(result.current.recentMedications).toEqual(['medID1']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_MEDICATIONS_KEY, JSON.stringify(['medID1']));
    });

    it('should move an existing medication ID to the top', () => {
      localStorageMock.setItem(RECENT_MEDICATIONS_KEY, JSON.stringify(['medID2', 'medID3']));
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentMedication('medID3');
      });
      expect(result.current.recentMedications).toEqual(['medID3', 'medID2']);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_MEDICATIONS_KEY, JSON.stringify(['medID3', 'medID2']));
    });

    it('should maintain MAX_RECENT_ITEMS limit', () => {
      const initialMedications = Array.from({ length: MAX_RECENT_ITEMS_FOR_TEST }, (_, i) => `med${i}`);
      localStorageMock.setItem(RECENT_MEDICATIONS_KEY, JSON.stringify(initialMedications));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addRecentMedication('newMed');
      });

      const expectedMedications = ['newMed', ...initialMedications.slice(0, MAX_RECENT_ITEMS_FOR_TEST - 1)];
      expect(result.current.recentMedications).toEqual(expectedMedications);
      expect(result.current.recentMedications.length).toBe(MAX_RECENT_ITEMS_FOR_TEST);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(RECENT_MEDICATIONS_KEY, JSON.stringify(expectedMedications));
    });

    it('should clear recent medications', () => {
      localStorageMock.setItem(RECENT_MEDICATIONS_KEY, JSON.stringify(['medID1']));
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.clearRecentMedications();
      });
      expect(result.current.recentMedications).toEqual([]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(RECENT_MEDICATIONS_KEY);
    });

    it('should not add empty medication ID (though current hook impl allows it, good to note)', () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.addRecentMedication(''); // The hook has a check for medicationId
      });
      // Based on current hook implementation: if (!medicationId) return;
      expect(result.current.recentMedications).toEqual([]);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
});
