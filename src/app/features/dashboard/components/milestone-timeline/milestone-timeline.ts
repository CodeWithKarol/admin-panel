import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneService, ProjectMilestone } from '../../../../core/services/milestone/milestone.service';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';

@Component({
  selector: 'app-milestone-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './milestone-timeline.html',
})
export class MilestoneTimelineComponent {
  private milestoneService = inject(MilestoneService);
  private inspector = inject(InspectorService);

  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;

  milestones = this.milestoneService.milestones;

  // We'll calculate the grid based on February 2026 for now
  daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  getOffset(date: Date): number {
    return (date.getDate() / 28) * 100;
  }

  getWidth(start: Date, end: Date): number {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return (diff / 28) * 100;
  }

  openInspector(project: ProjectMilestone) {
    this.inspector.open(project, 'milestone');
  }
}
