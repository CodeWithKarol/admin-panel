import { TestBed } from '@angular/core/testing';
import { UserActivityChart } from './user-activity-chart';

describe('UserActivityChart', () => {
  let component: UserActivityChart;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserActivityChart],
    });

    component = TestBed.runInInjectionContext(() => new UserActivityChart());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
