import { TestBed } from '@angular/core/testing';
import { KanbanService } from './kanban.service';

describe('KanbanService', () => {
  let service: KanbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default columns', () => {
    expect(service.columns().length).toBeGreaterThan(0);
  });

  it('should reorder task within same column', () => {
    const colId = service.columns()[0].id;
    const initialTasks = [...service.columns()[0].tasks];

    // Move first task to second position
    service.reorderTask(colId, 0, 1);

    const newTasks = service.columns()[0].tasks;
    expect(newTasks[0].id).toBe(initialTasks[1].id);
    expect(newTasks[1].id).toBe(initialTasks[0].id);
  });

  it('should move task between columns', () => {
    const fromColId = service.columns()[0].id;
    const toColId = service.columns()[1].id;
    const taskToMove = service.columns()[0].tasks[0];
    const initialFromCount = service.columns()[0].tasks.length;
    const initialToCount = service.columns()[1].tasks.length;

    service.moveTask(fromColId, toColId, 0, 0);

    const fromCol = service.columns().find((c) => c.id === fromColId)!;
    const toCol = service.columns().find((c) => c.id === toColId)!;

    expect(fromCol.tasks.length).toBe(initialFromCount - 1);
    expect(toCol.tasks.length).toBe(initialToCount + 1);
    expect(toCol.tasks[0].id).toBe(taskToMove.id);
  });
});
