# Dispatch Desk Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a real-time "Dispatch Desk" activity feed that visualizes operational updates as elegant, printed telegrams.

**Architecture:** Extend `AnalyticsService` with a dispatch simulation engine. Create a standalone `DispatchDeskComponent` that consumes the dispatch signal and renders entries with a monospace/serif editorial style.

**Tech Stack:** Angular 21, Signals, Tailwind CSS, Lucide Icons.

---

### Task 1: Update Models and Extend AnalyticsService

**Files:**
- Create: `src/app/core/models/dispatch.models.ts`
- Modify: `src/app/core/services/analytics.service.ts`

**Step 1: Implement Model and Simulation**

Add `DispatchEntry` interface and a `setInterval` in `AnalyticsService` to push new entries.

**Step 2: Commit**

```bash
git add src/app/core/models/dispatch.models.ts src/app/core/services/analytics.service.ts
git commit -m "feat: add dispatch model and live simulation logic"
```

---

### Task 2: Create DispatchDesk Component

**Files:**
- Create: `src/app/features/dashboard/components/dispatch-desk/dispatch-desk.ts`
- Create: `src/app/features/dashboard/components/dispatch-desk/dispatch-desk.html`

**Step 1: Implement Component Shell**

Scaffold the component and inject `AnalyticsService`.

**Step 2: Build the Telegram UI**

Use `font-mono` for messages and `border-brand-200` for the paper-like separators.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/dispatch-desk/
git commit -m "feat: implement DispatchDesk component with telegram styling"
```

---

### Task 3: Integrate into Dashboard Layout

**Files:**
- Modify: `src/app/features/dashboard/dashboard.ts`
- Modify: `src/app/features/dashboard/dashboard.html`

**Step 1: Update Dashboard Grid**

Place the `app-dispatch-desk` component into the editorial grid (likely next to the active personnel or above the timeline).

**Step 2: Commit**

```bash
git add src/app/features/dashboard/dashboard.*
git commit -m "feat: integrate dispatch desk into dashboard layout"
```

---

### Task 4: Add Entry Animations

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/features/dashboard/components/dispatch-desk/dispatch-desk.html`

**Step 1: Implement "Typewriter" or "Slide" Animation**

Add a CSS animation for new entries to make the stream feel dynamic.

**Step 2: Commit**

```bash
git add src/styles.css src/app/features/dashboard/components/dispatch-desk/dispatch-desk.html
git commit -m "feat: add entrance animations for dispatch entries"
```
