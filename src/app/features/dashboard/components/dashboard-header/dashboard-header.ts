import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, RefreshCw, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, DatePipe, LucideAngularModule, RouterLink],
  template: `
    <div
      class="flex flex-col sm:flex-row sm:items-end justify-between gap-10 border-b border-brand-800 pb-8 mb-8"
    >
      <div class="space-y-4">
        <!-- Breadcrumbs -->
        <nav
          class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-400"
        >
          @for (crumb of breadcrumbs(); track crumb.label; let last = $last) {
            @if (crumb.route && !last) {
              <a
                [routerLink]="crumb.route"
                class="hover:text-accent-terracotta transition-colors"
                >{{ crumb.label }}</a
              >
              <lucide-icon [name]="ChevronRight" class="w-3 h-3"></lucide-icon>
            } @else {
              <span class="text-brand-600">{{ crumb.label }}</span>
            }
          }
        </nav>

        <h2
          class="text-4xl md:text-6xl font-black text-accent-charcoal tracking-[-0.05em] uppercase leading-none"
        >
          {{ title() }}
        </h2>
        <div class="flex items-center gap-4">
          <div
            class="px-3 py-1 bg-brand-100 text-[9px] font-black text-accent-charcoal uppercase tracking-[0.2em]"
          >
            {{ environment() }}
          </div>
          <div class="text-[9px] font-bold text-brand-400 uppercase tracking-[0.2em]">
            Sync_Status:
            <span
              [ngClass]="{
                'text-accent-terracotta': systemStatus() === 'Optimal',
                'text-amber-500': systemStatus() === 'Degraded',
                'text-red-500': systemStatus() === 'Critical',
              }"
              >{{ systemStatus() }}</span
            >
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-8 pt-4 sm:pt-0">
        <div class="text-left sm:text-right">
          <div class="text-[9px] font-black text-brand-400 uppercase tracking-[0.2em]">
            Last Integrity Check
          </div>
          <div class="text-[10px] font-mono font-bold text-accent-charcoal">
            {{ lastUpdated() | date: 'HH:mm:ss' }}
          </div>
        </div>
        <div class="flex gap-4">
          <ng-content select="[header-actions]"></ng-content>

          <button
            (click)="refresh.emit()"
            [disabled]="isRefreshing()"
            class="flex items-center gap-3 px-4 py-2 bg-accent-charcoal text-white hover:bg-black transition-all text-[9px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
          >
            <lucide-icon
              [name]="RefreshCw"
              [class.animate-spin]="isRefreshing()"
              class="w-3.5 h-3.5"
            ></lucide-icon>
            Refresh_Feed
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardHeaderComponent {
  title = input.required<string>();
  lastUpdated = input.required<Date>();
  isRefreshing = input<boolean>(false);

  breadcrumbs = input<{ label: string; route?: string }[]>([]);
  systemStatus = input<'Optimal' | 'Degraded' | 'Critical'>('Optimal');
  environment = input<string>('Production');

  refresh = output<void>();

  protected readonly RefreshCw = RefreshCw;
  protected readonly ChevronRight = ChevronRight;
}
