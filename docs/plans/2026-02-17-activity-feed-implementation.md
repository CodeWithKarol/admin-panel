# Command Center Activity Feed Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a real-time, console-style activity feed that simulates system and team actions with a premium monospace aesthetic.

**Architecture:** Extend `AnalyticsService` with an activity generator and signal-based state. Create a dedicated `ActivityConsole` component with auto-scroll logic and "flicker" entrance animations.

**Tech Stack:** Angular 21, Signals, Tailwind CSS, Lucide Icons.

---

### Task 1: Update Analytics Models

**Files:**
- Modify: `src/app/core/models/analytics.models.ts`

**Step 1: Add ActivityLog interface**

```typescript
export interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  status: 'success' | 'info' | 'warning';
  scope: 'task' | 'project' | 'system';
}
```

**Step 2: Commit**

```bash
git add src/app/core/models/analytics.models.ts
git commit -m "feat: add ActivityLog interface"
```

---

### Task 2: Implement Activity Simulation in AnalyticsService

**Files:**
- Modify: `src/app/core/services/analytics.service.ts`

**Step 1: Add activities signal and generator logic**

Include a method `spawnRandomActivity()` that pushes a new log entry, and call it in a `setInterval` within the service constructor or an initialization method.

**Step 2: Commit**

```bash
git add src/app/core/services/analytics.service.ts
git commit -m "feat: add activity simulation to AnalyticsService"
```

---

### Task 3: Create ActivityConsole Component

**Files:**
- Create: `src/app/features/dashboard/components/activity-console.ts`
- Create: `src/app/features/dashboard/components/activity-console.html`

**Step 1: Implement the component with auto-scroll**

Use `effect()` to watch the `activities()` signal and scroll the container to the bottom.

**Step 2: Add Monospace Styling**

Apply `font-mono`, `text-accent-lime`, and glassmorphic styles.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/components/activity-console.*
git commit -m "feat: implement ActivityConsole component"
```

---

### Task 4: Integrate Console into Dashboard

**Files:**
- Modify: `src/app/features/dashboard/dashboard.ts`
- Modify: `src/app/features/dashboard/dashboard.html`

**Step 1: Import and add to template**

Place the `app-activity-console` into the dashboard bento grid (replacing or augmenting the LG layout).

**Step 2: Commit**

```bash
git add src/app/features/dashboard/dashboard.*
git commit -m "feat: integrate activity console into dashboard"
```

---

### Task 5: Add "Flicker" Entry Animation

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/features/dashboard/components/activity-console.html`

**Step 1: Add CSS animation**

```css
@keyframes flicker {
  0% { opacity: 0.1; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
.animate-flicker {
  animation: flicker 0.2s ease-in-out;
}
```

**Step 2: Commit**

```bash
git add src/styles.css src/app/features/dashboard/components/activity-console.html
git commit -m "feat: add flicker animation to activity log entries"
```
