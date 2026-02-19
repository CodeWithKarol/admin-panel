import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, Search, Calendar, FileDown } from 'lucide-angular';

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
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
            (ngModelChange)="searchChange.emit($event)"
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
              for="startDate"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >Start</label
            >
            <div class="relative">
              <input
                #startDateInput
                id="startDate"
                type="date"
                [ngModel]="startDate()"
                (ngModelChange)="startChange.emit($event)"
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
              for="endDate"
              class="text-[10px] font-black uppercase tracking-widest text-brand-400"
              >End</label
            >
            <div class="relative">
              <input
                #endDateInput
                id="endDate"
                type="date"
                [ngModel]="endDate()"
                (ngModelChange)="endChange.emit($event)"
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
            [ngModel]="statusFilter()"
            (ngModelChange)="statusChange.emit($event)"
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
            [ngModel]="phaseFilter()"
            (ngModelChange)="phaseChange.emit($event)"
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
        (click)="exportPdf.emit()"
        class="w-full py-4 bg-brand-700 text-white text-xs font-black uppercase tracking-widest hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 group mb-4"
      >
        <lucide-icon
          [name]="FileDown"
          class="w-4 h-4 group-hover:scale-110 transition-transform"
        ></lucide-icon>
        Export_PDF
      </button>

      <button
        (click)="exportCsv.emit()"
        class="w-full py-4 bg-accent-charcoal text-white text-xs font-black uppercase tracking-widest hover:bg-accent-terracotta transition-colors flex items-center justify-center gap-2 group"
      >
        <lucide-icon
          [name]="FileDown"
          class="w-4 h-4 group-hover:scale-110 transition-transform"
        ></lucide-icon>
        Export_CSV
      </button>
    </div>
  `,
  styles: [
    `
      input[type='date']::-webkit-calendar-picker-indicator {
        display: none;
      }
    `,
  ],
})
export class ReportFiltersComponent {
  searchQuery = input<string>('');
  startDate = input<string>('');
  endDate = input<string>('');
  statusFilter = input<string>('all');
  phaseFilter = input<string>('all');

  searchChange = output<string>();
  startChange = output<string>();
  endChange = output<string>();
  statusChange = output<string>();
  phaseChange = output<string>();
  exportPdf = output<void>();
  exportCsv = output<void>();

  protected readonly Filter = Filter;
  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly FileDown = FileDown;
}
