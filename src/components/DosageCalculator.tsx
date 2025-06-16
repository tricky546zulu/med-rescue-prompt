
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

// --- Refactored Dosage Calculation Helper Logic ---

// Helper types for dose calculation
type RawDoseType = number | { min: number; max: number };

interface DoseCappingResult {
  finalDose: RawDoseType;
  isMaxDoseApplied: boolean;
  isMinDoseApplied: boolean;
  capWarnings: string[];
}

/**
 * Calculates the base dose from medication data and patient weight.
 * @param {NonNullable<Dosage['calculation']>} calc - The calculation configuration from medication data.
 * @param {number} patientWeight - The patient's weight in kilograms.
 * @returns {RawDoseType | null} The raw calculated dose (number or min/max range) or null if parameters are invalid.
 */
export const _getBaseDose = (calc: NonNullable<Dosage['calculation']>, patientWeight: number): RawDoseType | null => {
  if (calc.dosePerKg) {
    return patientWeight * calc.dosePerKg;
  } else if (calc.dosePerKgMin && calc.dosePerKgMax) {
    if (calc.dosePerKgMin > calc.dosePerKgMax) {
      // Invalid configuration: min dose is greater than max dose
      // console.error("Invalid medication configuration: dosePerKgMin > dosePerKgMax");
      return null; // Or handle as an error appropriately
    }
    return {
      min: patientWeight * calc.dosePerKgMin,
      max: patientWeight * calc.dosePerKgMax,
    };
  }
  // console.error("Unsupported dose calculation type or missing parameters.");
  return null; // Indicates an issue with medication data or unsupported calculation type
};

/**
 * Applies absolute minimum and maximum dose caps to a calculated dose.
 * @param {RawDoseType} rawDoseParam - The raw dose, possibly a range.
 * @param {NonNullable<Dosage['calculation']>} calc - Medication calculation rules.
 * @returns {DoseCappingResult} Object with the capped dose, flags for applied caps, and warnings.
 */
export const _applyDoseCaps = (rawDoseParam: RawDoseType, calc: NonNullable<Dosage['calculation']>): DoseCappingResult => {
  // Deep copy to avoid modifying the original rawDose object, especially if it's a range.
  const rawDose = JSON.parse(JSON.stringify(rawDoseParam)) as RawDoseType;
  let finalDose: RawDoseType = rawDose;

  let isMaxDoseApplied = false;
  let isMinDoseApplied = false;
  const capWarnings: string[] = [];

  // Apply maximum dose limits
  if (typeof calc.maxDose === 'number') {
    if (typeof finalDose === 'number') {
      if (finalDose > calc.maxDose) {
        finalDose = calc.maxDose;
        isMaxDoseApplied = true;
        capWarnings.push(`Maximum absolute dose of ${calc.maxDose} ${calc.doseUnit} applied.`);
      }
    } else { // Range dose
      if (finalDose.max > calc.maxDose) {
        finalDose.max = calc.maxDose;
        isMaxDoseApplied = true;
        capWarnings.push(`Maximum absolute dose of ${calc.maxDose} ${calc.doseUnit} applied to range.`);
      }
      // If the min of the range itself is now greater than the capped max, adjust min.
      if (finalDose.min > finalDose.max) {
        finalDose.min = finalDose.max;
        // This implies an adjustment to min due to max capping, so consider it a form of min dose application.
        isMinDoseApplied = true;
        capWarnings.push(`Minimum dose in range adjusted to match capped maximum dose.`);
      }
    }
  }

  // Apply minimum dose limits
  if (typeof calc.minDose === 'number') {
    if (typeof finalDose === 'number') {
      if (finalDose < calc.minDose) {
        finalDose = calc.minDose;
        isMinDoseApplied = true;
        capWarnings.push(`Minimum absolute dose of ${calc.minDose} ${calc.doseUnit} applied.`);
      }
    } else { // Range dose
      if (finalDose.min < calc.minDose) {
        finalDose.min = calc.minDose;
        isMinDoseApplied = true;
        capWarnings.push(`Minimum absolute dose of ${calc.minDose} ${calc.doseUnit} applied to range.`);
      }
      // After applying min cap, if min now exceeds max (e.g. maxDose was also applied and was very low, or minDose > maxDose)
      // This specific condition (minDose > maxDose from config) should ideally be caught earlier or flagged.
      if (finalDose.min > finalDose.max) {
        finalDose.max = finalDose.min; // Max should not be less than the absolute min cap.
        // This implies an adjustment to max due to min capping, so consider it a form of max dose application.
        isMaxDoseApplied = true;
        capWarnings.push(`Maximum dose in range adjusted to match applied minimum dose.`);
      }
    }
  }

  // Final sanity check for range doses: ensure min <= max.
  // This handles cases where initial rawDose.min > rawDose.max or complex interactions of caps.
  if (typeof finalDose !== 'number' && finalDose.min > finalDose.max) {
    // This situation implies an issue with the initial range or capping logic that wasn't fully resolved.
    // For safety, could set min = max, or flag as an error.
    // Let's prioritize the maximum value if such a conflict occurs post-capping.
    capWarnings.push(`Dose range conflict: Min dose (${finalDose.min}) exceeded Max dose (${finalDose.max}). Adjusted min to match max.`);
    finalDose.min = finalDose.max;
    isMinDoseApplied = true; // Min was adjusted.
  }

  return { finalDose, isMaxDoseApplied, isMinDoseApplied, capWarnings };
};

