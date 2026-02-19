import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../core/services/milestone/milestone.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { ProjectCardComponent } from './components/project-card/project-card';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { DashboardHeaderComponent } from '../dashboard/components/dashboard-header/dashboard-header';
import {
  LucideAngularModule,
  Grid,
  List,
  Sparkles,
  Plus,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-angular';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    LucideAngularModule,
    FormsModule,
    DashboardHeaderComponent,
  ],
  template: `
    <div class="animate-in fade-in duration-700 space-y-8 pb-24">
      <!-- Header -->
      <app-dashboard-header
        title="Active Protocols"
        [lastUpdated]="lastUpdated()"
        [isRefreshing]="isRefreshing()"
        (refresh)="refresh()"
        [breadcrumbs]="breadcrumbs"
        [systemStatus]="'Optimal'"
        [environment]="'Production'"
      >
        <button
          header-actions
          (click)="createProject()"
          class="px-6 py-4 bg-accent-charcoal text-white text-xs font-black uppercase tracking-widest hover:bg-accent-terracotta transition-all shadow-lg shadow-accent-charcoal/20 flex items-center gap-2 group"
        >
          <lucide-icon
            [name]="Plus"
            class="w-4 h-4 group-hover:scale-110 transition-transform"
          ></lucide-icon>
          Initialize_Protocol
        </button>
      </app-dashboard-header>

      <!-- Controls -->
      <div class="flex flex-col md:flex-row gap-6 mb-12">
        <div class="relative flex-1">
          <div
            class="flex items-center bg-white border border-brand-200 focus-within:border-accent-terracotta transition-colors"
          >
            <lucide-icon [name]="Search" class="ml-4 w-4 h-4 text-brand-400 shrink-0"></lucide-icon>
            <input
              [(ngModel)]="searchQuery"
              type="text"
              placeholder="Search protocols..."
              class="w-full pl-6 pr-4 py-4 bg-transparent border-none font-mono text-sm text-accent-charcoal focus:outline-none placeholder:text-brand-300"
            />
          </div>
        </div>

        <div class="relative w-full md:w-64">
          <div
            class="flex items-center bg-white border border-brand-200 focus-within:border-accent-terracotta transition-colors"
          >
            <lucide-icon [name]="Filter" class="ml-4 w-4 h-4 text-brand-400 shrink-0"></lucide-icon>
            <select
              [(ngModel)]="statusFilter"
              class="w-full pl-6 pr-4 py-4 bg-transparent border-none font-mono text-sm text-accent-charcoal focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">Check_All_Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="complete">Complete</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Project Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (project of filteredMilestones(); track project.id) {
          <app-project-card [project]="project" (cardClick)="openDetails(project)">
          </app-project-card>
        }
      </div>

      <!-- Empty State -->
      @if (filteredMilestones().length === 0) {
        <div class="py-32 text-center border border-dashed border-brand-200 bg-brand-50/30">
          <p class="text-xl font-serif italic text-brand-400 mb-2">
            No protocols found matching criteria.
          </p>
          <button
            (click)="resetFilters()"
            class="text-xs font-black uppercase tracking-widest text-accent-terracotta hover:underline"
          >
            Reset_Filters
          </button>
        </div>
      }
    </div>
  `,
})
export class ProjectsComponent {
  private milestoneService = inject(MilestoneService);
  private analyticsService = inject(AnalyticsService);
  private inspector = inject(InspectorService);

  searchQuery = signal('');
  statusFilter = signal('all');

  milestones = this.milestoneService.milestones;
  lastUpdated = this.analyticsService.lastUpdated;
  isRefreshing = this.analyticsService.isRefreshing;

  filteredMilestones = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.statusFilter();

    return this.milestones().filter((m) => {
      const matchesSearch =
        m.projectName.toLowerCase().includes(query) ||
        (m.missionStatement?.toLowerCase() || '').includes(query);
      const matchesFilter = filter === 'all' || m.status === filter;

      return matchesSearch && matchesFilter;
    });
  });

  protected readonly Grid = Grid;
  protected readonly List = List;
  protected readonly Sparkles = Sparkles;
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  protected readonly Filter = Filter;
  protected readonly ChevronRight = ChevronRight;

  // Breadcrumbs
  breadcrumbs = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Projects', route: '/projects' },
  ];

  openDetails(project: ProjectMilestone) {
    this.inspector.open(project, 'milestone');
  }

  createProject() {
    this.inspector.open(null, 'milestone');
    this.inspector.isCreating.set(true);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.statusFilter.set('all');
  }

  refresh() {
    this.analyticsService.refreshData();
  }
}
