import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMetric } from '../../../../core/models/analytics.models';
import { LucideAngularModule, ArrowUpRight, ArrowDownRight } from 'lucide-angular';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';

@Component({
  selector: 'app-editorial-metrics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-12">
      <div>
        <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 border-accent-terracotta pb-2 mb-6">Key Figures</h3>
        <div class="space-y-8">
          @for (metric of metrics(); track metric.label) {
            <div (click)="openHistory(metric)"
                 (keydown.enter)="openHistory(metric)"
                 tabindex="0"
                 role="button"
                 class="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-terracotta/20 rounded-lg transition-all p-2 -m-2">
              <div class="flex items-baseline justify-between mb-2">
                <span class="text-5xl font-serif font-bold text-accent-charcoal group-hover:text-accent-terracotta transition-colors">{{ metric.value }}</span>
                <div class="flex items-center gap-1 text-sm font-bold" [ngClass]="metric.trend === 'up' ? 'text-accent-sage' : 'text-brand-400'">
                  @if (metric.trend === 'up') { <lucide-icon [name]="ArrowUpRight" class="w-4 h-4"></lucide-icon> }
                  @if (metric.trend === 'down') { <lucide-icon [name]="ArrowDownRight" class="w-4 h-4"></lucide-icon> }
                  {{ metric.change }}%
                </div>
              </div>
              <p class="text-sm font-sans text-brand-500 uppercase tracking-wide group-hover:text-brand-800 transition-colors">// {{ metric.label }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class EditorialMetricsComponent {
  metrics = input.required<ProjectMetric[]>();
  private inspector = inject(InspectorService);

  protected readonly ArrowUpRight = ArrowUpRight;
  protected readonly ArrowDownRight = ArrowDownRight;

  openHistory(metric: ProjectMetric) {
    this.inspector.open(metric, 'metric');
  }
}
