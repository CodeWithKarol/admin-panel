import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileDown } from 'lucide-angular';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardHeaderComponent } from '../dashboard/components/dashboard-header/dashboard-header';
import { WorkloadChartComponent } from '../dashboard/components/workload-chart/workload-chart';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../core/services/milestone/milestone.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { ReportService } from '../../core/services/report/report.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { ReportFiltersComponent } from './components/report-filters/report-filters';
import { ExecutiveSummaryComponent } from './components/executive-summary/executive-summary';
import { ProtocolLedgerComponent } from './components/protocol-ledger/protocol-ledger';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    DashboardHeaderComponent,
    WorkloadChartComponent,
    PaginationComponent,
    ReportFiltersComponent,
    ExecutiveSummaryComponent,
    ProtocolLedgerComponent,
  ],
  template: `
    <div class="animate-in fade-in duration-700 space-y-8 pb-24">
      <!-- Header -->
      <app-dashboard-header
        title="Execution Ledger"
        [lastUpdated]="lastUpdated()"
        [isRefreshing]="isRefreshing()"
        (refresh)="refresh()"
        [breadcrumbs]="breadcrumbs"
        [systemStatus]="'Optimal'"
        [environment]="'Production'"
      >
      </app-dashboard-header>

      <!-- Controls & Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Filters (4 cols) -->
        <app-report-filters
          class="lg:col-span-4"
          [searchQuery]="searchQuery()"
          [startDate]="startDate()"
          [endDate]="endDate()"
          [statusFilter]="statusFilter()"
          [phaseFilter]="phaseFilter()"
          (searchChange)="searchQuery.set($event)"
          (startChange)="startDate.set($event)"
          (endChange)="endDate.set($event)"
          (statusChange)="statusFilter.set($event)"
          (phaseChange)="phaseFilter.set($event)"
          (exportPdf)="exportPdf()"
          (exportCsv)="exportData()"
        >
        </app-report-filters>

        <!-- Metrics Summary & Chart (8 cols) -->
        <div class="lg:col-span-8 space-y-8">
          <app-executive-summary
            [totalCount]="filteredAndSortedMilestones().length"
            [activeRate]="activeRate()"
          >
          </app-executive-summary>

          <!-- Chart Visualization -->
          <div class="bg-white p-6 border border-brand-200">
            <app-workload-chart
              [chartData]="chartData()"
              [chartOptions]="chartOptions"
              [chartType]="chartType"
              (sectorSelected)="onChartClick($event)"
            >
            </app-workload-chart>
          </div>
        </div>
      </div>

      <!-- Protocol Ledger -->
      <app-protocol-ledger
        [milestones]="paginatedMilestones()"
        [totalCount]="filteredAndSortedMilestones().length"
        [sortField]="sortField()"
        [sortDirection]="sortDirection()"
        (sort)="toggleSort($event)"
        (rowClick)="openProject($event)"
      >
      </app-protocol-ledger>
    </div>

    <!-- Pagination -->
    <app-pagination
      [currentPage]="currentPage()"
      [itemsPerPage]="itemsPerPage()"
      [totalItems]="filteredAndSortedMilestones().length"
      (pageChange)="currentPage.set($event)"
    ></app-pagination>
  `,
  styles: [
    `
      input[type='date']::-webkit-calendar-picker-indicator {
        display: none;
      }
    `,
  ],
})
export class ReportsComponent {
  private milestoneService = inject(MilestoneService);
  private analyticsService = inject(AnalyticsService);
  private inspector = inject(InspectorService);
  private reportService = inject(ReportService);

  readonly FileDown = FileDown;

  lastUpdated = this.analyticsService.lastUpdated;
  isRefreshing = this.analyticsService.isRefreshing;

  // Expose ReportService signals to template
  startDate = this.reportService.startDate;
  endDate = this.reportService.endDate;
  searchQuery = this.reportService.searchQuery;
  statusFilter = this.reportService.statusFilter;
  phaseFilter = this.reportService.phaseFilter;
  currentPage = this.reportService.currentPage;
  itemsPerPage = this.reportService.itemsPerPage;
  sortField = this.reportService.sortField;
  sortDirection = this.reportService.sortDirection;

  filteredAndSortedMilestones = this.reportService.filteredAndSortedMilestones;
  paginatedMilestones = this.reportService.paginatedMilestones;
  activeRate = this.reportService.activeRate;
  chartData = this.reportService.chartData;

  // Interactivity
  openProject(project: ProjectMilestone) {
    this.inspector.open(project, 'milestone');
  }

  onChartClick(sectorName: string) {
    this.inspector.open({ name: sectorName }, 'sector');
  }

  toggleSort(field: keyof ProjectMilestone) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  breadcrumbs = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Reports', route: '/reports' },
  ];

  // Chart Logic
  public chartType: ChartType = 'bar';
  public chartOptions: ChartConfiguration['options'] = {
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

  refresh() {
    this.analyticsService.refreshData();
  }

  exportPdf() {
    this.reportService.exportPdf();
  }

  exportData() {
    this.reportService.exportCsv();
  }
}
