import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkloadChartComponent } from './workload-chart';
import { ChartData } from 'chart.js';

describe('WorkloadChartComponent', () => {
  let component: WorkloadChartComponent;
  let fixture: ComponentFixture<WorkloadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadChartComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('chartData', {
      labels: ['Label 1', 'Label 2'],
      datasets: [{ data: [10, 20] }],
    } as ChartData<'bar'>);
    fixture.componentRef.setInput('chartOptions', {});
    fixture.componentRef.setInput('chartType', 'bar');

    fixture.detectChanges();
  });

  it('should emit sectorSelected on chart click with active elements', () => {
    const emitSpy = vi.spyOn(component.sectorSelected, 'emit');

    // Simulate chart click event
    component.onChartClick({
      active: [{ index: 1 } as unknown as { index: number }],
    });

    expect(emitSpy).toHaveBeenCalledWith('Label 2');
  });

  it('should not emit if click has no active elements', () => {
    const emitSpy = vi.spyOn(component.sectorSelected, 'emit');
    component.onChartClick({ active: [] });
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
