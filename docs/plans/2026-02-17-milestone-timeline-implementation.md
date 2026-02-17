# Gantt Ledger Milestone Timeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement an elegant, horizontal project milestone timeline (Gantt Ledger) that fits the "Organic / Editorial" aesthetic.

**Architecture:** A signal-driven `MilestoneService` provides the data and date-offset calculations. The `MilestoneTimelineComponent` renders a scrollable ledger with precisely positioned phase bars using CSS variables for offsets.

**Tech Stack:** Angular 21, Signals, Tailwind CSS, Lucide Icons.

---

### Task 1: Create Milestone Data Model and Service

**Files:**
- Create: `src/app/core/models/milestone.models.ts`
- Create: `src/app/core/services/milestone.service.ts`

**Step 1: Implement Model and Service**

```typescript
export interface ProjectMilestone {
  id: string;
  projectName: string;
  phase: 'Discovery' | 'Development' | 'QA' | 'Deployment';
  startDate: Date;
  endDate: Date;
  status: 'complete' | 'active' | 'upcoming';
}

@Injectable({ providedIn: 'root' })
export class MilestoneService {
  milestones = signal<ProjectMilestone[]>([
    { id: '1', projectName: 'AXON_CORE', phase: 'Development', startDate: new Date('2026-02-01'), endDate: new Date('2026-02-15'), status: 'complete' },
    { id: '2', projectName: 'EDITORIAL_UI', phase: 'Development', startDate: new Date('2026-02-16'), endDate: new Date('2026-02-28'), status: 'active' },
    { id: '3', projectName: 'API_GATEWAY', phase: 'QA', startDate: new Date('2026-02-20'), endDate: new Date('2026-03-05'), status: 'upcoming' }
  ]);
}
```

**Step 2: Commit**

```bash
git add src/app/core/models/milestone.models.ts src/app/core/services/milestone.service.ts
git commit -m "feat: add MilestoneService with mock project data"
```

---

### Task 2: Create MilestoneTimeline Component Shell

**Files:**
- Create: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.ts`
- Create: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.html`

**Step 1: Implement Component Logic**

Inject `MilestoneService` and calculate day-based offsets for the current month.

**Step 2: Commit**

```bash
git add src/app/features/dashboard/components/milestone-timeline/
git commit -m "feat: scaffold milestone timeline component"
```

---

### Task 3: Implement Ledger UI and Positioning

**Files:**
- Modify: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.html`
- Modify: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.ts`

**Step 1: Build the Horizontal Ledger**

Render a row of dates (1-28/31) and use `[style.left.%]` and `[style.width.%]` to position the project bars.

**Step 2: Apply Editorial Styling**

Use `font-serif` for dates and soft Sage/Terracotta colors for project bars.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/milestone-timeline/
git commit -m "feat: implement horizontal ledger UI with precise positioning"
```

---

### Task 4: Integrate into Dashboard

**Files:**
- Modify: `src/app/features/dashboard/dashboard.ts`
- Modify: `src/app/features/dashboard/dashboard.html`

**Step 1: Place Timeline at Bottom**

Add `app-milestone-timeline` as a full-width section at the bottom of the dashboard.

**Step 2: Commit**

```bash
git add src/app/features/dashboard/dashboard.*
git commit -m "feat: integrate milestone timeline into editorial dashboard"
```

---

### Task 5: Final Polish and Transitions

**Files:**
- Modify: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.html`

**Step 1: Add Hover Effects and Tooltips**

Show detailed dates and phase descriptions on bar hover.

**Step 2: Commit**

```bash
git commit -am "feat: finalize milestone timeline with hover details and polish"
```
