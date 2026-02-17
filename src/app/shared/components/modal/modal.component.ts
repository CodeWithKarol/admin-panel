import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../core/services/modal/modal.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (modal.isOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
          (click)="modal.close()"
          (keydown.escape)="modal.close()"
          tabindex="0"
          role="button"
          aria-label="Close modal"
        ></div>

        <!-- content -->
        <div
          class="relative bg-white w-full max-w-lg shadow-2xl border border-brand-200 animate-in zoom-in-95 duration-200"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-brand-100 bg-brand-50/50"
          >
            <h3 class="font-serif italic text-xl text-accent-charcoal">
              {{ modal.config()?.title }}
            </h3>
            <button
              (click)="modal.close()"
              class="text-brand-400 hover:text-accent-terracotta transition-colors"
            >
              <lucide-icon [name]="X" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <ng-container *ngComponentOutlet="modal.config()?.component ?? null"></ng-container>

            @if (modal.config()?.template) {
              <ng-container *ngTemplateOutlet="modal.config()!.template!"></ng-container>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  modal = inject(ModalService);
  protected readonly X = X;
}
