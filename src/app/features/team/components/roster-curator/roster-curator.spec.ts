import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterCuratorComponent } from './roster-curator';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { signal, WritableSignal } from '@angular/core';

describe('RosterCuratorComponent', () => {
  let component: RosterCuratorComponent;
  let fixture: ComponentFixture<RosterCuratorComponent>;

  let mockAnalyticsService: {
    searchQuery: WritableSignal<string>;
    activeSquad: WritableSignal<string | null>;
    activeStatusFilter: WritableSignal<'ALL' | 'ACTIVE_ONLY' | 'HIGH_LOAD'>;
    sortBy: WritableSignal<'NAME' | 'IMPACT' | 'BURDEN'>;
    sortOptions: { label: string; value: string }[];
    statusFilters: { label: string; value: string }[];
  };

  beforeEach(async () => {
    mockAnalyticsService = {
      searchQuery: signal(''),
      activeSquad: signal(null),
      activeStatusFilter: signal('ALL'),
      sortBy: signal('NAME'),
      sortOptions: [
        { label: 'Name', value: 'NAME' },
        { label: 'Impact', value: 'IMPACT' },
        { label: 'Burden', value: 'BURDEN' },
      ],
      statusFilters: [
        { label: 'All', value: 'ALL' },
        { label: 'Active_Only', value: 'ACTIVE_ONLY' },
        { label: 'High_Load', value: 'HIGH_LOAD' },
      ],
    };

    await TestBed.configureTestingModule({
      imports: [RosterCuratorComponent],
      providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterCuratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search query', () => {
    component.searchQuery.set('operator');
    expect(mockAnalyticsService.searchQuery()).toBe('operator');
  });

  it('should update squad filter', () => {
    component.activeSquad.set('SQUAD_A');
    expect(mockAnalyticsService.activeSquad()).toBe('SQUAD_A');
  });

  it('should update sort by', () => {
    component.sortBy.set('IMPACT');
    expect(mockAnalyticsService.sortBy()).toBe('IMPACT');
  });

  it('should call print on exportManifest', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {
      /* no-op for print */
    });
    component.exportManifest();
    expect(printSpy).toHaveBeenCalled();
  });
});
