
import { useParams, Link } from 'react-router-dom';
import { medications } from '@/data/medications';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldAlert, Siren, Info } from 'lucide-react';
import DosageCalculator from '@/components/DosageCalculator';

const alertIcons = {
  'High Alert': <Siren className="h-5 w-5 mr-2 text-red-500" />,
  'Caution': <ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />,
  'Info': <Info className="h-5 w-5 mr-2 text-blue-500" />,
};

const alertColors = {
  'High Alert': 'bg-red-100 text-red-800 border-red-200',
  'Caution': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Info': 'bg-blue-100 text-blue-800 border-blue-200',
}

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const medication = medications.find((m) => m.id === id);

  if (!medication) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold">Medication not found.</h2>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            &larr; Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Search
        </Link>
        
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-100 border-b">
              <h1 className="text-3xl font-extrabold text-gray-900">{medication.name}</h1>
              <p className="text-lg text-gray-500">{medication.category}</p>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-base text-gray-700">{medication.description}</p>
            </CardContent>
          </Card>
          
          {medication.alerts.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Alerts & Cautions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {medication.alerts.map((alert, index) => (
                        <div key={index} className={`flex items-start p-4 rounded-lg border ${alertColors[alert.level]}`}>
                            {alertIcons[alert.level]}
                            <div>
                                <h4 className="font-bold">{alert.level}</h4>
                                <p>{alert.text}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-xl">Indications</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {medication.indications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl">Contraindications</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {medication.contraindications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>

            {medication.concentrations && medication.concentrations.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-xl">Concentrations</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medication.concentrations.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}

            {medication.palsaclsAlgorithms && medication.palsaclsAlgorithms.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-xl">Relevant Algorithms</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medication.palsaclsAlgorithms.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          {medication.lookAlikeSoundAlike && medication.lookAlikeSoundAlike.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />Look-Alike/Sound-Alike</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {medication.lookAlikeSoundAlike.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-xl">Dosage</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {medication.dosage.map((dose, i) => (
                <div key={i} className="border-l-4 border-gray-200 pl-4">
                  <p className="font-semibold text-gray-800">{dose.population}</p>
                  <p className="text-gray-600">{dose.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <DosageCalculator medication={medication} />

          <Card>
            <CardHeader><CardTitle className="text-xl">Administration</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-semibold">Routes:</span>
                {medication.administration.routes.map((route) => (
                  <Badge key={route} variant="secondary">{route}</Badge>
                ))}
              </div>
              <p className="text-gray-700">{medication.administration.notes}</p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default MedicationDetail;
