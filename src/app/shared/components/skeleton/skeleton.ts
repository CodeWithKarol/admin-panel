import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  imports: [CommonModule],
  template: `
    <div
      class="animate-pulse bg-slate-200 dark:bg-slate-700 rounded {{ className() }}"
      [style.width]="width()"
      [style.height]="height()"
    ></div>
  `,
})
export class Skeleton {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly className = input('');
}
