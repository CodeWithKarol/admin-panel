# Executive Project Briefs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement interactive project briefings that open an "Executive Memo" dossier when a milestone is clicked on the timeline.

**Architecture:** Extend `MilestoneService` with narrative content logic. Update the `InspectorComponent` to handle 'milestone' data and render a narrative-focused template using premium editorial typography.

**Tech Stack:** Angular 21, Signals, Tailwind CSS, Lucide Icons.

---

### Task 1: Update Milestone Models and Service

**Files:**
- Modify: `src/app/core/models/milestone.models.ts`
- Modify: `src/app/core/services/milestone.service.ts`

**Step 1: Add Narrative fields to Milestone Model**

```typescript
export interface ProjectMilestone {
  // ... existing
  missionStatement?: string;
  statusReport?: string;
  internalNotes?: string;
}
```

**Step 2: Add mock narrative data to MilestoneService**

Fill in some high-quality mock text for each project.

**Step 3: Commit**

```bash
git add src/app/core/models/milestone.models.ts src/app/core/services/milestone.service.ts
git commit -m "feat: add narrative metadata to milestones and service"
```

---

### Task 2: Enable Milestone Click Triggers

**Files:**
- Modify: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.ts`
- Modify: `src/app/features/dashboard/components/milestone-timeline/milestone-timeline.html`

**Step 1: Inject InspectorService and call open()**

Add click handler to the project bars in the HTML template.

**Step 2: Commit**

```bash
git add src/app/features/dashboard/components/milestone-timeline/
git commit -m "feat: enable milestone click interactions"
```

---

### Task 3: Implement Project Memo in Inspector

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.html`

**Step 1: Add Project Dossier Template**

Implement the "Executive Memo" view with massive serif titles, bold mission statements, and the "Adhesive Note" styled internal notes.

**Step 2: Commit**

```bash
git add src/app/shared/components/inspector/inspector.html
git commit -m "feat: implement Project Brief dossier in Inspector"
```

---

### Task 4: Add Adhesive Note Utility Styles

**Files:**
- Modify: `src/styles.css`

**Step 1: Add "Adhesive Note" CSS utility**

Create a class for the yellowed, tilted note look at the bottom of the dossier.

**Step 2: Commit**

```bash
git commit -am "feat: add editorial adhesive note styling and finalize briefs"
```
