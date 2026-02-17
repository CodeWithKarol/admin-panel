import { Injectable, signal } from '@angular/core';
import { ProjectMilestone } from '../../models/milestone.models';

export type { ProjectMilestone };

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  milestones = signal<ProjectMilestone[]>([
    {
      id: '1',
      projectName: 'AXON_CORE_REFACTOR',
      phase: 'Development',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-15'),
      status: 'complete',
      missionStatement:
        'Establish a new high-performance foundation for core telemetry processing.',
      statusReport:
        'Core data pipelines have been fully migrated to Signal-based architecture. Throughput increased by 14%.',
      internalNotes: 'Initial memory leaks in node synchronization have been resolved.',
    },
    {
      id: '2',
      projectName: 'EDITORIAL_UI_DESIGN',
      phase: 'Development',
      startDate: new Date('2026-02-16'),
      endDate: new Date('2026-02-28'),
      status: 'active',
      missionStatement: 'Redefine the administrative experience with high-end magazine aesthetics.',
      statusReport:
        'Transition to "Organic/Editorial" theme is 85% complete. Milestone ledger finalized.',
      internalNotes: 'Typography checks needed for mobile viewports.',
    },
    {
      id: '3',
      projectName: 'API_NODE_STABILITY',
      phase: 'QA',
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-03-05'),
      status: 'upcoming',
      missionStatement: 'Harden edge node infrastructure against global latency spikes.',
      statusReport:
        'Currently in stress-testing phase. Initial results show 99.99% uptime consistency.',
      internalNotes: 'Coordinate with QA lead regarding automated regression suite.',
    },
    {
      id: '4',
      projectName: 'GLOBAL_CDN_DEPLOY',
      phase: 'Deployment',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-10'),
      status: 'upcoming',
      missionStatement:
        'Scale the Axon platform to 12 global regions with sub-50ms response times.',
      statusReport: 'Provisioning infrastructure in Asian and European sectors is pending.',
      internalNotes: 'Final approval from DevOps required before live cutover.',
    },
  ]);

  addMilestone(milestone: ProjectMilestone) {
    this.milestones.update((current) => [...current, milestone]);
  }

  updateMilestone(updatedMilestone: ProjectMilestone) {
    this.milestones.update((current) =>
      current.map((m) => (m.id === updatedMilestone.id ? updatedMilestone : m)),
    );
  }

  deleteMilestone(id: string) {
    this.milestones.update((current) => current.filter((m) => m.id !== id));
  }
}
