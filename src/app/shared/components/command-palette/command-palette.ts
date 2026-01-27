import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  Search,
  Command,
  FileText,
  User,
  Calendar,
  Layout,
  LogOut,
  Moon,
  Sun,
} from 'lucide-angular';
import { ThemeService } from '../../../core/theme/theme.service';
import { AuthService } from '../../../core/auth/auth-service';
import { LayoutService } from '../../../core/layout/layout-service';

interface CommandItem {
  id: string;
  label: string;
  icon: LucideIconData;
  type: 'link' | 'action';
  path?: string;
  action?: () => void;
  shortcut?: string;
}

@Component({
  selector: 'app-command-palette',
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown.control.k)': 'toggle($event)',
    '(window:keydown.meta.k)': 'toggle($event)',
    '(window:keydown.escape)': 'onEscape()',
    '(window:keydown.arrowdown)': 'onArrowDown($event)',
    '(window:keydown.arrowup)': 'onArrowUp($event)',
    '(window:keydown.enter)': 'onEnter($event)',
  },
  template: `
    @if (layoutService.isCommandPaletteOpen()) {
      <div class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 font-sans">
        <!-- Backdrop -->
        <button
          type="button"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity w-full h-full border-0"
          (click)="close()"
          (keyup.escape)="close()"
          tabindex="-1"
          aria-label="Close command palette"
        ></button>

        <!-- Modal -->
        <div
          class="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Search Input -->
          <div
            class="flex items-center border-b border-slate-100 dark:border-slate-700 px-4 shrink-0"
          >
            <lucide-angular [img]="Search" class="w-5 h-5 text-slate-400"></lucide-angular>
            <input
              type="text"
              class="flex-1 h-14 bg-transparent border-none px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none text-lg"
              placeholder="Type a command or search..."
              [value]="query()"
              (input)="updateQuery($event)"
            />
            <kbd
              class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400 rounded"
            >
              <span class="text-xs">ESC</span>
            </kbd>
          </div>

          <!-- Results List -->
          <div class="max-h-[60vh] overflow-y-auto py-2 results-list">
            @if (filteredItems().length === 0) {
              <div class="py-12 text-center">
                <p class="text-sm text-slate-500 dark:text-slate-400">No results found.</p>
              </div>
            } @else {
              <div class="px-2">
                <div
                  class="px-2 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Suggestions
                </div>
                @for (item of filteredItems(); track item.id; let i = $index) {
                  <button
                    (click)="selectItem(item)"
                    class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-colors cursor-pointer outline-none"
                    [class.bg-indigo-50]="i === selectedIndex()"
                    [class.dark:bg-indigo-500/20]="i === selectedIndex()"
                    [class.text-indigo-700]="i === selectedIndex()"
                    [class.dark:text-indigo-300]="i === selectedIndex()"
                    [class.text-slate-700]="i !== selectedIndex()"
                    [class.dark:text-slate-200]="i !== selectedIndex()"
                    (mouseenter)="selectedIndex.set(i)"
                  >
                    <lucide-angular
                      [img]="item.icon"
                      class="w-5 h-5"
                      [class.opacity-50]="i !== selectedIndex()"
                    ></lucide-angular>
                    <span class="flex-1 font-medium">{{ item.label }}</span>
                    @if (item.shortcut) {
                      <span class="text-xs text-slate-400">{{ item.shortcut }}</span>
                    }
                  </button>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          <div
            class="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0"
          >
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              <lucide-angular [img]="Command" class="w-3 h-3"></lucide-angular>
              <span class="font-medium">Command Palette</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-1">
                <span class="opacity-75">Navigate</span>
                <kbd
                  class="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm text-[10px] font-sans"
                  >↑</kbd
                >
                <kbd
                  class="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm text-[10px] font-sans"
                  >↓</kbd
                >
              </div>
              <div class="flex items-center gap-1">
                <span class="opacity-75">Select</span>
                <kbd
                  class="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm text-[10px] font-sans"
                  >↵</kbd
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.5);
      }
    `,
  ],
})
export class CommandPaletteComponent {
  private readonly router = inject(Router);
  protected readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  protected readonly layoutService = inject(LayoutService);

  protected readonly query = signal('');
  protected readonly selectedIndex = signal(0);

  // Icons used in template
  protected readonly Search = Search;
  protected readonly Command = Command;

  protected readonly items = computed<CommandItem[]>(() => [
    { id: 'dashboard', label: 'Dashboard', icon: Layout, type: 'link', path: '/dashboard' },
    { id: 'users', label: 'Users', icon: User, type: 'link', path: '/users' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, type: 'link', path: '/calendar' },
    { id: 'kanban', label: 'Kanban Board', icon: Layout, type: 'link', path: '/kanban' },
    { id: 'projects', label: 'New Project', icon: FileText, type: 'link', path: '/projects/new' },
    {
      id: 'theme',
      label: this.themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: this.themeService.isDarkMode() ? Sun : Moon,
      type: 'action',
      action: () => this.themeService.toggleDarkMode(),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      type: 'action',
      action: () => this.authService.logout(),
    },
  ]);

  protected readonly filteredItems = computed(() => {
    const q = this.query().toLowerCase();
    return this.items().filter((item) => item.label.toLowerCase().includes(q));
  });

  protected toggle(event?: Event) {
    if (event) event.preventDefault();
    this.layoutService.toggleCommandPalette();
    if (this.layoutService.isCommandPaletteOpen()) {
      this.open(); // Reset query/index
    }
  }

  protected onEscape() {
    this.close();
  }

  protected onArrowDown(event: Event) {
    if (!this.layoutService.isCommandPaletteOpen()) return;
    event.preventDefault();
    const max = this.filteredItems().length - 1;
    if (this.selectedIndex() < max) {
      this.selectedIndex.update((i) => i + 1);
    } else {
      this.selectedIndex.set(0);
    }
  }

  protected onArrowUp(event: Event) {
    if (!this.layoutService.isCommandPaletteOpen()) return;
    event.preventDefault();
    const max = this.filteredItems().length - 1;
    if (this.selectedIndex() > 0) {
      this.selectedIndex.update((i) => i - 1);
    } else {
      this.selectedIndex.set(max);
    }
  }

  protected onEnter(event: Event) {
    if (!this.layoutService.isCommandPaletteOpen()) return;
    event.preventDefault();
    const currentItems = this.filteredItems();
    if (currentItems.length > 0) {
      const item = currentItems[this.selectedIndex()];
      if (item) {
        this.selectItem(item);
      }
    }
  }

  protected open() {
    this.layoutService.openCommandPalette();
    this.query.set('');
    this.selectedIndex.set(0);
  }

  protected close() {
    this.layoutService.closeCommandPalette();
  }

  protected updateQuery(e: Event) {
    const input = e.target as HTMLInputElement;
    this.query.set(input.value);
    this.selectedIndex.set(0);
  }

  protected selectItem(item: CommandItem) {
    if (item.type === 'link' && item.path) {
      this.router.navigate([item.path]);
    } else if (item.type === 'action' && item.action) {
      item.action();
    }
    this.close();
  }
}
