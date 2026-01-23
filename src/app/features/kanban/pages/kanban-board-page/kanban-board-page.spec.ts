import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanBoardPage } from './kanban-board-page';
import { KanbanService } from '../../services/kanban.service';
import { signal } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { KanbanTask } from '../../models/kanban.models';
import { vi } from 'vitest';

describe('KanbanBoardPage', () => {
  let component: KanbanBoardPage;
  let fixture: ComponentFixture<KanbanBoardPage>;
  let kanbanServiceSpy: {
    columns: ReturnType<typeof signal>;
    reorderTask: ReturnType<typeof vi.fn>;
    moveTask: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    kanbanServiceSpy = {
      columns: signal([]),
      reorderTask: vi.fn(),
      moveTask: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [KanbanBoardPage],
      providers: [{ provide: KanbanService, useValue: kanbanServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle drop event (reorder in same column)', () => {
    const container = { id: 'todo' };
    const event = {
      previousContainer: container,
      container: container,
      previousIndex: 0,
      currentIndex: 1,
    } as unknown as CdkDragDrop<KanbanTask[]>;

    component.drop(event);

    expect(kanbanServiceSpy.reorderTask).toHaveBeenCalledWith('todo', 0, 1);
  });

  it('should handle drop event (move between columns)', () => {
    const event = {
      previousContainer: { id: 'todo' },
      container: { id: 'done' },
      previousIndex: 0,
      currentIndex: 0,
    } as unknown as CdkDragDrop<KanbanTask[]>;

    component.drop(event);

    expect(kanbanServiceSpy.moveTask).toHaveBeenCalledWith('todo', 'done', 0, 0);
  });
});
