import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';
import { MilestoneService, ProjectMilestone } from '../milestone/milestone.service';
import { signal } from '@angular/core';

describe('ReportService', () => {
  let service: ReportService;
  let milestoneService: { milestones: ReturnType<typeof signal> };

  const mockMilestones = [
    {
      id: '1',
      projectName: 'Alpha',
      status: 'active',
      phase: 'Research',
      startDate: '2026-02-01',
      endDate: '2026-03-01',
      missionStatement: 'Test mission one',
    },
    {
      id: '2',
      projectName: 'Beta',
      status: 'complete',
      phase: 'Discovery',
      startDate: '2026-04-01',
      endDate: '2026-05-01',
      missionStatement: 'Sample core',
    },
    {
      id: '3',
      projectName: 'Gamma',
      status: 'active',
      phase: 'Development',
      startDate: '2026-06-01',
      endDate: '2026-07-01',
    },
  ];

  beforeEach(() => {
    milestoneService = {
      milestones: signal(mockMilestones as unknown as ProjectMilestone[]),
    };

    TestBed.configureTestingModule({
      providers: [ReportService, { provide: MilestoneService, useValue: milestoneService }],
    });
    service = TestBed.inject(ReportService);
  });

  it('should filter by search query correctly', () => {
    service.searchQuery.set('Alpha');
    expect(service.filteredAndSortedMilestones().length).toBe(1);
    expect(service.filteredAndSortedMilestones()[0].projectName).toBe('Alpha');

    service.searchQuery.set('core');
    expect(service.filteredAndSortedMilestones().length).toBe(1);
    expect(service.filteredAndSortedMilestones()[0].projectName).toBe('Beta');
  });

  it('should filter by status correctly', () => {
    service.statusFilter.set('active');
    expect(service.filteredAndSortedMilestones().length).toBe(2);

    service.statusFilter.set('complete');
    expect(service.filteredAndSortedMilestones().length).toBe(1);
  });

  it('should filter by phase correctly', () => {
    service.phaseFilter.set('Research');
    expect(service.filteredAndSortedMilestones().length).toBe(1);
  });

  it('should filter by date range correctly', () => {
    service.startDate.set('2026-01-01');
    service.endDate.set('2026-03-31');
    expect(service.filteredAndSortedMilestones().length).toBe(1);
    expect(service.filteredAndSortedMilestones()[0].projectName).toBe('Alpha');
  });

  it('should sort milestones correctly', () => {
    service.sortField.set('projectName');
    service.sortDirection.set('desc');
    const records = service.filteredAndSortedMilestones();
    expect(records[0].projectName).toBe('Gamma');
    expect(records[records.length - 1].projectName).toBe('Alpha');

    service.sortDirection.set('asc');
    expect(service.filteredAndSortedMilestones()[0].projectName).toBe('Alpha');
  });

  it('should calculate activeRate correctly', () => {
    expect(service.activeRate()).toBe(67); // 2 out of 3 is 66.6... -> 67
  });

  it('should reset page when filters change', () => {
    service.currentPage.set(2);
    service.searchQuery.set('new query');

    TestBed.flushEffects();

    expect(service.currentPage()).toBe(1);
  });

  it('should provide paginated data', () => {
    service.itemsPerPage.set(2);
    service.currentPage.set(1);
    expect(service.paginatedMilestones().length).toBe(2);

    service.currentPage.set(2);
    expect(service.paginatedMilestones().length).toBe(1);
  });

  it('should generate chart data with correct structure', () => {
    const data = service.chartData();
    expect(data.labels).toEqual(['Research', 'Discovery', 'Development', 'QA', 'Deployment']);
    expect(data.datasets[0].data).toEqual([1, 1, 1, 0, 0]);
  });
});
