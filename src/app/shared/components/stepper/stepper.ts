import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check } from 'lucide-angular';

export interface Step {
  label: string;
  description?: string;
}

@Component({
  selector: 'app-stepper',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav aria-label="Progress">
      <ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
        @for (step of steps(); track $index) {
          <li class="md:flex-1">
            <!-- Completed Step -->
            @if (isCompleted($index)) {
              <button
                type="button"
                class="group flex w-full text-left flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 cursor-pointer transition-colors bg-transparent"
                (click)="onStepClick($index)"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors"
                >
                  Step {{ $index + 1 }}
                </span>
                <span class="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{{
                  step.label
                }}</span>
              </button>
            }

            <!-- Current Step -->
            @else if (isCurrent($index)) {
              <div
                class="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                aria-current="step"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
                >
                  Step {{ $index + 1 }}
                </span>
                <span class="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{{
                  step.label
                }}</span>
              </div>
            }

            <!-- Pending Step -->
            @else {
              <div
                class="group flex flex-col border-l-4 border-slate-200 dark:border-slate-700 py-2 pl-4 hover:border-slate-300 dark:hover:border-slate-600 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 transition-colors"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
                >
                  Step {{ $index + 1 }}
                </span>
                <span
                  class="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 mt-0.5 transition-colors"
                  >{{ step.label }}</span
                >
              </div>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class Stepper {
  readonly steps = input.required<Step[]>();
  readonly currentStep = model.required<number>();
  readonly stepClick = output<number>();

  readonly Check = Check;

  isCompleted(index: number): boolean {
    return index < this.currentStep();
  }

  isCurrent(index: number): boolean {
    return index === this.currentStep();
  }

  isPending(index: number): boolean {
    return index > this.currentStep();
  }

  onStepClick(index: number) {
    if (index < this.currentStep()) {
      this.stepClick.emit(index);
      this.currentStep.set(index);
    }
  }
}
