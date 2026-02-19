import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, ChartEvent } from 'chart.js';

@Component({
  selector: 'app-workload-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="space-y-12">
      <div>
        <h3 class="text-sm font-bold uppercase tracking-widest border-b border-brand-300 pb-2 mb-6">Workload Distribution</h3>
        <div class="h-80 w-full cursor-pointer">
          <canvas baseChart
                  [data]="chartData()"
                  [options]="barChartOptions()"
                  [type]="chartType()"
                  (chartClick)="onChartClick($event)">
          </canvas>
        </div>
        <p class="mt-6 text-sm text-brand-600 leading-relaxed italic">
          <strong class="text-accent-charcoal not-italic">Note:</strong> Click any sector bar to initialize a detailed performance audit and comparative baseline analysis.
        </p>
      </div>
    </div>
  `
})
export class WorkloadChartComponent {
  chartData = input.required<ChartData<'bar'>>();
  chartOptions = input.required<ChartConfiguration['options']>();
  chartType = input.required<ChartType>();
  
  sectorSelected = output<string>();

  public barChartOptions = computed<ChartConfiguration['options']>(() => {
    const baseOptions = this.chartOptions();
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions?.plugins,
      }
    };
  });

  onChartClick({ active }: { event?: ChartEvent, active?: object[] }): void {
    if (active && active.length > 0) {
      const index = (active[0] as { index: number }).index;
      const label = this.chartData().labels?.[index] as string;
      if (label) {
        this.sectorSelected.emit(label);
      }
    }
  }
}
