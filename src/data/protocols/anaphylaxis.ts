
import { ProtocolNodeData } from '@/types/protocol';

export const anaphylaxisAlgorithm: ProtocolNodeData[] = [
  {
    id: 'start',
    type: 'start',
    title: 'Start: Suspected Anaphylaxis',
    content: 'Patient showing signs of a severe allergic reaction (e.g., respiratory distress, hypotension, skin reactions).',
    next: 'epi-im'
  },
  {
    id: 'epi-im',
    type: 'medication',
    title: 'Administer Epinephrine IM',
    content: 'Inject Epinephrine (1:1,000) into the anterolateral thigh. Adult: 0.3-0.5 mg. Pediatric: 0.01 mg/kg (max 0.3 mg).',
    medicationId: 'epinephrine',
    next: 'position-oxygen'
  },
  {
    id: 'position-oxygen',
    type: 'action',
    title: 'Positioning and Oxygen',
    content: 'Place patient in a supine position (or position of comfort if dyspneic). Elevate lower extremities. Administer high-flow oxygen.',
    next: 'reassess'
  },
  {
    id: 'reassess',
    type: 'decision',
    title: 'Reassess Patient',
    content: 'Is the patient responding to treatment? (Improvement in breathing, blood pressure)',
    options: [
      { text: 'Yes, Improving', next: 'monitor' },
      { text: 'No, or Worsening', next: 'repeat-epi' }
    ]
  },
  {
    id: 'repeat-epi',
    type: 'medication',
    title: 'Repeat Epinephrine & Consider Adjuncts',
    content: 'Repeat IM Epinephrine every 5-15 minutes. Establish IV/IO access and give IV fluids for hypotension. Consider adjunct therapies.',
    medicationId: 'epinephrine',
    next: 'end'
  },
  {
    id: 'monitor',
    type: 'action',
    title: 'Monitor and Consider Adjuncts',
    content: 'Continue to monitor vitals closely. Consider secondary medications like antihistamines (e.g., Diphenhydramine) and corticosteroids.',
    next: 'end'
  },
  {
    id: 'end',
    type: 'end',
    title: 'Continue Monitoring & Transport',
    content: 'Continue close monitoring for biphasic reaction. Transport to a definitive care facility.'
  }
];
