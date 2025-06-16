import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import EmergencyToolbar from '@/components/EmergencyToolbar';
import { medications, Medication, getMedicationCategories } from '@/data/medications';
import MedicationFilters from '@/components/MedicationFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { Search, Siren, Filter, Heart, Zap, AlertTriangle, Star, Clock } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    alertLevels: [] as string[],
    adminRoutes: [] as string[],
  });

  const {
    favorites,
    recentSearches,
    recentMedications,
    toggleFavorite,
    addRecentSearch,
    addRecentMedication,
    isFavorite
  } = useFavorites();

  const fuse = useMemo(() => new Fuse(medications, {
    keys: ['name', 'genericName', 'category', 'subcategory', 'description', 'indications', 'lookAlikeSoundAlike'],
    includeScore: true,
    threshold: 0.3,
  }), []);

  const allCategories = useMemo(() => getMedicationCategories(), []);
  const allAlertLevels = useMemo(() => ['High Alert', 'Black Box', 'Caution', 'Info'], []);
  const allAdminRoutes = useMemo(() => [...new Set(medications.flatMap(m => m.administration.routes))].sort(), []);

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

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

  const filteredMedications = useMemo(() => {
    const searchResults = searchTerm
      ? fuse.search(searchTerm).map(result => result.item)
      : medications;

    return searchResults.filter((med) => {
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(med.category);
      const matchesAlertLevel = filters.alertLevels.length === 0 || med.alerts.some(a => filters.alertLevels.includes(a.level));
      const matchesAdminRoute = filters.adminRoutes.length === 0 || med.administration.routes.some(r => filters.adminRoutes.includes(r));
      return matchesCategory && matchesAlertLevel && matchesAdminRoute;
    });
  }, [searchTerm, filters, fuse]);

  const hasHighAlert = (med: Medication) => med.alerts.some(a => a.level === 'High Alert' || a.level === 'Black Box');
  const hasCaution = (med: Medication) => med.alerts.some(a => a.level === 'Caution');
  
  const quickAccessScenarios = [
    { name: "Cardiac Arrest", icon: Heart, color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { name: "Anaphylaxis", icon: AlertTriangle, color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    { name: "Seizures", icon: Zap, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { name: "Pain Management", icon: Star, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  ];

  const categoryStats = useMemo(() => {
    return allCategories.map(category => ({
      name: category,
      count: medications.filter(med => med.category === category).length,
      highAlert: medications.filter(med => med.category === category && hasHighAlert(med)).length
    }));
  }, [allCategories]);

  // Get recent and favorite medications for quick access
  const recentMeds = recentMedications
    .map(id => medications.find(med => med.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const favoriteMeds = favorites
    .map(id => medications.find(med => med.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Medication Reference</h1>
            <p className="text-lg text-gray-600 mb-6">Quick access to critical medication information for emergency situations</p>
            
            {/* Enhanced Search Bar */}
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onSuggestionClick={handleSuggestionClick}
              recentSearches={recentSearches}
              favorites={favorites}
            />
          </div>

          {/* Emergency Quick Access Toolbar */}
          <EmergencyToolbar 
            onScenarioSelect={setSearchTerm}
            className="mb-8"
          />
          
          {/* Quick Access - Recent & Favorites */}
          {(recentMeds.length > 0 || favoriteMeds.length > 0) && (
            <div className="mb-8 space-y-4">
              {recentMeds.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                    Recently Viewed
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {recentMeds.map(med => (
                      <Link key={med.id} to={`/medication/${med.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-20">
                          <CardContent className="p-3 flex items-center">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{med.name}</h3>
                              <p className="text-xs text-gray-500 truncate">{med.category}</p>
                            </div>
                            {hasHighAlert(med) && (
                              <Siren className="h-4 w-4 text-red-500 ml-2 flex-shrink-0" />
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {favoriteMeds.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Favorites
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {favoriteMeds.map(med => (
                      <Link key={med.id} to={`/medication/${med.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-20">
                          <CardContent className="p-3 flex items-center">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{med.name}</h3>
                              <p className="text-xs text-gray-500 truncate">{med.category}</p>
                            </div>
                            <Star className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0 fill-current" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Access Scenarios */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Quick Access by Emergency
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickAccessScenarios.map(scenario => {
                const IconComponent = scenario.icon;
                return (
                  <Button 
                    key={scenario.name} 
                    variant="outline" 
                    className={`h-16 ${scenario.color} border-2 transition-all duration-200 hover:scale-105 shadow-md`}
                    onClick={() => setSearchTerm(scenario.name)}
                  >
                    <div className="flex flex-col items-center">
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-sm font-medium">{scenario.name}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Category Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Medication Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryStats.slice(0, 6).map(category => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, categories: [category.name] }))}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.count} medications</p>
                      </div>
                      {category.highAlert > 0 && (
                        <Badge variant="destructive" className="flex items-center">
                          <Siren className="h-3 w-3 mr-1" />
                          {category.highAlert}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <Accordion type="single" collapsible className="w-full mb-8">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  {(filters.categories.length + filters.alertLevels.length + filters.adminRoutes.length) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.categories.length + filters.alertLevels.length + filters.adminRoutes.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <MedicationFilters
                  allCategories={allCategories}
                  allAlertLevels={allAlertLevels}
                  allAdminRoutes={allAdminRoutes}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Results Summary */}
          {(searchTerm || Object.values(filters).some(f => f.length > 0)) && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''} found
                </p>
                {(Object.values(filters).some(f => f.length > 0) || searchTerm) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ categories: [], alertLevels: [], adminRoutes: [] });
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Medication Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedications.map((med) => (
            <Link 
              to={`/medication/${med.id}`} 
              key={med.id} 
              className="group"
              onClick={() => addRecentMedication(med.id)}
            >
              <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:border-blue-500 group-hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                      {med.name}
                    </CardTitle>
                    <div className="flex flex-col gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(med.id);
                        }}
                      >
                        <Star className={`h-4 w-4 ${isFavorite(med.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </Button>
                      {hasHighAlert(med) && (
                        <div className="flex items-center text-red-500">
                          <Siren className="h-4 w-4" />
                        </div>
                      )}
                      {hasCaution(med) && !hasHighAlert(med) && (
                        <div className="flex items-center text-yellow-500">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {med.category}
                    </Badge>
                    {med.subcategory && (
                      <Badge variant="outline" className="text-xs">
                        {med.subcategory}
                      </Badge>
                    )}
                  </div>
                  
                  {med.genericName && (
                    <CardDescription className="text-xs text-gray-500 italic">
                      {med.genericName}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="flex-grow pt-0">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{med.description}</p>
                  
                  {/* Key Indications */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Primary Uses:</h4>
                    <div className="flex flex-wrap gap-1">
                      {med.indications.slice(0, 2).map((indication, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs py-0 px-1">
                          {indication}
                        </Badge>
                      ))}
                      {med.indications.length > 2 && (
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          +{med.indications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Routes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {med.administration.routes.slice(0, 3).map((route) => (
                        <Badge key={route} variant="secondary" className="text-xs py-0 px-1">
                          {route}
                        </Badge>
                      ))}
                      {med.administration.routes.length > 3 && (
                        <Badge variant="secondary" className="text-xs py-0 px-1">
                          +{med.administration.routes.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Onset/Duration if available */}
                  {med.onsetDuration && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Onset: {med.onsetDuration.onset}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMedications.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No medications found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ categories: [], alertLevels: [], adminRoutes: [] });
                }}
              >
                Clear Search & Filters
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
