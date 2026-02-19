import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMilestone } from '../../../../core/services/milestone/milestone.service';
import { LucideAngularModule, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-protocol-ledger',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="border border-brand-200 bg-white">
      <div class="p-4 border-b border-brand-200 flex items-center justify-between bg-brand-50/50">
        <h3 class="text-xs font-black uppercase tracking-widest text-brand-500">Protocol_Ledger</h3>
        <span class="text-[10px] font-mono text-brand-400">Showing {{ totalCount() }} Records</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-brand-200">
              <th
                (click)="onSort('projectName')"
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
                (click)="onSort('phase')"
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
                (click)="onSort('status')"
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
                (click)="onSort('endDate')"
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
            @for (project of milestones(); track project.id) {
              <tr
                (click)="rowClick.emit(project)"
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
                      'bg-brand-100 text-brand-700 border-brand-200': project.status === 'complete',
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
            @if (milestones().length === 0) {
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
  `,
})
export class ProtocolLedgerComponent {
  milestones = input<ProjectMilestone[]>([]);
  totalCount = input<number>(0);
  sortField = input<keyof ProjectMilestone | ''>('');
  sortDirection = input<'asc' | 'desc'>('asc');

  sort = output<keyof ProjectMilestone>();
  rowClick = output<ProjectMilestone>();

  protected readonly ArrowUpDown = ArrowUpDown;
  protected readonly ChevronUp = ChevronUp;
  protected readonly ChevronDown = ChevronDown;

  onSort(field: keyof ProjectMilestone) {
    this.sort.emit(field);
  }

  getSortIcon(field: keyof ProjectMilestone) {
    if (this.sortField() !== field) return ArrowUpDown;
    return this.sortDirection() === 'asc' ? ChevronUp : ChevronDown;
  }
}
