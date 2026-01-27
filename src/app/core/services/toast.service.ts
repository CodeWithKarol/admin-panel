import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  private counter = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = this.counter++;
    const newToast: Toast = { id, message, type, duration };

    // Add to active toasts
    this._toasts.update((toasts) => [...toasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: number) {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
