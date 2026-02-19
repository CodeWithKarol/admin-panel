# Design Document: Comparative Audit Sector Deep-Dives

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Analytical Sector Reports for Workload Chart

## 1. Overview
The "Comparative Audit" adds analytical depth to the Workload Distribution chart. Clicking any sector bar opens a side-panel "Audit Dossier" featuring a multi-dimensional radar chart and a benchmarking ledger, allowing administrators to compare sector performance against organizational averages within the "Organic / Editorial" aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `InspectorService` (Signals).
- **Data Source:** `AnalyticsService` expanded with sector-specific audit data.
- **Visualization:** `Chart.js` (Radar Chart configuration).
- **Styling:** Tailwind CSS with Serif/Sans font pairing.

## 3. Data Flow
1. **Trigger:** User clicks a bar in `WorkloadChartComponent`.
2. **Action:** Component calls `inspector.open(sector, 'sector')`.
3. **Data Fetch:** `InspectorComponent` calls `analyticsService.getSectorAudit(sector.name)` via a computed signal.
4. **UI Update:** Side-panel slides in, rendering the `SectorDossier` with the radar chart.

## 4. UI/UX Features
- **Monochromatic Radar Chart:** Sharp, high-contrast visual comparing five key performance dimensions.
- **Benchmarking Ledger:** A high-density table showing raw values and percentage deltas from the organization average.
- **Analytical Context:** Small "Analyst Notes" scattered throughout the dossier to ground the data in a professional narrative.

## 5. Implementation Strategy
1. Extend `AnalyticsService` with `getSectorAudit()` mock data logic.
2. Update `WorkloadChartComponent` to handle chart clicks and emit events.
3. Integrate the click handler into the Dashboard to trigger the inspector.
4. Build the `SectorDossier` template within `InspectorComponent`.
5. Configure the Radar Chart with a minimal, editorial-inspired theme.
6. Add final layout polish (dividers, typography, animations).
