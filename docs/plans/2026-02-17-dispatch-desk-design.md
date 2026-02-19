# Design Document: Dispatch Desk Activity Feed

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Real-time Dispatch Stream for Editorial Dashboard

## 1. Overview
The "Dispatch Desk" is a vertically scrollable activity feed designed to resemble a stream of printed telegrams. It provides real-time operational updates (personnel actions, system alerts) in a way that complements the "Organic / Editorial" dashboard aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `AnalyticsService` using Angular Signals.
- **Simulation:** Interval-based mock data generator.
- **Component:** `DispatchDeskComponent` (standalone).
- **Styling:** Tailwind CSS with Serif/Monospace font pairing.

## 3. Data Model
```typescript
export interface DispatchEntry {
  id: string;
  timestamp: Date;
  sender: string;
  message: string;
  type: 'URGENT' | 'ROUTINE' | 'SYSTEM';
}
```

## 4. UI/UX Features
- **Typewriter Aesthetic:** Use of monospace fonts for the dispatch message.
- **Chronological Ledger:** Clear timestamps and "Sender" identification.
- **Priority Indicators:** 
  - `URGENT`: Highlighted with Terracotta accents.
  - `SYSTEM`: Minimal grayscale look.
  - `ROUTINE`: Standard brand colors.
- **Auto-scroll:** Optional "snap-to-top" or "scroll-to-bottom" for new entries.

## 5. Implementation Strategy
1. Extend `AnalyticsService` with `activities` signal and simulation logic.
2. Create `DispatchDeskComponent` with a vertical scroll layout.
3. Build individual "Dispatch Card" styles using the editorial theme.
4. Integrate the component into the Dashboard grid (e.g., bottom-right area).
5. Add entry animations (fade-in or "slide down") for new dispatches.
