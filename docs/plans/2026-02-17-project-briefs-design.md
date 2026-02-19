# Design Document: Executive Memo Project Briefs

**Date:** 2026-02-17
**Status:** Approved
**Topic:** Narrative Project Details for Milestone Ledger

## 1. Overview
The "Executive Memo" adds narrative depth to the Milestone Ledger. Clicking any project bar on the timeline opens a side-panel "Memo" styled as an official project briefing. It includes mission statements, detailed status reports, and internal notes within the "Organic / Editorial" dashboard aesthetic.

## 2. Architecture & Tech Stack
- **State Management:** `InspectorService` (Signals).
- **Data Source:** `MilestoneService` expanded with narrative metadata.
- **Styling:** Tailwind CSS with Serif (Playfair) and Sans font pairing.
- **Interactions:** Slide-in panel with staggered content reveals.

## 3. Data Model
```typescript
interface ProjectNarrative {
  missionStatement: string;
  statusReport: string;
  internalNotes: string;
  leadOperator: string;
}
```

## 4. UI/UX Features
- **Editorial Masthead:** Massive project titles with serif italic sub-headers.
- **Mission Statement Block:** Bold, oversized typography for high-impact goals.
- **Adhesive Note Effect:** A specialized visual block for "Confidential" or "System" notes at the bottom of the dossier.
- **Clean Chronology:** A list of key project developments with minimal visual noise.

## 5. Implementation Strategy
1. Extend `MilestoneService` with `getProjectNarrative()` logic and mock content.
2. Update `MilestoneTimelineComponent` to handle clicks and trigger the inspector.
3. Build the `ProjectDossier` template within `InspectorComponent`.
4. Add the "Adhesive Note" styling to the global CSS utilities.
5. Polish with smooth transitions and editorial typography adjustments.
