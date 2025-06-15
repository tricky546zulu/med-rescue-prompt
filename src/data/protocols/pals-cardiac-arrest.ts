
import { ProtocolNodeData } from '@/types/protocol';

export const palsCardiacArrestAlgorithm: ProtocolNodeData[] = [
  {
    id: 'start',
    type: 'start',
    title: 'Start: Pediatric Patient in Cardiac Arrest',
    content: 'Verify unresponsiveness, absence of breathing. Activate emergency response, get AED/defibrillator.',
    next: 'cpr'
  },
  {
    id: 'cpr',
    type: 'action',
    title: 'Start High-Quality CPR',
    content: 'Provide compressions and ventilations (15:2 with 2 rescuers). Give oxygen. Attach monitor.',
    next: 'rhythm-check'
  },
  {
    id: 'rhythm-check',
    type: 'decision',
    title: 'Rhythm Shockable?',
    content: 'Analyze patient\'s rhythm.',
    options: [
      { text: 'Yes (VF/pVT)', next: 'shock' },
      { text: 'No (Asystole/PEA)', next: 'epi' }
    ]
  },
  {
    id: 'shock',
    type: 'action',
    title: 'Deliver Shock (2 J/kg)',
    content: 'Deliver first shock at 2 J/kg. Immediately resume CPR after the shock.',
    next: 'cpr-cycle'
  },
  {
    id: 'epi',
    type: 'medication',
    title: 'Administer Epinephrine',
    content: 'Give Epinephrine 0.01 mg/kg IV/IO. Repeat every 3-5 minutes. Resume CPR immediately.',
    medicationId: 'epinephrine',
    next: 'cpr-cycle'
  },
  {
    id: 'cpr-cycle',
    type: 'timer',
    title: 'CPR Cycle (2 minutes)',
    content: 'Continue high-quality CPR for 2 minutes.',
    duration: 120,
    next: 'rhythm-check-2'
  },
  {
    id: 'rhythm-check-2',
    type: 'decision',
    title: 'Rhythm Shockable?',
    content: 'Analyze rhythm after 2 minutes of CPR.',
    options: [
      { text: 'Yes (VF/pVT)', next: 'shock-2' },
      { text: 'No (Asystole/PEA)', next: 'continue-cpr-no-shock' }
    ]
  },
  {
    id: 'shock-2',
    type: 'action',
    title: 'Deliver Shock (4 J/kg)',
    content: 'Deliver second shock at 4 J/kg. Immediately resume CPR. Administer Epinephrine and consider Amiodarone.',
    next: 'end'
  },
  {
    id: 'continue-cpr-no-shock',
    type: 'action',
    title: 'Continue CPR',
    content: 'Resume CPR. Administer Epinephrine every 3-5 mins. Treat reversible causes.',
    next: 'end'
  },
  {
      id: 'end',
      type: 'end',
      title: 'Protocol Branch End',
      content: 'This branch of the protocol has ended. Continue management based on patient status.'
  }
];
