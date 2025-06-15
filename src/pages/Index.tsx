
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from '@/components/Header';
import { medications, Medication } from '@/data/medications';
import MedicationFilters from '@/components/MedicationFilters';
import { Search, Siren, Filter } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    alertLevels: [] as string[],
    adminRoutes: [] as string[],
  });

  const fuse = useMemo(() => new Fuse(medications, {
    keys: ['name', 'category', 'description', 'indications', 'lookAlikeSoundAlike'],
    includeScore: true,
    threshold: 0.4,
  }), []);

  const allCategories = useMemo(() => [...new Set(medications.map(m => m.category))].sort(), []);
  const allAlertLevels = useMemo(() => ['High Alert', 'Caution', 'Info'], []);
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

  const hasHighAlert = (med: Medication) => med.alerts.some(a => a.level === 'High Alert');
  
  const quickAccessScenarios = ["Cardiac Arrest", "Anaphylaxis", "Seizures", "Pain Management"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, condition, or category..."
              className="w-full pl-10 pr-4 py-6 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="text-sm font-semibold text-gray-600 self-center mr-2">Quick Access:</span>
            {quickAccessScenarios.map(scenario => (
              <Button key={scenario} variant="outline" size="sm" onClick={() => setSearchTerm(scenario)}>
                {scenario}
              </Button>
            ))}
          </div>

          <Accordion type="single" collapsible className="w-full mb-8">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
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
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedications.map((med) => (
            <Link to={`/medication/${med.id}`} key={med.id} className="group">
              <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:border-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-800">{med.name}</CardTitle>
                    {hasHighAlert(med) && (
                      <div className="flex items-center text-red-500">
                        <Siren className="h-5 w-5 mr-1" />
                        <span className="font-semibold">High Alert</span>
                      </div>
                    )}
                  </div>
                  <CardDescription>{med.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3">{med.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {filteredMedications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No medications found matching your search and filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
