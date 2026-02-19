export interface ProjectMilestone {
  id: string;
  projectName: string;
  phase: 'Research' | 'Discovery' | 'Development' | 'QA' | 'Deployment';
  startDate: Date;
  endDate: Date;
  status: 'complete' | 'active' | 'upcoming' | 'paused';
  missionStatement?: string;
  statusReport?: string;
  internalNotes?: string;
}
