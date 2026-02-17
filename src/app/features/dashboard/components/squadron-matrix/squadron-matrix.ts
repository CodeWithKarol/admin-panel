import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LucideAngularModule, Shield, AlertTriangle, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-squadron-matrix',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="border border-brand-200 bg-white/50 animate-in fade-in duration-700 delay-300">
      <!-- Header -->
      <div
        class="px-8 py-6 border-b border-brand-200 flex justify-between items-center bg-brand-50/50"
      >
        <div class="flex items-center gap-3">
          <lucide-icon [name]="Shield" class="w-5 h-5 text-accent-charcoal"></lucide-icon>
          <h3 class="font-serif italic text-xl text-accent-charcoal">Squadron Status Matrix</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[9px] font-black uppercase tracking-widest text-brand-400"
            >Live_Telemetry</span
          >
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-brand-100/50">
              <th class="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-brand-400">
                Squadron_ID
              </th>
              <th class="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-brand-400">
                Personnel
              </th>
              <th class="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-brand-400">
                Velocity_Index
              </th>
              <th class="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-brand-400">
                Strain_Load
              </th>
              <th class="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-brand-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            @for (squad of squadMetrics(); track squad.name) {
              <tr class="border-b border-brand-100/50 hover:bg-brand-50 transition-colors group">
                <td class="px-8 py-5">
                  <span
                    class="font-mono text-xs font-bold text-accent-charcoal group-hover:text-accent-terracotta transition-colors"
                  >
                    {{ squad.name }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <div class="flex -space-x-2">
                    @for (p of squad.personnel; track $index) {
                      <div class="w-2 h-6 bg-brand-200 rounded-sm border-r border-white"></div>
                    }
                  </div>
                </td>
                <td class="px-8 py-5 font-serif text-brand-600">
                  {{ squad.velocity }} <span class="text-[9px] text-brand-300 uppercase">pts</span>
                </td>
                <td class="px-8 py-5">
                  <div class="w-24 h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-1000"
                      [ngClass]="{
                        'bg-emerald-500': squad.strain < 3,
                        'bg-amber-500': squad.strain >= 3 && squad.strain < 6,
                        'bg-red-500': squad.strain >= 6,
                      }"
                      [style.width.%]="(squad.strain / 10) * 100"
                    ></div>
                  </div>
                </td>
                <td class="px-8 py-5">
                  @if (squad.strain >= 6) {
                    <div
                      class="inline-flex items-center gap-2 px-2 py-1 bg-red-50 border border-red-100 rounded-sm text-red-600 text-[9px] font-black uppercase tracking-widest"
                    >
                      <lucide-icon [name]="AlertTriangle" class="w-3 h-3"></lucide-icon>
                      Overload
                    </div>
                  } @else if (squad.strain >= 3) {
                    <div
                      class="inline-flex items-center gap-2 px-2 py-1 bg-amber-50 border border-amber-100 rounded-sm text-amber-600 text-[9px] font-black uppercase tracking-widest"
                    >
                      Optimal
                    </div>
                  } @else {
                    <div
                      class="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-sm text-emerald-600 text-[9px] font-black uppercase tracking-widest"
                    >
                      <lucide-icon [name]="CheckCircle" class="w-3 h-3"></lucide-icon>
                      Ready
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class SquadronMatrixComponent {
  private analytics = inject(AnalyticsService);

  protected readonly Shield = Shield;
  protected readonly AlertTriangle = AlertTriangle;
  protected readonly CheckCircle = CheckCircle;

  squadMetrics = computed(() => {
    const members = this.analytics.teamMembers();
    const squads = new Map<string, { count: number; velocity: number; activeTasks: number }>();

    members.forEach((m) => {
      if (!squads.has(m.squad)) {
        squads.set(m.squad, { count: 0, velocity: 0, activeTasks: 0 });
      }
      const data = squads.get(m.squad)!;
      data.count++;
      data.velocity += m.completedTasks;
      data.activeTasks += m.activeTasks;
    });

    return Array.from(squads.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        personnel: Array(data.count).fill(0),
        velocity: data.velocity,
        strain: data.count ? data.activeTasks / data.count : 0,
      }))
      .sort((a, b) => b.strain - a.strain);
  });
}
