import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestoneTimelineComponent } from './milestone-timeline';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../../../core/services/milestone/milestone.service';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { signal, Signal } from '@angular/core';

describe('MilestoneTimelineComponent', () => {
  let component: MilestoneTimelineComponent;
  let fixture: ComponentFixture<MilestoneTimelineComponent>;
  let mockMilestoneService: { milestones: Signal<unknown[]> };
  let mockInspector: { open: (data: unknown, type: string) => void };

  beforeEach(async () => {
    mockMilestoneService = {
      milestones: signal([
        {
          id: '1',
          projectName: 'P1',
          startDate: new Date(2026, 1, 1),
          endDate: new Date(2026, 1, 5),
        },
      ]),
    };
    mockInspector = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MilestoneTimelineComponent],
      providers: [
        { provide: MilestoneService, useValue: mockMilestoneService },
        { provide: InspectorService, useValue: mockInspector },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should calculate offset correctly', () => {
    // Feb 14 is 50% of 28 days
    const date = new Date(2026, 1, 14);
    expect(component.getOffset(date)).toBe(50);
  });

  it('should calculate width correctly', () => {
    // 7 days is 25% of 28 days
    const start = new Date(2026, 1, 1);
    const end = new Date(2026, 1, 8);
    expect(component.getWidth(start, end)).toBe(25);
  });

  it('should open inspector for milestone', () => {
    const milestone = { id: '1' } as ProjectMilestone;
    component.openInspector(milestone);
    expect(mockInspector.open).toHaveBeenCalledWith(milestone, 'milestone');
  });
});
