import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './data-table.models';
import {
  LucideAngularModule,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <div
      class="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700"
          >
            <tr>
              @if (selectable()) {
                <th class="px-6 py-3 w-4">
                  <input
                    type="checkbox"
                    [checked]="isAllSelected()"
                    (change)="toggleAll($event)"
                    class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                  />
                </th>
              }

              @for (col of columns(); track col.header) {
                <th
                  scope="col"
                  class="px-6 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  [class.cursor-pointer]="col.sortable"
                  [class.hover:bg-slate-100]="col.sortable"
                  [class.dark:hover:bg-slate-700]="col.sortable"
                  [style.width]="col.width"
                  (click)="col.sortable ? handleSort(col.key) : null"
                >
                  <div class="flex items-center gap-1">
                    {{ col.header }}
                    @if (sortColumn() === col.key) {
                      @if (sortDirection() === 'asc') {
                        <lucide-angular [img]="ChevronUp" class="w-4 h-4"></lucide-angular>
                      } @else {
                        <lucide-angular [img]="ChevronDown" class="w-4 h-4"></lucide-angular>
                      }
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @for (row of paginatedData(); track row) {
              <tr
                class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                (click)="onRowClick(row)"
              >
                @if (selectable()) {
                  <td class="px-6 py-4 w-4">
                    <input
                      type="checkbox"
                      [checked]="isSelected(row)"
                      (change)="toggleSelection(row); $event.stopPropagation()"
                      class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                    />
                  </td>
                }

                @for (col of columns(); track col.key) {
                  <td
                    class="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap"
                  >
                    @if (col.cellTemplate) {
                      <ng-container
                        *ngTemplateOutlet="
                          col.cellTemplate;
                          context: { $implicit: getValue(row, col.key), row: row }
                        "
                      ></ng-container>
                    } @else {
                      {{ getValue(row, col.key) }}
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td
                  [attr.colspan]="columns().length + (selectable() ? 1 : 0)"
                  class="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  <div class="flex flex-col items-center justify-center">
                    <lucide-angular [img]="Search" class="w-8 h-8 mb-2 opacity-50"></lucide-angular>
                    <p>No data found</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div
          class="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700"
        >
          <div class="text-sm text-slate-500 dark:text-slate-400">
            Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
            {{ Math.min(currentPage() * pageSize(), data().length) }} of {{ data().length }} entries
          </div>

          <div class="flex items-center gap-1">
            <button
              [disabled]="currentPage() === 1"
              (click)="setPage(currentPage() - 1)"
              class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular [img]="ChevronLeft" class="w-4 h-4"></lucide-angular>
            </button>

            @for (page of pageNumbers(); track $index) {
              @if (page === -1) {
                <span class="px-2 text-slate-400">...</span>
              } @else {
                <button
                  (click)="setPage(page)"
                  class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                  [class.bg-indigo-50]="currentPage() === page"
                  [class.text-indigo-600]="currentPage() === page"
                  [class.text-slate-600]="currentPage() !== page"
                  [class.hover:bg-slate-100]="currentPage() !== page"
                >
                  {{ page }}
                </button>
              }
            }

            <button
              [disabled]="currentPage() === totalPages()"
              (click)="setPage(currentPage() + 1)"
              class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular [img]="ChevronRight" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class DataTable<T> {
  // Inputs
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly pageSize = input(10);
  readonly selectable = input(false);

  // Model
  readonly selectedRows = model<T[]>([]);

  readonly rowClick = output<T>();
  // Icons
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly Search = Search;

  protected readonly Math = Math;

  // State
  sortColumn = signal<keyof T | string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);

  // Computed
  sortedData = computed(() => {
    const rawData = this.data();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) return rawData;

    return [...rawData].sort((a, b) => {
      const valA = (a as any)[column];
      const valB = (b as any)[column];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  paginatedData = computed(() => {
    const data = this.sortedData();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  });

  totalPages = computed(() => Math.ceil(this.data().length / this.pageSize()));

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;

    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift(-1);
    if (current + delta < total - 1) range.push(-1);

    const pages = [1];
    if (total > 1) {
      pages.push(...range, total);
    }
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    return pages;
  });

  getValue(row: T, key: string | keyof T): any {
    return (row as any)[key];
  }

  handleSort(key: keyof T | string | undefined) {
    if (!key) return;

    const currentColumn = this.sortColumn();
    const currentDirection = this.sortDirection();

    if (currentColumn === key) {
      if (currentDirection === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortColumn.set(null);
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  toggleSelection(row: T) {
    if (!this.selectable()) return;

    const current = this.selectedRows();
    const index = current.indexOf(row);

    let newVal: T[];
    if (index > -1) {
      newVal = current.filter((r) => r !== row);
    } else {
      newVal = [...current, row];
    }
    this.selectedRows.set(newVal);
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    let newVal: T[];
    if (checked) {
      newVal = [...this.paginatedData()];
    } else {
      newVal = [];
    }
    this.selectedRows.set(newVal);
  }

  isSelected(row: T): boolean {
    return this.selectedRows().includes(row);
  }

  isAllSelected(): boolean {
    const pageData = this.paginatedData();
    if (pageData.length === 0) return false;
    return pageData.every((row) => this.isSelected(row));
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }
}
