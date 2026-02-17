# Draggable Bento Grid Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable users to rearrange dashboard widgets using a drag-and-drop system that snaps to the strict bento-grid layout.

**Architecture:** A signal-based `DashboardLayoutService` manages the widget sequence and persistence. The `DashboardComponent` uses `CdkDropListGroup` and `CdkDrag` to handle the interactions.

**Tech Stack:** Angular 21, @angular/cdk/drag-drop, Tailwind CSS.

---

### Task 1: Create Dashboard Layout Service

**Files:**
- Create: `src/app/core/services/dashboard-layout.service.ts`

**Step 1: Implement the service with signals and persistence**

```typescript
import { Injectable, signal, effect } from '@angular/core';

export interface WidgetConfig {
  id: string;
  type: 'KPI_STATS' | 'WORKLOAD_CHART' | 'ACTIVITY_FEED' | 'SQUAD_PULSE';
  colSpan: string; // Tailwind class like 'lg:col-span-3'
}

@Injectable({
  providedIn: 'root'
})
export class DashboardLayoutService {
  private STORAGE_KEY = 'axon_dashboard_layout';

  layout = signal<WidgetConfig[]>(this.loadLayout());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.layout()));
    });
  }

  private loadLayout(): WidgetConfig[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    return [
      { id: 'kpis', type: 'KPI_STATS', colSpan: 'lg:col-span-3' },
      { id: 'workload', type: 'WORKLOAD_CHART', colSpan: 'lg:col-span-3' },
      { id: 'activity', type: 'ACTIVITY_FEED', colSpan: 'lg:col-span-2' },
      { id: 'pulse', type: 'SQUAD_PULSE', colSpan: 'lg:col-span-5' }
    ];
  }

  updateLayout(newLayout: WidgetConfig[]) {
    this.layout.set(newLayout);
  }
}
```

**Step 2: Commit**

```bash
git add src/app/core/services/dashboard-layout.service.ts
git commit -m "feat: add DashboardLayoutService for widget persistence"
```

---

### Task 2: Refactor Dashboard Component for CDK Drag-Drop

**Files:**
- Modify: `src/app/features/dashboard/dashboard.ts`
- Modify: `src/app/features/dashboard/dashboard.html`

**Step 1: Update Dashboard Component logic**

Inject `DashboardLayoutService` and add the `drop()` handler using `moveItemInArray`.

**Step 2: Refactor Template to use cdkDropListGroup**

Iterate over the `layout()` signal and wrap each widget type in a `cdkDropList`.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/dashboard.*
git commit -m "feat: refactor dashboard to use draggable bento grid"
```

---

### Task 3: Add Drag Handles and Styling

**Files:**
- Modify: `src/app/features/dashboard/dashboard.html`
- Modify: `src/styles.css`

**Step 1: Add grab icons and hover states**

Add a `GripVertical` icon to each widget header that acts as the `cdkDragHandle`.

**Step 2: Add CDK transition styles to styles.css**

```css
.cdk-drag-preview {
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
              0 8px 10px 1px rgba(0, 0, 0, 0.14),
              0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.widget-list.cdk-drop-list-dragging .widget-box:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
```

**Step 3: Commit**

```bash
git add src/app/features/dashboard/dashboard.html src/styles.css
git commit -m "feat: add drag handles and smooth transitions to dashboard"
```

---

### Task 4: Final Polish and Interaction Reset

**Files:**
- Modify: `src/app/features/dashboard/dashboard.html`
- Modify: `src/app/core/services/dashboard-layout.service.ts`

**Step 1: Add "Reset Layout" button**

Add a button to the dashboard header that clears the LocalStorage and resets the `layout` signal.

**Step 2: Commit**

```bash
git commit -am "feat: finalize draggable grid with reset functionality"
```
