# Trend Ledger Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement interactive metric deep-dives that open a historical trend chart in the side-panel Inspector.

**Architecture:** Extend `AnalyticsService` with a historical data generator. Update the `InspectorComponent` to handle a new 'metric' type, rendering a monochromatic Line Chart using `ng2-charts`.

**Tech Stack:** Angular 21, Signals, Chart.js, ng2-charts, Tailwind CSS.

---

### Task 1: Extend AnalyticsService with Historical Data

**Files:**
- Modify: `src/app/core/services/analytics.service.ts`

**Step 1: Implement getMetricHistory method**

```typescript
getMetricHistory(label: string) {
  // Generate 30 points of random-walk data
  let current = 50;
  return Array.from({ length: 30 }, (_, i) => {
    current += Math.floor(Math.random() * 10) - 5;
    return {
      date: new Date(2026, 1, i + 1),
      value: current
    };
  });
}
```

**Step 2: Commit**

```bash
git add src/app/core/services/analytics.service.ts
git commit -m "feat: add historical data generator to AnalyticsService"
```

---

### Task 2: Update Editorial Metrics to be Interactive

**Files:**
- Modify: `src/app/features/dashboard/components/editorial-metrics/editorial-metrics.ts`

**Step 1: Inject InspectorService and add click handler**

```typescript
@Component({ ... })
export class EditorialMetricsComponent {
  private inspector = inject(InspectorService);
  // ...
  openHistory(metric: ProjectMetric) {
    this.inspector.open(metric, 'metric');
  }
}
```

**Step 2: Update Template with (click)**

(In `editorial-metrics.ts` template) Add `(click)="openHistory(metric)"` to the metric container.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/editorial-metrics/
git commit -m "feat: enable metric deep-dive triggers in dashboard"
```

---

### Task 3: Implement Metric Dossier in Inspector

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.ts`
- Modify: `src/app/shared/components/inspector/inspector.html`

**Step 1: Add Chart Configuration**

Define a minimal, monochromatic Line Chart config in the component.

**Step 2: Update Inspector Template**

Add an `@else if (type() === 'metric')` block to render the chart and a summary of "Notable Deviations."

**Step 3: Commit**

```bash
git add src/app/shared/components/inspector/
git commit -m "feat: implement Metric Dossier with trend chart in Inspector"
```

---

### Task 4: Final Visual Polish

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.html`

**Step 1: Refine "Notable Deviations" list**

Add a list of mock events (e.g., "System Optimized", "Resource Leak Detected") to ground the chart in a narrative.

**Step 2: Commit**

```bash
git commit -am "feat: finalize trend ledger with narrative analysis and polish"
```
