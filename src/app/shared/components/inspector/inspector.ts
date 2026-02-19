import { Component, inject, effect, computed, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectorService } from '../../../core/services/inspector/inspector.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import {
  LucideAngularModule,
  X,
  TrendingUp,
  Activity,
  FileText,
  BarChart3,
  ShieldCheck,
  Fingerprint,
  ShieldAlert,
  Trash2,
} from 'lucide-angular';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { UserFormComponent } from '../../../features/team/components/user-form/user-form';
import { ProjectFormComponent } from '../../../features/projects/components/project-form/project-form';
import { TeamMember, ProjectMetric } from '../../../core/models/analytics.models';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../../core/services/milestone/milestone.service';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BaseChartDirective,
    UserFormComponent,
    ProjectFormComponent,
  ],
  templateUrl: './inspector.html',
})
export class InspectorComponent {
  inspector = inject(InspectorService);
  protected modalService = inject(ModalService);
  private analyticsService = inject(AnalyticsService);
  private milestoneService: MilestoneService = inject(MilestoneService);

  protected readonly X = X;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Activity = Activity;
  protected readonly FileText = FileText;
  protected readonly BarChart3 = BarChart3;
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly Fingerprint = Fingerprint;
  protected readonly ShieldAlert = ShieldAlert;
  protected readonly Trash2 = Trash2;

  isOpen = this.inspector.isOpen;
  data = this.inspector.activeData;
  type = this.inspector.activeType;
  isCreating = this.inspector.isCreating;
  isReconfiguring = signal(false);

  // Typed data accessors
  activeUser = computed(() => (this.type() === 'user' ? (this.data() as TeamMember) : null));
  activeMilestone = computed(() =>
    this.type() === 'milestone' ? (this.data() as ProjectMilestone) : null,
  );
  activeSector = computed(() =>
    this.type() === 'sector' ? (this.data() as { name: string; dimensions: string[] }) : null,
  );
  activeMetric = computed(() => (this.type() === 'metric' ? (this.data() as ProjectMetric) : null));

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
        this.isReconfiguring.set(false);
      }
    });
  }

  // Identity Reconfiguration
  toggleReconfigure() {
    this.isReconfiguring.update((v) => !v);
  }

  saveIdentity(updatedData: TeamMember | ProjectMilestone) {
    if (this.type() === 'user') {
      const data = updatedData as TeamMember;
      if (this.isCreating()) {
        this.analyticsService.addTeamMember(data);
      } else {
        this.analyticsService.updateTeamMember(data);
      }
    } else if (this.type() === 'milestone') {
      const data = updatedData as ProjectMilestone;
      if (this.isCreating()) {
        this.milestoneService.addMilestone(data);
      } else {
        this.milestoneService.updateMilestone(data);
      }
    }

    this.inspector.activeData.set(updatedData);
    this.isReconfiguring.set(false);
    this.inspector.isCreating.set(false);
  }

  deprovisionIdentity(id: string, template: TemplateRef<unknown>) {
    this.modalService.open({
      title: 'Deprovisioning Protocol',
      template: template,
      data: { id },
    });
  }

  confirmDeprovision() {
    const data = this.modalService.config()?.data as { id: string };
    const id = data?.id;
    if (!id) return;

    if (this.type() === 'user') {
      this.analyticsService.deprovisionTeamMember(id);
    } else if (this.type() === 'milestone') {
      this.milestoneService.deleteMilestone(id);
    }

    this.modalService.close();
    this.close();
  }

  // Metric History
  metricHistory = computed(() => {
    const activeData = this.data() as { label: string };
    if (this.type() === 'metric' && activeData) {
      return this.analyticsService.getMetricHistory(activeData.label);
    }
    return [];
  });

  public lineChartData = computed<ChartData<'line'>>(() => ({
    labels: this.metricHistory().map((h: { date: Date }) => h.date.getDate().toString()),
    datasets: [
      {
        data: this.metricHistory().map((h: { value: number }) => h.value),
        label: 'Historical Data',
        borderColor: '#c05640',
        backgroundColor: 'rgba(192, 86, 64, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  // Sector Audit
  sectorAudit = computed(() => {
    const activeData = this.data() as { name: string };
    if (this.type() === 'sector' && activeData) {
      return this.analyticsService.getSectorAudit(activeData.name);
    }
    return null;
  });

  public radarChartData = computed<ChartData<'radar'>>(() => {
    const audit = this.sectorAudit();
    return {
      labels: audit?.dimensions || [],
      datasets: [
        {
          data: audit?.sectorValues || [],
          label: 'Current Sector',
          borderColor: '#c05640',
          backgroundColor: 'rgba(192, 86, 64, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#c05640',
        },
        {
          data: audit?.orgAverage || [],
          label: 'Org Average',
          borderColor: '#2c2825',
          backgroundColor: 'rgba(44, 40, 37, 0.05)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };
  });

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        angleLines: { color: 'rgba(0,0,0,0.05)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          font: { family: 'Lato', size: 10, weight: 'bold' },
          color: '#5e4735',
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2c2825',
        bodyColor: '#c05640',
        borderColor: '#efe8da',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
  };

  public lineChartType: ChartType = 'line';
  public radarChartType: ChartType = 'radar';

  close() {
    this.inspector.close();
  }
}
