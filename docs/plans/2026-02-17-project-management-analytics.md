# Project Management Analytics Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-impact Team Analytics dashboard using Angular 21, Signals, Tailwind CSS, and Chart.js.

**Architecture:** A signal-based architecture where a centralized `AnalyticsService` manages mock data and exposes reactive states to standalone components. The layout uses a responsive bento-grid style within a main sidebar layout.

**Tech Stack:** Angular 21, Tailwind CSS 4, Chart.js, ng2-charts, Lucide Icons.

---

### Task 1: Create Analytics Data Models

**Files:**

- Create: `src/app/core/models/analytics.models.ts`

**Step 1: Define interfaces for mock data**

```typescript
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  activeTasks: number;
  completedTasks: number;
}

export interface ProjectMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
}
```

**Step 2: Commit**

```bash
git add src/app/core/models/analytics.models.ts
git commit -m "feat: add analytics data models"
```

---

### Task 2: Create Analytics Service

**Files:**

- Create: `src/app/core/services/analytics.service.ts`
- Test: `src/app/core/services/analytics.service.spec.ts`

**Step 1: Write initial test for the service**

```typescript
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have mock data initialized', () => {
    expect(service.teamMembers().length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (Service doesn't exist)

**Step 3: Implement the Service using Signals**

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { TeamMember, ProjectMetric } from '../models/analytics.models';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  teamMembers = signal<TeamMember[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      role: 'Lead Developer',
      avatar: 'https://i.pravatar.cc/150?u=1',
      status: 'online',
      activeTasks: 5,
      completedTasks: 120,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'UX Designer',
      avatar: 'https://i.pravatar.cc/150?u=2',
      status: 'online',
      activeTasks: 3,
      completedTasks: 85,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Product Manager',
      avatar: 'https://i.pravatar.cc/150?u=3',
      status: 'busy',
      activeTasks: 8,
      completedTasks: 210,
    },
    {
      id: '4',
      name: 'Emily Davis',
      role: 'QA Engineer',
      avatar: 'https://i.pravatar.cc/150?u=4',
      status: 'offline',
      activeTasks: 0,
      completedTasks: 150,
    },
  ]);

  metrics = signal<ProjectMetric[]>([
    { label: 'Total Tasks', value: 124, change: 12, trend: 'up' },
    { label: 'Team Velocity', value: 42, change: -5, trend: 'down' },
    { label: 'Active Projects', value: 8, change: 0, trend: 'neutral' },
  ]);

  totalCompletedTasks = computed(() =>
    this.teamMembers().reduce((sum, member) => sum + member.completedTasks, 0),
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/core/services/analytics.service.ts src/app/core/services/analytics.service.spec.ts
git commit -m "feat: implement AnalyticsService with signals"
```

---

### Task 3: Scaffold Main Layout

**Files:**

- Create: `src/app/shared/components/layout/main-layout.ts`
- Create: `src/app/shared/components/layout/main-layout.html`
- Create: `src/app/shared/components/layout/main-layout.css`
- Modify: `src/app/app.routes.ts`

**Step 1: Implement Main Layout Component**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Settings,
  Bell,
  Search,
} from 'lucide-angular';
import { LucideIconData } from 'lucide-angular/icons/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LayoutDashboard,
    Users,
    FolderKanban,
    FileText,
    Settings,
    Bell,
    Search,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  protected readonly FolderKanban = FolderKanban;
  navItems = [
    { label: 'Overview', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Team', icon: Users, route: '/team' },
    { label: 'Projects', icon: FolderKanban, route: '/projects' },
    { label: 'Reports', icon: FileText, route: '/reports' },
  ];
}
```

**Step 2: Add Tailwind Layout Template**

(In `main-layout.html`) Use Tailwind classes for a fixed sidebar and main content area.

**Step 3: Update Routes**

```typescript
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.ts').then((m) => m.DashboardComponent),
      },
    ],
  },
];
```

**Step 4: Commit**

```bash
git add src/app/shared/components/layout/ src/app/app.routes.ts
git commit -m "feat: scaffold main layout with sidebar"
```

---

### Task 4: Implement Dashboard Component & Stat Cards

**Files:**

- Create: `src/app/features/dashboard/dashboard.ts`
- Create: `src/app/features/dashboard/dashboard.html`

**Step 1: Implement Dashboard with Signals**

Inject `AnalyticsService` and bind the `metrics()` signal to the template.

**Step 2: Create Stat Card Components**

Iterate over metrics and display them in a grid using Tailwind.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/
git commit -m "feat: add dashboard shell and stat cards"
```

---

### Task 5: Integrate Workload Charts

**Files:**

- Modify: `src/app/features/dashboard/dashboard.ts`
- Modify: `src/app/app.config.ts`

**Step 1: Configure Chart.js in app.config**

Provide `provideCharts(withDefaultRegisterables())`.

**Step 2: Add Workload Bar Chart**

Use `BaseChartDirective` to render a bar chart of `teamMembers()` active tasks.

**Step 3: Commit**

```bash
git add src/app/features/dashboard/ src/app/app.config.ts
git commit -m "feat: integrate workload bar chart"
```

---

### Task 6: Add Team Status Table & Polish

**Files:**

- Modify: `src/app/features/dashboard/dashboard.html`

**Step 1: Add Team Table Widget**

Display a list of team members with status badges and progress indicators.

**Step 2: Final CSS Polish**

Ensure responsive behavior for mobile/tablet.

**Step 3: Commit**

```bash
git commit -am "feat: finalize dashboard with team table and polish"
```
