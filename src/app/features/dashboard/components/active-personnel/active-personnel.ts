import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../../../core/models/analytics.models';
import { LucideAngularModule, Clock } from 'lucide-angular';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';

@Component({
  selector: 'app-active-personnel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div>
      <h3 class="text-sm font-bold uppercase tracking-widest border-b border-brand-300 pb-2 mb-6">Active Personnel</h3>
      <div class="space-y-6">
        @for (member of members().slice(0, 4); track member.id) {
          <div (click)="openInspector(member)"
               (keydown.enter)="openInspector(member)"
               tabindex="0"
               role="button"
               class="flex items-start gap-4 pb-6 border-b border-brand-100 last:border-0 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-accent-terracotta/20 rounded-lg transition-all">
            <img [src]="member.avatar" class="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 object-cover border-2 border-transparent group-hover:border-accent-terracotta shadow-sm" alt="">
            <div class="flex-1 min-w-0">
              <h4 class="font-serif text-lg leading-none mb-1 group-hover:text-accent-terracotta transition-colors">{{ member.name }}</h4>
              <p class="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">{{ member.role }}</p>
              <div class="flex items-center gap-2 text-xs text-brand-500">
                <lucide-icon [name]="Clock" class="w-3 h-3"></lucide-icon>
                <span>{{ member.activeTasks }} Active Tasks</span>
              </div>
            </div>
          </div>
        }
      </div>
      <button (click)="viewFullRoster()" 
              class="w-full mt-4 py-3 border border-brand-300 text-xs font-black uppercase tracking-widest hover:bg-brand-800 hover:text-white transition-all duration-500">
        View Full Roster
      </button>
    </div>
  `
})
export class ActivePersonnelComponent {
  members = input.required<TeamMember[]>();
  private inspector = inject(InspectorService);
  private nav = inject(NavigationService);
  
  protected readonly Clock = Clock;

  openInspector(member: TeamMember) {
    this.inspector.open(member, 'user');
  }

  viewFullRoster() {
    this.nav.navigateWithManifest('/team');
  }
}
