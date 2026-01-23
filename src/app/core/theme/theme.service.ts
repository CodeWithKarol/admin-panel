import { Injectable, signal, effect } from '@angular/core';

export type BrandColor = 'indigo' | 'purple' | 'orange' | 'blue' | 'emerald';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly brandColor = signal<BrandColor>('indigo');
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    // Load from local storage
    const storedColor = localStorage.getItem('brand-color') as BrandColor;
    if (storedColor) {
      this.brandColor.set(storedColor);
    }

    // Load Dark Mode
    const storedDark = localStorage.getItem('dark-mode');
    if (
      storedDark === 'true' ||
      (!storedDark && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDarkMode.set(true);
    }

    // Apply brand color
    effect(() => {
      const color = this.brandColor();
      localStorage.setItem('brand-color', color);
      this.applyTheme(color);
    });

    // Apply dark mode
    effect(() => {
      const isDark = this.isDarkMode();
      localStorage.setItem('dark-mode', String(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  setBrandColor(color: BrandColor) {
    this.brandColor.set(color);
  }

  toggleDarkMode() {
    this.isDarkMode.update((v) => !v);
  }

  private applyTheme(color: BrandColor) {
    const root = document.documentElement;

    // We will set CSS variables that override the 'indigo' palette
    // This allows us to keep using 'bg-indigo-600' etc in the code, but visualy it changes.
    const palette = this.getColorPalette(color);

    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--color-brand-${key}`, value);
    });
  }

  private getColorPalette(color: BrandColor): Record<string, string> {
    // Tailwind colors (approximate mappings for v4 dynamic usage)
    const palettes: Record<BrandColor, Record<string, string>> = {
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        950: '#1e1b4b',
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764',
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
        950: '#431407',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
      },
    };

    return palettes[color];
  }
}
