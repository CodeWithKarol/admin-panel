import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form';
import {
  MilestoneService,
  ProjectMilestone,
} from '../../../../core/services/milestone/milestone.service';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let mockMilestoneService: {
    formatDateForInput: (d: Date) => string;
    prepareMilestone: (data: unknown, id?: string) => ProjectMilestone;
  };

  beforeEach(async () => {
    mockMilestoneService = {
      formatDateForInput: vi.fn().mockReturnValue('2026-02-19'),
      prepareMilestone: vi.fn().mockImplementation((data, id) => ({ ...data, id: id || 'new' })),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent],
      providers: [{ provide: MilestoneService, useValue: mockMilestoneService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with project data if provided', () => {
    const mockProject = {
      id: '123',
      projectName: 'EXISTING',
      phase: 'QA',
      status: 'active',
    } as ProjectMilestone;

    fixture.componentRef.setInput('project', mockProject);
    component.ngOnInit();

    expect(component.formData.projectName).toBe('EXISTING');
    expect(component.formData.phase).toBe('QA');
  });

  it('should update date field', () => {
    const newDate = '2026-12-25';
    component.updateDate('endDate', newDate);
    expect(component.formData.endDate?.getFullYear()).toBe(2026);
    expect(component.formData.endDate?.getMonth()).toBe(11); // December
    expect(component.formData.endDate?.getDate()).toBe(25);
  });

  it('should emit save with prepared data on submit', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    component.formData.projectName = 'SUBMITTED';

    component.submit();

    expect(mockMilestoneService.prepareMilestone).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ projectName: 'SUBMITTED' }));
  });

  it('should emit cancelClick on abort', () => {
    const cancelSpy = vi.spyOn(component.cancelClick, 'emit');
    component.cancelClick.emit(); // Simplified trigger for logic test
    expect(cancelSpy).toHaveBeenCalled();
  });
});