/**
 * Formats a numeric dose or dose range into a display string.
 * @param {RawDoseType} finalDose - The dose value or range.
 * @param {string} doseUnit - The unit of the dose (e.g., "mg", "mcg").
 * @returns {string} A formatted string representing the dose.
 */
export const _formatDoseString = (finalDose: RawDoseType, doseUnit: string): string => {
  const precision = doseUnit.toLowerCase() === 'mcg' ? 0 : 2;
  if (typeof finalDose === 'number') {
    return `${Number(finalDose.toFixed(precision))} ${doseUnit}`;
  } else {
    const minVal = finalDose.min ?? 0;
    const maxVal = finalDose.max ?? 0;
    return `${Number(minVal.toFixed(precision))}-${Number(maxVal.toFixed(precision))} ${doseUnit}`;
  }
};

/**
 * Calculates the volume of medication to administer.
 * @param {RawDoseType} finalDose - The final dose (number or range).
 * @param {Dosage['calculation']['concentration']} concentration - Concentration details.
 * @returns {string | null} Formatted volume string (e.g., "5 mL", "2.5-5 mL") or null if not applicable.
 */
export const _calculateVolume = (finalDose: RawDoseType, concentration: Dosage['calculation']['concentration']): string | null => {
  if (!concentration || typeof concentration.value !== 'number' || concentration.value === 0) {
    return null;
  }
  const volumePrecision = 2;
  const concValue = concentration.value;

  if (typeof finalDose === 'number') {
    const volume = finalDose / concValue;
    return `${Number(volume.toFixed(volumePrecision))} mL`; // Assuming mL, should use concentration.unit if available and standardize
  } else {
    const minVal = finalDose.min ?? 0;
    const maxVal = finalDose.max ?? 0;
    const minVolume = minVal / concValue;
    const maxVolume = maxVal / concValue;
    return `${Number(minVolume.toFixed(volumePrecision))}-${Number(maxVolume.toFixed(volumePrecision))} mL`;
  }
};

/**
 * Aggregates general warnings based on patient weight.
 * @param {number} patientWeight - Patient's weight in kg.
 * @param {string[]} currentWarnings - Array of warnings from previous steps (e.g., capping).
 * @returns {string[]} An array of all relevant warnings.
 */
export const _aggregateWarnings = (patientWeight: number, currentWarnings: string[]): string[] => {
  const warnings = [...currentWarnings];
  if (patientWeight < 2 && patientWeight > 0) {
    warnings.push('Neonatal dosing may require specific adjustments and expert verification.');
  }
  if (patientWeight > 100) {
    warnings.push('Patient weight > 100kg. Ensure adult dosing caps/guidelines are considered if not automatically applied by absolute max dose.');
  }
  // Add more generic warnings here if needed
  return warnings;
};

// --- End of Refactored Dosage Calculation Helper Logic ---

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

    // Initial validation
    if (!calc || !patientWeight || patientWeight <= 0) {
      return {
        doseString: 'Enter patient weight.',
        volumeString: null,
        isMaxDoseApplied: false,
        isMinDoseApplied: false,
        warnings: [],
      };
    }

    // 1. Calculate Base Dose
    const rawDose = _getBaseDose(calc, patientWeight);
    if (rawDose === null) {
      return {
        doseString: 'Calculation not supported or medication data incomplete.',
        volumeString: null,
        isMaxDoseApplied: false,
        isMinDoseApplied: false,
        warnings: ['Medication configuration does not support per-kg calculation or is incomplete.'],
      };
    }

    // 2. Apply Dose Caps (Min/Max)
    const {
      finalDose,
      isMaxDoseApplied,
      isMinDoseApplied,
      capWarnings
    } = _applyDoseCaps(rawDose, calc);

    // 3. Format Dose String
    const doseString = _formatDoseString(finalDose, calc.doseUnit);

    // 4. Calculate Volume
    const volumeString = _calculateVolume(finalDose, calc.concentration);

    // 5. Aggregate Warnings
    const allWarnings = _aggregateWarnings(patientWeight, capWarnings);

    return {
      doseString,
      volumeString,
      isMaxDoseApplied,
      isMinDoseApplied,
      warnings: allWarnings,
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
