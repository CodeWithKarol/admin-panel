export interface DispatchEntry {
  id: string;
  timestamp: Date;
  sender: string;
  message: string;
  type: 'URGENT' | 'ROUTINE' | 'SYSTEM';
}
