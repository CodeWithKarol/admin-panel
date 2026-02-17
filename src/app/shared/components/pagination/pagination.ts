import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      class="flex items-center justify-between border-t border-brand-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          (click)="onPageChange(currentPage() - 1)"
          [disabled]="currentPage() === 1"
          class="relative inline-flex items-center rounded-md border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          (click)="onPageChange(currentPage() + 1)"
          [disabled]="currentPage() === totalPages()"
          class="relative ml-3 inline-flex items-center rounded-md border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-xs text-brand-500 font-mono">
            Showing
            <span class="font-bold">{{ startItem() }}</span>
            to
            <span class="font-bold">{{ endItem() }}</span>
            of
            <span class="font-bold">{{ totalItems() }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              (click)="onPageChange(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-brand-400 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <lucide-icon [name]="ChevronLeft" class="h-4 w-4"></lucide-icon>
            </button>

            <!-- Simple Page Numbers -->
            @for (page of visiblePages(); track page) {
              <button
                (click)="onPageChange(page)"
                [ngClass]="{
                  'bg-brand-600 text-white hover:bg-brand-700': currentPage() === page,
                  'text-brand-900 hover:bg-brand-50': currentPage() !== page,
                }"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-brand-300 focus:z-20 focus:outline-offset-0"
              >
                {{ page }}
              </button>
            }

            <button
              (click)="onPageChange(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-brand-400 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <lucide-icon [name]="ChevronRight" class="h-4 w-4"></lucide-icon>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  currentPage = input.required<number>();
  itemsPerPage = input.required<number>();
  totalItems = input.required<number>();

  pageChange = output<number>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.itemsPerPage();
    return Math.min(end, this.totalItems());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift('...');
    }
    if (current + delta < total - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (total !== 1) {
      range.push(total);
    }

    // Filter out dots for simplicity in this version, just showing numbers around current
    // Or better, just show 5 pages around current
    // Let's do a simple slice for now
    const pages = [];
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
