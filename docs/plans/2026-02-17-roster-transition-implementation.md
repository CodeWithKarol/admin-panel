# Roster Navigation Transition Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a cinematic "Loading Manifest" transition when navigating to the full Team Roster.

**Architecture:** A singleton `NavigationService` manages the transition state. A `SystemManifestOverlay` component in the root `App` shell provides the visual telemetry stream and editorial titles during the transition.

**Tech Stack:** Angular 21, Signals, Tailwind CSS.

---

### Task 1: Create Navigation Service

**Files:**
- Create: `src/app/core/services/navigation.service.ts`

**Step 1: Implement Service with delay logic**

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);
  isTransitioning = signal(false);

  async navigateWithManifest(route: string) {
    this.isTransitioning.set(true);
    // Wait for cinematic effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.router.navigate([route]);
    this.isTransitioning.set(false);
  }
}
```

**Step 2: Commit**

```bash
git add src/app/core/services/navigation.service.ts
git commit -m "feat: add NavigationService for managed page transitions"
```

---

### Task 2: Create System Manifest Overlay Component

**Files:**
- Create: `src/app/shared/components/navigation/manifest-overlay.ts`
- Create: `src/app/shared/components/navigation/manifest-overlay.html`

**Step 1: Build the UI**

Solid black background, centered Playfair italics, and a thin progress line.

**Step 2: Add to App Shell**

Modify `src/app/app.ts` to include the `app-manifest-overlay`.

**Step 3: Commit**

```bash
git add src/app/shared/components/navigation/ src/app/app.ts
git commit -m "feat: implement cinematic manifest overlay component"
```

---

### Task 3: Trigger Transition from Dashboard

**Files:**
- Modify: `src/app/features/dashboard/components/active-personnel/active-personnel.ts`

**Step 1: Inject NavigationService and update button handler**

```typescript
export class ActivePersonnelComponent {
  // ... existing
  private nav = inject(NavigationService);

  viewFullRoster() {
    this.nav.navigateWithManifest('/team');
  }
}
```

**Step 2: Update HTML template**

Bind `(click)="viewFullRoster()"` to the button.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/active-personnel/
git commit -m "feat: connect View Full Roster button to managed transition"
```

---

### Task 4: Add Telemetry Stream Animation

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/shared/components/navigation/manifest-overlay.html`

**Step 1: Add "Scrawl" CSS animation**

Create a vertical scrolling animation for the monospace background text.

**Step 2: Commit**

```bash
git commit -am "feat: add telemetry stream animations and finalize transition"
```
