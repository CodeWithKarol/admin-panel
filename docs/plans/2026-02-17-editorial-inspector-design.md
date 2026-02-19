# Design Document: Editorial Memo Inspector

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Interactive Side-Panel for Dashboard Actions

## 1. Overview
The "Editorial Memo" is a premium side-panel system that slides in from the right to reveal detailed information and CRUD actions for any dashboard item. It is styled like an official dossier or internal memo, reinforcing the "Organic / Editorial" aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `InspectorService` using Angular Signals.
- **Component:** `InspectorComponent` (Singleton in MainLayout).
- **Styling:** Tailwind CSS with Serif/Sans font pairing.
- **Interactions:** "Ghost" inputs (underlined, minimal chrome) and staggered animations.

## 3. Data Flow
1. **Trigger:** User clicks an item (e.g., `ActivePersonnel` row).
2. **Action:** Dashboard calls `inspector.open(member, 'user')`.
3. **Reactive UI:** `InspectorComponent` signal updates, sliding the panel in and rendering the `UserDossier` template.
4. **Update:** Inline edits call back to relevant services (`TeamService`, `MilestoneService`).

## 4. UI/UX Features
- **Dossier Aesthetic:** Full-height panel, cream background, espresso typography, razor-sharp dividers.
- **Contextual Actions:** Specialized buttons for each type (e.g., "Decommission" for users, "Synchronize" for dispatches).
- **Focus Overlay:** Subtle darkening of the main dashboard to guide focus.
- **Esc to Close:** Standard professional keyboard interaction.

## 5. Implementation Strategy
1. Create `InspectorService` to manage active item and visibility signals.
2. Build `InspectorComponent` with a slide-in transition.
3. Implement `UserDossier`, `MilestoneDossier`, and `DispatchDossier` templates.
4. Add "Ghost" input styles to the global stylesheet.
5. Link dashboard clicks to the inspector trigger.
