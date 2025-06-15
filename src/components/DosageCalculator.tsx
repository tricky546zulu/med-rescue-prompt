
import React, { useState } from 'react';
import { Medication, Dosage } from '@/data/medications';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator } from 'lucide-react';

interface DosageCalculatorProps {
  medication: Medication;
}

const DosageCalculator: React.FC<DosageCalculatorProps> = ({ medication }) => {
  const [weight, setWeight] = useState<string>('');
  
  const weightBasedDosages = medication.dosage.filter(d => d.calculation?.type === 'perKg');

  if (weightBasedDosages.length === 0) {
    return null;
  }
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        setWeight(value);
    }
  };

  const calculateDose = (dose: Dosage, patientWeight: number) => {
    const calc = dose.calculation;
    if (!calc || !patientWeight || patientWeight <= 0) {
        return { doseString: 'Enter patient weight', volumeString: null };
    }

    let rawDose: number | { min: number, max: number };

    if (calc.dosePerKg) {
        rawDose = patientWeight * calc.dosePerKg;
    } else if (calc.dosePerKgMin && calc.dosePerKgMax) {
        rawDose = {
            min: patientWeight * calc.dosePerKgMin,
            max: patientWeight * calc.dosePerKgMax,
        };
    } else {
        return { doseString: 'Calculation not available', volumeString: null };
    }
    
    let finalDose: number | { min: number, max: number } = rawDose;
    if (calc.maxDose) {
        if (typeof rawDose === 'number') {
            finalDose = Math.min(rawDose, calc.maxDose);
        } else {
            finalDose = {
                min: rawDose.min,
                max: Math.min(rawDose.max, calc.maxDose)
            };
        }
    }

    let doseString: string;
    if (typeof finalDose === 'number') {
        doseString = `${Number(finalDose.toFixed(3))} ${calc.doseUnit}`;
    } else {
        doseString = `${Number(finalDose.min.toFixed(3))}-${Number(finalDose.max.toFixed(3))} ${calc.doseUnit}`;
    }
    
    if (calc.maxDose && ((typeof rawDose === 'number' && rawDose > calc.maxDose) || (typeof rawDose !== 'number' && rawDose.max > calc.maxDose))) {
        doseString += ` (max dose applies)`;
    }

    let volumeString: string | null = null;
    if (calc.concentration) {
        if (typeof finalDose === 'number') {
            const volume = finalDose / calc.concentration.value;
            volumeString = `~ ${Number(volume.toFixed(2))} mL`;
        } else {
            const minVolume = finalDose.min / calc.concentration.value;
            const maxVolume = finalDose.max / calc.concentration.value;
            volumeString = `~ ${Number(minVolume.toFixed(2))}-${Number(maxVolume.toFixed(2))} mL`;
        }
    }

    return { doseString, volumeString };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Calculator className="h-5 w-5 mr-2 text-blue-600" />
          Weight-Based Dose Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Input 
            type="text"
            inputMode="decimal"
            placeholder="Enter patient weight" 
            value={weight} 
            onChange={handleWeightChange}
            className="max-w-[200px] text-base"
          />
          <span className="font-semibold text-gray-700">kg</span>
        </div>
        
        {weight && parseFloat(weight) > 0 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {weightBasedDosages.map((dose, index) => {
              const patientWeight = parseFloat(weight);
              const { doseString, volumeString } = calculateDose(dose, patientWeight);
              return (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-gray-800">{dose.population}</p>
                   <div className="flex flex-wrap items-baseline gap-x-4">
                     <p className="text-blue-600 font-bold text-2xl">{doseString}</p>
                     {volumeString && <p className="text-green-600 font-bold text-xl">{volumeString}</p>}
                   </div>
                  <p className="text-sm text-gray-500 mt-1">{dose.details}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DosageCalculator;
