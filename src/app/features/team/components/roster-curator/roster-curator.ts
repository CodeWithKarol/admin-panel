import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LucideAngularModule, Search, ArrowUpDown, Download } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { SQUADS } from '../../../../core/models/team.constants';

@Component({
  selector: 'app-roster-curator',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="mb-16 space-y-10 border-y border-brand-100 py-10 print:hidden">
      <!-- Search & Sorting Row -->
      <div class="flex flex-col lg:flex-row gap-8 items-stretch lg:items-center justify-between">
        <div class="relative flex-1 max-w-xl group">
          <lucide-icon
            [name]="Search"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300 group-focus-within:text-accent-terracotta transition-colors"
          ></lucide-icon>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search_Operator_Directory..."
            class="w-full pl-8 py-3 bg-transparent text-xl font-serif italic text-accent-charcoal outline-none placeholder:text-brand-200 border-b border-transparent focus:border-accent-terracotta/30 transition-all"
          />
        </div>

        <div class="flex items-center gap-6">
          <div
            class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-400"
          >
            <lucide-icon [name]="ArrowUpDown" class="w-3 h-3"></lucide-icon>
            Sort_By:
          </div>
          <div class="flex gap-2">
            @for (option of sortOptions; track option.value) {
              <button
                (click)="sortBy.set(option.value)"
                [ngClass]="
                  sortBy() === option.value
                    ? 'bg-accent-charcoal text-white'
                    : 'text-brand-500 hover:bg-brand-50'
                "
                class="px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300"
              >
                {{ option.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Squad & Operational Filters Row -->
      <div
        class="flex flex-col lg:flex-row gap-8 items-stretch lg:items-center justify-between border-t border-brand-100/50 pt-10"
      >
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            (click)="activeSquad.set(null)"
            [ngClass]="
              activeSquad() === null
                ? 'border-accent-terracotta text-accent-charcoal'
                : 'border-transparent text-brand-400'
            "
            class="border-b-2 px-1 pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          >
            All_Squads
          </button>
          @for (squad of squads; track squad) {
            <button
              (click)="activeSquad.set(squad)"
              [ngClass]="
                activeSquad() === squad
                  ? 'border-accent-terracotta text-accent-charcoal'
                  : 'border-transparent text-brand-400'
              "
              class="border-b-2 px-1 pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
            >
              {{ squad }}
            </button>
          }
        </div>

        <div class="flex items-center gap-4">
          <div class="flex gap-2 p-1 bg-brand-50/50 rounded-sm">
            @for (filter of statusFilters; track filter.value) {
              <button
                (click)="activeStatusFilter.set(filter.value)"
                [ngClass]="
                  activeStatusFilter() === filter.value
                    ? 'bg-white shadow-sm text-accent-terracotta'
                    : 'text-brand-400'
                "
                class="px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm"
              >
                {{ filter.label }}
              </button>
            }
          </div>
          <button
            (click)="exportManifest()"
            class="flex items-center gap-2 px-6 py-2 border border-brand-200 text-accent-charcoal hover:bg-accent-charcoal hover:text-white text-[9px] font-black uppercase tracking-widest transition-all duration-500"
          >
            <lucide-icon [name]="Download" class="w-3 h-3"></lucide-icon>
            GENERATE_SECURE_MANIFEST
          </button>
        </div>
      </div>
    </div>
  `,
})
export class RosterCuratorComponent {
  private analytics = inject(AnalyticsService);

  searchQuery = this.analytics.searchQuery;
  activeSquad = this.analytics.activeSquad;
  activeStatusFilter = this.analytics.activeStatusFilter;
  sortBy = this.analytics.sortBy;
  sortOptions = this.analytics.sortOptions;
  statusFilters = this.analytics.statusFilters;

  squads = SQUADS;

  protected readonly Search = Search;
  protected readonly ArrowUpDown = ArrowUpDown;
  protected readonly Download = Download;

  exportManifest() {
    window.print();
  }
}
