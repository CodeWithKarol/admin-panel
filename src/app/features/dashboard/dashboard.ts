import { Component, inject, computed, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { ModalService } from '../../core/services/modal/modal.service';
import { LucideAngularModule, Radio } from 'lucide-angular';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MilestoneTimelineComponent } from './components/milestone-timeline/milestone-timeline';
import { EditorialMetricsComponent } from './components/editorial-metrics/editorial-metrics';
import { WorkloadChartComponent } from './components/workload-chart/workload-chart';
import { ActivePersonnelComponent } from './components/active-personnel/active-personnel';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header';
import { DispatchDeskComponent } from './components/dispatch-desk/dispatch-desk';
import { SquadronMatrixComponent } from './components/squadron-matrix/squadron-matrix';
import { InspectorService } from '../../core/services/inspector/inspector.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    MilestoneTimelineComponent,
    EditorialMetricsComponent,
    WorkloadChartComponent,
    ActivePersonnelComponent,
    DashboardHeaderComponent,
    DispatchDeskComponent,
    SquadronMatrixComponent,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private analyticsService = inject(AnalyticsService);
  private inspector = inject(InspectorService);
  protected modalService = inject(ModalService);

  protected readonly Radio = Radio;

  metrics = this.analyticsService.metrics;
  teamMembers = this.analyticsService.teamMembers;
  lastUpdated = this.analyticsService.lastUpdated;
  isRefreshing = this.analyticsService.isRefreshing;

  refresh() {
    this.analyticsService.refreshData();
  }

  broadcastAlert(template: TemplateRef<unknown>) {
    this.modalService.open({
      title: 'Command Override Protocol',
      template: template,
    });
  }

  confirmBroadcast() {
    this.analyticsService.activities.update((current) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        sender: 'COMMAND_OVERRIDE',
        message: 'GLOBAL_PRIORITY_BROADCAST_INITIATED',
        type: 'URGENT',
      },
      ...current,
    ]);
    this.modalService.close();
  }

  // Breadcrumbs
  breadcrumbs = [{ label: 'Home', route: '/dashboard' }];

  dashboardInsight = computed(() => {
    const velocity = this.metrics().find((m) => m.label === 'Team Velocity');
    if (velocity) {
      const direction = velocity.change >= 0 ? 'increased' : 'decreased';
      return {
        prefix: `Team velocity has ${direction} by`,
        value: `${Math.abs(velocity.change)}%`,
        suffix:
          'this cycle. Read on for a detailed breakdown of operational efficiency and personnel allocation.',
      };
    }

    // Fallback if velocity metric is missing
    const totalTasks = this.teamMembers().reduce((acc, m) => acc + m.activeTasks, 0);
    return {
      prefix: 'Current system load is',
      value: `${totalTasks} Active Tasks`,
      suffix: 'distributed across the operational roster.',
    };
  });

  openSectorAudit(sectorName: string) {
    this.inspector.open({ name: sectorName }, 'sector');
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'Lato' }, color: '#8c6b48' },
      },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2c2825',
        bodyColor: '#5e4735',
        borderColor: '#efe8da',
        borderWidth: 1,
        titleFont: { family: 'Playfair Display', size: 14 },
        bodyFont: { family: 'Lato' },
        padding: 12,
        displayColors: false,
      },
    },
    elements: {
      bar: {
        backgroundColor: '#c05640',
        borderRadius: 2,
      },
    },
  };
  public barChartType: ChartType = 'bar';

  public workloadChartData = computed<ChartData<'bar'>>(() => ({
    labels: this.teamMembers().map((m) => m.name.split(' ')[0]),
    datasets: [
      {
        data: this.teamMembers().map((m) => m.activeTasks),
        label: 'Tasks',
        barThickness: 32,
      },
    ],
  }));
}
