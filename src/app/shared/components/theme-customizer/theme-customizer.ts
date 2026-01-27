import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Palette, Check } from 'lucide-angular';
import { ThemeService, BrandColor } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-customizer',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <button
        (click)="toggle()"
        class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title="Customize Theme"
      >
        <lucide-angular [img]="Palette" class="w-5 h-5"></lucide-angular>
      </button>

      @if (isOpen()) {
        <!-- Backdrop -->
        <button
          type="button"
          class="fixed inset-0 z-40 w-full h-full bg-transparent border-0"
          (click)="isOpen.set(false)"
          (keyup.escape)="isOpen.set(false)"
          tabindex="-1"
          aria-label="Close theme customizer"
        ></button>

        <!-- Dropdown -->
        <div
          class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div class="px-4 pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Theme Color</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Choose your brand color</p>
          </div>

          <div class="px-2 grid grid-cols-5 gap-1">
            @for (color of colors; track color.value) {
              <button
                (click)="selectColor(color.value)"
                class="group relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                [style.backgroundColor]="color.color"
                [class.ring-slate-400]="themeService.brandColor() === color.value"
                [class.dark:ring-slate-500]="themeService.brandColor() === color.value"
                [class.ring-transparent]="themeService.brandColor() !== color.value"
                [title]="color.name"
              >
                @if (themeService.brandColor() === color.value) {
                  <lucide-angular [img]="Check" class="w-4 h-4 text-white"></lucide-angular>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ThemeCustomizer {
  themeService = inject(ThemeService);

  readonly isOpen = signal(false);
  readonly Palette = Palette;
  readonly Check = Check;

  readonly colors: { name: string; value: BrandColor; color: string }[] = [
    { name: 'Indigo', value: 'indigo', color: '#4f46e5' },
    { name: 'Purple', value: 'purple', color: '#9333ea' },
    { name: 'Orange', value: 'orange', color: '#ea580c' },
    { name: 'Blue', value: 'blue', color: '#2563eb' },
    { name: 'Emerald', value: 'emerald', color: '#059669' },
  ];

  toggle() {
    this.isOpen.update((v) => !v);
  }

  selectColor(color: BrandColor) {
    this.themeService.setBrandColor(color);
    this.isOpen.set(false);
  }
}
