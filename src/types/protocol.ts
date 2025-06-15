
export interface ProtocolNodeData {
  id: string;
  type: 'start' | 'action' | 'decision' | 'end' | 'timer' | 'medication';
  title: string;
  content: string;
  next?: string;
  options?: { text: string; next:string }[];
  duration?: number;
  medicationId?: string;
  clinicalNotes?: string[];
}
