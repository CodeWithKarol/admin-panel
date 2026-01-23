import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventCategoryColor',
})
export class EventCategoryColorPipe implements PipeTransform {
  transform(category: string): string {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700';
      case 'personal':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700';
      case 'important':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
    }
  }
}
