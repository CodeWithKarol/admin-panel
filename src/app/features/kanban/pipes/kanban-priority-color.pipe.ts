import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kanbanPriorityColor',
})
export class KanbanPriorityColorPipe implements PipeTransform {
  transform(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  }
}
