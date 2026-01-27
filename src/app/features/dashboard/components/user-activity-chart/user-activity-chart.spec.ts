/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserActivityChart } from './user-activity-chart';
import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'canvas[baseChart]',
  standalone: true,
  template: '',
})
class MockBaseChartDirective {
  @Input() data: any;
  @Input() options: any;
  @Input() type: any;
}

describe('UserActivityChart', () => {
  let component: UserActivityChart;
  let fixture: ComponentFixture<UserActivityChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityChart],
    })
      .overrideComponent(UserActivityChart, {
        remove: { imports: [BaseChartDirective] },
        add: { imports: [MockBaseChartDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserActivityChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
