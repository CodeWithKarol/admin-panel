import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LucideAngularModule, Activity, Zap, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-squad-pulse',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      <!-- Operational Readiness -->
      <div class="editorial-card p-10 bg-accent-charcoal text-white relative overflow-hidden group">
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-8">
            <lucide-icon [name]="ShieldCheck" class="w-4 h-4 text-accent-sage"></lucide-icon>
            <span class="text-[9px] font-black uppercase tracking-[0.4em] text-brand-300">Operational_Readiness</span>
          </div>
          <div class="flex items-baseline gap-2 mb-2">
            <span class="text-7xl font-serif font-bold text-white leading-none">{{ readiness() }}</span>
            <span class="text-2xl font-serif italic text-accent-sage leading-none">%</span>
          </div>
          <p class="text-xs font-serif italic text-brand-300">Current aggregate of active system operators.</p>
        </div>
        <!-- Abstract Background Element -->
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      </div>

      <!-- Availability Matrix -->
      <div class="editorial-card p-10 bg-white">
        <div class="flex items-center gap-3 mb-8 border-b border-brand-100 pb-4">
          <lucide-icon [name]="Activity" class="w-4 h-4 text-accent-terracotta"></lucide-icon>
          <span class="text-[9px] font-black uppercase tracking-[0.4em] text-brand-400">Availability_Matrix</span>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div class="space-y-2">
            <span class="text-[8px] font-black text-brand-300 uppercase tracking-widest">Online</span>
            <p class="text-3xl font-serif font-bold text-accent-charcoal">{{ matrix().online }}</p>
          </div>
          <div class="space-y-2 border-x border-brand-100 px-6">
            <span class="text-[8px] font-black text-brand-300 uppercase tracking-widest">Busy</span>
            <p class="text-3xl font-serif font-bold text-accent-terracotta">{{ matrix().busy }}</p>
          </div>
          <div class="space-y-2 text-right">
            <span class="text-[8px] font-black text-brand-300 uppercase tracking-widest">Offline</span>
            <p class="text-3xl font-serif font-bold text-brand-400">{{ matrix().offline }}</p>
          </div>
        </div>
      </div>

      <!-- Skill Distribution / Capacity -->
      <div class="editorial-card p-10 border border-brand-200 bg-brand-50/50 relative group overflow-hidden">
        <div class="flex items-center gap-3 mb-8">
          <lucide-icon [name]="Zap" class="w-4 h-4 text-accent-charcoal"></lucide-icon>
          <span class="text-[9px] font-black uppercase tracking-[0.4em] text-brand-400">Resource_Capacity</span>
        </div>
        <div class="space-y-5">
          <div class="space-y-2">
            <div class="flex justify-between text-[8px] font-black uppercase tracking-tighter">
              <span>System Throughput</span>
              <span>88%</span>
            </div>
            <div class="h-1 bg-brand-200 w-full overflow-hidden">
              <div class="h-full bg-accent-charcoal w-[88%] group-hover:bg-accent-terracotta transition-all duration-700"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[8px] font-black uppercase tracking-tighter">
              <span>Response Velocity</span>
              <span>72%</span>
            </div>
            <div class="h-1 bg-brand-200 w-full overflow-hidden">
              <div class="h-full bg-accent-charcoal w-[72%] group-hover:bg-accent-terracotta transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SquadPulseComponent {
  private analytics = inject(AnalyticsService);
  
  readiness = computed(() => this.analytics.readinessScore());
  matrix = computed(() => this.analytics.availabilityMatrix());

  protected readonly ShieldCheck = ShieldCheck;
  protected readonly Activity = Activity;
  protected readonly Zap = Zap;
}
