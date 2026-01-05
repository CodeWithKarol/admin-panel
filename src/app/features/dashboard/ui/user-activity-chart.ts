import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

@Component({
  selector: 'app-user-activity-chart',
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  template: `
    <div
      class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">User Activity</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">New vs Active users</p>
        </div>
        <button
          class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <lucide-angular [img]="MoreVertical" class="w-5 h-5"></lucide-angular>
        </button>
      </div>
      <div class="h-72 w-full">
        <canvas baseChart [data]="barChartData" [options]="barChartOptions" [type]="'bar'">
        </canvas>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityChart {
  readonly MoreVertical = MoreVertical;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Active Users',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'New Signups',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
