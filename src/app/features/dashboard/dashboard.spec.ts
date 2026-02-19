import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { ModalService } from '../../core/services/modal/modal.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { BroadcastService } from '../../core/services/broadcast/broadcast.service';
import { signal, TemplateRef, Signal } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAnalyticsService: {
    metrics: Signal<unknown[]>;
    teamMembers: Signal<unknown[]>;
    activities: Signal<unknown[]>;
    lastUpdated: Signal<Date>;
    isRefreshing: Signal<boolean>;
    dashboardInsight: Signal<unknown>;
    squadMetrics: Signal<unknown[]>;
    refreshData: () => void;
  };
  let mockModalService: { open: (config: unknown) => void };
  let mockInspectorService: { open: (data: unknown, type: string) => void };
  let mockBroadcastService: { broadcastAlert: () => void };

  beforeEach(async () => {
    mockAnalyticsService = {
      metrics: signal([]),
      teamMembers: signal([
        { id: '1', name: 'Alex', activeTasks: 5 },
        { id: '2', name: 'Sarah', activeTasks: 3 },
      ]),
      activities: signal([]),
      lastUpdated: signal(new Date()),
      isRefreshing: signal(false),
      dashboardInsight: signal({ prefix: 'Test', value: '100%', suffix: 'done' }),
      squadMetrics: signal([]),
      refreshData: vi.fn(),
    };

    mockModalService = {
      open: vi.fn(),
    };

    mockInspectorService = {
      open: vi.fn(),
    };

    mockBroadcastService = {
      broadcastAlert: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: ModalService, useValue: mockModalService },
        { provide: InspectorService, useValue: mockInspectorService },
        { provide: BroadcastService, useValue: mockBroadcastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call refreshData on refresh', () => {
    component.refresh();
    expect(mockAnalyticsService.refreshData).toHaveBeenCalled();
  });

  it('should open modal on broadcastAlert', () => {
    const mockTemplate = {} as TemplateRef<unknown>;
    component.broadcastAlert(mockTemplate);
    expect(mockModalService.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Command Override Protocol',
        template: mockTemplate,
      }),
    );
  });

  it('should call broadcastAlert on confirmBroadcast', () => {
    component.confirmBroadcast();
    expect(mockBroadcastService.broadcastAlert).toHaveBeenCalled();
  });

  it('should open inspector on openSectorAudit', () => {
    component.openSectorAudit('Test Sector');
    expect(mockInspectorService.open).toHaveBeenCalledWith({ name: 'Test Sector' }, 'sector');
  });

  it('should calculate workloadChartData correctly', () => {
    const chartData = component.workloadChartData();
    expect(chartData.labels).toEqual(['Alex', 'Sarah']);
    expect(chartData.datasets[0].data).toEqual([5, 3]);
  });
});
