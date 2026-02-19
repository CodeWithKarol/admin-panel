# Design Document: Trend Ledger Metric Interactions

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Interactive Metric Deep-Dives for Editorial Dashboard

## 1. Overview
The "Trend Ledger" adds interactivity to the high-level dashboard metrics. Clicking any metric (e.g., Velocity, Task Count) opens a side-panel "Memo" containing a historical trend line and a list of notable data deviations, providing deep analytical context within the premium "Organic / Editorial" aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `InspectorService` (Signals).
- **Data Source:** `AnalyticsService` expanded with historical generators.
- **Visualization:** `Chart.js` (monochromatic configuration).
- **Styling:** Tailwind CSS with Serif/Sans font pairing.

## 3. Data Flow
1. **Trigger:** User clicks a metric card in `EditorialMetricsComponent`.
2. **Action:** Component calls `inspector.open(metric, 'metric')`.
3. **Data Fetch:** `InspectorComponent` calls `analyticsService.getHistory(metric.label)` via a computed signal or effect.
4. **UI Update:** Side-panel slides in, rendering the `MetricDossier` with the historical chart.

## 4. UI/UX Features
- **Monochromatic Charts:** Sharp, white or dark-charcoal trend lines with zero grid noise.
- **Narrative Analysis:** A "Notable Deviations" section using serif typewriter typography to explain spikes or dips.
- **Precise Tooltips:** Editorial-style tooltips showing raw values and dates on hover.

## 5. Implementation Strategy
1. Extend `AnalyticsService` with `getMetricHistory()` logic.
2. Update `EditorialMetricsComponent` to handle clicks and trigger the inspector.
3. Build the `MetricDossier` template within `InspectorComponent`.
4. Configure a specialized, minimal Chart.js theme for trend lines.
5. Add subtle entry animations for the chart to "draw" itself when the panel opens.
