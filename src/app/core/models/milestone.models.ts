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

export const PROJECT_STATUS_COLORS: Record<ProjectMilestone['status'], string> = {
  active: 'bg-accent-sage shadow-[0_0_8px_rgba(111,130,111,0.6)]',
  complete: 'bg-accent-terracotta',
  upcoming: 'bg-brand-300',
  paused: 'bg-brand-200',
};
