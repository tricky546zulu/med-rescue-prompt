import { ShieldAlert, HeartPulse, ShieldCheck, Siren } from "lucide-react";

export interface Dosage {
  population: string;
  details: string;
  calculation?: {
    type: 'perKg';
    dosePerKg?: number;
    dosePerKgMin?: number;
    dosePerKgMax?: number;
    doseUnit: 'mg' | 'mcg';
    maxDose?: number;
    concentration?: {
        value: number; // in mg/mL
        unit: 'mg/mL';
    };
  };
}

export interface Medication {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  dosage: Dosage[];
  administration: {
    routes: string[];
    notes: string;
  };
  alerts: Array<{
    level: 'High Alert' | 'Caution' | 'Info';
    text: string;
  }>;
  concentrations?: string[];
  palsaclsAlgorithms?: string[];
  lookAlikeSoundAlike?: string[];
}

export const medications: Medication[] = [
  {
    id: "epinephrine",
    name: "Epinephrine (Adrenaline)",
    category: "Sympathomimetic, Vasopressor",
    description: "A potent sympathomimetic amine that stimulates both alpha and beta-adrenergic receptors, leading to increased heart rate, myocardial contractility, and systemic vascular resistance.",
    indications: ["Cardiac Arrest (Asystole/PEA, VF/pVT)", "Anaphylaxis", "Symptomatic Bradycardia", "Severe Asthma"],
    contraindications: ["None in a life-threatening emergency", "Use with caution in patients with hypertension, ischemic heart disease"],
    dosage: [
      { population: "Adult Cardiac Arrest", details: "1 mg (10 mL of 1:10,000 solution) IV/IO every 3-5 minutes." },
      { 
        population: "Pediatric Cardiac Arrest", 
        details: "0.01 mg/kg (0.1 mL/kg of 1:10,000 solution) IV/IO every 3-5 minutes. Max dose 1 mg.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.01,
          doseUnit: 'mg',
          maxDose: 1,
          concentration: { value: 0.1, unit: 'mg/mL' } // 1:10,000
        }
      },
      { population: "Anaphylaxis (Adult)", details: "0.3-0.5 mg (of 1:1,000 solution) IM." },
      { 
        population: "Anaphylaxis (Pediatric)", 
        details: "0.01 mg/kg (of 1:1,000 solution) IM. Max dose 0.3 mg.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.01,
          doseUnit: 'mg',
          maxDose: 0.3,
          concentration: { value: 1, unit: 'mg/mL' } // 1:1,000
        }
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "ET"],
      notes: "Follow IV/IO push with a 20 mL saline flush. ET route is least preferred and requires a higher dose.",
    },
    alerts: [
        { level: "High Alert", text: "Dosage concentration errors are common. Double-check 1:1,000 vs 1:10,000 strength." },
        { level: "Caution", text: "Can cause significant tachycardia and hypertension." }
    ],
    concentrations: [
        "1 mg/mL (1:1,000)",
        "0.1 mg/mL (1:10,000)"
    ],
    palsaclsAlgorithms: [
        "PALS Cardiac Arrest Algorithm",
        "ACLS Cardiac Arrest Algorithm (Asystole/PEA and VF/pVT)",
        "PALS/ACLS Bradycardia Algorithm",
    ],
    lookAlikeSoundAlike: [
        "Ephedrine"
    ]
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "Antidysrhythmic",
    description: "Slows conduction time through the A-V node, can interrupt the re-entry pathways through the A-V node, and can restore normal sinus rhythm in patients with paroxysmal supraventricular tachycardia (PSVT).",
    indications: ["Stable, narrow-complex Supraventricular Tachycardia (SVT)"],
    contraindications: ["Second- or third-degree A-V block", "Sick sinus syndrome", "Known hypersensitivity to adenosine"],
    dosage: [
      { population: "Adult SVT", details: "First dose: 6 mg rapid IV push over 1-3 seconds. Second dose: If SVT does not convert in 1-2 minutes, give 12 mg rapid IV push." },
      { 
        population: "Pediatric SVT (First Dose)", 
        details: "0.1 mg/kg (max 6 mg) rapid IV/IO push.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.1,
          doseUnit: 'mg',
          maxDose: 6
        }
      },
      {
        population: "Pediatric SVT (Second Dose)",
        details: "0.2 mg/kg (max 12 mg) rapid IV/IO push.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.2,
          doseUnit: 'mg',
          maxDose: 12
        }
      }
    ],
    administration: {
      routes: ["IV", "IO"],
      notes: "Administer directly into a vein or into an IV line as close to the patient as possible. Follow immediately with a rapid 20 mL saline flush.",
    },
    alerts: [
        { level: "Info", text: "Patients may experience a brief period of asystole, chest pain, or flushing." },
        { level: "Caution", text: "Very short half-life (~10 seconds). Must be administered rapidly." }
    ],
  },
  {
    id: "midazolam",
    name: "Midazolam (Versed)",
    category: "Benzodiazepine, Anticonvulsant",
    description: "A short-acting benzodiazepine with anxiolytic, sedative, anticonvulsant, and muscle-relaxant properties.",
    indications: ["Seizures / Status Epilepticus", "Sedation for procedures (e.g., cardioversion)", "Chemical restraint"],
    contraindications: ["Acute narrow-angle glaucoma", "Shock", "Hypersensitivity to benzodiazepines"],
    dosage: [
      { population: "Adult Seizure", details: "5-10 mg IM/IN, or 2-5 mg IV/IO over 2 minutes." },
      { 
        population: "Pediatric Seizure", 
        details: "0.1-0.2 mg/kg IM/IN, max single dose 5 mg.",
        calculation: {
          type: 'perKg',
          dosePerKgMin: 0.1,
          dosePerKgMax: 0.2,
          doseUnit: 'mg',
          maxDose: 5
        }
      },
      { population: "Adult Sedation", details: "1-2.5 mg slow IV push." },
    ],
    administration: {
      routes: ["IV", "IO", "IM", "IN (Intranasal)"],
      notes: "Monitor respiratory status and blood pressure closely. Have reversal agent (flumazenil) available.",
    },
    alerts: [
        { level: "High Alert", text: "Can cause respiratory depression and hypotension, especially when given rapidly or with opioids." },
    ],
    lookAlikeSoundAlike: ["lorazepam", "diazepam"]
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "Opioid Analgesic",
    description: "A potent synthetic opioid analgesic with a rapid onset and short duration of action.",
    indications: ["Severe pain management", "Analgesia for procedures"],
    contraindications: ["Severe respiratory depression", "Known hypersensitivity", "Use with caution in patients with head injuries or hypotension"],
    dosage: [
      { population: "Adult Pain", details: "25-100 mcg slow IV/IO/IM push over 1-2 minutes. Repeat every 5-10 minutes as needed." },
      { 
        population: "Pediatric Pain", 
        details: "1-2 mcg/kg slow IV/IO/IM/IN.",
        calculation: {
          type: 'perKg',
          dosePerKgMin: 1,
          dosePerKgMax: 2,
          doseUnit: 'mcg'
        }
      },
    ],
    administration: {
      routes: ["IV", "IO", "IM", "IN (Intranasal)"],
      notes: "Monitor for respiratory depression. Naloxone should be readily available as a reversal agent.",
    },
    alerts: [
        { level: "High Alert", text: "High potential for respiratory depression and apnea. 100x more potent than morphine." },
        { level: "Caution", text: "Rapid IV administration may cause chest wall rigidity." },
    ],
  },
];
