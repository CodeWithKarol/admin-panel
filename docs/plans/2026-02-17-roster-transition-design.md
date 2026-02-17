# Design Document: Team Directory Navigation Transition

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Animated Transition for Full Roster Access

## 1. Overview
The goal is to create a high-impact, premium transition when navigating from the Dashboard to the full Team Roster. Instead of a standard page jump, the system will trigger a "Loading Manifest" overlay that simulates a deep-system directory fetch, reinforcing the "Editorial / Industrial" aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `NavigationService` using Angular Signals.
- **Component:** `SystemManifestOverlayComponent` (Singleton).
- **Styling:** Tailwind CSS with Serif/Monospace pairings.
- **Interactions:** Delayed routing tied to animation duration.

## 3. User Flow
1. **Trigger:** User clicks "View Full Roster" in `ActivePersonnelComponent`.
2. **Action:** Service sets `isTransitioning` to true.
3. **UI:** `SystemManifestOverlay` appears, blocking the UI and playing the "Data Stream" animation.
4. **Transition:** After 800-1000ms, the service calls `router.navigate(['/team'])` and hides the overlay.

## 4. UI/UX Features
- **Cinematic Overlay:** Solid black background with elegant centered italics.
- **Telemetry Stream:** Scrolling monospace code fragments in the background.
- **Razor-Thin Progress:** A horizontal line that cuts across the screen to signal completion.
- **Esc Cap:** Logic to ensure the transition doesn't hang (fail-safe timer).

## 5. Implementation Strategy
1. Create `NavigationService` with state and transition delay logic.
2. Build `SystemManifestOverlayComponent` with high-contrast editorial styling.
3. Add the overlay to the `App` component shell.
4. Update `ActivePersonnelComponent` to trigger the navigation sequence.
5. Polish with smooth fade-out transitions once the new page is ready.
