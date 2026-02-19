# Sector Audit Deep-Dives Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement interactive sector reports that open a multi-dimensional radar chart audit in the side-panel Inspector when a bar in the workload chart is clicked.

**Architecture:** Extend `AnalyticsService` with sector audit data. Update `WorkloadChartComponent` to handle chart clicks and emit events. Build a `SectorDossier` template in `InspectorComponent` using a custom Radar Chart configuration.

**Tech Stack:** Angular 21, Signals, Chart.js, ng2-charts, Tailwind CSS.

---

### Task 1: Extend AnalyticsService with Sector Audit Data

**Files:**
- Modify: `src/app/core/services/analytics.service.ts`

**Step 1: Implement getSectorAudit method**

```typescript
getSectorAudit(sector: string) {
  return {
    dimensions: ['Velocity', 'Quality', 'Efficiency', 'Innovation', 'Stability'],
    sectorValues: [85, 72, 90, 65, 88],
    orgAverage: [70, 75, 75, 70, 75]
  };
}
```

**Step 2: Commit**

```bash
git add src/app/core/services/analytics.service.ts
git commit -m "feat: add sector audit data mock to AnalyticsService"
```

---

### Task 2: Enable Workload Chart Interactions

**Files:**
- Modify: `src/app/features/dashboard/components/workload-chart/workload-chart.ts`
- Modify: `src/app/features/dashboard/dashboard.ts`

**Step 1: Add chart click handler to component**

Update `WorkloadChartComponent` to output the clicked sector name.

**Step 2: Connect handler in Dashboard**

Inject `InspectorService` and call `open()` when a sector is emitted.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/workload-chart/ src/app/features/dashboard/dashboard.ts
git commit -m "feat: enable click interactions on workload chart bars"
```

---

### Task 3: Implement Sector Dossier in Inspector

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.ts`
- Modify: `src/app/shared/components/inspector/inspector.html`

**Step 1: Add Radar Chart Configuration**

Define a sharp, monochromatic Radar Chart theme in the component.

**Step 2: Build Sector Dossier Template**

Add an `@else if (type() === 'sector')` block to render the radar chart and a benchmarking ledger table.

**Step 3: Commit**

```bash
git add src/app/shared/components/inspector/
git commit -m "feat: implement Sector Audit dossier with radar chart in Inspector"
```

---

### Task 4: Final Analytical Polish

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.html`

**Step 1: Add "Analyst Notes" and Benchmarking Ledger**

Refine the table with deltas (e.g., "+15% vs org avg") and add a serif typewriter summary block.

**Step 2: Commit**

```bash
git commit -am "feat: finalize sector audits with comparative ledger and polish"
```
