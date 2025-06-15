
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import { medications, Medication } from '@/data/medications';
import { Search, ShieldAlert, Siren } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasHighAlert = (med: Medication) => med.alerts.some(a => a.level === 'High Alert');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a medication (e.g., Epinephrine)"
            className="w-full pl-10 pr-4 py-6 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            <p className="text-gray-500 text-lg">No medications found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
