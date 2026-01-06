import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

@Component({
  selector: 'app-user-activity-chart',
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  templateUrl: './user-activity-chart.html',
  styleUrl: './user-activity-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityChartComponent {
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
