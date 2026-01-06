import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

@Component({
  selector: 'app-revenue-chart',
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  templateUrl: './revenue-chart.html',
  styleUrl: './revenue-chart.css',
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
