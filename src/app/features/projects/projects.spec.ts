import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../core/services/milestone/milestone.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { signal, Signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockMilestoneService: {
    searchQuery: WritableSignal<string>;
    statusFilter: WritableSignal<string>;
    milestones: Signal<unknown[]>;
    filteredMilestones: Signal<unknown[]>;
  };
  let mockAnalyticsService: {
    lastUpdated: Signal<Date>;
    isRefreshing: Signal<boolean>;
    refreshData: () => void;
  };
  let mockInspector: {
    open: (data: unknown, type: string) => void;
    isCreating: WritableSignal<boolean>;
  };

  beforeEach(async () => {
    mockMilestoneService = {
      searchQuery: signal(''),
      statusFilter: signal('all'),
      milestones: signal([]),
      filteredMilestones: signal([]),
    };

    mockAnalyticsService = {
      lastUpdated: signal(new Date()),
      isRefreshing: signal(false),
      refreshData: vi.fn(),
    };

    mockInspector = {
      open: vi.fn(),
      isCreating: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideRouter([]),
        { provide: MilestoneService, useValue: mockMilestoneService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: InspectorService, useValue: mockInspector },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open details in inspector', () => {
    const mockProject = { id: '1' };
    component.openDetails(mockProject as unknown as ProjectMilestone);
    expect(mockInspector.open).toHaveBeenCalledWith(mockProject, 'milestone');
  });

  it('should open creator in inspector', () => {
    component.createProject();
    expect(mockInspector.open).toHaveBeenCalledWith(null, 'milestone');
    expect(mockInspector.isCreating()).toBe(true);
  });

  it('should reset filters', () => {
    mockMilestoneService.searchQuery.set('test');
    mockMilestoneService.statusFilter.set('active');

    component.resetFilters();

    expect(mockMilestoneService.searchQuery()).toBe('');
    expect(mockMilestoneService.statusFilter()).toBe('all');
  });

  it('should call refreshData on refresh', () => {
    component.refresh();
    expect(mockAnalyticsService.refreshData).toHaveBeenCalled();
  });
});
