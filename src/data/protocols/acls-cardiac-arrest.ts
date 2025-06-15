
import { ProtocolNodeData } from '@/types/protocol';

export const aclsCardiacArrestAlgorithm: ProtocolNodeData[] = [
  {
    id: 'start',
    type: 'start',
    title: 'Start: Patient in Cardiac Arrest',
    content: 'Verify unresponsiveness, absence of breathing, and no pulse. Call for help and get AED/defibrillator.',
    next: 'cpr'
  },
  {
    id: 'cpr',
    type: 'action',
    title: 'Start High-Quality CPR',
    content: 'Push hard (at least 2 inches/5 cm) and fast (100-120/min) and allow complete chest recoil. Give oxygen. Attach monitor/defibrillator.',
    next: 'rhythm-check'
  },
  {
    id: 'rhythm-check',
    type: 'decision',
    title: 'Rhythm Shockable?',
    content: 'Analyze rhythm on monitor.',
    options: [
      { text: 'Yes (VF/pVT)', next: 'shock' },
      { text: 'No (Asystole/PEA)', next: 'epi-asystole' }
    ]
  },
  {
    id: 'shock',
    type: 'action',
    title: 'Shock',
    content: 'Deliver shock as per device instructions. Immediately resume CPR after the shock.',
    next: 'cpr-cycle-2'
  },
  {
    id: 'epi-asystole',
    type: 'medication',
    title: 'Administer Epinephrine',
    content: 'Give Epinephrine 1 mg IV/IO as soon as possible. Resume CPR immediately.',
    medicationId: 'epinephrine',
    next: 'cpr-cycle-2'
  },
  {
    id: 'cpr-cycle-2',
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
    title: 'Shock',
    content: 'Deliver shock. Immediately resume CPR. Consider antiarrhythmics (e.g., Amiodarone).',
    next: 'end'
  },
  {
    id: 'continue-cpr-no-shock',
    type: 'action',
    title: 'Continue CPR',
    content: 'Resume CPR. Treat reversible causes. There is no shock indicated.',
    next: 'end'
  },
  {
      id: 'end',
      type: 'end',
      title: 'Protocol Branch End',
      content: 'This branch of the protocol has ended. Continue management as per patient status and further guidelines.'
  }
];
