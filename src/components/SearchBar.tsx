
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Star, X } from 'lucide-react';
import { medications } from '@/data/medications';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  recentSearches?: string[];
  favorites?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSuggestionClick,
  recentSearches = [],
  favorites = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) {
      return {
        medications: [],
        categories: [],
        indications: []
      };
    }

    const searchTerm = value.toLowerCase();
    
    // Get medication suggestions
    const medicationSuggestions = medications
      .filter(med => 
        med.name.toLowerCase().includes(searchTerm) ||
        med.genericName?.toLowerCase().includes(searchTerm) ||
        med.category.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5)
      .map(med => ({
        type: 'medication' as const,
        value: med.name,
        subtitle: med.genericName || med.category,
        isFavorite: favorites.includes(med.id)
      }));

    // Get category suggestions
    const categories = [...new Set(medications.map(m => m.category))];
    const categorySuggestions = categories
      .filter(cat => cat.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(cat => ({
        type: 'category' as const,
        value: cat,
        subtitle: `${medications.filter(m => m.category === cat).length} medications`
      }));

    // Get indication suggestions
    const allIndications = medications.flatMap(m => m.indications);
    const indicationSuggestions = [...new Set(allIndications)]
      .filter(ind => ind.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(ind => ({
        type: 'indication' as const,
        value: ind,
        subtitle: 'Medical condition'
      }));

    return {
      medications: medicationSuggestions,
      categories: categorySuggestions,
      indications: indicationSuggestions
    };
  }, [value, favorites]);

  const allSuggestions = [
    ...suggestions.medications,
    ...suggestions.categories,
    ...suggestions.indications
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && allSuggestions[focusedIndex]) {
          handleSuggestionClick(allSuggestions[focusedIndex].value);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (showSuggestions && focusedIndex >= 0 && suggestionsRef.current) {
      const focusedElement = suggestionsRef.current.children[focusedIndex + (recentSearches.length > 0 ? 1 : 0)] as HTMLElement;
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, showSuggestions, recentSearches.length]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search medications, conditions, or categories..."
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (value.length >= 2 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && value.length < 2 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Medication Suggestions */}
          {suggestions.medications.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 font-semibold">MEDICATIONS</div>
              {suggestions.medications.map((suggestion, index) => (
                <div
                  key={`med-${index}`}
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                    focusedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.value)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.value}</div>
                    <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                  </div>
                  {suggestion.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 px-2 py-1 font-semibold">CATEGORIES</div>
              {suggestions.categories.map((suggestion, index) => (
                <div
                  key={`cat-${index}`}
                  className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                    focusedIndex === suggestions.medications.length + index ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.value)}
                >
                  <div className="font-medium text-gray-900">{suggestion.value}</div>
                  <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                </div>
              ))}
            </div>
          )}

          {/* Indication Suggestions */}
          {suggestions.indications.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 px-2 py-1 font-semibold">CONDITIONS</div>
              {suggestions.indications.map((suggestion, index) => (
                <div
                  key={`ind-${index}`}
                  className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                    focusedIndex === suggestions.medications.length + suggestions.categories.length + index ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.value)}
                >
                  <div className="font-medium text-gray-900">{suggestion.value}</div>
                  <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
