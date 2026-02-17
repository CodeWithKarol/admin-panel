# Design Document: Draggable Bento Grid

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Customizable Layout for Admin Dashboard

## 1. Overview
The goal is to allow users to personalize their dashboard by rearranging the bento-grid widgets. This uses a strict snap-to-grid system to maintain the "Glassmorphic Industrial" aesthetic while providing flexibility.

## 2. Architecture & Tech Stack
- **Library:** `@angular/cdk/drag-drop` for interaction logic.
- **State Management:** `DashboardLayoutService` using Signals to store widget order and configuration.
- **Persistence:** LocalStorage integration to save user-defined layouts.
- **Styling:** Dynamic Tailwind class binding based on widget `colSpan` and `rowSpan` properties.

## 3. Data Model
```typescript
interface WidgetConfig {
  id: string;
  type: 'KPI_STATS' | 'WORKLOAD_CHART' | 'ACTIVITY_FEED' | 'SQUAD_PULSE';
  colSpan: number; // e.g., 3 for charts, 2 for log
  rowSpan: number;
}
```

## 4. Interaction & UX
- **Swap Pattern:** Dropping a widget into a occupied slot swaps their positions.
- **Drag Handles:** Subtle hover-activated "grab" indicators in widget headers.
- **Animations:** CDK-powered smooth transitions and spring-back motions.
- **Ghost Preview:** A translucent "ghost" version of the widget shows where it will land.

## 5. Implementation Strategy
1. Install/Verify `@angular/cdk`.
2. Create `DashboardLayoutService` with default layout signal.
3. Refactor `DashboardComponent` template to use `cdkDropListGroup`.
4. Wrap each widget in a `cdkDropList` and `cdkDrag`.
5. Implement `moveItemInArray` logic on drop events.
6. Add persistence to LocalStorage.
