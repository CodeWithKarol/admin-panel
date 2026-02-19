import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMilestone } from '../../../../core/services/milestone/milestone.service';
import { PROJECT_STATUS_COLORS } from '../../../../core/models/milestone.models';
import { LucideAngularModule, Activity, Calendar, ArrowUpRight, BarChart } from 'lucide-angular';
import { MilestoneService } from '../../../../core/services/milestone/milestone.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      (click)="cardClick.emit(project())"
      (keydown.enter)="cardClick.emit(project())"
      tabindex="0"
      role="button"
      class="group relative bg-white border border-brand-200 p-8 hover:border-accent-terracotta transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col"
    >
      <!-- Status Indicator -->
      <div class="absolute top-0 right-0 p-4">
        <div class="flex items-center gap-2">
          <span
            class="text-[9px] font-black uppercase tracking-widest text-brand-400 group-hover:text-accent-terracotta transition-colors"
          >
            {{ project().status }}
          </span>
          <div class="w-2 h-2 rounded-full" [ngClass]="getStatusColor(project().status)"></div>
        </div>
      </div>

      <!-- Header -->
      <div class="mb-8 pr-12">
        <div class="flex items-center gap-3 mb-4">
          <span
            class="px-2 py-1 bg-brand-100/50 text-[8px] font-black uppercase tracking-widest text-brand-500 rounded-sm"
          >
            {{ project().phase }}
          </span>
        </div>
        <h3
          class="text-3xl font-black text-accent-charcoal uppercase tracking-tighter leading-none break-words group-hover:text-accent-terracotta transition-colors duration-300"
        >
          {{ project().projectName }}
        </h3>
      </div>

      <!-- Mission Statement -->
      <p class="text-sm font-serif italic text-brand-600 mb-8 line-clamp-3 flex-1">
        "{{ project().missionStatement }}"
      </p>

      <!-- Progress Bar -->
      <div class="space-y-2 mb-8">
        <div
          class="flex justify-between text-[9px] font-black uppercase tracking-widest text-brand-400"
        >
          <span>Completion_Index</span>
          <span>{{ progress() }}%</span>
        </div>
        <div class="h-1 w-full bg-brand-100 overflow-hidden">
          <div
            class="h-full bg-accent-charcoal group-hover:bg-accent-terracotta transition-all duration-1000 ease-out"
            [style.width.%]="progress()"
          ></div>
        </div>
      </div>

      <!-- Footer Meta -->
      <div class="flex items-center justify-between border-t border-brand-100 pt-6 mt-auto">
        <div class="flex items-center gap-2 text-brand-400">
          <lucide-icon [name]="Calendar" class="w-3 h-3"></lucide-icon>
          <span class="text-[9px] font-mono font-bold uppercase tracking-tight">
            {{ project().endDate | date: 'MMM dd, yyyy' }}
          </span>
        </div>

        <div
          class="w-8 h-8 rounded-full border border-brand-200 flex items-center justify-center text-brand-300 group-hover:border-accent-terracotta group-hover:text-accent-terracotta transition-all"
        >
          <lucide-icon [name]="ArrowUpRight" class="w-4 h-4"></lucide-icon>
        </div>
      </div>

      <!-- Hover Effect Overlay -->
      <div
        class="absolute inset-0 bg-accent-terracotta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      ></div>
    </div>
  `,
})
export class ProjectCardComponent {
  project = input.required<ProjectMilestone>();
  cardClick = output<ProjectMilestone>();

  private milestoneService = inject(MilestoneService);

  protected readonly Activity = Activity;
  protected readonly Calendar = Calendar;
  protected readonly ArrowUpRight = ArrowUpRight;
  protected readonly BarChart = BarChart;

  progress = computed(() => this.milestoneService.calculateProgress(this.project()));

  getStatusColor(status: ProjectMilestone['status']) {
    return PROJECT_STATUS_COLORS[status] || 'bg-brand-200';
  }
}
