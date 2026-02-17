# Design Document: Command Center Activity Feed

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Real-time System Log for Project Management Dashboard

## 1. Overview
The "Command Center" Activity Feed is a monospace, console-style log pane designed to add a sense of "liveness" and professional oversight to the dashboard. It simulates a real-time stream of team and system actions.

## 2. Architecture & Tech Stack
- **State Management:** Angular Signals in `AnalyticsService`.
- **Simulation:** Interval-based generator in the service to push mock events.
- **Styling:** Tailwind CSS with `Geist Mono` typography and glassmorphic container.
- **Components:** `ActivityConsole` widget integrated into the main Dashboard layout.

## 3. Data Model
```typescript
interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  status: 'success' | 'info' | 'warning';
  scope: 'task' | 'project' | 'system';
}
```

## 4. UI/UX Features
- **Monospace Log:** `[HH:mm:ss] [SYSTEM] >> Action message`.
- **Color Coding:** 
  - `success`: Cyber Lime
  - `info`: Electric Indigo
  - `warning`: Amber/Rose
- **Interaction:** Auto-scroll to bottom on new entries; manual scroll override.
- **Integration:** Placed as a prominent widget in the bento grid or a sidebar pane.

## 5. Implementation Strategy
1. Update `AnalyticsService` with `activities` signal and generator logic.
2. Create `ActivityConsole` component with monospace styling.
3. Integrate the console into the `DashboardComponent` layout.
4. Add auto-scroll logic using `viewChild` and `effect`.
5. Polish with "flicker" entry animations or staggered reveals.
