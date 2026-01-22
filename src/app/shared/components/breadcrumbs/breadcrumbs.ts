import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, ChevronRight, Home } from 'lucide-angular';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li class="inline-flex items-center">
          <a
            routerLink="/"
            class="inline-flex items-center text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <lucide-angular [img]="Home" class="w-4 h-4 me-2.5"></lucide-angular>
            Home
          </a>
        </li>

        @for (breadcrumb of breadcrumbs(); track breadcrumb.url; let isLast = $last) {
          <li>
            <div class="flex items-center">
              <lucide-angular
                [img]="ChevronRight"
                class="w-4 h-4 text-slate-400 mx-1"
              ></lucide-angular>
              @if (isLast) {
                <span class="ms-1 text-sm font-medium text-slate-500 md:ms-2 dark:text-slate-400">{{
                  breadcrumb.label
                }}</span>
              } @else {
                <a
                  [routerLink]="breadcrumb.url"
                  class="ms-1 text-sm font-medium text-slate-700 hover:text-indigo-600 md:ms-2 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  {{ breadcrumb.label }}
                </a>
              }
            </div>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly breadcrumbs = signal<Breadcrumb[]>([]);
  protected readonly Home = Home;
  protected readonly ChevronRight = ChevronRight;

  constructor() {
    this.createBreadcrumbs(); // Initialize on load
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.createBreadcrumbs();
      });
  }

  private createBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [];
    let currentRoute = this.activatedRoute.root;
    let url = '';

    while (currentRoute.children.length > 0) {
      const children = currentRoute.children;
      let child = children.find((c) => c.outlet === 'primary');
      if (!child && children.length > 0) child = children[0];

      if (!child) break;

      currentRoute = child;

      const routeConfig = currentRoute.routeConfig;
      if (!routeConfig) continue;

      const snapshot = currentRoute.snapshot;
      if (!snapshot || !snapshot.url) continue;

      if (!snapshot.url.length) {
        if (routeConfig.path === '' && routeConfig.data && routeConfig.data['breadcrumb']) {
          // valid
        } else {
          // skip
        }
      }

      const routeUrl = snapshot.url.map((segment) => segment.path).join('/');
      if (routeUrl !== '') {
        url += `/${routeUrl}`;
      }

      if (routeConfig.data && routeConfig.data['breadcrumb']) {
        let label = routeConfig.data['breadcrumb'];
        if (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1].label !== label) {
          breadcrumbs.push({ label, url });
        }
      }
    }
    this.breadcrumbs.set(breadcrumbs);
  }
}
