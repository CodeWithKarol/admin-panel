# Design Document: Gantt Ledger Project Milestones

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Horizontal Project Timeline for Editorial Dashboard

## 1. Overview
The "Gantt Ledger" is a highly stylized, horizontal project timeline designed to fit the "Organic / Editorial" aesthetic. It visualizes project phases and deadlines using an elegant, paper-ledger style with serif typography and soft organic colors.

## 2. Architecture & Tech Stack
- **State Management:** `MilestoneService` using Angular Signals.
- **Component:** `MilestoneTimelineComponent` (standalone).
- **Styling:** Tailwind CSS with Serif (Playfair Display) and Sans (Lato) fonts.
- **Layout:** Horizontal scrollable area with fixed header dates.

## 3. Data Model
```typescript
export interface ProjectMilestone {
  id: string;
  projectName: string;
  phase: 'Discovery' | 'Development' | 'QA' | 'Deployment';
  startDate: Date;
  endDate: Date;
  status: 'complete' | 'active' | 'upcoming';
}
```

## 4. UI/UX Features
- **Ledger Aesthetic:** Thin borders (`border-brand-200`), paper-like background, and italicized serif month headers.
- **Phase Capsules:** Soft-colored bars (Sage/Terracotta) representing duration.
- **Interactive Tooltips:** Detailed phase info on hover.
- **Auto-Positioning:** Logic to calculate horizontal offsets based on `startDate`.

## 5. Implementation Strategy
1. Create `MilestoneService` with mock data and date-offset helper functions.
2. Build `MilestoneTimelineComponent` with a scrollable container.
3. Implement the "Header Row" with days/weeks of the current month.
4. Render "Phase Bars" positioned according to their dates.
5. Integrate into the bottom of the `DashboardComponent`.
6. Add "Editorial" polish (thin lines, generous spacing).
