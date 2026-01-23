import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LucideAngularModule, MoreHorizontal, Plus, GripVertical } from 'lucide-angular';
import { KanbanService } from '../../services/kanban.service';
import { KanbanTask } from '../../models/kanban.models';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { KanbanPriorityColorPipe } from '../../pipes/kanban-priority-color.pipe';

@Component({
  selector: 'app-kanban-board-page',
  imports: [DragDropModule, LucideAngularModule, HasRoleDirective, KanbanPriorityColorPipe],
  templateUrl: './kanban-board-page.html',
  styleUrl: './kanban-board-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardPage {
  private kanbanService = inject(KanbanService);

  readonly columns = this.kanbanService.columns;

  readonly MoreHorizontal = MoreHorizontal;
  readonly Plus = Plus;
  readonly GripVertical = GripVertical;

  drop(event: CdkDragDrop<KanbanTask[]>) {
    if (event.previousContainer === event.container) {
      const columnId = event.container.id;
      this.kanbanService.reorderTask(columnId, event.previousIndex, event.currentIndex);
    } else {
      const prevColId = event.previousContainer.id;
      const currColId = event.container.id;
      this.kanbanService.moveTask(prevColId, currColId, event.previousIndex, event.currentIndex);
    }
  }
}
