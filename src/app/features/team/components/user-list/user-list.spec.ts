import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { signal, Signal } from '@angular/core';
import { TeamMember } from '../../../../core/models/analytics.models';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let mockAnalyticsService: {
    filteredMembers: Signal<TeamMember[]>;
    getMemberDossier: (m: TeamMember) => unknown;
  };

  let mockInspector: {
    open: (data: unknown, type: string) => void;
  };

  const mockMember: TeamMember = {
    id: '1',
    name: 'Operator 1',
    role: 'Architect',
    squad: 'AXON_CORE',
    status: 'online',
    avatar: '',
    specializations: [],
    activeTasks: 1,
    completedTasks: 10,
  };

  beforeEach(async () => {
    mockAnalyticsService = {
      filteredMembers: signal([mockMember]),
      getMemberDossier: vi.fn().mockReturnValue({ dossierId: 'D1' }),
    };

    mockInspector = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: InspectorService, useValue: mockInspector },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dossier in inspector', () => {
    component.openDossier(mockMember);
    expect(mockAnalyticsService.getMemberDossier).toHaveBeenCalledWith(mockMember);
    expect(mockInspector.open).toHaveBeenCalledWith({ dossierId: 'D1' }, 'user');
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('online')).toBe(
      'bg-accent-sage shadow-[0_0_8px_rgba(111,130,111,0.5)]',
    );
    expect(component.getStatusColor('offline')).toBe('bg-brand-300');
    expect(component.getStatusColor('unknown' as unknown as 'online')).toBe('bg-brand-200');
  });
});
