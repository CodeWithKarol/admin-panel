import { Injectable, signal } from '@angular/core';

export type InspectorType = 'user' | 'milestone' | 'dispatch' | 'metric' | 'sector';

@Injectable({ providedIn: 'root' })
export class InspectorService {
  isOpen = signal(false);
  activeData = signal<unknown>(null);
  activeType = signal<InspectorType | null>(null);
  isCreating = signal(false);

  open(data: unknown, type: InspectorType) {
    this.isCreating.set(false);
    this.activeData.set(data);
    this.activeType.set(type);
    this.isOpen.set(true);
  }

  initializeNew(type: InspectorType) {
    this.isCreating.set(true);
    this.activeType.set(type);
    this.activeData.set(null);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.isCreating.set(false);
  }
}
