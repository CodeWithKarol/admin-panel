import { Injectable, signal } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanColumn } from '../models/kanban.models';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  readonly columns = signal<KanbanColumn[]>([]);

  constructor() {
    this.initMockData();
  }

  // Handle reordering within the same column
  reorderTask(columnId: string, previousIndex: number, currentIndex: number) {
    this.columns.update((cols) => {
      const newCols = [...cols];
      const colIndex = newCols.findIndex((c) => c.id === columnId);
      if (colIndex > -1) {
        const newTasks = [...newCols[colIndex].tasks];
        moveItemInArray(newTasks, previousIndex, currentIndex);
        newCols[colIndex] = { ...newCols[colIndex], tasks: newTasks };
      }
      return newCols;
    });
  }

  // Handle moving task between columns
  moveTask(
    previousColumnId: string,
    currentColumnId: string,
    previousIndex: number,
    currentIndex: number,
  ) {
    this.columns.update((cols) => {
      const newCols = [...cols];
      const prevColIndex = newCols.findIndex((c) => c.id === previousColumnId);
      const currColIndex = newCols.findIndex((c) => c.id === currentColumnId);

      if (prevColIndex > -1 && currColIndex > -1) {
        const prevTasks = [...newCols[prevColIndex].tasks];
        const currTasks = [...newCols[currColIndex].tasks];

        transferArrayItem(prevTasks, currTasks, previousIndex, currentIndex);

        newCols[prevColIndex] = { ...newCols[prevColIndex], tasks: prevTasks };
        newCols[currColIndex] = { ...newCols[currColIndex], tasks: currTasks };
      }
      return newCols;
    });
  }

  private initMockData() {
    const mockColumns: KanbanColumn[] = [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          {
            id: '1',
            title: 'Research Competitors',
            description: 'Analyze top 3 competitors in the market.',
            priority: 'medium',
            tags: ['Research', 'Strategy'],
          },
          {
            id: '2',
            title: 'Draft Project Proposal',
            priority: 'high',
            tags: ['Documentation'],
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
          {
            id: '3',
            title: 'Design Home Page',
            description: 'Create high-fidelity mockups for desktop and mobile.',
            priority: 'high',
            tags: ['Design', 'UI/UX'],
          },
          {
            id: '4',
            title: 'Setup CI/CD Pipeline',
            priority: 'high',
            tags: ['DevOps'],
          },
        ],
      },
      {
        id: 'review',
        title: 'Review',
        tasks: [
          {
            id: '5',
            title: 'Write Unit Tests',
            description: 'Coverage should be above 80%.',
            priority: 'medium',
            tags: ['Development', 'Testing'],
          },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [
          {
            id: '6',
            title: 'Initial Kickoff Meeting',
            priority: 'low',
            tags: ['Meeting'],
          },
        ],
      },
    ];

    this.columns.set(mockColumns);
  }
}
