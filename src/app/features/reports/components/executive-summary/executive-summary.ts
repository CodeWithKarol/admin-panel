import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-executive-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-brand-100/50 border-l-4 border-accent-terracotta p-8">
      <h3 class="font-serif italic text-2xl text-brand-800 mb-4">Executive Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
            Total_Protocols
          </p>
          <p class="text-4xl font-black text-accent-charcoal">
            {{ totalCount() }}
          </p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
            Active_Rate
          </p>
          <p class="text-4xl font-black text-accent-charcoal">{{ activeRate() }}%</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">
            Completion_Forecast
          </p>
          <p class="text-4xl font-black text-accent-charcoal">{{ forecast() }}</p>
        </div>
      </div>
    </div>
  `,
})
export class ExecutiveSummaryComponent {
  totalCount = input<number>(0);
  activeRate = input<number>(0);
  forecast = input<string>('Q3');
}
