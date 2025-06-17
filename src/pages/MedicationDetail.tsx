
import { useParams, Link } from 'react-router-dom';
import { medications } from '@/data/medications';
import Header from '@/components/Header';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, Siren, Info, Clock, AlertTriangle, Heart, Star, Eye } from 'lucide-react';
import DosageCalculator from '@/components/DosageCalculator';

const alertIcons = {
  'High Alert': <Siren className="h-5 w-5 mr-2 text-red-500" />,
  'Black Box': <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />,
  'Caution': <ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />,
  'Info': <Info className="h-5 w-5 mr-2 text-blue-500" />,
};

const alertColors = {
  'High Alert': 'bg-red-100 text-red-800 border-red-200',
  'Black Box': 'bg-red-200 text-red-900 border-red-300',
  'Caution': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Info': 'bg-blue-100 text-blue-800 border-blue-200',
};

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const medication = medications.find((m) => m.id === id);
  const isMobile = useIsMobile();

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

  const hasWeightBasedDosing = medication.dosage.some(d => d.calculation?.type === 'perKg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 group transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>
          
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h1 className="text-3xl font-extrabold mb-2">{medication.name}</h1>
                    {medication.genericName && (
                      <p className="text-blue-100 text-lg italic mb-2">({medication.genericName})</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-white text-blue-700 text-sm px-3 py-1">
                        {medication.category}
                      </Badge>
                      {medication.subcategory && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                          {medication.subcategory}
                        </Badge>
                      )}
                      {medication.pregnancyCategory && (
                        <Badge variant="outline" className="bg-white text-blue-700 border-white text-sm px-3 py-1">
                          Pregnancy: {medication.pregnancyCategory}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
                      <Star className="h-4 w-4 mr-1" />
                      Favorite
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-1" />
                      Quick View
                    </Button>
                  </div>
                </div>
                
                {/* Onset/Duration */}
                {medication.onsetDuration && (
                  <div className="bg-blue-800 bg-opacity-50 rounded-lg p-3 flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-blue-200" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-200">Onset: </span>
                        <span className="font-semibold">{medication.onsetDuration.onset}</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Duration: </span>
                        <span className="font-semibold">{medication.onsetDuration.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <p className="text-lg text-gray-700 leading-relaxed">{medication.description}</p>
              </CardContent>
            </Card>

            <Accordion
              type="multiple"
              defaultValue={isMobile ? [] : ["alerts", "indications", "contraindications", "dosage", "administration", "concentrations", "reversal", "lookAlike", "interactions"]}
              className="space-y-6"
            >
              {/* Alerts & Safety Information */}
              {medication.alerts.length > 0 && (
                <Card className="shadow-lg">
                  <AccordionItem value="alerts">
                    <AccordionTrigger className="p-6 w-full">
                      <CardTitle className="text-xl flex items-center">
                        <ShieldAlert className="h-6 w-6 mr-2 text-red-500" />
                        Safety Alerts & Warnings
                      </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <CardContent className="space-y-4 pt-0">
                        {medication.alerts.map((alert, index) => (
                          <div key={index} className={`flex items-start p-4 rounded-lg border-l-4 ${alertColors[alert.level]}`}>
                            {alertIcons[alert.level]}
                            <div className="flex-1">
                              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{alert.level}</h4>
                              <p className="leading-relaxed">{alert.text}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Indications & Contraindications */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-md">
                      <AccordionItem value="indications">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-green-100">
                          <CardHeader className="bg-green-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg flex items-center text-green-800">
                              <Heart className="h-5 w-5 mr-2" />
                              Indications
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {medication.indications.map((item, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>

                    <Card className="shadow-md">
                      <AccordionItem value="contraindications">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-red-100">
                           <CardHeader className="bg-red-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg flex items-center text-red-800">
                              <AlertTriangle className="h-5 w-5 mr-2" />
                              Contraindications
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {medication.contraindications.map((item, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  </div>

                  {/* Dosage Information */}
                  <Card className="shadow-lg">
                    <AccordionItem value="dosage">
                      <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-blue-100">
                         <CardHeader className="bg-blue-50 w-full rounded-t-lg">
                          <CardTitle className="text-xl text-blue-800">Dosage Guidelines</CardTitle>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {medication.dosage.map((dose, i) => (
                              <div key={i} className="border-l-4 border-blue-500 pl-6 py-2">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-gray-800 text-lg">{dose.population}</h4>
                                  {dose.calculation && (
                                    <Badge variant="secondary" className="text-xs">
                                      Weight-based
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{dose.details}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        {/* Weight-Based Calculator */}
                        {hasWeightBasedDosing && <DosageCalculator medication={medication} />}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>

                  {/* Administration */}
                  <Card className="shadow-md">
                    <AccordionItem value="administration">
                      <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-purple-100">
                        <CardHeader className="bg-purple-50 w-full rounded-t-lg">
                          <CardTitle className="text-lg text-purple-800">Administration</CardTitle>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Routes:</h4>
                              <div className="flex flex-wrap gap-2">
                                {medication.administration.routes.map((route) => (
                                  <Badge key={route} variant="secondary" className="px-3 py-1">
                                    {route}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Administration Notes:</h4>
                              <p className="text-gray-700 leading-relaxed">{medication.administration.notes}</p>
                            </div>

                            {medication.administration.monitoring && (
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Monitoring Parameters:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {medication.administration.monitoring.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                </div>

                {/* Right Column - Additional Information */}
                <div className="space-y-6">
                  {/* Concentrations */}
                  {medication.concentrations && medication.concentrations.length > 0 && (
                    <Card className="shadow-md">
                      <AccordionItem value="concentrations">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-gray-100">
                          <CardHeader className="bg-gray-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg">Available Concentrations</CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {medication.concentrations.map((item, i) => (
                                <li key={i} className="bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  )}

                  {/* Reversal Agent */}
                  {medication.reversal && (
                    <Card className="shadow-md border-orange-200">
                      <AccordionItem value="reversal">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-orange-100">
                           <CardHeader className="bg-orange-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg text-orange-800">Reversal Agent</CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <div className="bg-orange-100 p-3 rounded-lg">
                              <p className="font-semibold text-orange-800">{medication.reversal}</p>
                            </div>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  )}

                  {/* Look-Alike/Sound-Alike */}
                  {medication.lookAlikeSoundAlike && medication.lookAlikeSoundAlike.length > 0 && (
                    <Card className="shadow-md border-yellow-200">
                      <AccordionItem value="lookAlike">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-yellow-100">
                          <CardHeader className="bg-yellow-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg flex items-center text-yellow-800">
                              <ShieldAlert className="h-5 w-5 mr-2" />
                              Look-Alike/Sound-Alike
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              {medication.lookAlikeSoundAlike.map((item, i) => (
                                <div key={i} className="bg-yellow-100 px-3 py-2 rounded">
                                  <span className="font-medium text-yellow-800">⚠️ {item}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  )}

                  {/* Drug Interactions */}
                  {medication.interactions && medication.interactions.length > 0 && (
                    <Card className="shadow-md border-red-200">
                      <AccordionItem value="interactions">
                        <AccordionTrigger className="p-0 w-full [&[data-state=open]>div]:bg-red-100">
                          <CardHeader className="bg-red-50 w-full rounded-t-lg">
                            <CardTitle className="text-lg text-red-800">Major Interactions</CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {medication.interactions.map((item, i) => (
                                <li key={i} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  )}
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicationDetail;
