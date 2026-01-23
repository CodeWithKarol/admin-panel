import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevenueChart } from './revenue-chart';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseChartDirective } from 'ng2-charts';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'canvas[baseChart]',
  standalone: true,
  template: '',
})
class MockBaseChartDirective {
  @Input() data: any;
  @Input() options: any;
  @Input() type: any;
  update() {}
}

describe('RevenueChart', () => {
  let component: RevenueChart;
  let fixture: ComponentFixture<RevenueChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueChart],
    })
      .overrideComponent(RevenueChart, {
        remove: { imports: [BaseChartDirective] },
        add: { imports: [MockBaseChartDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RevenueChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update range', () => {
    // Access protected members via bracket notation or casting to bypass TS visibility check
    const comp = component as any;
    const originalLabels = comp.lineChartData.labels;

    comp.updateRange('7d');

    expect(component.timeRange()).toBe('7d');
    // We check if the data object was mutated/replaced
    expect(comp.lineChartData.labels).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    // Check type safety on update
    expect(comp.lineChartData.datasets[0].data.length).toBe(7);
  });
});
