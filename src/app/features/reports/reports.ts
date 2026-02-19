import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  FileDown,
  Calendar,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-angular';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardHeaderComponent } from '../dashboard/components/dashboard-header/dashboard-header';
import { WorkloadChartComponent } from '../dashboard/components/workload-chart/workload-chart';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../core/services/milestone/milestone.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        <!-- Controls (4 cols) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white p-6 border border-brand-200 space-y-6 shadow-sm">
            <div class="flex items-center gap-2 text-brand-400 mb-2">
              <lucide-icon [name]="Filter" class="w-4 h-4"></lucide-icon>
              <h3 class="text-xs font-black uppercase tracking-widest">Report_Parameters</h3>
            </div>

            <div class="space-y-4">
              <!-- Search Input -->
              <div class="relative">
                <input
                  type="text"
                  [ngModel]="searchQuery()"
                  (ngModelChange)="searchQuery.set($event)"
                  placeholder="SEARCH_PROTOCOLS..."
                  class="w-full bg-brand-50 border border-brand-200 p-3 pl-12 font-mono text-xs text-accent-charcoal placeholder:text-brand-300 focus:outline-none focus:border-accent-terracotta"
                />
                <lucide-icon
                  [name]="Search"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400"
                ></lucide-icon>
              </div>
              <!-- Date Range -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label
                    for="reportStartDate"
                    class="text-[10px] font-black uppercase tracking-widest text-brand-400"
                    >Start</label
                  >
                  <div class="relative">
                    <input
                      id="reportStartDate"
                      #startDateInput
                      type="date"
                      [ngModel]="startDate()"
                      (ngModelChange)="startDate.set($event)"
                      class="w-full bg-brand-50 border border-brand-200 p-3 pl-12 font-mono text-xs text-accent-charcoal focus:outline-none focus:border-accent-terracotta"
                    />
                    <lucide-icon
                      [name]="Calendar"
                      (click)="startDateInput.showPicker()"
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 cursor-pointer"
                    ></lucide-icon>
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for="reportEndDate"
                    class="text-[10px] font-black uppercase tracking-widest text-brand-400"
                    >End</label
                  >
                  <div class="relative">
                    <input
                      id="reportEndDate"
                      #endDateInput
                      type="date"
                      [ngModel]="endDate()"
                      (ngModelChange)="endDate.set($event)"
                      class="w-full bg-brand-50 border border-brand-200 p-3 pl-12 font-mono text-xs text-accent-charcoal focus:outline-none focus:border-accent-terracotta"
                    />
                    <lucide-icon
                      [name]="Calendar"
                      (click)="endDateInput.showPicker()"
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 cursor-pointer"
                    ></lucide-icon>
                  </div>
                </div>
              </div>

              <!-- Status Filter -->
              <div class="space-y-2">
                <label
                  for="statusFilter"
                  class="text-[10px] font-black uppercase tracking-widest text-brand-400"
                  >Status_Filter</label
                >
                <select
                  id="statusFilter"
                  [(ngModel)]="statusFilter"
                  class="w-full bg-brand-50 border border-brand-200 p-3 font-serif text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="complete">Complete</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <!-- Phase Filter -->
              <div class="space-y-2">
                <label
                  for="phaseFilter"
                  class="text-[10px] font-black uppercase tracking-widest text-brand-400"
                  >Phase_Filter</label
                >
                <select
                  id="phaseFilter"
                  [(ngModel)]="phaseFilter"
                  class="w-full bg-brand-50 border border-brand-200 p-3 font-serif text-sm text-accent-charcoal focus:outline-none focus:border-accent-terracotta appearance-none"
                >
                  <option value="all">All Phases</option>
                  <option value="Research">Research</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Development">Development</option>
                  <option value="QA">QA</option>
                  <option value="Deployment">Deployment</option>
                </select>
              </div>
            </div>

            <button
              (click)="exportPdf()"
              class="w-full py-4 bg-brand-700 text-white text-xs font-black uppercase tracking-widest hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 group mb-4"
            >
              <lucide-icon
                [name]="FileDown"
                class="w-4 h-4 group-hover:scale-110 transition-transform"
              ></lucide-icon>
              Export_PDF
            </button>

            <button
              (click)="exportData()"
              class="w-full py-4 bg-accent-charcoal text-white text-xs font-black uppercase tracking-widest hover:bg-accent-terracotta transition-colors flex items-center justify-center gap-2 group"
            >
              <lucide-icon
                [name]="FileDown"
                class="w-4 h-4 group-hover:scale-110 transition-transform"
              ></lucide-icon>
              Export_CSV
            </button>
          </div>
        </div>

        <!-- Metrics Summary & Chart (8 cols) -->
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-brand-100/50 border-l-4 border-accent-terracotta p-8">
            <h3 class="font-serif italic text-2xl text-brand-800 mb-4">Executive Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
                  Total_Protocols
                </p>
                <p class="text-4xl font-black text-accent-charcoal">
                  {{ filteredAndSortedMilestones().length }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
                  Active_Rate
                </p>
                <p class="text-4xl font-black text-accent-charcoal">{{ activeRate }}%</p>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
                  Completion_Forecast
                </p>
                <p class="text-4xl font-black text-accent-charcoal">Q3</p>
              </div>
            </div>
          </div>

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

      <!-- Detailed Table -->
      <div class="border border-brand-200 bg-white">
        <div class="p-4 border-b border-brand-200 flex items-center justify-between bg-brand-50/50">
          <h3 class="text-xs font-black uppercase tracking-widest text-brand-500">
            Protocol_Ledger
          </h3>
          <span class="text-[10px] font-mono text-brand-400"
            >Showing {{ filteredAndSortedMilestones().length }} Records</span
          >
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-brand-200">
                <th
                  (click)="toggleSort('projectName')"
                  class="p-4 text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-50/30 cursor-pointer hover:bg-brand-100 transition-colors group select-none"
                >
                  <div class="flex items-center gap-1">
                    Protocol
                    <lucide-icon
                      [name]="getSortIcon('projectName')"
                      class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      [class.opacity-100]="sortField() === 'projectName'"
                    ></lucide-icon>
                  </div>
                </th>
                <th
                  (click)="toggleSort('phase')"
                  class="p-4 text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-50/30 cursor-pointer hover:bg-brand-100 transition-colors group select-none"
                >
                  <div class="flex items-center gap-1">
                    Phase
                    <lucide-icon
                      [name]="getSortIcon('phase')"
                      class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      [class.opacity-100]="sortField() === 'phase'"
                    ></lucide-icon>
                  </div>
                </th>
                <th
                  (click)="toggleSort('status')"
                  class="p-4 text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-50/30 cursor-pointer hover:bg-brand-100 transition-colors group select-none"
                >
                  <div class="flex items-center gap-1">
                    Status
                    <lucide-icon
                      [name]="getSortIcon('status')"
                      class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      [class.opacity-100]="sortField() === 'status'"
                    ></lucide-icon>
                  </div>
                </th>
                <th
                  (click)="toggleSort('endDate')"
                  class="p-4 text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-50/30 cursor-pointer hover:bg-brand-100 transition-colors group select-none"
                >
                  <div class="flex items-center gap-1">
                    Timeline (End)
                    <lucide-icon
                      [name]="getSortIcon('endDate')"
                      class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      [class.opacity-100]="sortField() === 'endDate'"
                    ></lucide-icon>
                  </div>
                </th>
                <th
                  class="p-4 text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-50/30"
                >
                  Mission
                </th>
              </tr>
            </thead>
            <tbody class="font-mono text-xs">
              @for (project of paginatedMilestones(); track project.id) {
                <tr
                  (click)="openProject(project)"
                  class="border-b border-brand-100 hover:bg-accent-terracotta/5 transition-colors group cursor-pointer"
                >
                  <td
                    class="p-4 font-bold text-accent-charcoal group-hover:text-accent-terracotta transition-colors"
                  >
                    {{ project.projectName }}
                  </td>
                  <td class="p-4 text-brand-600">{{ project.phase }}</td>
                  <td class="p-4">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      [ngClass]="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200':
                          project.status === 'active',
                        'bg-amber-50 text-amber-700 border-amber-200': project.status === 'paused',
                        'bg-blue-50 text-blue-700 border-blue-200': project.status === 'upcoming',
                        'bg-brand-100 text-brand-700 border-brand-200':
                          project.status === 'complete',
                      }"
                    >
                      {{ project.status }}
                    </span>
                  </td>
                  <td class="p-4 text-brand-500">
                    {{ project.startDate | date: 'MMM d' }} -
                    {{ project.endDate | date: 'MMM d, y' }}
                  </td>
                  <td class="p-4 text-brand-500 italic max-w-md truncate">
                    {{ project.missionStatement }}
                  </td>
                </tr>
              }
              @if (filteredAndSortedMilestones().length === 0) {
                <tr>
                  <td colspan="5" class="p-12 text-center text-brand-400 italic font-serif">
                    No records found matching the specified criteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
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

  readonly FileDown = FileDown;
  readonly Calendar = Calendar;
  readonly Filter = Filter;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly Search = Search;

  lastUpdated = this.analyticsService.lastUpdated;
  isRefreshing = this.analyticsService.isRefreshing;
  milestones = this.milestoneService.milestones;

  // Filters
  startDate = signal(new Date('2026-01-01').toISOString().split('T')[0]);
  endDate = signal(new Date('2026-12-31').toISOString().split('T')[0]);
  searchQuery = signal('');
  statusFilter = signal<string>('all');
  phaseFilter = signal<string>('all');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Sorting
  sortField = signal<keyof ProjectMilestone | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredAndSortedMilestones = computed(() => {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    const status = this.statusFilter();
    const phase = this.phaseFilter();
    const sField = this.sortField();
    const sDir = this.sortDirection();
    const query = this.searchQuery().toLowerCase();

    let filtered = this.milestones().filter((m) => {
      const mStart = new Date(m.startDate);
      const mEnd = new Date(m.endDate);
      const dateWait = mStart >= start && mEnd <= end;

      const statusMatch = status === 'all' || m.status === status;
      const phaseMatch = phase === 'all' || m.phase === phase;
      const queryMatch =
        !query ||
        m.projectName.toLowerCase().includes(query) ||
        (m.missionStatement?.toLowerCase().includes(query) ?? false);

      return dateWait && statusMatch && phaseMatch && queryMatch;
    });

    if (sField) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sField];
        const valB = b[sField];

        if (valA! < valB!) return sDir === 'asc' ? -1 : 1;
        if (valA! > valB!) return sDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  });

  paginatedMilestones = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredAndSortedMilestones().slice(start, end);
  });

  // Reset pagination on filter change
  constructor() {
    effect(() => {
      // Access signals to track dependencies
      this.startDate();
      this.endDate();
      this.statusFilter();
      this.phaseFilter();
      this.searchQuery();

      // Reset to page 1
      this.currentPage.set(1);
    });
  }

  get activeRate(): number {
    const total = this.filteredAndSortedMilestones().length;
    if (total === 0) return 0;
    const active = this.filteredAndSortedMilestones().filter((m) => m.status === 'active').length;
    return Math.round((active / total) * 100);
  }

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

  getSortIcon(field: keyof ProjectMilestone) {
    if (this.sortField() !== field) return ArrowUpDown;
    return this.sortDirection() === 'asc' ? ChevronUp : ChevronDown;
  }

  // Breadcrumbs
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

  public chartData = computed<ChartData<'bar'>>(() => {
    const milestones = this.filteredAndSortedMilestones();
    const phases = ['Research', 'Development', 'QA', 'Deployment'];
    const data = phases.map((phase) => milestones.filter((m) => m.phase === phase).length);

    return {
      labels: phases,
      datasets: [
        {
          data,
          label: 'Projects',
          barThickness: 32,
          backgroundColor: '#c05640',
        },
      ],
    };
  });

  refresh() {
    this.analyticsService.refreshData();
  }

  exportPdf() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 40, 37); // accent-charcoal
    doc.text('Execution Ledger Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Filter Summary
    doc.setFontSize(10);
    doc.text(
      `Filters: ${this.statusFilter() !== 'all' ? 'Status: ' + this.statusFilter() : ''} ${this.phaseFilter() !== 'all' ? 'Phase: ' + this.phaseFilter() : ''}`,
      14,
      38,
    );

    const data = this.filteredAndSortedMilestones().map((m) => [
      m.projectName,
      m.phase,
      m.status,
      new Date(m.startDate).toLocaleDateString(),
      new Date(m.endDate).toLocaleDateString(),
      m.missionStatement || '',
    ]);

    autoTable(doc, {
      head: [['Protocol', 'Phase', 'Status', 'Start', 'End', 'Mission']],
      body: data,
      startY: 45,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [192, 86, 64], // accent-terracotta
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 248, 245], // brand-50
      },
    });

    doc.save('protocol_ledger_report.pdf');
  }

  exportData() {
    const data = this.filteredAndSortedMilestones().map((m) => ({
      Project: m.projectName,
      Phase: m.phase,
      Status: m.status,
      Start: m.startDate,
      End: m.endDate,
      Mission: m.missionStatement || '',
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(data[0]).join(',') +
      '\n' +
      data.map((row) => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'protocol_ledger_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
