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
