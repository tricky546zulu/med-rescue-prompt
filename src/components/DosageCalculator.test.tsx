import { describe, it, expect } from 'vitest';
import type { Dosage } from '@/data/medications'; // Assuming this path is correct for types

// Mock/Helper Types - these might need to be adjusted or imported if complex
// For the purpose of these tests, we'll define simplified versions or assume they can be imported/mocked.
// Actual 'Dosage' and 'Medication' types are complex, so we focus on 'calculation' part.

type RawDoseType = number | { min: number; max: number };

interface DoseCappingResult {
  finalDose: RawDoseType;
  isMaxDoseApplied: boolean;
  isMinDoseApplied: boolean;
  capWarnings: string[];
}

// Assuming these functions are exported from DosageCalculator.tsx for testing.
// In a real scenario, you might need to adjust DosageCalculator.tsx to export them,
// or use more advanced testing techniques if they are meant to be strictly private.
import {
  _getBaseDose,
  _applyDoseCaps,
  _formatDoseString,
  _calculateVolume,
  _aggregateWarnings,
} from './DosageCalculator';


describe('_getBaseDose', () => {
  const mockCalcPerKg: NonNullable<Dosage['calculation']> = { type: 'perKg', dosePerKg: 2, doseUnit: 'mg' };
  const mockCalcRange: NonNullable<Dosage['calculation']> = { type: 'perKg', dosePerKgMin: 1, dosePerKgMax: 3, doseUnit: 'mg' };
  const mockCalcInvalidRange: NonNullable<Dosage['calculation']> = { type: 'perKg', dosePerKgMin: 3, dosePerKgMax: 1, doseUnit: 'mg' };
  const mockCalcNoPerKg: NonNullable<Dosage['calculation']> = { type: 'fixed', doseUnit: 'mg' }; // Assuming type 'fixed' isn't handled

  it('should calculate dose for perKg type', () => {
    expect(_getBaseDose(mockCalcPerKg, 10)).toBe(20);
  });

  it('should calculate dose range for perKgMin/Max type', () => {
    expect(_getBaseDose(mockCalcRange, 10)).toEqual({ min: 10, max: 30 });
  });

  it('should return 0 for 0 patientWeight with perKg', () => {
    expect(_getBaseDose(mockCalcPerKg, 0)).toBe(0);
  });

  it('should return {min:0, max:0} for 0 patientWeight with range', () => {
    expect(_getBaseDose(mockCalcRange, 0)).toEqual({min: 0, max: 0});
  });

  it('should return null if dosePerKgMin > dosePerKgMax', () => {
    expect(_getBaseDose(mockCalcInvalidRange, 10)).toBeNull();
  });

  it('should return null if calculation type is not supported or params missing', () => {
    expect(_getBaseDose(mockCalcNoPerKg, 10)).toBeNull();
  });
});

