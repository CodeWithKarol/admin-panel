import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
      <div class="h-64 bg-gray-50 rounded p-2">
        <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" [type]="'line'">
        </canvas>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChart {
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
