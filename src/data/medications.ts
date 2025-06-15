
import { ShieldAlert, HeartPulse, ShieldCheck, Siren } from "lucide-react";

export interface Dosage {
  population: string;
  details: string;
  calculation?: {
    type: 'perKg' | 'perM2' | 'fixed';
    dosePerKg?: number;
    dosePerKgMin?: number;
    dosePerKgMax?: number;
    dosePerM2?: number;
    doseUnit: 'mg' | 'mcg' | 'units' | 'mL';
    maxDose?: number;
    minDose?: number;
    concentration?: {
        value: number;
        unit: 'mg/mL' | 'mcg/mL' | 'units/mL';
    };
  };
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  subcategory?: string;
  description: string;
  indications: string[];
  contraindications: string[];
  dosage: Dosage[];
  administration: {
    routes: string[];
    notes: string;
    monitoring?: string[];
  };
  alerts: Array<{
    level: 'High Alert' | 'Caution' | 'Info' | 'Black Box';
    text: string;
  }>;
  concentrations?: string[];
  palsaclsAlgorithms?: string[];
  lookAlikeSoundAlike?: string[];
  pregnancyCategory?: 'A' | 'B' | 'C' | 'D' | 'X';
  onsetDuration?: {
    onset: string;
    duration: string;
  };
  interactions?: string[];
  reversal?: string;
}