describe('_applyDoseCaps', () => {
  const baseCalc: NonNullable<Dosage['calculation']> = { type: 'perKg', doseUnit: 'mg' };

  it('should not cap if dose is within limits', () => {
    const result = _applyDoseCaps(50, { ...baseCalc, minDose: 10, maxDose: 100 });
    expect(result.finalDose).toBe(50);
    expect(result.isMinDoseApplied).toBe(false);
    expect(result.isMaxDoseApplied).toBe(false);
    expect(result.capWarnings).toEqual([]);
  });

  it('should apply maxDose cap', () => {
    const result = _applyDoseCaps(120, { ...baseCalc, maxDose: 100 });
    expect(result.finalDose).toBe(100);
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Maximum absolute dose of 100 mg applied.');
  });

  it('should apply minDose cap', () => {
    const result = _applyDoseCaps(5, { ...baseCalc, minDose: 10 });
    expect(result.finalDose).toBe(10);
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Minimum absolute dose of 10 mg applied.');
  });

  it('should apply both min and maxDose caps if dose is outside both', () => {
    // This scenario is tricky: if raw is 5, min is 10, max is 100. It becomes 10.
    const result1 = _applyDoseCaps(5, { ...baseCalc, minDose: 10, maxDose: 100 });
    expect(result1.finalDose).toBe(10);
    expect(result1.isMinDoseApplied).toBe(true);
    expect(result1.isMaxDoseApplied).toBe(false);

    // If raw is 120, min is 10, max is 100. It becomes 100.
    const result2 = _applyDoseCaps(120, { ...baseCalc, minDose: 10, maxDose: 100 });
    expect(result2.finalDose).toBe(100);
    expect(result2.isMinDoseApplied).toBe(false);
    expect(result2.isMaxDoseApplied).toBe(true);
  });

  // Range tests
  it('should cap max of a range', () => {
    const result = _applyDoseCaps({ min: 80, max: 120 }, { ...baseCalc, maxDose: 100 });
    expect(result.finalDose).toEqual({ min: 80, max: 100 });
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Maximum absolute dose of 100 mg applied to range.');
  });

  it('should cap min of a range', () => {
    const result = _applyDoseCaps({ min: 5, max: 50 }, { ...baseCalc, minDose: 10 });
    expect(result.finalDose).toEqual({ min: 10, max: 50 });
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Minimum absolute dose of 10 mg applied to range.');
  });

  it('should adjust min if maxCap makes min > max (range)', () => {
    const result = _applyDoseCaps({ min: 60, max: 70 }, { ...baseCalc, maxDose: 50 }); // raw min 60, raw max 70, maxDose 50
    expect(result.finalDose).toEqual({ min: 50, max: 50 });
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.isMinDoseApplied).toBe(true); // min was adjusted from 60 to 50
    expect(result.capWarnings).toContain('Maximum absolute dose of 50 mg applied to range.');
    expect(result.capWarnings).toContain('Minimum dose in range adjusted to match capped maximum dose.');
  });

   it('should adjust max if minCap makes min > max (range)', () => {
    const result = _applyDoseCaps({ min: 60, max: 70 }, { ...baseCalc, minDose: 80 }); // raw min 60, raw max 70, minDose 80
    expect(result.finalDose).toEqual({ min: 80, max: 80 });
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.isMaxDoseApplied).toBe(true); // max was adjusted from 70 to 80
    expect(result.capWarnings).toContain('Minimum absolute dose of 80 mg applied to range.');
    expect(result.capWarnings).toContain('Maximum dose in range adjusted to match applied minimum dose.');
  });

  it('should handle minDose > maxDose in config (range becomes point)', () => {
    const result = _applyDoseCaps({ min: 10, max: 20 }, { ...baseCalc, minDose: 30, maxDose: 25 });
    // Max cap applied first: {min: 10, max: 20} -> max becomes 25 -> {min:10, max:25}
    // Min cap applied next: {min:10, max:25} -> min becomes 30 -> {min:30, max:25} -> min > max conflict
    // Conflict resolution: min becomes max -> {min:25, max:25}
    expect(result.finalDose).toEqual({ min: 25, max: 25 });
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Dose range conflict: Min dose (30) exceeded Max dose (25). Adjusted min to match max.');
  });

  it('should handle no caps defined', () => {
    const result = _applyDoseCaps(50, baseCalc);
    expect(result.finalDose).toBe(50);
    expect(result.isMinDoseApplied).toBe(false);
    expect(result.isMaxDoseApplied).toBe(false);
    expect(result.capWarnings).toEqual([]);
  });

  it('should handle raw dose being exactly at cap limit', () => {
    const result = _applyDoseCaps(100, { ...baseCalc, maxDose: 100 });
    expect(result.finalDose).toBe(100);
    expect(result.isMaxDoseApplied).toBe(false); // Not applied because it wasn't > maxDose
  });
});

describe('_formatDoseString', () => {
  it('should format a single number dose (mg)', () => {
    expect(_formatDoseString(25.5, 'mg')).toBe('25.50 mg');
  });

  it('should format a single number dose (mcg) with 0 decimal places', () => {
    expect(_formatDoseString(500.123, 'mcg')).toBe('500 mcg');
  });

  it('should format a single number dose (MCG) case-insensitively with 0 decimal places', () => {
    expect(_formatDoseString(500.789, 'MCG')).toBe('501 mcg'); // .7 rounds up
  });

  it('should format a range dose (mg)', () => {
    expect(_formatDoseString({ min: 10.5, max: 20.25 }, 'mg')).toBe('10.50-20.25 mg');
  });

  it('should format a range dose (mcg) with 0 decimal places', () => {
    expect(_formatDoseString({ min: 100.2, max: 200.8 }, 'mcg')).toBe('100-201 mcg');
  });

  it('should handle zero in range (mg)', () => {
    expect(_formatDoseString({ min: 0, max: 10.5 }, 'mg')).toBe('0.00-10.50 mg');
  });

  it('should handle undefined min/max in range by defaulting to 0', () => {
    // @ts-expect-error testing undefined, though type should prevent
    expect(_formatDoseString({ min: undefined, max: 10 }, 'mg')).toBe('0.00-10.00 mg');
    // @ts-expect-error
    expect(_formatDoseString({ min: 5, max: undefined }, 'mg')).toBe('5.00-0.00 mg');
  });
});

describe('_calculateVolume', () => {
  const concentration = { value: 10, unit: 'mg/mL' }; // 10 mg/mL

  it('should calculate volume for a single number dose', () => {
    expect(_calculateVolume(50, concentration)).toBe('5.00 mL'); // 50mg / 10mg/mL = 5mL
  });

  it('should calculate volume for a range dose', () => {
    expect(_calculateVolume({ min: 25, max: 75 }, concentration)).toBe('2.50-7.50 mL');
  });

  it('should return null if concentration is not provided', () => {
    expect(_calculateVolume(50, undefined)).toBeNull();
  });

  it('should return null if concentration value is null or not a number', () => {
    // @ts-expect-error
    expect(_calculateVolume(50, { value: null, unit: 'mg/mL' })).toBeNull();
    // @ts-expect-error
    expect(_calculateVolume(50, { unit: 'mg/mL' })).toBeNull();
  });

  it('should return null if concentration value is 0', () => {
    expect(_calculateVolume(50, { value: 0, unit: 'mg/mL' })).toBeNull();
  });

  it('should handle zero dose', () => {
    expect(_calculateVolume(0, concentration)).toBe('0.00 mL');
  });

  it('should handle zero in dose range', () => {
    expect(_calculateVolume({min: 0, max: 50}, concentration)).toBe('0.00-5.00 mL');
  });
});

