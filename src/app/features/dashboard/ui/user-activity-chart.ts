import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-user-activity-chart',
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
      <div class="h-64 bg-gray-50 rounded p-2">
        <canvas baseChart [data]="barChartData" [options]="barChartOptions" [type]="'bar'">
        </canvas>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityChart {
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
