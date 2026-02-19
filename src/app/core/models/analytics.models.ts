export interface TeamMember {
  id: string;
  name: string;
  role: string;
  squad: 'AXON_CORE' | 'UI_UX_INTEL' | 'QA_STRIKE' | 'OPS_EDGE';
  specializations: string[];
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  activeTasks: number;
  completedTasks: number;
  bio?: string;
}

export interface ProjectMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  status: 'success' | 'info' | 'warning';
  scope: 'task' | 'project' | 'system';
}
export type TeamMemberStatus = 'online' | 'busy' | 'offline';

export const STATUS_COLORS: Record<TeamMemberStatus, string> = {
  online: 'bg-accent-sage shadow-[0_0_8px_rgba(111,130,111,0.5)]',
  busy: 'bg-accent-terracotta shadow-[0_0_8px_rgba(192,86,64,0.5)]',
  offline: 'bg-brand-300',
};
