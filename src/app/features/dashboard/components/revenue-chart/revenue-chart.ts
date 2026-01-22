import { Component, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

@Component({
  selector: 'app-revenue-chart',
  imports: [BaseChartDirective, LucideAngularModule],
  templateUrl: './revenue-chart.html',
  styleUrl: './revenue-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChart {
  readonly chart = viewChild(BaseChartDirective);

  readonly MoreVertical = MoreVertical;

  timeRange = signal<'7d' | '30d' | '90d'>('30d');
  readonly ranges = ['7d', '30d', '90d'] as const;

  protected lineChartData: ChartConfiguration<'line'>['data'] = {
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
  protected lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  protected updateRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);

    // Mock data updates based on range
    let newData: number[] = [];
    let newLabels: string[] = [];

    switch (range) {
      case '7d':
        newData = [15, 25, 20, 35, 30, 45, 50];
        newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case '30d':
        newData = [65, 59, 80, 81, 56, 55, 40];
        newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        break;
      case '90d':
        newData = [120, 150, 180, 140, 160, 190, 200];
        newLabels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3'];
        break;
    }

    if (this.lineChartData.datasets[0]) {
      this.lineChartData.datasets[0].data = newData;
    }
    this.lineChartData.labels = newLabels;

    this.chart()?.update();
  }
}