export const medications: Medication[] = [
  // CARDIAC MEDICATIONS
  {
    id: "epinephrine",
    name: "Epinephrine (Adrenaline)",
    category: "Cardiac",
    subcategory: "Sympathomimetic, Vasopressor",
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
          concentration: { value: 0.1, unit: 'mg/mL' }
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
          concentration: { value: 1, unit: 'mg/mL' }
        }
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "ET"],
      notes: "Follow IV/IO push with a 20 mL saline flush. ET route is least preferred and requires a higher dose.",
      monitoring: ["Heart rate", "Blood pressure", "ECG", "Urine output"]
    },
    alerts: [
        { level: "High Alert", text: "Dosage concentration errors are common. Double-check 1:1,000 vs 1:10,000 strength." },
        { level: "Caution", text: "Can cause significant tachycardia and hypertension." }
    ],
    concentrations: ["1 mg/mL (1:1,000)", "0.1 mg/mL (1:10,000)"],
    palsaclsAlgorithms: ["PALS Cardiac Arrest Algorithm", "ACLS Cardiac Arrest Algorithm", "PALS/ACLS Bradycardia Algorithm"],
    lookAlikeSoundAlike: ["Ephedrine"],
    pregnancyCategory: "C",
    onsetDuration: { onset: "1-2 minutes IV", duration: "5-10 minutes" }
  },

  {
    id: "atropine",
    name: "Atropine Sulfate",
    category: "Cardiac",
    subcategory: "Anticholinergic",
    description: "Competitive antagonist of acetylcholine at muscarinic receptors, increasing heart rate and improving AV conduction.",
    indications: ["Symptomatic Bradycardia", "Organophosphate poisoning", "Premedication to reduce secretions"],
    contraindications: ["Angle-closure glaucoma", "Myasthenia gravis", "Tachycardia"],
    dosage: [
      { population: "Adult Bradycardia", details: "0.5 mg IV/IO every 3-5 minutes. Max total dose 3 mg." },
      { 
        population: "Pediatric Bradycardia", 
        details: "0.02 mg/kg IV/IO (minimum 0.1 mg, maximum single dose 0.5 mg).",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.02,
          doseUnit: 'mg',
          minDose: 0.1,
          maxDose: 0.5
        }
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "ET"],
      notes: "May cause paradoxical bradycardia with doses <0.5 mg in adults.",
      monitoring: ["Heart rate", "Blood pressure", "ECG", "Pupil size"]
    },
    alerts: [
      { level: "Caution", text: "Doses <0.5 mg may cause paradoxical bradycardia in adults." },
      { level: "Info", text: "May cause anticholinergic effects: dry mouth, blurred vision, urinary retention." }
    ],
    concentrations: ["0.1 mg/mL", "0.4 mg/mL"],
    palsaclsAlgorithms: ["ACLS Bradycardia Algorithm", "PALS Bradycardia Algorithm"],
    pregnancyCategory: "C",
    onsetDuration: { onset: "1-2 minutes IV", duration: "4-6 hours" }
  },

  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "Cardiac",
    subcategory: "Antiarrhythmic (Class III)",
    description: "Prolongs action potential duration and refractory period, effective for both atrial and ventricular arrhythmias.",
    indications: ["VF/pVT refractory to defibrillation", "Stable wide-complex tachycardia", "Atrial fibrillation with RVR"],
    contraindications: ["Severe sinus node dysfunction", "Second/third-degree heart block", "Cardiogenic shock"],
    dosage: [
      { population: "Adult VF/pVT", details: "300 mg IV/IO push, then 150 mg in 3-5 minutes if needed." },
      { 
        population: "Pediatric VF/pVT", 
        details: "5 mg/kg IV/IO bolus, may repeat up to 15 mg/kg total.",
        calculation: {
          type: 'perKg',
          dosePerKg: 5,
          doseUnit: 'mg',
          maxDose: 300
        }
      },
      { population: "Adult Stable Tachycardia", details: "150 mg IV over 10 minutes, then 1 mg/min infusion." }
    ],
    administration: {
      routes: ["IV", "IO"],
      notes: "Must be given through central line or large peripheral IV. Compatible with D5W only.",
      monitoring: ["ECG", "Blood pressure", "Liver function", "Thyroid function", "Pulmonary function"]
    },
    alerts: [
      { level: "High Alert", text: "Can cause severe hypotension, especially with rapid administration." },
      { level: "Caution", text: "Multiple drug interactions. Monitor for prolonged QT interval." },
      { level: "Black Box", text: "Pulmonary toxicity can be fatal. Hepatic toxicity possible." }
    ],
    concentrations: ["50 mg/mL"],
    palsaclsAlgorithms: ["ACLS Cardiac Arrest Algorithm", "ACLS Tachycardia Algorithm"],
    pregnancyCategory: "D",
    onsetDuration: { onset: "1-3 hours", duration: "Weeks to months" }
  },

  {
    id: "adenosine",
    name: "Adenosine",
    category: "Cardiac",
    subcategory: "Antidysrhythmic",
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
      monitoring: ["ECG continuously", "Blood pressure"]
    },
    alerts: [
        { level: "Info", text: "Patients may experience a brief period of asystole, chest pain, or flushing." },
        { level: "Caution", text: "Very short half-life (~10 seconds). Must be administered rapidly." }
    ],
    concentrations: ["3 mg/mL"],
    palsaclsAlgorithms: ["ACLS Tachycardia Algorithm"],
    pregnancyCategory: "C",
    onsetDuration: { onset: "10-20 seconds", duration: "1-2 minutes" }
  },

  // PAIN MANAGEMENT & SEDATION
  {
    id: "midazolam",
    name: "Midazolam (Versed)",
    category: "Sedation",
    subcategory: "Benzodiazepine, Anticonvulsant",
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
      { population: "Adult Sedation", details: "1-2.5 mg slow IV push." }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "IN (Intranasal)"],
      notes: "Monitor respiratory status and blood pressure closely. Have reversal agent (flumazenil) available.",
      monitoring: ["Respiratory rate", "Oxygen saturation", "Blood pressure", "Level of consciousness"]
    },
    alerts: [
        { level: "High Alert", text: "Can cause respiratory depression and hypotension, especially when given rapidly or with opioids." }
    ],
    concentrations: ["1 mg/mL", "5 mg/mL"],
    reversal: "Flumazenil",
    lookAlikeSoundAlike: ["lorazepam", "diazepam"],
    pregnancyCategory: "D",
    onsetDuration: { onset: "1-3 minutes IV, 5-15 minutes IM", duration: "2-6 hours" }
  },

  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "Pain Management",
    subcategory: "Opioid Analgesic",
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
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "IN (Intranasal)"],
      notes: "Monitor for respiratory depression. Naloxone should be readily available as a reversal agent.",
      monitoring: ["Respiratory rate", "Oxygen saturation", "Blood pressure", "Pain level"]
    },
    alerts: [
        { level: "High Alert", text: "High potential for respiratory depression and apnea. 100x more potent than morphine." },
        { level: "Caution", text: "Rapid IV administration may cause chest wall rigidity." }
    ],
    concentrations: ["50 mcg/mL"],
    reversal: "Naloxone",
    pregnancyCategory: "C",
    onsetDuration: { onset: "1-2 minutes IV, 7-15 minutes IM", duration: "30-60 minutes" }
  },

  {
    id: "morphine",
    name: "Morphine Sulfate",
    category: "Pain Management",
    subcategory: "Opioid Analgesic",
    description: "Natural opioid analgesic that binds to mu-opioid receptors, providing analgesia and sedation.",
    indications: ["Moderate to severe pain", "Chest pain (MI)", "Pulmonary edema"],
    contraindications: ["Severe respiratory depression", "Paralytic ileus", "Severe asthma", "Head injury with increased ICP"],
    dosage: [
      { population: "Adult Pain", details: "2-10 mg IV/IO every 5-15 minutes as needed." },
      { 
        population: "Pediatric Pain", 
        details: "0.1-0.2 mg/kg IV/IO/IM every 4 hours as needed.",
        calculation: {
          type: 'perKg',
          dosePerKgMin: 0.1,
          dosePerKgMax: 0.2,
          doseUnit: 'mg'
        }
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "SQ"],
      notes: "Administer slowly to reduce risk of hypotension and respiratory depression.",
      monitoring: ["Respiratory rate", "Blood pressure", "Pain level", "Sedation level"]
    },
    alerts: [
      { level: "High Alert", text: "Can cause significant respiratory depression, especially in elderly patients." },
      { level: "Caution", text: "May cause hypotension and histamine release." }
    ],
    concentrations: ["1 mg/mL", "2 mg/mL", "4 mg/mL", "5 mg/mL", "8 mg/mL", "10 mg/mL"],
    reversal: "Naloxone",
    pregnancyCategory: "C",
    onsetDuration: { onset: "5-10 minutes IV", duration: "3-4 hours" }
  },

  {
    id: "ketamine",
    name: "Ketamine",
    category: "Sedation",
    subcategory: "Dissociative Anesthetic",
    description: "NMDA receptor antagonist providing anesthesia, analgesia, and amnesia while maintaining airway reflexes.",
    indications: ["Procedural sedation", "Analgesia", "Intubation induction", "Status asthmaticus"],
    contraindications: ["Increased intracranial pressure", "Severe hypertension", "Psychosis"],
    dosage: [
      { population: "Adult Procedural Sedation", details: "1-2 mg/kg IV over 1-2 minutes or 4-5 mg/kg IM." },
      { 
        population: "Pediatric Procedural Sedation", 
        details: "1-2 mg/kg IV or 3-4 mg/kg IM.",
        calculation: {
          type: 'perKg',
          dosePerKgMin: 1,
          dosePerKgMax: 2,
          doseUnit: 'mg'
        }
      },
      { population: "Adult Analgesia", details: "0.1-0.5 mg/kg IV for sub-dissociative analgesia." }
    ],
    administration: {
      routes: ["IV", "IO", "IM"],
      notes: "Maintain airway equipment available. May cause emergence reactions - consider co-administration of benzodiazepine.",
      monitoring: ["Airway patency", "Oxygen saturation", "Blood pressure", "Emergence reactions"]
    },
    alerts: [
      { level: "Caution", text: "May cause emergence reactions (hallucinations, delirium). Consider prophylactic benzodiazepine." },
      { level: "Info", text: "Preserves airway reflexes and respiratory drive unlike other anesthetics." }
    ],
    concentrations: ["10 mg/mL", "50 mg/mL"],
    pregnancyCategory: "B",
    onsetDuration: { onset: "1-2 minutes IV, 3-8 minutes IM", duration: "10-15 minutes IV, 15-30 minutes IM" }
  },

  // RESPIRATORY MEDICATIONS
  {
    id: "albuterol",
    name: "Albuterol (Salbutamol)",
    category: "Respiratory",
    subcategory: "Beta-2 Agonist Bronchodilator",
    description: "Selective beta-2 adrenergic receptor agonist that causes bronchial smooth muscle relaxation.",
    indications: ["Bronchospasm", "Asthma exacerbation", "COPD exacerbation", "Hyperkalemia"],
    contraindications: ["Hypersensitivity to albuterol", "Use with caution in cardiac arrhythmias"],
    dosage: [
      { population: "Adult Nebulizer", details: "2.5-5 mg in 3 mL normal saline via nebulizer every 20 minutes x3, then every 2-4 hours." },
      { population: "Adult MDI", details: "2-8 puffs every 20 minutes for 3 doses, then every 1-4 hours as needed." },
      { 
        population: "Pediatric Nebulizer", 
        details: "0.15 mg/kg (minimum 2.5 mg) in 3 mL normal saline every 20 minutes x3.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.15,
          doseUnit: 'mg',
          minDose: 2.5
        }
      }
    ],
    administration: {
      routes: ["Inhalation (Nebulizer)", "Inhalation (MDI)"],
      notes: "Monitor for tachycardia and tremor. May be mixed with ipratropium for enhanced effect.",
      monitoring: ["Peak flow", "Oxygen saturation", "Heart rate", "Respiratory rate"]
    },
    alerts: [
      { level: "Caution", text: "May cause tachycardia, tremor, and hypokalemia with frequent dosing." }
    ],
    concentrations: ["0.5% (5 mg/mL)", "MDI 90 mcg/puff"],
    pregnancyCategory: "C",
    onsetDuration: { onset: "5-15 minutes", duration: "3-6 hours" }
  },

  {
    id: "ipratropium",
    name: "Ipratropium Bromide",
    category: "Respiratory",
    subcategory: "Anticholinergic Bronchodilator",
    description: "Quaternary ammonium anticholinergic that blocks muscarinic receptors in bronchial smooth muscle.",
    indications: ["Bronchospasm", "COPD exacerbation", "Asthma (adjunct to beta-agonists)"],
    contraindications: ["Hypersensitivity to atropine or derivatives", "Angle-closure glaucoma"],
    dosage: [
      { population: "Adult Nebulizer", details: "0.5 mg (2.5 mL of 0.02% solution) every 20 minutes x3, then every 2-4 hours." },
      { population: "Adult MDI", details: "2-3 puffs every 20 minutes for 3 doses, then every 2-4 hours as needed." },
      { population: "Pediatric Nebulizer", details: "0.25-0.5 mg every 20 minutes x3, then every 2-4 hours." }
    ],
    administration: {
      routes: ["Inhalation (Nebulizer)", "Inhalation (MDI)"],
      notes: "Often combined with albuterol for synergistic effect. Rinse mouth after use.",
      monitoring: ["Peak flow", "Oxygen saturation", "Heart rate"]
    },
    alerts: [
      { level: "Info", text: "Less likely to cause tachycardia compared to beta-agonists." }
    ],
    concentrations: ["0.02% (0.5 mg/2.5 mL)", "MDI 17 mcg/puff"],
    pregnancyCategory: "B",
    onsetDuration: { onset: "15 minutes", duration: "3-4 hours" }
  },

  // NEUROLOGICAL MEDICATIONS
  {
    id: "lorazepam",
    name: "Lorazepam (Ativan)",
    category: "Neurological",
    subcategory: "Benzodiazepine Anticonvulsant",
    description: "Intermediate-acting benzodiazepine with anticonvulsant, anxiolytic, and sedative properties.",
    indications: ["Status epilepticus", "Seizures", "Agitation", "Procedural sedation"],
    contraindications: ["Severe respiratory depression", "Acute narrow-angle glaucoma", "Severe hepatic insufficiency"],
    dosage: [
      { population: "Adult Status Epilepticus", details: "4 mg IV over 2 minutes, may repeat in 10-15 minutes if seizures persist." },
      { 
        population: "Pediatric Status Epilepticus", 
        details: "0.1 mg/kg IV/IO (max 4 mg), may repeat once in 10-15 minutes.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.1,
          doseUnit: 'mg',
          maxDose: 4
        }
      }
    ],
    administration: {
      routes: ["IV", "IO", "IM"],
      notes: "Longer duration than midazolam. Have flumazenil available for reversal.",
      monitoring: ["Respiratory rate", "Blood pressure", "Level of consciousness", "Seizure activity"]
    },
    alerts: [
      { level: "High Alert", text: "Can cause respiratory depression, especially when combined with opioids." }
    ],
    concentrations: ["2 mg/mL", "4 mg/mL"],
    reversal: "Flumazenil",
    lookAlikeSoundAlike: ["midazolam", "diazepam"],
    pregnancyCategory: "D",
    onsetDuration: { onset: "1-3 minutes IV", duration: "6-8 hours" }
  },

  // ANTIDOTES
  {
    id: "naloxone",
    name: "Naloxone (Narcan)",
    category: "Antidotes",
    subcategory: "Opioid Antagonist",
    description: "Competitive opioid receptor antagonist that reverses opioid-induced respiratory depression.",
    indications: ["Opioid overdose", "Opioid-induced respiratory depression", "Reversal of opioid effects"],
    contraindications: ["Hypersensitivity to naloxone"],
    dosage: [
      { population: "Adult Opioid Overdose", details: "0.4-2 mg IV/IO/IM, may repeat every 2-3 minutes. Max 10 mg." },
      { 
        population: "Pediatric Opioid Overdose", 
        details: "0.01 mg/kg IV/IO/IM, may repeat every 2-3 minutes.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.01,
          doseUnit: 'mg'
        }
      },
      { population: "Adult Intranasal", details: "4 mg (2 mg per nostril) IN, may repeat every 2-3 minutes." }
    ],
    administration: {
      routes: ["IV", "IO", "IM", "IN (Intranasal)", "ET"],
      notes: "Duration shorter than most opioids - may need repeated doses. May precipitate withdrawal in opioid-dependent patients.",
      monitoring: ["Respiratory rate", "Level of consciousness", "Blood pressure", "Withdrawal symptoms"]
    },
    alerts: [
      { level: "Caution", text: "Duration of action (30-60 min) is shorter than most opioids. Patient may re-narcotize." },
      { level: "Info", text: "May precipitate acute withdrawal syndrome in opioid-dependent patients." }
    ],
    concentrations: ["0.4 mg/mL", "1 mg/mL", "4 mg/0.1 mL autoinjector"],
    pregnancyCategory: "B",
    onsetDuration: { onset: "1-2 minutes IV, 2-5 minutes IM", duration: "30-60 minutes" }
  },

  {
    id: "flumazenil",
    name: "Flumazenil (Romazicon)",
    category: "Antidotes",
    subcategory: "Benzodiazepine Antagonist",
    description: "Competitive benzodiazepine receptor antagonist that reverses benzodiazepine-induced sedation.",
    indications: ["Benzodiazepine overdose", "Reversal of procedural sedation", "Suspected benzodiazepine poisoning"],
    contraindications: ["Tricyclic antidepressant overdose", "Seizure-prone patients", "Chronic benzodiazepine use"],
    dosage: [
      { population: "Adult Overdose", details: "0.2 mg IV over 30 seconds, then 0.3 mg after 30 seconds if needed. Additional 0.5 mg doses every minute to max 3 mg." },
      { 
        population: "Pediatric Overdose", 
        details: "0.01 mg/kg IV (max 0.2 mg), may repeat every minute to max 1 mg total.",
        calculation: {
          type: 'perKg',
          dosePerKg: 0.01,
          doseUnit: 'mg',
          maxDose: 0.2
        }
      }
    ],
    administration: {
      routes: ["IV", "IO"],
      notes: "Use with extreme caution in patients with chronic benzodiazepine use - may precipitate seizures.",
      monitoring: ["Level of consciousness", "Respiratory rate", "Seizure activity"]
    },
    alerts: [
      { level: "High Alert", text: "Can precipitate seizures in patients with chronic benzodiazepine use or TCA overdose." },
      { level: "Caution", text: "Duration shorter than most benzodiazepines - sedation may return." }
    ],
    concentrations: ["0.1 mg/mL"],
    pregnancyCategory: "C",
    onsetDuration: { onset: "1-2 minutes", duration: "45-90 minutes" }
  },

  // ELECTROLYTE & METABOLIC
  {
    id: "dextrose",
    name: "Dextrose (D50W, D25W, D10W)",
    category: "Metabolic",
    subcategory: "Glucose Solution",
    description: "Concentrated glucose solution for treatment of hypoglycemia and altered mental status.",
    indications: ["Hypoglycemia", "Altered mental status with suspected hypoglycemia", "Diabetic emergencies"],
    contraindications: ["Intracranial hemorrhage", "Allergy to corn products"],
    dosage: [
      { population: "Adult Hypoglycemia", details: "25 g (50 mL of D50W) IV push, may repeat if no response in 10 minutes." },
      { 
        population: "Pediatric Hypoglycemia", 
        details: "0.5-1 g/kg IV (2-4 mL/kg of D25W or 5-10 mL/kg of D10W).",
        calculation: {
          type: 'perKg',
          dosePerKgMin: 0.5,
          dosePerKgMax: 1,
          doseUnit: 'mg'
        }
      }
    ],
    administration: {
      routes: ["IV", "IO"],
      notes: "D50W is hyperosmolar and can cause tissue necrosis if extravasated. Use D25W or D10W in children.",
      monitoring: ["Blood glucose", "Mental status", "IV site for extravasation"]
    },
    alerts: [
      { level: "Caution", text: "D50W can cause tissue necrosis if extravasated. Ensure good IV access." },
      { level: "Info", text: "May worsen neurologic outcome in stroke patients." }
    ],
    concentrations: ["D50W: 500 mg/mL", "D25W: 250 mg/mL", "D10W: 100 mg/mL"],
    pregnancyCategory: "A",
    onsetDuration: { onset: "1-3 minutes", duration: "Variable" }
  },

  // Additional medications would continue here...
];

// Enhanced search and filtering utilities
export const getMedicationsByCategory = (category: string): Medication[] => {
  return medications.filter(med => med.category === category);
};

export const getMedicationsByIndication = (indication: string): Medication[] => {
  return medications.filter(med => 
    med.indications.some(ind => ind.toLowerCase().includes(indication.toLowerCase()))
  );
};

export const getHighAlertMedications = (): Medication[] => {
  return medications.filter(med => 
    med.alerts.some(alert => alert.level === 'High Alert' || alert.level === 'Black Box')
  );
};

export const getMedicationCategories = (): string[] => {
  return [...new Set(medications.map(med => med.category))].sort();
};

export const getMedicationSubcategories = (): string[] => {
  return [...new Set(medications.map(med => med.subcategory).filter(Boolean))].sort();
};
