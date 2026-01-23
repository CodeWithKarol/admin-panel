import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isSidebarOpen = signal(false);
  isCommandPaletteOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  openCommandPalette() {
    this.isCommandPaletteOpen.set(true);
  }

  closeCommandPalette() {
    this.isCommandPaletteOpen.set(false);
  }

  toggleCommandPalette() {
    this.isCommandPaletteOpen.update((v) => !v);
  }
}
