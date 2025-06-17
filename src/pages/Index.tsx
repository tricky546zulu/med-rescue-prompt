
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import SearchBar from '@/components/SearchBar';
import EmergencyToolbar from '@/components/EmergencyToolbar';
import RedditCard from '@/components/RedditCard';
import RedditSidebar from '@/components/RedditSidebar';
import SortingTabs from '@/components/SortingTabs';
import FloatingActionButton from '@/components/FloatingActionButton';
import { medications, Medication, getMedicationCategories } from '@/data/medications';
import { useFavorites } from '@/hooks/useFavorites';
import { Search, Menu } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('hot');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showSearch, setShowSearch] = useState(false);

  const {
    favorites,
    recentSearches,
    recentMedications,
    toggleFavorite,
    addRecentSearch,
    addRecentMedication,
    isFavorite
  } = useFavorites();

  // Simulated vote states (in real app, this would come from backend)
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  const fuse = useMemo(() => new Fuse(medications, {
    keys: ['name', 'genericName', 'category', 'subcategory', 'description', 'indications', 'lookAlikeSoundAlike'],
    includeScore: true,
    threshold: 0.3,
  }), []);

  const allCategories = useMemo(() => getMedicationCategories(), []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() && value.length >= 2) {
      addRecentSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    addRecentSearch(suggestion);
  };

  const handleVote = (medicationId: string, direction: 'up' | 'down') => {
    setVotes(prev => ({
      ...prev,
      [medicationId]: prev[medicationId] === direction ? null : direction
    }));
    
    // Convert to favorite system
    if (direction === 'up') {
      toggleFavorite(medicationId);
    }
  };

  const handleView = (medicationId: string) => {
    addRecentMedication(medicationId);
    setViewCounts(prev => ({
      ...prev,
      [medicationId]: (prev[medicationId] || 0) + 1
    }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const filteredMedications = useMemo(() => {
    let results = searchTerm
      ? fuse.search(searchTerm).map(result => result.item)
      : medications;

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(med => med.category === selectedCategory);
    }

    // Apply sorting
    switch (currentSort) {
      case 'hot':
        // Sort by recent views + favorites
        results = results.sort((a, b) => {
          const aScore = (viewCounts[a.id] || 0) + (isFavorite(a.id) ? 10 : 0);
          const bScore = (viewCounts[b.id] || 0) + (isFavorite(b.id) ? 10 : 0);
          return bScore - aScore;
        });
        break;
      case 'new':
        // Sort alphabetically (simulate recency)
        results = results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'emergency':
        // Sort by high alert medications first
        results = results.sort((a, b) => {
          const aAlert = a.alerts.some(alert => alert.level === 'High Alert' || alert.level === 'Black Box');
          const bAlert = b.alerts.some(alert => alert.level === 'High Alert' || alert.level === 'Black Box');
          if (aAlert && !bAlert) return -1;
          if (!aAlert && bAlert) return 1;
          return 0;
        });
        break;
    }

    return results;
  }, [searchTerm, selectedCategory, currentSort, fuse, viewCounts, isFavorite]);

  const categoryStats = useMemo(() => {
    return allCategories.map(category => ({
      name: category,
      count: medications.filter(med => med.category === category).length,
      highAlert: medications.filter(med => 
        med.category === category && 
        med.alerts.some(a => a.level === 'High Alert' || a.level === 'Black Box')
      ).length
    }));
  }, [allCategories]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <RedditSidebar
          onCategorySelect={handleCategorySelect}
          onFilterSelect={setCurrentSort}
          selectedCategory={selectedCategory}
          categoryStats={categoryStats}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto p-4 max-w-4xl">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Emergency Medicine</h1>
                  <p className="text-sm text-muted-foreground">Critical medication reference</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Bar - Hidden on mobile unless toggled */}
              <div className={`${showSearch ? 'block' : 'hidden'} md:block mb-4`}>
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onSuggestionClick={handleSuggestionClick}
                  recentSearches={recentSearches}
                  favorites={favorites}
                />
              </div>

              {/* Emergency Toolbar */}
              <EmergencyToolbar 
                onScenarioSelect={setSearchTerm}
                className="mb-4"
              />

              {/* Sorting and View Controls */}
              <SortingTabs
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                resultCount={filteredMedications.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Medication Feed */}
            <div className="space-y-3">
              {filteredMedications.map((medication) => (
                <RedditCard
                  key={medication.id}
                  medication={medication}
                  onView={handleView}
                  onVote={handleVote}
                  userVote={votes[medication.id]}
                  viewCount={viewCounts[medication.id]}
                  compact={viewMode === 'compact'}
                />
              ))}

              {filteredMedications.length === 0 && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No medications found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or category filters.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                    >
                      Clear Search & Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile FAB */}
        <FloatingActionButton
          variant="search"
          onClick={() => setShowSearch(!showSearch)}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
