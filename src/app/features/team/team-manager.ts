import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list';
import { SquadPulseComponent } from './components/squad-pulse/squad-pulse';
import { RosterCuratorComponent } from './components/roster-curator/roster-curator';
import { InspectorService } from '../../core/services/inspector/inspector.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { DashboardHeaderComponent } from '../dashboard/components/dashboard-header/dashboard-header';
import { LucideAngularModule, UserPlus, ShieldAlert, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-team-manager',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    SquadPulseComponent,
    RosterCuratorComponent,
    DashboardHeaderComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="animate-in fade-in duration-700 space-y-8 pb-24">
      <app-dashboard-header
        title="The Collective"
        [lastUpdated]="lastUpdated()"
        [isRefreshing]="isRefreshing()"
        (refresh)="refresh()"
        [breadcrumbs]="breadcrumbs"
        [systemStatus]="'Optimal'"
        [environment]="'Production'"
      >
        <button
          header-actions
          (click)="initNewIdentity()"
          class="flex items-center gap-3 px-6 py-4 bg-accent-charcoal text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent-terracotta transition-all duration-500 group print:hidden"
        >
          <lucide-icon
            [name]="UserPlus"
            class="w-4 h-4 group-hover:rotate-12 transition-transform"
          ></lucide-icon>
          INITIALIZE_NEW_IDENTITY
        </button>
      </app-dashboard-header>

      <app-squad-pulse class="print:hidden"></app-squad-pulse>

      <app-roster-curator></app-roster-curator>

      @if (filteredMembers().length > 0) {
        <app-user-list></app-user-list>
      } @else {
        <div
          class="py-32 text-center border border-dashed border-brand-200 bg-brand-50/30 animate-in fade-in duration-1000"
        >
          <lucide-icon
            [name]="ShieldAlert"
            class="w-12 h-12 text-brand-200 mx-auto mb-6"
          ></lucide-icon>
          <h3 class="text-3xl font-serif italic text-brand-400 mb-2">
            No identities match this telemetric signature.
          </h3>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-300">
            SYSTEM_SEARCH_YIELDED_ZERO_RESULTS
          </p>
        </div>
      }
    </div>
  `,
})
export class TeamManagerComponent {
  private inspector = inject(InspectorService);
  private analytics = inject(AnalyticsService);

  protected readonly UserPlus = UserPlus;
  protected readonly ShieldAlert = ShieldAlert;
  protected readonly ChevronRight = ChevronRight;

  // Breadcrumbs
  breadcrumbs = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Team', route: '/team' },
  ];

  lastUpdated = this.analytics.lastUpdated;
  isRefreshing = this.analytics.isRefreshing;
  memberCount = computed(() => this.analytics.teamMembers().length);
  filteredMembers = this.analytics.filteredMembers;

  refresh() {
    this.analytics.refreshData();
  }

  initNewIdentity() {
    this.inspector.initializeNew('user');
  }
}
