import { TestBed } from '@angular/core/testing';
import { RevenueChart } from './revenue-chart';

describe('RevenueChart', () => {
  let component: RevenueChart;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenueChart],
    });

    component = TestBed.runInInjectionContext(() => new RevenueChart());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
