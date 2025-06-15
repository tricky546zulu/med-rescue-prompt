
import { Siren, Baby, ShieldAlert } from 'lucide-react';

export interface Protocol {
  id: string;
  title: string;
  category: 'ACLS' | 'PALS' | 'General';
  description: string;
  icon?: React.ElementType;
}

export const protocols: Protocol[] = [
  {
    id: 'acls-cardiac-arrest',
    title: 'ACLS: Cardiac Arrest',
    category: 'ACLS',
    description: 'Algorithm for adult patients in cardiac arrest (VF/pVT, Asystole/PEA).',
    icon: Siren,
  },
  {
    id: 'pals-cardiac-arrest',
    title: 'PALS: Cardiac Arrest',
    category: 'PALS',
    description: 'Algorithm for pediatric patients in cardiac arrest.',
    icon: Baby,
  },
  {
    id: 'anaphylaxis',
    title: 'Anaphylaxis Management',
    category: 'General',
    description: 'Protocol for managing severe allergic reactions.',
    icon: ShieldAlert,
  },
];
