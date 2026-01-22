import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import {
  LucideAngularModule,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-angular';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      @for (toast of toasts(); track toast.id) {
        <div
          class="pointer-events-auto min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border animate-slide-in flex items-start gap-3 bg-white dark:bg-slate-800 dark:border-slate-700"
          [class]="getToastClasses(toast.type)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('success') {
                <lucide-angular [img]="CheckCircle" class="w-5 h-5 text-green-500" />
              }
              @case ('error') {
                <lucide-angular [img]="AlertCircle" class="w-5 h-5 text-red-500" />
              }
              @case ('warning') {
                <lucide-angular [img]="AlertTriangle" class="w-5 h-5 text-yellow-500" />
              }
              @default {
                <lucide-angular [img]="Info" class="w-5 h-5 text-blue-500" />
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-900 dark:text-gray-100">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            (click)="toastService.remove(toast.id)"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <lucide-angular [img]="X" class="w-4 h-4" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out forwards;
      }
    `,
  ],
})
export class Toast {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected readonly X = X;
  protected readonly CheckCircle = CheckCircle;
  protected readonly AlertCircle = AlertCircle;
  protected readonly Info = Info;
  protected readonly AlertTriangle = AlertTriangle;

  protected getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'border-b-[3px] border-b-green-500';
      case 'error':
        return 'border-b-[3px] border-b-red-500';
      case 'warning':
        return 'border-b-[3px] border-b-yellow-500';
      default:
        return 'border-b-[3px] border-b-blue-500';
    }
  }
}
