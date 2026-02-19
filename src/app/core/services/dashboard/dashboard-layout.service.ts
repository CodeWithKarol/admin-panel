import { Injectable, signal } from '@angular/core';

export interface WidgetConfig {
  id: string;
  type: 'KPI_STATS' | 'WORKLOAD_CHART' | 'ACTIVITY_FEED' | 'SQUAD_PULSE';
  colSpan: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardLayoutService {
  // Static editorial layout
  layout = signal<WidgetConfig[]>([
    { id: 'kpis', type: 'KPI_STATS', colSpan: 'col-span-full' },
    { id: 'workload', type: 'WORKLOAD_CHART', colSpan: 'col-span-full' },
    { id: 'activity', type: 'ACTIVITY_FEED', colSpan: 'col-span-full' },
    { id: 'pulse', type: 'SQUAD_PULSE', colSpan: 'col-span-full' }
  ]);
}
