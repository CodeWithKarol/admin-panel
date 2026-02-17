import { Injectable, signal, computed } from '@angular/core';
import { TeamMember, ProjectMetric } from '../../models/analytics.models';
import { DispatchEntry } from '../../models/dispatch.models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  teamMembers = signal<TeamMember[]>([
    { id: '1', name: 'Alex Rivera', role: 'Lead Developer', squad: 'AXON_CORE', specializations: ['RUST', 'SIGNAL_ARCH', 'K8S'], avatar: 'https://i.pravatar.cc/150?u=1', status: 'online', activeTasks: 5, completedTasks: 120 },
    { id: '2', name: 'Sarah Chen', role: 'UX Designer', squad: 'UI_UX_INTEL', specializations: ['MOTION', 'BENTO_GRID', 'TYPOGRAPHY'], avatar: 'https://i.pravatar.cc/150?u=2', status: 'online', activeTasks: 3, completedTasks: 85 },
    { id: '3', name: 'Mike Johnson', role: 'Product Manager', squad: 'OPS_EDGE', specializations: ['STRATEGY', 'RISK_MGMT', 'AGILE'], avatar: 'https://i.pravatar.cc/150?u=3', status: 'busy', activeTasks: 8, completedTasks: 210 },
    { id: '4', name: 'Emily Davis', role: 'QA Engineer', squad: 'QA_STRIKE', specializations: ['AUTOMATION', 'STRESS_TEST', 'CI_CD'], avatar: 'https://i.pravatar.cc/150?u=4', status: 'offline', activeTasks: 0, completedTasks: 150 }
  ]);

  // Filtering & Sorting State
  searchQuery = signal('');
  activeSquad = signal<string | null>(null);
  activeStatusFilter = signal<'ALL' | 'ACTIVE_ONLY' | 'HIGH_LOAD'>('ALL');
  sortBy = signal<'NAME' | 'IMPACT' | 'BURDEN'>('NAME');

  filteredMembers = computed(() => {
    let members = this.teamMembers();

    // 1. Squad Filter
    if (this.activeSquad()) {
      members = members.filter(m => m.squad === this.activeSquad());
    }

    // 2. Operational Filter
    if (this.activeStatusFilter() === 'ACTIVE_ONLY') {
      members = members.filter(m => m.status !== 'offline');
    } else if (this.activeStatusFilter() === 'HIGH_LOAD') {
      members = members.filter(m => m.activeTasks > 5);
    }

    // 3. Search Query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      members = members.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.role.toLowerCase().includes(query) ||
        m.specializations.some(s => s.toLowerCase().includes(query))
      );
    }

    // 4. Sorting
    return [...members].sort((a, b) => {
      switch (this.sortBy()) {
        case 'IMPACT': return b.completedTasks - a.completedTasks;
        case 'BURDEN': return b.activeTasks - a.activeTasks;
        default: return a.name.localeCompare(b.name);
      }
    });
  });

  // Squad Pulse Metrics
  readinessScore = computed(() => {
    const total = this.teamMembers().length;
    if (total === 0) return 0;
    const online = this.teamMembers().filter(m => m.status === 'online').length;
    return Math.round((online / total) * 100);
  });

  availabilityMatrix = computed(() => {
    const members = this.teamMembers();
    return {
      online: members.filter(m => m.status === 'online').length,
      busy: members.filter(m => m.status === 'busy').length,
      offline: members.filter(m => m.status === 'offline').length,
    };
  });

  metrics = signal<ProjectMetric[]>([
    { label: 'Total Tasks', value: 124, change: 12, trend: 'up' },
    { label: 'Team Velocity', value: 42, change: -5, trend: 'down' },
    { label: 'Active Projects', value: 8, change: 0, trend: 'neutral' }
  ]);

  activities = signal<DispatchEntry[]>([
    { id: '1', timestamp: new Date(), sender: 'SYSTEM', message: 'CORE_ENGINE_INITIALIZED_SUCCESSFULLY', type: 'SYSTEM' },
    { id: '2', timestamp: new Date(), sender: 'ALEX_R', message: 'SYNC_UPSTREAM_COMPLETED_ON_NODE_04', type: 'ROUTINE' }
  ]);

  lastUpdated = signal<Date>(new Date());
  isRefreshing = signal<boolean>(false);

  constructor() {
    this.startSimulation();
  }

    totalCompletedTasks = computed(() =>
      this.teamMembers().reduce((sum, member) => sum + member.completedTasks, 0)
    );
  
      updateTeamMember(updatedMember: TeamMember) {
        this.teamMembers.update(members => 
          members.map(m => m.id === updatedMember.id ? updatedMember : m)
        );
        
        // Log the reconfiguration activity
        this.activities.update(current => [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          sender: 'SYSTEM',
          message: `IDENTITY_RECONFIGURED_FOR_OPERATOR_${updatedMember.id}`,
          type: 'SYSTEM' as const
        }, ...current].slice(0, 20));
      }
    
      addTeamMember(newMember: TeamMember) {
        this.teamMembers.update(members => [newMember, ...members]);
        
        // Log initialization activity
        this.activities.update(current => [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          sender: 'SYSTEM',
          message: `NEW_IDENTITY_INITIALIZED_ID_${newMember.id}`,
          type: 'SYSTEM' as const
        }, ...current].slice(0, 20));
      }

      deprovisionTeamMember(id: string) {
        this.teamMembers.update(members => members.filter(m => m.id !== id));
        
        // Log deprovisioning activity
        this.activities.update(current => [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          sender: 'SECURITY',
          message: `IDENTITY_DEPROVISIONED_ID_${id}`,
          type: 'URGENT' as const
        }, ...current].slice(0, 20));
      }    getMetricHistory(label: string) {    let current = 50;
    if (label.includes('Tasks')) current = 100;
    if (label.includes('Velocity')) current = 40;
    if (label.includes('Projects')) current = 5;

    return Array.from({ length: 30 }, (_, i) => {
      current += Math.floor(Math.random() * 10) - 5;
      if (current < 0) current = 0;
      return {
        date: new Date(2026, 1, i + 1),
        value: current
      };
    });
  }

  getSectorAudit(sector: string) {
    // Deterministic mock data based on sector name
    const seed = sector.length;
    return {
      dimensions: ['Velocity', 'Quality', 'Efficiency', 'Innovation', 'Stability'],
      sectorValues: [
        70 + (seed % 25), 
        65 + (seed * 2 % 30), 
        75 + (seed % 20), 
        60 + (seed * 3 % 35), 
        80 - (seed % 15)
      ],
      orgAverage: [75, 72, 78, 70, 74]
    };
  }

  private startSimulation() {
    setInterval(() => {
      this.spawnRandomDispatch();
    }, 12000); 
  }

  private spawnRandomDispatch() {
    const senders = ['ALEX_R', 'SARAH_C', 'MIKE_J', 'SYSTEM', 'NODE_04'];
    const messages = [
      'PIPELINE_STAGING_DEPLOY_SUCCESS',
      'NEW_OPERATOR_INITIALIZED_IN_SYSTEM',
      'API_LATENCY_SPIKE_DETECTED_0.4MS',
      'MERGE_REQUEST_APPROVED_FOR_AXON_CORE',
      'DATABASE_REPLICATION_COMPLETED',
      'SECURITY_PROTOCOL_ALPHA_ACTIVE',
      'REQUISITION_FOR_RESOURCES_PENDING'
    ];
    const types: ('URGENT' | 'ROUTINE' | 'SYSTEM')[] = ['URGENT', 'ROUTINE', 'SYSTEM'];

    const newDispatch: DispatchEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      sender: senders[Math.floor(Math.random() * senders.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)]
    };

    this.activities.update(current => {
      const updated = [newDispatch, ...current];
      return updated.slice(0, 20); 
    });
  }

  refreshData() {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.lastUpdated.set(new Date());
      this.isRefreshing.set(false);
      this.metrics.update(m => m.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 5) - 2
      })));
      this.spawnRandomDispatch();
    }, 1000);
  }
}
