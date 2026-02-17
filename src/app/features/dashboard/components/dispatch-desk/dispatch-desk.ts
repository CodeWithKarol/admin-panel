import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LucideAngularModule, Radio } from 'lucide-angular';

@Component({
  selector: 'app-dispatch-desk',
  standalone: true,
  imports: [CommonModule, DatePipe, LucideAngularModule],
  templateUrl: './dispatch-desk.html',
})
export class DispatchDeskComponent {
  private analyticsService = inject(AnalyticsService);
  protected readonly Radio = Radio;

  activities = this.analyticsService.activities;
}
