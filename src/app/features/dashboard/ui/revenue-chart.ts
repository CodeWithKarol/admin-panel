import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

@Component({
  selector: 'app-revenue-chart',
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  template: `
    <div
      class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Monthly revenue performance</p>
        </div>
        <button
          class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <lucide-angular [img]="MoreVertical" class="w-5 h-5"></lucide-angular>
        </button>
      </div>
      <div class="h-72 w-full">
        <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" [type]="'line'">
        </canvas>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChart {
  readonly MoreVertical = MoreVertical;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Revenue',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
