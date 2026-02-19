import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { LucideAngularModule, MoreHorizontal, ExternalLink } from 'lucide-angular';
import { TeamMember } from '../../../../core/models/analytics.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      @for (member of members(); track member.id) {
        <div (click)="openDossier(member)"
             (keydown.enter)="openDossier(member)"
             tabindex="0"
             role="button"
             class="group cursor-pointer relative outline-none focus-visible:ring-2 focus-visible:ring-accent-terracotta/20 rounded-xl transition-all">
          
          <!-- Image Container with Grayscale Effect -->
          <div class="relative aspect-[3/4] mb-6 overflow-hidden bg-brand-100 rounded-sm">
            <img [src]="member.avatar" 
                 class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105" 
                 [alt]="member.name">
            
            <!-- Status Badge Overlay -->
            <div class="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm border border-brand-100 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div class="flex items-center gap-2">
                 <div class="w-2 h-2 rounded-full" [ngClass]="getStatusColor(member.status)"></div>
                 <span class="text-[10px] font-black uppercase tracking-tighter text-brand-600">{{ member.status }}</span>
               </div>
            </div>

            <!-- Action Prompt -->
            <div class="absolute inset-0 bg-accent-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <lucide-icon [name]="ExternalLink" class="w-8 h-8 text-white stroke-[1px]"></lucide-icon>
            </div>
          </div>

          <!-- Personnel Info -->
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <h3 class="font-serif text-2xl font-bold text-accent-charcoal group-hover:text-accent-terracotta transition-colors">
                {{ member.name }}
              </h3>
              <lucide-icon [name]="MoreHorizontal" class="w-5 h-5 text-brand-300"></lucide-icon>
            </div>
            
            <div class="flex flex-col gap-1">
               <p class="text-[10px] font-black uppercase tracking-widest text-accent-terracotta">
                 // {{ member.role }}
               </p>
               <p class="text-xs font-serif italic text-brand-500">
                 Active Deployment: {{ member.activeTasks }} Cycles
               </p>
            </div>

            <!-- Razor Progress (Editorial Touch) -->
            <div class="w-full h-[1px] bg-brand-100 group-hover:bg-accent-terracotta transition-colors duration-500"></div>
            
            <div class="flex justify-between items-center pt-1 text-[9px] font-bold text-brand-400 uppercase tracking-widest">
              <span>Historical Impact</span>
              <span>{{ member.completedTasks }} Achievements</span>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserListComponent {
  private analyticsService = inject(AnalyticsService);
  private inspector = inject(InspectorService);

  protected readonly ExternalLink = ExternalLink;
  protected readonly MoreHorizontal = MoreHorizontal;

  members = this.analyticsService.filteredMembers;

  getStatusColor(status: TeamMember['status']) {
    switch (status) {
      case 'online': return 'bg-accent-sage shadow-[0_0_8px_rgba(111,130,111,0.5)]';
      case 'busy': return 'bg-accent-terracotta shadow-[0_0_8px_rgba(192,86,64,0.5)]';
      case 'offline': return 'bg-brand-300';
      default: return 'bg-brand-200';
    }
  }

  openDossier(member: TeamMember) {
    this.inspector.open({ 
      ...member, 
      bio: `Lead architect specializing in high-frequency data pipelines. Instrumental in the recent AXON_CORE synchronization event. Known for surgical precision in code refactoring.` 
    }, 'user');
  }
}
