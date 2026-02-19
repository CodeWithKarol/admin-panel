import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamManagerComponent } from './team-manager';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { signal, Signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('TeamManagerComponent', () => {
  let component: TeamManagerComponent;
  let fixture: ComponentFixture<TeamManagerComponent>;

  let mockAnalyticsService: {
    lastUpdated: Signal<Date>;
    isRefreshing: Signal<boolean>;
    teamMembers: Signal<unknown[]>;
    filteredMembers: Signal<unknown[]>;
    refreshData: () => void;
    readinessScore: Signal<number>;
    availabilityMatrix: Signal<{ online: number; busy: number; offline: number }>;
    getMemberDossier: (m: unknown) => unknown;
    searchQuery: WritableSignal<string>;
    activeSquad: WritableSignal<string | null>;
    activeStatusFilter: WritableSignal<'ALL' | 'ACTIVE_ONLY' | 'HIGH_LOAD'>;
    sortBy: WritableSignal<'NAME' | 'IMPACT' | 'BURDEN'>;
    sortOptions: { label: string; value: string }[];
    statusFilters: { label: string; value: string }[];
  };

  let mockInspector: {
    initializeNew: (type: string) => void;
  };

  beforeEach(async () => {
    mockAnalyticsService = {
      lastUpdated: signal(new Date()),
      isRefreshing: signal(false),
      teamMembers: signal([]),
      filteredMembers: signal([]),
      refreshData: vi.fn(),
      readinessScore: signal(100),
      availabilityMatrix: signal({ online: 0, busy: 0, offline: 0 }),
      getMemberDossier: vi.fn().mockReturnValue({}),
      searchQuery: signal(''),
      activeSquad: signal(null),
      activeStatusFilter: signal('ALL'),
      sortBy: signal('NAME'),
      sortOptions: [],
      statusFilters: [],
    };

    mockInspector = {
      initializeNew: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TeamManagerComponent],
      providers: [
        provideRouter([]),
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: InspectorService, useValue: mockInspector },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate refresh to analytics service', () => {
    component.refresh();
    expect(mockAnalyticsService.refreshData).toHaveBeenCalled();
  });

  it('should delegate initializeNew to inspector service', () => {
    component.initNewIdentity();
    expect(mockInspector.initializeNew).toHaveBeenCalledWith('user');
  });

  it('should show zero results message when no members match', () => {
    (mockAnalyticsService.filteredMembers as WritableSignal<unknown[]>).set([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No identities match this telemetric signature');
  });

  it('should show user list when members exist', () => {
    (mockAnalyticsService.filteredMembers as WritableSignal<unknown[]>).set([{ id: '1' }]);
    fixture.detectChanges();
    const userList = fixture.nativeElement.querySelector('app-user-list');
    expect(userList).toBeTruthy();
  });
});
