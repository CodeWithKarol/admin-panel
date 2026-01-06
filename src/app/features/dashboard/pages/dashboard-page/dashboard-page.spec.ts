import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page';
import { Component } from '@angular/core';
import { RevenueChart } from '../../components/revenue-chart/revenue-chart';
import { UserActivityChart } from '../../components/user-activity-chart/user-activity-chart';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  template: '',
})
class MockRevenueChart {}

@Component({
  selector: 'app-user-activity-chart',
  standalone: true,
  template: '',
})
class MockUserActivityChart {}

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
    })
      .overrideComponent(DashboardPage, {
        remove: { imports: [RevenueChart, UserActivityChart] },
        add: { imports: [MockRevenueChart, MockUserActivityChart] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