describe('_aggregateWarnings', () => {
  it('should add neonatal warning for weight < 2 kg', () => {
    const warnings = _aggregateWarnings(1.5, []);
    expect(warnings).toContain('Neonatal dosing may require specific adjustments and expert verification.');
  });

  it('should not add neonatal warning for weight = 2 kg', () => {
    const warnings = _aggregateWarnings(2, []);
    expect(warnings).not.toContain('Neonatal dosing may require specific adjustments and expert verification.');
  });

  it('should not add neonatal warning for weight = 0 kg (initial check in main func handles this)', () => {
    const warnings = _aggregateWarnings(0, []);
    expect(warnings).toEqual([]); // No weight-based warnings for 0kg as it's invalid input handled earlier
  });

  it('should add high weight warning for weight > 100 kg', () => {
    const warnings = _aggregateWarnings(110, []);
    expect(warnings).toContain('Patient weight > 100kg. Ensure adult dosing caps/guidelines are considered if not automatically applied by absolute max dose.');
  });

  it('should not add high weight warning for weight = 100 kg', () => {
    const warnings = _aggregateWarnings(100, []);
    expect(warnings).not.toContain('Patient weight > 100kg. Ensure adult dosing caps/guidelines are considered if not automatically applied by absolute max dose.');
  });

  it('should preserve existing warnings', () => {
    const existing = ['A previous warning'];
    const warnings = _aggregateWarnings(50, existing);
    expect(warnings).toContain('A previous warning');
    expect(warnings.length).toBe(1); // No new weight-specific warnings for 50kg
  });

  it('should add new warnings to existing ones', () => {
    const existing = ['Cap applied'];
    const warnings = _aggregateWarnings(1.8, existing);
    expect(warnings).toContain('Cap applied');
    expect(warnings).toContain('Neonatal dosing may require specific adjustments and expert verification.');
    expect(warnings.length).toBe(2);
  });
});

// Example of a more complex calc object for _applyDoseCaps
const complexCalc: NonNullable<Dosage['calculation']> = {
  type: 'perKg',
  dosePerKgMin: 10, // 100mg for 10kg patient
  dosePerKgMax: 20, // 200mg for 10kg patient
  minDose: 120,     // Absolute min
  maxDose: 180,     // Absolute max
  doseUnit: 'mg',
};

describe('_applyDoseCaps with complex scenarios', () => {
  it('should cap a range that is below absolute minDose', () => {
    // Raw dose for 10kg: {min: 100, max: 200}
    // Absolute minDose: 120, Absolute maxDose: 180
    // Expected: min becomes 120. max is within range.
    const raw = _getBaseDose(complexCalc, 10); // {min: 100, max: 200}
    const result = _applyDoseCaps(raw!, complexCalc);
    expect(result.finalDose).toEqual({ min: 120, max: 180 }); // Max also capped
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.isMaxDoseApplied).toBe(true); // Max was 200, capped to 180
    expect(result.capWarnings).toContain('Minimum absolute dose of 120 mg applied to range.');
    expect(result.capWarnings).toContain('Maximum absolute dose of 180 mg applied to range.');
  });

   it('should cap a range that is above absolute maxDose', () => {
    // Raw dose for 10kg: {min: 100, max: 200}
    // Absolute minDose: 50, Absolute maxDose: 150
    const calc = { ...complexCalc, minDose: 50, maxDose: 150 };
    const raw = _getBaseDose(calc, 10); // {min: 100, max: 200}
    const result = _applyDoseCaps(raw!, calc);
    expect(result.finalDose).toEqual({ min: 100, max: 150 });
    expect(result.isMinDoseApplied).toBe(false); // min 100 is > abs min 50
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Maximum absolute dose of 150 mg applied to range.');
  });

  it('should handle range where min cap makes min > max cap', () => {
    // Raw dose for 5kg: {min: 50, max: 100}
    // Absolute minDose: 80, Absolute maxDose: 70
    const calc = { ...complexCalc, minDose: 80, maxDose: 70 };
    const raw = _getBaseDose(calc, 5); // {min: 50, max: 100}
    const result = _applyDoseCaps(raw!, calc);
    // Max cap: max becomes 70. Range: {min:50, max:70}
    // Min cap: min becomes 80. Range: {min:80, max:70} -> conflict! min > max
    // Resolution: min becomes max (70). Range: {min:70, max:70}
    expect(result.finalDose).toEqual({ min: 70, max: 70 });
    expect(result.isMinDoseApplied).toBe(true);
    expect(result.isMaxDoseApplied).toBe(true);
    expect(result.capWarnings).toContain('Maximum absolute dose of 70 mg applied to range.');
    expect(result.capWarnings).toContain('Minimum absolute dose of 80 mg applied to range.');
    expect(result.capWarnings).toContain('Dose range conflict: Min dose (80) exceeded Max dose (70). Adjusted min to match max.');
  });
});
