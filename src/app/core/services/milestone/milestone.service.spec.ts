import { TestBed } from '@angular/core/testing';
import { MilestoneService } from './milestone.service';

describe('MilestoneService', () => {
  let service: MilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have mock milestones initialized', () => {
    expect(service.milestones().length).toBeGreaterThan(0);
    expect(service.milestones()[0].projectName).toBe('AXON_CORE_REFACTOR');
    expect(service.milestones()[0].status).toBe('complete');
  });

  it('should have specific milestone structure', () => {
    const firstMilestone = service.milestones()[0];
    expect(firstMilestone).toHaveProperty('id');
    expect(firstMilestone).toHaveProperty('projectName');
    expect(firstMilestone).toHaveProperty('phase');
    expect(firstMilestone).toHaveProperty('startDate');
    expect(firstMilestone).toHaveProperty('endDate');
    expect(firstMilestone).toHaveProperty('status');
  });
  it('should add a new milestone', () => {
    const initialCount = service.milestones().length;
    const newMilestone = {
      id: '999',
      projectName: 'TEST_PROJECT',
      phase: 'Research' as const,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active' as const,
      missionStatement: 'Test Mission',
      statusReport: 'Test Report',
      internalNotes: 'Test Notes',
    };

    service.addMilestone(newMilestone);

    expect(service.milestones().length).toBe(initialCount + 1);
    expect(service.milestones()).toContain(newMilestone);
  });

  it('should update an existing milestone', () => {
    const newMilestone = {
      id: '888',
      projectName: 'UPDATE_TEST_PROJECT',
      phase: 'Research' as const,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active' as const,
      missionStatement: 'Original Mission',
      statusReport: 'Original Report',
      internalNotes: 'Original Notes',
    };
    service.addMilestone(newMilestone);

    const updatedMilestone = {
      ...newMilestone,
      status: 'complete' as const,
      missionStatement: 'Updated Mission',
    };
    service.updateMilestone(updatedMilestone);

    const retrieved = service.milestones().find((m) => m.id === '888');
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe('complete');
    expect(retrieved?.missionStatement).toBe('Updated Mission');
  });

  it('should delete a milestone', () => {
    const newMilestone = {
      id: '777',
      projectName: 'DELETE_TEST_PROJECT',
      phase: 'Research' as const,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active' as const,
      missionStatement: 'To be deleted',
      statusReport: 'To be deleted',
      internalNotes: 'To be deleted',
    };
    service.addMilestone(newMilestone);
    const countBeforeDelete = service.milestones().length;

    service.deleteMilestone('777');

    expect(service.milestones().length).toBe(countBeforeDelete - 1);
    expect(service.milestones().find((m) => m.id === '777')).toBeUndefined();
  });
});
