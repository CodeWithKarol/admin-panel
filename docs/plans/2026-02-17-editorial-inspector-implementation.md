# Editorial Memo Inspector Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a premium side-panel "Inspector" that provides detailed views and CRUD actions for dashboard items, styled like an official editorial dossier.

**Architecture:** A centralized `InspectorService` manages the state using Signals. A singleton `InspectorComponent` in the `MainLayout` reacts to state changes, providing smooth slide-in animations and contextual dossiers for different item types.

**Tech Stack:** Angular 21, Signals, Tailwind CSS, Lucide Icons.

---

### Task 1: Create Inspector Service

**Files:**
- Create: `src/app/core/services/inspector.service.ts`

**Step 1: Implement Service with Signals**

```typescript
import { Injectable, signal } from '@angular/core';

export type InspectorType = 'user' | 'milestone' | 'dispatch';

@Injectable({ providedIn: 'root' })
export class InspectorService {
  isOpen = signal(false);
  activeData = signal<any>(null);
  activeType = signal<InspectorType | null>(null);

  open(data: any, type: InspectorType) {
    this.activeData.set(data);
    this.activeType.set(type);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
```

**Step 2: Commit**

```bash
git add src/app/core/services/inspector.service.ts
git commit -m "feat: add InspectorService for side-panel state management"
```

---

### Task 2: Create Inspector Component Shell

**Files:**
- Create: `src/app/shared/components/inspector/inspector.ts`
- Create: `src/app/shared/components/inspector/inspector.html`

**Step 1: Build the Animated Container**

Implement a full-height `aside` that slides from the right using Tailwind `transition` and `translate-x`.

**Step 2: Commit**

```bash
git add src/app/shared/components/inspector/
git commit -m "feat: scaffold animated Inspector side-panel"
```

---

### Task 3: Implement User Dossier Template

**Files:**
- Modify: `src/app/shared/components/inspector/inspector.html`
- Modify: `src/app/shared/components/inspector/inspector.ts`

**Step 1: Add User View/Edit Logic**

Create the "Personnel Dossier" view with avatar, status, and role fields.

**Step 2: Commit**

```bash
git add src/app/shared/components/inspector/
git commit -m "feat: implement User Dossier in Inspector"
```

---

### Task 4: Integrate Inspector into Main Layout

**Files:**
- Modify: `src/app/shared/components/layout/main-layout.ts`
- Modify: `src/app/shared/components/layout/main-layout.html`

**Step 1: Place Inspector at the end of the template**

Ensure it overlays the content but respects the header if needed (or full-screen height).

**Step 2: Commit**

```bash
git add src/app/shared/components/layout/main-layout.*
git commit -m "feat: integrate Inspector into MainLayout"
```

---

### Task 5: Link Dashboard Items to Inspector

**Files:**
- Modify: `src/app/features/dashboard/components/active-personnel/active-personnel.ts`
- Modify: `src/app/features/dashboard/components/active-personnel/active-personnel.html`

**Step 1: Add (click) handlers to personnel list**

Inject `InspectorService` and call `open()` when a member is clicked.

**Step 2: Commit**

```bash
git add src/app/features/dashboard/components/active-personnel/
git commit -m "feat: connect personnel list to Inspector"
```

---

### Task 6: Add "Ghost" Input Styles and Polish

**Files:**
- Modify: `src/styles.css`

**Step 1: Implement minimalistic input styles**

```css
.ghost-input {
  @apply bg-transparent border-b border-brand-200 focus:border-accent-terracotta focus:ring-0 px-0 py-1 transition-all;
}
```

**Step 2: Commit**

```bash
git commit -am "feat: add ghost input styling and final editorial polish to Inspector"
```
