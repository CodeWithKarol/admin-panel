import { Injectable, inject } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';
import { ModalService } from '../modal/modal.service';

@Injectable({
  providedIn: 'root',
})
export class BroadcastService {
  private analyticsService = inject(AnalyticsService);
  private modalService = inject(ModalService);

  broadcastAlert() {
    this.analyticsService.activities.update((current) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        sender: 'COMMAND_OVERRIDE',
        message: 'GLOBAL_PRIORITY_BROADCAST_INITIATED',
        type: 'URGENT',
      },
      ...current,
    ]);
    this.modalService.close();
  }
}
