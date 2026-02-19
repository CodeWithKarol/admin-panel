import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../core/services/milestone/milestone.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { ReportService } from '../../core/services/report/report.service';
import { signal, Signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  let mockMilestoneService: {
    milestones: Signal<ProjectMilestone[]>;
    searchQuery: WritableSignal<string>;
    statusFilter: WritableSignal<string>;
  };

  let mockAnalyticsService: {
    lastUpdated: Signal<Date>;
    isRefreshing: Signal<boolean>;
    refreshData: () => void;
  };

  let mockInspector: {
    open: (data: unknown, type: string) => void;
  };

  let mockReportService: {
    startDate: WritableSignal<string>;
    endDate: WritableSignal<string>;
    searchQuery: WritableSignal<string>;
    statusFilter: WritableSignal<string>;
    phaseFilter: WritableSignal<string>;
    currentPage: WritableSignal<number>;
    itemsPerPage: WritableSignal<number>;
    sortField: WritableSignal<keyof ProjectMilestone | ''>;
    sortDirection: WritableSignal<'asc' | 'desc'>;
    filteredAndSortedMilestones: Signal<ProjectMilestone[]>;
    paginatedMilestones: Signal<ProjectMilestone[]>;
    activeRate: Signal<number>;
    chartData: Signal<unknown>;
    exportPdf: () => void;
    exportCsv: () => void;
  };

  beforeEach(async () => {
    mockMilestoneService = {
      milestones: signal([]),
      searchQuery: signal(''),
      statusFilter: signal('all'),
    };

    mockAnalyticsService = {
      lastUpdated: signal(new Date()),
      isRefreshing: signal(false),
      refreshData: vi.fn(),
    };

    mockInspector = {
      open: vi.fn(),
    };

    mockReportService = {
      startDate: signal(''),
      endDate: signal(''),
      searchQuery: signal(''),
      statusFilter: signal('all'),
      phaseFilter: signal('all'),
      currentPage: signal(1),
      itemsPerPage: signal(10),
      sortField: signal(''),
      sortDirection: signal('asc'),
      filteredAndSortedMilestones: signal([]),
      paginatedMilestones: signal([]),
      activeRate: signal(0),
      chartData: signal({ labels: [], datasets: [] }),
      exportPdf: vi.fn(),
      exportCsv: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [
        provideRouter([]),
        { provide: MilestoneService, useValue: mockMilestoneService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: InspectorService, useValue: mockInspector },
        { provide: ReportService, useValue: mockReportService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open project details', () => {
    const mockProj = { id: '1' } as ProjectMilestone;
    component.openProject(mockProj);
    expect(mockInspector.open).toHaveBeenCalledWith(mockProj, 'milestone');
  });

  it('should open sector details on chart click', () => {
    component.onChartClick('Sector A');
    expect(mockInspector.open).toHaveBeenCalledWith({ name: 'Sector A' }, 'sector');
  });

  it('should toggle sort field and direction', () => {
    component.toggleSort('projectName');
    expect(mockReportService.sortField()).toBe('projectName');
    expect(mockReportService.sortDirection()).toBe('asc');

    component.toggleSort('projectName');
    expect(mockReportService.sortDirection()).toBe('desc');

    component.toggleSort('phase');
    expect(mockReportService.sortField()).toBe('phase');
    expect(mockReportService.sortDirection()).toBe('asc');
  });

  it('should delegate refresh, exportPdf and exportData', () => {
    component.refresh();
    expect(mockAnalyticsService.refreshData).toHaveBeenCalled();

    component.exportPdf();
    expect(mockReportService.exportPdf).toHaveBeenCalled();

    component.exportData();
    expect(mockReportService.exportCsv).toHaveBeenCalled();
  });
});
