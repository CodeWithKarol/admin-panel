import { TestBed } from '@angular/core/testing';
import { DashboardLayoutService } from './dashboard-layout.service';

describe('DashboardLayoutService', () => {
  let service: DashboardLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardLayoutService]
    });
    service = TestBed.inject(DashboardLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with static editorial layout', () => {
    const layout = service.layout();
    expect(layout.length).toBe(4);
    expect(layout[0].type).toBe('KPI_STATS');
    expect(layout[0].colSpan).toBe('col-span-full');
  });
});
