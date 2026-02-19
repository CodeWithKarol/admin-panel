import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);
  isTransitioning = signal(false);

  async navigateWithManifest(route: string) {
    this.isTransitioning.set(true);
    // Wait for cinematic effect (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));
    await this.router.navigate([route]);
    
    // Brief delay before hiding to allow page to settle
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 200);
  }
}
