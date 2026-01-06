import { TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardPage],
    });

    component = TestBed.runInInjectionContext(() => new DashboardPage());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
