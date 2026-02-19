import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../../../core/services/milestone/milestone.service';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let mockMilestoneService: { calculateProgress: (p: unknown) => number };

  beforeEach(async () => {
    mockMilestoneService = {
      calculateProgress: vi.fn().mockImplementation((p) => (p.id === '1' ? 50 : 0)),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [{ provide: MilestoneService, useValue: mockMilestoneService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('project', {
      id: '1',
      projectName: 'Test Project',
      status: 'active',
      phase: 'Development',
      missionStatement: 'Test Statement',
      endDate: new Date(),
    } as ProjectMilestone);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClick on click', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('[role="button"]');
    card.click();
    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('should calculate progress using MilestoneService', () => {
    expect(component.progress()).toBe(50);
    expect(mockMilestoneService.calculateProgress).toHaveBeenCalled();
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('active')).toBe(
      'bg-accent-sage shadow-[0_0_8px_rgba(111,130,111,0.6)]',
    );
    expect(component.getStatusColor('paused')).toBe('bg-brand-200');
    expect(component.getStatusColor('unknown' as unknown as 'active')).toBe('bg-brand-200');
  });
});
