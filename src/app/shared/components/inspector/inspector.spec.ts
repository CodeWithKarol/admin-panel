import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectorComponent } from './inspector';
import { InspectorService } from '../../../core/services/inspector/inspector.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { MilestoneService } from '../../../core/services/milestone/milestone.service';
import { signal } from '@angular/core';
import { TeamMember } from '../../../core/models/analytics.models';
import { ProjectMilestone } from '../../../core/services/milestone/milestone.service';

describe('InspectorComponent', () => {
  let component: InspectorComponent;
  let fixture: ComponentFixture<InspectorComponent>;
  let inspectorService: {
    isOpen: ReturnType<typeof signal<boolean>>;
    activeData: ReturnType<typeof signal<unknown>>;
    activeType: ReturnType<typeof signal<string | null>>;
    isCreating: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
  };
  let analyticsService: {
    addTeamMember: ReturnType<typeof vi.fn>;
    updateTeamMember: ReturnType<typeof vi.fn>;
    deprovisionTeamMember: ReturnType<typeof vi.fn>;
    getMetricHistory: ReturnType<typeof vi.fn>;
    getSectorAudit: ReturnType<typeof vi.fn>;
  };
  let milestoneService: {
    addMilestone: ReturnType<typeof vi.fn>;
    updateMilestone: ReturnType<typeof vi.fn>;
    deleteMilestone: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    inspectorService = {
      isOpen: signal(false),
      activeData: signal(null),
      activeType: signal(null),
      isCreating: signal(false),
      close: vi.fn(),
    };

    analyticsService = {
      addTeamMember: vi.fn(),
      updateTeamMember: vi.fn(),
      deprovisionTeamMember: vi.fn(),
      getMetricHistory: vi.fn().mockReturnValue([]),
      getSectorAudit: vi.fn().mockReturnValue(null),
    };

    milestoneService = {
      addMilestone: vi.fn(),
      updateMilestone: vi.fn(),
      deleteMilestone: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InspectorComponent],
      providers: [
        { provide: InspectorService, useValue: inspectorService },
        {
          provide: ModalService,
          useValue: { open: vi.fn(), close: vi.fn(), config: signal(null), isOpen: signal(false) },
        },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: MilestoneService, useValue: milestoneService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should identify active user correctly', () => {
    const user = { id: '1', name: 'John' };
    inspectorService.activeType.set('user');
    inspectorService.activeData.set(user);

    expect(component.activeUser()).toEqual(user as unknown as TeamMember);
    expect(component.activeMilestone()).toBeNull();
  });

  it('should identify active milestone correctly', () => {
    const milestone = { id: 'm1', projectName: 'Alpha' };
    inspectorService.activeType.set('milestone');
    inspectorService.activeData.set(milestone);

    expect(component.activeMilestone()).toEqual(milestone as unknown as ProjectMilestone);
    expect(component.activeUser()).toBeNull();
  });

  it('should delegate save to AnalyticsService for users', () => {
    const user = { id: '1', name: 'John' };
    inspectorService.activeType.set('user');
    inspectorService.isCreating.set(false);

    component.saveIdentity(user as unknown as TeamMember);
    expect(analyticsService.updateTeamMember).toHaveBeenCalledWith(user);
  });

  it('should delegate create to AnalyticsService for users', () => {
    const user = { name: 'New' };
    inspectorService.activeType.set('user');
    inspectorService.isCreating.set(true);

    component.saveIdentity(user as unknown as TeamMember);
    expect(analyticsService.addTeamMember).toHaveBeenCalledWith(user);
  });

  it('should delegate close to InspectorService', () => {
    component.close();
    expect(inspectorService.close).toHaveBeenCalled();
  });
});
