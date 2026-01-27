import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastService = inject(ToastService);

  private _notifications = signal<AppNotification[]>([]);
  notifications = this._notifications.asReadonly();

  unreadCount = computed(() => this._notifications().filter((n) => !n.read).length);

  private counter = 0;

  constructor() {
    // Add some dummy initial notifications for demonstration
    this.add(
      {
        title: 'Welcome!',
        message: 'Welcome to the new admin panel.',
        type: 'info',
      },
      false,
    );
  }

  add(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>, showToast = true) {
    const id = this.counter++;
    const newNotification: AppNotification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    this._notifications.update((prev) => [newNotification, ...prev]);

    if (showToast) {
      this.toastService.show(notification.message, notification.type);
    }
  }

  markAsRead(id: number) {
    this._notifications.update((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllAsRead() {
    this._notifications.update((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  clearAll() {
    this._notifications.set([]);
  }

  remove(id: number) {
    this._notifications.update((prev) => prev.filter((n) => n.id !== id));
  }
}
