
import React, { useState } from 'react';
import { Medication, Dosage } from '@/data/medications';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DosageCalculatorProps {
  medication: Medication;
}

interface CalculationResult {
  doseString: string;
  volumeString: string | null;
  isMaxDoseApplied: boolean;
  isMinDoseApplied: boolean;
  warnings: string[];
}

const DosageCalculator: React.FC<DosageCalculatorProps> = ({ medication }) => {
  const [weight, setWeight] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDosageIndex, setSelectedDosageIndex] = useState<number>(0);
  
  const weightBasedDosages = medication.dosage.filter(d => d.calculation?.type === 'perKg');
  const isHighAlert = medication.alerts.some(a => a.level === 'High Alert' || a.level === 'Black Box');

  if (weightBasedDosages.length === 0) {
    return null;
  }
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        setWeight(value);
        setIsConfirmed(false);
    }
  };

  const calculateDose = (dose: Dosage, patientWeight: number): CalculationResult => {
    const calc = dose.calculation;
    if (!calc || !patientWeight || patientWeight <= 0) {
        return { 
          doseString: 'Enter patient weight', 
          volumeString: null, 
          isMaxDoseApplied: false,
          isMinDoseApplied: false,
          warnings: []
        };
    }

    let rawDose: number | { min: number, max: number };
    const warnings: string[] = [];

    // Calculate base dose
    if (calc.dosePerKg) {
        rawDose = patientWeight * calc.dosePerKg;
    } else if (calc.dosePerKgMin && calc.dosePerKgMax) {
        rawDose = {
            min: patientWeight * calc.dosePerKgMin,
            max: patientWeight * calc.dosePerKgMax,
        };
    } else {
        return { 
          doseString: 'Calculation not available', 
          volumeString: null,
          isMaxDoseApplied: false,
          isMinDoseApplied: false,
          warnings: []
        };
    }
    
    let finalDose: number | { min: number, max: number } = rawDose;
    let isMaxDoseApplied = false;
    let isMinDoseApplied = false;

    // Apply maximum dose limits
    if (calc.maxDose) {
        if (typeof rawDose === 'number') {
            if (rawDose > calc.maxDose) {
              finalDose = calc.maxDose;
              isMaxDoseApplied = true;
              warnings.push(`Maximum dose of ${calc.maxDose} ${calc.doseUnit} applied`);
            }
        } else {
            const newMax = Math.min(rawDose.max, calc.maxDose);
            if (newMax < rawDose.max) {
              isMaxDoseApplied = true;
              warnings.push(`Maximum dose of ${calc.maxDose} ${calc.doseUnit} applied`);
            }
            finalDose = {
                min: rawDose.min,
                max: newMax
            };
        }
    }

    // Apply minimum dose limits
    if (calc.minDose) {
        if (typeof finalDose === 'number') {
            if (finalDose < calc.minDose) {
              finalDose = calc.minDose;
              isMinDoseApplied = true;
              warnings.push(`Minimum dose of ${calc.minDose} ${calc.doseUnit} applied`);
            }
        } else {
            const newMin = Math.max(finalDose.min, calc.minDose);
            if (newMin > finalDose.min) {
              isMinDoseApplied = true;
              warnings.push(`Minimum dose of ${calc.minDose} ${calc.doseUnit} applied`);
            }
            finalDose = {
                min: newMin,
                max: finalDose.max
            };
        }
    }

    // Format dose string
    let doseString: string;
    if (typeof finalDose === 'number') {
        const precision = calc.doseUnit === 'mcg' ? 1 : 3;
        doseString = `${Number(finalDose.toFixed(precision))} ${calc.doseUnit}`;
    } else {
        const precision = calc.doseUnit === 'mcg' ? 1 : 3;
        doseString = `${Number(finalDose.min.toFixed(precision))}-${Number(finalDose.max.toFixed(precision))} ${calc.doseUnit}`;
    }

    // Calculate volume if concentration is provided
    let volumeString: string | null = null;
    if (calc.concentration) {
        if (typeof finalDose === 'number') {
            const volume = finalDose / calc.concentration.value;
            volumeString = `${Number(volume.toFixed(2))} mL`;
        } else {
            const minVolume = finalDose.min / calc.concentration.value;
            const maxVolume = finalDose.max / calc.concentration.value;
            volumeString = `${Number(minVolume.toFixed(2))}-${Number(maxVolume.toFixed(2))} mL`;
        }
    }

    // Add weight-based warnings
    if (patientWeight < 2) {
      warnings.push('Neonatal dosing may require adjustment');
    }
    if (patientWeight > 100) {
      warnings.push('Adult dosing caps may apply for large patients');
    }

    return { 
      doseString, 
      volumeString, 
      isMaxDoseApplied, 
      isMinDoseApplied, 
      warnings 
    };
  };

  const clearCalculation = () => {
    setWeight('');
    setIsConfirmed(false);
    setSelectedDosageIndex(0);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center text-xl">
          <Calculator className="h-6 w-6 mr-2 text-blue-600" />
          Weight-Based Dose Calculator
          <Badge variant="secondary" className="ml-3">
            {weightBasedDosages.length} dosing option{weightBasedDosages.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Weight Input */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 flex-1">
            <Input 
              type="text"
              inputMode="decimal"
              placeholder="Enter patient weight" 
              value={weight} 
              onChange={handleWeightChange}
              className="max-w-[200px] text-lg font-semibold"
            />
            <span className="font-semibold text-gray-700 text-lg">kg</span>
          </div>
          
          {weight && (
            <Button variant="outline" size="sm" onClick={clearCalculation}>
              Clear
            </Button>
          )}
        </div>

        {/* Dosage Selection */}
        {weightBasedDosages.length > 1 && (
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Select Dosing Population:
            </Label>
            <div className="grid gap-2">
              {weightBasedDosages.map((dose, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`dosage-${index}`}
                    name="dosage-selection"
                    checked={selectedDosageIndex === index}
                    onChange={() => setSelectedDosageIndex(index)}
                    className="text-blue-600"
                  />
                  <Label htmlFor={`dosage-${index}`} className="cursor-pointer font-medium">
                    {dose.population}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* High Alert Confirmation */}
        {weight && parseFloat(weight) > 0 && isHighAlert && !isConfirmed && (
          <div className="p-4 mt-4 bg-red-50 border border-red-300 rounded-lg animate-in fade-in duration-300">
            <div className="flex">
              <ShieldAlert className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex items-center space-x-3">
                <Checkbox id="double-check" onCheckedChange={(checked) => setIsConfirmed(checked === true)} />
                <Label htmlFor="double-check" className="font-bold cursor-pointer leading-relaxed text-red-800">
                  High-Alert Medication: Confirm dose calculation has been double-checked.
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Calculation Results */}
        {weight && parseFloat(weight) > 0 && (!isHighAlert || isConfirmed) && (
          <div className="space-y-4 animate-in fade-in duration-300 mt-6">
            {weightBasedDosages.map((dose, index) => {
              if (weightBasedDosages.length > 1 && index !== selectedDosageIndex) return null;
              
              const patientWeight = parseFloat(weight);
              const result = calculateDose(dose, patientWeight);
              
              return (
                <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 text-lg">{dose.population}</h4>
                    <div className="flex gap-2">
                      {result.isMaxDoseApplied && (
                        <Badge variant="destructive" className="text-xs">MAX</Badge>
                      )}
                      {result.isMinDoseApplied && (
                        <Badge variant="secondary" className="text-xs">MIN</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Calculated Dose:</p>
                      <p className="text-blue-600 font-bold text-2xl">{result.doseString}</p>
                    </div>
                    {result.volumeString && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Volume to Draw:</p>
                        <p className="text-green-600 font-bold text-xl">{result.volumeString}</p>
                        {dose.calculation?.concentration && (
                          <p className="text-xs text-gray-500 mt-1">
                            Using {dose.calculation.concentration.value} {dose.calculation.concentration.unit}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2">
                      {result.warnings.map((warning, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-yellow-700">{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-600 italic">{dose.details}</p>
                  </div>
                </div>
              );
            })}

            {/* Additional Safety Reminders */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-2">Safety Reminders:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Always verify calculations with a second clinician</li>
                    <li>• Check medication concentration before drawing</li>
                    <li>• Confirm patient weight is accurate and recent</li>
                    <li>• Review contraindications and allergies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DosageCalculator;
